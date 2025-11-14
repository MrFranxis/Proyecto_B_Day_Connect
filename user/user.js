document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('formContacto');
    var btnGuardar = form ? form.querySelector('button[type="submit"]') : null;
    var nombreInput = document.getElementById('nombreContacto');
    var apellidoInput = document.getElementById('apellidoContacto');
    var emailInput = document.getElementById('emailContacto');
    var fechaInput = document.getElementById('fechaContacto');
    var errorBox = null;

    let touched = {
        nombre: false,
        apellido: false,
        email: false,
        fecha: false
    };

    function validarCampos() {
        let error = false;
        let mensajes = [];
        // Nombre
        if (touched.nombre && !nombreInput.value.trim()) {
            error = true;
            mensajes.push('El nombre es obligatorio.');
        }
        // Apellido
        if (touched.apellido && !apellidoInput.value.trim()) {
            error = true;
            mensajes.push('El apellido es obligatorio.');
        }
        // Email
        if (touched.email && !emailInput.value.trim()) {
            error = true;
            mensajes.push('El email es obligatorio.');
        } else if (touched.email && emailInput.value.trim() && !/^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})$/.test(emailInput.value.trim())) {
            error = true;
            mensajes.push('El email no es válido.');
        }
        // Fecha
        let fechaVal = fechaInput.value.trim();
        if (touched.fecha && !fechaVal) {
            error = true;
            mensajes.push('La fecha de nacimiento es obligatoria.');
        } else if (touched.fecha && fechaVal && !/^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)[0-9]{2}$/.test(fechaVal)) {
            error = true;
            mensajes.push('La fecha de nacimiento no es válida.');
        }

        if (!errorBox) {
            errorBox = document.getElementById('formContactoError');
            if (!errorBox) {
                errorBox = document.createElement('div');
                errorBox.id = 'formContactoError';
                errorBox.style.color = '#e74c3c';
                errorBox.style.marginTop = '8px';
                errorBox.style.fontWeight = 'bold';
                form.appendChild(errorBox);
            }
        }
        if (error) {
            errorBox.innerHTML = mensajes.map(m => `<div>${m}</div>`).join('');
        } else {
            errorBox.textContent = '';
        }
        let allFilled = nombreInput.value.trim() && apellidoInput.value.trim() && emailInput.value.trim() && fechaVal && /^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})$/.test(emailInput.value.trim()) && /^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)[0-9]{2}$/.test(fechaVal);
        if (btnGuardar) btnGuardar.disabled = !allFilled || error;
    }

    if (nombreInput) nombreInput.addEventListener('input', function () { touched.nombre = true; validarCampos(); });
    if (apellidoInput) apellidoInput.addEventListener('input', function () { touched.apellido = true; validarCampos(); });
    if (emailInput) emailInput.addEventListener('input', function () { touched.email = true; validarCampos(); });
    if (fechaInput) fechaInput.addEventListener('input', function () { touched.fecha = true; validarCampos(); });
    validarCampos();
});

document.addEventListener('DOMContentLoaded', function () {
    var fechaInput = document.getElementById('fechaContacto');
    if (fechaInput) {
        fechaInput.addEventListener('input', function (e) {
            let v = fechaInput.value.replace(/[^0-9]/g, '');
            if (v.length > 2 && v[2] !== '/') v = v.slice(0, 2) + '/' + v.slice(2);
            if (v.length > 5 && v[5] !== '/') v = v.slice(0, 5) + '/' + v.slice(5);
            fechaInput.value = v.slice(0, 10);
        });
    }
});

function mostrarHistorialFelicitaciones() {
    const historial = JSON.parse(localStorage.getItem("historialFelicitaciones") || "[]");
    const contenedor = document.getElementById("historialMensajes");
    if (!contenedor) return;
    if (!historial.length) {
        contenedor.innerHTML = `<p class="info">No hay mensajes generados todavía.</p>`;
        return;
    }
    contenedor.innerHTML = historial.map(m => `<div class="mensaje-felicitacion">${m}</div>`).join("");
}

function limpiarHistorialFelicitaciones() {
    localStorage.removeItem("historialFelicitaciones");
    mostrarHistorialFelicitaciones();
}

document.addEventListener("DOMContentLoaded", () => {
    const btnLimpiar = document.getElementById("btnLimpiarMensajes");
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", limpiarHistorialFelicitaciones);
    }
    mostrarHistorialFelicitaciones();

    const btnEditarNombre = document.getElementById("btnEditarNombre");
    const settingsUsername = document.getElementById("settingsUsername");
    const sidebarUserName = document.getElementById("userName");
    const btnEditarFoto = document.getElementById("btnEditarFoto");
    const inputFoto = document.getElementById("inputFoto");
    const settingsPic = document.getElementById("settingsProfilePic");
    const sidebarPic = document.getElementById("sidebarProfilePic");

    function cargarPerfilGuardado() {
        const savedName = localStorage.getItem(`username_${USER_ID}`);
        const savedPic = localStorage.getItem(`profilePic_${USER_ID}`);
        const defaultFoto = "../assets/no-profile.jpg";

        var nombreSesion = document.getElementById('userName') ? document.getElementById('userName').textContent.trim() : '';

        if (savedName) {
            settingsUsername.textContent = savedName;
            sidebarUserName.textContent = savedName;
        } else if (nombreSesion) {
            settingsUsername.textContent = nombreSesion;
            sidebarUserName.textContent = nombreSesion;
        } else {
            settingsUsername.textContent = "Usuario";
            sidebarUserName.textContent = "Usuario";
        }

        if (sidebarPic) sidebarPic.src = savedPic || defaultFoto;
        if (settingsPic) settingsPic.src = savedPic || defaultFoto;
    }

    if (btnEditarNombre) {
        btnEditarNombre.addEventListener("click", () => {
            const nuevo = prompt("Introduce tu nuevo nombre:");
            if (nuevo && nuevo.trim() !== "") {
                sidebarUserName.textContent = nuevo;
                settingsUsername.textContent = nuevo;

                const saludoUsuario = document.getElementById("saludoUsuario");
                if (saludoUsuario) {
                    saludoUsuario.innerHTML = `¡Hola, <span id="userName">${nuevo}</span>!`;
                }

                localStorage.setItem(`username_${USER_ID}`, nuevo);
            }
        });
    }

    if (btnEditarFoto && inputFoto) {
        btnEditarFoto.addEventListener("click", () => {
            inputFoto.click();
        });

        inputFoto.addEventListener("change", () => {
            const file = inputFoto.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                const fotoData = e.target.result;
                sidebarPic.src = fotoData;
                settingsPic.src = fotoData;
                localStorage.setItem(`profilePic_${USER_ID}`, fotoData);
            };
            reader.readAsDataURL(file);
        });
    }

    async function cargarContactosBD() {
        try {
            const res = await fetch('../php/api_contactos.php');
            const data = await res.json();
            if (Array.isArray(data)) {
                contactos = data.map(c => ({
                    id: c.id_contacto,
                    nombre: c.nombre,
                    apellido: c.apellido,
                    email: c.email,
                    fecha_nacimiento: c.fecha_nacimiento
                }));
            }
        } catch (err) {
            console.error('Error cargando contactos:', err);
        }
    }
    let contactos = [];

    const cantidadMesEl = document.getElementById("cantidadMes");
    const btnAddContacto = document.getElementById("btnAddContacto");
    const btnLimpiarContactos = document.getElementById("btnLimpiarContactos");
    const btnAddContacto2 = document.getElementById("btnAddContacto2");
    const btnVerCumples = document.getElementById("btnVerCumples");
    const btnGenerarMensajes = document.getElementById("btnGenerarMensajes");
    const btnVerIdeas = document.getElementById("btnVerIdeas");
    const logoutBtn = document.getElementById("logoutBtn");
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");
    const navButtons = document.querySelectorAll(".nav-btn");
    const modalOverlay = document.getElementById("modalOverlay");
    const formContacto = document.getElementById("formContacto");
    const contactoIdEl = document.getElementById("contactoId");
    const nombreContactoEl = document.getElementById("nombreContacto");
    const apellidoContactoEl = document.getElementById("apellidoContacto");
    const emailContactoEl = document.getElementById("emailContacto");
    const fechaContactoEl = document.getElementById("fechaContacto");
    const btnCerrarModal = document.getElementById("btnCerrarModal");
    const listaContactosEl = document.getElementById("listaContactos");
    const ideasContainer = document.getElementById("ideasContainer");
    const calendarGrid = document.getElementById("calendarGrid");
    const calendarMonth = document.getElementById("calendarMonth");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");

    function cargarPerfilGuardado() {
        const savedName = localStorage.getItem(`username_${USER_ID}`);
        const savedPic = localStorage.getItem(`profilePic_${USER_ID}`);
        const defaultFoto = "../assets/no-profile.jpg";

        var nombreSesion = document.getElementById('userName') ? document.getElementById('userName').textContent.trim() : '';

        if (savedName) {
            settingsUsername.textContent = savedName;
            sidebarUserName.textContent = savedName;

            const saludoUsuario = document.getElementById("saludoUsuario");
            if (saludoUsuario) {
                saludoUsuario.innerHTML = `¡Hola, <span id="userName">${savedName}</span>!`;
            }
        } else if (nombreSesion) {
            settingsUsername.textContent = nombreSesion;
            sidebarUserName.textContent = nombreSesion;
        } else {
            settingsUsername.textContent = "Usuario";
            sidebarUserName.textContent = "Usuario";
        }

        if (sidebarPic) sidebarPic.src = savedPic || defaultFoto;
        if (settingsPic) settingsPic.src = savedPic || defaultFoto;
    }

    let currentDate = new Date();

    function actualizarPanel() {
        const mesActual = currentDate.getMonth() + 1;
        const cumpleMes = contactos.filter(c => {
            if (!c.fecha_nacimiento) return false;
            const parts = c.fecha_nacimiento.split("-");
            return Number(parts[1]) === mesActual;
        });
        cantidadMesEl.textContent = `${cumpleMes.length} personas cumplen años este mes`;
        renderCalendar();
    }

    function showSection(name) {
        document.querySelectorAll(".section").forEach(s => {
            s.style.display = (s.id === `seccion-${name}`) ? "" : "none";
        });

        navButtons.forEach(b => b.classList.toggle("active", b.dataset.section === name));

        sidebar.classList.remove("active");
        menuToggle.classList.remove("active");
    }

    function renderContactos() {
        const buscador = document.getElementById("buscadorContactos");
        let filtro = "";
        if (buscador) filtro = buscador.value.trim().toLowerCase();

        let filtrados = contactos;
        if (filtro) {
            function normalizar(str) {
                return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            }
            filtrados = contactos.filter(c =>
                (c.nombre && normalizar(c.nombre).includes(normalizar(filtro))) ||
                (c.apellido && normalizar(c.apellido).includes(normalizar(filtro)))
            );
        }

        if (filtrados.length === 0) {
            listaContactosEl.innerHTML = `<p class="info">No hay contactos.</p>`;
            return;
        }

        let html = `
            <table class="table-contacts">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Fecha Nac.</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        filtrados.forEach(c => {
            html += `
                <tr>
                    <td>${escapeHtml(c.nombre)}</td>
                    <td>${escapeHtml(c.apellido)}</td>
                    <td>${escapeHtml(c.email)}</td>
                    <td>${escapeHtml(c.fecha_nacimiento)}</td>
                    <td class="contact-actions">
                        <a data-id="${c.id}" class="editar"><i class='fa-solid fa-pen-to-square'></i> Editar</a>
                        <a data-id="${c.id}" class="eliminar"><i class='fa-solid fa-trash'></i> Eliminar</a>
                        <a data-id="${c.id}" class="ideas"><i class='fa-solid fa-gift'></i> Ideas</a>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        listaContactosEl.innerHTML = html;

        listaContactosEl.querySelectorAll(".editar").forEach(a =>
            a.addEventListener("click", e => abrirModalEditar(Number(e.target.dataset.id)))
        );
        listaContactosEl.querySelectorAll(".eliminar").forEach(a =>
            a.addEventListener("click", e => eliminarContactoConfirm(Number(e.target.dataset.id)))
        );
        listaContactosEl.querySelectorAll(".ideas").forEach(a =>
            a.addEventListener("click", e => {
                mostrarIdeas(Number(e.target.dataset.id));
                showSection("regalos");
            })
        );
    }

    function abrirModalNuevo() {
        contactoIdEl.value = "";
        nombreContactoEl.value = "";
        apellidoContactoEl.value = "";
        emailContactoEl.value = "";
        fechaContactoEl.value = "";
        document.getElementById("modalTitle").textContent = "Añadir contacto";
        let errorBox = document.getElementById('formContactoError');
        if (errorBox) errorBox.textContent = '';
        modalOverlay.classList.add("active");
    }

    function abrirModalEditar(id) {
        const c = contactos.find(x => x.id === id);
        if (!c) return;

        contactoIdEl.value = c.id;
        nombreContactoEl.value = c.nombre;
        apellidoContactoEl.value = c.apellido;
        emailContactoEl.value = c.email;
        if (c.fecha_nacimiento && /^\d{4}-\d{2}-\d{2}$/.test(c.fecha_nacimiento)) {
            const partes = c.fecha_nacimiento.split('-');
            fechaContactoEl.value = `${partes[2]}/${partes[1]}/${partes[0]}`;
        } else {
            fechaContactoEl.value = c.fecha_nacimiento || '';
        }
        document.getElementById("modalTitle").textContent = "Editar contacto";
        let errorBox = document.getElementById('formContactoError');
        if (errorBox) errorBox.textContent = '';
        modalOverlay.classList.add("active");
    }

    function cerrarModal() {
        modalOverlay.classList.remove("active");
    }

    function guardarContactoFromForm(e) {
        e.preventDefault();

        const btnGuardar = document.querySelector('#formContacto button[type="submit"]');
        if (btnGuardar && btnGuardar.disabled) {
            let mensajes = [];
            if (!nombreContactoEl.value.trim()) mensajes.push('El nombre es obligatorio.');
            if (!apellidoContactoEl.value.trim()) mensajes.push('El apellido es obligatorio.');
            if (!emailContactoEl.value.trim()) mensajes.push('El email es obligatorio.');
            else if (!validateEmail(emailContactoEl.value.trim())) mensajes.push('El email no es válido.');
            if (!fechaContactoEl.value.trim()) mensajes.push('La fecha de nacimiento es obligatoria.');
            else if (!/^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)[0-9]{2}$/.test(fechaContactoEl.value.trim())) mensajes.push('La fecha de nacimiento no es válida.');
            let errorBox = document.getElementById('formContactoError');
            if (!errorBox) {
                errorBox = document.createElement('div');
                errorBox.id = 'formContactoError';
                errorBox.style.color = '#e74c3c';
                errorBox.style.marginTop = '8px';
                errorBox.style.fontWeight = 'bold';
                formContacto.appendChild(errorBox);
            }
            errorBox.innerHTML = mensajes.map(m => `<div>${m}</div>`).join('');
            return;
        }

        [nombreContactoEl, apellidoContactoEl, emailContactoEl, fechaContactoEl].forEach(el => {
            el.classList.remove('input-error');
        });
        let error = false;
        let mensajes = [];

        const id = contactoIdEl.value ? Number(contactoIdEl.value) : null;
        const nombre = nombreContactoEl.value.trim();
        const apellido = apellidoContactoEl.value.trim();
        const email = emailContactoEl.value.trim();
        const fecha = fechaContactoEl.value.trim();

        if (!nombre) {
            nombreContactoEl.classList.add('input-error');
            error = true;
            mensajes.push('El nombre es obligatorio.');
        }
        if (!apellido) {
            apellidoContactoEl.classList.add('input-error');
            error = true;
            mensajes.push('El apellido es obligatorio.');
        }
        if (!email) {
            emailContactoEl.classList.add('input-error');
            error = true;
            mensajes.push('El email es obligatorio.');
        } else if (!/^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})$/.test(email)) {
            emailContactoEl.classList.add('input-error');
            error = true;
            mensajes.push('El email no es válido.');
        }

        let fechaBD = '';
        if (!fecha) {
            fechaContactoEl.classList.add('input-error');
            error = true;
            mensajes.push('La fecha de nacimiento es obligatoria.');
        } else if (!/^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)[0-9]{2}$/.test(fecha)) {
            fechaContactoEl.classList.add('input-error');
            error = true;
            mensajes.push('La fecha de nacimiento no es válida.');
        } else {
            const partes = fecha.split('/');
            fechaBD = `${partes[2]}-${partes[1]}-${partes[0]}`;
        }

        let errorBox = document.getElementById('formContactoError');
        if (!errorBox) {
            errorBox = document.createElement('div');
            errorBox.id = 'formContactoError';
            errorBox.style.color = '#e74c3c';
            errorBox.style.marginTop = '8px';
            errorBox.style.fontWeight = 'bold';
            formContacto.appendChild(errorBox);
        }
        if (error) {
            errorBox.innerHTML = mensajes.map(m => `<div>${m}</div>`).join('');
            return;
        } else {
            errorBox.textContent = '';
        }

        if (id) {
            fetch('../php/api_contactos.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, nombre, apellido, email, fecha_nacimiento: fechaBD })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        cerrarModal();
                        cargarContactosBD().then(() => {
                            renderContactos();
                            actualizarPanel();
                        });
                    } else {
                        alert(data.error || 'Error al editar el contacto');
                    }
                })
                .catch(() => alert('Error de conexión al editar el contacto'));
        } else {
            fetch('../php/api_contactos.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, apellido, email, fecha_nacimiento: fechaBD })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        cerrarModal();
                        cargarContactosBD().then(() => {
                            renderContactos();
                            actualizarPanel();
                        });
                    } else {
                        alert(data.error || 'Error al guardar el contacto');
                    }
                })
                .catch(() => alert('Error de conexión al guardar el contacto'));
        }
    }

    function eliminarContactoConfirm(id) {
        if (!confirm("¿Eliminar contacto?")) return;
        fetch('../php/api_contactos.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    cargarContactosBD().then(() => {
                        renderContactos();
                        actualizarPanel();
                    });
                } else {
                    alert(data.error || 'Error al eliminar el contacto');
                }
            })
            .catch(() => alert('Error de conexión al eliminar el contacto'));
    }

    function generarFelicitaciones() {
        const mesActual = currentDate.getMonth() + 1;
        const cumpleMes = contactos.filter(
            c => c.fecha_nacimiento && Number(c.fecha_nacimiento.split("-")[1]) === mesActual
        );

        if (cumpleMes.length === 0) {
            mostrarModalFelicitaciones(`<p class="info">No hay cumpleaños este mes.</p>`);
            return;
        }

        const mensajes = cumpleMes
            .map(c => `<div class="mensaje-felicitacion"><span>¡Feliz cumpleaños, <b>${escapeHtml(c.nombre)} ${escapeHtml(c.apellido)}</b>! <i class='fa-solid fa-cake-candles'></i></span></div>`)
            .join("");

        window._felicitacionesPendientes = cumpleMes.map(c => `¡Feliz cumpleaños, <b>${escapeHtml(c.nombre)} ${escapeHtml(c.apellido)}</b>! <i class='fa-solid fa-cake-candles'></i>`);
        mostrarModalFelicitaciones(`<h2>Mensajes generados</h2>${mensajes}`);
    }

    function mostrarModalFelicitaciones(html) {
        let modal = document.getElementById("modalFelicitaciones");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "modalFelicitaciones";
            modal.className = "modal-overlay active";
            modal.innerHTML = `
                <div class="modal-felicitaciones">
                    <div class="modal-content">${html}</div>
                    <div class="modal-actions">
                        <button id="btnEnviarFelicitaciones" class="btn-check" title="Enviar mensajes"><i class="fa-solid fa-check"></i></button>
                        <button id="btnCancelarFelicitaciones" class="btn-cancel" title="Cancelar"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            document.getElementById("btnEnviarFelicitaciones").onclick = () => {
                let historial = JSON.parse(localStorage.getItem("historialFelicitaciones") || "[]");
                if (window._felicitacionesPendientes && window._felicitacionesPendientes.length) {
                    historial = historial.concat(window._felicitacionesPendientes);
                    localStorage.setItem("historialFelicitaciones", JSON.stringify(historial));
                    mostrarHistorialFelicitaciones();
                    window._felicitacionesPendientes = null;
                }
                modal.remove();
            };
            document.getElementById("btnCancelarFelicitaciones").onclick = () => {
                window._felicitacionesPendientes = null;
                modal.remove();
            };
        } else {
            modal.querySelector(".modal-content").innerHTML = html;
            modal.classList.add("active");
            if (!modal.querySelector(".modal-actions")) {
                const actions = document.createElement("div");
                actions.className = "modal-actions";
                actions.innerHTML = `<button id="btnEnviarFelicitaciones" class="btn-check" title="Enviar mensajes"><i class="fa-solid fa-check"></i></button><button id="btnCancelarFelicitaciones" class="btn-cancel" title="Cancelar"><i class="fa-solid fa-xmark"></i></button>`;
                modal.querySelector(".modal-felicitaciones").appendChild(actions);
            }
            const btnEnviar = modal.querySelector("#btnEnviarFelicitaciones");
            const btnCancelar = modal.querySelector("#btnCancelarFelicitaciones");
            if (btnEnviar) {
                btnEnviar.onclick = () => {
                    let historial = JSON.parse(localStorage.getItem("historialFelicitaciones") || "[]");
                    if (window._felicitacionesPendientes && window._felicitacionesPendientes.length) {
                        historial = historial.concat(window._felicitacionesPendientes);
                        localStorage.setItem("historialFelicitaciones", JSON.stringify(historial));
                        mostrarHistorialFelicitaciones();
                        window._felicitacionesPendientes = null;
                    }
                    modal.remove();
                };
            }
            if (btnCancelar) {
                btnCancelar.onclick = () => {
                    window._felicitacionesPendientes = null;
                    modal.remove();
                };
            }
        }
    }

    function mostrarIdeas(contactId) {
        const c = contactos.find(x => x.id === contactId);
        ideasContainer.innerHTML = "";

        if (!c) {
            ideasContainer.innerHTML = `<p class="info">Contacto no encontrado.</p>`;
            return;
        }

        const ideas = [
            `${c.nombre} - Tarjeta personalizada`,
            `${c.nombre} - Caja regalo sorpresa`,
            `${c.nombre} - Cupón experiencia`
        ];

        ideas.forEach(i => {
            const d = document.createElement("div");
            d.className = "idea";
            d.textContent = i;
            ideasContainer.appendChild(d);
        });
    }

    function renderCalendar() {
        calendarGrid.innerHTML = "";

        const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });
        calendarMonth.textContent =
            monthName.charAt(0).toUpperCase() + monthName.slice(1) + " " + currentDate.getFullYear();

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const offset = firstDay === 0 ? 6 : firstDay - 1;

        for (let i = 0; i < offset; i++) {
            const empty = document.createElement("div");
            calendarGrid.appendChild(empty);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dayElement = document.createElement("div");
            dayElement.className = "calendar-day";

            const dayNumber = document.createElement("div");
            dayNumber.textContent = d;
            dayElement.appendChild(dayNumber);

            const mm = String(month + 1).padStart(2, "0");
            const dd = String(d).padStart(2, "0");

            const todayBirthdays = contactos.filter(c => {
                if (!c.fecha_nacimiento) return false;
                const parts = c.fecha_nacimiento.split("-");
                return parts[1] === mm && parts[2] === dd;
            });

            if (todayBirthdays.length > 0) {
                dayElement.classList.add("birthday");

                const namesContainer = document.createElement("div");
                namesContainer.className
                namesContainer.className = "names";

                todayBirthdays.slice(0, 2).forEach(b => {
                    const n = document.createElement("div");
                    n.className = "name";
                    const icon = document.createElement("i");
                    icon.className = "fa-solid fa-cake-candles";
                    icon.style.marginRight = "6px";
                    n.appendChild(icon);
                    const nombreSpan = document.createElement("span");
                    nombreSpan.textContent = b.nombre + " " + b.apellido;
                    n.appendChild(nombreSpan);
                    namesContainer.appendChild(n);
                });

                if (todayBirthdays.length > 2) {
                    const more = document.createElement("div");
                    more.className = "more";
                    more.textContent = `+${todayBirthdays.length - 2} más`;
                    namesContainer.appendChild(more);
                }

                dayElement.appendChild(namesContainer);
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        actualizarPanel();
    });

    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        actualizarPanel();
    });

    btnAddContacto.addEventListener("click", abrirModalNuevo);
    btnAddContacto2.addEventListener("click", abrirModalNuevo);

    if (btnLimpiarContactos) {
        btnLimpiarContactos.addEventListener("click", async () => {
            if (!confirm("¿Eliminar TODOS los contactos?")) return;
            try {
                const res = await fetch('../php/api_contactos.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ eliminar_todos: true })
                });
                const data = await res.json();
                if (data.success) {
                    await cargarContactosBD();
                    renderContactos();
                    actualizarPanel();
                } else {
                    alert(data.error || 'Error al eliminar todos los contactos');
                }
            } catch {
                alert('Error de conexión al eliminar todos los contactos');
            }
        });
    }

    btnVerCumples.addEventListener("click", () => {
        showSection("contactos");
        renderContactos();
    });

    btnGenerarMensajes.addEventListener("click", generarFelicitaciones);

    btnVerIdeas.addEventListener("click", () => {
        showSection("regalos");
        ideasContainer.innerHTML = "";
    });

    logoutBtn.addEventListener("click", () => {
        window.location.href = "../logout.php";
    });

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            showSection(btn.dataset.section);
            if (btn.dataset.section === "contactos") renderContactos();
        });
    });

    const buscador = document.getElementById("buscadorContactos");
    if (buscador) {
        buscador.addEventListener("input", renderContactos);
    }

    btnCerrarModal.addEventListener("click", cerrarModal);

    modalOverlay.addEventListener("click", e => {
        if (e.target === modalOverlay) cerrarModal();
    });

    formContacto.addEventListener("submit", guardarContactoFromForm);

    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        menuToggle.classList.toggle("active");
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            if (modalOverlay.classList.contains("active")) cerrarModal();
            sidebar.classList.remove("active");
            menuToggle.classList.remove("active");
        }
    });

    cargarPerfilGuardado();
    cargarContactosBD().then(() => {
        actualizarPanel();
        renderContactos();
        renderCalendar();
    });

});

function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[m]);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}