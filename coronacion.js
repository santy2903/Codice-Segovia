// Esperamos a que la página cargue completamente
document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const playButton = document.getElementById('playButton');
    const mapaButton = document.getElementById('mapaButton');
    
    // Función para entrar en pantalla completa
    function enterFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    // Función para salir de pantalla completa
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    // Evento para el botón de play
    playButton.addEventListener('click', function() {
        video.play();
        video.classList.add('playing');
        playButton.style.display = 'none';
        
        // Entrar en pantalla completa al iniciar reproducción
        enterFullscreen(video);
    });

    // Evento cuando el video termina
    video.addEventListener('ended', function() {
        video.classList.remove('playing');
        playButton.style.display = 'flex';
        
        // Salir de pantalla completa al terminar
        exitFullscreen();
    });

    // Si el usuario pausa manualmente el video
    video.addEventListener('pause', function() {
        if (!video.ended) {
            playButton.style.display = 'flex';
        }
    });

    // Si el usuario reanuda la reproducción manualmente
    video.addEventListener('play', function() {
        playButton.style.display = 'none';
    });

    // Evento para el botón de premio
    mapaButton.addEventListener('click', function () {
        window.location.href = 'premio.jpeg';
    });

    // Manejar cambios en pantalla completa
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    function handleFullscreenChange() {
        const isFullscreen = document.fullscreenElement || 
                            document.webkitFullscreenElement || 
                            document.msFullscreenElement;
        
        // Si no estamos en pantalla completa y el video se está reproduciendo
        if (!isFullscreen && !video.paused && !video.ended) {
            // No hacemos nada, el video sigue reproduciéndose
        }
    }
});