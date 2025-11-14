<?php
header('Content-Type: application/json');
ini_set('display_errors', 0);
set_exception_handler(function($e) {
    echo json_encode(['error' => $e->getMessage()]);
    exit;
});
set_error_handler(function($errno, $errstr) {
    echo json_encode(['error' => $errstr]);
    exit;
});

session_start();
require_once("../php/conexion.php");

if (!isset($_SESSION["id_usuario"])) {
    http_response_code(403);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$id_usuario = $_SESSION["id_usuario"];

// Editar contacto por id (PUT)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = intval($data['id'] ?? 0);
    $nombre = trim($data['nombre'] ?? '');
    $apellido = trim($data['apellido'] ?? '');
    $email = trim($data['email'] ?? '');
    $fecha_nacimiento = $data['fecha_nacimiento'] ?? null;
    if ($id > 0 && $nombre && $apellido && $email) {
        $sql = "UPDATE contactos SET nombre = :nombre, apellido = :apellido, email = :email, fecha_nacimiento = :fecha_nacimiento WHERE id_contacto = :id AND id_usuario = :id_usuario";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":apellido", $apellido);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":fecha_nacimiento", $fecha_nacimiento);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
        $ok = $stmt->execute();
        echo json_encode(["success" => $ok]);
    } else {
        echo json_encode(["error" => "Datos inválidos"]);
    }
    exit;
}

// Eliminar contacto por id o todos los contactos (DELETE)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!empty($data['eliminar_todos'])) {
        // Eliminar todos los contactos del usuario
        $sql = "DELETE FROM contactos WHERE id_usuario = :id_usuario";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
        $ok = $stmt->execute();
        echo json_encode(["success" => $ok]);
        exit;
    }
    $id = intval($data['id'] ?? 0);
    if ($id > 0) {
        $sql = "DELETE FROM contactos WHERE id_contacto = :id AND id_usuario = :id_usuario";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
        $ok = $stmt->execute();
        echo json_encode(["success" => $ok]);
    } else {
        echo json_encode(["error" => "ID inválido"]);
    }
    exit;
}

// Si es POST, guardar contacto
$data = json_decode(file_get_contents('php://input'), true);
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $data) {
    $nombre = trim($data['nombre'] ?? '');
    $apellido = trim($data['apellido'] ?? '');
    $email = trim($data['email'] ?? '');
    $fecha_nacimiento = $data['fecha_nacimiento'] ?? null;

    if (!$nombre || !$apellido || !$email) {
        echo json_encode(["error" => "Faltan datos obligatorios"]);
        exit;
    }

    $sql = "INSERT INTO contactos (id_usuario, nombre, apellido, email, fecha_nacimiento, fecha_registro) VALUES (:id_usuario, :nombre, :apellido, :email, :fecha_nacimiento, NOW())";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
    $stmt->bindParam(":nombre", $nombre);
    $stmt->bindParam(":apellido", $apellido);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":fecha_nacimiento", $fecha_nacimiento);
    $ok = $stmt->execute();
    if ($ok) {
        echo json_encode(["success" => true, "id" => $conn->lastInsertId()]);
    } else {
        echo json_encode(["error" => "No se pudo guardar el contacto"]);
    }
    exit;
}

// Obtener contactos reales del usuario
$sql = "SELECT c.id_contacto, c.nombre, c.apellido, c.email, c.fecha_nacimiento FROM contactos c WHERE c.id_usuario = :id_usuario";
$stmt = $conn->prepare($sql);
$stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
$stmt->execute();
$contactos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($contactos);
