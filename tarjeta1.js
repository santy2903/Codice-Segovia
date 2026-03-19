document.addEventListener("DOMContentLoaded", function() {
  // Respuesta correcta (puedes modificar este número)
  const RESPUESTA_CORRECTA = 4;

  // Referencias a los elementos HTML
  const input = document.getElementById("numero");
  const boton = document.getElementById("verificar-btn");
  const mensaje = document.getElementById("mensaje-resultado");

  // Función para verificar la respuesta
  function verificarRespuesta() {
    const valor = input.value.trim();

    // Si no hay respuesta
    if (valor === "") {
      mensaje.textContent = "Escribe una respuesta.";
      mensaje.style.color = "orange";
      return;
    }

    // Verificar si la respuesta es correcta
    if (Number(valor) === RESPUESTA_CORRECTA) {
      mensaje.textContent = "¡Correcto!";
      mensaje.style.color = "limegreen"; // Verde si es correcto

      // Redirigir a otra página (mapa.html) después de 1 segundo
      setTimeout(() => {
        window.location.href = "correcto.html"; // Aquí se redirige a la página deseada
      }, 1000);  // 1000 ms = 1 segundo
    } else {
      mensaje.textContent = "¡Incorrecto!";
      mensaje.style.color = "red"; // Rojo si es incorrecto
    }
  }

  // Asignar evento al botón "Verificar"
  boton.addEventListener("click", verificarRespuesta);

  // Permitir verificar con la tecla Enter
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      verificarRespuesta();
    }
  });
});