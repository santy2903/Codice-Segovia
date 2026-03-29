document.addEventListener('DOMContentLoaded', function () {
  // Elementos
  const mapaButton = document.getElementById('mapaButton');
  const body = document.body;
  
  // Elementos para volver a ver el video
  const replayContainer = document.getElementById('replayContainer');
  const replayButton = document.getElementById('replayButton');
  
  // Elementos del overlay de pantalla completa
  const fullscreenOverlay = document.getElementById('fullscreenVideoOverlay');
  const fullscreenVideo = document.getElementById('fullscreenVideo');
  
  // Variable para controlar el estado
  let isFullscreen = false;
  let autoPlayAttempted = false;
  let videoSource = 'videoinstrucciones.mp4';
  
  // --- FUNCIONES PARA PANTALLA COMPLETA ---
  
  // Entrar en modo pantalla completa y reproducir video
  function enterFullscreen() {
    if (!fullscreenOverlay || !fullscreenVideo) return;
    
    // Copiar la fuente del video al overlay
    fullscreenVideo.src = videoSource;
    fullscreenVideo.load();
    
    // Mostrar el overlay
    fullscreenOverlay.style.display = 'flex';
    body.classList.add('video-fullscreen');
    isFullscreen = true;
    
    // Ocultar el contenedor de replay si estaba visible
    if (replayContainer) {
      replayContainer.style.display = 'none';
    }
    
    // Reproducir el video
    setTimeout(async () => {
      try {
        // Resetear al inicio si es necesario
        if (fullscreenVideo.ended || fullscreenVideo.currentTime === fullscreenVideo.duration) {
          fullscreenVideo.currentTime = 0;
        }
        await fullscreenVideo.play();
      } catch (err) {
        console.warn('Error al reproducir en pantalla completa:', err);
      }
    }, 100);
  }
  
  // Salir del modo pantalla completa
  function exitFullscreen() {
    if (!fullscreenOverlay || !fullscreenVideo) return;
    
    // Detener el video del overlay
    fullscreenVideo.pause();
    
    // Limpiar la fuente del overlay para liberar memoria
    fullscreenVideo.src = '';
    
    // Ocultar el overlay
    fullscreenOverlay.style.display = 'none';
    body.classList.remove('video-fullscreen');
    isFullscreen = false;
    
    // Mostrar el botón de replay y el mensaje
    if (replayContainer) {
      replayContainer.style.display = 'flex';
    }
  }
  
  // Función para iniciar la reproducción automática al cargar la página
  async function startAutoPlayFullscreen() {
    if (autoPlayAttempted) return;
    autoPlayAttempted = true;
    
    // Entrar en pantalla completa directamente
    enterFullscreen();
  }
  
  // Evento para cuando el video termina en pantalla completa
  if (fullscreenVideo) {
    fullscreenVideo.addEventListener('ended', () => {
      // Salir del modo fullscreen y mostrar el botón de replay
      exitFullscreen();
    });
  }
  
  // Evento para el botón de replay (volver a ver el video)
  if (replayButton) {
    replayButton.addEventListener('click', (e) => {
      e.stopPropagation();
      // Volver a entrar en pantalla completa y reproducir el video
      enterFullscreen();
    });
  }
  
  // Botón para ir al mapa
  if (mapaButton) {
    mapaButton.addEventListener('click', function () {
      // Salir de pantalla completa si está activada
      if (fullscreenOverlay && fullscreenOverlay.style.display === 'flex') {
        exitFullscreen();
      }
      // Reiniciar las respuestas en localStorage
      localStorage.clear();
      // Redirigir a la página mapa.html
      window.location.href = 'mapa.html';
    });
  }
  
  // Iniciar automáticamente al cargar la página
  setTimeout(() => {
    startAutoPlayFullscreen();
  }, 200);
});
