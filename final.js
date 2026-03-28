(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Elementos del contenedor normal
    const video = document.getElementById('video');
    const wrapper = document.getElementById('videoWrapper');
    const customPlayBtn = document.getElementById('customPlayBtn');
    const mapaButton = document.getElementById('mapaButton');
    const passwordInput = document.getElementById('passwordInput');
    const body = document.body;
    
    // Elementos del overlay de pantalla completa
    const fullscreenOverlay = document.getElementById('fullscreenVideoOverlay');
    const fullscreenVideo = document.getElementById('fullscreenVideo');
    const closeFullscreenBtn = document.getElementById('closeFullscreenBtn');
    
    // Variable para controlar el estado
    let isFullscreen = false;
    let autoPlayAttempted = false;
    let videoSource = '';
    let wasPlayingBeforeFullscreen = false;
    
    // Guardar la fuente del video original
    if (video) {
      const sourceElement = video.querySelector('source');
      if (sourceElement) {
        videoSource = sourceElement.src;
      } else if (video.src) {
        videoSource = video.src;
      }
    }
    
    // --- FUNCIONES PARA PANTALLA COMPLETA ---
    
    // Entrar en modo pantalla completa
    function enterFullscreen() {
      if (!fullscreenOverlay || !fullscreenVideo || !video) return;
      
      // Guardar el estado de reproducción del video original
      wasPlayingBeforeFullscreen = !video.paused;
      
      // Copiar la fuente del video al overlay
      fullscreenVideo.src = videoSource;
      fullscreenVideo.load();
      
      // Mostrar el overlay
      fullscreenOverlay.style.display = 'flex';
      body.classList.add('video-fullscreen');
      isFullscreen = true;
      
      // Sincronizar el tiempo y reproducir
      setTimeout(async () => {
        try {
          // Sincronizar el tiempo actual
          if (video.currentTime > 0 && !video.ended) {
            fullscreenVideo.currentTime = video.currentTime;
          }
          await fullscreenVideo.play();
        } catch (err) {
          console.warn('Error al reproducir en pantalla completa:', err);
        }
      }, 100);
    }
    
    // Salir del modo pantalla completa y restaurar el video original
    function exitFullscreen() {
      if (!fullscreenOverlay || !fullscreenVideo || !video) return;
      
      // Guardar el tiempo actual del video en fullscreen
      const currentTime = fullscreenVideo.currentTime;
      const wasEnded = fullscreenVideo.ended;
      
      // Detener el video del overlay
      fullscreenVideo.pause();
      
      // Limpiar la fuente del overlay para liberar memoria
      fullscreenVideo.src = '';
      
      // Ocultar el overlay
      fullscreenOverlay.style.display = 'none';
      body.classList.remove('video-fullscreen');
      isFullscreen = false;
      
      // RESTAURAR EL VIDEO ORIGINAL A SU ESTADO NORMAL
      // Asegurarse de que el wrapper tenga sus dimensiones originales
      if (wrapper) {
        // Forzar un reflow para asegurar que las dimensiones se restablezcan
        wrapper.style.transform = 'scale(1)';
        wrapper.style.opacity = '1';
      }
      
      // Restaurar el video original
      if (!wasEnded) {
        video.currentTime = currentTime;
        
        // Si el video original estaba reproduciéndose antes de entrar en fullscreen,
        // o si no había terminado, lo dejamos pausado en la posición donde terminó el fullscreen
        if (wasPlayingBeforeFullscreen && !video.ended) {
          video.play().catch(err => console.warn('Error al reanudar:', err));
        }
      } else {
        // Si el video terminó, reseteamos el video original al inicio
        video.currentTime = 0;
        video.pause();
      }
      
      // Restaurar la visibilidad del botón de play
      updatePlayButtonVisibility();
      
      // Asegurar que el video original tenga el tamaño correcto
      video.style.width = '100%';
      video.style.height = '100%';
      
      // Forzar un reflow para que el navegador recalcule las dimensiones
      void video.offsetHeight;
    }
    
    // Función para resetear completamente el video a su estado inicial
    function resetVideoToInitialState() {
      if (!video) return;
      
      video.pause();
      video.currentTime = 0;
      if (wrapper) {
        wrapper.classList.remove('playing');
      }
      updatePlayButtonVisibility();
    }
    
    // Iniciar reproducción automática en pantalla completa
    async function startAutoPlayFullscreen() {
      if (autoPlayAttempted) return;
      autoPlayAttempted = true;
      
      // Resetear el video original al inicio antes de entrar en fullscreen
      if (video) {
        video.currentTime = 0;
        video.pause();
      }
      
      // Entrar en pantalla completa
      enterFullscreen();
    }
    
    // Actualizar la visibilidad del botón de play
    function updatePlayButtonVisibility() {
      if (video && wrapper) {
        if (video.paused || video.ended) {
          wrapper.classList.remove('playing');
        } else {
          wrapper.classList.add('playing');
        }
      }
    }
    
    // Eventos del video en pantalla completa
    if (fullscreenVideo) {
      // Cuando termina el video en pantalla completa, salir del modo
      fullscreenVideo.addEventListener('ended', () => {
        exitFullscreen();
        // Resetear el video original al estado inicial
        if (video) {
          video.currentTime = 0;
          video.pause();
          updatePlayButtonVisibility();
        }
      });
    }
    
    // Evento para cerrar manualmente (opcional, pero lo mantenemos)
    if (closeFullscreenBtn) {
      closeFullscreenBtn.addEventListener('click', () => {
        exitFullscreen();
      });
    }
    
    // Evento para el botón de play personalizado
    if (customPlayBtn) {
      customPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Si ya estamos en fullscreen, no hacer nada
        if (isFullscreen) return;
        // Si no, entrar en fullscreen
        enterFullscreen();
      });
    }
    
    // Eventos del video original
    if (video) {
      video.addEventListener('play', () => {
        if (wrapper) wrapper.classList.add('playing');
      });
      
      video.addEventListener('pause', () => {
        if (wrapper) wrapper.classList.remove('playing');
      });
      
      video.addEventListener('ended', () => {
        if (wrapper) wrapper.classList.remove('playing');
        updatePlayButtonVisibility();
      });
    }
    
    updatePlayButtonVisibility();
    
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
