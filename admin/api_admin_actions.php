<?php
session_start();
require_once("../php/conexion.php");

if (!isset($_SESSION["id_usuario"]) || $_SESSION["rol"] != 1) {
    http_response_code(403);
    echo json_encode(["ok" => false, "error" => "Acceso no autorizado"]);
    exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);
$action = $data["accion"] ?? "";
$id = isset($data["id"]) ? (int)$data["id"] : 0;

$logPath = __DIR__ . "/admin_logs.json";

function write_log($path, $entry) {
    $list = [];
    if (file_exists($path)) {
        $content = file_get_contents($path);
        $decoded = json_decode($content, true);
        if (is_array($decoded)) $list = $decoded;
    }
    $list[] = $entry;
    file_put_contents($path, json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
}

function column_exists(PDO $conn, string $table, string $column): bool {
    $sql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table AND COLUMN_NAME = :column";
    $stmt = $conn->prepare($sql);
    $stmt->execute([":table" => $table, ":column" => $column]);
    return (int)$stmt->fetchColumn() > 0;
}

function ensure_columns(PDO $conn) {
    if (!column_exists($conn, "usuarios", "estado")) {
        $conn->exec("ALTER TABLE usuarios ADD COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'activo'");
    }
    if (!column_exists($conn, "usuarios", "reset_required")) {
        $conn->exec("ALTER TABLE usuarios ADD COLUMN reset_required TINYINT(1) NOT NULL DEFAULT 0");
    }
}

if (!$action || $id <= 0) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "Parametros invalidos"]);
    exit;
}

if ($id === (int)$_SESSION["id_usuario"] && in_array($action, ["eliminar", "degradar", "bloquear"], true)) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "No puedes aplicar esa accion a tu usuario"]);
    exit;
}

try {
    ensure_columns($conn);

    switch ($action) {
        case "eliminar":
            $stmt = $conn->prepare("DELETE FROM usuarios WHERE id_usuario = :id");
            $stmt->execute([":id" => $id]);
            break;
        case "ascender":
            $stmt = $conn->prepare("UPDATE usuarios SET id_rol = 1 WHERE id_usuario = :id");
            $stmt->execute([":id" => $id]);
            break;
        case "degradar":
            $stmt = $conn->prepare("UPDATE usuarios SET id_rol = 2 WHERE id_usuario = :id");
            $stmt->execute([":id" => $id]);
            break;
        case "bloquear":
            $stmt = $conn->prepare("UPDATE usuarios SET estado = 'bloqueado' WHERE id_usuario = :id");
            $stmt->execute([":id" => $id]);
            break;
        case "desbloquear":
            $stmt = $conn->prepare("UPDATE usuarios SET estado = 'activo' WHERE id_usuario = :id");
            $stmt->execute([":id" => $id]);
            break;
        case "reset":
            $temp = substr(bin2hex(random_bytes(6)), 0, 12);
            $hash = password_hash($temp, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE usuarios SET password = :pass, reset_required = 1 WHERE id_usuario = :id");
            $stmt->execute([":pass" => $hash, ":id" => $id]);
            echo json_encode(["ok" => true, "temp_password" => $temp]);
            $entry = [
                "id" => uniqid("log_", true),
                "admin_id" => (int)$_SESSION["id_usuario"],
                "action" => $action,
                "target_id" => $id,
                "created_at" => date("c")
            ];
            write_log($logPath, $entry);
            exit;
        default:
            http_response_code(400);
            echo json_encode(["ok" => false, "error" => "Accion no valida"]);
            exit;
    }

    $entry = [
        "id" => uniqid("log_", true),
        "admin_id" => (int)$_SESSION["id_usuario"],
        "action" => $action,
        "target_id" => $id,
        "created_at" => date("c")
    ];
    write_log($logPath, $entry);

    echo json_encode(["ok" => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => "Error en la accion"]);
}
