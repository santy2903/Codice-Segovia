// Esperamos a que la página cargue completamente
document.addEventListener('DOMContentLoaded', function () {
  // Obtener elementos del DOM
  const validarButton = document.getElementById('validarButton');
  const respuestaInput = document.getElementById('respuestaInput');
  const mensajeDiv = document.getElementById('mensajeValidacion');
  const video = document.getElementById('video');
  const videoWrapper = document.querySelector('.video-wrapper');
  
  // Crear botón de play personalizado
  const playButton = document.createElement('div');
  playButton.className = 'custom-play-button';
  videoWrapper.appendChild(playButton);
  
  // Respuesta correcta (en mayúsculas para comparación)
  const RESPUESTA_CORRECTA = "ISABEL";

  // Variable para controlar si estamos en pantalla completa
  let isFullscreen = false;

  // Función para entrar en pantalla completa
  function enterFullscreen() {
    if (videoWrapper.requestFullscreen) {
      videoWrapper.requestFullscreen();
    } else if (videoWrapper.webkitRequestFullscreen) { /* Safari */
      videoWrapper.webkitRequestFullscreen();
    } else if (videoWrapper.msRequestFullscreen) { /* IE11 */
      videoWrapper.msRequestFullscreen();
    }
  }

  // Función para salir de pantalla completa
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
  }

  // Evento para el botón de play personalizado
  playButton.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // Intentar reproducir el video
    video.play().then(() => {
      // Marcar como reproduciendo
      videoWrapper.classList.add('playing');
      
      // Entrar en pantalla completa
      enterFullscreen();
      isFullscreen = true;
    }).catch(error => {
      console.log("Error al reproducir:", error);
    });
  });

  // Evento cuando termina el video
  video.addEventListener('ended', function() {
    // Quitar clase de reproduciendo para mostrar botón de play
    videoWrapper.classList.remove('playing');
    
    // Salir de pantalla completa si estamos en ella
    if (isFullscreen) {
      exitFullscreen();
      isFullscreen = false;
    }
  });

  // Evento para cuando el video se pausa (por cualquier motivo)
  video.addEventListener('pause', function() {
    // Solo quitamos la clase si no estamos en pantalla completa
    // y si el video no ha terminado
    if (!isFullscreen && !video.ended) {
      videoWrapper.classList.remove('playing');
    }
  });

  // Evento cuando el video se reproduce
  video.addEventListener('play', function() {
    videoWrapper.classList.add('playing');
  });

  // Detectar cambios en pantalla completa
  function handleFullscreenChange() {
    isFullscreen = !!(document.fullscreenElement || 
                      document.webkitFullscreenElement || 
                      document.mozFullScreenElement || 
                      document.msFullscreenElement);
    
    // Si salimos de pantalla completa y el video sigue reproduciéndose, lo pausamos
    if (!isFullscreen && !video.paused && !video.ended) {
      video.pause();
    }
  }

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);

  // Permitir hacer clic en el wrapper para pausar/reanudar
  videoWrapper.addEventListener('click', function(e) {
    // Si el clic no fue en el botón de play
    if (!e.target.classList.contains('custom-play-button')) {
      if (video.paused) {
        video.play();
        enterFullscreen();
      } else {
        video.pause();
      }
    }
  });

  // Agregar el evento de clic al botón validar
  validarButton.addEventListener('click', function () {
    // Obtener el valor del input, eliminar espacios extras y convertir a mayúsculas
    const respuestaUsuario = respuestaInput.value.trim().toUpperCase();
    
    // Limpiar mensajes anteriores
    mensajeDiv.innerHTML = '';
    
    // Verificar si el campo está vacío
    if (respuestaUsuario === '') {
      // No mostrar mensaje si está vacío (según requerimiento)
      return;
    }
    
    // Comparar respuestas
    if (respuestaUsuario === RESPUESTA_CORRECTA) {
      // Mostrar mensaje de respuesta correcta
      mensajeDiv.innerHTML = '<span class="mensaje-correcto">¡Respuesta correcta!</span>';
      
      // Esperar 1 segundo y redirigir a la siguiente página
      setTimeout(function() {
        window.location.href = 'coronacion.html';
      }, 1000);
    } else {
      // Mostrar mensaje de respuesta incorrecta en rojo
      mensajeDiv.innerHTML = '<span class="mensaje-incorrecto">Respuesta incorrecta. Inténtalo de nuevo.</span>';
      
      // Opcional: Limpiar el campo de texto para facilitar un nuevo intento
      // respuestaInput.value = '';
    }
  });
  
  // Opcional: Permitir enviar con la tecla Enter
  respuestaInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      validarButton.click();
    }
  });
});