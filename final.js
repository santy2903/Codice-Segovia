// Esperamos a que la página cargue completamente
document.addEventListener('DOMContentLoaded', function () {
  // Obtener el botón por su ID
  const mapaButton = document.getElementById('mapaButton');

  // Agregar el evento de clic
  mapaButton.addEventListener('click', function () {
    // Redirigir a la página criptex.html
    window.location.href = 'criptex.html';
  });
});