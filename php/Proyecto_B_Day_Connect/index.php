<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="includes/css/style.css">
    <title>B-Day Connect</title>
</head>
<body>
    
    <div class="login-container">
        <h2>¡ Bienvenido a B-DAY CONNECT !</h2>

        <form action="php/login.php" method="POST">
            <label for="email">Correo electronico: </label>
            <input type="email" name="email" require>

            <label for="password">Contraseña:</label>
            <input type="password" name="password" require>

            <button type="submit">Iniciar Sesion</button>

            <p>¿Aun no tines cuenta?</p>
            <a href="includes/html/registro.html">Registrate aqui</a>

        </form>
    
    </div>


</body>
</html>