document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('video');
  const playButton = document.getElementById('playButton');
  const mapaButton = document.getElementById('mapaButton');

  // Configurar video
  video.setAttribute('playsinline', '');
  
  // Función para entrar en pantalla completa
  function enterFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { // Safari
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  }

  // Función para salir de pantalla completa
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  }

  // Detectar cuando el video termina
  video.addEventListener('ended', function() {
    exitFullscreen();
  });

  // Reproducir video al hacer clic en el botón
  playButton.addEventListener('click', function() {
    // Ocultar botón de play
    playButton.style.display = 'none';
    
    // Intentar reproducir el video
    video.play().then(() => {
      // Entrar en pantalla completa
      enterFullscreen(video);
    }).catch(error => {
      console.log('Error al reproducir:', error);
      // Si hay error, mostrar el botón de nuevo
      playButton.style.display = 'flex';
    });
  });

  // Si el usuario pausa manualmente, mostrar el botón de play
  video.addEventListener('pause', function() {
    // Solo mostrar el botón si no está en modo pantalla completa
    if (!document.fullscreenElement) {
      playButton.style.display = 'flex';
    }
  });

  // Ocultar botón cuando se reproduce
  video.addEventListener('play', function() {
    playButton.style.display = 'none';
  });

  // Manejar cambios en pantalla completa
  document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
      // Si salimos de pantalla completa y el video está en pausa, mostrar botón
      if (video.paused) {
        playButton.style.display = 'flex';
      }
    }
  });

  // Para Safari
  document.addEventListener('webkitfullscreenchange', function() {
    if (!document.webkitFullscreenElement) {
      if (video.paused) {
        playButton.style.display = 'flex';
      }
    }
  });

  // Botón para ir al mapa
  mapaButton.addEventListener('click', function () {
    // Salir de pantalla completa si está activada
    exitFullscreen();
    // Reiniciar las respuestas en localStorage
    localStorage.clear();
    // Redirigir a la página mapa.html
    window.location.href = 'mapa.html';
  });

  // Asegurar que el botón de play se muestre inicialmente
  playButton.style.display = 'flex';
});
