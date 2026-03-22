// sw.js - Service Worker básico
self.addEventListener('fetch', event => {
    // No es necesario hacer nada aquí para que funcione la instalación
    // Solo con existir, Chrome permite la opción "Instalar aplicación"
});

// Opcional: puedes agregar un evento de instalación para cachear recursos,
// pero no es necesario para el modo pantalla completa.