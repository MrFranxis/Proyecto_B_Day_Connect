<?php
session_start();
require_once("../php/conexion.php");

if (!isset($_SESSION["id_usuario"]) || $_SESSION["rol"] != 1) {
    http_response_code(403);
    echo json_encode(["error" => "Acceso no autorizado"]);
    exit;
}

$tipo = $_GET["tipo"] ?? "todos";
$search = trim($_GET["q"] ?? "");
$desde = trim($_GET["desde"] ?? "");
$hasta = trim($_GET["hasta"] ?? "");
$estado = trim($_GET["estado"] ?? "");

function column_exists(PDO $conn, string $table, string $column): bool {
    $sql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table AND COLUMN_NAME = :column";
    $stmt = $conn->prepare($sql);
    $stmt->execute([":table" => $table, ":column" => $column]);
    return (int)$stmt->fetchColumn() > 0;
}

$where = [];
$params = [];

if ($tipo === "admin") {
    $where[] = "id_rol = 1";
} elseif ($tipo === "usuario") {
    $where[] = "id_rol = 2";
}

if ($search !== "") {
    $where[] = "(nombre LIKE :q OR email LIKE :q)";
    $params[":q"] = "%" . $search . "%";
}

if ($desde !== "") {
    $where[] = "fecha_registro >= :desde";
    $params[":desde"] = $desde . " 00:00:00";
}

if ($hasta !== "") {
    $where[] = "fecha_registro <= :hasta";
    $params[":hasta"] = $hasta . " 23:59:59";
}

$hasEstado = column_exists($conn, "usuarios", "estado");
if ($hasEstado && $estado !== "") {
    $where[] = "estado = :estado";
    $params[":estado"] = $estado;
}

$sql = "SELECT * FROM usuarios";
if (!empty($where)) {
    $sql .= " WHERE " . implode(" AND ", $where);
}

$stmt = $conn->prepare($sql);
$stmt->execute($params);
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

header("Content-Type: application/json");
echo json_encode($usuarios);
