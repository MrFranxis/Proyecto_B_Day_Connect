<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conexion.php';

function require_login() {
    if (!isset($_SESSION['id_usuario'])) {
        http_response_code(401);
        echo json_encode(['error' => 'No autenticado']);
        exit;
    }
}

function contacto_es_del_usuario(PDO $conn, int $id_contacto, int $id_usuario): bool {
    $stmt = $conn->prepare("SELECT 1 FROM contactos WHERE id_contacto = ? AND id_usuario = ? LIMIT 1");
    $stmt->execute([$id_contacto, $id_usuario]);
    return (bool)$stmt->fetchColumn();
}

require_login();
$id_usuario = (int)$_SESSION['id_usuario'];

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $id_contacto = isset($_GET['id_contacto']) ? (int)$_GET['id_contacto'] : 0;
        if ($id_contacto <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta id_contacto']);
            exit;
        }

        if (!contacto_es_del_usuario($conn, $id_contacto, $id_usuario)) {
            http_response_code(403);
            echo json_encode(['error' => 'No tienes permiso sobre este contacto']);
            exit;
        }

        $stmt = $conn->prepare("
            SELECT MIN(g.id_gustos) AS id_gustos
            FROM contacto_gustos cg
            INNER JOIN gustos g ON cg.id_gustos = g.id_gustos
            WHERE cg.id_contacto = ?
            GROUP BY g.nombre_gusto
        ");
        $stmt->execute([$id_contacto]);
        $ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode(['id_contacto' => $id_contacto, 'gustos' => array_map('intval', $ids)]);
        exit;
    }

    if ($method === 'POST') {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        $id_contacto = isset($data['id_contacto']) ? (int)$data['id_contacto'] : 0;
        $gustos = isset($data['gustos']) && is_array($data['gustos']) ? $data['gustos'] : [];

        if ($id_contacto <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta id_contacto']);
            exit;
        }

        if (!contacto_es_del_usuario($conn, $id_contacto, $id_usuario)) {
            http_response_code(403);
            echo json_encode(['error' => 'No tienes permiso sobre este contacto']);
            exit;
        }

        $gustos = array_values(array_unique(array_filter(array_map('intval', $gustos), fn($v) => $v > 0)));

        $conn->beginTransaction();

        $del = $conn->prepare("DELETE FROM contacto_gustos WHERE id_contacto = ?");
        $del->execute([$id_contacto]);

        if (count($gustos) > 0) {
            $ins = $conn->prepare("INSERT INTO contacto_gustos (id_contacto, id_gustos) VALUES (?, ?)");
            foreach ($gustos as $id_gustos) {
                $ins->execute([$id_contacto, $id_gustos]);
            }
        }

        $conn->commit();

        echo json_encode(['ok' => true, 'id_contacto' => $id_contacto, 'gustos' => $gustos]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error en gustos del contacto']);
}
