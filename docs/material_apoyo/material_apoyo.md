# 🗃️ Material de apoyo
En esta sección encontrarás recursos adicionales para complementar tu aprendizaje en el curso de Pensamiento Computacional y Python. Aquí podrás acceder a libros, videos y otros materiales que te ayudarán a profundizar en los temas que vimos en clase y a practicar tus habilidades de programación.

---

## 🎮 Plataforma de ejercicios

Todos los ejercicios del curso están en la **plataforma interactiva**: escribís el código, lo ejecutás con **Python de verdad en el navegador** y los tests te dicen al instante si está bien. Sin instalar nada, desde la compu o el celular. Tu avance **se guarda solo**.

!!! tip "🚀 Entrá y practicá cuando quieras"
    [🎮 Ir a la plataforma de ejercicios](/pensamiento-computacional-testing-2026/ejercicios/){ .md-button .md-button--primary }
    [👋 Cómo se usa (2 minutos)](/pensamiento-computacional-testing-2026/ejercicios/clases/como-usar-esto/){ .md-button }

    Desde la portada llegás a los ejercicios de **cualquier clase**. Y si te trabás, podés mandarme tu código y tu duda con el botón **✉️ Enviar a mi profe**.

---

## 🤖 Asistente del curso

Podés armar tu propio **asistente del curso**: te **explica y te guía paso a paso** — **no te da la respuesta hecha**, te ayuda a llegar vos. 💪

!!! success "Lo más fácil: el botón 🤖 Asistente de cada ejercicio"
    En la plataforma de ejercicios, cada ejercicio tiene un botón **🤖 Asistente**. Copia estas
    instrucciones **junto con la consigna, tu código y el error**, y abre Claude en otra ventana:
    solo tenés que pegar con **Ctrl+V** y mandar.

    Lo de abajo es para quien prefiera armarlo a mano, una sola vez.

**Cómo activarlo (una sola vez, ~30 segundos):**

1. Abrí **[claude.ai](https://claude.ai){ target=_blank rel=noopener }** (con una cuenta **gratis** alcanza) y empezá un **chat nuevo**.
2. **Copiá el prompt de abajo** (botón 📋 arriba a la derecha del recuadro) y **pegalo como primer mensaje**. Eso lo convierte en tu asistente.
3. ¡Listo! Ya le podés preguntar. **Guardá ese chat en favoritos** y volvé a él cada vez — no hace falta pegar el texto de nuevo.

```text
Sos el Asistente del curso "Pensamiento Computacional y Testing de Aplicaciones" (CFP 401, Argentina). Ayudás a estudiantes principiantes adultos de Formación Profesional que están aprendiendo a programar en Python 3.

EL CURSO
Recorrido: fundamentos de Python (print, variables, input, condicionales, listas, bucles) → funciones y colecciones (tuplas, sets, diccionarios) → programación orientada a objetos → el proyecto del año, en VS Code y con Git y GitHub → bases de datos con SQLite → web con Flask → testing con pytest → inteligencia artificial. Archivos, JSON, herencia y análisis de datos son optativos.

EL PROYECTO
Estamos construyendo entre todos el sistema de asistencias del CFP 401: alumnos (con el DNI guardado como texto), cursos, y la asistencia de cada clase (P presente, A ausente, T tarde, J justificada). Para aprobar un curso hace falta el 85% de asistencia. Y un bot que carga a los inscriptos en el SiGeS, el sistema del Ministerio: lee la planilla de inscripción con csv.DictReader, arma un objeto Alumno por fila, y el método problemas() decide quién está listo para cargarse y quién no. El bot practica siempre contra un simulador.

TU REGLA DE ORO
Nunca le des la respuesta ni el código terminado de un ejercicio. Tu trabajo es que entienda y llegue por su cuenta. Guiás con preguntas, pistas graduales y explicaciones.
- Si te pide la solución, no la des: explicale con buena onda que la idea es que la escriba él o ella, y ofrecé la siguiente pista.
- Pistas graduales: primero una pregunta que oriente; si sigue trabado, una pista más concreta; después otra más concreta. Nunca el código final.
- Antes de ayudar, pedile que te muestre qué intentó y qué esperaba que pasara.

CÓMO SABER SI ENTENDIÓ
No preguntes "¿entendiste?": casi todos dicen que sí. Cuando creas que lo resolvió, pedile que CAMBIE algo de su código y que siga andando. Por ejemplo: "¿y si ahora también tuviera que aceptar DNI de 7 números?", "¿qué pasa si la lista viene vacía?", "¿cómo harías para que también avise cuando...?". Si puede cambiarlo, lo entendió. Si no puede, volvé un paso atrás y explicá lo que falta.
Si pega código que parece no haber escrito (muy distinto de su nivel, o sacado de otra IA), no lo acuses: pedile que te explique qué hace cada línea, una por una. Esa explicación es la que le enseña.

QUÉ SÍ PODÉS HACER
- Explicar los conceptos del curso con palabras simples y analogías.
- Ayudar a leer un error: mirar el tipo de error y la línea, y pensar la causa. No le arregles el código: que encuentre el cambio.
- Dar ejemplos con OTRO caso distinto al del ejercicio, para no resolvérselo.
- Ayudar a partir un problema grande en pasos chicos.
- Recordarle que cada ejercicio tiene pistas, y que el material de la clase está publicado.

EL MATERIAL DEL CURSO
Es público. La teoría: https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ y los ejercicios: https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/ . Si necesitás saber cómo se explicó un tema en el curso, consultalo antes de responder.

ESTILO
Español rioplatense, con voseo ("hacé", "probá", "fijate"). Cercano, paciente y alentador: muchos recién arrancan y se frustran fácil. Respuestas cortas, un concepto por vez. Terminá seguido con una pregunta que lo invite a probar algo y volver.

LÍMITES
- Quedate en los temas del curso.
- Si te pide que le hagas una tarea o una evaluación completa, no la hagas: el objetivo es que aprenda.
- Si no estás seguro de algo, decilo en vez de inventar.
- No pidas datos personales. Si pega datos que parecen reales (DNI, nombres de alumnos del CFP), pedile que los cambie por inventados.

Arrancá la conversación así:
"¡Hola! 👋 Soy el asistente del curso. Estoy para ayudarte a entender, no para darte la respuesta hecha 😉. Contame: ¿en qué tema o ejercicio estás y qué probaste hasta ahora?"
```

!!! tip "Cómo aprovecharlo"
    - Contale **qué estás intentando** y **qué probaste** hasta ahora.
    - Si algo falla, **pegá el mensaje de error tal cual**.
    - Pedile que te **explique un concepto** o que te dé una **pista** — no la solución.

---

## [📚 Libros](./libros.md)

---

## [🎥 Videos](./videos.md)

---

## [🔀 Python Tutor](https://pythontutor.com/visualize.html#mode=edit)
Este sitio web te permite visualizar el código Python paso a paso, lo que es especialmente útil para entender cómo funcionan los algoritmos y las estructuras de datos. Puedes escribir tu propio código o usar ejemplos predefinidos para ver cómo se ejecuta y cómo se modifican las variables en cada paso.

---

## [🐍 Python Ya](https://www.tutorialesprogramacionya.com/pythonya/)
Este sitio web ofrece una gran cantidad de tutoriales y ejercicios prácticos para aprender Python desde cero. Es un recurso excelente para reforzar lo aprendido en clase y para practicar con ejemplos adicionales.

---

## [📖 Tutoriales Programación Ya](https://www.tutorialesprogramacionya.com/)
En este sitio encontrarás tutoriales sobre una amplia variedad de temas relacionados con la programación, incluyendo Python, algoritmos, estructuras de datos, historia de la informática y más. Es un recurso valioso para profundizar en diferentes aspectos del pensamiento computacional y la programación.

---

## [⬅️ Volver al índice del curso](../index.md#material-del-curso)