document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const playButton = document.getElementById('playButton');
    const validateButton = document.getElementById('validateButton');
    const messageContainer = document.getElementById('messageContainer');
    const wheelsRow = document.getElementById('wheelsRow');
    const wordDisplay = document.getElementById('wordDisplay');
    
    // Palabra correcta (MAGICA)
    const CORRECT_WORD = ['M', 'A', 'G', 'I', 'C', 'A'];
    
    // Abecedario español (mayúsculas)
    const alphabet = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    
    // Estado de las ruedas - Inicializar todas con 'Z' (última letra del alfabeto)
    const Z_INDEX = alphabet.length - 1;
    let wheelIndexes = [Z_INDEX, Z_INDEX, Z_INDEX, Z_INDEX, Z_INDEX, Z_INDEX];
    
    let wheels = [];
    
    // Inicializar las ruedas giratorias
    function initializeWheels() {
        wheelsRow.innerHTML = '';
        wordDisplay.innerHTML = '';
        wheels = [];
        
        for (let i = 0; i < 6; i++) {
            // Crear wrapper de la rueda
            const wheelWrapper = document.createElement('div');
            wheelWrapper.className = 'wheel-wrapper';
            wheelWrapper.dataset.position = i;
            wheelWrapper.dataset.correct = CORRECT_WORD[i];
            
            // Crear spinner
            const spinner = document.createElement('div');
            spinner.className = 'wheel-spinner';
            spinner.id = `wheel${i}`;
            
            // Botón arriba
            const upButton = document.createElement('div');
            upButton.className = 'wheel-button up';
            upButton.innerHTML = '▲';
            upButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                changeLetter(i, 1);
            });
            
            // Letra actual (Z inicialmente)
            const currentLetter = document.createElement('div');
            currentLetter.className = 'wheel-current';
            currentLetter.id = `wheel-current-${i}`;
            currentLetter.textContent = alphabet[wheelIndexes[i]];
            
            // Botón abajo
            const downButton = document.createElement('div');
            downButton.className = 'wheel-button down';
            downButton.innerHTML = '▼';
            downButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                changeLetter(i, -1);
            });
            
            // Indicador de letra correcta
            const indicator = document.createElement('div');
            indicator.className = 'wheel-indicator';
            indicator.id = `indicator-${i}`;
            indicator.textContent = '?';
            
            // Ensamblar spinner
            spinner.appendChild(upButton);
            spinner.appendChild(currentLetter);
            spinner.appendChild(downButton);
            
            // Ensamblar wrapper
            wheelWrapper.appendChild(spinner);
            wheelWrapper.appendChild(indicator);
            
            wheelsRow.appendChild(wheelWrapper);
            
            // Crear display de letra
            const letterSpan = document.createElement('span');
            letterSpan.className = 'word-letter';
            letterSpan.id = `letter${i}`;
            letterSpan.textContent = alphabet[wheelIndexes[i]];
            wordDisplay.appendChild(letterSpan);
            
            // Guardar referencia
            wheels.push({
                wrapper: wheelWrapper,
                spinner: spinner,
                current: currentLetter,
                indicator: indicator,
                letterSpan: letterSpan
            });
        }
        
        // Verificar estado inicial
        checkAllLetters();
    }
    
    // Cambiar letra de una rueda
    function changeLetter(position, direction) {
        // Actualizar índice
        wheelIndexes[position] = (wheelIndexes[position] + direction + alphabet.length) % alphabet.length;
        
        // Actualizar display
        const newLetter = alphabet[wheelIndexes[position]];
        wheels[position].current.textContent = newLetter;
        wheels[position].letterSpan.textContent = newLetter;
        
        // Verificar si es la letra correcta
        if (newLetter === CORRECT_WORD[position]) {
            // Destello verde
            wheels[position].spinner.classList.add('flash');
            setTimeout(() => {
                wheels[position].spinner.classList.remove('flash');
            }, 600);
            
            // Actualizar indicador
            wheels[position].indicator.textContent = '✓';
            wheels[position].indicator.style.background = '#4caf50';
        } else {
            // Actualizar indicador
            wheels[position].indicator.textContent = '?';
            wheels[position].indicator.style.background = '#ff5733';
        }
        
        // Pequeña retroalimentación háptica
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    }
    
    // Verificar todas las letras
    function checkAllLetters() {
        for (let i = 0; i < 6; i++) {
            const currentLetter = alphabet[wheelIndexes[i]];
            
            if (currentLetter === CORRECT_WORD[i]) {
                wheels[i].indicator.textContent = '✓';
                wheels[i].indicator.style.background = '#4caf50';
            } else {
                wheels[i].indicator.textContent = '?';
                wheels[i].indicator.style.background = '#ff5733';
            }
        }
    }
    
    // Validar la palabra completa
    function validateWord() {
        let isCorrect = true;
        
        for (let i = 0; i < 6; i++) {
            const currentLetter = alphabet[wheelIndexes[i]];
            if (currentLetter !== CORRECT_WORD[i]) {
                isCorrect = false;
                break;
            }
        }
        
        messageContainer.innerHTML = '';
        messageContainer.className = 'message-container';
        
        if (isCorrect) {
            messageContainer.textContent = '¡Respuesta correcta!';
            messageContainer.classList.add('message-correct');
            
            for (let i = 0; i < 6; i++) {
                wheels[i].spinner.classList.add('flash');
            }
            
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate([50, 50, 50]);
            }
            
            setTimeout(() => {
                window.location.href = 'resolucion.html';
            }, 1500);
            
        } else {
            messageContainer.textContent = 'Respuesta incorrecta';
            messageContainer.classList.add('message-incorrect');
            
            for (let i = 0; i < 6; i++) {
                const currentLetter = alphabet[wheelIndexes[i]];
                if (currentLetter !== CORRECT_WORD[i]) {
                    wheels[i].spinner.style.animation = 'none';
                    wheels[i].spinner.offsetHeight;
                    wheels[i].spinner.style.animation = 'flash 0.6s ease-out';
                    
                    setTimeout(() => {
                        wheels[i].spinner.style.animation = '';
                    }, 600);
                }
            }
            
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(200);
            }
            
            setTimeout(() => {
                messageContainer.innerHTML = '';
                messageContainer.className = 'message-container';
            }, 3000);
        }
    }
    
    // Función para manejar el play del video
    function playVideo() {
        playButton.classList.add('hidden');
        
        video.play().then(() => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        }).catch(error => {
            console.log('Error al reproducir:', error);
            playButton.classList.remove('hidden');
        });
    }
    
    // Eventos
    playButton.addEventListener('click', playVideo);
    validateButton.addEventListener('click', validateWord);
    
    // Eventos del video
    video.addEventListener('ended', function() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        playButton.classList.remove('hidden');
    });
    
    video.addEventListener('pause', function() {
        if (!video.ended) {
            playButton.classList.remove('hidden');
        }
    });
    
    video.addEventListener('play', function() {
        playButton.classList.add('hidden');
    });
    
    // Eventos de pantalla completa
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    function handleFullscreenChange() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && 
            !document.msFullscreenElement && !video.paused && !video.ended) {
            playButton.classList.remove('hidden');
        }
    }
    
    // Prevenir menús contextuales
    video.addEventListener('contextmenu', (e) => e.preventDefault());
    wheelsRow.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Optimización para móviles
    video.setAttribute('preload', 'metadata');
    video.setAttribute('playsinline', true);
    
    // Inicializar
    initializeWheels();
    
    // Animación de entrada
    setTimeout(() => {
        playButton.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
    
    // Prevenir gestos multi-touch
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });
});