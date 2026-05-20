# Video 4 — Listas: eliminar elementos

**Serie:** Listas
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python con una lista definida)*

> Hola! En el video anterior vimos cómo agregar elementos. Ahora vemos el otro lado: cómo **eliminarlos**. Hay cuatro formas distintas y cada una sirve para algo diferente.

---

## REMOVE: ELIMINAR POR VALOR (~1.5 minutos)

*(Escribir en el editor:)*

```python
frutas = ["manzana", "banana", "naranja", "banana"]

frutas.remove("banana")
print(frutas)   # ['manzana', 'naranja', 'banana']
```

> `remove(valor)` busca el valor en la lista y elimina **la primera aparición**. Si "banana" aparece dos veces, solo elimina la primera.

*(Mostrar el error:)*

```python
frutas.remove("kiwi")   # ❌ ValueError: list.remove(x): x not in list
```

> Si el valor no existe en la lista, Python lanza un `ValueError`. Antes de usar `remove()`, conviene verificar con `in`:

```python
if "kiwi" in frutas:
    frutas.remove("kiwi")
```

---

## POP: ELIMINAR POR ÍNDICE Y OBTENER EL VALOR (~1.5 minutos)

```python
colores = ["rojo", "verde", "azul", "amarillo"]

# Sin argumento: elimina y devuelve el ÚLTIMO elemento
ultimo = colores.pop()
print(ultimo)    # amarillo
print(colores)   # ['rojo', 'verde', 'azul']

# Con índice: elimina y devuelve el elemento en esa posición
segundo = colores.pop(1)
print(segundo)   # verde
print(colores)   # ['rojo', 'azul']
```

> `pop()` es especial porque **devuelve** el elemento que elimina. Esto lo hace útil cuando necesitamos el valor antes de descartarlo.
>
> Sin argumento, trabaja sobre el último elemento — ideal para usar la lista como una pila (stack).

---

## DEL: ELIMINAR SIN DEVOLVER (~1 minuto)

```python
numeros = [10, 20, 30, 40, 50]

del numeros[2]       # elimina el elemento en posición 2
print(numeros)       # [10, 20, 40, 50]

# También funciona con slicing
del numeros[1:3]     # elimina las posiciones 1 y 2
print(numeros)       # [10, 50]
```

> `del` es una instrucción (no un método) que elimina el elemento directamente. No devuelve nada. También puede eliminar rangos usando slicing.

---

## CLEAR: VACIAR LA LISTA (~30 segundos)

```python
carrito = ["laptop", "mouse", "teclado"]

carrito.clear()
print(carrito)   # []
```

> `clear()` vacía la lista completamente pero **mantiene la variable**. Es distinto a `carrito = []`, que crea una nueva lista vacía y la asigna.

---

## RESUMEN (~30 segundos)

> Cuándo usar cada uno:
> - `remove(x)` → cuando saben **qué elemento** quieren eliminar (por valor).
> - `pop(i)` → cuando saben **en qué posición** está y quieren el valor de vuelta. Sin argumento, saca el último.
> - `del lista[i]` → cuando saben la posición y no necesitan el valor.
> - `clear()` → cuando quieren vaciar la lista entera.
>
> En el próximo video vemos cómo **recorrer** una lista con `for`.
>
> ¡Nos vemos!
