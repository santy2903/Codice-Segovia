function obtenerIdDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

function obtenerParada(id) {
  return PARADAS.find(parada => parada.id === id);
}

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

document.addEventListener("DOMContentLoaded", () => {
  const id = obtenerIdDesdeURL();
  const parada = obtenerParada(id);

  if (!parada) {
    document.body.innerHTML = "<h1>Parada no encontrada</h1>";
    return;
  }

  document.getElementById("tituloParada").textContent = parada.titulo;
  document.getElementById("imagenParada").src = parada.imagenParada; // aquí estaba el error
  document.getElementById("preguntaParada").textContent = parada.pregunta;

  const input = document.getElementById("respuestaUsuario");
  const boton = document.getElementById("verificarBtn");
  const mensaje = document.getElementById("mensaje");

  function verificarRespuesta() {
    const respuestaUsuario = normalizarTexto(input.value);
    const respuestaCorrecta = normalizarTexto(parada.respuesta);

    if (respuestaUsuario === respuestaCorrecta) {
      localStorage.setItem(`parada_${id}`, "ok");
      window.location.href = `correcta.html?id=${id}`;
    } else {
      mensaje.textContent = "Respuesta incorrecta. Inténtalo otra vez.";
      mensaje.className = "mensaje error";
    }
  }

  boton.addEventListener("click", verificarRespuesta);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      verificarRespuesta();
    }
  });
});