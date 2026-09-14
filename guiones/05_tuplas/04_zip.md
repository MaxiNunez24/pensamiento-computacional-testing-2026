# Video 4 — `zip()`: iterar colecciones en paralelo

**Serie:** Tuplas
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos `zip()`: una función built-in que combina dos colecciones en pares de tuplas. Es la herramienta perfecta cuando necesitás recorrer dos listas "en paralelo".

---

## EL PROBLEMA QUE RESUELVE (~1 minuto)

> Imaginá que tenés los nombres y las notas de los alumnos en dos listas separadas:

*(Escribir:)*

```python
alumnos = ["Ana", "Beto", "Cami"]
notas   = [9, 6, 8]
```

> Para mostrar "Ana: 9", "Beto: 6", etc., podríamos hacerlo con un índice:

```python
for i in range(len(alumnos)):
    print(f"{alumnos[i]}: {notas[i]}")
```

> Funciona, pero es verboso. Con `zip()` queda mucho más limpio:

```python
for alumno, nota in zip(alumnos, notas):
    print(f"{alumno}: {nota}")
# Ana: 9
# Beto: 6
# Cami: 8
```

> `zip()` combina las dos listas en pares de tuplas y las desempaquetamos directamente en el `for`.

---

## QUÉ DEVUELVE `zip()` (~30 segundos)

*(Mostrar el resultado de zip:)*

```python
pares = list(zip(alumnos, notas))
print(pares)
# [('Ana', 9), ('Beto', 6), ('Cami', 8)]
```

> `zip()` devuelve un iterador de **tuplas**. Cada tupla agrupa los elementos de la misma posición en todas las colecciones. Por eso funciona el desempaquetado.

---

## ZIP CON MÁS DE DOS COLECCIONES (~30 segundos)

```python
nombres   = ["Ana", "Beto", "Cami"]
notas     = [9, 6, 8]
ciudades  = ["La Plata", "Ensenada", "Berisso"]

for nombre, nota, ciudad in zip(nombres, notas, ciudades):
    print(f"{nombre} ({ciudad}): {nota}")
# Ana (La Plata): 9
# Beto (Ensenada): 6
# Cami (Berisso): 8
```

---

## EL LARGO DEL MÁS CORTO (~30 segundos)

> ⚠️ Si las colecciones tienen distinto largo, `zip()` se detiene cuando se acaba la más corta:

```python
letras  = ["a", "b", "c", "d"]
numeros = [1, 2]

print(list(zip(letras, numeros)))   # [('a', 1), ('b', 2)]
# ← 'c' y 'd' quedaron afuera
```

---

## `zip(*matriz)`: TRANSPONER UNA MATRIZ (~1.5 minutos)

> Este es el uso más avanzado. El `*` antes de la lista se llama **unpacking de argumentos** — desempaqueta la lista de filas como si las pasáramos una por una a `zip()`.

*(Escribir el ejemplo:)*

```python
matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
```

> Normalmente para recorrer columnas necesitaríamos doble índice. Con `zip(*matriz)`:

```python
for i, columna in enumerate(zip(*matriz)):
    print(f"Col {i} → {columna} → suma: {sum(columna)}")
# Col 0 → (1, 4, 7) → suma: 12
# Col 1 → (2, 5, 8) → suma: 15
# Col 2 → (3, 6, 9) → suma: 18
```

> Lo que hace `zip(*matriz)` es equivalente a `zip([1,2,3], [4,5,6], [7,8,9])`: toma cada fila como un argumento separado y las combina por posición — columna por columna en vez de fila por fila.

---

## CIERRE (~20 segundos)

> `zip()` es de esas funciones que, cuando la descubrís, la usás todo el tiempo. Siempre que tengas dos o más colecciones que van "de la mano", es la herramienta correcta.
>
> Con este video cerramos la serie de Tuplas. En la próxima serie vemos los **Sets**.
>
> ¡Nos vemos!
