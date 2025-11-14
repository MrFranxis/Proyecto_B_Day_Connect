<?php session_start(); ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Panel del Usuario - B-Day Connect</title>
    <link rel="stylesheet" href="user.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>

<body>

    <!-- BOTÓN HAMBURGUESA -->
    <button id="menuToggle" class="hamburger" aria-label="Abrir menú">
        <span></span>
        <span></span>
        <span></span>
    </button>

    <!-- SIDEBAR -->
    <aside class="sidebar" role="navigation">
        <div class="user-info">
            <div class="profile-pic" style="overflow:hidden;">
                <img id="sidebarProfilePic" src="../assets/no-profile.jpg" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">
            </div>
            <p id="saludoUsuario">¡Hola, <span id="userName"><?php echo isset($_SESSION['nombre']) ? htmlspecialchars($_SESSION['nombre']) : 'Usuario'; ?></span>!</p>
        </div>

        <nav>
            <button class="nav-btn" data-section="inicio"><i class="fa-solid fa-cake-candles"></i> Inicio</button>
            <button class="nav-btn" data-section="contactos"><i class="fa-solid fa-user-group"></i> Contactos</button>
            <button class="nav-btn" data-section="felicitaciones"><i class="fa-solid fa-envelope"></i> Felicitaciones</button>
            <button class="nav-btn" data-section="regalos"><i class="fa-solid fa-gift"></i> Regalos</button>
            <button class="nav-btn" data-section="ajustes"><i class="fa-solid fa-gear"></i> Editar perfil</button>
            <button class="logout-btn" id="logoutBtn">Cerrar sesión</button>
        </nav>
    </aside>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="main" id="main">

        <header class="main-header">
            <h1><i class="fa-solid fa-cake-candles"></i> Bienvenido a tu Panel</h1>
            <p>Organiza cumpleaños, felicita automáticamente y encuentra ideas de regalos</p>
        </header>

        <!-- Secciones -->
        <section id="seccion-inicio" class="section active-section">

            <section class="cards-container">

                <div class="card">
                    <h2><i class="fa-solid fa-cake-candles"></i> Cumpleaños del Mes</h2>
                    <p id="cantidadMes">Cargando...</p>
                    <button class="action-btn" id="btnVerCumples">Ver cumpleaños</button>
                </div>

                <div class="card">
                    <h2><i class="fa-solid fa-user-plus"></i> Añadir contacto</h2>
                    <p>Agregar contactos</p>
                    <button class="action-btn" id="btnAddContacto">Añadir</button>
                </div>

                <div class="card">
                    <h2><i class="fa-solid fa-envelope"></i> Mensajes automáticos</h2>
                    <p>Generar felicitaciones personalizadas</p>
                    <button class="action-btn" id="btnGenerarMensajes">Generar</button>
                </div>

                <div class="card">
                    <h2><i class="fa-solid fa-gift"></i> Ideas de Regalos</h2>
                    <p>Recomendaciones según gustos del contacto</p>
                    <button class="action-btn" id="btnVerIdeas">Ver ideas</button>
                </div>

            </section>

            <!-- CALENDARIO DE CUMPLEAÑOS -->
            <section class="next-birthday">
                <h2><i class="fa-solid fa-calendar-day"></i> Próximos cumpleaños</h2>

                <div id="calendar">
                    <div class="calendar-header">
                        <button id="prevMonth" class="calendar-nav" aria-label="Mes anterior">◀</button>
                        <h3 id="calendarMonth">Mes Año</h3>
                        <button id="nextMonth" class="calendar-nav" aria-label="Mes siguiente">▶</button>
                    </div>

                    <div id="calendarGrid" class="calendar-grid" aria-live="polite"></div>
                </div>

            </section>

        </section>

        <!-- CONTACTOS -->
        <section id="seccion-contactos" class="section" style="display:none;">
            <div class="contacts-header">
                <h2>Contactos</h2>
                <div class="contact-btn-group">
                    <button class="action-btn btn-contact" id="btnAddContacto2"><i class="fa-solid fa-user-plus"></i> Añadir contacto</button>
                    <button id="btnLimpiarContactos" class="btn-trash" title="Limpiar contactos" style="padding:8px 18px; font-size:1rem; display:inline-flex; align-items:center; gap:8px;">
                        <i class="fa-solid fa-trash"></i> Limpiar todo
                    </button>
                </div>
            </div>
            <div style="margin-bottom: 1rem; margin-top: 1rem;">
                <input type="text" id="buscadorContactos" placeholder="Buscar contacto por nombre o apellido..." style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #e6e6e6;">
            </div>
            <div id="listaContactos"></div>
        </section>

        <!-- FELICITACIONES -->
        <section id="seccion-felicitaciones" class="section" style="display:none;">
            <h2>Felicitaciones</h2>
            <p>Aquí podrás revisar las felicitaciones generadas y programadas.</p>
            <div class="felicitaciones-header">
                <button id="btnLimpiarMensajes" class="btn-trash" title="Limpiar mensajes" style="padding:8px 18px; font-size:1rem; display:inline-flex; align-items:center; gap:8px;">
                    <i class="fa-solid fa-trash"></i> Limpiar todo
                </button>
            </div>
            <div id="historialMensajes">
                <p class="info">No hay mensajes generados todavía.</p>
            </div>
        </section>

        <!-- REGALOS -->
        <section id="seccion-regalos" class="section" style="display:none;">
            <h2>Ideas de Regalos</h2>
            <p>Selecciona un contacto para ver ideas.</p>
            <div id="ideasContainer" class="ideas-container"></div>
        </section>

        <!-- EDITAR PERFIL -->
        <section id="seccion-ajustes" class="section" style="display:none;">
            <h2>Editar perfil</h2>

            <div class="settings-box">
                <p class="settings-label">Nombre de Usuario:</p>
                <p id="settingsUsername">Usuario</p>
                <button class="action-btn" id="btnEditarNombre">Editar nombre</button>
            </div>

            <div class="settings-box">
                <p class="settings-label">Foto de Perfil:</p>

                <div class="profile-preview">
                    <img id="settingsProfilePic" class="profile-pic" src="../assets/no-profile.jpg" alt="Foto perfil"
                        style="width:80px; height:80px; border-radius:50%; object-fit:cover;">
                </div>

                <button class="action-btn" id="btnEditarFoto">Editar foto</button>
                <input type="file" id="inputFoto" accept="image/*" style="display:none;">
            </div>
        </section>

    </main>

    <!-- MODAL -->
    <div id="modalOverlay" class="modal-overlay" aria-hidden="true">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <h3 id="modalTitle">Añadir contacto</h3>
            <form id="formContacto">
                <input type="hidden" id="contactoId">

                <label>Nombre</label>
                <input type="text" id="nombreContacto" required>

                <label>Apellido:</label>
                <input type="text" id="apellidoContacto" required>

                <label>Email</label>
                <input type="email" id="emailContacto" required>

                <label>Fecha de nacimiento</label>
                <input type="text" id="fechaContacto" placeholder="DD/MM/AAAA" pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/([1-2][0-9]{3})$" maxlength="10" autocomplete="off">

                <div class="modal-actions">
                    <button type="submit" class="action-btn">Guardar</button>
                    <button type="button" class="action-btn" id="btnCerrarModal">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
    <script>
        const USER_ID = "<?php echo isset($_SESSION['id_usuario']) ? $_SESSION['id_usuario'] : ''; ?>";
    </script>
    <script src="user.js"></script>
</body>
</html>