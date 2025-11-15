<?php
session_start();
require_once("../php/conexion.php");

if (!isset($_SESSION["id_usuario"]) || $_SESSION["rol"] != 1) {
    http_response_code(403);
    echo json_encode(["error" => "Acceso no autorizado"]);
    exit;
}

$tipo = $_GET["tipo"] ?? "todos";

switch ($tipo) {
    case "admin":
        $sql = "SELECT * FROM usuarios WHERE id_rol = 1";
        break;
    case "usuario":
        $sql = "SELECT * FROM usuarios WHERE id_rol = 2";
        break;
    default:
        $sql = "SELECT * FROM usuarios";
}

$stmt = $conn->query($sql);
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

header("Content-Type: application/json");
echo json_encode($usuarios);