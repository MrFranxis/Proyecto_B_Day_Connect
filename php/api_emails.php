<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['id_usuario'])) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'No autenticado']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
$action = isset($data['action']) ? $data['action'] : '';

$logPath = __DIR__ . '/emails_log.json';
$queuePath = __DIR__ . '/email_queue.json';

function read_json_file($path) {
    if (!file_exists($path)) return [];
    $content = file_get_contents($path);
    if ($content === false || $content === '') return [];
    $decoded = json_decode($content, true);
    return is_array($decoded) ? $decoded : [];
}

function write_json_file($path, $data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    return file_put_contents($path, $json, LOCK_EX) !== false;
}

function append_json_item($path, $item) {
    $list = read_json_file($path);
    $list[] = $item;
    return write_json_file($path, $list);
}

function is_due($scheduledAt) {
    $ts = strtotime($scheduledAt);
    if ($ts === false) return false;
    return $ts <= time();
}

if ($action === 'send') {
    $toEmail = trim($data['to_email'] ?? '');
    $subject = trim($data['subject'] ?? '');
    $message = trim($data['message'] ?? '');

    if (!$toEmail || !$subject || !$message) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Datos incompletos']);
        exit;
    }

    $entry = [
        'id' => uniqid('email_', true),
        'user_id' => (int)$_SESSION['id_usuario'],
        'contact_id' => (int)($data['contact_id'] ?? 0),
        'to_email' => $toEmail,
        'to_name' => $data['to_name'] ?? '',
        'subject' => $subject,
        'message' => $message,
        'mode' => $data['mode'] ?? 'manual',
        'scheduled_at' => $data['scheduled_at'] ?? null,
        'sent_at' => date('c')
    ];

    if (!append_json_item($logPath, $entry)) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'No se pudo guardar el log']);
        exit;
    }

    echo json_encode(['ok' => true, 'log_id' => $entry['id']]);
    exit;
}

if ($action === 'queue') {
    $toEmail = trim($data['to_email'] ?? '');
    $subject = trim($data['subject'] ?? '');
    $message = trim($data['message'] ?? '');
    $scheduledAt = $data['scheduled_at'] ?? '';

    if (!$toEmail || !$subject || !$message || !$scheduledAt) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Datos incompletos']);
        exit;
    }

    $entry = [
        'id' => uniqid('queue_', true),
        'user_id' => (int)$_SESSION['id_usuario'],
        'contact_id' => (int)($data['contact_id'] ?? 0),
        'to_email' => $toEmail,
        'to_name' => $data['to_name'] ?? '',
        'subject' => $subject,
        'message' => $message,
        'mode' => $data['mode'] ?? 'programado',
        'scheduled_at' => $scheduledAt,
        'created_at' => date('c')
    ];

    if (!append_json_item($queuePath, $entry)) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'No se pudo programar']);
        exit;
    }

    echo json_encode(['ok' => true, 'queue_id' => $entry['id']]);
    exit;
}

if ($action === 'process') {
    $queue = read_json_file($queuePath);
    $pendientes = [];
    $procesados = 0;

    foreach ($queue as $item) {
        if (isset($item['scheduled_at']) && is_due($item['scheduled_at'])) {
            $logItem = $item;
            $logItem['sent_at'] = date('c');
            append_json_item($logPath, $logItem);
            $procesados++;
        } else {
            $pendientes[] = $item;
        }
    }

    write_json_file($queuePath, $pendientes);

    echo json_encode([
        'ok' => true,
        'procesados' => $procesados,
        'pendientes' => count($pendientes)
    ]);
    exit;
}

http_response_code(400);
echo json_encode(['ok' => false, 'error' => 'Accion no valida']);
