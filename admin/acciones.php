<<<<<<< HEAD
<?php
//aciones.php
session_start();
require_once("../php/conexion.php");

if (!isset($_SESSION["id_usuario"]) || $_SESSION["rol"] != 1) {
    header("Location: ../index.php");
    exit;
}

if (isset($_GET["accion"]) && isset($_GET["id"])) {
    $accion = $_GET["accion"];
    $id = intval($_GET["id"]);

    try {
        if ($id == $_SESSION["id_usuario"] && $accion !== "ascender") {
            echo "<script>alert('❌ No puedes eliminarte ni cambiar tu propio rol.');
                  window.location.href='home_admin.php';</script>";
            exit;
        }

        switch ($accion) {
            case "eliminar":
                $sql = "DELETE FROM usuarios WHERE id_usuario = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(":id", $id, PDO::PARAM_INT);
                $stmt->execute();
                $mensaje = "✅ Usuario eliminado correctamente.";
                break;

            case "ascender":
                $sql = "UPDATE usuarios SET id_rol = 1 WHERE id_usuario = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(":id", $id, PDO::PARAM_INT);
                $stmt->execute();
                $mensaje = "⬆️ Usuario ascendido a administrador.";
                break;

            case "degradar":
                $sql = "UPDATE usuarios SET id_rol = 2 WHERE id_usuario = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(":id", $id, PDO::PARAM_INT);
                $stmt->execute();
                $mensaje = "⬇️ Administrador degradado a usuario normal.";
                break;

            default:
                $mensaje = "⚠️ Acción no válida.";
                break;
        }

    } catch (PDOException $e) {
        $mensaje = "❌ Error en la base de datos: " . $e->getMessage();
    }

    echo "<script>alert('$mensaje'); window.location.href='home_admin.php';</script>";
    exit;
} else {
    header("Location: home_admin.php");
    exit;
}
=======
<?php
session_start();
require_once("../php/conexion.php");

if (!isset($_SESSION["id_usuario"]) || $_SESSION["rol"] != 1) {
    header("Location: ../index.php");
    exit;
}


if (isset($_GET["accion"]) && isset($_GET["id"])) {
    $accion = $_GET["accion"];
    $id = intval($_GET["id"]);

    try {
       
        if ($id == $_SESSION["id_usuario"] && $accion !== "ascender") {
            echo "<script>
                    alert('❌ No puedes eliminarte ni cambiar tu propio rol.');
                    window.location.href='home_admin.php';
                  </script>";
            exit;
        }

        switch ($accion) {
            case "eliminar":
                $sql = "DELETE FROM usuarios WHERE id_usuario = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(":id", $id, PDO::PARAM_INT);
                $stmt->execute();
                $mensaje = "✅ Usuario eliminado correctamente.";
                break;

            case "ascender":
                $sql = "UPDATE usuarios SET id_rol = 1 WHERE id_usuario = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(":id", $id, PDO::PARAM_INT);
                $stmt->execute();
                $mensaje = "⬆️ Usuario ascendido a administrador.";
                break;

            case "degradar":
                $sql = "UPDATE usuarios SET id_rol = 2 WHERE id_usuario = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(":id", $id, PDO::PARAM_INT);
                $stmt->execute();
                $mensaje = "⬇️ Administrador degradado a usuario normal.";
                break;

            default:
                $mensaje = "⚠️ Acción no válida.";
                break;
        }

    } catch (PDOException $e) {
        $mensaje = "❌ Error en la base de datos: " . $e->getMessage();
    }

    
    echo "<script>
            alert('$mensaje');
            window.location.href='home_admin.php';
          </script>";
    exit;

} else {
   
    header("Location: home_admin.php");
    exit;
}
?>
>>>>>>> c9a44ca (Se unifican  ramas, se actualiza dump)
