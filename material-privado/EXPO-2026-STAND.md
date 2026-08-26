# 🏆 Expo CFP 2026 — el stand

> Viernes **13 de noviembre**. Documento de trabajo, teacher-only.
> Escrito el 20/8/2026. Quedan **25 clases** hasta la Expo (la Expo es una de ellas).

---

## 1. La regla que ordena todo lo demás

En una Expo, la gente pasa. No se sienta a escuchar: mira diez segundos y decide si se queda.
Todo lo que sigue está pensado alrededor de eso:

> **Que el visitante toque algo en los primeros 15 segundos, y que en 60 se lleve una idea.**

Un stand con un póster y alguien explicando no funciona. Uno donde el visitante *hace* algo, sí.

Y la segunda regla, que es la que hace que valga la pena para el curso:

> **Hablan los alumnos, no el profe.** El profe está para destrabar, no para explicar.

---

## 1.bis El armado físico (confirmado)

- **Proyector sobre lona**: la notebook del profe proyectada. Es la pantalla grande donde se ve el
  sistema y donde corre lo que se muestra a distancia — lo que atrae desde lejos.
- **Una o dos PC de escritorio adelante**, con teclado y mouse: es donde el visitante **mete mano**.

Esa separación es la que hace que el stand funcione: **la lona atrae, las PC retienen.** Y tiene
una consecuencia práctica —

> Lo que va en las PC de escritorio tiene que poder usarse **sin que nadie explique nada**. Teclado
> y mouse, sin instrucciones habladas: un cartelito de una línea arriba de cada máquina y listo.

Con dos PC conviene que **cada una tenga algo distinto**: una con el sistema de asistencias (para
quien quiere ver el trabajo hecho) y otra con los juegos (para quien pasa y quiere jugar treinta
segundos). Si se pone lo mismo en las dos, se hace cola en una sola.

## 2. Qué mostramos

### 2.1 El sistema, funcionando de verdad

Es la pieza central y la que justifica todo: **un sistema que el CFP va a usar**, hecho por
alumnos que en marzo no sabían qué era una variable.

El momento fuerte no es la pantalla: es **la planilla impresa**. Que alguien cargue un nombre y
treinta segundos después tenga en la mano el formulario oficial del Ministerio, con el logo y las
50 columnas, es la mejor explicación de para qué sirve programar que se puede dar sin decir una
palabra.

**Hay que llevar impresora**, o al menos diez planillas ya impresas para repartir.

### 2.2 Tres interacciones para el visitante

Ordenadas por lo que rinden, no por lo que cuestan.

| | Qué hace el visitante | Qué se lleva | Dura |
|---|---|---|---|
| 🔍 **El buscador** | Aprieta un botón y ve cuántos pasos tarda la computadora en encontrar un nombre entre 5.000, de dos maneras distintas | Que la forma de resolver algo **importa**, no solo que ande | 20 s |
| ✍️ **El libro de visitas** | Escribe su nombre y ve correr el `print()` de verdad que lo saluda | Que eso que ve es Python real, no un video | 30 s |
| 🗂️ **¿Dónde va cada uno?** | Clasifica tarjetas arrastrando (el componente que ya tenemos) | Que programar es sobre todo **decidir** | 60 s |

**El buscador es el que más rinde** y es el que yo pondría primero. Es la idea más grande del año
—que dos soluciones correctas pueden ser distintísimas— y entra por los ojos en una pantalla, sin
que nadie tenga que explicar nada. Además ya tenemos el croquis de eficiencia hecho.

### 2.3 Un QR grande

A la plataforma de ejercicios. Que el visitante se vaya con el curso en el celular es la mejor
inscripción que podemos hacer, y no cuesta nada: un cartel A4 con el QR y **"probá vos"**.

---

## 3. Qué hay que construir (y en qué orden)

Todo esto es tiempo **fuera** de las clases: son cosas del profe o tareas cortas repartidas.

| Prioridad | Qué | Cuándo conviene tenerlo |
|---|---|---|
| 1 | **El buscador** (página interactiva con contador de pasos) | Septiembre. Sirve además como clase de eficiencia el 23/9. |
| 2 | **Datos de demo** cargados y realistas en el sistema | Con el deploy, 6/11 |
| 3 | **Libro de visitas** | Octubre |
| 4 | **Cartel con QR + planillas impresas** | Primera semana de noviembre |
| 5 | Clasificar con tarjetas del stand | Ya está el componente: solo escribir el contenido |

⚠️ **Nada de esto puede depender de internet del predio.** El sistema tiene que poder correr en la
notebook, en local, sin wifi. Si hay conexión, mejor; si no, el stand funciona igual.

---

## 4. El guion de los 60 segundos

Para que los alumnos no improvisen. Cada uno se aprende **su** parte, no todo.

1. **"¿Sabés cómo se toma asistencia acá?"** — mostrar la planilla en papel. Todos la reconocen.
2. **"Esto lo hacemos con esto"** — cargar un alumno en vivo, marcar presente.
3. **"Y sale así"** — imprimir. Darle el papel en la mano.
4. **"Lo hicimos nosotros, en Python, este año"** — acá va el nombre del alumno que habla.
5. **"¿Querés probar?"** — el buscador o el libro de visitas.
6. **QR** — "esto es lo que estudiamos, probalo".

**Cada alumno elige un paso.** El que no quiere hablar se ocupa de la impresora o del QR: en un
stand hay lugar para todos y nadie tiene que exponerse más de lo que quiere.

---

## 5. Logística

- [ ] Confirmar **mesa, silla, enchufe** y si hay pantalla/proyector
- [ ] **Notebook** con todo instalado y probado (la del 11/11, no otra)
- [ ] **Impresora** + papel **Oficio** (la planilla es Legal apaisada)
- [ ] Zapatilla y alargue
- [ ] Cartel con QR (A4 o A3)
- [ ] 10 planillas impresas de repuesto
- [ ] Datos de demo **inventados** — nunca alumnos reales
- [ ] Plan B sin internet **probado**, no supuesto

---

## 6. Riesgos

1. **Que el sistema no esté listo.** Mitigación: el deploy es el 6/11, una semana antes. Si el
   6/11 no está, la Expo se hace con el prototipo, que ya funciona.
2. **Que no haya internet.** Ver arriba: todo tiene que andar local.
3. **Que los alumnos se congelen.** Mitigación: el guion de arriba, ensayado el 11/11, y que cada
   uno tenga UNA sola cosa que decir.
4. **Que la impresora falle.** Mitigación: las 10 planillas impresas de antes.
