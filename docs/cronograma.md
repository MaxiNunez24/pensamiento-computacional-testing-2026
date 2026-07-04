# 📅 Cronograma del Curso

!!! tip "Pensamiento Computacional y Testing de Aplicaciones — CFP 401"
    Curso anual para aprender a programar con buenas prácticas y desarrollar **proyectos reales**.
    Clases los **miércoles de 13:20 a 16:40** y los **viernes de 14:00 a 17:20**.

!!! info "🧭 Cómo leer este cronograma"
    En vez de una grilla fija que hay que reacomodar ante cada cambio, este cronograma tiene tres
    partes:

    - **🎯 Hitos** — las fechas importantes que (casi) no se mueven.
    - **🌍 Bloques temáticos** — qué vamos a ver en cada etapa, sin atarlo a una fecha exacta.
    - **📒 Bitácora** — lo que **realmente** dimos cada día, que se va completando clase a clase.

    Así, si un tema necesita más tiempo, no se rompe todo el cronograma: simplemente seguimos
    sumando filas a la bitácora. El ritmo lo marca el grupo. 🧬

---

## 🎯 Hitos del año

| Fecha | Hito |
|-------|------|
| 🏗️ **15 – 17/7** | **POO** (clases y objetos) antes del proyecto + **tarea para el receso** |
| ❄️ **22/7 – 1/8** | Receso invernal |
| 🚀 **Agosto (post-receso)** | Arranque del **Sistema de Asistencias** (primer proyecto, CLI) — necesita POO |
| ✅ **Agosto** | Primer hito del proyecto: versión CLI funcionando |
| 🌐 **Ago – Sep** | Migración de Asistencias a **web (Flask)** + arranque del **Bot SiGes** (segundo proyecto) |
| 🎉 **21/9** | **Nerdearla** |
| 🤖 **Mié 7/10** | Arranque del **proyecto final con IA** |
| 🏆 **9/11** | **Expo CFP 2026** |
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

!!! info "🌐 Bloque 5 — Web y Segundo Proyecto: Bot SiGes"
    Cómo funciona la web (HTTP, request/response, rutas) y **Flask** (Jinja2, formularios). Se
    **migra el Sistema de Asistencias a web**, refactorizando código propio. Después, el segundo
    proyecto: un **Bot que automatiza la carga de alumnos en SiGes** con **Playwright**, tomando los
    datos ya cargados en Asistencias. Playwright sirve además para **testing E2E** — engancha con el
    módulo de Testing.

!!! info "📊 Bloque 6 — Análisis de datos (pandas / numpy)"
    Trabajar con **datos reales**: `numpy` para cálculo numérico y `pandas` para tablas (leer,
    filtrar, agrupar, sacar estadísticas). Practicamos sobre datos que importan: la **propia planilla
    de asistencia** que generamos en el proyecto (reportes, % de asistencia) y datasets externos
    (precios de acciones, clima, etc.). Es el puente entre la persistencia que ya vimos y la IA que
    viene.

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
| Mié 11/3 | Presentación e introducción a la Informática | [📄](./clases/01_introduccion.md) |
| Vie 13/3 | ¿Qué es programar? Algoritmos, pseudocódigo, diagramas de flujo | [📄](./clases/02_que_es_programar.md) |
| Mié 18/3 | Python básico: historia, instalación, `print()` | [📄](./clases/python/01_introduccion/historia_caracteristicas.md) |
| Vie 20/3 | Continuación de `print()` e introducción a Variables | [📄](./clases/python/02_variables_y_tipos/variables.md) |
| Mié 25/3 | Variables, tipos de datos y operadores | [📄](./clases/python/02_variables_y_tipos/variables.md) |
| Vie 27/3 | La función `input()` | [📄](./clases/python/02_variables_y_tipos/funcion_input.md) |
| Mié 1/4 | Estructuras de control: `if-else` | [📄](./clases/python/03_estructuras_de_control/if_else.md) |
| Vie 3/4 | 🚫 Sin clases (Viernes Santo) | |
| Mié 8/4 | Repaso de `if-elif-else` y buenas prácticas | [📄](./clases/python/03_estructuras_de_control/if_else.md) |
| Vie 10/4 | Bucles `while` | [📄](./clases/python/03_estructuras_de_control/while.md) |
| Mié 15/4 | Bucles `for` | [📄](./clases/python/03_estructuras_de_control/for.md) |
| Vie 17/4 | Ejercicios de repaso: estructuras de control | [📄](./clases/python/03_estructuras_de_control/ejercicios_estructuras_control.md) |
| Mié 22/4 | Listas: teoría y operaciones | [📄](./clases/python/04_listas/listas.md) |
| Vie 24/4 | Listas: comprehensions y listas de listas | [📄](./clases/python/04_listas/listas.md) |

### 🌿 Bloque 2 — Colecciones y Modularización

| Fecha | Tema | |
|-------|------|--|
| Mié 29/4 | Cierre de Listas + asignación del cuadernillo del finde | [📄](./clases/python/04_listas/cuadernillo_listas_finde.md) |
| Vie 1/5 | 🚫 Sin clases (Día del Trabajador) | |
| Mié 6/5 | Repaso del cuadernillo de listas en clase | [📄](./clases/python/04_listas/cuadernillo_listas_finde.md) |
| Vie 8/5 | **Mini Parcial** | [📄](./clases/python/04_listas/mini_parcial.md) |
| Mié 13/5 | Tuplas, Sets y Diccionarios | [📄](./clases/python/05_colecciones/diccionarios.md) |
| Vie 15/5 | Funciones I: definición, parámetros, retorno | [📄](./clases/python/06_funciones/funciones_1.md) |
| Mié 20/5 | Funciones II: scope, valores por defecto, `*args`/`**kwargs` | [📄](./clases/python/06_funciones/funciones_2.md) |
| Vie 22/5 | Cómo encarar un ejercicio + Python Tutor | [📄](./clases/python/06_funciones/como_encarar_ejercicios.md) |
| Mié 27/5 | Repaso general | [📄](./clases/python/06_funciones/repaso.md) |
| Vie 29/5 | Continuación del Repaso general | [📄](./clases/python/06_funciones/repaso.md) |
| Mié 3/6 | Resolución de ejercicios variados de clases previas | |
| Vie 5/6 | 🚫 Sin clases (el profe rindió un examen de la facultad — ¡mil disculpas!). ¡Gracias por comprender! 🙏 | |
| Mié 10/6 | Lectura y corrección de código | [📄](./clases/python/06_funciones/lectura_codigo.md) |
| Vie 12/6 | Continuación de Lectura y corrección — completamos los ejercicios + la ronda de bugs al pizarrón | [📄](./clases/python/06_funciones/lectura_codigo.md) |
| Mié 17/6 | Entrada en calor: Funciones como caja negra (puente a la abstracción) | [📄](./clases/python/06_funciones/funciones_caja_negra.md) |
| Vie 19/6 | Bingo — ejercicio integrador (parte 1) | [📄](./clases/python/06_funciones/bingo.md) |
| Mié 24/6 | Bingo — ejercicio integrador (parte 2, cierre) | [📄](./clases/python/06_funciones/bingo.md) |
| Vie 26/6 | Anexo: Importar módulos (organizar el código en varios archivos) | [📄](./clases/python/06_funciones/imports_y_modulos.md) |
| Mié 1/7 | Repaso general (puente antes de arrancar Persistencia) | [📄](./clases/python/06_funciones/repaso.md) |

### 🛠️ Bloque 3 — Persistencia y Versionado

| Fecha | Tema | |
|-------|------|--|
| Vie 3/7 | Git y GitHub — llegamos a **Git local** (`init`/`add`/`commit`/`status`/`log`); GitHub quedó pendiente | [📄](./clases/python/07_persistencia/git_github.md) |
| Mié 8/7 | Repaso de Git + **terminar GitHub** (remoto, `push`/`clone`/`pull`, autenticación) | [📄](./clases/python/07_persistencia/git_github.md) |

<!-- Reshuffle (3/7): Git se llevó toda la clase (solo Git local). El 8/7 = repaso + terminar GitHub
     (una alumna había faltado). Archivos y JSON se corren y hay que re-encajarlas con POO (15-17/7)
     antes del receso (22/7). RE-PLANEAR las fechas con el profe. -->


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
