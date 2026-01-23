<?php
session_start();
require_once("../php/conexion.php");

if (!isset($_SESSION["id_usuario"]) || $_SESSION["rol"] != 1) {
    http_response_code(403);
    echo "Acceso no autorizado";
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
$hasReset = column_exists($conn, "usuarios", "reset_required");

$columns = ["id_usuario", "nombre", "email", "id_rol", "fecha_nacimiento", "fecha_registro"];
if ($hasEstado) $columns[] = "estado";
if ($hasReset) $columns[] = "reset_required";

$sql = "SELECT " . implode(", ", $columns) . " FROM usuarios";
$stmt = $conn->query($sql);
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

header("Content-Type: text/csv");
header("Content-Disposition: attachment; filename=usuarios_export.csv");

$out = fopen("php://output", "w");
fputcsv($out, $columns);
foreach ($usuarios as $u) {
    $row = [];
    foreach ($columns as $col) {
        $row[] = $u[$col] ?? "";
    }
    fputcsv($out, $row);
}
fclose($out);
