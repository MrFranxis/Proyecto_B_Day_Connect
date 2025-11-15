<<<<<<< HEAD
//admin.js
document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll(".admin-menu button");
    const contenedor = document.getElementById("contenedor-tabla");

    botones.forEach(boton => {
        boton.addEventListener("click", async () => {

            // ➤ Si es filtrar por fecha
            if (boton.id === "filtrarFecha") {
                const fecha = prompt("Introduce una fecha de nacimiento (YYYY-MM-DD):");
                if (!fecha) return;

                cargarUsuarios(`/Proyecto_B_Day_Connect/admin/api_usuarios.php?tipo=fecha&fecha=${fecha}`);
                return;
            }

            // ➤ Para ver todos, admins o usuarios
            const tipo = boton.dataset.tipo;
            cargarUsuarios(`/Proyecto_B_Day_Connect/admin/api_usuarios.php?tipo=${tipo}`);
        });
    });


    async function cargarUsuarios(url) {
        contenedor.innerHTML = "<p>Cargando...</p>";

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (data.error) {
                contenedor.innerHTML = `<p>${data.error}</p>`;
                return;
            }

            renderTabla(data);

        } catch (error) {
            contenedor.innerHTML = "<p>Error al cargar usuarios.</p>";
        }
    }


    function renderTabla(usuarios) {
        if (usuarios.length === 0) {
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
                        <th>Fecha Nacimiento</th>
                        <th>Fecha Registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        usuarios.forEach(u => {
            const esAdmin = u.id_rol == 1;
            html += `
                <tr>
                    <td>${u.id_usuario}</td>
                    <td>${u.nombre}</td>
                    <td>${u.email}</td>
                    <td>${esAdmin ? "Admin" : "Usuario"}</td>
                    <td>${u.fecha_nacimiento ?? "-"}</td>
                    <td>${u.fecha_registro ?? "-"}</td>
                    <td>
                        ${esAdmin
                          ? `<a class="btn degradar" href="/Proyecto_B_Day_Connect/admin/acciones.php?accion=degradar&id=${u.id_usuario}">⬇️ Degradar</a>`
                          : `<a class="btn ascender" href="/Proyecto_B_Day_Connect/admin/acciones.php?accion=ascender&id=${u.id_usuario}">⬆️ Hacer Admin</a>`}
                        <a class="btn eliminar" href="/Proyecto_B_Day_Connect/admin/acciones.php?accion=eliminar&id=${u.id_usuario}" onclick="return confirm('¿Eliminar usuario?')">🗑️ Eliminar</a>
                    </td>
                </tr>`;
        });

        html += "</tbody></table>";
        contenedor.innerHTML = html;
    }
});
=======
document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".admin-menu button");
  const contenedor = document.getElementById("contenedor-tabla");

  botones.forEach(boton => {
    boton.addEventListener("click", async () => {
      const tipo = boton.dataset.tipo;
      contenedor.innerHTML = "<p>Cargando...</p>";

      try {
        const res = await fetch(`api_usuarios.php?tipo=${tipo}`);
        const data = await res.json();

        if (data.error) {
          contenedor.innerHTML = `<p>Error: ${data.error}</p>`;
          return;
        }

      
        renderTabla(data);
      } catch (error) {
        contenedor.innerHTML = "<p>Error al cargar los datos.</p>";
      }
    });
  });

  
  function renderTabla(usuarios) {
    if (usuarios.length === 0) {
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
            <th>Fecha Nacimiento</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;

    usuarios.forEach(u => {
      const esAdmin = u.id_rol == 1;
      html += `
        <tr>
          <td>${u.id_usuario}</td>
          <td>${u.nombre}</td>
          <td>${u.email}</td>
          <td>${esAdmin ? "Admin" : "Usuario"}</td>
          <td>${u.fecha_nacimiento}</td>
          <td>${u.fecha_registro}</td>
          <td>
            ${esAdmin
              ? `<a class="btn degradar" href="acciones.php?accion=degradar&id=${u.id_usuario}">⬇️ Degradar</a>`
              : `<a class="btn ascender" href="acciones.php?accion=ascender&id=${u.id_usuario}">⬆️ Hacer Admin</a>`}
            <a class="btn eliminar" href="acciones.php?accion=eliminar&id=${u.id_usuario}" onclick="return confirm('¿Eliminar usuario?')">🗑️ Eliminar</a>
          </td>
        </tr>`;
    });

    html += "</tbody></table>";
    contenedor.innerHTML = html;
  }
});
>>>>>>> c9a44ca (Se unifican  ramas, se actualiza dump)
