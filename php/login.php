<<<<<<< HEAD
<?php
//login.php

session_start();
require_once("conexion.php");

if (!$conn) {
    die("Error: Conexión a la base de datos fallida.");
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    try {
        $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = :email");
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if($password == $user["password"]) {
                $_SESSION["id_usuario"] = $user["id_usuario"];
                $_SESSION["nombre"] = $user["nombre"];
                $_SESSION["rol"] = $user["id_rol"];

                if ($user["id_rol"] == 1) {
                    header("Location: ../admin/home_admin.php");
                } else {
                    header("Location: ../user/home_user.php");
                }
                exit;
            } else {
                echo "<script>alert('Contraseña incorrecta'); window.history.back();</script>";
            }
        } else {
            echo "<script>alert('Usuario no encontrado'); window.history.back();</script>";
        }
    } catch (PDOException $e) {
        echo "Error en la consulta: " . $e->getMessage();
    }
}
=======
<?php

session_start();
require_once("conexion.php");

if($_SERVER["REQUEST_METHOD"]==="POST"){
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    $stmt = $conn->prepare("Select * from usuarios where email = :email");
    $stmt -> bindParam(":email", $email);
    $stmt -> execute();

    if($stmt->rowCount() > 0){
        $user = $stmt-> fetch(PDO::FETCH_ASSOC);

        if(password_verify($password,$user["password"])){
            $_SESSION["id_usuario"] = $user["id_usuario"];
            $_SESSION["nombre"] = $user["nombre"];
            $_SESSION["rol"] = $user["id_rol"];

            if($user["id_rol"]== 1){
                header("Location: ../admin/home_admin.php");
            }else{
                header("Location: ../user/user.php");
            }
            exit;

        }else{
            echo "<script>alert('Contraseña incorrecta'); window.history.back();</script>";
        }
        }else{
             echo "<script>alert('Usuario no encontrado'); window.history.back();</script>";

        }

}


>>>>>>> c9a44ca (Se unifican  ramas, se actualiza dump)
?>