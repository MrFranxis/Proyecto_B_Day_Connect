<?php
session_start();
require_once("../php/conexion.php");

if (!isset($_SESSION["id_usuario"]) || $_SESSION["rol"] != 1) {
    http_response_code(403);
    echo json_encode(["error" => "Acceso no autorizado"]);
    exit;
}

function column_exists(PDO $conn, string $table, string $column): bool {
    $sql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table AND COLUMN_NAME = :column";
    $stmt = $conn->prepare($sql);
    $stmt->execute([":table" => $table, ":column" => $column]);
    return (int)$stmt->fetchColumn() > 0;
}

try {
    $stats = [
        "total_usuarios" => 0,
        "total_admins" => 0,
        "total_normales" => 0,
        "total_bloqueados" => 0,
        "total_categorias" => 0,
        "total_gustos" => 0
    ];

    $stats["total_usuarios"] = (int)$conn->query("SELECT COUNT(*) FROM usuarios")->fetchColumn();
    $stats["total_admins"] = (int)$conn->query("SELECT COUNT(*) FROM usuarios WHERE id_rol = 1")->fetchColumn();
    $stats["total_normales"] = (int)$conn->query("SELECT COUNT(*) FROM usuarios WHERE id_rol = 2")->fetchColumn();

    if (column_exists($conn, "usuarios", "estado")) {
        $stats["total_bloqueados"] = (int)$conn->query("SELECT COUNT(*) FROM usuarios WHERE estado = 'bloqueado'")->fetchColumn();
    }

    $stats["total_categorias"] = (int)$conn->query("SELECT COUNT(DISTINCT nombre_categoria) FROM categorias")->fetchColumn();
    $stats["total_gustos"] = (int)$conn->query("SELECT COUNT(DISTINCT nombre_gusto) FROM gustos")->fetchColumn();

    header("Content-Type: application/json");
    echo json_encode($stats);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al cargar estadisticas"]);
}
