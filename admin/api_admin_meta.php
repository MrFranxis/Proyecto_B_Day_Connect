<?php
session_start();
require_once("../php/conexion.php");

if (!isset($_SESSION["id_usuario"]) || $_SESSION["rol"] != 1) {
    http_response_code(403);
    echo json_encode(["ok" => false, "error" => "Acceso no autorizado"]);
    exit;
}

$tipo = $_GET["tipo"] ?? "";
$method = $_SERVER["REQUEST_METHOD"];

if (!in_array($tipo, ["categoria", "gusto"], true)) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "Tipo invalido"]);
    exit;
}

try {
    if ($method === "GET") {
        if ($tipo === "categoria") {
            $stmt = $conn->query("SELECT MIN(id_categoria) AS id, nombre_categoria AS nombre FROM categorias GROUP BY nombre_categoria ORDER BY nombre_categoria");
        } else {
            $stmt = $conn->query("SELECT MIN(id_gustos) AS id, nombre_gusto AS nombre FROM gustos GROUP BY nombre_gusto ORDER BY nombre_gusto");
        }
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["ok" => true, "items" => $data]);
        exit;
    }

    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);
    $nombre = trim($data["nombre"] ?? "");
    $id = isset($data["id"]) ? (int)$data["id"] : 0;

    if ($method === "POST") {
        if ($nombre === "") {
            http_response_code(400);
            echo json_encode(["ok" => false, "error" => "Falta nombre"]);
            exit;
        }

        if ($tipo === "categoria") {
            $stmt = $conn->prepare("SELECT id_categoria FROM categorias WHERE nombre_categoria = ? LIMIT 1");
            $stmt->execute([$nombre]);
            $exist = $stmt->fetchColumn();
            if ($exist) {
                echo json_encode(["ok" => true, "id" => (int)$exist, "nombre" => $nombre]);
                exit;
            }
            $ins = $conn->prepare("INSERT INTO categorias (nombre_categoria) VALUES (?)");
            $ins->execute([$nombre]);
            echo json_encode(["ok" => true, "id" => (int)$conn->lastInsertId(), "nombre" => $nombre]);
        } else {
            $stmt = $conn->prepare("SELECT id_gustos FROM gustos WHERE nombre_gusto = ? LIMIT 1");
            $stmt->execute([$nombre]);
            $exist = $stmt->fetchColumn();
            if ($exist) {
                echo json_encode(["ok" => true, "id" => (int)$exist, "nombre" => $nombre]);
                exit;
            }
            $ins = $conn->prepare("INSERT INTO gustos (nombre_gusto) VALUES (?)");
            $ins->execute([$nombre]);
            echo json_encode(["ok" => true, "id" => (int)$conn->lastInsertId(), "nombre" => $nombre]);
        }
        exit;
    }

    if ($method === "DELETE") {
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["ok" => false, "error" => "Falta id"]);
            exit;
        }

        if ($tipo === "categoria") {
            $delRel = $conn->prepare("DELETE FROM contacto_categoria WHERE id_categoria = ?");
            $delRel->execute([$id]);
            $del = $conn->prepare("DELETE FROM categorias WHERE id_categoria = ?");
            $del->execute([$id]);
        } else {
            $delRel = $conn->prepare("DELETE FROM contacto_gustos WHERE id_gustos = ?");
            $delRel->execute([$id]);
            $del = $conn->prepare("DELETE FROM gustos WHERE id_gustos = ?");
            $del->execute([$id]);
        }
        echo json_encode(["ok" => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["ok" => false, "error" => "Metodo no permitido"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => "Error en metadata"]);
}
