<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);

set_exception_handler(function($e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
});

set_error_handler(function($errno, $errstr) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $errstr]);
    exit;
});

session_start();
require_once("../php/conexion.php");

if (!isset($_SESSION["id_usuario"])) {
    http_response_code(403);
    echo json_encode(["success" => false, "error" => "No autenticado"]);
    exit;
}

$id_usuario = (int)$_SESSION["id_usuario"];

// =======================
// EDITAR contacto (PUT)
// =======================
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    $id = (int)($data['id'] ?? 0);
    $nombre = trim($data['nombre'] ?? '');
    $apellido = trim($data['apellido'] ?? '');
    $email = trim($data['email'] ?? '');
    $fecha_nacimiento = $data['fecha_nacimiento'] ?? null;

    if ($id > 0 && $nombre && $apellido && $email) {
        $sql = "UPDATE contactos
                SET nombre = :nombre,
                    apellido = :apellido,
                    email = :email,
                    fecha_nacimiento = :fecha_nacimiento
                WHERE id_contacto = :id AND id_usuario = :id_usuario";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":apellido", $apellido);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":fecha_nacimiento", $fecha_nacimiento);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);

        $ok = $stmt->execute();
        echo json_encode(["success" => (bool)$ok]);
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Datos inválidos"]);
    }
    exit;
}

// =======================
// ELIMINAR contacto (DELETE)
// =======================
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Eliminar todos
    if (!empty($data['eliminar_todos'])) {
        $delGustos = $conn->prepare("
            DELETE cg
            FROM contacto_gustos cg
            INNER JOIN contactos c ON cg.id_contacto = c.id_contacto
            WHERE c.id_usuario = :id_usuario
        ");
        $delGustos->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
        $delGustos->execute();

        $delCats = $conn->prepare("
            DELETE cc
            FROM contacto_categoria cc
            INNER JOIN contactos c ON cc.id_contacto = c.id_contacto
            WHERE c.id_usuario = :id_usuario
        ");
        $delCats->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
        $delCats->execute();

        $sql = "DELETE FROM contactos WHERE id_usuario = :id_usuario";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
        $ok = $stmt->execute();

        echo json_encode(["success" => (bool)$ok]);
        exit;
    }

    // Eliminar uno
    $id = (int)($data['id'] ?? 0);
    if ($id > 0) {
        $delGustos = $conn->prepare("
            DELETE cg
            FROM contacto_gustos cg
            INNER JOIN contactos c ON cg.id_contacto = c.id_contacto
            WHERE cg.id_contacto = :id AND c.id_usuario = :id_usuario
        ");
        $delGustos->bindParam(":id", $id, PDO::PARAM_INT);
        $delGustos->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
        $delGustos->execute();

        $delCats = $conn->prepare("
            DELETE cc
            FROM contacto_categoria cc
            INNER JOIN contactos c ON cc.id_contacto = c.id_contacto
            WHERE cc.id_contacto = :id AND c.id_usuario = :id_usuario
        ");
        $delCats->bindParam(":id", $id, PDO::PARAM_INT);
        $delCats->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
        $delCats->execute();

        $sql = "DELETE FROM contactos WHERE id_contacto = :id AND id_usuario = :id_usuario";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
        $ok = $stmt->execute();

        echo json_encode(["success" => (bool)$ok]);
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "ID inválido"]);
    }
    exit;
}

// =======================
// CREAR contacto (POST)
// =======================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $nombre = trim($data['nombre'] ?? '');
    $apellido = trim($data['apellido'] ?? '');
    $email = trim($data['email'] ?? '');
    $fecha_nacimiento = $data['fecha_nacimiento'] ?? null;

    if (!$nombre || !$apellido || !$email) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Faltan datos obligatorios"]);
        exit;
    }

    $sql = "INSERT INTO contactos (id_usuario, nombre, apellido, email, fecha_nacimiento, fecha_registro)
            VALUES (:id_usuario, :nombre, :apellido, :email, :fecha_nacimiento, NOW())";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
    $stmt->bindParam(":nombre", $nombre);
    $stmt->bindParam(":apellido", $apellido);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":fecha_nacimiento", $fecha_nacimiento);

    $ok = $stmt->execute();

    if ($ok) {
        $nuevoId = (int)$conn->lastInsertId();
        // ✅ IMPORTANTE para tu user.js: devolvemos id_contacto
        echo json_encode([
            "success" => true,
            "id_contacto" => $nuevoId
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "No se pudo guardar el contacto"]);
    }
    exit;
}

// =======================
// LISTAR contactos (GET)
// =======================
$sql = "SELECT c.id_contacto, c.nombre, c.apellido, c.email, c.fecha_nacimiento
        FROM contactos c
        WHERE c.id_usuario = :id_usuario";

$stmt = $conn->prepare($sql);
$stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
$stmt->execute();

$contactos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($contactos);
