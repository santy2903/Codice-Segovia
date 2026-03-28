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
      if (!fullscreenOverlay || !fullscreenVideo) return;
      
      // Copiar la fuente del video
      fullscreenVideo.src = videoSource;
      fullscreenVideo.load();
      
      // Mostrar el overlay
      fullscreenOverlay.style.display = 'flex';
      body.classList.add('video-fullscreen');
      isFullscreen = true;
      
      // Intentar reproducir el video en pantalla completa
      setTimeout(async () => {
        try {
          // Obtener el tiempo actual del video original si estaba reproduciéndose
          if (video && !video.paused && video.currentTime > 0) {
            fullscreenVideo.currentTime = video.currentTime;
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
      
      // Guardar el tiempo actual antes de salir
      const currentTime = fullscreenVideo.currentTime;
      
      // Detener el video del overlay
      fullscreenVideo.pause();
      
      // Ocultar el overlay
      fullscreenOverlay.style.display = 'none';
      body.classList.remove('video-fullscreen');
      isFullscreen = false;
      
      // Sincronizar el video original
      if (video && currentTime > 0 && !video.ended) {
        video.currentTime = currentTime;
        // Si el video original estaba en reproducción antes de entrar en fullscreen,
        // continuar reproduciéndolo
        if (!video.paused) {
          video.play().catch(err => console.warn('Error al reanudar:', err));
        }
      }
      
      // Limpiar la fuente del overlay
      setTimeout(() => {
        fullscreenVideo.src = '';
      }, 100);
    }
    
    // Iniciar reproducción automática en pantalla completa
    async function startAutoPlayFullscreen() {
      if (autoPlayAttempted) return;
      autoPlayAttempted = true;
      
      // Entrar en pantalla completa directamente
      enterFullscreen();
    }
    
    // Eventos del video en pantalla completa
    if (fullscreenVideo) {
      // Cuando termina el video en pantalla completa, salir del modo
      fullscreenVideo.addEventListener('ended', () => {
        exitFullscreen();
      });
      
      // Evento para pausar (opcional)
      fullscreenVideo.addEventListener('pause', () => {
        // No hacemos nada especial
      });
      
      fullscreenVideo.addEventListener('play', () => {
        // No hacemos nada especial
      });
    }
    
    // Evento para cerrar manualmente (opcional)
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
    
    // Sincronizar el estado del botón de play del video original
    function updatePlayButtonVisibility() {
      if (video && wrapper) {
        if (video.paused) {
          wrapper.classList.remove('playing');
        } else {
          wrapper.classList.add('playing');
        }
      }
    }
    
    if (video) {
      video.addEventListener('play', () => {
        if (wrapper) wrapper.classList.add('playing');
      });
      
      video.addEventListener('pause', () => {
        if (wrapper) wrapper.classList.remove('playing');
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
