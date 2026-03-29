(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Elementos del contenedor normal
    const video = document.getElementById('video');
    const wrapper = document.getElementById('videoWrapper');
    const mapaButton = document.getElementById('mapaButton');
    const passwordInput = document.getElementById('passwordInput');
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
    let videoSource = '';
    
    // Guardar la fuente del video original
    if (video) {
      const sourceElement = video.querySelector('source');
      if (sourceElement) {
        videoSource = sourceElement.src;
      } else if (video.src) {
        videoSource = video.src;
      }
    }
    
    // Ocultar el wrapper de video inicialmente (no queremos que se vea)
    if (wrapper) {
      wrapper.classList.remove('visible');
    }
    
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
    
    // Salir del modo pantalla completa (sin mostrar el video pequeño)
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
      
      // NO mostramos el wrapper de video
      if (wrapper) {
        wrapper.classList.remove('visible');
      }
      
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
    
    // Iniciar automáticamente al cargar la página
    setTimeout(() => {
      startAutoPlayFullscreen();
    }, 200);
    
    // --- LÓGICA DE CONTRASEÑA Y BOTÓN CONTINUAR ---
    const CORRECT_PASSWORD = 'Segovia';
    
    function checkPasswordAndEnableButton() {
      if (!passwordInput || !mapaButton) return;
      const entered = passwordInput.value.trim();
      
      if (entered.localeCompare(CORRECT_PASSWORD, undefined, {
        sensitivity: 'base'
      }) === 0) {
        mapaButton.classList.add('enabled');
      } else {
        mapaButton.classList.remove('enabled');
      }
    }
    
    if (passwordInput && mapaButton) {
      passwordInput.addEventListener('input', checkPasswordAndEnableButton);
      passwordInput.addEventListener('blur', checkPasswordAndEnableButton);
      
      mapaButton.classList.remove('enabled');
      
      mapaButton.addEventListener('click', function (e) {
        if (!mapaButton.classList.contains('enabled')) {
          e.preventDefault();
          e.stopPropagation();
          passwordInput.style.borderColor = '#ff3333';
          setTimeout(() => {
            passwordInput.style.borderColor = 'rgba(255,87,51,0.6)';
          }, 300);
          return;
        }
        window.location.href = 'criptex.html';
      });
      
      passwordInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          checkPasswordAndEnableButton();
          if (mapaButton.classList.contains('enabled')) {
            mapaButton.click();
          }
        }
      });
      
      passwordInput.setAttribute('autocomplete', 'off');
    }
    
    if (mapaButton && !passwordInput) {
      mapaButton.addEventListener('click', function () {
        window.location.href = 'criptex.html';
      });
    }
  });
})();
