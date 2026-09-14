# Guiones de videos de repaso

Videos cortos (~5 min) por tema. Cada archivo es un guión completo listo para grabar.

## ✍️ Cómo se escribe un guion

Los cuatro bloques que tiene cada sección, en este orden:

| Bloque | Qué es |
|---|---|
| ```` ```python ```` | **Lo que se escribe en pantalla.** Se copia y pega, o se tipea en vivo |
| Texto en `>` | **Lo que se dice, ya redactado.** Se lee tal cual |
| 📌 **Y esto queda escrito** | El resumen **en comentarios de Python**, para pegar en pantalla *después* de explicar |
| *(entre paréntesis)* | **Acotaciones para quien graba**, que no se leen: *(Ejecutar con SOLO esto)*, *(💡 Nuevo: …)* |

### Por qué cada uno

**La narración va escrita entera, no resumida.** Un guion con las ideas sueltas
obliga a improvisar la explicación, y eso se va por las ramas y revienta la
duración que dice el título. Si está redactado, se lee y sale.

**El resumen va DESPUÉS de la explicación, nunca antes.** Al revés, leen el
resumen y dejan de escuchar.

**El resumen va como comentarios de Python** porque se pega en el mismo editor
donde se está programando, sin cambiar de ventana ni romper el hilo. Y así los
que toman apuntes lo tienen a la vista para copiar.

**Lo nuevo se avisa dos veces, y en dos lugares distintos.** Si un ejemplo usa
algo que el curso todavía no dio:

1. Una **acotación entre paréntesis** para quien graba: *(💡 Nuevo: `ljust()` no
   se dio en el curso.)* Eso **no se lee**.
2. Y la explicación **dentro de la narración**, dicha al alumno como cualquier
   otra cosa.

Lo que **no** va es escribir la explicación en el bloque `>` en modo "acordate de
aclarar esto": ahí el texto le habla a quien graba en medio de lo que tiene que
leer en voz alta, y le corta el hilo. Pasó con `ljust()` en el primer guion.

Y cuando se pueda, **atar lo nuevo con lo que sí vieron**. `ljust()` nunca se
dio, pero la alineación con f-strings (`<`, `>`, `^`) sí: son equivalentes
exactas, y decirlo convierte un tema nuevo en uno que ya sabían escrito de otra
forma.

**Se le habla a UNA persona, de vos.** El video lo mira alguien solo, no un aula:
*"fijate"*, *"acordate"*, *"te va a pasar"*. Nunca *"fíjense"* ni *"anoten"*. Es
fácil que se escape, porque dar clase sale en plural.

### La duración se mide, no se estima

La narración a ritmo de explicar con calma son **~150 palabras por minuto**.
Contá las palabras de las líneas `>`, dividí por 150 y sumale las pausas de
escribir y ejecutar. Que el número del título coincida con la suma de las
secciones.

---

## 📼 Qué hay grabado

Inventario del Drive al **14/9/2026**: **18 videos, 819 MB**.

| Orden | Serie | Videos | Estado |
|---|---|---|---|
| 1 | Variables y Tipos | 7 | ✅ |
| 2 | Estructuras de Control | 4 | ✅ |
| 3 | Listas | 8 | ⚠️ **7 de 8** — falta *Buenas prácticas* |
| 4 | **Funciones — repaso completo** | 1 | ⬜ |
| 5 | Tuplas | 4 | ⬜ *(carpeta creada y vacía en Drive)* |
| 6 | Sets | 5 | ⬜ |
| 7 | Diccionarios | 5 | ⬜ |
| 8 | **Archivos y Persistencia** | 5 | ⬜ |

> ✅ **El número de carpeta es el orden de estudio.** Se renumeraron el 14/9 para que coincidan:
> en la plataforma **Funciones I va antes que Tuplas, Sets y Diccionarios**, y como ahora Funciones
> se graba en un solo video de repaso, ese video ocupa el lugar de Funciones I.
>
> **Subí a YouTube en este orden**, no por fecha de grabación, y la playlist queda derecha sola.

---

> ### 🎬 Orden de grabación
>
> **Funciones va antes que Archivos.** Los 8 ejercicios de Archivos arrancan con `def`
> (`guardar(ruta, items)`, `contar_lineas(ruta)`, `agregar(ruta, linea)`…), así que sin funciones
> no se puede resolver ninguno.
>
> Los guiones de Archivos no usan `def` —muestran la mecánica suelta, para no resolver los
> ejercicios— así que el video se entiende igual. El choque aparece recién al sentarse a practicar,
> que es el peor momento para descubrir que falta un tema.
>
> 1. [Funciones — repaso completo](./04_funciones/00_repaso_completo.md)
> 2. [Archivos, videos 1 a 4](./08_persistencia/)

---

## 01 — Variables y Tipos de Datos (7 videos)

| # | Archivo | Tema |
|---|---------|------|
| 1 | [01_variables.md](./01_variables_y_tipos/01_variables.md) | Qué es una variable, cómo se crea, reglas de nombres |
| 2 | [02_tipos_de_datos.md](./01_variables_y_tipos/02_tipos_de_datos.md) | str, int, float, bool, None, conversión de tipos |
| 3 | [03_operadores.md](./01_variables_y_tipos/03_operadores.md) | Aritméticos, comparación, lógicos, precedencia |
| 4 | [04_operaciones_con_strings.md](./01_variables_y_tipos/04_operaciones_con_strings.md) | Concatenación, len, upper/lower, strip, replace, split, join, find, in |
| 5 | [05_funcion_print.md](./01_variables_y_tipos/05_funcion_print.md) | print(), sep, end, f-strings básicas |
| 6 | [06_funcion_input.md](./01_variables_y_tipos/06_funcion_input.md) | input(), siempre devuelve str, conversión de tipos |
| 7 | [07_formato_strings.md](./01_variables_y_tipos/07_formato_strings.md) | Alineación (<, >, ^), decimales (.2f), ancho con variable |

---

## 02 — Estructuras de Control (4 videos)

| # | Archivo | Tema |
|---|---------|------|
| 1 | [01_if_elif_else.md](./02_estructuras_de_control/01_if_elif_else.md) | Condicionales, indentación, condiciones compuestas |
| 2 | [02_while.md](./02_estructuras_de_control/02_while.md) | Bucle while, inicialización/condición/actualización, acumulador |
| 3 | [03_for.md](./02_estructuras_de_control/03_for.md) | Bucle for, range(), recorrer strings, for vs while |
| 4 | [04_break_y_continue.md](./02_estructuras_de_control/04_break_y_continue.md) | break, continue |

---

## 03 — Listas (8 videos)

| # | Archivo | Tema |
|---|---------|------|
| 1 | [01_creacion_y_acceso.md](./03_listas/01_creacion_y_acceso.md) | Qué es una lista, índices, len(), in |
| 2 | [02_slicing.md](./03_listas/02_slicing.md) | Rebanar listas, paso, índices negativos |
| 3 | [03_agregar_elementos.md](./03_listas/03_agregar_elementos.md) | append(), insert(), extend() |
| 4 | [04_eliminar_elementos.md](./03_listas/04_eliminar_elementos.md) | remove(), pop(), del, clear() |
| 5 | [05_recorrer_listas.md](./03_listas/05_recorrer_listas.md) | for, enumerate(), zip() |
| 6 | [06_metodos_utiles.md](./03_listas/06_metodos_utiles.md) | sort(), sorted(), reverse(), count(), index(), copy() |
| 7 | [07_list_comprehensions.md](./03_listas/07_list_comprehensions.md) | List comprehensions con y sin filtro |
| 8 | [08_buenas_practicas.md](./03_listas/08_buenas_practicas.md) | Nombres, no modificar mientras recorrés, cuándo usar lista |

---

## 05 — Tuplas (4 videos)

| # | Archivo | Tema |
|---|---------|------|
| 1 | [01_que_es_y_como_se_crea.md](./05_tuplas/01_que_es_y_como_se_crea.md) | Inmutabilidad, creación, trampa del elemento único |
| 2 | [02_desempaquetado.md](./05_tuplas/02_desempaquetado.md) | Desempaquetado, intercambio de variables, for, funciones con múltiples retornos |
| 3 | [03_metodos_y_usos.md](./05_tuplas/03_metodos_y_usos.md) | count(), index(), claves de diccionario, cuándo usar tupla |
| 4 | [04_zip.md](./05_tuplas/04_zip.md) | zip(), iterar colecciones en paralelo, transponer matriz |

---

## 06 — Sets (5 videos)

| # | Archivo | Tema |
|---|---------|------|
| 1 | [01_que_es_y_como_se_crea.md](./06_sets/01_que_es_y_como_se_crea.md) | Sin duplicados, sin orden, trampa del set vacío, búsqueda con in |
| 2 | [02_agregar_y_eliminar.md](./06_sets/02_agregar_y_eliminar.md) | add(), update(), remove(), discard(), pop(), clear() |
| 3 | [03_operaciones_de_conjuntos.md](./06_sets/03_operaciones_de_conjuntos.md) | Unión, intersección, diferencia, diferencia simétrica, issubset/issuperset |
| 4 | [04_cuando_usar_sets.md](./06_sets/04_cuando_usar_sets.md) | Casos de uso, cuándo no usar, tabla resumen |
| 5 | [05_set_comprehensions.md](./06_sets/05_set_comprehensions.md) | Set comprehensions, filtro con if, eliminar duplicados |

---

## 07 — Diccionarios (5 videos)

| # | Archivo | Tema |
|---|---------|------|
| 1 | [01_que_es_y_como_se_crea.md](./07_diccionarios/01_que_es_y_como_se_crea.md) | Pares clave-valor, sintaxis, claves únicas |
| 2 | [02_acceso_y_modificacion.md](./07_diccionarios/02_acceso_y_modificacion.md) | [], .get(), in, agregar, del, .pop(), .clear() |
| 3 | [03_metodos_principales.md](./07_diccionarios/03_metodos_principales.md) | keys(), values(), items(), update(), setdefault() |
| 4 | [04_comprehensions_y_patrones.md](./07_diccionarios/04_comprehensions_y_patrones.md) | Dict comprehensions, patrón contador, patrón agrupar |
| 5 | [05_cuando_usar_y_buenas_practicas.md](./07_diccionarios/05_cuando_usar_y_buenas_practicas.md) | Cuándo usar diccionario, errores comunes, buenas prácticas |

---

## 04 — Funciones (7 videos + el repaso)

| # | Archivo | Tema |
|---|---------|------|
| **0** | [**00_repaso_completo.md**](./04_funciones/00_repaso_completo.md) | ⭐ **Funciones I y II en un solo video (~9 min).** El resto son el desarrollo largo |
| 1 | [01_que_es_y_como_se_define.md](./04_funciones/01_que_es_y_como_se_define.md) | def, anatomía, definición vs llamada |
| 2 | [02_parametros_y_argumentos.md](./04_funciones/02_parametros_y_argumentos.md) | Parámetros, argumentos, valores por defecto, keyword args |
| 3 | [03_return.md](./04_funciones/03_return.md) | return vs print, early return, múltiples valores |
| 4 | [04_scope.md](./04_funciones/04_scope.md) | Variables locales y globales, regla de oro del scope |
| 5 | [05_args_kwargs.md](./04_funciones/05_args_kwargs.md) | *args (tupla), **kwargs (dict), orden de parámetros |
| 6 | [06_buenas_practicas.md](./04_funciones/06_buenas_practicas.md) | Nombres, una responsabilidad, return vs print, tamaño |
| 7 | [07_funciones_builtin.md](./04_funciones/07_funciones_builtin.md) | print/input, conversión de tipos, sum/min/max/sorted/enumerate/zip, any/all |

---

## 🔖 Capítulos para YouTube

Los marcadores que se ponen con el atajo de OBS salen del video y se convierten
en la lista de la descripción con:

```bash
python guiones/capitulos.py video.mp4 guiones/04_funciones/00_repaso_completo.md
```

Empareja **la marca N con la sección N del guion**, así que hay que apretar el
atajo al empezar cada sección, en orden y **desde la segunda** — la primera la
pone OBS sola en 0:00.

Deja un `_capitulos.txt` al lado del video: **copiá desde ahí y no desde la
terminal**, que en Windows es cp1252 y rompe los acentos.

Requiere grabar en **MP4 híbrido**; en MKV los marcadores no existen.

---

## 08 — Archivos y Persistencia (5 videos)

Carpeta: `08_persistencia/`

| # | Archivo | Tema |
|---|---------|------|
| 1 | [01_por_que_archivos.md](./08_persistencia/01_por_que_archivos.md) | RAM vs disco, `open()`, los cuatro modos, por qué `"w"` borra sin preguntar |
| 2 | [02_with_y_leer.md](./08_persistencia/02_with_y_leer.md) | Por qué `close()` falla, `with`, `encoding`, `read`/`readlines`/`for`, `strip()` |
| 3 | [03_escribir.md](./08_persistencia/03_escribir.md) | `write` vs `print(file=)`, el `\n`, y el modo `"a"` para sumar sin borrar |
| 4 | [04_rutas_y_pathlib.md](./08_persistencia/04_rutas_y_pathlib.md) | `FileNotFoundError`, `Path.cwd()`, relativas vs absolutas, `exists()`, `mkdir` |
| 5 | [05_el_sistema.md](./08_persistencia/05_el_sistema.md) | ⭐ Guardar y recuperar un **diccionario**, `split(",")`, el primer día sin archivo, respaldo con fecha |

> ⚠️ **El 5 necesita Diccionarios visto**, y es el que conecta Archivos con el **proyecto del
> año**: ahí aparece el patrón que hace que el sistema arranque el primer día sin romperse.
>
> Es el mismo motivo por el que **los ejercicios 4 y 5 de Archivos piden diccionarios**
> (`guardar_dia` recibe uno y `cargar_dia` devuelve uno). Los tres primeros no, así que se puede
> empezar Archivos sin Diccionarios — pero no terminarlo.

*(En esa carpeta está además `setup_git_github_videos.md`, que no es un guion de repaso.)*

---

**Total: 46 videos · ~252 minutos de contenido**
