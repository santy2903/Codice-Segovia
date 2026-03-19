// Obtener los elementos necesarios
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const audio = document.getElementById('background-music');
const audioIcon = document.getElementById('audio-icon');
const entradaSound = document.getElementById('entrada-sound');  // Sonido de entrada.mp3

// Definir las rutas de las imágenes de los íconos
const playIcon = 'consonido.png';  // Ícono de reproducir
const pauseIcon = 'sinsonido.png'; // Ícono de pausar

// Pre-cargar el archivo de música de fondo
audio.preload = 'auto'; // Asegura que la música de fondo se cargue antes de reproducirla

// Asegurarnos de que el audio esté pausado al inicio
audio.pause();
audioIcon.src = pauseIcon;

// Reproducir el sonido de clic y la música cuando se hace clic en "Jugar"
startButton.addEventListener('click', function() {
  // Reproducir el sonido de entrada.mp3
  entradaSound.play();

  // Esperar a que el sonido de entrada termine antes de redirigir
  entradaSound.onended = function() {
    // Reproducir la música de fondo inmediatamente después de que el sonido de entrada termine
    audio.play(); // Iniciar la música
    audioIcon.src = playIcon;  // Cambiar el ícono a "Reproducir"
    
    // Redirigir a otra página después de un pequeño retraso
    setTimeout(function() {
      window.location.href = "instrucciones.html";  // Cambia "juego.html" por la URL de destino
    }, 500);  // Retraso de 500ms para que se reproduzca el sonido de entrada antes de redirigir


  };
});




// Función para pausar o reproducir el audio y cambiar el ícono
pauseButton.addEventListener('click', function() {
  if (audio.paused) {
    audio.play();  // Si el audio está pausado, lo reproduce
    audioIcon.src = playIcon;  // Cambiar el ícono a "Reproducir"
  } else {
    audio.pause();  // Si el audio está reproduciéndose, lo pausa
    audioIcon.src = pauseIcon;  // Cambiar el ícono a "Pausar"
  }
});





/// MAPA 
// Seleccionar todos los botones con la clase 'boton-circular'
const botones = document.querySelectorAll('.boton-circular');

// Añadir un evento 'click' a cada botón
botones.forEach(boton => {
  boton.addEventListener('click', () => {
    // Obtener la URL de destino desde el atributo 'data-target' del botón
    const destino = boton.getAttribute('data-target');

    // Verificar si el destino tiene valor y redirigir
    if (destino) {
      console.log(`Redirigiendo a: ${destino}`);
      window.location.href = destino;
    } else {
      console.error("No se especificó un destino.");
    }
  });
});



