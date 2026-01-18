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
$subject = trim($data["subject"] ?? "");
$message = trim($data["message"] ?? "");

if ($subject === "" || $message === "") {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "Falta asunto o mensaje"]);
    exit;
}

$stmt = $conn->query("SELECT id_usuario, nombre, email FROM usuarios");
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

$logPath = __DIR__ . "/../php/emails_log.json";
$list = [];
if (file_exists($logPath)) {
    $content = file_get_contents($logPath);
    $decoded = json_decode($content, true);
    if (is_array($decoded)) $list = $decoded;
}

foreach ($usuarios as $u) {
    $list[] = [
        "id" => uniqid("email_", true),
        "user_id" => (int)$u["id_usuario"],
        "contact_id" => 0,
        "to_email" => $u["email"],
        "to_name" => $u["nombre"],
        "subject" => $subject,
        "message" => $message,
        "mode" => "admin_broadcast",
        "scheduled_at" => null,
        "sent_at" => date("c")
    ];
}

file_put_contents($logPath, json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);

$logAdmin = [
    "id" => uniqid("log_", true),
    "admin_id" => (int)$_SESSION["id_usuario"],
    "action" => "broadcast",
    "target_id" => 0,
    "created_at" => date("c")
];
$logFile = __DIR__ . "/admin_logs.json";
$adminList = [];
if (file_exists($logFile)) {
    $content = file_get_contents($logFile);
    $decoded = json_decode($content, true);
    if (is_array($decoded)) $adminList = $decoded;
}
$adminList[] = $logAdmin;
file_put_contents($logFile, json_encode($adminList, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);

echo json_encode(["ok" => true, "total" => count($usuarios)]);
