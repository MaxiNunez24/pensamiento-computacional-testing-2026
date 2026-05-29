# Video 5 — Listas: recorrer con for

**Serie:** Listas
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python con una lista definida)*

> Hola! En este video vemos cómo **recorrer** una lista. Hay varias formas, y elegir la correcta hace el código mucho más limpio.

---

## FOR BÁSICO (~1 minuto)

*(Escribir en el editor:)*

```python
frutas = ["manzana", "banana", "naranja"]

for fruta in frutas:
    print(fruta)
# manzana
# banana
# naranja
```

> Esta es la forma más directa y la más usada. En cada iteración, `fruta` toma el valor del siguiente elemento. No necesitamos índices, no necesitamos `range()`, Python maneja todo por nosotros.
>
> Regla simple: si solo necesitamos el **valor** de cada elemento, usamos `for elemento in lista`.

---

## ENUMERATE: CUANDO TAMBIÉN NECESITAMOS EL ÍNDICE (~1.5 minutos)

```python
frutas = ["manzana", "banana", "naranja"]

for i, fruta in enumerate(frutas):
    print(i, fruta)
# 0 manzana
# 1 banana
# 2 naranja
```

> `enumerate()` devuelve pares `(índice, valor)` que podemos desempaquetar directamente en el `for`. Usamos dos variables: una para el índice y otra para el valor.

```python
# Ejemplo práctico: numerar una lista de tareas
tareas = ["Estudiar", "Hacer ejercicio", "Leer"]

for i, tarea in enumerate(tareas, start=1):   # empezar desde 1
    print(f"{i}. {tarea}")
# 1. Estudiar
# 2. Hacer ejercicio
# 3. Leer
```

> El parámetro `start=1` hace que el conteo empiece desde 1 en lugar de 0.

> Regla: si necesitamos el índice además del valor, usamos `enumerate()`. Evitamos hacer `for i in range(len(lista))` y después `lista[i]` — es más largo y menos claro.

---

## ZIP: RECORRER DOS LISTAS EN PARALELO (~1.5 minutos)

```python
alumnos = ["Ana", "Beto", "Cami"]
notas   = [9, 6, 8]

for alumno, nota in zip(alumnos, notas):
    print(f"{alumno}: {nota}")
# Ana: 9
# Beto: 6
# Cami: 8
```

> `zip()` combina dos listas en pares y nos permite recorrerlas a la vez. En cada iteración obtenemos un elemento de cada lista.

> `zip()` se detiene cuando se acaba la lista más corta. Si una tiene 3 elementos y la otra 5, solo procesa 3 pares.

---

## CUÁNDO USAR CADA FORMA (~30 segundos)

```
for x in lista          → solo necesito los valores
for i, x in enumerate   → necesito el índice y el valor
for x, y in zip(a, b)   → necesito recorrer dos listas en paralelo
```

> Eviten `for i in range(len(lista))` salvo que sea estrictamente necesario. Las tres formas de arriba son más claras y más pythónicas.

---

## CIERRE (~20 segundos)

> En el próximo video vemos los **métodos útiles** de las listas: ordenar, invertir, contar, buscar y copiar.
>
> ¡Nos vemos!
