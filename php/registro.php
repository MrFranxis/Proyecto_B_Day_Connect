<?php
require_once("conexion.php");

// Verificar si se envió el formulario
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nombre = trim($_POST["nombre"]);
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);
    $fecha_nacimiento = $_POST["fecha_nacimiento"];

    // Encriptar la contraseña
    $hash_password = password_hash($password, PASSWORD_DEFAULT);

    // Rol por defecto: usuario normal (id_rol = 2)
    $id_rol = 2;

    // Preparar la consulta
    $sql = "INSERT INTO usuarios (nombre, email, password, id_rol, fecha_nacimiento, fecha_registro)
            VALUES (:nombre, :email, :password, :id_rol, :fecha_nacimiento, NOW())";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":nombre", $nombre);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":password", $hash_password);
    $stmt->bindParam(":id_rol", $id_rol);
    $stmt->bindParam(":fecha_nacimiento", $fecha_nacimiento);

    if ($stmt->execute()) {
        echo "<script>
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                window.location.href = '../index.php';
              </script>";
    } else {
        echo "<script>
                alert('Error al registrar el usuario.');
                window.history.back();
              </script>";
    }
}
?>
