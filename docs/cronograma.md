# 📅 Cronograma del Curso

!!! tip "Pensamiento Computacional y Testing de Aplicaciones — CFP 401"
    Curso anual de **73 clases × 3:20hs ≈ 240hs** para aprender a programar con buenas prácticas y desarrollar **proyectos reales**. Las clases son los **miércoles de 13:20 a 16:40** y los **viernes de 14:00 a 17:20**.

!!! info "📌 Sobre esta nueva versión del cronograma"
    Esta es la **reorganización oficial** post Mini Parcial (11/5/2026). Ajustes respecto al plan anterior:

    - 📒 **El 6/5** se dedicó a repasar el cuadernillo de listas en lugar de arrancar Diccionarios.
    - 📝 **El 8/5** tomamos el Mini Parcial en lugar de continuar con Diccionarios.
    - 🎲 **Tuplas, Sets y Diccionarios** se dan juntos en una sola clase el 13/5.
    - 🔄 **POO se mueve después de funciones y archivos** (no antes), para que llegue con contexto y ejemplos significativos.
    - 🆕 **Git y GitHub se introducen ANTES del primer proyecto** para que puedan continuar el trabajo en sus casas.
    - 🚀 **Primer proyecto integrador**: Sistema de Asistencias del CFP (CLI con persistencia JSON), después de POO y antes de frameworks web.
    - 🧪 **Testing con `pytest`** entrelazado con el proyecto, no como bloque suelto.
    - 🌐 **Frameworks web pateados** para después del primer proyecto, como migración del Sistema de Asistencias a web.

---

## 🗺️ Vista general del año

### 🌍 Bloques temáticos del año

| Bloque | Período | Foco |
|--------|---------|------|
| **🌱 Bloque 1 — Fundamentos** | Mar–Abr | Algoritmos, Python básico, control de flujo, listas |
| **🌿 Bloque 2 — Colecciones y Modularización** | May | Tuplas, sets, diccionarios, funciones |
| **🛠️ Bloque 3 — Persistencia y Versionado** | May | Archivos, JSON, Git/GitHub |
| **🏗️ Bloque 4 — POO y Primer Proyecto** | May–Jul | POO + Sistema de Asistencias del CFP |
| **❄️ Receso invernal** | Jul–Ago | — |
| **🌐 Bloque 5 — Web y Segundo Proyecto** | Ago–Sep | Flask + Bolsa de Trabajo |
| **🤖 Bloque 6 — IA y Proyecto Final** | Sep–Nov | IA, APIs, proyecto final, Nerdearla y Expo |
| **🎓 Cierre** | Dic | Presentación y despedida |

### 🎯 Hitos del año

| Fecha | Hito |
|-------|------|
| 🚀 **Mié 17/6** | Arranque del **Sistema de Asistencias** (primer proyecto) |
| ✅ **Vie 17/7** | Cierre del primer proyecto en CLI |
| 🌐 **Vie 28/8** | Segundo proyecto: bolsa de trabajo (web) |
| 🎉 **21/9** | **Nerdearla** |
| 🤖 **Mié 7/10** | Arranque del proyecto final con IA |
| 🏆 **9/11** | **Expo CFP 2026** |
| 🎓 **Vie 18/12** | Última clase y celebración de cierre |

---

## 🌱 Bloque 1 — Fundamentos *(ya cursado)*

!!! success "✅ Estado: completado al 8/5/2026 (Mini Parcial)"
    Este bloque cubrió desde la presentación del curso hasta listas. List comprehensions y listas de listas se reforzaron con el cuadernillo del finde largo (revisado en clase el 6/5) y evaluados en el Mini Parcial del 8/5.

| Semana | Miércoles | Viernes | Práctica |
|--------|-----------|---------|----------|
| 9/3 | [Presentación e introducción a la Informática](./clases/01_introduccion.md) | [¿Qué es programar? Algoritmos, Pseudocódigo, Diagramas de flujo](./clases/02_que_es_programar.md) | Identificar partes de una PC, resolver problemas paso a paso |
| 16/3 | [Python Básico: historia, instalación, `print()`](./clases/python/historia_caracteristicas.md) | [Continuación de `print()` e introducción a Variables](./clases/python/variables.md) | Resolver problemas sencillos con Python |
| 23/3 | [Variables, tipos de datos y operadores](./clases/python/variables.md) | [La función `input()`](./clases/python/funcion_input.md) | Datos ingresados por el usuario y control de flujo básico |
| 30/3 | [Estructuras de Control (`if-else`)](./clases/python/if_else.md) | 🚫 *Sin clases (Viernes Santo)* | Problemas con condicionales |
| 6/4 | [Repaso de `if-else-elif` y buenas prácticas](./clases/python/if_else.md) | [Bucles `while`](./clases/python/while.md) | Programas con bucles y control de flujo avanzado |
| 13/4 | [Bucles `for`](./clases/python/for.md) | [Ejercicios de repaso: Estructuras de Control](./clases/python/ejercicios_estructuras_control.md) | Buenas prácticas en control de flujo |
| 20/4 | [Listas: parte teórica y operaciones](./clases/python/listas.md) | [Listas: list comprehensions y listas de listas](./clases/python/listas.md) | Recorridos, transformaciones, matrices |

---

## 🌿 Bloque 2 — Colecciones y Modularización

!!! info "🎯 Objetivos del bloque"
    Que los alumnos:

    - 🧰 Conozcan el **resto de las colecciones** de Python (tuplas, sets, diccionarios) y entiendan **cuándo usar cada una**.
    - 🧱 Sepan **modularizar** programas con funciones bien diseñadas.
    - 📐 Entiendan los conceptos de **scope**, **parámetros** y **valor de retorno**.

| Semana | Miércoles | Viernes | Práctica |
|--------|-----------|---------|----------|
| 27/4 | ✅ Cierre de [Listas](./clases/python/listas.md) — asignación del [cuadernillo](./clases/python/cuadernillo_listas_finde.md) | 🚫 *Sin clases (1/5 — Día del Trabajador)* | 📒 [Cuadernillo de listas](./clases/python/cuadernillo_listas_finde.md) durante el finde largo |
| 4/5 | ✅ Repaso del [Cuadernillo de Listas](./clases/python/cuadernillo_listas_finde.md) en clase | ✅ [Mini Parcial](./clases/python/mini_parcial.md) | — |
| 11/5 | 🎲 [**Tuplas, Sets**](./clases/python/tuplas_sets.md) **y Diccionarios** | 📦 **Funciones I**: definición, parámetros, retorno | Ejercicios de funciones |
| 18/5 | 📦 **Funciones II**: scope, valores por defecto, `*args`/`**kwargs` | 🧪 Práctica integradora de funciones | Refactorizar programas anteriores con funciones |

!!! tip "🧪 Detalle pedagógico"
    En **Funciones II** se introduce `*args`/`**kwargs` *de manera suave* (solo concepto y un ejemplo), no se profundiza. El objetivo es que les suene cuando lo vean en código de terceros.

---

## 🛠️ Bloque 3 — Persistencia y Versionado

!!! info "🎯 Objetivos del bloque"
    Que los alumnos:

    - 💾 Sepan **guardar y leer datos** entre ejecuciones del programa, usando **JSON**.
    - 🌳 Manejen un **workflow básico de Git** (`init`, `add`, `commit`, `status`, `log`, `push`, `clone`, `pull`).
    - 🐙 Tengan una **cuenta de GitHub funcional** y un repositorio personal del curso.

| Semana | Miércoles | Viernes | Práctica |
|--------|-----------|---------|----------|
| 25/5 | [💾 **Manejo de archivos**: lectura, escritura, modos](./clases/python/archivos.md) | [📋 **JSON**: serialización, deserialización, `json.dump`/`json.load`](./clases/python/json.md) | Programa que persista datos en JSON |
| 1/6 | 🌳🐙 **Git + GitHub** (clase combinada — 3h20m): workflow esencial, clone/pull, repositorios, README | — | Subir todos los programas del curso al repo personal |

!!! tip "🤐 Git + GitHub en una sola clase (3h20m)"
    Combinamos ambas en una única sesión aprovechando la duración: **primera mitad** Git local (init/add/commit/status/log), **break**, **segunda mitad** GitHub (remote/push/clone/pull/README). NO vamos a ver branches, merges, conflictos ni PRs. Solo el workflow mínimo para que puedan versionar el primer proyecto y continuar el código en sus casas.

---

## 🏗️ Bloque 4 — POO y Primer Proyecto

!!! info "🎯 Objetivos del bloque"
    Que los alumnos:

    - 🧬 Entiendan **clases, objetos, atributos, métodos y constructores**.
    - 🛡️ Apliquen **encapsulamiento** y métodos especiales (`__str__`, `__repr__`, `__init__`).
    - 🚀 Construyan **un proyecto real**: Sistema de Asistencias del CFP, integrando todo lo visto.
    - 🧪 Escriban **tests automatizados con `pytest`** sobre código propio.

### 📚 Sub-bloque 4.1 — POO esencial

| Semana | Miércoles | Viernes | Práctica |
|--------|-----------|---------|----------|
| 1/6 | *(Git + GitHub — ver Bloque 3)* | [🧬 **POO I**: clases, objetos, `__init__`, atributos y métodos](./clases/python/poo_1.md) | Modelar entidades del mundo real |
| 8/6 | [🛡️ **POO II**: encapsulamiento, `__str__`, `__repr__`, métodos especiales](./clases/python/poo_2.md) | [🔗 **Herencia y polimorfismo**: subclases, `super()`, override de métodos](./clases/python/poo_herencia.md) | Diseñar jerarquías de clases |

### 🚀 Sub-bloque 4.2 — Proyecto: Sistema de Asistencias del CFP

!!! example "🎯 Descripción del proyecto"
    Aplicación de **consola (CLI)** que permite registrar la asistencia de los alumnos a las clases del CFP. Debe permitir:

    - Cargar un **listado de alumnos** y un **listado de clases**.
    - Registrar **asistencia / inasistencia** por alumno y clase.
    - Calcular **porcentaje de asistencia** por alumno y por clase.
    - **Persistir** los datos en JSON entre ejecuciones.
    - Exponer un **menú interactivo** por consola.

| Semana | Miércoles | Viernes | Avance del proyecto |
|--------|-----------|---------|---------------------|
| 15/6 | [📐 **Análisis del problema**: requisitos, flujo, casos de uso](./clases/proyecto_asistencias/01_analisis.md) | [🏗️ **Modelado de clases**: `Alumno`, `Clase`, `Asistencia`, `RegistroAsistencias`](./clases/proyecto_asistencias/02_modelado.md) | Diagrama de clases y esqueleto |
| 22/6 | [💾 **Persistencia con JSON**: guardar y cargar el estado](./clases/proyecto_asistencias/03_persistencia.md) | [🖥️ **CLI**: menú interactivo y validaciones](./clases/proyecto_asistencias/04_cli.md) | Versión funcional con persistencia |
| 29/6 | [🔄 **Refactor** y mejoras de diseño](./clases/proyecto_asistencias/05_refactor.md) | [🧪 **Testing con `pytest`**: primeros tests sobre el proyecto](./clases/proyecto_asistencias/06_testing.md) | Tests cubriendo lógica de negocio |
| 6/7 | [🧪 **Más testing**: edge cases, fixtures, parametrización](./clases/proyecto_asistencias/07_testing_avanzado.md) | 🚫 *Sin clases (10/7 — feriado turístico Independencia)* | Suite de tests sólida |
| 13/7 | [🐛 **Debugging, excepciones y relaciones entre objetos**](./clases/python/excepciones.md) | [🎁 **Cierre del Sistema de Asistencias**: documentación, README, demo + Retrospectiva](./clases/proyecto_asistencias/08_cierre.md) | Proyecto completo en GitHub |

!!! tip "🧠 ¿Por qué testing DESPUÉS de tener algo funcionando?"
    Pedagógicamente, escribir tests sobre **código que ya existe y se entiende** es mucho más significativo que escribir tests sobre ejercicios artificiales. Acá ustedes ya saben qué hace su código → ahora aprenden a verificarlo automáticamente. Es el momento perfecto, aunque en la realidad primero se realizan los tests y después se desarrolla el código (Test Driven Development / TDD).

!!! info "📐 Estructura del bloque POO"
    - **Herencia** se ve junto con POO (antes del proyecto) porque es un concepto fundamental que los alumnos necesitan para diseñar bien las clases del proyecto.
    - **Relaciones entre objetos** (composición, agregación) se ven al final del proyecto, refactorizando código que ya escribieron. Eso da contexto real y evita el trauma típico de "composición por la composición misma".

---

## ❄️ Receso invernal

| Semana | Miércoles | Viernes |
|--------|-----------|---------|
| 20/7 | 🚫 *Receso invernal (22/7)* | 🚫 *Receso invernal (24/7)* |
| 27/7 | 🚫 *Receso invernal (29/7)* | 🚫 *Receso invernal (31/7)* |

!!! tip "🧘 Para mantener el ritmo en el receso"
    Se les propondrá un **mini-desafío opcional** del estilo "agregale una feature al Sistema de Asistencias" para que los más entusiasmados sigan tocando código.

---

## 🌐 Bloque 5 — Web y Segundo Proyecto

!!! info "🎯 Objetivos del bloque"
    Que los alumnos:

    - 🌐 Entiendan **cómo funciona la web** (request/response, HTTP, rutas).
    - 🍶 Construyan **una aplicación web con Flask**.
    - 🚀 Migren el Sistema de Asistencias a web (mismo dominio del problema, nuevo frontend).
    - 💼 Construyan un **segundo proyecto desde cero**: una bolsa de trabajo.

| Semana | Miércoles | Viernes | Práctica |
|--------|-----------|---------|----------|
| 3/8 | [🌐 **Cómo funciona la web**: HTTP, request/response, rutas](./clases/python/web_intro.md) | [🍶 **Flask I**: instalación, primera app, rutas básicas](./clases/python/flask_1.md) | App "Hola Mundo" web funcionando |
| 10/8 | [🍶 **Flask II**: templates con Jinja2, formularios](./clases/python/flask_2.md) | [🍶 **Flask III**: persistencia con JSON, manejo de estado](./clases/python/flask_3.md) | Mini-app de notas web |
| 17/8 | [🚀 **Migración del Sistema de Asistencias a Flask**: planificación](./clases/proyecto_asistencias_web/01_plan.md) | [🚀 **Migración**: rutas y vistas](./clases/proyecto_asistencias_web/02_rutas.md) | Asistencias web funcional |
| 24/8 | [💼 **Bolsa de Trabajo**: análisis y diseño](./clases/proyecto_bolsa/01_analisis.md) | [💼 **Bolsa de Trabajo**: modelado e inicio](./clases/proyecto_bolsa/02_modelado.md) | Esqueleto del proyecto |
| 31/8 | [💼 **Bolsa**: rutas, vistas, lógica](./clases/proyecto_bolsa/03_rutas.md) | [💼 **Bolsa**: persistencia y autenticación básica](./clases/proyecto_bolsa/04_auth.md) | Versión funcional |
| 7/9 | [💼 **Bolsa**: refinamiento y testing](./clases/proyecto_bolsa/05_refinamiento.md) | [💼 **Bolsa**: cierre y deploy local](./clases/proyecto_bolsa/06_cierre.md) | Proyecto cerrado |

---

## 🎉 Nerdearla

| Semana | Miércoles | Viernes | Práctica |
|--------|-----------|---------|----------|
| 14/9 | [🎤 **Preparación para Nerdearla**: cómo aprovechar el evento](./clases/extra/preparacion_nerdearla.md) | [🌟 **Portfolio, GitHub y LinkedIn**](./clases/extra/portfolio.md) | Preparar perfil profesional |
| 21/9 | 🎉 **¡¡NERDEARLA!!** | 🎉 **¡¡NERDEARLA!!** | Asistir y tomar notas |
| 28/9 | [💡 **Reflexión sobre Nerdearla**: lo que vimos, ideas](./clases/extra/reflexion_nerdearla.md) | [🚀 **Brainstorm**: qué proyecto final querés hacer](./clases/extra/brainstorm_proyecto_final.md) | Definir proyecto final |

---

## 🤖 Bloque 6 — IA y Proyecto Final

!!! info "🎯 Objetivos del bloque"
    Que los alumnos:

    - 🤖 Entiendan qué es **una API de IA** y cómo consumirla desde Python.
    - 🔌 Sepan integrar **modelos de lenguaje** o **visión por computadora** en un programa propio.
    - 🏆 Construyan un **proyecto final original** que integre todo lo aprendido.

### 🤖 Sub-bloque 6.1 — Introducción a IA

| Semana | Miércoles | Viernes | Práctica |
|--------|-----------|---------|----------|
| 5/10 | [🤖 **Introducción a IA**: conceptos, modelos de lenguaje, prompts](./clases/python/ia_intro.md) | [🔌 **APIs de IA**: cómo consumir una API REST desde Python](./clases/python/apis_ia.md) | Primer programa que llame a una IA |

### 🏆 Sub-bloque 6.2 — Proyecto Final con IA

!!! example "🎯 Posibilidades para el proyecto final"
    Cada alumno o equipo elige su rumbo:

    - 🤖 **Asistente conversacional** sobre algún dominio (recetas, programación, etc.).
    - 👁️ **Clasificador de imágenes** con un modelo pre-entrenado.
    - 📝 **Resumidor / corrector** de textos con LLM.
    - 🎨 **Generador creativo** (cuentos, ideas de proyectos, etc.).
    - 🎯 **Cualquier idea propia** que integre IA + lo aprendido.

| Semana | Miércoles | Viernes | Avance |
|--------|-----------|---------|--------|
| 12/10 | [🏆 **Proyecto final**: definición y diseño](./clases/proyecto_final/01_diseno.md) | [🏆 **Proyecto final**: setup, primeras pruebas](./clases/proyecto_final/02_setup.md) | Esqueleto |
| 19/10 | [🏆 **Proyecto final**: lógica core](./clases/proyecto_final/03_logica.md) | [🏆 **Proyecto final**: integración con IA](./clases/proyecto_final/04_integracion.md) | Versión alpha |
| 26/10 | [🏆 **Proyecto final**: refinamiento](./clases/proyecto_final/05_refinamiento.md) | [🏆 **Proyecto final**: testing y manejo de errores](./clases/proyecto_final/06_testing.md) | Versión beta |
| 2/11 | [🎤 **Preparación para Expo**: storytelling y presentación](./clases/extra/preparacion_expo.md) | [🎤 **Ensayo de presentaciones**](./clases/extra/ensayo_expo.md) | Demo lista |
| 9/11 | 🏆 **EXPO CFP 2026** | 🏆 **EXPO CFP 2026** | Presentar al público |

---

## 🎓 Cierre del año

| Semana | Miércoles | Viernes | Práctica |
|--------|-----------|---------|----------|
| 16/11 | [💡 **Reflexión sobre la Expo**: feedback y mejoras](./clases/extra/reflexion_expo.md) | [🛠️ **Mejoras finales** al proyecto](./clases/proyecto_final/07_mejoras.md) | Pulido |
| 23/11 | [🛠️ **Proyecto final**: ajustes](./clases/proyecto_final/07_mejoras.md) | [📚 **Documentación final**](./clases/proyecto_final/08_documentacion.md) | README + demo |
| 30/11 | [🎁 **Preparación de entrega**](./clases/proyecto_final/09_entrega.md) | [🎁 **Entrega del proyecto final**](./clases/proyecto_final/09_entrega.md) | Entrega oficial |
| 7/12 | [🎤 **Ensayo final**: presentación interna](./clases/proyecto_final/10_ensayo.md) | [🎤 **Presentaciones internas**](./clases/proyecto_final/10_ensayo.md) | Cada uno presenta |
| 14/12 | 🎉 **¡Anteúltima clase!** Repaso del año | 🎓 **¡ÚLTIMA CLASE!** Despedida y celebración | 🍕 Salida grupal |
| 21/12 | 🎄 **¡Felices Fiestas!** | 🎄 **¡Felices Fiestas!** | Descanso merecido 🧘 |

---

## 🧪 Notas finales

!!! warning "📐 Esto es una guía, no un dogma"
    El cronograma puede ajustarse según el ritmo del grupo. Si un tema necesita más tiempo, se reorganiza. Si avanzamos rápido, podemos agregar contenido extra (testing más avanzado, programación funcional, decoradores, async, etc.).

!!! tip "🎯 Filosofía pedagógica"
    Este cronograma prioriza:

    - 🛠️ **Construir cosas reales** sobre acumular teoría.
    - 🔄 **Refactorizar código propio** sobre escribir código nuevo siempre.
    - 🧪 **Aprender herramientas (Git, testing) en contexto** sobre verlas como bloques aislados.
    - 🚀 **Que cada alumno termine el año con dos proyectos completos en GitHub** y un proyecto final con IA propio.

!!! info "💬 Dudas y feedback"
    Si algo del cronograma no se entiende o querés proponer cambios, **escribilo en el grupo** o charlemoslo en clase. Esto se construye entre todos 🧬.