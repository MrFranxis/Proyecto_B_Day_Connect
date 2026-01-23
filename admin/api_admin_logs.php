<?php
session_start();

if (!isset($_SESSION["id_usuario"]) || $_SESSION["rol"] != 1) {
    http_response_code(403);
    echo json_encode(["error" => "Acceso no autorizado"]);
    exit;
}

$logPath = __DIR__ . "/admin_logs.json";

function read_json_file($path) {
    if (!file_exists($path)) return [];
    $content = file_get_contents($path);
    if ($content === false || $content === "") return [];
    $decoded = json_decode($content, true);
    return is_array($decoded) ? $decoded : [];
}

header("Content-Type: application/json");
echo json_encode(read_json_file($logPath));
