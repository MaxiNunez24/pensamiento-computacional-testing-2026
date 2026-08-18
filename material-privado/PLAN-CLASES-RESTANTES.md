# Plan de las clases que quedan (19/8 → 18/12)

> Documento de trabajo, teacher-only. Escrito el 18/8/2026.
> Ver también [`PROYECTO-ASISTENCIAS.md`](./PROYECTO-ASISTENCIAS.md), que tiene el detalle del
> proyecto y las clases que hacen falta para poder hospedarlo.

---

## 1. La cuenta

Miércoles y viernes desde el 19/8 hasta la última clase del 18/12:

- **36 fechas**, menos el **viernes 20/11** (Día de la Soberanía Nacional) → **35 clases**.
- A 3h20 cada una, son unas **116 horas**. Parece mucho y no lo es: el proyecto solo se lleva
  la mitad.

Lo que falta dar, en crudo: **Archivos** (quedó flojo) · **JSON** · **POO** · **el proyecto CLI** ·
**Testing con pytest** · **entorno virtual** · **Flask** · **SQLite** · **login y roles** ·
**deploy** · **Playwright / Bot SiGes** · **pandas** · **IA** · **proyecto final**.

No entra todo. Abajo, qué recomiendo sacar y por qué.

---

## 2. Tres decisiones que hay que tomar ahora

### 2.1 En la Expo CFP (9/11) se presenta el Sistema de Asistencias, no el proyecto final

El cronograma decía que en la Expo se presentaba el proyecto final con IA, arrancado el 7/10. Con
la cuenta de arriba, eso da cuatro semanas para elegir tema, aprender a consumir una API y
construir algo presentable — mientras todavía se está terminando Flask.

Y hay algo mejor para mostrar: **un sistema que el CFP usa de verdad**, hecho por los alumnos,
que resuelve un problema que la escuela tiene hoy. Eso en una Expo pesa mucho más que un demo de
IA hecho a las corridas.

→ **El proyecto final con IA pasa a ser el cierre de diciembre.**

### 2.2 pandas y numpy quedan como optativo

El Bloque 6 estaba pensado como puente hacia la IA. Con el tiempo que hay, meterlo obliga a
recortar el proyecto o el testing. **Testing está en el nombre del curso**; pandas no.

→ Queda **una clase de "reportes con pandas"** sobre la propia planilla de asistencia (que para
entonces tiene datos reales, así que se justifica sola), y si el grupo va rápido, se suma otra.

### 2.3 El deploy se da, no se saltea

Son ~5 clases nuevas (entorno virtual, SQLite, login/roles, puesta en producción) que no estaban
en el plan original. **Sin eso el proyecto no le sirve al CFP**: una app que corre en una sola
computadora no la puede usar un preceptor desde el celular. Es la diferencia entre un ejercicio y
un sistema.

---

## 3. El plan clase por clase

Fechas fijas: lo demás se corre si hace falta. La regla del curso sigue siendo la misma: **si un
tema necesita más tiempo, se lo damos** y se recorta del final, no del medio.

### 🛠️ Agosto — cerrar Persistencia (4 clases)

| Fecha | Clase | Notas |
|---|---|---|
| Mié 19/8 | **Archivos** — retomarlo en serio: leer, escribir, `with` | Quedó flojo del 8/7. Práctica en la plataforma. |
| Vie 21/8 | **Archivos** práctica + guardar/leer una lista de alumnos | Ojo: puede caer acá la **demo a preceptores**. |
| Mié 26/8 | **JSON** — leer y escribir, por qué no alcanza un `.txt` | |
| Vie 28/8 | **JSON** práctica — cierra el Bloque 3 | Acá ya guardan datos que sobreviven al cierre. |

### 🏗️ Septiembre — POO y arranque del proyecto (9 clases)

| Fecha | Clase | Notas |
|---|---|---|
| Mié 2/9 | **POO I** — clases, objetos, atributos | |
| Vie 4/9 | **POO I** práctica | |
| Mié 9/9 | **POO II** — métodos, `__init__`, `__str__` | |
| Vie 11/9 | **POO II** práctica | |
| Mié 16/9 | **Herencia** — lo justo, sin `super()` avanzado | |
| Vie 18/9 | **Del prototipo al modelo**: qué clases necesita el sistema | Se les muestra el prototipo y **entre todos** se decide `Alumno`, `Curso`, `Asistencia`. |
| Mié 23/9 | **Proyecto CLI 1** — alta y listado de alumnos | |
| Vie 25/9 | **Proyecto CLI 2** — pasar asistencia por día | |
| Mié 30/9 | **Proyecto CLI 3** — guardar en JSON | ✅ **Hito: CLI funcionando.** |

### 🧪 Octubre — Testing, entorno y web (9 clases)

| Fecha | Clase | Notas |
|---|---|---|
| Vie 2/10 | **pytest I** — el primer test sobre código propio | El módulo de Testing arranca acá, con código que les importa. |
| Mié 7/10 | **pytest II** — casos borde, y un bug real encontrado por un test | |
| Vie 9/10 | **Entorno**: `venv` y `requirements.txt` | Corto; deja el proyecto instalable en otra máquina. |
| Mié 14/10 | **Cómo funciona la web** + Flask "hola mundo" | |
| Vie 16/10 | **Flask**: rutas y plantillas | Las plantillas HTML **se entregan hechas** (la planilla ya es un molde). |
| Mié 21/10 | **Flask**: formularios — alta de alumnos por web | |
| Vie 23/10 | **Migrar el CLI a Flask I** | Refactor de código propio: la lección está acá. |
| Mié 28/10 | **Migrar el CLI a Flask II** | |
| Vie 30/10 | **SQLite** — por qué JSON deja de alcanzar con varios usuarios | |

### 🚀 Noviembre — cerrar el sistema y la Expo (7 clases, 20/11 feriado)

| Fecha | Clase | Notas |
|---|---|---|
| Mié 4/11 | **SQLite II** + **login**: contraseñas hasheadas, sesiones | Nunca guardar una contraseña en texto plano. |
| Vie 6/11 | **Roles y permisos** + preparar la Expo | |
| Mié 11/11 | **Deploy**: subir el proyecto a PythonAnywhere | ✅ **Hito: el sistema en internet.** |
| Vie 13/11 | **Playwright I** — Bot SiGes | Necesita las fotos del proceso de carga. |
| Mié 18/11 | **Playwright II** — y testing E2E | Cierra el módulo de Testing. |
| Mié 25/11 | **IA**: qué es una API y cómo se consume desde Python | Arranca el proyecto final. |
| Vie 27/11 | **Proyecto final**: elegir tema y armar el plan | |

### 🎓 Diciembre — proyecto final (6 clases)

| Fecha | Clase | Notas |
|---|---|---|
| Mié 2/12 | **Reportes con pandas** sobre la planilla propia | Optativo: si el proyecto final va apretado, se saltea. |
| Vie 4/12 | Taller de proyecto final | |
| Mié 9/12 | Taller de proyecto final | |
| Vie 11/12 | Taller de proyecto final | |
| Mié 16/12 | **Presentaciones** | |
| Vie 18/12 | **Cierre y celebración** | |

---

## 4. Dependencias que hay que respetar

- **Archivos y JSON antes de POO**: el proyecto guarda datos desde la primera versión.
- **POO antes del CLI**: sin objetos, el proyecto se vuelve un archivo de 600 líneas.
- **El CLI antes de Flask**: migrar código propio es la mitad del aprendizaje. Si arrancan
  directo en Flask, se pierde.
- **SQLite antes de login**: los usuarios se guardan en algún lado.
- **Datos inventados siempre.** El prototipo que se les muestra ya viene con alumnos ficticios.

---

## 5. Riesgos, ordenados por probabilidad

1. **POO se lleva más de 5 clases.** Es el salto conceptual más grande del año. Si pasa, se
   recorta de los talleres de diciembre, no del proyecto.
2. **Flask se come octubre entero.** Mitigación: las plantillas van hechas; solo escriben Python.
3. **El bot del SiGes no se puede armar** porque no llegan las fotos del proceso. Mitigación: si
   para el 13/11 no están, esas dos clases pasan a testing E2E con un sitio de práctica.
4. **La demo a preceptores trae pedidos nuevos.** Ya está previsto: lo que pidan modula el
   **proyecto**, no el curso. Si necesita tecnología que no se va a dar, es trabajo del profe o de
   una etapa posterior.

---

## 6. Lo que hay que tener listo antes de cada etapa

| Para | Hace falta |
|---|---|
| 18/9 (del prototipo al modelo) | El prototipo con datos inventados — **listo** |
| 23/9 (CLI) | Enunciado del proyecto y el formato de datos acordado |
| 2/10 (pytest) | Nada nuevo: se testea el código que ya escribieron |
| 14/10 (Flask) | Las plantillas HTML de la planilla, ya hechas |
| 11/11 (deploy) | Cuenta de PythonAnywhere **del CFP**, no personal |

---

## 7. El atraso del grupo: plan de mínimos (18/8)

La mayoría no completó el Mini Parcial y viene atrasada con la práctica. Se decidió **ponerse
estricto**: hay una página pública con lo mínimo que hay que resolver en casa —
[`docs/al_dia.md`](../docs/al_dia.md), publicada como **"✅ Ponerse al día"**.

### Por qué está armado así

- **27 ejercicios en dos semanas**, no 60. Un mínimo alcanzable se hace; una lista de 60 se
  abandona el primer día. Los elegidos son los que después reaparecen en POO y en el proyecto.
- **La fecha tiene un motivo explicado**: el 2/9 arranca POO. No es "porque lo digo yo", es que
  POO no se entiende sin soltura con variables, condicionales, listas y bucles. Un plazo con razón
  se cumple mucho más que un plazo con autoridad.
- **Termina con el Mini Parcial entregado**, que es lo que falta y lo que da la foto real de dónde
  está cada uno.
- **Se pide avisar si no se llega.** Sirve más un "no llegué con bucles" el 27/8 que descubrirlo
  el 2/9 con POO empezado.

### Cómo saber quién va al día

El progreso de cada alumno se sincroniza con el Worker (KV de Cloudflare, una clave por alumno con
el nombre adentro). Para el 28/8 se puede mirar ahí quién completó qué, sin tener que preguntar de
a uno.

### Si el grupo no llega

**No arrancar POO igual.** Correr una clase y usar el 2/9 como taller de puesta al día es más
barato que dar POO sobre bases flojas y tener que repetirlo entero en octubre — cuando ya no hay
tiempo. El plan de arriba tiene margen justamente para eso.
