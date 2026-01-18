document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".section");
  const contenedor = document.getElementById("contenedor-tabla");
  const adminSearch = document.getElementById("adminSearch");
  const adminTipo = document.getElementById("adminTipo");
  const adminEstado = document.getElementById("adminEstado");
  const adminDesde = document.getElementById("adminDesde");
  const adminHasta = document.getElementById("adminHasta");
  const btnBuscarUsuarios = document.getElementById("btnBuscarUsuarios");
  const btnLimpiarUsuarios = document.getElementById("btnLimpiarUsuarios");
  const importFile = document.getElementById("importFile");
  const btnImportCsv = document.getElementById("btnImportCsv");
  const importStatus = document.getElementById("importStatus");

  const statTotal = document.getElementById("statTotal");
  const statAdmins = document.getElementById("statAdmins");
  const statBloqueados = document.getElementById("statBloqueados");
  const statCategorias = document.getElementById("statCategorias");
  const statGustos = document.getElementById("statGustos");

  const catInput = document.getElementById("catInput");
  const btnAddCat = document.getElementById("btnAddCat");
  const catList = document.getElementById("catList");

  const gustoInput = document.getElementById("gustoInput");
  const btnAddGusto = document.getElementById("btnAddGusto");
  const gustoList = document.getElementById("gustoList");

  const broadcastSubject = document.getElementById("broadcastSubject");
  const broadcastMessage = document.getElementById("broadcastMessage");
  const btnBroadcast = document.getElementById("btnBroadcast");
  const broadcastStatus = document.getElementById("broadcastStatus");

  const adminLogs = document.getElementById("adminLogs");

  async function fetchJson(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return { ok: res.ok, data, text };
    } catch {
      return { ok: false, data: null, text };
    }
  }

  function setStatus(el, text, ok) {
    if (!el) return;
    el.textContent = text;
    el.style.color = ok ? "#2e7d32" : "#c0392b";
  }

  function showSection(name) {
    sections.forEach((s) => {
      s.style.display = s.id === `seccion-${name}` ? "" : "none";
    });
    navButtons.forEach((b) =>
      b.classList.toggle("active", b.dataset.section === name)
    );
  }

  async function loadStats() {
    try {
      const { ok, data, text } = await fetchJson("api_admin_stats.php");
      if (!ok || !data || data.error) {
        if (statTotal) statTotal.textContent = "Error";
        if (statAdmins) statAdmins.textContent = "Error";
        if (statBloqueados) statBloqueados.textContent = "Error";
        if (statCategorias) statCategorias.textContent = "Error";
        if (statGustos) statGustos.textContent = "Error";
        console.error("Stats error:", text);
        return;
      }
      if (statTotal) statTotal.textContent = data.total_usuarios;
      if (statAdmins) statAdmins.textContent = data.total_admins;
      if (statBloqueados) statBloqueados.textContent = data.total_bloqueados;
      if (statCategorias) statCategorias.textContent = data.total_categorias;
      if (statGustos) statGustos.textContent = data.total_gustos;
    } catch {
      if (statTotal) statTotal.textContent = "Error";
    }
  }

  function buildQuery() {
    const params = new URLSearchParams();
    if (adminTipo && adminTipo.value) params.append("tipo", adminTipo.value);
    if (adminSearch && adminSearch.value.trim()) params.append("q", adminSearch.value.trim());
    if (adminDesde && adminDesde.value) params.append("desde", adminDesde.value);
    if (adminHasta && adminHasta.value) params.append("hasta", adminHasta.value);
    if (adminEstado && adminEstado.value) params.append("estado", adminEstado.value);
    return params.toString();
  }

  async function loadUsuarios() {
    if (!contenedor) return;
    contenedor.innerHTML = "<p>Cargando...</p>";
    try {
      const qs = buildQuery();
      const { ok, data, text } = await fetchJson(`api_usuarios.php?${qs}`);
      if (!ok || !data || data.error) {
        contenedor.innerHTML = `<p>Error al cargar usuarios.</p>`;
        console.error("Usuarios error:", text);
        return;
      }
      renderTabla(data);
    } catch {
      contenedor.innerHTML = "<p>Error al cargar los datos.</p>";
    }
  }

  function renderTabla(usuarios) {
    if (!usuarios.length) {
      contenedor.innerHTML = "<p>No se encontraron usuarios.</p>";
      return;
    }

    let html = `
      <table class="tabla-usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Fecha Nacimiento</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;

    usuarios.forEach((u) => {
      const esAdmin = u.id_rol == 1;
      const estado = u.estado || "activo";
      const bloqueado = estado === "bloqueado";
      html += `
        <tr>
          <td>${u.id_usuario}</td>
          <td>${u.nombre}</td>
          <td>${u.email}</td>
          <td>${esAdmin ? "Admin" : "Usuario"}</td>
          <td>${estado}</td>
          <td>${u.fecha_nacimiento || ""}</td>
          <td>${u.fecha_registro || ""}</td>
          <td>
            <button class="btn ${esAdmin ? "degradar" : "ascender"}" data-accion="${esAdmin ? "degradar" : "ascender"}" data-id="${u.id_usuario}">
              ${esAdmin ? "Degradar" : "Hacer Admin"}
            </button>
            <button class="btn ${bloqueado ? "ascender" : "degradar"}" data-accion="${bloqueado ? "desbloquear" : "bloquear"}" data-id="${u.id_usuario}">
              ${bloqueado ? "Desbloquear" : "Bloquear"}
            </button>
            <button class="btn ascender" data-accion="reset" data-id="${u.id_usuario}">Reset</button>
            <button class="btn eliminar" data-accion="eliminar" data-id="${u.id_usuario}">Eliminar</button>
          </td>
        </tr>`;
    });

    html += "</tbody></table>";
    contenedor.innerHTML = html;
  }

  async function ejecutarAccion(accion, id) {
    const { ok, data, text } = await fetchJson("api_admin_actions.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion, id })
    });
    if (!ok || !data || !data.ok) {
      throw new Error((data && data.error) || text || "Accion fallida");
    }
    return data;
  }

  async function loadMeta(tipo, target) {
    const { ok, data, text } = await fetchJson(`api_admin_meta.php?tipo=${tipo}`);
    if (!ok || !data) {
      console.error("Meta error:", text);
      return;
    }
    if (!data.ok || !target) return;
    target.innerHTML = data.items
      .map((i) => `
        <div class="admin-item">
          <span>${i.nombre}</span>
          <button class="btn eliminar" data-meta="${tipo}" data-id="${i.id}">Eliminar</button>
        </div>
      `)
      .join("");
  }

  async function addMeta(tipo, nombre) {
    const { ok, data, text } = await fetchJson(`api_admin_meta.php?tipo=${tipo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre })
    });
    if (!ok || !data || !data.ok) {
      throw new Error((data && data.error) || text || "No se pudo agregar");
    }
    return data;
  }

  async function deleteMeta(tipo, id) {
    const { ok, data, text } = await fetchJson(`api_admin_meta.php?tipo=${tipo}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    if (!ok || !data || !data.ok) {
      throw new Error((data && data.error) || text || "No se pudo eliminar");
    }
    return data;
  }

  async function broadcast() {
    const subject = broadcastSubject ? broadcastSubject.value.trim() : "";
    const message = broadcastMessage ? broadcastMessage.value.trim() : "";
    if (!subject || !message) {
      setStatus(broadcastStatus, "Completa asunto y mensaje.", false);
      return;
    }
    const { ok, data, text } = await fetchJson("api_admin_broadcast.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message })
    });
    if (!ok || !data || !data.ok) {
      setStatus(broadcastStatus, (data && data.error) || text || "Error al enviar", false);
      return;
    }
    setStatus(broadcastStatus, `Enviados: ${data.total}`, true);
  }

  async function loadLogs() {
    if (!adminLogs) return;
    const { ok, data, text } = await fetchJson("api_admin_logs.php");
    if (!ok || !data) {
      adminLogs.innerHTML = "<p class=\"info\">Error cargando logs.</p>";
      console.error("Logs error:", text);
      return;
    }
    if (!Array.isArray(data) || !data.length) {
      adminLogs.innerHTML = "<p class=\"info\">Sin acciones.</p>";
      return;
    }
    const items = data.slice(-50).reverse();
    adminLogs.innerHTML = items
      .map((l) => `
        <div class="admin-log-item">
          <span>${l.created_at}</span>
          <span>Accion: ${l.action}</span>
          <span>Target: ${l.target_id}</span>
        </div>
      `)
      .join("");
  }

  if (btnBuscarUsuarios) {
    btnBuscarUsuarios.addEventListener("click", loadUsuarios);
  }

  if (btnLimpiarUsuarios) {
    btnLimpiarUsuarios.addEventListener("click", () => {
      if (adminSearch) adminSearch.value = "";
      if (adminTipo) adminTipo.value = "todos";
      if (adminEstado) adminEstado.value = "";
      if (adminDesde) adminDesde.value = "";
      if (adminHasta) adminHasta.value = "";
      loadUsuarios();
    });
  }

  if (btnImportCsv) {
    btnImportCsv.addEventListener("click", async () => {
      if (!importFile || !importFile.files.length) {
        setStatus(importStatus, "Selecciona un CSV.", false);
        return;
      }
      const formData = new FormData();
      formData.append("file", importFile.files[0]);
      const res = await fetch("api_admin_import.php", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus(importStatus, data.error || "Error al importar.", false);
        return;
      }
      setStatus(importStatus, `Insertados: ${data.inserted}, omitidos: ${data.skipped}`, true);
      loadUsuarios();
      loadStats();
    });
  }

  if (btnAddCat) {
    btnAddCat.addEventListener("click", async () => {
      const nombre = catInput ? catInput.value.trim() : "";
      if (!nombre) return;
      try {
        await addMeta("categoria", nombre);
        if (catInput) catInput.value = "";
        loadMeta("categoria", catList);
        loadStats();
      } catch (e) {
        setStatus(importStatus, e.message, false);
      }
    });
  }

  if (btnAddGusto) {
    btnAddGusto.addEventListener("click", async () => {
      const nombre = gustoInput ? gustoInput.value.trim() : "";
      if (!nombre) return;
      try {
        await addMeta("gusto", nombre);
        if (gustoInput) gustoInput.value = "";
        loadMeta("gusto", gustoList);
        loadStats();
      } catch (e) {
        setStatus(importStatus, e.message, false);
      }
    });
  }

  if (btnBroadcast) {
    btnBroadcast.addEventListener("click", broadcast);
  }

  if (contenedor) {
    contenedor.addEventListener("click", async (e) => {
      const btn = e.target.closest("button[data-accion]");
      if (!btn) return;
      const accion = btn.getAttribute("data-accion");
      const id = Number(btn.getAttribute("data-id"));
      if (!accion || !id) return;
      if (accion === "eliminar" && !confirm("Eliminar usuario?")) return;
      try {
        const data = await ejecutarAccion(accion, id);
        if (accion === "reset" && data.temp_password) {
          alert(`Nueva clave temporal: ${data.temp_password}`);
        }
        loadUsuarios();
        loadStats();
        loadLogs();
      } catch (err) {
        alert(err.message);
      }
    });
  }

  if (catList) {
    catList.addEventListener("click", async (e) => {
      const btn = e.target.closest("button[data-meta]");
      if (!btn) return;
      const tipo = btn.getAttribute("data-meta");
      const id = Number(btn.getAttribute("data-id"));
      if (!tipo || !id) return;
      if (!confirm("Eliminar item?")) return;
      await deleteMeta(tipo, id);
      loadMeta("categoria", catList);
      loadStats();
    });
  }

  if (gustoList) {
    gustoList.addEventListener("click", async (e) => {
      const btn = e.target.closest("button[data-meta]");
      if (!btn) return;
      const tipo = btn.getAttribute("data-meta");
      const id = Number(btn.getAttribute("data-id"));
      if (!tipo || !id) return;
      if (!confirm("Eliminar item?")) return;
      await deleteMeta(tipo, id);
      loadMeta("gusto", gustoList);
      loadStats();
    });
  }

  if (navButtons.length) {
    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        showSection(btn.dataset.section);
      });
    });
  }

  showSection("dashboard");
  loadStats();
  loadUsuarios();
  loadMeta("categoria", catList);
  loadMeta("gusto", gustoList);
  loadLogs();
});
