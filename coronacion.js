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
        // Verificar que el video existe
        if (video.readyState === 0) {
            console.error('El video no se ha cargado correctamente');
            alert('Error: No se pudo cargar el video. Verifica que el archivo existe.');
            return;
        }
        
        video.play().catch(function(error) {
            console.error('Error al reproducir:', error);
            alert('Error al reproducir el video. Por favor, intenta de nuevo.');
        });
        
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

    // Evento para el botón de premio - Versión mejorada
    mapaButton.addEventListener('click', function () {
        // Intentar con diferentes extensiones
        const posiblesNombres = ['premio.jpeg', 'premio.jpg', 'premio.JPG', 'premio.JPEG'];
        let intento = 0;
        
        function intentarCargar() {
            if (intento < posiblesNombres.length) {
                const img = new Image();
                img.onload = function() {
                    // Si la imagen carga, redirigir
                    window.location.href = posiblesNombres[intento];
                };
                img.onerror = function() {
                    intento++;
                    intentarCargar();
                };
                img.src = posiblesNombres[intento];
            } else {
                alert('No se pudo encontrar la imagen del premio. Verifica que el archivo existe en el repositorio.');
            }
        }
        
        intentarCargar();
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
    
    // Verificar que los archivos existen al cargar la página
    console.log('Verificando archivos...');
    
    // Verificar video
    video.addEventListener('error', function() {
        console.error('Error al cargar el video. Verifica que el archivo "coronacion.mp4" existe.');
    });
});
