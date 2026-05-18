# Video 3 — Listas: agregar elementos

**Serie:** Listas
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python con una lista definida)*

> Hola! En este video vemos cómo **agregar elementos** a una lista. Hay varias formas, y cada una sirve para un caso distinto.

---

## APPEND: AGREGAR AL FINAL (~1.5 minutos)

*(Escribir en el editor:)*

```python
colores = ["rojo", "verde"]

colores.append("azul")
print(colores)   # ['rojo', 'verde', 'azul']

colores.append("amarillo")
print(colores)   # ['rojo', 'verde', 'azul', 'amarillo']
```

> `append()` agrega **un solo elemento al final**. Es la forma más común y eficiente de agregar a una lista. Si están construyendo una lista elemento por elemento, `append()` es lo que van a usar casi siempre.

*(Mostrar patrón con for:)*

```python
# Patrón típico: construir una lista desde cero
cuadrados = []

for i in range(1, 6):
    cuadrados.append(i ** 2)

print(cuadrados)   # [1, 4, 9, 16, 25]
```

---

## INSERT: AGREGAR EN UNA POSICIÓN ESPECÍFICA (~1 minuto)

```python
colores = ["rojo", "verde", "azul"]

colores.insert(1, "blanco")   # insertar "blanco" en la posición 1
print(colores)   # ['rojo', 'blanco', 'verde', 'azul']
```

> `insert(posición, elemento)` toma dos argumentos: la posición donde insertar y el elemento. Todo lo que estaba en esa posición y después se desplaza un lugar hacia la derecha.
>
> `insert(0, x)` agrega al principio. `insert(len(lista), x)` equivale a `append(x)`.

---

## EXTEND: AGREGAR VARIOS DE UNA VEZ (~1 minuto)

```python
colores  = ["rojo", "verde"]
nuevos   = ["azul", "amarillo", "violeta"]

colores.extend(nuevos)
print(colores)
# ['rojo', 'verde', 'azul', 'amarillo', 'violeta']
```

> `extend()` agrega **todos los elementos de otro iterable** al final de la lista. Es diferente a `append()`:

```python
lista = [1, 2, 3]

lista.append([4, 5])     # agrega la lista COMO UN ELEMENTO
print(lista)   # [1, 2, 3, [4, 5]]   ← lista anidada, probablemente no es lo que queremos

lista2 = [1, 2, 3]
lista2.extend([4, 5])    # agrega cada elemento por separado
print(lista2)  # [1, 2, 3, 4, 5]   ← esto sí
```

---

## MODIFICAR UN ELEMENTO EXISTENTE (~30 segundos)

> No es "agregar", pero vale la pena mencionarlo acá: para cambiar un elemento, usamos el índice directamente.

```python
frutas = ["manzana", "banana", "naranja"]

frutas[1] = "mango"   # reemplaza "banana" por "mango"
print(frutas)   # ['manzana', 'mango', 'naranja']
```

---

## CIERRE (~30 segundos)

> Resumen rápido:
> - `append(x)` → agrega `x` al final. El más usado.
> - `insert(i, x)` → inserta `x` en la posición `i`.
> - `extend(otra_lista)` → agrega todos los elementos de `otra_lista` al final.
>
> En el próximo video vemos el otro lado: cómo **eliminar elementos**.
>
> ¡Nos vemos!
