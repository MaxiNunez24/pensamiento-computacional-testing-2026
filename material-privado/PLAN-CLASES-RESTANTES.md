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

### 2.2 pandas queda optativo; testing se amplía

El Bloque 6 (pandas/numpy) estaba pensado como puente hacia la IA. Con el tiempo que hay, meterlo
obliga a recortar el proyecto o el testing. **Testing está en el nombre del curso**; pandas no.

→ pandas queda como **clase optativa** ("reportes sobre la propia planilla de asistencia"), y las
horas van a **testing**, que pasa de 2 a **4 clases**:

| Clase | Qué |
|---|---|
| **Testing I — teoría** | Por qué se prueba. Qué es un caso de prueba. Unitario vs. integración vs. E2E. Regresión: por qué un test viejo sigue corriendo. Qué es y qué no es la cobertura. |
| **Testing II — pytest** | El primer test sobre **código propio**: `assert`, nombres de test, correr la suite. |
| **Testing III — pytest aplicado** | Casos borde, un **bug real** encontrado por un test, y qué hacer cuando el test tiene razón. |
| **Testing IV — la app web** | Probar rutas con el cliente de pruebas de Flask, ya con el sistema andando. |

Más el **E2E con Playwright** en noviembre, que cierra el módulo con la otra punta de la pirámide.

Que la teoría venga **antes** y el resto **sobre el proyecto propio** no es casual: un test sobre
código ajeno de ejemplo se olvida; un test que atrapa un bug en el sistema que estás construyendo,
no.

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
| Mié 19/8 | Resolución de dudas sobre los ejercicios | ✅ dada. |
| Vie 21/8 | **Lógica: pensar como programador** | Va antes de seguir practicando: es método, y el método multiplica la práctica que viene después. |
| Mié 26/8 | **Archivos** — retomarlo en serio: leer, escribir, `with` | Quedó flojo del 8/7. Ojo: puede caer acá la **demo a preceptores**. |
| Vie 28/8 | **JSON** — leer y escribir, por qué no alcanza un `.txt` | Cierra el Bloque 3. Fecha límite de la **puesta al día**. |

> ⚠️ Archivos y JSON quedan en una clase cada uno, no dos. Se sostiene porque los dos temas ya se
> vieron una vez y porque la plataforma tiene ejercicios de ambos. Si el 26/8 se nota que Archivos
> sigue flojo, **se corre POO una clase** antes que darlo por visto: es el mismo criterio que con la
> puesta al día.

### 🏗️ Septiembre — POO y arranque del proyecto (9 clases)

| Fecha | Clase | Notas |
|---|---|---|
| Mié 2/9 | **POO I** — clases, objetos, atributos | |
| Vie 4/9 | **POO I** práctica | |
| Mié 9/9 | **POO II** — métodos, `__init__`, `__str__` | |
| Vie 11/9 | **POO II** práctica | |
| Mié 16/9 | **Herencia** — lo justo, sin `super()` avanzado | |
| Vie 18/9 | **Del prototipo al modelo**: qué clases necesita el sistema | Se les muestra el prototipo y **entre todos** se decide `Alumno`, `Curso`, `Asistencia`. |
| Mié 23/9 | **Proyecto CLI 1** — alta y listado de alumnos + **Eficiencia** | Acá cae sola: buscar un alumno entre 13 recorriendo la lista vs. buscarlo por su DNI en un diccionario. Es el momento en que "cuál solución es mejor" deja de ser abstracto. |
| Vie 25/9 | **Proyecto CLI 2** — pasar asistencia por día | |
| Mié 30/9 | **Proyecto CLI 3** — guardar en JSON | ✅ **Hito: CLI funcionando.** |

### 🧪 Octubre — Testing, entorno y web (9 clases)

| Fecha | Clase | Notas |
|---|---|---|
| Vie 2/10 | **Testing I — teoría** | Qué se prueba y por qué. Sin código todavía. |
| Mié 7/10 | **Testing II — pytest** | El primer test sobre **su** código. |
| Vie 9/10 | **Testing III — pytest aplicado** | Casos borde y un bug real cazado por un test. |
| Mié 14/10 | **Entorno** (`venv`, `requirements.txt`) + **cómo funciona la web** | Las dos son cortas y van juntas. |
| Vie 16/10 | **Flask**: rutas y plantillas | Las plantillas HTML **se entregan hechas** (la planilla ya es un molde). |
| Mié 21/10 | **Flask**: formularios — alta de alumnos por web | |
| Vie 23/10 | **Migrar el CLI a Flask I** | Refactor de código propio: la lección está acá. |
| Mié 28/10 | **Migrar el CLI a Flask II** | |
| Vie 30/10 | **SQLite** — por qué JSON deja de alcanzar con varios usuarios | |

### 🚀 Noviembre — la Expo (7 clases, 20/11 feriado)

⚠️ **La Expo es el viernes 13/11 y cae en día de clase**: se lleva puesta una de las siete.

| Fecha | Clase | Notas |
|---|---|---|
| Mié 4/11 | **SQLite II** + **login**: contraseñas hasheadas, sesiones | Nunca guardar una contraseña en texto plano. |
| Vie 6/11 | **Deploy**: subir el proyecto a PythonAnywhere | ✅ **Hito: el sistema en internet**, una semana ANTES de la Expo. |
| Mié 11/11 | **Armado del stand y ensayo** | Cargar datos de demo, repartir quién dice qué, probar todo en la máquina que va a estar en el stand. |
| **Vie 13/11** | 🏆 **EXPO CFP 2026** | |
| Mié 18/11 | **Playwright I** — Bot SiGes | Necesita las fotos del proceso de carga. |
| Mié 25/11 | **Playwright II** + testing E2E | Cierra el módulo de Testing. |
| Vie 27/11 | **IA**: qué es una API y cómo se consume | Arranca el proyecto final. |

> Por qué el deploy se adelanta al 6/11: antes estaba el 11/11, a **dos días** de la Expo. Un
> problema de última hora ahí no se arregla. Con el 6/11 hay una semana de colchón, y el 11/11
> queda para lo que de verdad necesita ser lo último: ensayar.

### 🎓 Diciembre — proyecto final (6 clases)

| Fecha | Clase | Notas |
|---|---|---|
| Mié 2/12 | **Testing IV — probar la app web** (cliente de pruebas de Flask) | Si el grupo ya lo tiene firme, se cambia por **reportes con pandas** sobre la planilla propia. |
| Vie 4/12 | **Proyecto final**: elegir tema y armar el plan | |
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
