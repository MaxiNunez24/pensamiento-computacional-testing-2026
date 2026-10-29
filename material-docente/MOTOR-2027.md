# El motor de animaciones: dónde está y adónde va

Estado al 29/10/2026, con el motor en **v0.11.0**. Sirve para decidir qué pedirle a la sesión del
motor (repo aparte, `D:/Dev/motor-animaciones`) en lo que queda de 2026 y para los trayectos de
**2027**:
- **Usuaria/o de IA generativa**, en el lugar de los módulos de Pensamiento Computacional.
- **Programador Web**, en el lugar de Testing.

---

## 1. Lo que el motor ya tiene

| Capa | Qué trae | ¿Lo usa el curso? |
|---|---|---|
| Núcleo | Escenas por línea de tiempo, curvas (también resorte y rebote), azar con semilla, `<motor-escena>` con controles, zoom, pantalla completa | Sí |
| Piezas | caja, texto, flecha, tabla, celular, cámara, espejo, fila, grafo, forma, contador, cilindro | Sí: el espejo es la franja de la línea grande |
| Pedagógica | `<motor-leccion>` con preguntas y paso a paso; `desdeTraza` (variables, pila, consola, errores, lupa); trazador de Python (el mismo en Pyodide y en la consola); `desdeConsulta` (SQL); `desdeTests` | Sí: "¿Quién llama a quién?" y "👣 Ver correr" en los 217 ejercicios |
| Matemática, estadística y regresión | Plano, gráficas, derivadas, intervalos, tests de hipótesis | No (es de otras materias) |
| Redes | Subredes, intercambio de paquetes | No, por ahora |
| Finanzas | Bolsa, opciones, Black-Scholes | No |
| 3D | Esfera, globo, superficies | No |
| Estilos | sobrio (sin sonidos: el del curso), pizarra, neón, papel, reel; efectos y sonidos | No: para la Expo y los videos |
| Video y voz | `npm run video` con voz (Piper), subtítulos de reel, GIF | Todavía no |
| Editor | Un editor de escenas en el navegador | No |

**En resumen:** para la programación en Python el motor está completo, y le sobra para mucho más.
Lo que falta es lo de **la web** (JS, DOM, CSS, HTTP) y lo de **IA**, que es justo lo de 2027.

## 2. Lo que el curso de 2026 necesita todavía (hasta el 18/12)

| Para | ¿Está en el motor? | Qué falta |
|---|---|---|
| Página /expo/ (13/11) | Sí: la escena `expo-siges`, el modo pantalla y el estilo neón | Nada: armarla en el curso |
| Lecciones por clase (Funciones, Bucles, Listas, Diccionarios, POO, Excepciones) | Sí: `desdeTraza` | Nada: escribirlas en el curso |
| SQLite | Sí: `desdeConsulta` | Nada |
| Testing | Sí: `desdeTests` | Nada |
| **Flask (diciembre)** | **No** | Una escena de **pedido y respuesta HTTP** (ver 4.4): sirve ahora para Flask y en 2027 para la web |
| Videos de repaso | Sí: `npm run video` | Probarlo con una lección del curso |

## 3. Arreglos y pedidos pendientes (para la sesión del motor)

1. **La lupa de quien mira se ve vacía en `desdeTraza` (v0.11.0).** No muestra ningún texto del
   código, ni siquiera los números de línea; sí el fondo y la marca de la línea. En una escena con
   cajas sí anda, y un `espejo` sobre la misma pieza `codigo` muestra el texto bien. En el curso
   está apagada con `sin-lupa` hasta que se arregle.
2. **Que el alto de la escena se ajuste al contenido.** `desdeTraza` mide siempre 900 de alto:
   con un programa corto queda medio cuadro vacío. El curso lo resuelve afuera, midiendo hasta dónde
   llega cada pieza (`hastaDondeLlega` en `src/scripts/linea-grande.ts`). Estaría mejor adentro del
   motor.
3. **La franja de la línea grande, nativa.** El curso la arma afuera (`conLineaGrande`): un espejo
   rectangular que sigue a la línea que corre, lo más grande que entre, con el código entero
   arriba. Podría ser una opción de `desdeTraza` (`lineaGrande: true`), para que la usen también la
   landing y los videos.
4. **El cartel de un error, adentro del cuadro y a su medida.** En `desdeTraza` va debajo de la
   consola y puede caer más abajo de los 900: se recortaba y el error no se veía (el curso agranda
   la escena para mostrarlo). Además mide siempre 96 de alto, y un mensaje largo
   (`TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'`) se sale por abajo.
5. **Un CHANGELOG** y la regla de que cada versión publicada lleve su tag. El curso se fija por tag
   y cada actualización se revisa a mano.

## 4. Para 2027: Programador Web

El curso de web de este año ya tiene "Ver correr" para Python, pero **no para JavaScript**, y es lo
que más se va a necesitar.

| # | Qué | Para qué |
|---|---|---|
| 4.1 | **Trazador de JavaScript**: el mismo formato de traza que el de Python (líneas, variables, pila, consola, errores). Por ejemplo, instrumentando el código con un parser (acorn) o con un intérprete de JS en un worker | "Ver correr" en los ejercicios de JS, igual que en Python |
| 4.2 | **`desdeDOM`**: el HTML, el árbol de elementos y la página, los tres juntos; `querySelector` resalta el nodo que encuentra | Que se entienda qué es "la página" para JS |
| 4.3 | **Caja, flex y grid**: el modelo de caja (contenido, padding, borde, margin) y cómo se acomodan los elementos al cambiar una propiedad | La parte de CSS que más cuesta |
| 4.4 | **`desdeHTTP`**: navegador, pedido (método, URL, cuerpo), servidor, respuesta (código, JSON) | Flask en diciembre; fetch y APIs en 2027 |
| 4.5 | **Eventos y asincronía**: un clic que sube por los elementos; el event loop con `setTimeout`, `fetch` y `await` | Lo que menos se ve y más rompe |
| 4.6 | **Git**: commits y ramas como un grafo (la pieza `grafo` ya existe) | El flujo de trabajo de un programador |

## 5. Para 2027: Usuaria/o de IA generativa

Mucho se apoya en lo que ya hay: plano, grafo, azar con semilla y derivadas.

| # | Qué | Para qué |
|---|---|---|
| 5.1 | **Tokens**: un texto partido en tokens, con colores y números; cuántos son y cuánto cuestan | La unidad con la que piensa un modelo |
| 5.2 | **El próximo token**: barras con la probabilidad de cada palabra; la temperatura y el top-p cambian cuál sale | Por qué la misma pregunta da respuestas distintas |
| 5.3 | **Embeddings**: palabras como puntos en un plano; las parecidas quedan cerca | Qué quiere decir que un modelo "entiende" |
| 5.4 | **Attention**: qué palabras mira cada palabra (una matriz con intensidades y flechas) | El corazón de los transformers |
| 5.5 | **Una red neuronal chica**: los datos pasan por las capas y el entrenamiento ajusta los pesos (descenso por gradiente) | Qué es "entrenar" |
| 5.6 | **Tu propio modelo**: un modelo de bigramas que se entrena en el navegador con un texto que elige la persona, y después escribe; la tabla de conteos se ve llenarse | "Crear un modelo de IA propio", y es para la Expo |
| 5.7 | **Difusión**: una imagen que sale del ruido, de a pasos | Los modelos de imágenes |
| 5.8 | **Herramientas y MCP**: el modelo pide una herramienta, la herramienta responde y el modelo sigue (también RAG) | Cómo trabajan Claude, ChatGPT y Gemini con otras cosas |

## 6. Para la Expo: promocionar 2027 (más adelante)

Ideas para iterar después: la UI de los tótems, la continuación de los catálogos, landing pages
personalizadas, "tu propio modelo" (5.6) en vivo, los tipos de modelos, cómo se usan Claude,
ChatGPT, Gemini y JEV, y MCP y Attention explicados con el motor (5.4 y 5.8) en la pantalla
grande, con el estilo neón.

## 7. Plan propuesto

| Cuándo | En el curso | En el motor |
|---|---|---|
| Hasta el 13/11 | /expo/ y la lección de Funciones 1 | Arreglar la lupa (3.1) |
| Noviembre | Lecciones de Bucles, Listas, Diccionarios, POO y Excepciones; SQLite y Testing con lo que hay | Alto automático y línea grande nativa (3.2 y 3.3) |
| Diciembre | Flask con la escena HTTP; videos de repaso | `desdeHTTP` (4.4) |
| Enero y febrero | Armar los dos trayectos | Trazador de JS (4.1), DOM y CSS (4.2 y 4.3), y la capa de IA: tokens, próximo token, embeddings y tu propio modelo (5.1, 5.2, 5.3 y 5.6) |
| Marzo en adelante | Los trayectos, clase a clase | Attention, redes, difusión y MCP (5.4, 5.5, 5.7 y 5.8), eventos y Git (4.5 y 4.6), a medida que lleguen las clases |
