<?php
session_start();

if (!isset($_SESSION['id_usuario'])) {
    header('Location: ../index.php');
    exit;
}
?>
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
                <img id="sidebarProfilePic" src="../assets/no-profile.jpg" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" alt="Foto de perfil">
            </div>

            <p id="saludoUsuario">
                ¡Hola,
                <span id="userName">
                    <?php echo isset($_SESSION['nombre']) ? htmlspecialchars($_SESSION['nombre'], ENT_QUOTES, 'UTF-8') : 'Usuario'; ?>
                </span>!
            </p>
        </div>

        <nav>
            <button class="nav-btn" data-section="inicio"><i class="fa-solid fa-cake-candles"></i> Inicio</button>
            <button class="nav-btn" data-section="notificaciones"><i class="fa-solid fa-bell"></i> Notificaciones</button>
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

        <!-- NOTIFICACIONES -->
        <section id="seccion-notificaciones" class="section" style="display:none;">
            <h2>Notificaciones</h2>
            <p>Mensajes del administrador.</p>
            <div class="notificaciones-actions">
                <button id="btnRefrescarNotificaciones" class="action-btn">Actualizar</button>
            </div>
            <div id="notificacionesStatus" class="info"></div>
            <div id="notificacionesList" class="notificaciones-list">
                <p class="info">No hay notificaciones.</p>
            </div>
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

            <div style="display:flex; gap:10px; align-items:center; margin-bottom: 1rem;">
                <select id="filtroCategoria" style="padding: 8px; border-radius: 8px; border: 1px solid #e6e6e6; min-width: 220px;">
                    <option value="">Filtrar por categoría</option>
                </select>
                <button id="btnBuscarCategoria" class="action-btn">Buscar</button>
                <button id="btnLimpiarFiltroCategoria" class="action-btn">Limpiar</button>
            </div>

            <div id="listaContactos"></div>
        </section>

        <!-- FELICITACIONES -->
        <section id="seccion-felicitaciones" class="section" style="display:none;">
            <h2>Felicitaciones</h2>
            <p>Aquí podrás revisar las felicitaciones generadas y programadas.</p>
            <div style="margin: 1rem 0; padding: 1rem; border: 1px solid #e6e6e6; border-radius: 12px;">
                <h3>Envio de correos de cumpleanos</h3>
                <div style="display:grid; gap:10px; grid-template-columns: 1fr 1fr;">
                    <div>
                        <label>Contacto</label>
                        <select id="emailContactoSelect" style="width:100%; padding:8px; border-radius:8px; border:1px solid #e6e6e6;">
                            <option value="">Selecciona un contacto</option>
                        </select>
                    </div>
                    <div>
                        <label>Asunto</label>
                        <input type="text" id="emailSubject" value="Feliz cumpleanos" style="width:100%; padding:8px; border-radius:8px; border:1px solid #e6e6e6;">
                    </div>
                    <div>
                        <label>Mensaje (plantilla)</label>
                        <select id="emailTemplateSelect" style="width:100%; padding:8px; border-radius:8px; border:1px solid #e6e6e6;">
                            <option value="predef_1">Feliz cumpleanos (clasico)</option>
                            <option value="predef_2">Feliz cumpleanos (corto)</option>
                            <option value="personalizado">Personalizado</option>
                        </select>
                    </div>
                    <div>
                        <label>Programar envio</label>
                        <input type="datetime-local" id="emailFechaProgramada" style="width:100%; padding:8px; border-radius:8px; border:1px solid #e6e6e6;">
                    </div>
                </div>
                <div style="margin-top:10px;">
                    <label>Mensaje personalizado</label>
                    <textarea id="emailMensajePersonalizado" rows="4" style="width:100%; padding:8px; border-radius:8px; border:1px solid #e6e6e6;" placeholder="Escribe tu mensaje..."></textarea>
                </div>
                <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
                    <button id="btnEnviarEmailAhora" class="action-btn">Enviar ahora</button>
                    <button id="btnProgramarEmail" class="action-btn">Programar envio</button>
                    <button id="btnProgramarCumple" class="action-btn">Programar para cumpleanos</button>
                    <button id="btnProcesarProgramados" class="action-btn">Procesar programados</button>
                </div>
                <div id="emailStatus" style="margin-top:10px; font-weight:bold;"></div>
            </div>

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
            <p>Selecciona un contacto y define tu presupuesto para sugerencias.</p>

            <div style="display:grid; gap:10px; grid-template-columns: 1fr 1fr; margin-bottom:12px;">
                <div>
                    <label>Contacto</label>
                    <select id="regaloContactoSelect" style="width:100%; padding:8px; border-radius:8px; border:1px solid #e6e6e6;">
                        <option value="">Selecciona un contacto</option>
                    </select>
                </div>
                <div style="display:flex; align-items:center; gap:10px; margin-top:22px;">
                    <input type="checkbox" id="regaloDeseadoCheck">
                    <label for="regaloDeseadoCheck">Quiero hacer un regalo</label>
                </div>
                <div class="regalo-range-wrap">
                    <label>Presupuesto (rango)</label>
                    <div class="regalo-range">
                        <input type="range" id="regaloPrecioMin" min="0" max="200" step="5" value="10">
                        <input type="range" id="regaloPrecioMax" min="0" max="200" step="5" value="50">
                    </div>
                    <div><span id="regaloPrecioMinValor">10</span> - <span id="regaloPrecioMaxValor">50</span> EUR</div>
                </div>
                <div>
                    <label>Gustos para buscar</label>
                    <div id="regaloGustosContainer" style="display:flex; flex-wrap:wrap; gap:10px; margin-top:8px;">
                        <!-- JS rellena aqui -->
                    </div>
                </div>
            </div>

            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
                <button id="btnBuscarRegalos" class="action-btn">Buscar ideas</button>
                <span id="regaloStatus" style="font-weight:bold;"></span>
            </div>

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

                <label>Apellido</label>
                <input type="text" id="apellidoContacto" required>

                <label>Email</label>
                <input type="email" id="emailContacto" required>

                <label>Fecha de nacimiento</label>
                <input type="text" id="fechaContacto" placeholder="DD/MM/AAAA"
                       pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/([1-2][0-9]{3})$"
                       maxlength="10" autocomplete="off">

                <!-- CATEGORÍAS (JS pintará los checkboxes) -->
                <div class="form-group" style="margin-top:12px;">
                    <label><strong>Categorías</strong></label>
                    <div id="categoriasContainer" style="display:flex; flex-wrap:wrap; gap:10px; margin-top:8px;">
                        <!-- JS rellena aquí -->
                    </div>
                </div>
                <!-- GUSTOS (JS pintara los checkboxes) -->
                <div class="form-group" style="margin-top:12px;">
                    <label><strong>Gustos</strong></label>\n                    <div style="display:flex; gap:8px; margin:8px 0;">
                        <input type="text" id="nuevoGustoInput" placeholder="Nuevo gusto..." style="flex:1; padding:8px; border-radius:8px; border:1px solid #e6e6e6;">
                        <button type="button" id="btnAgregarGusto" class="action-btn">Agregar</button>
                    </div>
                    <div id="gustosContainer" style="display:flex; flex-wrap:wrap; gap:10px; margin-top:8px;">
                        <!-- JS rellena aqui -->
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="submit" class="action-btn">Guardar</button>
                    <button type="button" class="action-btn" id="btnCerrarModal">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const USER_ID = "<?php echo htmlspecialchars((string)$_SESSION['id_usuario'], ENT_QUOTES, 'UTF-8'); ?>";
    </script>

    <script src="user.js"></script>
</body>
</html>



