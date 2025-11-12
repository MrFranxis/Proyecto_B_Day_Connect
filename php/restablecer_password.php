<?php
require_once("conexion.php");
session_start();

if($_SERVER["REQUEST_METHOD"]=== "POST"){
    if(!isset($_SESSION["reset_user_id"])){
        echo "<script>alert('Sesion invalida.'); window.location='../index.php',</script>";
        exit;
    }

    $id_usuario = $_SESSION["reset_user_id"];
    $password = trim($_POST["password"]);
    $confirmar = trim($_POST["confirmar"]);

    if($password !== $confirmar){
        echo "<script>alert('Las contraseñas no coinciden'); window.history.back();</script>";
        exit;
    }

    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn -> prepare("UPDATE usuarios SET password = :password WHERE id_usuario = :id");
    $stmt -> bindParam(":password", $password_hash);
    $stmt -> bindParam(":id", $id_usuario);

    if($stmt->execute()){
        unset($_SESSION["reset_user_id"]);
        echo "<script>alert('Contraseña actualizada correctamente'); window.location='../index.php';</script>";
    } else {
        echo "<script>alert('Error al actualizar la contraseña'); window.history.back();</script>";
    }

}
?>