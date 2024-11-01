// Obtener el carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para actualizar cantidad
function updateQuantity(nombre, newQuantity) {
    if (newQuantity < 1) return;
    
    const item = carrito.find(item => item.nombre === nombre);
    if (item) {
        item.cantidad = newQuantity;
        guardarCarritoEnLocalStorage();
        actualizarUI();
    }
}

// Función para eliminar del carrito
function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre);
    guardarCarritoEnLocalStorage();
    actualizarUI();
    
    if (carrito.length === 0) {
        window.location.href = '/index.html';
    }
}

// Función para guardar en localStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para actualizar toda la UI
function actualizarUI() {
    actualizarContadorCarrito();
    renderizarPaginaCompra();
}

// Función para actualizar el contador
function actualizarContadorCarrito() {
    const contadorElement = document.querySelector('.count-products');
    if (contadorElement) {
        const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
        contadorElement.textContent = cantidadTotal;
        cantidadTotal === 0 ? 
            contadorElement.classList.add('hidden') : 
            contadorElement.classList.remove('hidden');
    }
}

// Función para renderizar la página de compra
function renderizarPaginaCompra() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = carrito.length === 0 ? `
        <tr>
            <td colspan="5" class="text-center py-4">
                Tu carrito está vacío
            </td>
        </tr>` : 
        carrito.map(item => `
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

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    actualizarUI();
});

function finalizarCompra() {
    alert('¡Compra exitosa!');
    // Limpia el carrito (si tienes una variable que almacena los productos)
    localStorage.removeItem('carrito');
    // Redirecciona al inicio
    window.location.href = '/index.html';
}
