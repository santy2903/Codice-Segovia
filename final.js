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

      // Función para entrar a pantalla completa
      function enterFullscreen(element) {
        if (element.requestFullscreen) {
          return element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          return element.webkitRequestFullscreen();
        } else if (element.webkitEnterFullscreen) {
          return element.webkitEnterFullscreen();
        } else if (element.mozRequestFullScreen) {
          return element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          return element.msRequestFullscreen();
        }
        return Promise.reject(new Error('Fullscreen not supported'));
      }

      // Función para salir de pantalla completa
      function exitFullscreen() {
        if (document.exitFullscreen) {
          return document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          return document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          return document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          return document.msExitFullscreen();
        }
        return Promise.reject(new Error('Fullscreen exit not supported'));
      }

      // Variable para controlar si ya se intentó la reproducción automática
      let autoPlayAttempted = false;

      // Función principal para iniciar video en pantalla completa
      async function startVideoInFullscreen() {
        if (autoPlayAttempted) return;
        autoPlayAttempted = true;
        
        try {
          // Primero entrar a pantalla completa con el wrapper del video
          await enterFullscreen(wrapper);
          
          // Pequeña pausa para asegurar que la pantalla completa se activó
          setTimeout(async () => {
            try {
              // Reproducir el video
              await video.play();
              updatePlayButtonVisibility();
            } catch (playErr) {
              console.warn('Error al reproducir:', playErr);
              // Si falla la reproducción, mostrar botón de play
              updatePlayButtonVisibility();
            }
          }, 100);
          
        } catch (fsErr) {
          console.warn('Error al entrar a pantalla completa:', fsErr);
          // Si falla pantalla completa, al menos intentar reproducir
          try {
            await video.play();
            updatePlayButtonVisibility();
          } catch (playErr) {
            console.warn('Error al reproducir:', playErr);
            updatePlayButtonVisibility();
          }
        }
      }

      // Evento para el botón de play personalizado
      customPlayBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        await startVideoInFullscreen();
      });

      // Detectar cuando se sale de pantalla completa manualmente
      function handleFullscreenChange() {
        const isFullscreen = !!(document.fullscreenElement || 
                                 document.webkitFullscreenElement || 
                                 document.mozFullScreenElement);
        
        // Si no estamos en pantalla completa y el video no ha terminado
        if (!isFullscreen && !video.ended && !video.paused) {
          // Si el usuario salió manualmente de pantalla completa pero el video sigue,
          // no hacemos nada, pero actualizamos la visibilidad del botón
          updatePlayButtonVisibility();
        }
        
        updatePlayButtonVisibility();
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

      // Cuando el video termina, salir de pantalla completa
      video.addEventListener('ended', async function () {
        wrapper.classList.remove('playing');
        
        // Salir de pantalla completa cuando termina el video
        try {
          await exitFullscreen();
        } catch (err) {
          console.warn('Error al salir de pantalla completa:', err);
        }
      });

      updatePlayButtonVisibility();
      
      // INICIAR VIDEO AUTOMÁTICAMENTE EN PANTALLA COMPLETA AL CARGAR LA PÁGINA
      // Esperar a que el DOM esté completamente cargado y luego iniciar
      setTimeout(() => {
        startVideoInFullscreen();
      }, 200);
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
