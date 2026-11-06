# Tu juego con IA para la Expo

Cada estudiante arma un juego chiquito conversando con Claude (claude.ai, con su cuenta). Todos los
juegos van a una PC del stand con un menú, para que la gente los juegue con el teclado.

## Pasos

1. Entrá a claude.ai con tu cuenta y abrí una conversación nueva.
2. Copiá el prompt de abajo **entero**, cambiá la parte de **MI IDEA** y mandalo.
3. Guardá el código que te da en un archivo con el nombre del juego, sin espacios ni tildes y
   terminado en `.html` (por ejemplo `carrera-de-caracoles.html`). Abrilo con doble clic para jugarlo.
4. Si algo no anda o querés cambiar algo, decíselo en la misma conversación: "cuando choco no pasa
   nada", "que sea más lento al principio", "agregá un récord". Probalo después de cada cambio.
5. Cuando te guste, pedile la explicación (el último punto del prompt) y leela: en la Expo te van
   a preguntar cómo funciona.
6. Mandale el archivo `.html` al profe.

## El prompt

```text
Soy estudiante de un curso de programación y quiero hacer un juego para mostrar en la Expo de mi
escuela. Se va a jugar en una computadora del stand, sin internet, con el teclado.

MI IDEA: [contá acá tu juego: de qué se trata, qué hace el jugador, cómo se gana o se pierde.
Por ejemplo: "un caracol que esquiva hojas que caen; cada hoja esquivada suma un punto y la
velocidad va subiendo"]

Hacelo cumpliendo TODO esto:

1. Un solo archivo HTML con todo adentro (HTML, CSS y JavaScript). Sin librerías, sin fuentes,
   sin imágenes ni sonidos de internet: la computadora no tiene conexión. Los dibujos hacelos
   con canvas, formas o emojis.
2. Se juega SOLO con el teclado: flechas, WASD, Espacio y Enter. Si es de 2 jugadores, uno usa
   WASD y el otro las flechas, en el mismo teclado.
3. NO uses la tecla Escape para nada: está reservada para volver al menú de juegos.
4. Pantalla de inicio con el título, los controles explicados y "Enter para jugar".
   Al terminar, mostrá el puntaje y "Enter para jugar de nuevo".
5. Partidas cortas, de 1 a 3 minutos: hay gente esperando para jugar.
6. Que ocupe toda la ventana, que se adapte si cambia el tamaño y que se lea bien desde un metro
   de distancia (letras grandes).
7. Apto para todo público: nada de sangre, violencia fuerte ni palabras feas.
8. Si tiene sonido, que sea con la Web Audio API, bajito, y que la tecla M lo silencie.
9. No uses alert, confirm, prompt ni ventanas emergentes, y no abras otras páginas.
10. Todo el texto en español.
11. En el <head> poné:
    <title>NOMBRE DEL JUEGO</title>
    <meta name="description" content="Una frase que invite a jugarlo">
    <meta name="autor" content="TU NOMBRE O UN APODO">
12. Dame el código completo en un solo bloque, listo para guardar como .html.

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
- Probá todos los juegos antes de la Expo: que arranquen con Enter, que no usen el mouse y que
  vuelvan al menú.
- En `<meta name="autor">` cada uno decide si pone su nombre o un apodo. La carpeta `juegos/` no se
  sube al repo (está en el `.gitignore` de esta carpeta).
