
<?php
$servidor = "localhost";
$usuario = "root";
$pass = "";
$database = "B_Day_Connect";

$sqlFile = __DIR__ . "/../database/data12112025.sql";

try {
    $conn = new PDO("mysql:host=$servidor", $usuario, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar si la base de datos ya existe
    $stmt = $conn->query("SHOW DATABASES LIKE '$database'");
    if ($stmt->rowCount() == 0) {
        $conn->exec("CREATE DATABASE `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
        $conn = new PDO("mysql:host=$servidor;dbname=$database", $usuario, $pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        if (file_exists($sqlFile)) {
            $sql = file_get_contents($sqlFile);
            $conn->exec($sql);
        }
    } else {
        $conn = new PDO("mysql:host=$servidor;dbname=$database", $usuario, $pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>
