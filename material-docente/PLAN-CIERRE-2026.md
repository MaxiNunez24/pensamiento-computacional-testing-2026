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

## Las clases que quedan

**Cambio del 18/11:** la última clase es el **mié 2/12**, porque el vie 4/12 Maxi inscribe para
2027. Después de la del 18/11 quedan **4 clases**. Lo que no entra en clase va **de tarea**, y cada
clase arranca con las consultas de la tarea.

| Fecha | Clase | Tarea para casa | Estado |
|---|---|---|---|
| Mié 18/11 | **De vuelta al sistema**: el plan, un repaso con práctica (Alumno, Curso, cargar con excepciones), del objeto al HTML y el primer vistazo a Flask en la compu | Los ⭐ que falten; POO II y el bot si quedaron | ✅ escrita (`clases/de-vuelta-al-sistema`) |
| Vie 20/11 | **SQLite**: el sistema guarda en una base (con `repositorio.py`). Confirmar que hay clase: el feriado se corre al lunes 23 | Terminar SQLite | ✅ escrita |
| Mié 25/11 | **Flask sobre la base**: lo que en el plan eran Flask I, Flask II y Migrar a Flask, en una sola clase. La lista sale de SQLite, más un formulario de alta y otro para marcar asistencia | Terminar el sistema web | ✍️ a escribir (`clases/flask`) |
| Vie 27/11 | **El sistema en la red del CFP**: correrlo en una compu (`host="0.0.0.0"`), la IP, el firewall, y entrar desde el celular. La pantalla del tótem: marcar presente con el DNI | Probarlo en casa con el celular y el wifi de casa | ✍️ a escribir (`clases/red-del-cfp`) |
| **Mié 2/12** | **Testing y cierre**: Testing I, más lo que ya probaron con nombre (lo que iba a ser el glosario), el sistema andando, y qué sigue (las optativas y las inscripciones 2027 del 4/12) | — | ✅ Testing I escrita; el cierre, a escribir |

**Pasan a tarea u optativa:**
- **Taller: el sistema por consola** queda de tarea, porque Flask reemplaza al menú de consola.
- **Lo que Python hace por vos** queda como optativa.
- **Login** queda para el que quiera ir más allá; si se escribe, va como optativa.
- **El glosario** se absorbe en la clase del 2/12.

**Sobre Flask (25/11):** la clase del 18/11 ya mostró varias cosas, así que esta arranca desde ahí,
sin repetir el "hola mundo":
- `@app.route`.
- Devolver HTML desde una función.
- La ruta con un dato (`/alumno/<dni>`).
- El 404.

Lo nuevo de esta clase es:
- `render_template`, con una plantilla mínima.
- Formularios con `request.form` y `redirect`.
- Los datos desde `repositorio.py`, en lugar de la memoria.

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

Se escriben después de las clases del sistema. Como el curso termina el 2/12, quedan para que los
alumnos las hagan solos después del curso.

## 2027

**Nombre (18/11):** **Usuaria/o de IA generativa y Programación Web**. Es un solo curso anual:
arranca con IA generativa y sigue con la web. Es desde cero, sin conocimientos previos, porque si
no se pierden muchos alumnos.

- **Horarios:** a definir según la facultad de Maxi. Serían más o menos lunes o martes, y casi
  seguro los viernes, que es el día más libre del CFP.
- **Cupo:** se ve según cuántos se inscriban.
- **Clases animadas:** con el motor de animaciones y ejercicios como los de este año, que corrigen
  solos.

**Plataforma:** solo Astro, con la teoría y los ejercicios en el mismo lugar. Se define cerca de
diciembre.

**Inscripciones 2027**, según la publicación del CFP en Instagram:

- Del **martes 1/12 al viernes 4/12**.
- Cada curso tiene un día y horario propio de inscripción. **Averiguar el de los nuestros.**
- Requisitos: 2 fotocopias del DNI y la cooperadora.
- Para mayores de 16 años.

**Video de promoción para Instagram:** se planifica desde el 18/11. Tiene que estar listo el
**viernes 20/11**, para que se comparta en las redes antes de las inscripciones.

**Texto para los preceptores** (18/11, para que puedan contar de qué trata el curso):

> **Usuaria/o de IA generativa y Programación Web** · CFP 401 · curso anual 2027
>
> Un curso para empezar desde cero: no hace falta saber nada de programación ni tener
> experiencia con la computadora. Primero se aprende a usar la inteligencia artificial (ChatGPT,
> Gemini, Claude) para estudiar, trabajar y emprender: pedirle bien las cosas, crear textos e
> imágenes, y darse cuenta cuándo se equivoca. Después, con esa ayuda, se aprende a crear páginas
> web y a publicarlas en internet, como la de un emprendimiento propio o del barrio. Las clases son
> con animaciones y con ejercicios en la computadora que se corrigen al instante. Este año, los
> alumnos del curso armaron catálogos web para emprendimientos de la zona y los mostraron en la
> Expo.
>
> **Inscripción:** del 1 al 4 de diciembre. Para mayores de 16, con 2 fotocopias del DNI y el
> aporte a la cooperadora. Días y horarios a confirmar (probablemente lunes o martes, y viernes).
> El cupo se define según la inscripción.

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
