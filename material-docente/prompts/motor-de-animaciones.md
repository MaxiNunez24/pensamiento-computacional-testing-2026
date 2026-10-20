Quiero que armemos un **motor de animaciones propio**, en este repo (`D:/Dev/motor-animaciones`), que
sea **versátil**: que sirva para cualquier animación web, y que además tenga un **modo pedagógico**
para explicar conceptos. Antes de escribir código, investigá y proponeme un plan con 2 o 3
alternativas; no construyas nada hasta que te dé el OK.

## Contexto

Soy el profe de "Pensamiento Computacional y Testing de Aplicaciones" en el CFP 401 de Ensenada.
Alumnos adultos, la mayoría sin experiencia previa, que usan las compus del CFP (Windows al 125%,
equipos modestos) y el celular.

El primer proyecto que va a usar el motor es **la plataforma del curso**, que está en
`D:/Dev/pensamiento-computacional-testing-2026` (leela para entender dónde va a vivir, pero **no la
modifiques desde acá**). Es Astro 6 + Starlight, publicada en GitHub Pages. Mirá en especial:

- `src/components/` y `src/scripts/`: los componentes interactivos que ya hay (`EjercicioPython`,
  con Python en el navegador vía Pyodide; `EjercicioWeb`; `MapaProyecto`; `OpcionMultiple`).
- `src/content/docs/proyecto.mdx` y `casos.mdx`: el sistema que hay que animar para la Expo.
- `src/content/docs/preparando-expo/`: la Expo, y la clase de la moneda, que ya usa animaciones de
  CSS (`@keyframes`, `rotateY`, `animationend`).
- `guiones/`: los guiones de los videos de las clases.

El motor no tiene que saber nada del curso: el curso es **un usuario más**. También lo quiero poder
usar en páginas sueltas (HTML plano, como las que hacen los alumnos) y en otros proyectos.

## Para qué es

1. **Animaciones en general**: escenas, transiciones, presentaciones, piezas para una página.
2. **Modo pedagógico**, como una capa encima del núcleo (no mezclado con él):
    - **paso a paso**: reproducir, pausar, avanzar, retroceder, cambiar la velocidad, saltar a un
      momento;
    - **pausas para pensar**: que la animación frene y pregunte "¿qué creés que pasa ahora?" antes de
      mostrarlo (aprender haciendo, no mirando);
    - **sincronizada con código**: resaltar la línea que corre mientras se ve el estado (variables
      como cajas, listas, el recorrido de un bucle, llamadas a funciones, diccionarios, objetos,
      excepciones, una consulta a una base, eventos de JavaScript);
    - más adelante, **generarse sola a partir de una traza real** de un programa (en la plataforma ya
      corre Python con Pyodide, que permite `sys.settrace`).
3. **Videos automáticos**: renderizar una escena a MP4 (1080p) sin intervención, con subtítulos y, si
   se puede, narración, para subir a YouTube.

**El primer uso real tiene fecha**: la Expo CFP del **viernes 13/11/2026**. Ahí quiero mostrar una
animación de **"El Sistema de Gestión de Alumnos: cómo se va a ver"**: del problema de hoy (la
asistencia en papel, pasada a planillas que se duplican a mano) a cómo va a funcionar (el alumno
avisa que llegó, el docente pasa lista desde el celular, los datos quedan en una base, la planilla
oficial sale sola). Los datos salen de `proyecto.mdx` y `casos.mdx` del curso. **El bot del SiGeS NO
va**: es interno. Se va a ver en loop en una pantalla grande y en el celular. La necesito para el
ensayo del 11/11 (ideal, el 6/11), así que el plan tiene que llegar a eso primero.

## Requisitos

- **Determinista y "saltable"**: el estado en el instante t depende solo de t. Nada de azar sin
  semilla ni cadenas de `setTimeout`. Así la misma escena se ve igual en vivo, paso a paso, y en el
  render a video.
- **Escenas declarativas** y fáciles de escribir, con piezas reutilizables (cajas, flechas, texto,
  tablas, la pantalla de un celular, código con resaltado...) y la posibilidad de crear piezas nuevas.
- **Fácil de usar desde otro proyecto**: decime cómo lo consumiría el curso (paquete npm, dependencia
  desde Git, un archivo `.js` para incluir, un web component...) y cómo se usaría desde una página
  HTML sin herramientas.
- **Liviano**. Compará hacerlo propio (WAAPI / requestAnimationFrame, SVG o DOM) contra librerías
  (GSAP, Motion, Theatre.js; Remotion para video), con licencias, peso y si cubren los tres usos. Si
  recomendás una dependencia, que sea con razones.
- **Accesible**: respetar `prefers-reduced-motion`, subtítulos o texto alternativo, modo claro y
  oscuro (con colores configurables, para adaptarse a cada sitio), y que se vea bien en un celular de
  360px.
- **Con tests**: es un curso de testing, así que el motor tiene que tener los suyos (por ejemplo, que
  el estado en un instante dado sea el esperado).
- **Convenciones**: castellano rioplatense con voseo en todo lo que se ve y en los comentarios;
  sangría de 4 espacios en todo el código; comentarios que explican el porqué.

## Cómo trabajamos

1. Leé la plataforma del curso para entender el contexto, investigá las alternativas, y proponeme
   el plan: la que recomendás y por qué, la arquitectura (núcleo, capa pedagógica, render a video), y
   fases con entregables. Por ejemplo: (1) el núcleo, una escena de prueba y los controles; (2) la
   escena de la Expo; (3) la capa pedagógica y 2 o 3 animaciones de conceptos; (4) el render a video.
2. Esperá mi OK.
3. Cada fase, verificala en el navegador y mostrame capturas, un GIF o un video corto antes de seguir.
