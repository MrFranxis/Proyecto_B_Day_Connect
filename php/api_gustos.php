<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conexion.php';

try {
    if (!isset($_SESSION['id_usuario'])) {
        http_response_code(401);
        echo json_encode(['error' => 'No autenticado']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);
        $nombre = trim($data['nombre_gusto'] ?? '');

        if ($nombre === '') {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Falta nombre_gusto']);
            exit;
        }

        $stmt = $conn->prepare("SELECT id_gustos FROM gustos WHERE nombre_gusto = ? LIMIT 1");
        $stmt->execute([$nombre]);
        $existente = $stmt->fetchColumn();

        if ($existente) {
            echo json_encode(['ok' => true, 'id_gustos' => (int)$existente, 'nombre_gusto' => $nombre]);
            exit;
        }

        $ins = $conn->prepare("INSERT INTO gustos (nombre_gusto) VALUES (?)");
        $ins->execute([$nombre]);
        $nuevoId = (int)$conn->lastInsertId();
        echo json_encode(['ok' => true, 'id_gustos' => $nuevoId, 'nombre_gusto' => $nombre]);
        exit;
    }

    $stmt = $conn->prepare("
        SELECT MIN(id_gustos) AS id_gustos, nombre_gusto
        FROM gustos
        GROUP BY nombre_gusto
        ORDER BY nombre_gusto
    ");
    $stmt->execute();
    $gustos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($gustos);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al listar gustos']);
}
