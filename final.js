(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Elementos
    const video = document.getElementById('video');
    const wrapper = document.getElementById('videoWrapper');
    const customPlayBtn = document.getElementById('customPlayBtn');
    const mapaButton = document.getElementById('mapaButton');
    const passwordInput = document.getElementById('passwordInput');
    const body = document.body;

    // --- LÓGICA DE VIDEO: PANTALLA COMPLETA TOTAL ---
    if (video && wrapper && customPlayBtn) {
      
      function updatePlayButtonVisibility() {
        if (video.paused) {
          wrapper.classList.remove('playing');
        } else {
          wrapper.classList.add('playing');
        }
      }

      // Entrar en modo pantalla completa (cubre toda la pantalla)
      function enterFullscreen() {
        body.classList.add('video-fullscreen');
      }

      // Salir del modo pantalla completa
      function exitFullscreen() {
        body.classList.remove('video-fullscreen');
      }

      // Variable para controlar si ya se intentó el autoplay
      let autoPlayAttempted = false;
      let isFullscreen = false;

      // Función principal: expandir a pantalla completa y reproducir
      async function startVideoFullscreen() {
        if (autoPlayAttempted) return;
        autoPlayAttempted = true;

        // Expandir a pantalla completa
        enterFullscreen();
        isFullscreen = true;

        // Pequeño retraso para que el navegador aplique los estilos
        setTimeout(async () => {
          try {
            // Intentar reproducir con sonido
            await video.play();
            updatePlayButtonVisibility();
          } catch (err) {
            console.warn('Autoplay bloqueado por el navegador:', err);
            // Si no se pudo reproducir automáticamente, mostramos el botón de play
            updatePlayButtonVisibility();
          }
        }, 100);
      }

      // Función para cuando el usuario hace clic en el botón de play
      async function manualPlay() {
        // Si ya está en modo fullscreen pero pausado, solo reproducir
        if (body.classList.contains('video-fullscreen')) {
          try {
            await video.play();
            updatePlayButtonVisibility();
          } catch (err) {
            console.warn('Error al reproducir manualmente:', err);
          }
        } else {
          // Si no está en modo fullscreen, expandir y reproducir
          enterFullscreen();
          isFullscreen = true;
          setTimeout(async () => {
            try {
              await video.play();
              updatePlayButtonVisibility();
            } catch (err) {
              console.warn('Error al reproducir manualmente:', err);
            }
          }, 100);
        }
      }

      // Evento del botón de play
      if (customPlayBtn) {
        customPlayBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          manualPlay();
        });
      }

      // Eventos del video
      video.addEventListener('play', () => {
        wrapper.classList.add('playing');
      });

      video.addEventListener('pause', () => {
        wrapper.classList.remove('playing');
      });

      // Cuando el video termina, salir del modo fullscreen
      video.addEventListener('ended', () => {
        exitFullscreen();
        wrapper.classList.remove('playing');
        isFullscreen = false;
      });

      // Si el usuario presiona el botón de "Esc" o sale del modo fullscreen manualmente
      // detectamos cambios en la clase del body
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.attributeName === 'class') {
            if (!body.classList.contains('video-fullscreen') && isFullscreen && !video.ended) {
              // Si salieron manualmente del fullscreen y el video no terminó, lo pausamos? 
              // Mejor lo dejamos seguir, pero actualizamos la variable
              isFullscreen = false;
            }
          }
        });
      });
      
      observer.observe(body, { attributes: true });

      updatePlayButtonVisibility();

      // Iniciar automáticamente al cargar la página
      setTimeout(() => {
        startVideoFullscreen();
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
