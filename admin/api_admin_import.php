<?php
session_start();
require_once("../php/conexion.php");

if (!isset($_SESSION["id_usuario"]) || $_SESSION["rol"] != 1) {
    http_response_code(403);
    echo json_encode(["ok" => false, "error" => "Acceso no autorizado"]);
    exit;
}

if (!isset($_FILES["file"])) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "Falta archivo"]);
    exit;
}

function column_exists(PDO $conn, string $table, string $column): bool {
    $sql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table AND COLUMN_NAME = :column";
    $stmt = $conn->prepare($sql);
    $stmt->execute([":table" => $table, ":column" => $column]);
    return (int)$stmt->fetchColumn() > 0;
}

$hasEstado = column_exists($conn, "usuarios", "estado");

$tmp = $_FILES["file"]["tmp_name"];
$handle = fopen($tmp, "r");
if ($handle === false) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "No se pudo leer el archivo"]);
    exit;
}

$headers = fgetcsv($handle);
if (!$headers) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "CSV vacio"]);
    exit;
}

$map = array_flip($headers);
$required = ["nombre", "email", "password", "fecha_nacimiento", "id_rol"];
foreach ($required as $r) {
    if (!isset($map[$r])) {
        http_response_code(400);
        echo json_encode(["ok" => false, "error" => "Falta columna $r"]);
        exit;
    }
}

$inserted = 0;
$skipped = 0;

while (($row = fgetcsv($handle)) !== false) {
    $nombre = trim($row[$map["nombre"]] ?? "");
    $email = trim($row[$map["email"]] ?? "");
    $password = $row[$map["password"]] ?? "";
    $fecha = $row[$map["fecha_nacimiento"]] ?? null;
    $rol = (int)($row[$map["id_rol"]] ?? 2);
    $estado = $hasEstado ? ($row[$map["estado"]] ?? "activo") : null;

    if ($nombre === "" || $email === "" || $password === "" || !$fecha) {
        $skipped++;
        continue;
    }

    $stmt = $conn->prepare("SELECT id_usuario FROM usuarios WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    if ($stmt->fetchColumn()) {
        $skipped++;
        continue;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    if ($hasEstado) {
        $sql = "INSERT INTO usuarios (nombre, email, password, fecha_nacimiento, id_rol, estado)
                VALUES (:nombre, :email, :password, :fecha, :rol, :estado)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":nombre" => $nombre,
            ":email" => $email,
            ":password" => $hash,
            ":fecha" => $fecha,
            ":rol" => $rol,
            ":estado" => $estado
        ]);
    } else {
        $sql = "INSERT INTO usuarios (nombre, email, password, fecha_nacimiento, id_rol)
                VALUES (:nombre, :email, :password, :fecha, :rol)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":nombre" => $nombre,
            ":email" => $email,
            ":password" => $hash,
            ":fecha" => $fecha,
            ":rol" => $rol
        ]);
    }
    $inserted++;
}

fclose($handle);

echo json_encode(["ok" => true, "inserted" => $inserted, "skipped" => $skipped]);
