// continuar.js

// Obtener el botón de continuar
const continuarButton = document.getElementById('continue-button');

// Asegurarnos de que el botón existe antes de agregar el evento
if (continuarButton) {
  continuarButton.addEventListener('click', function () {
    // Redirigir a la página del mapa
    window.location.href = "mapa.html";
  });
}