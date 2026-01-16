// =======================
// VALIDACIÓN FORMULARIO (habilitar/deshabilitar Guardar)
// =======================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formContacto");
  const btnGuardar = form ? form.querySelector('button[type="submit"]') : null;

  const nombreInput = document.getElementById("nombreContacto");
  const apellidoInput = document.getElementById("apellidoContacto");
  const emailInput = document.getElementById("emailContacto");
  const fechaInput = document.getElementById("fechaContacto");
  const categoriasContainer = document.getElementById("categoriasContainer");

  let errorBox = null;

  let touched = {
    nombre: false,
    apellido: false,
    email: false,
    fecha: false,
    categorias: false,
  };

  function validarCampos() {
    let error = false;
    let mensajes = [];

    if (touched.nombre && !nombreInput.value.trim()) {
      error = true;
      mensajes.push("El nombre es obligatorio.");
    }
    if (touched.apellido && !apellidoInput.value.trim()) {
      error = true;
      mensajes.push("El apellido es obligatorio.");
    }

    if (touched.email && !emailInput.value.trim()) {
      error = true;
      mensajes.push("El email es obligatorio.");
    } else if (
      touched.email &&
      emailInput.value.trim() &&
      !/^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})$/.test(
        emailInput.value.trim()
      )
    ) {
      error = true;
      mensajes.push("El email no es válido.");
    }

    const fechaVal = fechaInput.value.trim();
    if (touched.fecha && !fechaVal) {
      error = true;
      mensajes.push("La fecha de nacimiento es obligatoria.");
    } else if (
      touched.fecha &&
      fechaVal &&
      !/^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)[0-9]{2}$/.test(fechaVal)
    ) {
      error = true;
      mensajes.push("La fecha de nacimiento no es válida.");
    }

    const categoriasSeleccionadas =
      document.querySelectorAll(".chkCategoria:checked").length;
    if (touched.categorias && categoriasSeleccionadas === 0) {
      error = true;
      mensajes.push("Selecciona al menos una categoría.");
    }

    if (!errorBox) {
      errorBox = document.getElementById("formContactoError");
      if (!errorBox && form) {
        errorBox = document.createElement("div");
        errorBox.id = "formContactoError";
        errorBox.style.color = "#e74c3c";
        errorBox.style.marginTop = "8px";
        errorBox.style.fontWeight = "bold";
        form.appendChild(errorBox);
      }
    }

    if (errorBox) {
      if (error) {
        errorBox.innerHTML = mensajes.map((m) => `<div>${m}</div>`).join("");
      } else {
        errorBox.textContent = "";
      }
    }

    const allFilled =
      nombreInput.value.trim() &&
      apellidoInput.value.trim() &&
      emailInput.value.trim() &&
      fechaVal &&
      categoriasSeleccionadas > 0 &&
      /^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})$/.test(
        emailInput.value.trim()
      ) &&
      /^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)[0-9]{2}$/.test(fechaVal);

    if (btnGuardar) btnGuardar.disabled = !allFilled || error;
  }

  if (nombreInput)
    nombreInput.addEventListener("input", () => {
      touched.nombre = true;
      validarCampos();
    });
  if (apellidoInput)
    apellidoInput.addEventListener("input", () => {
      touched.apellido = true;
      validarCampos();
    });
  if (emailInput)
    emailInput.addEventListener("input", () => {
      touched.email = true;
      validarCampos();
    });
  if (fechaInput)
    fechaInput.addEventListener("input", () => {
      touched.fecha = true;
      validarCampos();
    });
  if (categoriasContainer) {
    categoriasContainer.addEventListener("change", (e) => {
      if (e.target && e.target.classList.contains("chkCategoria")) {
        if (e.isTrusted) touched.categorias = true;
        validarCampos();
      }
    });
  }

  validarCampos();
});

// =======================
// FORMATEO FECHA DD/MM/AAAA
// =======================
document.addEventListener("DOMContentLoaded", function () {
  const fechaInput = document.getElementById("fechaContacto");
  if (!fechaInput) return;

  fechaInput.addEventListener("input", function () {
    let v = fechaInput.value.replace(/[^0-9]/g, "");
    if (v.length > 2 && v[2] !== "/") v = v.slice(0, 2) + "/" + v.slice(2);
    if (v.length > 5 && v[5] !== "/") v = v.slice(0, 5) + "/" + v.slice(5);
    fechaInput.value = v.slice(0, 10);
  });
});

// =======================
// FELICITACIONES (historial localStorage)
// =======================
function mostrarHistorialFelicitaciones() {
  const historial = JSON.parse(
    localStorage.getItem("historialFelicitaciones") || "[]"
  );
  const contenedor = document.getElementById("historialMensajes");
  if (!contenedor) return;

  if (!historial.length) {
    contenedor.innerHTML = `<p class="info">No hay mensajes generados todavía.</p>`;
    return;
  }

  contenedor.innerHTML = historial
    .map((m) => `<div class="mensaje-felicitacion">${m}</div>`)
    .join("");
}

function limpiarHistorialFelicitaciones() {
  localStorage.removeItem("historialFelicitaciones");
  mostrarHistorialFelicitaciones();
}

// =======================
// APP PRINCIPAL
// =======================
document.addEventListener("DOMContentLoaded", () => {
  // Botón limpiar historial felicitaciones
  const btnLimpiar = document.getElementById("btnLimpiarMensajes");
  if (btnLimpiar)
    btnLimpiar.addEventListener("click", limpiarHistorialFelicitaciones);
  mostrarHistorialFelicitaciones();

  // Perfil
  const btnEditarNombre = document.getElementById("btnEditarNombre");
  const settingsUsername = document.getElementById("settingsUsername");
  const sidebarUserName = document.getElementById("userName");

  const btnEditarFoto = document.getElementById("btnEditarFoto");
  const inputFoto = document.getElementById("inputFoto");
  const settingsPic = document.getElementById("settingsProfilePic");
  const sidebarPic = document.getElementById("sidebarProfilePic");

  // Contactos (BD)
  let contactos = [];

  async function cargarContactosBD() {
    try {
      const res = await fetch("../php/api_contactos.php");
      const data = await res.json();
      if (Array.isArray(data)) {
        contactos = data.map((c) => ({
          id: c.id_contacto,
          nombre: c.nombre,
          apellido: c.apellido,
          email: c.email,
          fecha_nacimiento: c.fecha_nacimiento,
        }));
        await cargarCategoriasParaContactos(contactos.map((c) => c.id));
        await cargarGustosParaContactos(contactos.map((c) => c.id));
        poblarSelectContactosEmail();
        poblarSelectRegalos();
      }
    } catch (err) {
      console.error("Error cargando contactos:", err);
    }
  }

  // Elementos UI
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
  const regaloContactoSelect = document.getElementById("regaloContactoSelect");
  const regaloDeseadoCheck = document.getElementById("regaloDeseadoCheck");
  const regaloPrecioMin = document.getElementById("regaloPrecioMin");
  const regaloPrecioMax = document.getElementById("regaloPrecioMax");
  const regaloPrecioMinValor = document.getElementById("regaloPrecioMinValor");
  const regaloPrecioMaxValor = document.getElementById("regaloPrecioMaxValor");
  const btnBuscarRegalos = document.getElementById("btnBuscarRegalos");
  const regaloStatus = document.getElementById("regaloStatus");
  const regaloGustosContainer = document.getElementById(
    "regaloGustosContainer"
  );
  const gustosContainer = document.getElementById("gustosContainer");
  const emailContactoSelect = document.getElementById("emailContactoSelect");
  const emailSubjectEl = document.getElementById("emailSubject");
  const emailTemplateSelect = document.getElementById("emailTemplateSelect");
  const emailMensajePersonalizado = document.getElementById(
    "emailMensajePersonalizado"
  );
  const emailFechaProgramada = document.getElementById("emailFechaProgramada");
  const btnEnviarEmailAhora = document.getElementById("btnEnviarEmailAhora");
  const btnProgramarEmail = document.getElementById("btnProgramarEmail");
  const btnProgramarCumple = document.getElementById("btnProgramarCumple");
  const btnProcesarProgramados = document.getElementById(
    "btnProcesarProgramados"
  );
  const emailStatus = document.getElementById("emailStatus");
  const notificacionesList = document.getElementById("notificacionesList");
  const notificacionesStatus = document.getElementById("notificacionesStatus");
  const btnRefrescarNotificaciones = document.getElementById(
    "btnRefrescarNotificaciones"
  );
  const nuevoGustoInput = document.getElementById("nuevoGustoInput");
  const btnAgregarGusto = document.getElementById("btnAgregarGusto");
  const filtroCategoriaEl = document.getElementById("filtroCategoria");
  const btnBuscarCategoria = document.getElementById("btnBuscarCategoria");
  const btnLimpiarFiltroCategoria = document.getElementById(
    "btnLimpiarFiltroCategoria"
  );

  const calendarGrid = document.getElementById("calendarGrid");
  const calendarMonth = document.getElementById("calendarMonth");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");

  syncPrecioRegaloLabels();

  // =======================
  // CATEGORÍAS (API + UI)
  // =======================
  const API_CATEGORIAS = "../php/api_categorias.php";
  const API_CONTACTO_CATEGORIAS = "../php/api_contacto_categorias.php";
  const API_GUSTOS = "../php/api_gustos.php";
  const API_CONTACTO_GUSTOS = "../php/api_contacto_gustos.php";
  const API_EMAILS = "../php/api_emails.php";
  const API_NOTIFICACIONES = "../php/api_notificaciones.php";

  let categoriasDisponibles = [];
  let categoriasSeleccionadasPendientes = null;
  let categoriasPorContacto = new Map();
  let categoriaFiltroActiva = null;
  let gustosDisponibles = [];
  let gustosSeleccionadosPendientes = null;
  let gustosPorContacto = new Map();

  async function cargarCategoriasDisponibles() {
    try {
      const res = await fetch(API_CATEGORIAS);
      if (!res.ok) return;
      categoriasDisponibles = await res.json();
      pintarCheckboxCategorias();
      pintarFiltroCategorias();
    } catch (e) {
      console.error("Error cargando categorías:", e);
    }
  }

  function pintarCheckboxCategorias() {
    const cont = document.getElementById("categoriasContainer");
    if (!cont) return;

    cont.innerHTML = (categoriasDisponibles || [])
      .map(
        (c) => `
          <label style="display:flex; align-items:center; gap:6px;">
            <input type="checkbox" class="chkCategoria" value="${c.id_categoria}">
            ${escapeHtml(c.nombre_categoria)}
          </label>
        `
      )
      .join("");

    if (categoriasSeleccionadasPendientes) {
      marcarCategoriasSeleccionadas(categoriasSeleccionadasPendientes);
      categoriasSeleccionadasPendientes = null;
    }
  }

  function pintarFiltroCategorias() {
    if (!filtroCategoriaEl) return;
    filtroCategoriaEl.innerHTML = `<option value="">Filtrar por categoría</option>`;
    (categoriasDisponibles || []).forEach((c) => {
      const opt = document.createElement("option");
      opt.value = String(c.id_categoria);
      opt.textContent = c.nombre_categoria;
      filtroCategoriaEl.appendChild(opt);
    });
  }

  function pintarGustosRegalos() {
    if (!regaloGustosContainer) return;
    regaloGustosContainer.innerHTML = (gustosDisponibles || [])
      .map(
        (g) => `
          <label style="display:flex; align-items:center; gap:6px;">
            <input type="checkbox" class="chkGustoRegalo" value="${g.id_gustos}">
            ${escapeHtml(g.nombre_gusto)}
          </label>
        `
      )
      .join("");
  }

  function obtenerTextoCategorias(ids) {
    if (!ids || ids.length === 0) return "Sin categoría";
    if (!categoriasDisponibles || categoriasDisponibles.length === 0)
      return ids.join(", ");

    const mapa = new Map(
      categoriasDisponibles.map((c) => [
        Number(c.id_categoria),
        c.nombre_categoria,
      ])
    );
    return ids
      .map((id) => mapa.get(Number(id)))
      .filter(Boolean)
      .join(", ");
  }

  function obtenerCategoriasSeleccionadas() {
    return Array.from(document.querySelectorAll(".chkCategoria:checked"))
      .map((chk) => parseInt(chk.value, 10))
      .filter((n) => !Number.isNaN(n));
  }

  function marcarCategoriasSeleccionadas(ids) {
    const checkboxes = document.querySelectorAll(".chkCategoria");
    if (!checkboxes.length) {
      categoriasSeleccionadasPendientes = ids || [];
      return;
    }
    const setIds = new Set((ids || []).map((n) => parseInt(n, 10)));
    checkboxes.forEach((chk) => {
      chk.checked = setIds.has(parseInt(chk.value, 10));
    });
    checkboxes[0].dispatchEvent(new Event("change", { bubbles: true }));
  }

  async function cargarCategoriasDeContacto(id_contacto) {
    try {
      const res = await fetch(
        `${API_CONTACTO_CATEGORIAS}?id_contacto=${id_contacto}`
      );
      if (!res.ok) {
        marcarCategoriasSeleccionadas([]);
        return;
      }
      const data = await res.json();
      marcarCategoriasSeleccionadas(data.categorias || []);
    } catch (e) {
      console.error("Error cargando categorías del contacto:", e);
      marcarCategoriasSeleccionadas([]);
    }
  }

  async function cargarCategoriasParaContactos(ids) {
    categoriasPorContacto = new Map();
    const unicos = Array.from(new Set(ids || [])).filter(
      (id) => Number.isFinite(id) && id > 0
    );
    if (!unicos.length) return;

    await Promise.all(
      unicos.map(async (id) => {
        try {
          const res = await fetch(
            `${API_CONTACTO_CATEGORIAS}?id_contacto=${id}`
          );
          if (!res.ok) return;
          const data = await res.json();
          categoriasPorContacto.set(id, data.categorias || []);
        } catch (e) {
          console.error("Error cargando categorÇðas del contacto:", e);
        }
      })
    );
  }

  async function guardarCategoriasDeContacto(id_contacto) {
    const categorias = obtenerCategoriasSeleccionadas();
    try {
      const res = await fetch(API_CONTACTO_CATEGORIAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_contacto, categorias }),
      });
      return res.ok;
    } catch (e) {
      console.error("Error guardando categorías:", e);
      return false;
    }
  }

  // =======================
  // GUSTOS (API + UI)
  // =======================
  async function cargarGustosDisponibles() {
    try {
      const res = await fetch(API_GUSTOS);
      if (!res.ok) return;
      gustosDisponibles = await res.json();
      pintarCheckboxGustos();
      pintarGustosRegalos();
    } catch (e) {
      console.error("Error cargando gustos:", e);
    }
  }

  async function crearGusto(nombre) {
    const res = await fetch(API_GUSTOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_gusto: nombre }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "No se pudo crear el gusto");
    }
    return data;
  }

  function pintarCheckboxGustos() {
    if (!gustosContainer) return;
    gustosContainer.innerHTML = (gustosDisponibles || [])
      .map(
        (g) => `
          <label style="display:flex; align-items:center; gap:6px;">
            <input type="checkbox" class="chkGusto" value="${g.id_gustos}">
            ${escapeHtml(g.nombre_gusto)}
          </label>
        `
      )
      .join("");

    if (gustosSeleccionadosPendientes) {
      marcarGustosSeleccionados(gustosSeleccionadosPendientes);
      gustosSeleccionadosPendientes = null;
    }
  }

  function obtenerGustosSeleccionados() {
    return Array.from(document.querySelectorAll(".chkGusto:checked"))
      .map((chk) => parseInt(chk.value, 10))
      .filter((n) => !Number.isNaN(n));
  }

  function marcarGustosSeleccionados(ids) {
    const checkboxes = document.querySelectorAll(".chkGusto");
    if (!checkboxes.length) {
      gustosSeleccionadosPendientes = ids || [];
      return;
    }
    const setIds = new Set((ids || []).map((n) => parseInt(n, 10)));
    checkboxes.forEach((chk) => {
      chk.checked = setIds.has(parseInt(chk.value, 10));
    });
  }

  async function cargarGustosDeContacto(id_contacto) {
    try {
      const res = await fetch(
        `${API_CONTACTO_GUSTOS}?id_contacto=${id_contacto}`
      );
      if (!res.ok) {
        marcarGustosSeleccionados([]);
        return;
      }
      const data = await res.json();
      marcarGustosSeleccionados(data.gustos || []);
    } catch (e) {
      console.error("Error cargando gustos del contacto:", e);
      marcarGustosSeleccionados([]);
    }
  }

  async function cargarGustosParaContactos(ids) {
    gustosPorContacto = new Map();
    const unicos = Array.from(new Set(ids || [])).filter(
      (id) => Number.isFinite(id) && id > 0
    );
    if (!unicos.length) return;

    await Promise.all(
      unicos.map(async (id) => {
        try {
          const res = await fetch(`${API_CONTACTO_GUSTOS}?id_contacto=${id}`);
          if (!res.ok) return;
          const data = await res.json();
          gustosPorContacto.set(id, data.gustos || []);
        } catch (e) {
          console.error("Error cargando gustos del contacto:", e);
        }
      })
    );
  }

  async function guardarGustosDeContacto(id_contacto) {
    const gustos = obtenerGustosSeleccionados();
    try {
      const res = await fetch(API_CONTACTO_GUSTOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_contacto, gustos }),
      });
      return res.ok;
    } catch (e) {
      console.error("Error guardando gustos:", e);
      return false;
    }
  }

  // =======================
  // REGALOS (UI + IDEAS)
  // =======================
  const regalosPorGusto = {
    cine: [
      "Pack de palomitas gourmet + vasos coleccionables",
      "Proyector mini para casa",
      "Suscripcion streaming (tarjeta regalo)"
    ],
    videojuegos: [
      "Mando compatible con PC/Consola",
      "Tarjeta regalo de plataforma",
      "Soporte de carga para mandos"
    ],
    arte: [
      "Set de acuarelas profesionales",
      "Cuaderno de bocetos premium",
      "Kit de pinceles y lienzos"
    ],
    lectura: [
      "Libro bestseller del genero favorito",
      "Lampara de lectura recargable",
      "Marcapaginas metalico premium"
    ],
    musica: [
      "Altavoz bluetooth compacto",
      "Auriculares inalambricos",
      "Vinilo o CD de su artista favorito"
    ],
    viajar: [
      "Organizador de equipaje",
      "Funda para pasaporte + tags",
      "Botella termica de viaje"
    ],
  };

  function normalizarGustoKey(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function poblarSelectRegalos() {
    if (!regaloContactoSelect) return;
    regaloContactoSelect.innerHTML =
      '<option value="">Selecciona un contacto</option>';
    contactos.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = String(c.id);
      opt.textContent = `${c.nombre} ${c.apellido}`;
      regaloContactoSelect.appendChild(opt);
    });
  }

  function obtenerGustosRegaloSeleccionados() {
    return Array.from(document.querySelectorAll(".chkGustoRegalo:checked"))
      .map((chk) => parseInt(chk.value, 10))
      .filter((n) => !Number.isNaN(n));
  }

  function marcarGustosRegaloSeleccionados(ids) {
    const checkboxes = document.querySelectorAll(".chkGustoRegalo");
    if (!checkboxes.length) return;
    const setIds = new Set((ids || []).map((n) => parseInt(n, 10)));
    checkboxes.forEach((chk) => {
      chk.checked = setIds.has(parseInt(chk.value, 10));
    });
  }

  function obtenerContactoRegaloSeleccionado() {
    if (!regaloContactoSelect) return null;
    const id = Number(regaloContactoSelect.value);
    if (!id) return null;
    return contactos.find((c) => c.id === id) || null;
  }

  function getGustosNombresPorContacto(contactoId) {
    const gustosIds = gustosPorContacto.get(contactoId) || [];
    if (!gustosIds.length || !gustosDisponibles.length) return [];
    const mapa = new Map(
      gustosDisponibles.map((g) => [Number(g.id_gustos), g.nombre_gusto])
    );
    return gustosIds
      .map((id) => mapa.get(Number(id)))
      .filter(Boolean)
      .map((g) => g.toLowerCase());
  }

  function getGustosNombresSeleccionadosRegalo() {
    const ids = obtenerGustosRegaloSeleccionados();
    if (!ids.length || !gustosDisponibles.length) return [];
    const mapa = new Map(
      gustosDisponibles.map((g) => [Number(g.id_gustos), g.nombre_gusto])
    );
    return ids.map((id) => mapa.get(Number(id))).filter(Boolean);
  }

  function cargarPreferenciaRegalo(contactoId) {
    if (!regaloDeseadoCheck) return;
    const key = `regalo_${USER_ID}_${contactoId}`;
    const val = localStorage.getItem(key);
    regaloDeseadoCheck.checked = val === "1";
  }

  function guardarPreferenciaRegalo(contactoId) {
    if (!regaloDeseadoCheck) return;
    const key = `regalo_${USER_ID}_${contactoId}`;
    localStorage.setItem(key, regaloDeseadoCheck.checked ? "1" : "0");
  }

  function setRegaloStatus(texto, ok) {
    if (!regaloStatus) return;
    regaloStatus.textContent = texto;
    regaloStatus.style.color = ok ? "#2e7d32" : "#c0392b";
  }

  function syncPrecioRegaloLabels() {
    if (regaloPrecioMin && regaloPrecioMax) {
      let min = Number(regaloPrecioMin.value);
      let max = Number(regaloPrecioMax.value);
      if (Number.isFinite(min) && Number.isFinite(max) && min > max) {
        const temp = min;
        min = max;
        max = temp;
        regaloPrecioMin.value = String(min);
        regaloPrecioMax.value = String(max);
      }
      if (regaloPrecioMinValor) regaloPrecioMinValor.textContent = min;
      if (regaloPrecioMaxValor) regaloPrecioMaxValor.textContent = max;
      return;
    }
    if (regaloPrecioMin && regaloPrecioMinValor) {
      regaloPrecioMinValor.textContent = regaloPrecioMin.value;
    }
    if (regaloPrecioMax && regaloPrecioMaxValor) {
      regaloPrecioMaxValor.textContent = regaloPrecioMax.value;
    }
  }

  function crearIdeasDesdeGustos(gustosNombres, nombre) {
    let ideas = [];
    gustosNombres.forEach((g) => {
      const key = normalizarGustoKey(g);
      const base = regalosPorGusto[key] || [];
      if (base.length) {
        ideas = ideas.concat(
          base.map((item) => ({
            title: `${nombre} - ${item}`,
            item,
            gusto: g,
          }))
        );
      } else if (g) {
        ideas.push({
          title: `${nombre} - Regalo relacionado con ${g}`,
          item: `Regalo relacionado con ${g}`,
          gusto: g,
        });
      }
    });
    if (!ideas.length) {
      ideas = [
        {
          title: `${nombre} - Tarjeta personalizada`,
          item: "Tarjeta personalizada",
          gusto: "",
        },
        {
          title: `${nombre} - Caja regalo sorpresa`,
          item: "Caja regalo sorpresa",
          gusto: "",
        },
        {
          title: `${nombre} - Cupon experiencia`,
          item: "Cupon experiencia",
          gusto: "",
        },
      ];
    }
    return ideas;
  }

  function construirLinkAmazon(idea, min, max) {
    let query = idea.item || idea.title;
    if (idea.gusto) query += ` ${idea.gusto}`;
    if (Number.isFinite(min) || Number.isFinite(max)) {
      const minTxt = Number.isFinite(min) ? min : "";
      const maxTxt = Number.isFinite(max) ? max : "";
      query += ` ${minTxt}-${maxTxt} euros`;
    }
    return `https://www.amazon.es/s?k=${encodeURIComponent(query)}`;
  }

  function renderIdeasRegalo(ideas, min, max) {
    if (!ideasContainer) return;
    if (!ideas.length) {
      ideasContainer.innerHTML = `<p class="info">Sin ideas para mostrar.</p>`;
      return;
    }
    ideasContainer.innerHTML = ideas
      .map((idea) => {
        const link = construirLinkAmazon(idea, min, max);
        const gusto = idea.gusto ? `Gusto: ${idea.gusto}` : "";
        return `
          <div class="idea">
            <div>${escapeHtml(idea.title)}</div>
            ${gusto ? `<div class="idea-gusto">${escapeHtml(gusto)}</div>` : ""}
            <a href="${link}" target="_blank" rel="noopener noreferrer">Buscar en Amazon</a>
          </div>
        `;
      })
      .join("");
  }

  function generarIdeasRegalo(contacto) {
    if (!contacto) {
      setRegaloStatus("Selecciona un contacto.", false);
      if (ideasContainer) ideasContainer.innerHTML = "";
      return;
    }
    if (regaloDeseadoCheck && !regaloDeseadoCheck.checked) {
      setRegaloStatus("Marcado como no regalar.", false);
      if (ideasContainer) ideasContainer.innerHTML = "";
      return;
    }

    let min = regaloPrecioMin ? Number(regaloPrecioMin.value) : null;
    let max = regaloPrecioMax ? Number(regaloPrecioMax.value) : null;
    if (Number.isFinite(min) && Number.isFinite(max) && min > max) {
      const temp = min;
      min = max;
      max = temp;
      if (regaloPrecioMin) regaloPrecioMin.value = String(min);
      if (regaloPrecioMax) regaloPrecioMax.value = String(max);
      syncPrecioRegaloLabels();
    }

    const gustosContacto = getGustosNombresPorContacto(contacto.id);
    const gustosSeleccionados = getGustosNombresSeleccionadosRegalo();
    const gustosBase = gustosSeleccionados.length
      ? gustosSeleccionados
      : gustosContacto;
    const ideas = crearIdeasDesdeGustos(gustosBase, contacto.nombre);
    renderIdeasRegalo(ideas, min, max);
    setRegaloStatus("Ideas generadas.", true);
  }

  // =======================
  // EMAILS (simulado local)
  // =======================
  const emailTemplates = {
    predef_1:
      "Feliz cumpleanos, {{nombre}} {{apellido}}! Te deseamos un gran dia.",
    predef_2: "Feliz cumpleanos, {{nombre}}!",
  };

  function poblarSelectContactosEmail() {
    if (!emailContactoSelect) return;
    emailContactoSelect.innerHTML =
      '<option value="">Selecciona un contacto</option>';
    contactos.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = String(c.id);
      opt.textContent = `${c.nombre} ${c.apellido} (${c.email})`;
      emailContactoSelect.appendChild(opt);
    });
  }

  function obtenerContactoSeleccionado() {
    if (!emailContactoSelect) return null;
    const id = Number(emailContactoSelect.value);
    if (!id) return null;
    return contactos.find((c) => c.id === id) || null;
  }

  function construirMensaje(templateId, contacto) {
    const base = emailTemplates[templateId] || "";
    return base
      .replace("{{nombre}}", contacto.nombre || "")
      .replace("{{apellido}}", contacto.apellido || "")
      .trim();
  }

  function obtenerMensajeEmail(contacto) {
    if (!emailTemplateSelect || !emailMensajePersonalizado) return "";
    const tipo = emailTemplateSelect.value;
    if (tipo === "personalizado") {
      return emailMensajePersonalizado.value.trim();
    }
    return construirMensaje(tipo, contacto);
  }

  function actualizarVisibilidadMensajePersonalizado() {
    if (!emailTemplateSelect || !emailMensajePersonalizado) return;
    const esPersonalizado = emailTemplateSelect.value === "personalizado";
    emailMensajePersonalizado.style.display = esPersonalizado ? "block" : "none";
  }

  function setEmailStatus(texto, ok) {
    if (!emailStatus) return;
    emailStatus.textContent = texto;
    emailStatus.style.color = ok ? "#2e7d32" : "#c0392b";
  }

  function calcularProximoCumple(fecha) {
    if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return null;
    const partes = fecha.split("-");
    const month = Number(partes[1]) - 1;
    const day = Number(partes[2]);
    const now = new Date();
    let target = new Date(now.getFullYear(), month, day, 9, 0, 0);
    if (target < now) {
      target = new Date(now.getFullYear() + 1, month, day, 9, 0, 0);
    }
    return target.toISOString();
  }

  function construirPayloadEmail(contacto, scheduledAt, mode) {
    const subject = emailSubjectEl ? emailSubjectEl.value.trim() : "";
    const message = obtenerMensajeEmail(contacto);
    return {
      to_email: contacto.email,
      to_name: `${contacto.nombre} ${contacto.apellido}`,
      subject: subject || "Feliz cumpleanos",
      message,
      contact_id: contacto.id,
      mode,
      scheduled_at: scheduledAt || null,
    };
  }

  async function enviarEmailSimulado(payload) {
    const res = await fetch(API_EMAILS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send", ...payload }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "No se pudo enviar");
    }
    return data;
  }

  async function programarEmailSimulado(payload) {
    const res = await fetch(API_EMAILS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "queue", ...payload }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "No se pudo programar");
    }
    return data;
  }

  async function procesarColaProgramados() {
    const res = await fetch(API_EMAILS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "process" }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "No se pudo procesar");
    }
    return data;
  }

  // =======================
  // PERFIL (localStorage)
  // =======================
  function cargarPerfilGuardado() {
    const savedName = localStorage.getItem(`username_${USER_ID}`);
    const savedPic = localStorage.getItem(`profilePic_${USER_ID}`);
    const defaultFoto = "../assets/no-profile.jpg";

    const nombreSesion = document.getElementById("userName")
      ? document.getElementById("userName").textContent.trim()
      : "";

    if (savedName) {
      if (settingsUsername) settingsUsername.textContent = savedName;
      if (sidebarUserName) sidebarUserName.textContent = savedName;

      const saludoUsuario = document.getElementById("saludoUsuario");
      if (saludoUsuario) {
        saludoUsuario.innerHTML = `¡Hola, <span id="userName">${escapeHtml(
          savedName
        )}</span>!`;
      }
    } else if (nombreSesion) {
      if (settingsUsername) settingsUsername.textContent = nombreSesion;
      if (sidebarUserName) sidebarUserName.textContent = nombreSesion;
    } else {
      if (settingsUsername) settingsUsername.textContent = "Usuario";
      if (sidebarUserName) sidebarUserName.textContent = "Usuario";
    }

    if (sidebarPic) sidebarPic.src = savedPic || defaultFoto;
    if (settingsPic) settingsPic.src = savedPic || defaultFoto;
  }

  if (btnEditarNombre) {
    btnEditarNombre.addEventListener("click", () => {
      const nuevo = prompt("Introduce tu nuevo nombre:");
      if (nuevo && nuevo.trim() !== "") {
        if (sidebarUserName) sidebarUserName.textContent = nuevo;
        if (settingsUsername) settingsUsername.textContent = nuevo;

        const saludoUsuario = document.getElementById("saludoUsuario");
        if (saludoUsuario) {
          saludoUsuario.innerHTML = `¡Hola, <span id="userName">${escapeHtml(
            nuevo
          )}</span>!`;
        }

        localStorage.setItem(`username_${USER_ID}`, nuevo);
      }
    });
  }

  if (btnEditarFoto && inputFoto) {
    btnEditarFoto.addEventListener("click", () => inputFoto.click());

    inputFoto.addEventListener("change", () => {
      const file = inputFoto.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const fotoData = e.target.result;
        if (sidebarPic) sidebarPic.src = fotoData;
        if (settingsPic) settingsPic.src = fotoData;
        localStorage.setItem(`profilePic_${USER_ID}`, fotoData);
      };
      reader.readAsDataURL(file);
    });
  }

  // =======================
  // PANEL + CALENDARIO
  // =======================
  let currentDate = new Date();

  function actualizarPanel() {
    const mesActual = currentDate.getMonth() + 1;
    const cumpleMes = contactos.filter((c) => {
      if (!c.fecha_nacimiento) return false;
      const parts = c.fecha_nacimiento.split("-");
      return Number(parts[1]) === mesActual;
    });
    if (cantidadMesEl)
      cantidadMesEl.textContent = `${cumpleMes.length} personas cumplen años este mes`;
    renderCalendar();
  }

  function showSection(name) {
    document.querySelectorAll(".section").forEach((s) => {
      s.style.display = s.id === `seccion-${name}` ? "" : "none";
    });

    navButtons.forEach((b) =>
      b.classList.toggle("active", b.dataset.section === name)
    );

    if (sidebar) sidebar.classList.remove("active");
    if (menuToggle) menuToggle.classList.remove("active");
  }

  // =======================
  // CONTACTOS (tabla + acciones)
  // =======================
  function renderContactos() {
    const buscador = document.getElementById("buscadorContactos");
    let filtro = "";
    if (buscador) filtro = buscador.value.trim().toLowerCase();

    let filtrados = contactos;
    if (filtro) {
      const normalizar = (str) =>
        (str || "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

      filtrados = contactos.filter(
        (c) =>
          (c.nombre && normalizar(c.nombre).includes(normalizar(filtro))) ||
          (c.apellido && normalizar(c.apellido).includes(normalizar(filtro)))
      );
    }

    if (categoriaFiltroActiva) {
      const categoriaId = Number(categoriaFiltroActiva);
      filtrados = filtrados.filter((c) => {
        const categorias = categoriasPorContacto.get(c.id) || [];
        return categorias.includes(categoriaId);
      });
    }

    if (!listaContactosEl) return;

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
            <th>Categorías</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;

    filtrados.forEach((c) => {
      html += `
        <tr>
          <td>${escapeHtml(c.nombre)}</td>
          <td>${escapeHtml(c.apellido)}</td>
          <td>${escapeHtml(c.email)}</td>
          <td>${escapeHtml(c.fecha_nacimiento)}</td>
          <td>${escapeHtml(obtenerTextoCategorias(categoriasPorContacto.get(c.id)))}</td>
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

    listaContactosEl.querySelectorAll(".editar").forEach((a) =>
      a.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;
        abrirModalEditar(Number(link.dataset.id));
      })
    );

    listaContactosEl.querySelectorAll(".eliminar").forEach((a) =>
      a.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;
        eliminarContactoConfirm(Number(link.dataset.id));
      })
    );

    listaContactosEl.querySelectorAll(".ideas").forEach((a) =>
      a.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;
        mostrarIdeas(Number(link.dataset.id));
        showSection("regalos");
      })
    );
  }

  // =======================
  // MODAL (nuevo / editar / cerrar)
  // =======================
  function abrirModalNuevo() {
    if (contactoIdEl) contactoIdEl.value = "";
    if (nombreContactoEl) nombreContactoEl.value = "";
    if (apellidoContactoEl) apellidoContactoEl.value = "";
    if (emailContactoEl) emailContactoEl.value = "";
    if (fechaContactoEl) fechaContactoEl.value = "";

    const title = document.getElementById("modalTitle");
    if (title) title.textContent = "Añadir contacto";

    const err = document.getElementById("formContactoError");
    if (err) err.textContent = "";

    marcarCategoriasSeleccionadas([]);
    marcarGustosSeleccionados([]);
    if (modalOverlay) modalOverlay.classList.add("active");
  }

  function abrirModalEditar(id) {
    const c = contactos.find((x) => x.id === id);
    if (!c) return;

    if (contactoIdEl) contactoIdEl.value = c.id;
    if (nombreContactoEl) nombreContactoEl.value = c.nombre;
    if (apellidoContactoEl) apellidoContactoEl.value = c.apellido;
    if (emailContactoEl) emailContactoEl.value = c.email;

    if (fechaContactoEl) {
      if (
        c.fecha_nacimiento &&
        /^\d{4}-\d{2}-\d{2}$/.test(c.fecha_nacimiento)
      ) {
        const partes = c.fecha_nacimiento.split("-");
        fechaContactoEl.value = `${partes[2]}/${partes[1]}/${partes[0]}`;
      } else {
        fechaContactoEl.value = c.fecha_nacimiento || "";
      }
    }

    const title = document.getElementById("modalTitle");
    if (title) title.textContent = "Editar contacto";

    const err = document.getElementById("formContactoError");
    if (err) err.textContent = "";

    cargarCategoriasDeContacto(id);
    cargarGustosDeContacto(id);
    if (modalOverlay) modalOverlay.classList.add("active");
  }

  function cerrarModal() {
    if (modalOverlay) modalOverlay.classList.remove("active");
  }

  // =======================
  // GUARDAR CONTACTO (POST/PUT) + CATEGORÍAS
  // =======================
  function guardarContactoFromForm(e) {
    e.preventDefault();

    const btn = document.querySelector('#formContacto button[type="submit"]');
    if (btn && btn.disabled) return;

    const id =
      contactoIdEl && contactoIdEl.value ? Number(contactoIdEl.value) : null;

    const nombre = nombreContactoEl.value.trim();
    const apellido = apellidoContactoEl.value.trim();
    const email = emailContactoEl.value.trim();
    const fecha = fechaContactoEl.value.trim();

    // Convertir DD/MM/YYYY a YYYY-MM-DD
    const partes = fecha.split("/");
    const fechaBD = partes.length === 3 ? `${partes[2]}-${partes[1]}-${partes[0]}` : null;

    if (id) {
      fetch("../php/api_contactos.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nombre, apellido, email, fecha_nacimiento: fechaBD }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.success) {
            await guardarCategoriasDeContacto(id);
            await guardarGustosDeContacto(id);
            cerrarModal();
            await cargarContactosBD();
            renderContactos();
            actualizarPanel();
          } else {
            alert(data.error || "Error al editar el contacto");
          }
        })
        .catch(() => alert("Error de conexión al editar el contacto"));
    } else {
      fetch("../php/api_contactos.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, email, fecha_nacimiento: fechaBD }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.success) {
            // ✅ soporta id_contacto o id según el backend
            const nuevoId = data.id_contacto || data.id;
            if (nuevoId) {
              await guardarCategoriasDeContacto(Number(nuevoId));
              await guardarGustosDeContacto(Number(nuevoId));
            }

            cerrarModal();
            await cargarContactosBD();
            renderContactos();
            actualizarPanel();
          } else {
            alert(data.error || "Error al guardar el contacto");
          }
        })
        .catch(() => alert("Error de conexión al guardar el contacto"));
    }
  }

  // =======================
  // ELIMINAR CONTACTO
  // =======================
  function eliminarContactoConfirm(id) {
    if (!confirm("¿Eliminar contacto?")) return;

    fetch("../php/api_contactos.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success) {
          await cargarContactosBD();
          renderContactos();
          actualizarPanel();
        } else {
          alert(data.error || "Error al eliminar el contacto");
        }
      })
      .catch(() => alert("Error de conexión al eliminar el contacto"));
  }

  // =======================
  // FELICITACIONES
  // =======================
  function generarFelicitaciones() {
    const mesActual = currentDate.getMonth() + 1;
    const cumpleMes = contactos.filter(
      (c) =>
        c.fecha_nacimiento &&
        Number(c.fecha_nacimiento.split("-")[1]) === mesActual
    );

    if (cumpleMes.length === 0) {
      mostrarModalFelicitaciones(`<p class="info">No hay cumpleaños este mes.</p>`);
      return;
    }

    const mensajes = cumpleMes
      .map(
        (c) =>
          `<div class="mensaje-felicitacion"><span>¡Feliz cumpleaños, <b>${escapeHtml(
            c.nombre
          )} ${escapeHtml(
            c.apellido
          )}</b>! <i class='fa-solid fa-cake-candles'></i></span></div>`
      )
      .join("");

    window._felicitacionesPendientes = cumpleMes.map(
      (c) =>
        `¡Feliz cumpleaños, <b>${escapeHtml(c.nombre)} ${escapeHtml(
          c.apellido
        )}</b>! <i class='fa-solid fa-cake-candles'></i>`
    );

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
        let historial = JSON.parse(
          localStorage.getItem("historialFelicitaciones") || "[]"
        );
        if (
          window._felicitacionesPendientes &&
          window._felicitacionesPendientes.length
        ) {
          historial = historial.concat(window._felicitacionesPendientes);
          localStorage.setItem(
            "historialFelicitaciones",
            JSON.stringify(historial)
          );
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
    }
  }

  // =======================
  // NOTIFICACIONES (admin broadcast)
  // =======================
  function renderNotificaciones(items) {
    if (!notificacionesList) return;
    if (!items || items.length === 0) {
      notificacionesList.innerHTML = `<p class="info">No hay notificaciones.</p>`;
      return;
    }

    notificacionesList.innerHTML = items
      .map((n) => {
        const subject = escapeHtml(n.subject || "Mensaje");
        const message = escapeHtml(n.message || "");
        const sentAt = n.sent_at ? new Date(n.sent_at) : null;
        const when =
          sentAt && !Number.isNaN(sentAt.getTime())
            ? sentAt.toLocaleString("es-ES")
            : "";
        return `
          <div class="notificacion-item">
            <h4>${subject}</h4>
            <div>${message}</div>
            ${when ? `<div class="notificacion-meta">${when}</div>` : ""}
          </div>
        `;
      })
      .join("");
  }

  async function cargarNotificaciones() {
    if (!notificacionesList) return;
    if (notificacionesStatus) notificacionesStatus.textContent = "";
    notificacionesList.innerHTML = `<p class="info">Cargando...</p>`;
    try {
      const res = await fetch(API_NOTIFICACIONES);
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Error cargando notificaciones.");
      }
      renderNotificaciones(data.data || []);
    } catch (e) {
      if (notificacionesStatus)
        notificacionesStatus.textContent = e.message || "Error cargando notificaciones.";
      notificacionesList.innerHTML = `<p class="info">No hay notificaciones.</p>`;
    }
  }

  // =======================
  // IDEAS REGALOS (demo)
  // =======================
  function mostrarIdeas(contactId) {
    const c = contactos.find((x) => x.id === contactId);
    if (!ideasContainer) return;

    ideasContainer.innerHTML = "";

    if (!c) {
      ideasContainer.innerHTML = `<p class="info">Contacto no encontrado.</p>`;
      return;
    }

    if (regaloContactoSelect) {
      regaloContactoSelect.value = String(c.id);
      cargarPreferenciaRegalo(c.id);
      const gustosIds = gustosPorContacto.get(c.id) || [];
      marcarGustosRegaloSeleccionados(gustosIds);
    }
    generarIdeasRegalo(c);
  }

  // =======================
  // CALENDARIO
  // =======================
  function renderCalendar() {
    if (!calendarGrid || !calendarMonth) return;

    calendarGrid.innerHTML = "";

    const monthName = currentDate.toLocaleString("es-ES", { month: "long" });
    calendarMonth.textContent =
      monthName.charAt(0).toUpperCase() +
      monthName.slice(1) +
      " " +
      currentDate.getFullYear();

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

      const todayBirthdays = contactos.filter((c) => {
        if (!c.fecha_nacimiento) return false;
        const parts = c.fecha_nacimiento.split("-");
        return parts[1] === mm && parts[2] === dd;
      });

      if (todayBirthdays.length > 0) {
        dayElement.classList.add("birthday");

        const namesContainer = document.createElement("div");
        namesContainer.className = "names";

        todayBirthdays.slice(0, 2).forEach((b) => {
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

  // =======================
  // EVENTOS UI
  // =======================
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      actualizarPanel();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      actualizarPanel();
    });
  }

  if (btnAddContacto) btnAddContacto.addEventListener("click", abrirModalNuevo);
  if (btnAddContacto2)
    btnAddContacto2.addEventListener("click", abrirModalNuevo);

  if (btnLimpiarContactos) {
    btnLimpiarContactos.addEventListener("click", async () => {
      if (!confirm("¿Eliminar TODOS los contactos?")) return;
      try {
        const res = await fetch("../php/api_contactos.php", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eliminar_todos: true }),
        });
        const data = await res.json();
        if (data.success) {
          await cargarContactosBD();
          renderContactos();
          actualizarPanel();
        } else {
          alert(data.error || "Error al eliminar todos los contactos");
        }
      } catch {
        alert("Error de conexión al eliminar todos los contactos");
      }
    });
  }

  if (btnVerCumples) {
    btnVerCumples.addEventListener("click", () => {
      showSection("contactos");
      renderContactos();
    });
  }

  if (btnGenerarMensajes)
    btnGenerarMensajes.addEventListener("click", generarFelicitaciones);

  if (btnAgregarGusto && nuevoGustoInput) {
    btnAgregarGusto.addEventListener("click", async () => {
      const nombre = nuevoGustoInput.value.trim();
      if (!nombre) return;
      try {
        await crearGusto(nombre);
        nuevoGustoInput.value = "";
        await cargarGustosDisponibles();
      } catch (e) {
        alert(e.message);
      }
    });
  }

  if (emailTemplateSelect) {
    emailTemplateSelect.addEventListener("change", () => {
      actualizarVisibilidadMensajePersonalizado();
    });
    actualizarVisibilidadMensajePersonalizado();
  }

  if (btnEnviarEmailAhora) {
    btnEnviarEmailAhora.addEventListener("click", async () => {
      const contacto = obtenerContactoSeleccionado();
      if (!contacto) {
        setEmailStatus("Selecciona un contacto.", false);
        return;
      }
      const mensaje = obtenerMensajeEmail(contacto);
      if (!mensaje) {
        setEmailStatus("Escribe o selecciona un mensaje.", false);
        return;
      }
      try {
        const payload = construirPayloadEmail(contacto, null, "manual");
        await enviarEmailSimulado(payload);
        setEmailStatus("Email enviado (simulado).", true);
      } catch (e) {
        setEmailStatus(e.message, false);
      }
    });
  }

  if (btnProgramarEmail) {
    btnProgramarEmail.addEventListener("click", async () => {
      const contacto = obtenerContactoSeleccionado();
      if (!contacto) {
        setEmailStatus("Selecciona un contacto.", false);
        return;
      }
      const fecha = emailFechaProgramada ? emailFechaProgramada.value : "";
      if (!fecha) {
        setEmailStatus("Selecciona fecha y hora.", false);
        return;
      }
      const mensaje = obtenerMensajeEmail(contacto);
      if (!mensaje) {
        setEmailStatus("Escribe o selecciona un mensaje.", false);
        return;
      }
      try {
        const scheduledAt = new Date(fecha).toISOString();
        const payload = construirPayloadEmail(contacto, scheduledAt, "programado");
        await programarEmailSimulado(payload);
        setEmailStatus("Email programado.", true);
      } catch (e) {
        setEmailStatus(e.message, false);
      }
    });
  }

  if (btnProgramarCumple) {
    btnProgramarCumple.addEventListener("click", async () => {
      const contacto = obtenerContactoSeleccionado();
      if (!contacto) {
        setEmailStatus("Selecciona un contacto.", false);
        return;
      }
      const scheduledAt = calcularProximoCumple(contacto.fecha_nacimiento);
      if (!scheduledAt) {
        setEmailStatus("El contacto no tiene fecha valida.", false);
        return;
      }
      const mensaje = obtenerMensajeEmail(contacto);
      if (!mensaje) {
        setEmailStatus("Escribe o selecciona un mensaje.", false);
        return;
      }
      try {
        const payload = construirPayloadEmail(
          contacto,
          scheduledAt,
          "cumpleanos"
        );
        await programarEmailSimulado(payload);
        setEmailStatus("Email programado para cumpleanos.", true);
      } catch (e) {
        setEmailStatus(e.message, false);
      }
    });
  }

  if (btnProcesarProgramados) {
    btnProcesarProgramados.addEventListener("click", async () => {
      try {
        const data = await procesarColaProgramados();
        setEmailStatus(
          `Procesados: ${data.procesados || 0}, pendientes: ${
            data.pendientes || 0
          }`,
          true
        );
      } catch (e) {
        setEmailStatus(e.message, false);
      }
    });
  }

  if (btnVerIdeas) {
    btnVerIdeas.addEventListener("click", () => {
      showSection("regalos");
      if (ideasContainer) ideasContainer.innerHTML = "";
    });
  }

  if (btnRefrescarNotificaciones) {
    btnRefrescarNotificaciones.addEventListener("click", () => {
      cargarNotificaciones();
    });
  }

  if (regaloContactoSelect) {
    regaloContactoSelect.addEventListener("change", () => {
      const contacto = obtenerContactoRegaloSeleccionado();
      if (contacto) {
        cargarPreferenciaRegalo(contacto.id);
        const gustosIds = gustosPorContacto.get(contacto.id) || [];
        marcarGustosRegaloSeleccionados(gustosIds);
        setRegaloStatus("", true);
      }
    });
  }

  if (regaloDeseadoCheck) {
    regaloDeseadoCheck.addEventListener("change", () => {
      const contacto = obtenerContactoRegaloSeleccionado();
      if (contacto) guardarPreferenciaRegalo(contacto.id);
    });
  }

  if (btnBuscarRegalos) {
    btnBuscarRegalos.addEventListener("click", () => {
      const contacto = obtenerContactoRegaloSeleccionado();
      generarIdeasRegalo(contacto);
    });
  }

  if (regaloPrecioMin) {
    regaloPrecioMin.addEventListener("input", () => {
      syncPrecioRegaloLabels();
    });
  }

  if (regaloPrecioMax) {
    regaloPrecioMax.addEventListener("input", () => {
      syncPrecioRegaloLabels();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.location.href = "../logout.php";
    });
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      showSection(btn.dataset.section);
      if (btn.dataset.section === "contactos") renderContactos();
      if (btn.dataset.section === "notificaciones") cargarNotificaciones();
    });
  });

  const buscador = document.getElementById("buscadorContactos");
  if (buscador) buscador.addEventListener("input", renderContactos);

  if (btnBuscarCategoria) {
    btnBuscarCategoria.addEventListener("click", () => {
      categoriaFiltroActiva = filtroCategoriaEl
        ? filtroCategoriaEl.value
        : null;
      renderContactos();
    });
  }

  if (btnLimpiarFiltroCategoria) {
    btnLimpiarFiltroCategoria.addEventListener("click", () => {
      categoriaFiltroActiva = null;
      if (filtroCategoriaEl) filtroCategoriaEl.value = "";
      renderContactos();
    });
  }

  if (btnCerrarModal) btnCerrarModal.addEventListener("click", cerrarModal);

  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) cerrarModal();
    });
  }

  if (formContacto)
    formContacto.addEventListener("submit", guardarContactoFromForm);

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      if (sidebar) sidebar.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modalOverlay && modalOverlay.classList.contains("active"))
        cerrarModal();
      if (sidebar) sidebar.classList.remove("active");
      if (menuToggle) menuToggle.classList.remove("active");
    }
  });

  // =======================
  // INICIO
  // =======================
  cargarPerfilGuardado();
  cargarCategoriasDisponibles();
  cargarGustosDisponibles();
  cargarNotificaciones();

  cargarContactosBD().then(() => {
    actualizarPanel();
    renderContactos();
    renderCalendar();
    procesarColaProgramados().catch(() => {});
  });
});

// =======================
// HELPERS
// =======================
function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[m]));
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
