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
            SELECT MIN(ca.id_categoria) AS id_categoria
            FROM contacto_categoria cc
            INNER JOIN categorias ca ON cc.id_categoria = ca.id_categoria
            WHERE cc.id_contacto = ?
            GROUP BY ca.nombre_categoria
        ");
        $stmt->execute([$id_contacto]);
        $ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode(['id_contacto' => $id_contacto, 'categorias' => array_map('intval', $ids)]);
        exit;
    }

    if ($method === 'POST') {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        $id_contacto = isset($data['id_contacto']) ? (int)$data['id_contacto'] : 0;
        $categorias = isset($data['categorias']) && is_array($data['categorias']) ? $data['categorias'] : [];

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

       
        $categorias = array_values(array_unique(array_filter(array_map('intval', $categorias), fn($v) => $v > 0)));

       
        $conn->beginTransaction();

        $del = $conn->prepare("DELETE FROM contacto_categoria WHERE id_contacto = ?");
        $del->execute([$id_contacto]);

        if (count($categorias) > 0) {
            $ins = $conn->prepare("INSERT INTO contacto_categoria (id_contacto, id_categoria) VALUES (?, ?)");
            foreach ($categorias as $id_categoria) {
                $ins->execute([$id_contacto, $id_categoria]);
            }
        }

        $conn->commit();

        echo json_encode(['ok' => true, 'id_contacto' => $id_contacto, 'categorias' => $categorias]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error en categorías del contacto']);
}
