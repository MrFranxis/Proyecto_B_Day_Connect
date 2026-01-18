<?php
session_start();
session_unset();
session_destroy();
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Cerrando sesión...</title>
    <script>
        window.location.href = "index.php";
    </script>
</head>
<body>
    <p>Cerrando sesión...</p>
</body>
</html>