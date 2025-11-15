<?php
session_start();
require_once("../php/conexion.php");

if (!isset($_SESSION["id_usuario"]) || $_SESSION["rol"] != 1) {
    http_response_code(403);
    echo json_encode(["error" => "Acceso no autorizado"]);
    exit;
}

$tipo = $_GET["tipo"] ?? "todos";
$fecha = $_GET["fecha"] ?? null;

$sqlBase = "SELECT id_usuario, nombre, email, id_rol,
            fecha_nacimiento, fecha_registro,
            CASE WHEN id_rol = 1 THEN 'Admin' ELSE 'Usuario' END AS rol
            FROM usuarios";

switch ($tipo) {
    case "admin":
        $sql = $sqlBase . " WHERE id_rol = 1";
        break;
    case "usuario":
        $sql = $sqlBase . " WHERE id_rol = 2";
        break;
    case "fecha":
        if ($fecha) {
            $sql = $sqlBase . " WHERE fecha_nacimiento = :fecha";
        } else {
            echo json_encode(["error" => "No se recibió fecha"]);
            exit;
        }
        break;
    default:
        $sql = $sqlBase;
}

$stmt = $conn->prepare($sql);

if ($tipo === "fecha") {
    $stmt->bindParam(":fecha", $fecha);
}

$stmt->execute();
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

header("Content-Type: application/json");
echo json_encode($usuarios);
?>
