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
| Flask (diciembre) | Sí: `desdePedidoHttp` (v0.12.0) | Nada: armar la lección |
| Videos de repaso | Sí: `npm run video` | Probarlo con una lección del curso |

## 3. Arreglos y pedidos (para la sesión del motor)

**Hechos en la v0.12.0 (29/10)** y ya usados en el curso: la lupa de quien mira, el alto
automático (`alto: 'auto'`), la línea grande nativa (`lineaGrande: true`), el cartel del error
adentro del cuadro y a su medida, `desdePedidoHttp` para Flask, y el CHANGELOG con tags. El curso
borró su propia franja (`linea-grande.ts`).

**Pendientes:**

1. **Subtítulos que esquivan, también en franjas parciales.** En pantalla completa suben a la
   primera franja libre a todo lo ancho. En el último paso de una traza (el código, la consola y el
   cartel del error ocupan la columna izquierda) no hay ninguna, aunque la columna derecha queda
   vacía: el subtítulo se queda abajo, encima de la línea grande. Pasa en "¿return o print?" y en
   "¿Quién llama a quién?" (1 de 12 y 1 de 30 subtítulos: el del final). Idea: buscar lugar también
   en una columna libre, o achicar el ancho del subtítulo hasta que entre.
2. **Que la lupa de quien mira arranque sobre algo.** Arranca en el centro de la escena, que en una
   traza cae justo en el hueco entre el código y la pila: al prenderla parece vacía, y parece rota.
   Mejor sobre la línea marcada, o sobre la pieza que acaba de cambiar.
3. **Que la consola parta las líneas largas.** Hoy se salen del cuadro (una etiqueta de HTML ocupa
   unos 70 caracteres). El curso las parte a 44 antes de pasarle la traza (`partirSalida` en
   `ver-como-corre.ts`); cuando lo haga el motor, se borra.

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
| Hasta el 13/11 | /expo/ y la lección de Funciones 1 (hechas) | Hecho en la v0.12.0 |
| Noviembre | Lecciones de Bucles, Listas, Diccionarios, POO y Excepciones; SQLite y Testing con lo que hay | Subtítulos en franjas parciales y la lupa que arranca sobre algo (3.1 y 3.2) |
| Diciembre | Flask con `desdePedidoHttp` (ya está en el motor); videos de repaso | — |
| Enero y febrero | Armar los dos trayectos | Trazador de JS (4.1), DOM y CSS (4.2 y 4.3), y la capa de IA: tokens, próximo token, embeddings y tu propio modelo (5.1, 5.2, 5.3 y 5.6) |
| Marzo en adelante | Los trayectos, clase a clase | Attention, redes, difusión y MCP (5.4, 5.5, 5.7 y 5.8), eventos y Git (4.5 y 4.6), a medida que lleguen las clases |
