# 📅 Cronograma del Curso

<div id="clases-restantes"></div>

!!! tip "Pensamiento Computacional y Testing de Aplicaciones — CFP 401"
    Curso anual para aprender a programar con buenas prácticas y desarrollar **proyectos reales**.
    Clases los **miércoles y viernes de 13:20 a 16:40**.

!!! info "🧭 Cómo leer este cronograma"
    En vez de una grilla fija que hay que reacomodar ante cada cambio, este cronograma tiene tres
    partes:

    - **🎯 Hitos** — las fechas importantes que (casi) no se mueven.
    - **🌍 Bloques temáticos** — qué vamos a ver en cada etapa, sin atarlo a una fecha exacta.
    - **📒 Bitácora** — lo que **realmente** dimos cada día, que se va completando clase a clase.

    Así, si un tema necesita más tiempo, no se rompe todo el cronograma: simplemente seguimos
    sumando filas a la bitácora. El ritmo lo marca el grupo. 🧬

!!! note "🔀 El índice está ordenado para estudiar, no por fecha"
    Reordenamos el material para que cada clase solo use cosas ya vistas: **Listas** pasó antes que
    **Bucles** (un `for` necesita algo que recorrer) y **Funciones I** antes que las colecciones.
    Por eso el orden del [índice de clases](./clases/clases.md) no coincide con el de la **bitácora**
    de acá abajo, que es el registro de lo que dimos cada día y **no se toca**. Para repasar, seguí
    el índice; para recordar qué vimos tal fecha, mirá la bitácora.

---

## 🎯 Hitos del año

| Fecha | Hito |
|-------|------|
| ❄️ **22/7 – 1/8** | Receso invernal *(pasado)* |
| 🔁 **Agosto** | Vuelta del receso: **repaso y práctica** en la plataforma, y cierre de **Archivos y JSON** |
| 🏗️ **Septiembre** | **POO** y arranque del **Sistema de Asistencias** (primer proyecto, CLI) |
| 🎉 **24 y 26/9** | **Nerdearla** — salida educativa al Ciudad Cultural Konex. (El evento va del 22 al 26; el 22 y 23 son online y lo presencial arranca el jueves 24.) |
| ✅ **Mié 30/9** | Segundo hito: **Sistema de Asistencias en CLI**, guardando en JSON |
| 🧪 **Oct** | **Testing** (teoría + `pytest` sobre el proyecto) y migración del sistema a **web (Flask)** |
| 🚀 **Vie 6/11** | Tercer hito: **el sistema andando en la red del CFP**, usable desde el celular de cualquiera conectado al wifi del centro |
| 🏆 **Vie 13/11** | **Expo CFP 2026** — presentamos el **Sistema de Asistencias** 🎪 |
| 🤖 **Mié 25/11** | Arranque del **proyecto final con IA** |
| 🎓 **Vie 18/12** | Última clase y celebración de cierre |

---

## 🌍 Bloques temáticos

!!! success "🌱 Bloque 1 — Fundamentos *(ya cursado)*"
    Presentación del curso, qué es la informática y qué es programar (algoritmos, pseudocódigo,
    diagramas de flujo), Python básico, variables y tipos, operadores, estructuras de control
    (`if`/`while`/`for`) y listas (incluyendo list comprehensions y listas de listas).

!!! success "🌿 Bloque 2 — Colecciones y Modularización *(ya cursado)*"
    El resto de las colecciones (tuplas, sets, diccionarios) y **cuándo usar cada una**.
    Modularización con **funciones** (parámetros, retorno, scope, `*args`/`**kwargs` a nivel
    concepto). Clases puente de repaso y lectura de código, e integrador (**Bingo**).

!!! info "🛠️ Bloque 3 — Persistencia y Versionado"
    Guardar y leer datos entre ejecuciones con **archivos y JSON**. Workflow básico de **Git y
    GitHub** (init/add/commit/status/log/push/clone/pull) para versionar el código y continuarlo en
    casa. Se introduce antes del primer proyecto.

!!! info "🏗️ Bloque 4 — POO y Primer Proyecto: Sistema de Asistencias"
    **POO**: clases, objetos, atributos, métodos, `__init__`, encapsulamiento, `__str__`/`__repr__`,
    herencia y polimorfismo. Primer **proyecto real**: el **Sistema de Asistencias del CFP**, que
    reemplaza el flujo actual (formulario → planilla a mano). Se construye primero en **CLI** (para
    clavar el dominio) y respeta el **formato oficial** del centro. **Testing con `pytest`** sobre
    código propio, entrelazado con el proyecto.

    👉 El prototipo del sistema ya se puede **[ver y probar](./proyecto/index.md)**.

!!! info "🌐 Bloque 5 — Web y Segundo Proyecto: Bot SiGes"
    Cómo funciona la web (HTTP, request/response, rutas) y **Flask** (Jinja2, formularios). Se
    **migra el Sistema de Asistencias a web**, refactorizando código propio. Después, el segundo
    proyecto: un **Bot que automatiza la carga de alumnos en SiGes** con **Playwright**, tomando los
    datos ya cargados en Asistencias. Playwright sirve además para **testing E2E** — engancha con el
    módulo de Testing.

!!! info "🧪 Bloque 6 — Testing (teórico y aplicado)"
    **Testing está en el nombre del curso**, así que tiene su propio bloque. Primero la **teoría**:
    por qué se prueba, qué es un caso de prueba, la diferencia entre prueba **unitaria**, de
    **integración** y **E2E**, qué es una regresión y qué mide (y qué no) la cobertura. Después,
    **`pytest` aplicado al proyecto propio**: el primer test, los casos borde, un bug real cazado
    por un test, y las pruebas de la app web. El **E2E con Playwright** cierra el bloque y se
    engancha con el Bot SiGes.

!!! note "📊 Optativo — Análisis de datos (pandas / numpy)"
    Si el tiempo alcanza: `pandas` para sacar **reportes de la propia planilla de asistencia** que
    generamos en el proyecto (porcentajes, faltas, estadísticas). Es contenido lindo, pero va
    después de terminar bien el proyecto y el testing.

!!! info "🤖 Bloque 7 — IA y Proyecto Final"
    Qué es una **API de IA** y cómo consumirla desde Python; integrar modelos de lenguaje o visión.
    **Proyecto final original** a elección de cada alumno o equipo, presentado en la **Expo CFP**.

---

## 📒 Bitácora de clases dadas { #bitacora }

!!! note "Se completa clase a clase"
    Registro de lo que efectivamente vimos cada día. Crece hacia abajo: cada clase nueva es una fila
    más, sin tener que reacomodar nada.

### 🌱 Bloque 1 — Fundamentos

| Fecha | Tema | |
|-------|------|--|
| Mié 11/3 | Presentación e introducción a la Informática | [📄](./clases/introduccion/01_introduccion.md) |
| Vie 13/3 | ¿Qué es programar? Algoritmos, pseudocódigo, diagramas de flujo | [📄](./clases/introduccion/02_que_es_programar.md) |
| Mié 18/3 | Python básico: historia, instalación, `print()` | [📄](./clases/bloque_1_fundamentos/historia_caracteristicas.md) |
| Vie 20/3 | Continuación de `print()` e introducción a Variables | [📄](./clases/bloque_1_fundamentos/variables.md) |
| Mié 25/3 | Variables, tipos de datos y operadores | [📄](./clases/bloque_1_fundamentos/variables.md) |
| Vie 27/3 | La función `input()` | [📄](./clases/bloque_1_fundamentos/funcion_input.md) |
| Mié 1/4 | Estructuras de control: `if-else` | [📄](./clases/bloque_1_fundamentos/if_else.md) |
| Vie 3/4 | 🚫 Sin clases (Viernes Santo) | |
| Mié 8/4 | Repaso de `if-elif-else` y buenas prácticas | [📄](./clases/bloque_1_fundamentos/if_else.md) |
| Vie 10/4 | Bucles `while` | [📄](./clases/bloque_1_fundamentos/while.md) |
| Mié 15/4 | Bucles `for` | [📄](./clases/bloque_1_fundamentos/for.md) |
| Vie 17/4 | Ejercicios de repaso: estructuras de control | [📄](./clases/bloque_1_fundamentos/ejercicios_estructuras_control.md) |
| Mié 22/4 | Listas: teoría y operaciones | [📄](./clases/bloque_1_fundamentos/listas.md) |
| Vie 24/4 | Listas: comprehensions y listas de listas | [📄](./clases/bloque_1_fundamentos/listas.md) |

### 🌿 Bloque 2 — Colecciones y Modularización

| Fecha | Tema | |
|-------|------|--|
| Mié 29/4 | Cierre de Listas + asignación del cuadernillo del finde | [📄](./clases/bloque_1_fundamentos/cuadernillo_listas_finde.md) |
| Vie 1/5 | 🚫 Sin clases (Día del Trabajador) | |
| Mié 6/5 | Repaso del cuadernillo de listas en clase | [📄](./clases/bloque_1_fundamentos/cuadernillo_listas_finde.md) |
| Vie 8/5 | **Mini Parcial** | [📄](./clases/bloque_1_fundamentos/mini_parcial.md) |
| Mié 13/5 | Tuplas, Sets y Diccionarios | [📄](./clases/bloque_2_funciones_y_colecciones/diccionarios.md) |
| Vie 15/5 | Funciones I: definición, parámetros, retorno | [📄](./clases/bloque_2_funciones_y_colecciones/funciones_1.md) |
| Mié 20/5 | Funciones II: scope, valores por defecto, `*args`/`**kwargs` | [📄](./clases/bloque_2_funciones_y_colecciones/funciones_2.md) |
| Vie 22/5 | Cómo encarar un ejercicio + Python Tutor | [📄](./clases/bloque_2_funciones_y_colecciones/como_encarar_ejercicios.md) |
| Mié 27/5 | Repaso general | [📄](./clases/bloque_2_funciones_y_colecciones/repaso.md) |
| Vie 29/5 | Continuación del Repaso general | [📄](./clases/bloque_2_funciones_y_colecciones/repaso.md) |
| Mié 3/6 | Resolución de ejercicios variados de clases previas | |
| Vie 5/6 | 🚫 Sin clases (el profe rindió un examen de la facultad — ¡mil disculpas!). ¡Gracias por comprender! 🙏 | |
| Mié 10/6 | Lectura y corrección de código | [📄](./clases/bloque_2_funciones_y_colecciones/lectura_codigo.md) |
| Vie 12/6 | Continuación de Lectura y corrección — completamos los ejercicios + la ronda de bugs al pizarrón | [📄](./clases/bloque_2_funciones_y_colecciones/lectura_codigo.md) |
| Mié 17/6 | Entrada en calor: Funciones como caja negra (puente a la abstracción) | [📄](./clases/bloque_2_funciones_y_colecciones/funciones_caja_negra.md) |
| Vie 19/6 | Bingo — ejercicio integrador (parte 1) | [📄](./clases/bloque_2_funciones_y_colecciones/bingo.md) |
| Mié 24/6 | Bingo — ejercicio integrador (parte 2, cierre) | [📄](./clases/bloque_2_funciones_y_colecciones/bingo.md) |
| Vie 26/6 | Anexo: Importar módulos (organizar el código en varios archivos) | [📄](./clases/bloque_2_funciones_y_colecciones/imports_y_modulos.md) |
| Mié 1/7 | Repaso general (puente antes de arrancar Persistencia) | [📄](./clases/bloque_2_funciones_y_colecciones/repaso.md) |

### 🛠️ Bloque 3 — Persistencia y Versionado

| Fecha | Tema | |
|-------|------|--|
| Vie 3/7 | Git y GitHub — llegamos a **Git local** (`init`/`add`/`commit`/`status`/`log`); GitHub quedó pendiente | [📄](./clases/bloque_3_persistencia/git_github.md) |
| Mié 8/7 | Repaso de Git/GitHub + **Manejo de archivos** (faltaron varios alumnos) | [📄](./clases/bloque_3_persistencia/archivos.md) |
| Vie 10/7 | 🚫 Sin clases (feriado) | |
| Mié 15/7 | 💻 **Clase virtual por Discord** (13:20 a 16:00, acortada por el partido de Argentina ⚽): checkpoint de **Git/GitHub desde casa** + **del enunciado al programa** (comprensión de problemas) | [📄](./clases/bloque_2_funciones_y_colecciones/del_enunciado_al_programa.md) |
| Vie 17/7 | 🧺 **Picnic de cierre antes del receso** + cerramos **Git y GitHub** de una vez por todas (`push`/`clone`/`pull`, el flujo CFP ↔ casa) | [📄](./clases/bloque_3_persistencia/git_github.md) |
| 22/7 – 1/8 | ❄️ **Receso invernal** | |

### 🔁 Vuelta del receso — repaso y práctica

!!! tip "Por qué cuatro clases de práctica seguidas"
    Al volver del receso el grupo venía de tres semanas sin escribir código, y **Archivos** había
    quedado flojo (se dio el 8/7 con varios ausentes). En vez de arrancar con tema nuevo,
    dedicamos estas clases a **resolver ejercicios en la plataforma**, que es donde de verdad se
    fija lo aprendido. Los alumnos siguen sumando ejercicios desde casa.

| Fecha | Tema | |
|-------|------|--|
| Mié 5/8 | Vuelta del receso: repaso general y resolución de ejercicios en la plataforma | [💻](https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/) |
| Vie 7/8 | Práctica en la plataforma: `print`, variables, `input` y condicionales | [💻](https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/) |
| Mié 12/8 | Práctica en la plataforma: listas y condicionales + **Mini Parcial** | [📄](./clases/bloque_1_fundamentos/mini_parcial.md) |
| Vie 14/8 | Práctica en la plataforma: **bucles** (`while` y `for`) | [💻](https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/clases/bucles/) |
| Mié 19/8 | Resolución de dudas sobre los ejercicios | [💻](https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/al-dia/) |
| Vie 21/8 | Consulta y resolución de ejercicios | [💻](https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/al-dia/) |
| Mié 26/8 | **Elicitación de requerimientos**: lluvia de ideas sobre el sistema y preparación de la demo | [🗺️](https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/proyecto/) |
| Vie 28/8 | Consultas sobre el **sistema de asistencias** y sobre los ejercicios de la plataforma. Se firmaron el acta por el **cambio de horario de los viernes** y la autorización de la **salida educativa a Nerdearla**. *(Archivos quedó para más adelante.)* | [💻](https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/al-dia/) |

<!-- Plan post-receso (definido 1/8):
     El 17/7 se usó para cerrar Git/GitHub (quedó COMPLETO ✅) + picnic de cierre.
     ARCHIVOS quedó flojo: se dio el 8/7 con varios alumnos ausentes y el grupo se perdió bastante.
     Por eso al volver NO arrancamos con tema nuevo:
       1. Mié 5/8  → retomar ARCHIVOS (repaso + práctica, que es lo que faltó)
       2. luego    → JSON, y con eso cierra el Bloque 3
       3. después  → POO a full, entrelazado con el Sistema de Asistencias (Bloque 4) -->


---

## 🧪 Notas finales

!!! warning "📐 Esto es una guía, no un dogma"
    El cronograma se ajusta al ritmo del grupo. Si un tema necesita más tiempo, lo dedicamos. Si
    avanzamos rápido, sumamos contenido extra (testing más avanzado, decoradores, programación
    funcional, etc.).

!!! tip "🎯 Filosofía pedagógica"
    - 🛠️ **Construir cosas reales** por encima de acumular teoría.
    - 🔄 **Refactorizar código propio** por encima de escribir siempre código nuevo.
    - 🧪 **Aprender herramientas (Git, testing) en contexto**, no como bloques aislados.
    - 🚀 Que cada alumno termine el año con **proyectos completos en GitHub** y un proyecto final propio.

!!! info "💬 Dudas y feedback"
    Si algo no se entiende o querés proponer cambios, escribilo en el grupo o charlémoslo en clase.
    Esto se construye entre todos 🧬.
