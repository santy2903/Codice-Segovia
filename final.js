(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Elementos
    const video = document.getElementById('video');
    const wrapper = document.getElementById('videoWrapper');
    const customPlayBtn = document.getElementById('customPlayBtn');
    const mapaButton = document.getElementById('mapaButton');
    const passwordInput = document.getElementById('passwordInput');

    // --- LÓGICA DE VIDEO: PANTALLA COMPLETA CON CSS Y AUTOPLAY ---
    if (video && wrapper && customPlayBtn) {
      
      function updatePlayButtonVisibility() {
        if (video.paused) {
          wrapper.classList.remove('playing');
        } else {
          wrapper.classList.add('playing');
        }
      }

      // Entrar en modo pantalla completa (CSS, no API)
      function enterFullscreenCSS() {
        wrapper.classList.add('fullscreen-mode');
      }

      // Salir del modo pantalla completa
      function exitFullscreenCSS() {
        wrapper.classList.remove('fullscreen-mode');
      }

      // Variable para controlar si ya se intentó el autoplay
      let autoPlayAttempted = false;

      // Función principal: expandir y reproducir
      async function startVideoFullscreen() {
        if (autoPlayAttempted) return;
        autoPlayAttempted = true;

        // Primero expandir a pantalla completa (CSS)
        enterFullscreenCSS();

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
            // El botón de play está visible, al hacer clic se intentará de nuevo
          }
        }, 100);
      }

      // Función para cuando el usuario hace clic en el botón de play
      async function manualPlay() {
        // Si ya está en modo fullscreen pero pausado, solo reproducir
        if (wrapper.classList.contains('fullscreen-mode')) {
          try {
            await video.play();
            updatePlayButtonVisibility();
          } catch (err) {
            console.warn('Error al reproducir manualmente:', err);
          }
        } else {
          // Si no está en modo fullscreen, expandir y reproducir
          enterFullscreenCSS();
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
      customPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        manualPlay();
      });

      // Eventos del video
      video.addEventListener('play', () => {
        wrapper.classList.add('playing');
      });

      video.addEventListener('pause', () => {
        wrapper.classList.remove('playing');
      });

      // Cuando el video termina, salir del modo fullscreen y volver al tamaño original
      video.addEventListener('ended', () => {
        exitFullscreenCSS();
        wrapper.classList.remove('playing');
        // Opcional: también podríamos reiniciar el video para futuras reproducciones
        // pero no es necesario
      });

      // Si el usuario sale del modo fullscreen manualmente (por ejemplo, haciendo scroll o tocando),
      // también detenemos el video? No, mejor lo dejamos seguir, pero actualizamos la interfaz.
      // Podríamos agregar un observador de cambios en la clase, pero no es crítico.

      updatePlayButtonVisibility();

      // Iniciar automáticamente al cargar la página
      startVideoFullscreen();
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
