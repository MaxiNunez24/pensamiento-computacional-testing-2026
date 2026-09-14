# Video 1 — Archivos: por qué guardar en disco

**Serie:** Archivos y Persistencia
**Duración estimada:** ~6 minutos

> ⚠️ **Grabar después del repaso de Funciones.** Este video no usa `def`, pero **los ejercicios de
> Archivos sí**: los ocho arrancan con una función a completar.

---

## INTRO (~20 segundos)

*(Abrir un archivo Python vacío en el editor)*

> Hola, ¿cómo va? Arrancamos con **archivos**.
>
> Hasta ahora todo lo que programamos se olvidaba de todo apenas cerrábamos el programa. En estos
> cuatro videos vamos a ver cómo hacer que los datos **sobrevivan**.
>
> Y te adelanto que este es el tema que abre la puerta al proyecto del año, así que prestale
> atención.

---

## EL PROBLEMA, EN VIVO (~1 minuto 15)

```python
peliculas = ["Matrix", "Coco", "Shrek"]
peliculas.append("Interestelar")
print(peliculas)
```

*(Ejecutarlo)*

> Mirá este programa. Tengo una lista de películas, le agrego una más con `append`, y la muestro.
>
> Lo ejecuto y sale la lista con las cuatro. Perfecto, funciona.

*(Cerrar la terminal y ejecutarlo de nuevo)*

> Ahora lo cierro, y lo vuelvo a ejecutar.
>
> Y fijate bien en lo que sale: **exactamente lo mismo**. El "Interestelar" que agregué la vez
> pasada **no quedó**.
>
> Y no es que se rompió algo. Esto es lo que viene pasando desde el primer día, solo que recién
> ahora lo estamos mirando de frente: **cada vez que arranca, el programa empieza de cero.**
>
> Pensalo con el proyecto que vamos a hacer: si tenés que cargar cien alumnos a mano cada vez que
> abrís el programa, ese programa no sirve para nada.

---

## RAM Y DISCO (~1 minuto)

*(Sin código, hablando a cámara)*

> ¿Y por qué pasa esto? Porque todo lo que hicimos hasta ahora vive en la **memoria RAM**, que es
> rapidísima pero **se borra** cuando el programa termina.
>
> Te lo pongo con una comparación que se entiende enseguida.
>
> La **RAM** es el escritorio donde estás trabajando. Tenés todo desparramado a mano, lo agarrás
> rapidísimo, es comodísimo… pero cuando te vas, viene alguien y limpia el escritorio. Al otro día
> no queda nada.
>
> El **disco** es el cajón. Es más lento: tenés que abrirlo, buscar, sacar la carpeta. Pero **lo
> que guardás ahí sigue estando mañana**.
>
> Todos los programas que escribimos hasta hoy vivieron en el escritorio. Hoy aprendemos a usar el
> cajón.
>
> Y la regla es simple: **si querés que algo siga existiendo después de cerrar el programa, tiene
> que ir al disco.** O sea, a un archivo.

📌 **Y esto queda escrito:**

```python
# ¿Por qué se pierde todo al cerrar el programa?

# RAM   = el escritorio donde trabajás
#         rapidísima, pero se limpia cuando te vas
#         (acá vivieron TODOS los programas del curso hasta hoy)

# DISCO = el cajón
#         más lento, pero mañana sigue estando

# Si querés que algo sobreviva a cerrar el programa -> va al disco.
# O sea: a un ARCHIVO.
```

---

## `open()`: DÓNDE Y PARA QUÉ (~1 minuto 15)

```python
archivo = open("notas.txt", "w")
archivo.write("Hoy empecé a usar archivos")
archivo.close()
```

*(Ejecutar y abrir el archivo creado)*

> Tres líneas. **Abro** el archivo, **escribo**, **cierro**.
>
> Y mirá: ahí apareció `notas.txt` en la carpeta, con el texto adentro. Cierro todo, apago la
> computadora si quiero, y mañana el archivo sigue estando.
>
> Vamos a `open`, que es la función nueva. Le paso **dos cosas**: **dónde** está el archivo, que
> por ahora es simplemente el nombre, y **para qué** lo abro.
>
> Ese segundo dato es esa letrita entre comillas, y se llama el **modo**.

---

## LOS MODOS (~50 segundos)

> Los modos son cuatro, y quiero que te queden dos en particular, porque la diferencia entre esos
> dos es donde se pierden datos de verdad.

| Modo | Qué hace | Si el archivo no existe |
|---|---|---|
| `"r"` | **Leer** — es el que usa por defecto | 💥 Error |
| `"w"` | Escribir **borrando todo** lo anterior | Lo crea |
| `"a"` | Escribir **agregando al final** | Lo crea |
| `"x"` | Crear, y fallar si ya existe | Lo crea |

> `"r"` de *read*, leer. `"w"` de *write*, escribir. `"a"` de *append*, que es agregar al final.
> Y `"x"` que casi no vas a usar.
>
> Los dos que importan ahora son `"w"` y `"a"`. Y te voy a mostrar por qué.

---

## ⚠️ `"w"` BORRA SIN PREGUNTAR (~1 minuto 15)

*(Esto hay que mostrarlo, no contarlo. El archivo ya tiene texto de antes.)*

```python
archivo = open("notas.txt", "w")
archivo.close()
```

*(Ejecutar, y abrir `notas.txt`)*

> Prestá muchísima atención a lo que acabo de hacer, porque es de las cosas que más bronca dan
> cuando pasan.
>
> Abrí el archivo en modo `"w"`, y lo cerré. **No escribí nada.** Ni una letra.
>
> Y mirá el archivo: **está vacío**. Lo que había se borró.
>
> Y ojo con **cuándo** se borró, que es lo importante: no se borró al escribir, porque no escribí
> nada. **Se borró en el momento exacto de abrirlo.**
>
> Con solo abrir un archivo en modo `"w"`, ya perdiste lo que tenía adentro. No hay vuelta atrás,
> no te pregunta, no hay papelera de reciclaje.
>
> Así que quedate con esto: **`"w"` es para cuando querés empezar de cero.** Si lo que querés es
> sumar algo sin perder lo anterior, el modo es `"a"`, y eso lo vemos en el video tres.

📌 **Y esto queda escrito:**

```python
# open() necesita DOS cosas: dónde está, y PARA QUÉ lo abrís
open("notas.txt", "w")
#     ^^^^^^^^^^   ^^^ el MODO

# "r"  LEER (el que usa por defecto)  -> si no existe: 💥 error
# "w"  ESCRIBIR borrando todo          -> si no existe: lo crea
# "a"  ESCRIBIR agregando al final     -> si no existe: lo crea
# "x"  CREAR, y fallar si ya existe    -> si no existe: lo crea

# ⚠️ "w" BORRA EN EL MOMENTO DE ABRIR, no al escribir.
#    Abrir en "w" y cerrar sin escribir nada = archivo vacío.
#    No pregunta. No hay papelera.

# "w" = empezar de cero   ·   "a" = sumar sin perder
```

---

## CIERRE (~20 segundos)

> Listo el primero. En el próximo video vemos por qué ese `close()` que escribí es un problema
> esperando a pasar, cuál es la forma correcta de abrir archivos en Python, y las tres maneras de
> leer.
>
> Nos vemos ahí. ¡Chau!
