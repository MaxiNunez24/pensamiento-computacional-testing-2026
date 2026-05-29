# Video 7 — Funciones built-in: las que Python ya escribió por vos

**Serie:** Funciones
**Duración estimada:** ~7 minutos

---

## INTRO (~30 segundos)

*(Abrir un archivo Python vacío en el editor)*

> Hola! Ahora que ya sabemos qué es una función y cómo escribir las nuestras, tiene mucho más sentido hablar de esto: Python viene con **docenas de funciones listas para usar**.
>
> No hace falta definirlas, solo llamarlas. En este video vemos las más útiles, agrupadas por tema.

---

## ENTRADA Y SALIDA (~1 minuto)

> Ya las conocen bien: `print()` y `input()`. Las mencionamos acá para cerrar el panorama.

*(Escribir:)*

```python
print("Hola")                    # muestra en pantalla
nombre = input("Tu nombre: ")    # lee del usuario, devuelve str
```

> `print()` es una función. `input()` es una función. Cuando dijimos "llamar una función", estas eran las primeras que estaban usando.

---

## CONVERSIÓN DE TIPOS (~1 minuto)

> Estas las usan todo el tiempo, especialmente después de un `input()`:

*(Escribir:)*

```python
int("42")       # 42      ← string → entero
float("3.14")   # 3.14    ← string → decimal
str(99)         # "99"    ← número → string
bool(0)         # False
bool(1)         # True
```

> Y `type()` para inspeccionar qué tipo es un valor — muy útil para debuggear:

```python
type(42)         # <class 'int'>
type("hola")     # <class 'str'>
type([1, 2, 3])  # <class 'list'>
```

---

## FUNCIONES NUMÉRICAS (~1 minuto)

*(Escribir:)*

```python
abs(-7)            # 7      ← valor absoluto
round(3.1416, 2)   # 3.14   ← redondeo con N decimales
sum([1, 2, 3, 4])  # 10     ← suma de todos los elementos
min([3, 1, 4, 1])  # 1      ← el menor
max([3, 1, 4, 1])  # 4      ← el mayor
```

> `sum`, `min` y `max` reciben cualquier iterable: listas, tuplas, lo que sea. Son mucho más cómodas que escribir un loop manual.

---

## FUNCIONES PARA COLECCIONES (~2 minutos)

> Estas trabajan con listas, tuplas, sets y strings:

*(Escribir:)*

```python
len([1, 2, 3])        # 3   ← cantidad de elementos
len("Python")         # 6   ← también funciona con strings

list(range(5))        # [0, 1, 2, 3, 4]
list(range(2, 8))     # [2, 3, 4, 5, 6, 7]
list(range(0, 10, 2)) # [0, 2, 4, 6, 8]
```

> `range()` ya la conocen del `for`. Acá la envolvemos en `list()` para ver el contenido.

*(Seguir con sorted y enumerate:)*

```python
sorted([3, 1, 4, 1, 5])       # [1, 1, 3, 4, 5]  ← no modifica el original
sorted(["banana", "a", "kiwi"]) # ["a", "banana", "kiwi"]

list(enumerate(["a", "b", "c"]))
# [(0, "a"), (1, "b"), (2, "c")]
```

> `sorted()` devuelve una **nueva** lista ordenada. La original no se toca.
>
> `enumerate()` es muy útil en loops cuando necesitamos el índice y el valor al mismo tiempo:

```python
frutas = ["manzana", "banana", "kiwi"]
for i, fruta in enumerate(frutas):
    print(f"{i}: {fruta}")
# 0: manzana
# 1: banana
# 2: kiwi
```

*(Terminar con zip:)*

```python
nombres = ["Ana", "Beto", "Cami"]
notas   = [9, 5, 8]

for nombre, nota in zip(nombres, notas):
    print(f"{nombre}: {nota}")
# Ana: 9
# Beto: 5
# Cami: 8
```

> `zip()` combina dos listas en pares. Cuando necesitamos iterar dos listas "en paralelo", esta es la herramienta.

---

## `any()` Y `all()` (~1.5 minutos)

> Estas dos son especialmente poderosas combinadas con generadores:

*(Escribir:)*

```python
any(iterable)  # True si AL MENOS UNO es verdadero
all(iterable)  # True si TODOS son verdaderos
```

*(Mostrar con ejemplos concretos:)*

```python
notas = [8, 5, 9, 3, 7]

any(n < 6 for n in notas)   # True  ← hay alguno menor a 6
all(n >= 6 for n in notas)  # False ← no todos son >= 6

palabras = ["hola", "Mundo", "python"]
any(p[0].isupper() for p in palabras)  # True ← alguna empieza con mayúscula
all(len(p) > 3 for p in palabras)      # True ← todas tienen más de 3 letras
```

> La expresión `n < 6 for n in notas` sin corchetes se llama **generador**. Es como una list comprehension pero más eficiente: `any()` y `all()` la procesan elemento por elemento y paran en cuanto tienen la respuesta, sin construir una lista intermedia.

---

## CIERRE (~30 segundos)

> No hace falta memorizar todo esto. Lo importante es saber que estas funciones existen para que, cuando tengan un problema, piensen primero en si Python ya lo resolvió por ustedes antes de escribir código desde cero.
>
> Con `len`, `sum`, `min`, `max`, `sorted`, `enumerate`, `zip`, `any` y `all` cubren la enorme mayoría de las operaciones sobre colecciones que van a necesitar en el curso.
>
> ¡Nos vemos!
