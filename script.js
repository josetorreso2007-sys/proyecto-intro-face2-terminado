let usuariosPermitidos = [
  { id: 1, nombre: "Admin", nickname: "admin", password: "123", rol: "admin" },
  { id: 2, nombre: "Vendedor", nickname: "vendedor", password: "123", rol: "vendedor" },
  { id: 3, nombre: "Comprador", nickname: "comprador", password: "123", rol: "comprador" }
];

let productos = [
  { id: 101, nombre: "Laptop Gamer", precio: 850, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS21uvhLwmhuhBMln0p0wZgCHYn7KkLkgVHHqY5BvTePQ&s=10", vendedor: "vendedor" },
  { id: 102, nombre: "Teclado Mecánico", precio: 45, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNtOA1Z7umluKLMJ5FXZTWzOCpZZV7ZA98gVeEINE_4Q&s=10", vendedor: "vendedor" },
  { id: 103, nombre: "Mouse Inalámbrico", precio: 25, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR42Ssyizt57EFKdyAe10_jwBaV2W3gl0epWJpJTi1NiQ&s=10", vendedor: "vendedor" }
];

let carrito = [];
let historialTransacciones = [];

function mostrarAviso(msg, tipo = "info") {
    let box = document.getElementById("aviso-flotante");
    if (!box) {
        box = document.createElement("div");
        box.id = "aviso-flotante";
        box.style.cssText = "position: fixed; top: 15px; right: 15px; background: #333; color: #fff; padding: 10px 15px; border-radius: 5px; z-index: 9999;";
        document.body.appendChild(box);
    }
    box.textContent = msg;
    box.style.background = tipo === "exito" ? "#2ecc71" : "#e67e22";
    box.style.display = "block";
    box.style.opacity = "1";
    setTimeout(() => {
        box.style.opacity = "0";
        setTimeout(() => box.style.display = "none", 300);
    }, 2500);
}

function mostrarFormularioLogin() {
    let r = document.getElementById("rol-select").value;
    let fl = document.getElementById("formulario-login");
    let cr = document.getElementById("contenedor-registro");
    if (r) {
        fl.style.display = "block";
        if (cr) cr.style.display = "block";
    }
}

function toggleRegistro() {
    let fl = document.getElementById("formulario-login");
    let fr = document.getElementById("formulario-registro");
    let tc = document.getElementById("titulo-login-card");
    let cr = document.getElementById("contenedor-registro");
    
    if (fr.style.display === "none") {
        fr.style.display = "block";
        fl.style.display = "none";
        cr.style.display = "none";
        tc.textContent = "Crear cuenta";
    } else {
        fr.style.display = "none";
        fl.style.display = "block";
        cr.style.display = "block";
        tc.textContent = "Iniciar sesión";
    }
}

function registrarUsuario(e) {
    e.preventDefault();
    let nom = document.getElementById("reg-nombre").value.trim();
    let nick = document.getElementById("reg-nickname").value.trim();
    let pass = document.getElementById("reg-password").value.trim();
    let r = document.getElementById("reg-rol").value;

    let ex = usuariosPermitidos.find(u => u.nickname === nick);
    if (ex) {
        mostrarAviso("Ese usuario ya existe", "error");
        return;
    }

    usuariosPermitidos.push({ id: Date.now(), nombre: nom, nickname: nick, password: pass, rol: r });
    mostrarAviso("Cuenta creada", "exito");
    document.getElementById("formulario-registro").reset();
    toggleRegistro();
}

function iniciarSesion(e) {
    e.preventDefault();
    let r = document.getElementById("rol-select").value;
    let nick = document.getElementById("nickname").value.trim();
    let pass = document.getElementById("password").value.trim();
    let err = document.getElementById("mensaje-error");

    let u = usuariosPermitidos.find(x => x.nickname === nick && x.password === pass && x.rol === r);

    if (u) {
        err.textContent = "";
        document.getElementById("seccion-login").style.display = "none";
        document.getElementById("seccion-principal").style.display = "block";
        
        document.getElementById("info-usuario").innerHTML = `<span>Usuario: <strong>${u.nickname}</strong> (${u.rol})</span>`;
        window.usuarioActual = u;
        cargarVistaPorRol(u);
    } else {
        err.textContent = "Datos incorrectos.";
    }
}

function cerrarSesion() {
    document.getElementById("seccion-login").style.display = "block";
    document.getElementById("seccion-principal").style.display = "none";
    document.getElementById("info-usuario").innerHTML = "";
    document.getElementById("formulario-login").reset();
    document.getElementById("formulario-login").style.display = "none";
    document.getElementById("rol-select").selectedIndex = 0;
    
    let fr = document.getElementById("formulario-registro");
    if(fr) fr.style.display = "none";
    let cr = document.getElementById("contenedor-registro");
    if(cr) cr.style.display = "none";
    
    document.getElementById("titulo-login-card").textContent = "Iniciar sesión";
    window.usuarioActual = null;
}

function volverPasoAnterior(rol) {
    let pc = document.getElementById("panel-carrito");
    if (pc && pc.style.display === "block") {
        pc.style.display = "none";
        return;
    }
    let u = usuariosPermitidos.find(x => x.rol === rol);
    if (u) cargarVistaPorRol(u);
}

function cargarVistaPorRol(u) {
    if (u.rol === "comprador") renderizarComprador();
    else if (u.rol === "vendedor") renderizarVendedor(u);
    else if (u.rol === "admin") renderizarAdmin();
}

function renderizarComprador() {
    let c = document.getElementById("contenido-rol");
    c.innerHTML = `
        <div style="margin-bottom: 1rem; display: flex; gap: 10px;">
            <button onclick="volverPasoAnterior('comprador')" class="btn-secundario">← Volver</button>
            <button onclick="cerrarSesion()" class="btn-secundario">Cerrar sesión</button>
        </div>
        <div class="encabezado-tienda">
            <h2>Productos</h2>
            <button onclick="alternarCarrito()" class="btn-carrito">
                🛒 Carrito (<span id="contador-carrito">${carrito.reduce((a, b) => a + b.cantidad, 0)}</span>)
            </button>
        </div>

        <div id="panel-carrito" class="card-carrito" style="display: none;">
            <h3>Carrito</h3>
            <div id="lista-carrito"></div>
            <p id="total-carrito"><strong>Total: $0</strong></p>
            <button onclick="procesarCompra()" class="btn-accion">Comprar</button>
        </div>

        <div id="grid-productos" class="grid-productos"></div>

        <hr style="margin: 20px 0;">
        <h3>Historial de compras</h3>
        <div id="historial-comprador"></div>
    `;
    actualizarCatalogo();
    actualizarVistaCarrito();
    mostrarHistorialComprador();
}

function actualizarCatalogo() {
    let grid = document.getElementById("grid-productos");
    if (!grid) return;
    
    grid.innerHTML = productos.map(p => `
        <div class="producto-card">
            <img src="${p.imagen}" alt="${p.nombre}">
            <h4>${p.nombre}</h4>
            <p class="precio">$${p.precio}</p>
            <div style="margin-bottom: 8px;">
                <label>Cant:</label>
                <input type="number" id="cant-${p.id}" value="1" min="1" max="20" style="width: 45px; text-align: center;">
            </div>
            <button onclick="agregarAlCarrito(${p.id})" class="btn-accion">Añadir</button>
        </div>
    `).join('');
}

function agregarAlCarrito(id) {
    let p = productos.find(x => x.id === id);
    let inp = document.getElementById(`cant-${id}`);
    let cant = inp ? parseInt(inp.value) || 1 : 1;

    if (p) {
        let item = carrito.find(x => x.id === id);
        if (item) {
            item.cantidad += cant;
        } else {
            carrito.push({ ...p, cantidad: cant });
        }
        let tot = carrito.reduce((a, b) => a + b.cantidad, 0);
        document.getElementById("contador-carrito").textContent = tot;
        actualizarVistaCarrito();
        mostrarAviso("Añadido al carrito", "exito");
    }
}

function alternarCarrito() {
    let p = document.getElementById("panel-carrito");
    p.style.display = p.style.display === "none" ? "block" : "none";
}

function actualizarVistaCarrito() {
    let lista = document.getElementById("lista-carrito");
    let totalEl = document.getElementById("total-carrito");
    if (!lista) return;

    if (carrito.length === 0) {
        lista.innerHTML = "<p>Carrito vacío.</p>";
        totalEl.innerHTML = "<strong>Total: $0</strong>";
        return;
    }

    let tot = 0;
    lista.innerHTML = carrito.map((item, i) => {
        let sub = item.precio * item.cantidad;
        tot += sub;
        return `
            <div class="item-carrito" style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>${item.nombre} (x${item.cantidad}) - $${sub}</span>
                <button onclick="quitarDelCarrito(${i})" class="btn-eliminar-sm">X</button>
            </div>
        `;
    }).join('');

    totalEl.innerHTML = `<strong>Total: $${tot}</strong>`;
}

function quitarDelCarrito(i) {
    let p = carrito[i];
    if (confirm(`¿Quitar ${p.nombre}?`)) {
        carrito.splice(i, 1);
        let tot = carrito.reduce((a, b) => a + b.cantidad, 0);
        document.getElementById("contador-carrito").textContent = tot;
        actualizarVistaCarrito();
    }
}

function procesarCompra() {
    if (carrito.length === 0) {
        mostrarAviso("El carrito está vacío", "error");
        return;
    }

    let tot = carrito.reduce((a, b) => a + (b.precio * b.cantidad), 0);
    
    // Guardar transacción
    historialTransacciones.push({
        id: Date.now(),
        usuario: window.usuarioActual ? window.usuarioActual.nickname : "invitado",
        productos: [...carrito],
        total: tot,
        fecha: new Date().toLocaleDateString()
    });

    // Mostrar el menú modal central de compra exitosa
    let modal = document.getElementById("modal-compra");
    let textoDetalle = document.getElementById("modal-texto-detalle");
    textoDetalle.innerHTML = `Tu compra por <strong>$${tot}</strong> se ha procesado con éxito.`;
    modal.style.display = "flex";

    // Limpiar carrito
    carrito = [];
    document.getElementById("contador-carrito").textContent = 0;
    actualizarVistaCarrito();
    alternarCarrito();
}

function cerrarModalCompra() {
    let modal = document.getElementById("modal-compra");
    modal.style.display = "none";
    mostrarHistorialComprador();
}

function mostrarHistorialComprador() {
    let div = document.getElementById("historial-comprador");
    if (!div) return;

    let nick = window.usuarioActual ? window.usuarioActual.nickname : "";
    let misC = historialTransacciones.filter(t => t.usuario === nick);

    if (misC.length === 0) {
        div.innerHTML = "<p>Sin compras.</p>";
        return;
    }

    div.innerHTML = misC.map(t => `
        <div style="background: #f9f9f9; border: 1px solid #ddd; padding: 8px; border-radius: 5px; margin-bottom: 5px;">
            <p style="margin:0;"><small>Fecha: ${t.fecha} | Total: $${t.total}</small></p>
            <ul style="margin:0; padding-left: 15px;">
                ${t.productos.map(p => `<li>${p.nombre} (x${p.cantidad})</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

function renderizarVendedor(u) {
    let c = document.getElementById("contenido-rol");
    c.innerHTML = `
        <div style="margin-bottom: 1rem; display: flex; gap: 10px;">
            <button onclick="volverPasoAnterior('vendedor')" class="btn-secundario">← Volver</button>
            <button onclick="cerrarSesion()" class="btn-secundario">Cerrar sesión</button>
        </div>
        <h2>Panel Vendedor</h2>
        <div class="contenedor-card" style="max-width: 100%; margin-bottom: 1.5rem;">
            <h3>Publicar producto</h3>
            <form id="form-nuevo-producto">
                <div class="campo"><label>Nombre:</label><input type="text" id="prod-nombre" required></div>
                <div class="campo"><label>Precio ($):</label><input type="number" id="prod-precio" required min="1"></div>
                <div class="campo"><label>Imagen (URL):</label><input type="text" id="prod-imagen" placeholder="https://..."></div>
                <button type="submit" class="btn-accion">Publicar</button>
            </form>
        </div>

        <h3>Mis publicaciones</h3>
        <div id="mis-productos" class="grid-productos"></div>

        <hr style="margin: 20px 0;">
        <h3>Historial de ventas</h3>
        <div id="historial-vendedor"></div>
    `;

    document.getElementById("form-nuevo-producto").addEventListener("submit", function(e) {
        e.preventDefault();
        let nom = document.getElementById("prod-nombre").value;
        let pre = parseFloat(document.getElementById("prod-precio").value);
        let img = document.getElementById("prod-imagen").value || "https://via.placeholder.com/150";

        productos.push({ id: Date.now(), nombre: nom, precio: pre, imagen: img, vendedor: u.nickname });
        mostrarAviso("Publicado", "exito");
        this.reset();
        mostrarMisProductos(u.nickname);
    });

    mostrarMisProductos(u.nickname);
    mostrarHistorialVendedor(u.nickname);
}

function mostrarMisProductos(nick) {
    let div = document.getElementById("mis-productos");
    let mis = productos.filter(p => p.vendedor === nick);
    
    if (mis.length === 0) {
        div.innerHTML = "<p>Sin publicaciones.</p>";
        return;
    }

    div.innerHTML = mis.map(p => `
        <div class="producto-card">
            <img src="${p.imagen}" alt="${p.nombre}">
            <h4>${p.nombre}</h4>
            <p class="precio">$${p.precio}</p>
        </div>
    `).join('');
}

function mostrarHistorialVendedor(nick) {
    let div = document.getElementById("historial-vendedor");
    if (!div) return;

    let ventas = [];
    historialTransacciones.forEach(t => {
        let mios = t.productos.filter(p => p.vendedor === nick);
        if (mios.length > 0) {
            ventas.push({ fecha: t.fecha, comprador: t.usuario, items: mios });
        }
    });

    if (ventas.length === 0) {
        div.innerHTML = "<p>Sin ventas aún.</p>";
        return;
    }

    div.innerHTML = ventas.map(v => `
        <div style="background: #f9f9f9; border: 1px solid #ddd; padding: 8px; border-radius: 5px; margin-bottom: 5px;">
            <p style="margin:0;"><small>Fecha: ${v.fecha} | Comprador: ${v.comprador}</small></p>
            <ul style="margin:0; padding-left: 15px;">
                ${v.items.map(i => `<li>${i.nombre} (x${i.cantidad})</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

function renderizarAdmin() {
    let c = document.getElementById("contenido-rol");
    c.innerHTML = `
        <div style="margin-bottom: 1rem; display: flex; gap: 10px;">
            <button onclick="volverPasoAnterior('admin')" class="btn-secundario">← Volver</button>
            <button onclick="cerrarSesion()" class="btn-secundario">Cerrar sesión</button>
        </div>
        <h2>Panel Admin</h2>
        
        <div class="contenedor-card" style="max-width: 100%; margin-bottom: 1.5rem;">
            <h3>Usuarios</h3>
            <div id="tabla-usuarios"></div>
        </div>

        <div class="contenedor-card" style="max-width: 100%; margin-bottom: 1.5rem;">
            <h3>Productos</h3>
            <div id="tabla-productos-admin"></div>
        </div>

        <div class="contenedor-card" style="max-width: 100%;">
            <h3>Historial de ventas</h3>
            <div id="tabla-historial-admin"></div>
        </div>
    `;

    actualizarTablasAdmin();
}

function actualizarTablasAdmin() {
    let du = document.getElementById("tabla-usuarios");
    let dp = document.getElementById("tabla-productos-admin");
    let dh = document.getElementById("tabla-historial-admin");

    du.innerHTML = `
        <table class="tabla-admin">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                ${usuariosPermitidos.map(u => `
                    <tr>
                        <td>${u.nombre || '-'}</td>
                        <td>${u.nickname}</td>
                        <td>${u.rol}</td>
                        <td>
                            ${u.rol !== 'admin' ? `<button onclick="eliminarUsuario(${u.id})" class="btn-eliminar-sm">Borrar</button>` : '<em>Protegido</em>'}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    dp.innerHTML = `
        <table class="tabla-admin">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Vendedor</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                ${productos.map(p => `
                    <tr>
                        <td>${p.nombre}</td> <td>$${p.precio}</td>
                        <td>${p.vendedor}</td>
                        <td>
                            <button onclick="eliminarProductoAdmin(${p.id})" class="btn-eliminar-sm">Quitar</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    if (historialTransacciones.length === 0) {
        dh.innerHTML = "<p>Sin transacciones.</p>";
    } else {
        dh.innerHTML = `
            <table class="tabla-admin">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Comprador</th>
                        <th>Items</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${historialTransacciones.map(t => `
                        <tr>
                            <td>${t.fecha}</td>
                            <td>${t.usuario}</td>
                            <td>${t.productos.map(p => `${p.nombre} (x${p.cantidad})`).join(', ')}</td>
                            <td>$${t.total}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}

function eliminarUsuario(id) {
    let i = usuariosPermitidos.findIndex(u => u.id === id);
    if (i !== -1) {
        usuariosPermitidos.splice(i, 1);
        actualizarTablasAdmin();
        mostrarAviso("Usuario borrado", "exito");
    }
}

function eliminarProductoAdmin(id) {
    let i = productos.findIndex(p => p.id === id);
    if (i !== -1) {
        productos.splice(i, 1);
        actualizarTablasAdmin();
        mostrarAviso("Producto eliminado", "exito");
    }
}