# Scrum en el curso, sin dar Scrum

> Escrito el 27/8/2026. Cómo trabajar con la metodología **sin explicarla primero**, y qué
> contestar cuando alguien pregunte por qué hacemos las cosas así.

---

## La decisión: se usa, no se enseña

Es el mismo patrón que venimos usando con todo lo demás y por la misma razón: **una clase de
teoría sobre Scrum a gente que nunca trabajó en equipo de desarrollo no significa nada.** Sprints,
backlog, ceremonias, velocity — son palabras para nombrar cosas que todavía no vivieron.

Entonces al revés:

1. **Se trabaja así desde el 9/9**, sin nombrarlo.
2. Cuando alguien pregunte *"¿por qué siempre arrancamos contando qué hicimos?"* o
   *"¿por qué el tablero?"*, la respuesta es: **"esto se llama metodología ágil, y así se trabaja
   en la industria. Después vemos cómo se llama cada cosa."**
3. **En noviembre**, cuando ya lo vivieron dos meses, media clase alcanza para ponerle nombre a
   todo. Y ahí sí se entiende, porque es *"ah, esto que hacemos"*.

> El día que un alumno vaya a una entrevista y le pregunten si trabajó con metodologías ágiles, la
> respuesta va a ser "sí, dos meses" y va a poder contar cómo. Eso vale mil veces más que haber
> visto una diapositiva con la pirámide de Scrum.

---

## Cómo queda adaptado

Scrum de manual asume un equipo full-time. Acá son seis personas, dos veces por semana, tres horas
y veinte. Lo que se conserva y lo que se cambia:

| Scrum de manual | Acá | Por qué |
|---|---|---|
| Sprint de 2 a 4 semanas | **Sprint = 2 semanas = 4 clases** | Menos que eso no da tiempo a terminar nada; más y se pierde el ritmo |
| Daily standup de 15 min | **Arranque de clase, 5 min** | Dos veces por semana, no cinco. Y 5 min alcanza para seis personas |
| Product Owner | **El profe**, representando al CFP | Los preceptores son el cliente real, pero no están en cada clase |
| Scrum Master | **Rota**: es el rol "🗺️ al día" | Que rote es más importante que hacerlo bien |
| Product Backlog | **El mapa del proyecto** (la página navegable) | Ya existe y ya lo entienden |
| Sprint Backlog | **El tablero** (`/tablero`) | Lo que entra en estas dos semanas |
| Sprint Review | **Última media hora del sprint**: se muestra lo que anda | |
| Retrospectiva | **10 min después de la review** | Es la ceremonia que más se saltea y la que más sirve |
| Estimación en puntos | ❌ **No se hace** | Estimar es difícil hasta para profesionales. Acá solo se decide si algo entra o no |

---

## El arranque de clase (5 minutos)

De pie, alrededor del tablero proyectado. Cada uno dice **tres cosas**:

1. **Qué hice** desde la clase pasada.
2. **Qué voy a hacer** hoy.
3. **Qué me traba** (si algo).

⚠️ **No es un informe al profe.** Es entre ellos. Si el profe se pone a resolver cada traba ahí
mismo, se convierte en una clase de consultas de 40 minutos y se pierde. Las trabas **se anotan** y
se resuelven después.

> 🧑‍🏫 La primera vez van a decir "no hice nada" y va a ser incómodo. Es normal y hay que
> sostenerlo sin dramatizarlo: *"listo, ¿qué vas a hacer hoy?"*. En dos semanas el incómodo pasa a
> ser el que no tiene nada que contar, y eso solo funciona si nadie lo señala.

---

## El sprint, clase por clase

Con sprints de 4 clases (2 semanas):

| | Qué pasa |
|---|---|
| **Clase 1** — planificación | Se mira el mapa, se eligen las piezas del sprint y se pasan al tablero. **Se decide qué NO entra.** |
| **Clase 2** — desarrollo | Arranque de 5 min + resolver + comparar + elegir + integrar |
| **Clase 3** — desarrollo | Igual |
| **Clase 4** — review y retro | Se muestra lo que anda (30 min) + retrospectiva (10 min) + planificación del siguiente |

### La review no es una presentación

Es **mostrar el sistema funcionando**. Si algo no anda, no se muestra: *no está terminado*. Esa
regla —**"terminado" significa que anda, no que está escrito**— es la que más cuesta y la que más
enseña.

### La retrospectiva, en tres preguntas

10 minutos, ronda, sin computadoras:

1. ¿Qué funcionó bien y hay que seguir haciendo?
2. ¿Qué nos frenó?
3. ¿Qué cambiamos para el próximo sprint?

**Una sola cosa se cambia por sprint.** Cambiar cinco cosas a la vez es no cambiar ninguna.

---

## Los tres calendarios de sprint hasta la Expo

| Sprint | Clases | Meta |
|---|---|---|
| **1** | 9/9 – 18/9 | Las clases del modelo: `Alumno` y `Curso` andando, con tests |
| **2** | 23/9 – 2/10 | Alta de alumnos, pasar asistencia y guardar en JSON |
| **3** | 7/10 – 16/10 | Tests de verdad + primera pantalla web |
| **4** | 21/10 – 30/10 | El sistema en el navegador, completo |
| **5** | 4/11 – 13/11 | Base de datos, usuarios y **la Expo** |

---

## Qué contestar cuando pregunten

| Si preguntan | Contestar |
|---|---|
| "¿Por qué contamos qué hicimos?" | "Para que nadie se quede trabado una semana sin que nadie se entere. Se llama *daily*, y se hace en todos lados." |
| "¿Por qué no hacemos todo de una?" | "Porque nadie sabe cuánto tarda algo hasta que lo hace. En dos semanas te enterás si ibas bien; en dos meses te enterás tarde." |
| "¿Esto tiene nombre?" | "Sí: **metodología ágil**, y esto en particular es **Scrum**. Lo vemos en detalle más adelante." |
| "¿Se usa en las empresas?" | "En casi todas. Y en la entrevista te lo van a preguntar." |

---

## Lo que puede salir mal

| | Qué hacer |
|---|---|
| **El arranque se estira a 20 minutos** | Timer visible. A los 5 minutos se corta aunque falte alguien |
| **Se convierte en un informe al profe** | Que hablen mirando al grupo, no a vos. Ponete atrás |
| **El tablero queda desactualizado** | Por eso existe el rol "al día". Si igual se muere, es señal de que el tablero tiene tarjetas de más |
| **Alguien no hace nada dos sprints seguidos** | Esto es lo que Scrum hace VISIBLE, y es su mayor valor. Se habla aparte, no en la ronda |
| **La review se llena de excusas** | Se muestra lo que anda. Lo que no anda no se muestra, y no pasa nada: se pasa al sprint siguiente |
