<?php
// conexion.php

$servidor = "localhost";
$puerto = "3307"; // Puerto de XAMPP
$usuario = "root";
$pass = "";
$database = "B_day_connect";

// Ruta del archivo SQL con los datos iniciales
$sqlFile = __DIR__ . "/../database/data12112025.sql";

try {
    // Primero conectamos sin base de datos
    $conn = new PDO("mysql:host=$servidor;port=$puerto", $usuario, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar si la base de datos ya existe
    $stmt = $conn->query("SHOW DATABASES LIKE '$database'");
    if ($stmt->rowCount() == 0) {
        // Crear la base de datos si no existe
        $conn->exec("CREATE DATABASE `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");

        // Reconectar usando la nueva base
        $conn = new PDO("mysql:host=$servidor;port=$puerto;dbname=$database", $usuario, $pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Si existe el archivo SQL, lo ejecutamos
        if (file_exists($sqlFile)) {
            $sql = file_get_contents($sqlFile);
            $conn->exec($sql);
        }
    } else {
        // Si ya existe, simplemente conectamos
        $conn = new PDO("mysql:host=$servidor;port=$puerto;dbname=$database", $usuario, $pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

} catch (PDOException $e) {
    echo "❌ Error en la conexión: " . $e->getMessage();
    $conn = null;
}
?>