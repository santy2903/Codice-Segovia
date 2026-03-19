function obtenerIdDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

document.addEventListener("DOMContentLoaded", () => {
  const id = obtenerIdDesdeURL();
  const parada = PARADAS.find(p => p.id === id);

  if (parada) {
    document.getElementById("textoCorrecta").textContent =
      `Habeis superado la parada: ${parada.titulo}`;
  }

  setTimeout(() => {
    window.location.href = "mapa.html";
  }, 1800);
});