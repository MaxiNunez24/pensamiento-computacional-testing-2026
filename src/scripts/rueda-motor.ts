// Ctrl + rueda (y el pellizco del touchpad, que llega igual) agranda la
// escena del motor de animaciones. En pantalla completa está bien; en la
// página, molesta: el alumno quiere agrandar la PÁGINA con Ctrl + rueda (es
// como lee quien ve poco), pasa por encima de una animación, y se le agranda
// la animación en vez de la página.
//
// Así que fuera de pantalla completa el evento no llega al motor y el
// navegador hace su zoom de siempre. Para agrandar solo la animación quedan
// los botones + y − de la escena (y las teclas + - 0).
//
// Se ataja en la fase de captura del documento: un evento que pasa adentro de
// la escena (en su shadow DOM) llega acá con la escena como target, antes que
// al motor.

const MARCA = '__ruedaMotor';
const global = window as unknown as Record<string, boolean>;

if (!global[MARCA]) {
  global[MARCA] = true;
  document.addEventListener(
    'wheel',
    (e) => {
      const escena = e.target;
      if (!(escena instanceof HTMLElement) || !escena.tagName.startsWith('MOTOR-')) return;
      if (document.fullscreenElement === escena) return;
      if (e.ctrlKey || e.metaKey) e.stopPropagation();
    },
    { capture: true, passive: true },
  );
}
