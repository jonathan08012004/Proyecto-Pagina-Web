// Manejo de la cantidad de productos
document.querySelectorAll('.cantidad').forEach(control => {
  const input = control.querySelector('.cantidad-input');
  const menosBtn = control.querySelector('.menos');
  const masBtn = control.querySelector('.mas');

  menosBtn.addEventListener('click', () => {
    let valor = parseInt(input.value);
    if (valor > 1) {
      input.value = valor - 1;
      input.dispatchEvent(new Event('change'));
    }
  });

  masBtn.addEventListener('click', () => {
    let valor = parseInt(input.value);
    input.value = valor + 1;
    input.dispatchEvent(new Event('change'));
  });

  input.addEventListener('change', () => {
    let valor = parseInt(input.value);
    if (isNaN(valor) || valor < 1) {
      input.value = 1;
    }
    input.value = parseInt(input.value);
  });
});

// Manejo del botón "Agregar al Carrito"
document.querySelectorAll('.agregar-carrito').forEach(button => {
  button.addEventListener('click', function() {
    const producto = this.closest('.producto');
    const nombre = producto.querySelector('h3').textContent;
    const cantidad = parseInt(producto.querySelector('.cantidad-input').value);
    const precio = parseFloat(producto.querySelector('.precio').textContent.replace('$', ''));
    
    agregarAlCarrito(nombre, cantidad, precio);
    actualizarCarritoUI();
  });
});

// Funciones para manejar el carrito
let carrito = [];

function agregarAlCarrito(nombre, cantidad, precio) {
  const itemExistente = carrito.find(item => item.nombre === nombre);
  
  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({ nombre, cantidad, precio });
  }
  
  guardarCarritoEnLocalStorage();
  actualizarContadorCarrito();
}

function actualizarCarritoUI() {
  const containerProducts = document.querySelector('.container-cart-products');
  const cartTotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  
  containerProducts.innerHTML = `
    ${carrito.map(item => `
      <div class="cart-product">
        <div class="info-cart-product">
          <span class="cantidad-producto-carrito">${item.cantidad}</span>
          <p class="titulo-producto-carrito">${item.nombre}</p>
          <span class="precio-producto-carrito">$${(item.precio * item.cantidad).toFixed(2)}</span>
        </div>
        <button class="eliminar-producto" data-nombre="${item.nombre}">×</button>
      </div>
    `).join('')}
    <div class="cart-total">
      <h3>Total: $${cartTotal.toFixed(2)}</h3>
      <div class="cart-buttons">
        <button id="vaciar-carrito">Vaciar Carrito</button>
        <button id="confirmar-compra">Confirmar Compra</button>
      </div>
    </div>
  `;

  // Agregar event listeners para los botones existentes
  const btnVaciar = document.getElementById('vaciar-carrito');
  const btnConfirmar = document.getElementById('confirmar-compra');
  
  btnVaciar.addEventListener('click', vaciarCarrito);
  btnConfirmar.addEventListener('click', confirmarCompra);

  // Agregar event listeners para los botones de eliminar
  document.querySelectorAll('.eliminar-producto').forEach(btn => {
    btn.addEventListener('click', function() {
      const nombreProducto = this.getAttribute('data-nombre');
      eliminarDelCarrito(nombreProducto);
    });
  });
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Cargar carrito desde localStorage al iniciar
document.addEventListener('DOMContentLoaded', () => {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarContadorCarrito();
    
    // Verificar si estamos en la página de compra
    if (window.location.pathname.includes('COMPRA.HTML')) {
      renderizarPaginaCompra();
    } else {
      actualizarCarritoUI();
    }
  }
});

// Funcionalidad del carrito
const btnCart = document.querySelector('.container-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
  containerCartProducts.classList.toggle('hidden-cart');
});

// Evitar que el carrito se cierre cuando se hace clic dentro de él
containerCartProducts.addEventListener('click', (e) => {
  e.stopPropagation();
});


// Agregar estas nuevas funciones al final del archivo
function vaciarCarrito() {
  if (confirm('¿Estás seguro que deseas vaciar el carrito?')) {
    carrito = [];
    guardarCarritoEnLocalStorage();
    actualizarCarritoUI();
    actualizarContadorCarrito();
  }
}

function confirmarCompra() {
  if (carrito.length > 0) {
    window.location.href = '/COMPRA.HTML';
  } else {
    alert('El carrito está vacío');
  }
}

// Agregar esta nueva función
function eliminarDelCarrito(nombre) {
  carrito = carrito.filter(item => item.nombre !== nombre);
  guardarCarritoEnLocalStorage();
  
  // Actualizar tanto el carrito desplegable como la tabla de resumen
  actualizarCarritoUI();
  renderizarPaginaCompra();
  actualizarContadorCarrito();
}

// Agregar esta función para actualizar el contador
function actualizarContadorCarrito() {
  const contadorElement = document.querySelector('.count-products');
  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
  
  contadorElement.textContent = cantidadTotal;
  
  // Opcional: Ocultar el contador si no hay productos
  if (cantidadTotal === 0) {
    contadorElement.classList.add('hidden');
  } else {
    contadorElement.classList.remove('hidden');
  }
}

// Función para renderizar el carrito en la página de compra
function renderizarPaginaCompra() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  if (!cartItems || !cartTotal) return; // Si no estamos en la página de compra

  if (carrito.length === 0) {
    cartItems.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4">
          Tu carrito está vacío
        </td>
      </tr>`;
    cartTotal.textContent = '0.00';
    return;
  }

  // Renderizar items
  cartItems.innerHTML = carrito.map(item => `
    <tr>
      <td>
        <div class="d-flex align-items-center">
          <div>
            <h6 class="mb-0">${item.nombre}</h6>
          </div>
        </div>
      </td>
      <td>$${item.precio.toFixed(2)}</td>
      <td>
        <div class="quantity-controls">
          <button onclick="updateQuantity('${item.nombre}', ${item.cantidad - 1})" 
                  class="quantity-btn" ${item.cantidad <= 1 ? 'disabled' : ''}>-</button>
          <span>${item.cantidad}</span>
          <button onclick="updateQuantity('${item.nombre}', ${item.cantidad + 1})" 
                  class="quantity-btn">+</button>
        </div>
      </td>
      <td>$${(item.precio * item.cantidad).toFixed(2)}</td>
      <td>
        <button onclick="eliminarDelCarrito('${item.nombre}')" class="btn btn-danger btn-sm">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');

  // Actualizar total
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  cartTotal.textContent = total.toFixed(2);
}

// Agregar esta función para actualizar cantidad
function updateQuantity(nombre, newQuantity) {
    if (newQuantity < 1) return;
    
    const item = carrito.find(item => item.nombre === nombre);
    if (item) {
        item.cantidad = newQuantity;
        guardarCarritoEnLocalStorage();
        
        // Actualizar tanto el carrito desplegable como la tabla de resumen
        actualizarCarritoUI();
        renderizarPaginaCompra();
        actualizarContadorCarrito();
    }
}



