document.addEventListener('DOMContentLoaded', function() {
    const carrusel = document.querySelector('.carrusel');
    const imagenes = document.querySelectorAll('.carrusel-imagen');
    const botonIzquierdo = document.querySelector('.carrusel-button-left');
    const botonDerecho = document.querySelector('.carrusel-button-right');
  
    // Verificar si los elementos existen
    if (!carrusel || !botonIzquierdo || !botonDerecho || imagenes.length === 0) return;

    let indiceActual = 0;
    let esMovil = window.innerWidth <= 768;
  
    function actualizarCarrusel() {
      esMovil = window.innerWidth <= 768;
      moverCarrusel(0);
    }
  
    function moverCarrusel(direccion) {
      indiceActual += direccion;
      if (indiceActual < 0) {
        indiceActual = imagenes.length - (esMovil ? 1 : 3);
      } else if (indiceActual > (esMovil ? imagenes.length - 1 : imagenes.length - 3)) {
        indiceActual = 0;
      }
      
      const desplazamiento = esMovil ? indiceActual * 100 : indiceActual * (100 / 3);
      carrusel.style.transform = `translateX(-${desplazamiento}%)`;
    }
  
    // Event listeners para los botones
    botonIzquierdo.addEventListener('click', () => moverCarrusel(-1));
    botonDerecho.addEventListener('click', () => moverCarrusel(1));
    window.addEventListener('resize', actualizarCarrusel);
    
    // Inicializar el carrusel
    actualizarCarrusel();
});