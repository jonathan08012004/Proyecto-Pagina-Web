// Obtener el carrito desde localStorage usando la misma estructura
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para renderizar los items del carrito
function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    if (carrito.length === 0) {
        cartItems.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    Tu carrito está vacío
                </td>
            </tr>`;
        return;
    }

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

    // Actualizar el total
    updateCartTotal();
}

// Función para actualizar el total
function updateCartTotal() {
    const total = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }
}

// Función para actualizar cantidad
function updateQuantity(nombre, newQuantity) {
    if (newQuantity < 1) return;
    
    const item = carrito.find(item => item.nombre === nombre);
    if (item) {
        item.cantidad = newQuantity;
        guardarCarritoEnLocalStorage();
        renderCartItems();
    }
}

// Función para eliminar del carrito
function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre);
    guardarCarritoEnLocalStorage();
    renderCartItems();
}

// Función para guardar en localStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('El carrito está vacío');
                return;
            }
            // Aquí iría la lógica para proceder al pago
        });
    }
}); 