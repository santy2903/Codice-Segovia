(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Elementos
    const video = document.getElementById('video');
    const wrapper = document.getElementById('videoWrapper');
    const customPlayBtn = document.getElementById('customPlayBtn');
    const mapaButton = document.getElementById('mapaButton');
    const passwordInput = document.getElementById('passwordInput');

    // --- LÓGICA DE VIDEO: PLAY FULLSCREEN Y OCULTAR BOTÓN ---
    if (video && wrapper && customPlayBtn) {
      function updatePlayButtonVisibility() {
        if (video.paused) {
          wrapper.classList.remove('playing');
        } else {
          wrapper.classList.add('playing');
        }
      }

      customPlayBtn.addEventListener('click', async function (e) {
        e.stopPropagation();

        try {
          await video.play();

          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (video.webkitEnterFullscreen) {
            video.webkitEnterFullscreen();
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
          } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
          } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
          }

          updatePlayButtonVisibility();
        } catch (err) {
          console.warn('Error al reproducir en fullscreen:', err);
          try {
            await video.play();
          } catch (e) {}
          updatePlayButtonVisibility();
        }
      });

      document.addEventListener('fullscreenchange', function () {
        if (
          !document.fullscreenElement &&
          !document.webkitFullscreenElement &&
          !document.mozFullScreenElement
        ) {
          updatePlayButtonVisibility();
        }
      });

      video.addEventListener('play', function () {
        wrapper.classList.add('playing');
      });

      video.addEventListener('pause', function () {
        wrapper.classList.remove('playing');
      });

      video.addEventListener('ended', function () {
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
      video.addEventListener('pause', updatePlayButtonVisibility);
    }

    // --- LÓGICA DE CONTRASEÑA Y BOTÓN CONTINUAR ---
    const CORRECT_PASSWORD = 'Segovia';

    function checkPasswordAndEnableButton() {
      const entered = passwordInput.value.trim();

      if (
        entered.localeCompare(CORRECT_PASSWORD, undefined, {
          sensitivity: 'base'
        }) === 0
      ) {
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
    // Esto solo actúa si existe el botón y no hay input de contraseña
    if (mapaButton && !passwordInput) {
      mapaButton.addEventListener('click', function () {
        window.location.href = 'criptex.html';
      });
    }
  });
})();
