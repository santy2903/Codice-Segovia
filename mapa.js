function estaResuelta(id) {
  return localStorage.getItem(`parada_${id}`) === "ok";
}

function obtenerParada(id) {
  return PARADAS.find(parada => parada.id === id);
}

function todasResueltas() {
  return PARADAS.every(parada => estaResuelta(parada.id));
}

// Variable para controlar si ya se realizó la redirección automática
let redireccionRealizada = false;

function actualizarBotones() {
  const botones = document.querySelectorAll(".boton-circular");

  botones.forEach(boton => {
    const id = Number(boton.dataset.id);
    const parada = obtenerParada(id);

    if (!parada) return;

    const imagenActual = estaResuelta(id) ? parada.imagenOk : parada.imagenBoton;

    boton.style.setProperty("--img", `url('${imagenActual}')`);
    boton.classList.toggle("completada", estaResuelta(id));
  });
}

function activarBotonContinuar() {
  const continuarBtn = document.getElementById("continuarBtn");
  if (!continuarBtn) return;

  continuarBtn.disabled = !todasResueltas();
  
  // Verificar si todas están resueltas y aún no se ha realizado la redirección
  if (todasResueltas() && !redireccionRealizada) {
    // Marcar que ya se va a realizar la redirección para evitar múltiples llamadas
    redireccionRealizada = true;
    
    // Esperar medio segundo (500ms) y luego redirigir
    setTimeout(() => {
      window.location.href = "final.html";
    }, 500);
  }
}

// Función para verificar si una parada específica es la última por resolver
function verificarUltimaParada(id) {
  // Contar cuántas paradas están resueltas actualmente
  const resueltas = PARADAS.filter(parada => estaResuelta(parada.id)).length;
  const totalParadas = PARADAS.length;
  
  // Si después de marcar esta parada, todas estarán resueltas
  if (resueltas === totalParadas - 1 && estaResuelta(id)) {
    // Es la última parada, activar la redirección
    activarBotonContinuar();
  }
}

// Función para marcar una parada como completada
function marcarParadaCompletada(id) {
  if (!estaResuelta(id)) {
    localStorage.setItem(`parada_${id}`, "ok");
    actualizarBotones();
    
    // Verificar si esta es la última parada
    verificarUltimaParada(id);
  }
}

// Escuchar cambios en localStorage (cuando otra pestaña o ventana modifica los datos)
window.addEventListener('storage', function(e) {
  if (e.key && e.key.startsWith('parada_')) {
    actualizarBotones();
    activarBotonContinuar();
  }
});

// Función global para que desde otras páginas (como parada.html)
// se pueda notificar cuando se completa una parada
window.notificarParadaCompletada = function(id) {
  marcarParadaCompletada(id);
};

// Escuchar mensajes de otras pestañas/ventanas usando BroadcastChannel
const channel = new BroadcastChannel('paradas_channel');

channel.addEventListener('message', (event) => {
  if (event.data.tipo === 'parada_completada') {
    // Actualizar la interfaz cuando se completa una parada desde otra pestaña
    actualizarBotones();
    activarBotonContinuar();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  actualizarBotones();
  activarBotonContinuar();

  const continuarBtn = document.getElementById("continuarBtn");

  // Mantener la funcionalidad del botón por si acaso (como respaldo)
  if (continuarBtn) {
    continuarBtn.addEventListener("click", () => {
      if (todasResueltas() && !redireccionRealizada) {
        redireccionRealizada = true;
        window.location.href = "final.html";
      }
    });
  }
});
