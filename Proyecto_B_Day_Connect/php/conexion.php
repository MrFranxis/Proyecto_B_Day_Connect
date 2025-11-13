<?php
// conexion.php
$servidor = "localhost";
$puerto = "3307";        // Puerto de XAMPP
$usuario = "root";
$pass = "";              // Sin contraseña
$database = "B_day_connect";

try {
    $conn = new PDO("mysql:host=$servidor;port=$puerto;dbname=$database", $usuario, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $error) {
    echo "Error en la conexión: " . $error->getMessage();
    $conn = null;
}
?>