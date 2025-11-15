<?php
// conexion.php

$servidor = "localhost";
$puerto = "3307";
$usuario = "root";
$pass = "";
$database = "b_day_connect";

$sqlFile = __DIR__ . "/../database/data12112025.sql";

try {

    $conn = new PDO("mysql:host=$servidor;port=$puerto", $usuario, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->query("SHOW DATABASES LIKE '$database'");
    if ($stmt->rowCount() == 0) {
        
        $conn->exec("CREATE DATABASE `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");

        $conn = new PDO("mysql:host=$servidor;port=$puerto;dbname=$database", $usuario, $pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        if (file_exists($sqlFile)) {
            $sql = file_get_contents($sqlFile);
            $conn->exec($sql);
        }
    } else {
        $conn = new PDO("mysql:host=$servidor;port=$puerto;dbname=$database", $usuario, $pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

} catch (PDOException $e) {
    echo "❌ Error en la conexión: " . $e->getMessage();
    $conn = null;
}
?>