# Video 1 — Listas: creación y acceso

**Serie:** Listas
**Duración estimada:** ~5 minutos

---

## INTRO (~30 segundos)

*(Abrir un archivo Python vacío en el editor)*

> Hola! Bienvenidos a la serie de Listas. Este es el primero de ocho videos, cada uno cubre un solo tema. La idea es que puedan buscar exactamente lo que necesitan, cuando lo necesitan.
>
> En este video: qué es una lista, cómo se crea, y cómo se accede a sus elementos.

---

## ¿QUÉ ES UNA LISTA? (~1 minuto)

> Imaginen que necesitan guardar los nombres de todos los alumnos del curso. Podrían hacer esto:

```python
alumno1 = "Ana"
alumno2 = "Beto"
alumno3 = "Cami"
```

> Funciona para tres. Si el curso tiene treinta alumnos, necesitan treinta variables. Y si mañana entra uno más, agregan otra. Es inmanejable.
>
> Para eso existen las **listas**: una sola variable que agrupa muchos valores.

```python
alumnos = ["Ana", "Beto", "Cami"]
```

> Una lista se escribe con **corchetes** y los elementos separados por **comas**. Puede contener strings, números, booleanos, lo que sea, incluso mezclados.

```python
frutas  = ["manzana", "banana", "naranja"]
numeros = [10, 20, 30, 40]
mixta   = [1, "hola", True, 3.14]
```

> Dos propiedades clave: las listas son **ordenadas** —cada elemento tiene una posición fija— y son **mutables** —podemos cambiar su contenido después de crearlas.

---

## ACCESO POR ÍNDICE (~2 minutos)

> Para acceder a un elemento específico usamos su **índice**: el número de posición. En Python, el primer elemento siempre es el índice **cero**.

```python
frutas = ["manzana", "banana", "naranja"]
#             0          1         2

print(frutas[0])   # manzana
print(frutas[1])   # banana
print(frutas[2])   # naranja
```

> Para recordarlo: el índice no dice "cuál número de elemento es", dice "a cuántos pasos del inicio está". El primero está a cero pasos.

> Python también tiene **índices negativos** para contar desde el final. El `-1` es el último, el `-2` el anteúltimo.

```python
print(frutas[-1])   # naranja  — el último
print(frutas[-2])   # banana   — el anteúltimo
```

> Muy útil cuando queremos el último elemento sin saber cuántos hay en total.

*(Mostrar el error:)*

```python
print(frutas[5])   # ❌ IndexError: list index out of range
```

> Si usamos un índice que no existe, Python lanza un `IndexError`. Es uno de los errores más comunes — revisen el índice que están usando.

---

## LEN() E IN (~1 minuto)

> Dos operaciones que van a usar constantemente:

```python
frutas = ["manzana", "banana", "naranja"]

print(len(frutas))             # 3 — cantidad de elementos
print("banana" in frutas)      # True — ¿está en la lista?
print("kiwi" in frutas)        # False
```

> `len()` devuelve la cantidad de elementos. `in` verifica si un elemento está en la lista — devuelve `True` o `False`.

---

## CIERRE (~30 segundos)

> Listo para este video. Ya saben crear una lista y acceder a cualquiera de sus elementos por posición.
>
> En el próximo video vemos **slicing**: cómo obtener una porción de la lista en una sola operación, sin loops ni índices manuales.
>
> ¡Nos vemos!
