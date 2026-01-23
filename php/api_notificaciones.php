<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['id_usuario'])) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'No autenticado']);
    exit;
}

$userId = (int)$_SESSION['id_usuario'];
$logPath = __DIR__ . '/emails_log.json';

if (!file_exists($logPath)) {
    echo json_encode(['ok' => true, 'data' => []]);
    exit;
}

$content = file_get_contents($logPath);
if ($content === false || $content === '') {
    echo json_encode(['ok' => true, 'data' => []]);
    exit;
}

$decoded = json_decode($content, true);
if (!is_array($decoded)) {
    echo json_encode(['ok' => true, 'data' => []]);
    exit;
}

$items = array_values(array_filter($decoded, function ($item) use ($userId) {
    if (!is_array($item)) return false;
    if (($item['mode'] ?? '') !== 'admin_broadcast') return false;
    return (int)($item['user_id'] ?? 0) === $userId;
}));

usort($items, function ($a, $b) {
    $ta = strtotime($a['sent_at'] ?? '') ?: 0;
    $tb = strtotime($b['sent_at'] ?? '') ?: 0;
    return $tb <=> $ta;
});

$payload = array_map(function ($item) {
    return [
        'id' => $item['id'] ?? '',
        'subject' => $item['subject'] ?? '',
        'message' => $item['message'] ?? '',
        'sent_at' => $item['sent_at'] ?? ''
    ];
}, $items);

echo json_encode(['ok' => true, 'data' => $payload]);
