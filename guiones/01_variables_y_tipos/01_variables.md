# Video 1 — Variables: qué son y cómo se crean

**Serie:** Variables y Tipos de Datos
**Duración estimada:** ~5 minutos

---

## INTRO (~30 segundos)

*(Abrir un archivo Python vacío en el editor)*

> Hola! Bienvenidos a la serie de videos de repaso.
>
> En este primer video vemos **variables**: qué son, cómo se crean y las reglas para nombrarlas bien. Es el punto de partida de todo lo que hacemos en Python.

---

## ¿QUÉ ES UNA VARIABLE? (~1 minuto)

> Imaginen que necesitan guardar el nombre de un alumno. Sin variables, cada vez que quisieran usarlo tendrían que escribirlo a mano en cada lugar del programa. Con variables, lo guardan una vez y lo reusan cuantas veces quieran.

*(Escribir en el editor:)*

```python
nombre = "Maxi"
```

> Eso es una variable. `nombre` es el nombre de la variable, `"Maxi"` es el valor, y el `=` es el operador de asignación. No es una igualdad matemática: es una orden — "guardá el valor de la derecha en el nombre de la izquierda".
>
> Piénsenlo como una caja con una etiqueta. La etiqueta dice `nombre`, y adentro de la caja hay un `"Maxi"`.

---

## CREAR Y USAR VARIABLES (~2 minutos)

*(Escribir más variables:)*

```python
nombre        = "Maxi"
edad          = 22
altura        = 1.81
es_estudiante = True
```

> Creamos cuatro variables. Cada una guarda un tipo de dato distinto: texto, número entero, número decimal y un booleano. Sobre tipos de datos hablamos en el próximo video.

*(Mostrar con print:)*

```python
print(nombre)   # Maxi
print(edad)     # 22
```

> Para mostrarlas en pantalla, usamos `print()`. Pero la forma más cómoda de combinar texto y variables es con **f-strings**:

```python
print(f"Hola {nombre}, tenés {edad} años")
# Hola Maxi, tenés 22 años
```

> Las f-strings empiezan con `f` antes de las comillas. Todo lo que va entre llaves se reemplaza por el valor de la variable.

*(Mostrar que una variable se puede reasignar:)*

```python
edad = 22
print(edad)   # 22

edad = 23
print(edad)   # 23

edad = "Hola"
print(edad)   # Hola
```

> En Python podemos cambiar el valor de una variable en cualquier momento. La "caja" se vacía y se rellena con el nuevo valor. Por eso decimos que Python es **dinámicamente tipado**: el tipo puede cambiar, no está fijo.

---

## REGLAS PARA NOMBRES (~1 minuto)

> No cualquier nombre vale. Hay reglas que Python impone y convenciones que usamos por costumbre.

*(Mostrar ejemplos:)*

```python
# ✅ Nombres válidos
nombre_alumno = "Ana"
edad2         = 20
totalCompra   = 100

# ❌ Nombres inválidos
2edad    = 20    # no puede empezar con número
mi nombre = "Ana" # no puede tener espacios
```

> Las reglas:
> - Solo letras, números y guión bajo (`_`).
> - No pueden empezar con un número.
> - Sin espacios.
> - Son sensibles a mayúsculas: `nombre` y `Nombre` son variables distintas.

> La convención en Python se llama **snake_case**: todo en minúsculas, palabras separadas por guión bajo. `nombre_alumno`, `precio_unitario`, `cantidad_total`. Es la forma que vamos a usar siempre en este curso.

---

## CIERRE (~30 segundos)

> Listo para este video. Las variables son el recurso más fundamental: sin ellas no podemos guardar ni reutilizar ningún dato en nuestros programas.
>
> En el próximo video vemos los **tipos de datos**: qué tipos de información pueden guardar las variables y cómo funciona cada uno.
>
> ¡Nos vemos!
