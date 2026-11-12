# Tu juego con IA para la Expo

Cada estudiante arma un juego chiquito conversando con Claude (claude.ai, con su cuenta). Todos los
juegos van a una PC del stand con un menú, para que la gente los juegue con el teclado o el mouse.

## Pasos

1. Entrá a claude.ai con tu cuenta y abrí una conversación nueva.
2. Copiá el prompt de abajo **entero**, pegalo y mandalo. **No hace falta cambiar nada:** la IA te
   pregunta tu nombre o apodo y te ayuda a encontrar tu idea, de a una pregunta. (Si ya la tenés,
   podés escribirla en los dos primeros renglones.)
3. Contestale con tus palabras. Cuando te resuma el juego y te guste, decile "dale".
4. Guardá el código que te da en un archivo con el nombre del juego, sin espacios ni tildes y
   terminado en `.html` (por ejemplo `carrera-de-caracoles.html`). Abrilo con doble clic para jugarlo.
5. Si algo no anda o querés cambiar algo, decíselo en la misma conversación: "cuando choco no pasa
   nada", "que sea más lento al principio". Probalo después de cada cambio.
6. Cuando te guste, leé la explicación que te da al final: en la Expo te van a preguntar cómo
   funciona.
7. Mandale el archivo `.html` al profe.

## El prompt

```text
MI NOMBRE O APODO:
MI IDEA:

Soy estudiante de un curso de programación y quiero hacer, con tu ayuda, un juego para la Expo de
mi escuela. Se va a jugar en una computadora del stand, sin internet.

ANTES DE ESCRIBIR CÓDIGO, conversá conmigo así:
- Preguntame de a UNA cosa por mensaje, con mensajes cortos y palabras simples.
- Si arriba no completé MI NOMBRE O APODO, eso es lo primero que me preguntás. Va a aparecer en el
  menú, debajo del juego (puede ser un apodo).
- Si no completé MI IDEA, o te digo que no sé qué hacer, NO me des ideas ya armadas: ayudame a
  encontrar la mía con preguntas, de a una. Por ejemplo: qué juegos me gustan o me gustaban de
  chico; si prefiero algo de reflejos, de puntería, de memoria, de carreras, de preguntas o de
  ordenar cosas; quién o qué me imagino como protagonista; en qué lugar pasa; si se juega mejor
  con el teclado o con el mouse. Con lo que te conteste, proponeme 2 o 3 versiones de MI idea
  para que elija una.
- Cuando tengamos la idea, resumímela en 3 renglones (de qué se trata, cómo se juega y cómo se
  suman puntos) y esperá a que te diga "dale" para escribir el código.

EL JUEGO TIENE QUE CUMPLIR TODO ESTO:
1. Un solo archivo HTML con todo adentro (HTML, CSS y JavaScript). Sin librerías, sin fuentes,
   sin imágenes ni sonidos de internet: la computadora no tiene conexión. Los dibujos hacelos
   con canvas, formas o emojis.
2. Se juega con el teclado (flechas, WASD, Espacio, Enter) o con el mouse (apuntar, hacer clic,
   moverlo para esquivar), lo que mejor le quede al juego. Si es de 2 jugadores, en el mismo
   teclado: uno con WASD y el otro con las flechas.
3. NO uses la tecla Escape para nada: está reservada para volver al menú de juegos.
4. LOS CONTROLES SIEMPRE A LA VISTA. En la pantalla de inicio: el título, los controles explicados
   y "Enter o clic para jugar". Y durante TODA la partida, un recuadro en una esquina que diga con
   qué se juega (por ejemplo "⬅️ ➡️ moverse · Espacio saltar" o "🖱️ apuntá y hacé clic").
5. Un puntaje que se vea siempre arriba mientras se juega. Partidas cortas, de 1 a 3 minutos:
   hay gente esperando.
6. RÉCORDS: al terminar, si el puntaje entra entre los 5 mejores, pedí un apodo escribiéndolo con
   el teclado ahí mismo en la pantalla (hasta 10 letras, Enter para guardar). Después mostrá la
   tabla de los 5 mejores y "Enter o clic para jugar de nuevo". Guardalos en localStorage con la
   clave "expo-records:" + el título del juego, como una lista JSON de mayor a menor:
   [{"apodo": "ANA", "puntos": 120}]. Así el menú del stand sabe quién va ganando.
7. Que ocupe toda la ventana, que se adapte si cambia el tamaño y que se lea bien desde un metro
   de distancia (letras grandes).
8. Apto para todo público: nada de sangre, violencia fuerte ni palabras feas.
9. Si tiene sonido, que sea con la Web Audio API, bajito, y que la tecla M lo silencie.
10. No uses alert, confirm, prompt ni ventanas emergentes, y no abras otras páginas.
11. Todo el texto en español.
12. En el <head> poné:
    <title>NOMBRE DEL JUEGO</title>
    <meta name="description" content="Una frase que invite a jugarlo">
    <meta name="autor" content="MI NOMBRE O APODO">
    <meta name="premio" content="...">
    En "premio" va una descripción EN INGLÉS para que una IA de imágenes dibuje a quien gane
    ADENTRO de este juego, con {quien} en el lugar de la persona. Por ejemplo, para un juego de
    esquivar hojas: "{quien} as a snail racer dodging falling autumn leaves in a colorful garden,
    video game art, bright colors, no text". Sin texto, sin marcas, apto para todo público.
13. Dame el código completo en un solo bloque, listo para guardar como .html.

Después del código, explicame en no más de 8 renglones cómo funciona: dónde está el bucle del
juego, cómo se detectan los choques o los puntos, y qué parte cambiaría para hacerlo más difícil.
```

## Para el profe

- Juntá los `.html` en la carpeta `juegos/` de esta misma carpeta y corré `python armar_menu.py`:
  arma `menu/` con el menú y una copia de cada juego a la que le suma la vuelta al menú (Escape dos
  veces, o solo después de 3 minutos sin tocar nada). También avisa si algún juego usa internet.
- Pasá la carpeta `menu/` entera a la PC del stand (con un pendrive alcanza) y abrí
  `abrir-juegos.bat`: abre el menú en modo kiosco (pantalla completa, sin barras). Para salir del
  kiosco: Alt+F4.
- Probá todos los juegos antes de la Expo: que arranquen con Enter o clic, que muestren los controles
  durante la partida, que guarden los récords y que vuelvan al menú.
- En `<meta name="autor">` cada uno decide si pone su nombre o un apodo. La carpeta `juegos/` no se
  sube al repo (está en el `.gitignore` de esta carpeta).

## Récords y premios

- Cada juego guarda sus 5 mejores puntajes (clave `expo-records:` + su título). El menú muestra al
  primero de cada juego debajo de la tarjeta.
- **Cortes de premios** (anunciados en el cartel de la PC de juegos, cada hora y media más o menos):
  en el menú, `Ctrl` + `Alt` + `P` abre la pantalla de **Premios** con el primero y el segundo de
  cada juego. Quien va primero pasa por el estudio de fotos (si no está, el segundo).
- En el estudio, los estilos 🎮 están **escondidos**: son el premio. `Ctrl` + `Alt` + `P` en el
  operador del estudio los desbloquea para UNA foto (se vuelven a esconder al aprobarla, a los 5
  minutos o con el mismo atajo) y se elige **🎮 Nombre del juego**. `armar_menu.py` lo saca del
  `<meta name="premio">` de cada juego y lo copia a `D:\Programas\ia-fotos\estudio\estilos-juegos.json`
  (reiniciá el estudio después de armar el menú). **No hace falta conectar la PC de juegos a nada**:
  los estilos viajan antes de la Expo y los ganadores se leen en la pantalla de Premios.
- Entregados los premios, en el menú apretá `Ctrl` + `Alt` + `N` y confirmá con `Y` (`N` o `Esc`
  cancela): anota a los ganadores en "Ganadores anteriores" y los récords arrancan de cero para el
  período siguiente. No usa letras sueltas, así no choca con los controles de ningún juego.
- Si hay mucha luz y no se ve: `Ctrl` + `Alt` + `O` pasa el menú a modo claro (y vuelve). Es el mismo
  atajo en todas las pantallas del stand (Bingo, proyector, estudio, plano).
- Los récords quedan en el perfil del kiosco (`%TEMP%\expo-juegos`): no se borran al cerrar Chrome,
  pero sí si se limpia esa carpeta.
