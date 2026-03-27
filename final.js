(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Elementos
    const video = document.getElementById('video');
    const wrapper = document.getElementById('videoWrapper');
    const customPlayBtn = document.getElementById('customPlayBtn');
    const mapaButton = document.getElementById('mapaButton');
    const passwordInput = document.getElementById('passwordInput');

    // --- LÓGICA DE VIDEO: REPRODUCCIÓN AUTOMÁTICA EN PANTALLA COMPLETA ---
    if (video && wrapper && customPlayBtn) {
      
      function updatePlayButtonVisibility() {
        if (video.paused) {
          wrapper.classList.remove('playing');
        } else {
          wrapper.classList.add('playing');
        }
      }

      // Función para iniciar video en pantalla completa
      async function startVideoInFullscreen() {
        try {
          // Intentar reproducir el video sin mute
          await video.play();
          
          // Solicitar pantalla completa
          if (video.requestFullscreen) {
            await video.requestFullscreen();
          } else if (video.webkitEnterFullscreen) {
            video.webkitEnterFullscreen();
          } else if (video.webkitRequestFullscreen) {
            await video.webkitRequestFullscreen();
          } else if (video.mozRequestFullScreen) {
            await video.mozRequestFullScreen();
          } else if (video.msRequestFullscreen) {
            await video.msRequestFullscreen();
          }
          
          updatePlayButtonVisibility();
        } catch (err) {
          console.warn('Error al iniciar reproducción automática:', err);
          // Si el autoplay está bloqueado por el navegador, mostrar el botón manual
          updatePlayButtonVisibility();
        }
      }

      // Evento para el botón de play personalizado (en caso de que autoplay falle)
      customPlayBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        await startVideoInFullscreen();
      });

      // Detectar cambios en pantalla completa
      function handleFullscreenChange() {
        const isFullscreen = !!(document.fullscreenElement || 
                                 document.webkitFullscreenElement || 
                                 document.mozFullScreenElement);
        
        if (!isFullscreen && !video.paused && !video.ended) {
          // Si salimos de pantalla completa y el video sigue reproduciéndose,
          // no hacemos nada para mantener la reproducción
          updatePlayButtonVisibility();
        } else if (!isFullscreen && video.paused) {
          updatePlayButtonVisibility();
        }
      }

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);
      document.addEventListener('MSFullscreenChange', handleFullscreenChange);

      // Eventos del video
      video.addEventListener('play', function () {
        wrapper.classList.add('playing');
      });

      video.addEventListener('pause', function () {
        wrapper.classList.remove('playing');
      });

      video.addEventListener('ended', function () {
        // Salir de pantalla completa cuando termina el video
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(err => console.warn(err));
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        wrapper.classList.remove('playing');
      });

      updatePlayButtonVisibility();
      
      // INICIAR VIDEO AUTOMÁTICAMENTE AL CARGAR LA PÁGINA
      // Pequeño retraso para asegurar que el DOM está listo
      setTimeout(() => {
        startVideoInFullscreen();
      }, 100);
    }

    // --- LÓGICA DE CONTRASEÑA Y BOTÓN CONTINUAR ---
    const CORRECT_PASSWORD = 'Segovia';

    function checkPasswordAndEnableButton() {
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
        // Si no está habilitado, no deja continuar
        if (!mapaButton.classList.contains('enabled')) {
          e.preventDefault();
          e.stopPropagation();

          passwordInput.style.borderColor = '#ff3333';
          setTimeout(() => {
            passwordInput.style.borderColor = 'rgba(255,87,51,0.6)';
          }, 300);
          return;
        }

        // Redirigir a la página criptex.html
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

    // --- FUNCIONALIDAD SIMPLE EXTRA DE REDIRECCIÓN ---
    if (mapaButton && !passwordInput) {
      mapaButton.addEventListener('click', function () {
        window.location.href = 'criptex.html';
      });
    }
  });
})();
