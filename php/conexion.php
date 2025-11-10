<?php

    $servidor = "localhost";
    $usuario = "root";
    $pass = "";
    $database = "B_day_connect";

    try{
        $conn = new PDO ("mysql:host=$servidor;dbname=$database",$usuario,$pass);
        $conn -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch(PDOException $error){
        echo "Error en la conexion: ". $error->getMessage();
    }


?>