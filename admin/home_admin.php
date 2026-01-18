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
  <title>Panel de Administracion</title>
  <link rel="stylesheet" href="../user/user.css">
  <link rel="stylesheet" href="../includes/css/style_admin.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body class="admin-page">
  <button id="menuToggle" class="hamburger" aria-label="Abrir menu">
    <span></span>
    <span></span>
    <span></span>
  </button>

  <aside class="sidebar" role="navigation">
    <div class="user-info">
      <div class="profile-pic" style="overflow:hidden;">
        <img src="../assets/no-profile.jpg" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" alt="Foto de perfil">
      </div>

      <p id="saludoUsuario">
        Hola,
        <span id="userName">
          <?php echo htmlspecialchars($_SESSION["nombre"], ENT_QUOTES, 'UTF-8'); ?>
        </span>!
      </p>
    </div>

    <nav>
      <button class="nav-btn active" data-section="dashboard"><i class="fa-solid fa-chart-simple"></i> Dashboard</button>
      <button class="nav-btn" data-section="usuarios"><i class="fa-solid fa-user-group"></i> Usuarios</button>
      <button class="nav-btn" data-section="meta"><i class="fa-solid fa-tags"></i> Categorias y gustos</button>
      <button class="nav-btn" data-section="broadcast"><i class="fa-solid fa-paper-plane"></i> Mensajes</button>
      <button class="nav-btn" data-section="logs"><i class="fa-solid fa-list-check"></i> Logs</button>
      <button class="logout-btn" id="logoutBtn">Cerrar sesion</button>
    </nav>
  </aside>

  <main class="main" id="main">
    <header class="main-header">
      <h1><i class="fa-solid fa-gear"></i> Panel de Administracion</h1>
      <p>Gestiona usuarios, categorias, gustos y mensajes.</p>
    </header>

    <section id="seccion-dashboard" class="section active-section admin-content">
      <div class="cards-container admin-cards">
        <div class="card">
          <h2>Usuarios</h2>
          <p id="statTotal">-</p>
        </div>
        <div class="card">
          <h2>Admins</h2>
          <p id="statAdmins">-</p>
        </div>
        <div class="card">
          <h2>Bloqueados</h2>
          <p id="statBloqueados">-</p>
        </div>
        <div class="card">
          <h2>Categorias</h2>
          <p id="statCategorias">-</p>
        </div>
        <div class="card">
          <h2>Gustos</h2>
          <p id="statGustos">-</p>
        </div>
      </div>
    </section>

    <section id="seccion-usuarios" class="section admin-content" style="display:none;">
      <div class="admin-filters">
        <input type="text" id="adminSearch" placeholder="Buscar por nombre o email...">
        <select id="adminTipo">
          <option value="todos">Todos</option>
          <option value="usuario">Usuarios normales</option>
          <option value="admin">Administradores</option>
        </select>
        <select id="adminEstado">
          <option value="">Estado (todos)</option>
          <option value="activo">Activo</option>
          <option value="bloqueado">Bloqueado</option>
        </select>
        <input type="date" id="adminDesde">
        <input type="date" id="adminHasta">
        <button id="btnBuscarUsuarios" class="action-btn">Buscar</button>
        <button id="btnLimpiarUsuarios" class="action-btn">Limpiar</button>
        <a id="btnExportCsv" class="action-btn" href="api_admin_export.php">Exportar CSV</a>
      </div>

      <div class="admin-import">
        <input type="file" id="importFile" accept=".csv">
        <button id="btnImportCsv" class="action-btn">Importar CSV</button>
        <span id="importStatus"></span>
      </div>

      <div id="contenedor-tabla" class="tabla-dinamica">
        <p class="info">Selecciona una opcion para ver usuarios.</p>
      </div>
    </section>

    <section id="seccion-meta" class="section admin-content" style="display:none;">
      <div class="admin-meta">
        <div class="admin-panel">
          <h3>Categorias</h3>
          <div class="admin-add">
            <input type="text" id="catInput" placeholder="Nueva categoria">
            <button id="btnAddCat" class="action-btn">Agregar</button>
          </div>
          <div id="catList" class="admin-list"></div>
        </div>

        <div class="admin-panel">
          <h3>Gustos</h3>
          <div class="admin-add">
            <input type="text" id="gustoInput" placeholder="Nuevo gusto">
            <button id="btnAddGusto" class="action-btn">Agregar</button>
          </div>
          <div id="gustoList" class="admin-list"></div>
        </div>
      </div>
    </section>

    <section id="seccion-broadcast" class="section admin-content" style="display:none;">
      <div class="admin-broadcast">
        <h3>Mensaje masivo (simulado)</h3>
        <input type="text" id="broadcastSubject" placeholder="Asunto">
        <textarea id="broadcastMessage" rows="4" placeholder="Mensaje"></textarea>
        <button id="btnBroadcast" class="action-btn">Enviar a todos</button>
        <span id="broadcastStatus"></span>
      </div>
    </section>

    <section id="seccion-logs" class="section admin-content" style="display:none;">
      <div class="admin-logs">
        <h3>Log de acciones</h3>
        <div id="adminLogs" class="admin-log-list"></div>
      </div>
    </section>
  </main>

  <script src="js/admin.js?v=1" defer></script>
  <script>
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");
    const logoutBtn = document.getElementById("logoutBtn");

    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        if (sidebar) sidebar.classList.toggle("active");
        menuToggle.classList.toggle("active");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        window.location.href = "../logout.php";
      });
    }
  </script>
</body>
</html>
