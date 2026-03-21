function estaResuelta(id) {
  return localStorage.getItem(`parada_${id}`) === "ok";
}

function obtenerParada(id) {
  return PARADAS.find(parada => parada.id === id);
}

function todasResueltas() {
  return PARADAS.every(parada => estaResuelta(parada.id));
}

function actualizarBotones() {
  const botones = document.querySelectorAll(".boton-circular");

  botones.forEach(boton => {
    const id = Number(boton.dataset.id);
    const parada = obtenerParada(id);

    if (!parada) return;

    const imagenActual = estaResuelta(id) ? parada.imagenOk : parada.imagenBoton;

    boton.style.setProperty("--img", `url('${imagenActual}')`);
    boton.classList.toggle("completada", estaResuelta(id)); // Marca el botón como completado
  });
}

function activarBotonContinuar() {
  const continuarBtn = document.getElementById("continuarBtn");
  if (!continuarBtn) return;

  continuarBtn.disabled = !todasResueltas(); // Solo habilitar si todas las respuestas están correctas
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarBotones();
  activarBotonContinuar(); // Verifica si todas las respuestas están completas y habilita el botón

  const continuarBtn = document.getElementById("continuarBtn");


  // Redirigir a final.html cuando el botón Continuar esté habilitado
  continuarBtn.addEventListener("click", () => {
    if (todasResueltas()) {
      window.location.href = "final.html"; // Redirige a la página final del juego
    }
  });
});
