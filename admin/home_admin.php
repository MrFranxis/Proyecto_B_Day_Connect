
<?php
session_start();
if (!isset($_SESSION["id_usuario"]) || $_SESSION["rol"] != 1) {
    header("Location: ../index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panel de Administración</title>
  <link rel="stylesheet" href="../includes/css/style_admin.css">
</head>
<body>
<div class="admin-container">
  <h1>🎂 Panel de Administración</h1>
  <p>Bienvenido, <strong><?= htmlspecialchars($_SESSION["nombre"]) ?></strong></p>

 
  <div class="admin-menu">
    <button data-tipo="todos">👥 Ver Todos</button>
    <button data-tipo="usuario">🙍 Usuarios Normales</button>
    <button data-tipo="admin">🧑‍💼 Administradores</button>
    <button id="filtrarFecha">📅 Filtrar por fecha</button>
  </div>

 
  <div id="contenedor-tabla" class="tabla-dinamica">
    <p class="info">Selecciona una opción para ver usuarios.</p>
  </div>

  <a class="logout" href="../logout.php">Cerrar Sesión</a>
</div>

<script src="js/admin.js"></script>
</body>
</html>

