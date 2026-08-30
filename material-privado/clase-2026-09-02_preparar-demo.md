# Clase del miércoles 2/9 — ensayo de la entrevista + Archivos

> Run of show. 13:20 a 16:40 (límite duro).
> Prepara la visita de los stakeholders del **viernes 4/9**.
> La herramienta de la clase es la página `/entrevista/` de la plataforma.

---

## 0. La decisión que hay que tomar antes de armar la clase

**La preparación de la entrevista NO se lleva las tres horas y veinte. Se lleva 70 minutos.**

El grueso ya se hizo el 26/8: la técnica, el guion en embudo, los cinco roles, la regla de "el que
pregunta no habla". Lo que falta ahora es **ensayarlo con la herramienta en la mano**, y eso se
hace en poco más de una hora.

El resto de la clase va a **Archivos**, y no por rellenar: es que Archivos no tiene otro lugar.

### El problema de calendario, dicho de frente

| | |
|---|---|
| **Vie 28/8** | Era el día de Archivos. No se dio. |
| **Mié 2/9** | Era JSON. Ahora es la preparación de la entrevista. |
| **Vie 4/9** | La demo. Se lleva la clase entera o buena parte. |
| **Mié 9/9** | Arranca POO — y es el límite de la puesta al día, ya anunciado al grupo. |

O sea: si el 2/9 se va entero en preparar la entrevista, **Archivos y JSON se quedan sin fecha
antes de POO**. Y la dependencia está escrita en el plan: *el proyecto guarda datos desde la
primera versión*, así que POO sin Archivos deja el sistema sin poder guardar nada.

**Propuesta: partir el 2/9.** 70 minutos de ensayo, 105 de Archivos. JSON se corre al 9/9 o entra
mezclado con POO (que es donde el sistema lo va a necesitar de verdad).

> Si igual preferís usar la clase entera para la entrevista, se puede — pero entonces hay que
> decidir **hoy** de dónde salen Archivos y JSON, y la única respuesta honesta es correr POO una
> clase.

---

## 1. Cronograma

| Hora | Qué | Cuánto |
|---|---|---|
| 13:20 | Qué pasó el viernes y qué se viene | 5 min |
| 13:25 | 🎤 **Ensayo de la entrevista con el kit** | 70 min |
| 14:35 | ☕ Corte | 10 min |
| 14:45 | 💾 **Archivos** | 105 min |
| 16:30 | Checklist del viernes: quién trae qué | 10 min |

---

## 2. 🎤 El ensayo (70 min)

### 2.1 El kit, abierto en la máquina de cada uno (10 min)

Que abran `/entrevista/` **y la usen**, no que la miren en el proyector. Tres cosas para que vean
solos:

- El botón de cada rol cambia las preguntas y **la pantalla**.
- El link abre el prototipo **directo en esa pantalla**. No hay que buscar nada en el menú.
- Las cajas se guardan solas. Se puede cerrar el navegador y siguen ahí.

### 2.2 Ensayo 1 — preceptoría, con reloj (15 min)

Repartir los cinco roles. **Vos hacés de preceptora**, igual que el 26/8, y el rol de ⏱️ Tiempo
arranca el cronómetro.

Contestá como alguien apurado. Y esta vez agregá una cosa nueva: **pedí algo que no existe**
("¿esto me lo saca de los treinta cursos juntos?"). Lo que hagan con eso es lo que estamos
ensayando.

### 2.3 Qué falló, mirando las cajas (10 min)

No preguntes "¿cómo les fue?". Abrí el kit en el proyector y **mirá las cajas**:

- ¿La 🔵 quedó vacía? Entonces nadie preguntó qué **no** usaría. Es la que más plata ahorra.
- ¿La 🟡 tiene frases mías o frases de ustedes? Si están reescritas, ya se perdió información.
- ¿Alguien anotó lo que **hice**, no lo que dije? Ese es el trabajo del observador.

### 2.4 Ensayo 2 — la auxiliar, con los roles rotados (15 min)

El que menos esperan, y el que tiene **la pantalla que no existe**.

Acá se ensaya la respuesta más difícil del viernes: *"eso todavía no está hecho — contame cómo lo
harías vos y lo anotamos"*. Sin disculparse y sin prometer.

### 2.5 Lo que se dice cuando piden algo que no está (10 min)

Tres frases, para que las tengan escritas:

| Situación | Lo que se dice |
|---|---|
| Pide algo que no existe | *"Todavía no está. Contame cómo lo necesitarías y lo anotamos."* |
| Pide algo imposible este año | *"Lo anotamos igual."* (se filtra después, nunca delante) |
| Pregunta cuándo va a estar | *"Eso lo decidimos nosotros la semana que viene con todo lo que anotemos hoy."* |
| Pregunta si está hecho en Python | *"Esto es una maqueta para poder preguntarte antes de programar. Lo que estamos construyendo es en Python."* |

### 2.6 Checklist y quién trae qué (10 min)

La lista está al final de `/entrevista/`. Lo que hay que **asignar con nombre**:

- Quién trae **un celular** con el prototipo abierto en *pasar lista*.
- Quién trae **la planilla de papel de verdad** para poner al lado de la pantalla.
- Quién abre las dos pestañas antes de que entre nadie.

---

## 3. 💾 Archivos (105 min)

Los ejercicios están en `/clases/archivos/`, y desde el 29/8 la clase tiene **tres nuevos dirigidos
al sistema** además de los cinco que ya estaban:

- *Guardar la lista del día* — un renglón por alumno, ordenado por DNI.
- *Leer la lista, y si no está arrancar vacío* — el caso del primer día.
- *La copia de seguridad* — con la fecha en el nombre.

> Los tres son, literalmente, lo que el sistema necesita para que la asistencia sobreviva a cerrar
> el programa. Decilo así: **lo que escriban hoy es lo que el viernes les van a estar mirando.**

---

## 4. Para el viernes 4/9

### Todavía no sabemos cómo vienen

Es el dato que falta y no lo vamos a tener antes. La página tiene las tres variantes (todos juntos
/ por rondas / de a uno) y el kit funciona en las tres. Lo que **no** puede pasar es que el viernes
se decida sobre la marcha quién hace qué.

### Qué hacen mientras no hay nadie

Si vienen de a uno, va a haber huecos. **Que sigan con los ejercicios de Archivos**, con las dos
pestañas abiertas. Nadie esperando de brazos cruzados: eso es lo que más nervioso pone al grupo y
lo primero que se nota cuando entra alguien.

### La foto

Vale la pena una foto del grupo con los stakeholders (con permiso). Sirve para la Expo del 13/11 y
para el informe. **Sin la pantalla de fondo**, que ahí puede haber datos de prueba con nombres.

### Lo que decide si el viernes salió bien

No es que les guste el prototipo. Es que **las cuatro cajas queden llenas** — y sobre todo la 🔵.
Un stakeholder que se va diciendo "está lindo" sin haber dicho qué le sobra, no dejó nada.
