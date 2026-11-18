# Plan de cierre 2026 y lo que viene en 2027

Decidido el 17/11/2026, después de la Expo. Reemplaza lo que quedaba de `PLAN-CLASES-RESTANTES.md`.

## La decisión

**Terminar el sistema de asistencias**, que es lo que se les prometió a los alumnos. El proyecto
final con IA queda afuera.

Antes de la Expo, del 28/10 al 13/11, todo fue preparación del stand. Así quedaron los temas:

| Tema | Cómo quedó |
|---|---|
| Excepciones | Terminada |
| POO II | De tarea |
| Bot del SiGeS | De tarea |

## Las 10 clases

| Fecha | Clase | Estado |
|---|---|---|
| Mié 18/11 | **De vuelta al sistema**: el plan, un repaso con práctica (Alumno, Curso, cargar con excepciones), del objeto al HTML, y el primer vistazo a Flask en la compu | ✅ escrita (`clases/de-vuelta-al-sistema`) |
| Vie 20/11 | SQLite: los datos en una base. El feriado se corre al lunes 23; **confirmar** que hay clase | ✅ escrita |
| Mié 25/11 | Taller: el sistema por consola | ✅ escrita |
| Vie 27/11 | Flask I: rutas y plantillas | ✍️ a escribir |
| Mié 2/12 | Flask II: formularios | ✍️ |
| Vie 4/12 | Taller: migrar el sistema a Flask | ✍️ |
| Mié 9/12 | El sistema en la red del CFP: un servidor y los tótems como clientes | ✍️ |
| Vie 11/12 | Login: contraseñas y sesiones | ✍️ |
| Mié 16/12 | Testing I, más el glosario "Todo lo que probaste" | ✅ escrita + ✍️ |
| **Vie 18/12** | **Cierre:** el sistema andando en el CFP | — |

- **Si se atrasa algo:** Login pasa a optativa. Los tótems funcionan sin login, y así el sistema en
  la red llega al cierre.
- **"Lo que Python hace por vos"** pasa a optativa: el sistema no la necesita.

**Sobre Flask I:** la clase del 18/11 ya muestra `@app.route`, devolver HTML desde una función y la
ruta con un dato (`/alumno/<dni>`). Flask I puede arrancar desde ahí y sumar las plantillas
(Jinja), sin repetir el "hola mundo".

## Optativas: "Para seguir después del curso"

Una sección nueva del camino, aparte de "Para ir más allá". Hay dos tipos de optativa:

- 🌐 **En la plataforma:** Pyodide trae el paquete, así que se puede hacer con tests que corrigen solos.
- 💻 **En tu compu:** una guía paso a paso, sin corrección automática.

| Optativa | Dónde |
|---|---|
| pip y entornos virtuales (la puerta de entrada a las demás) | 💻 |
| NumPy: cuentas con muchos números a la vez | 🌐 |
| Pandas: las asistencias en una tabla, filtrar y contar | 🌐 |
| Gráficos con matplotlib | 🌐 |
| Streamlit: un tablero de asistencias en unas 30 líneas | 💻 |
| Tkinter: una ventana de escritorio con botones | 💻 |
| requests: pedirle datos a una API (clima, dólar) | 💻 |
| Playwright: automatizar el navegador, como el bot | 💻 |
| Pygame: juegos | 💻 |
| PyInstaller: convertir el programa en un .exe | 💻 |
| IA desde Python: llamar a un modelo (puente a 2027) | 💻 |
| Regex: buscar patrones en texto (DNI, mails, teléfonos) | 🌐 |
| Fechas con datetime: calcular días, cumpleaños, vencimientos | 🌐 |

Se escriben después de las clases del sistema, en los huecos de diciembre.

## 2027

Los cursos son **Usuaria/o de IA generativa**, en el lugar de Pensamiento Computacional, y
**Programador/a Web**, en el lugar de Testing. Son anuales; las fechas todavía no están.

**Plataforma:** solo Astro, con la teoría y los ejercicios en el mismo lugar. Se define cerca de
diciembre.

**Inscripciones 2027**, según la publicación del CFP en Instagram:

- Del **martes 1/12 al viernes 4/12**.
- Cada curso tiene un día y horario propio de inscripción. **Averiguar el de los nuestros.**
- Requisitos: 2 fotocopias del DNI y la cooperadora.
- Para mayores de 16 años.

**Video de promoción para Instagram:** pendiente, en una charla aparte. Tiene que estar antes del
1/12, porque las inscripciones arrancan ese día.

**Borrador de módulos** (a charlar):

- **Usuaria/o de IA generativa:**
  - Cómo predice un modelo (tokens, atención).
  - Prompts.
  - Imágenes, como en el estudio de la Expo.
  - Claude, ChatGPT y Gemini para el trabajo y el emprendimiento.
  - Alucinaciones, privacidad, sesgos y derechos.
  - Agentes y MCP.
  - Un modelo chico entrenado en el navegador.
- **Programador/a Web:**
  - HTML, CSS y JS.
  - Accesibilidad y responsive.
  - Git y GitHub Pages.
  - DOM y eventos.
  - fetch y APIs.
  - Un backend con base de datos.
  - Deploy.
  - Proyecto: la web de un emprendimiento del barrio, como continuación de los catálogos.
