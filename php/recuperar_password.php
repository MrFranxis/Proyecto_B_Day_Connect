<?php
require_once("conexion.php");
session_start();

if($_SERVER["REQUEST_METHOD"]==="POST"){
    $email = trim($_POST["email"]);

    $stmt = $conn->prepare("Select * FROM usuarios WHERE email =:email");
    $stmt -> bindParam(":email", $email);
    $stmt -> execute();

    if($stmt->rowCount()>0){
        $user = $stmt -> fetch (PDO::FETCH_ASSOC);
        $_SESSION["reset_user_id"]=$user["id_usuario"];
        header("Location: ../includes/html/restablecer_password.html");
        exit;
    } else {

        echo "<script>alert('No existe ningún usuario con ese correo.'); window.history.back();</script>";

    }
}


?>