function inicializarMapa() {
    // Verifica si el elemento 'mapa' existe
    if (!document.getElementById('mapa')) {
      console.error('El elemento con id "mapa" no se encontró en el DOM');
      return;
    }
  
    const ubicacionCentral = [-34.9214, -57.9544]; // Coordenadas de La Plata
    const mapa = L.map('mapa').setView(ubicacionCentral, 12);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapa);
  
    const sucursales = [
      { nombre: 'Victtoria', lat: -34.932619, lng: -57.956730 },
      // Agrega más sucursales aquí
    ];
  
    sucursales.forEach(sucursal => {
      L.marker([sucursal.lat, sucursal.lng])
        .addTo(mapa)
        .bindPopup(sucursal.nombre);
    });
  
    console.log('Mapa inicializado correctamente');
  }
  
  // Asegúrate de que el DOM esté completamente cargado antes de inicializar el mapa
  document.addEventListener('DOMContentLoaded', inicializarMapa);
  
  document.addEventListener('DOMContentLoaded', function() {
      const menuItems = document.querySelectorAll('.navigation > ul > li');
  
      menuItems.forEach(item => {
          item.addEventListener('click', function(e) {
              // Solo prevenimos el comportamiento por defecto si:
              // 1. Estamos en móvil (ancho <= 950px)
              // 2. El elemento clickeado tiene un submenú
              // 3. El click fue directamente en el elemento <a> que tiene submenús
              const hasSubmenu = this.querySelector('ul');
              const isMainLink = e.target.parentElement === this;
              
              if (window.innerWidth <= 950 && hasSubmenu && isMainLink) {
                  e.preventDefault();
                  const submenu = this.querySelector('ul');
                  submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
              }
              // Si el click fue en un enlace de submenu, permitimos la navegación
          });
      });
  });
  
  