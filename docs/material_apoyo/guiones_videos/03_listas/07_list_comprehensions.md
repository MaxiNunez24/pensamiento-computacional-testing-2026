# Video 7 — Listas: list comprehensions

**Serie:** Listas
**Duración estimada:** ~5 minutos

---

## INTRO (~30 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos las **list comprehensions**: una sintaxis compacta para crear listas en una sola línea. Es una de las características más pythónicas del lenguaje y la van a ver constantemente en código de otros.

---

## EL PROBLEMA QUE RESUELVEN (~1 minuto)

> Imaginen que quieren crear una lista con los cuadrados del 1 al 5. Sin comprehensions:

```python
cuadrados = []
for n in range(1, 6):
    cuadrados.append(n ** 2)

print(cuadrados)   # [1, 4, 9, 16, 25]
```

> Son cuatro líneas para algo conceptualmente simple. Con list comprehension:

```python
cuadrados = [n ** 2 for n in range(1, 6)]

print(cuadrados)   # [1, 4, 9, 16, 25]
```

> Una sola línea. Más compacto, más expresivo. La estructura es: `[expresión for variable in iterable]`.

---

## CON CONDICIÓN (FILTER) (~1.5 minutos)

> Podemos agregar un `if` para filtrar elementos:

```python
# Solo los pares del 1 al 10
pares = [n for n in range(1, 11) if n % 2 == 0]
print(pares)   # [2, 4, 6, 8, 10]
```

> La estructura completa es: `[expresión for variable in iterable if condición]`.
>
> Python toma cada elemento, evalúa la condición, y si es `True` aplica la expresión y lo incluye en la nueva lista.

*(Más ejemplos:)*

```python
frutas = ["manzana", "banana", "naranja", "kiwi", "mango"]

# Solo las frutas con más de 5 letras
largas = [f for f in frutas if len(f) > 5]
print(largas)   # ['manzana', 'banana', 'naranja']

# Convertir a mayúsculas
mayusculas = [f.upper() for f in frutas]
print(mayusculas)   # ['MANZANA', 'BANANA', 'NARANJA', 'KIWI', 'MANGO']
```

---

## COMPRENSIÓN CON TRANSFORMACIÓN Y FILTRO (~1 minuto)

```python
notas    = [4, 7, 9, 3, 8, 5, 6]

# Notas de los aprobados multiplicadas por 1.1 (bonus del 10%)
con_bonus = [nota * 1.1 for nota in notas if nota >= 6]
print(con_bonus)   # [7.7, 9.9, 8.8, 6.6]
```

> La expresión y el filtro pueden ser cualquier cosa. Es muy poderoso.

---

## CUÁNDO USARLAS Y CUÁNDO NO (~1 minuto)

> Las list comprehensions son ideales cuando la lógica es **simple**: una transformación, un filtro, o ambas. Si la expresión o condición se vuelven complejas, es mejor volver al `for` tradicional.

```python
# ✅ Buena — clara y concisa
pares = [n for n in range(20) if n % 2 == 0]

# ❌ Evitar — demasiado complejo para una línea
resultado = [f(x) for x in data if condicion1(x) and condicion2(x) and x > threshold]
```

> La regla: si tienen que pensarlo dos veces para entenderlo, usen un `for` en varias líneas. La claridad vale más que la compacidad.

---

## CIERRE (~20 segundos)

> En el próximo y último video de la serie vemos las **buenas prácticas** con listas: qué hacer y qué evitar para escribir código más limpio y seguro.
>
> ¡Nos vemos!
