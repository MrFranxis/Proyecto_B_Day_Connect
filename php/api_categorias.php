<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conexion.php';

try {
    // Opcional: puedes exigir login si quieres
    if (!isset($_SESSION['id_usuario'])) {
        http_response_code(401);
        echo json_encode(['error' => 'No autenticado']);
        exit;
    }

    $stmt = $conn->prepare("
        SELECT MIN(id_categoria) AS id_categoria, nombre_categoria
        FROM categorias
        GROUP BY nombre_categoria
        ORDER BY nombre_categoria
    ");
    $stmt->execute();
    $cats = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($cats);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al listar categorías']);
}
