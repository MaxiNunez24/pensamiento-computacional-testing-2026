Quiero que armemos un **motor de animaciones propio** para la plataforma del curso. Antes de escribir
código, leé el repo y proponeme un plan con 2 o 3 alternativas; no construyas nada hasta que te dé
el OK.

## Contexto

Soy el profe de "Pensamiento Computacional y Testing de Aplicaciones" en el CFP 401 de Ensenada.
Alumnos adultos, la mayoría sin experiencia previa, que usan las compus del CFP (Windows al 125%,
equipos modestos) y el celular. La plataforma es este repo: Astro 6 + Starlight (en `src/`,
publicada bajo `/ejercicios/`) conviviendo con MkDocs (`docs/`), y se despliega a GitHub Pages
desde `main`. Tenés memorias del proyecto cargadas: respetalas.

Ya hay componentes interactivos propios que conviene mirar antes de diseñar nada:
`EjercicioPython` (Python en el navegador con Pyodide), `EjercicioWeb` (HTML/CSS/JS con vista en un
iframe), `MapaProyecto` (el mapa del sistema en `src/content/docs/proyecto.mdx`), `OpcionMultiple`.
Y la clase `src/content/docs/preparando-expo/moneda.mdx` ya usa animaciones de CSS (`@keyframes`,
`rotateY`, `animationend`).

## Para qué es (en orden de prioridad)

1. **La Expo CFP del viernes 13/11** (fecha fija). Una animación de **"El Sistema de Gestión de
   Alumnos: cómo se va a ver"**: del problema de hoy (la asistencia en papel, pasada a planillas que
   se duplican a mano) a cómo va a funcionar (el alumno avisa que llegó, el docente pasa lista desde
   el celular, los datos quedan en una base, la planilla oficial sale sola). La fuente es
   `src/content/docs/proyecto.mdx` (las piezas, quién usa cada una y las etapas), `casos.mdx`, y el
   material del proyecto de asistencias. **El bot del SiGeS NO va**: es interno. Se va a ver en
   loop en una pantalla grande, y también en el celular. Tiene que estar lista para el ensayo del
   11/11 (ideal, el 6/11).
2. **Animaciones didácticas en las clases**: un componente para MDX, como los ejercicios, para
   conceptos que cuestan: variables como cajas, listas, el recorrido de un bucle, llamadas a
   funciones, diccionarios, objetos, excepciones, una consulta a SQLite, eventos de JavaScript.
   **Paso a paso** (reproducir, pausar, avanzar, retroceder, velocidad), y sincronizadas con el
   código, resaltando la línea que corre. Más adelante, que se puedan generar solas a partir de una
   traza real del programa del alumno (Pyodide ya está en la plataforma).
3. **Videos automáticos**: que la misma escena se pueda renderizar a MP4 (1080p) sin intervención,
   con subtítulos y, si se puede, narración, para subir a YouTube. Los guiones de video viven en
   `guiones/`.

## Requisitos

- **Determinista y "saltable"**: el estado en el instante t tiene que depender solo de t. Nada de
  azar sin semilla ni cadenas de `setTimeout`. Así la misma escena se ve igual en vivo, paso a paso,
  y en el render a video.
- **Escenas declarativas** y fáciles de escribir, con piezas reutilizables (cajas, flechas, filas
  de una tabla, una pantalla de celular, código con resaltado...).
- **Liviano**. Compará hacerlo propio (WAAPI / requestAnimationFrame, SVG o DOM) contra librerías
  (GSAP, Motion, Theatre.js; Remotion para video), con licencias, peso y si sirven para los tres
  usos. Si recomendás una dependencia, que sea con razones.
- **Accesible**: respetar `prefers-reduced-motion`, subtítulos o texto alternativo, modo claro y
  oscuro con los colores de Starlight, y que se vea bien en un celular de 360px.
- **Integración**: un componente `<Animacion>` para usar en MDX, y la página de la Expo, que va en
  `src/pages/expo/` con diseño propio (todavía no existe; `/expo/` está libre a propósito).
- **Convenciones del repo**: castellano rioplatense con voseo en todo lo que se ve; sangría de 4
  espacios en todo el código; comentarios que explican el porqué; nunca nombres de alumnos (el repo
  es público).

## Cómo trabajamos

1. Leé el repo (`astro.config.mjs`, `src/components/`, `src/scripts/`, `proyecto.mdx`,
   `preparando-expo/`) y proponeme el plan: alternativas, la que recomendás y por qué, y fases con
   entregables. Algo así: (1) el núcleo, una escena de prueba y los controles; (2) la escena de la
   Expo; (3) el componente MDX y 2 o 3 animaciones en clases que ya existen; (4) el render a video.
2. Esperá mi OK.
3. Cada fase, verificala en el navegador (preview y Playwright) y mostrame capturas, un GIF o un
   video corto antes de seguir.
