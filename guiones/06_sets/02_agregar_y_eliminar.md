# Video 2 — Sets: agregar y eliminar elementos

**Serie:** Sets
**Duración estimada:** ~4 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos cómo **agregar y eliminar elementos** de un set. Los métodos son similares a los de las listas, pero con algunas diferencias importantes.

---

## AGREGAR ELEMENTOS (~1.5 minutos)

*(Escribir en el editor:)*

```python
frutas = {"manzana", "banana"}

# Agregar un elemento
frutas.add("naranja")
print(frutas)   # {'manzana', 'banana', 'naranja'}

# Agregar un elemento que ya existe — no hace nada, sin error
frutas.add("manzana")
print(frutas)   # {'manzana', 'banana', 'naranja'} — sin cambios
```

> `.add()` agrega un solo elemento. Si ya existe, lo ignora silenciosamente — los sets garantizan unicidad.

```python
# Agregar varios elementos de otra colección
frutas.update(["pera", "uva", "manzana"])   # "manzana" se ignora
print(frutas)   # {'manzana', 'banana', 'naranja', 'pera', 'uva'}
```

> `.update()` recibe cualquier iterable (lista, tupla, otro set) y agrega todos sus elementos. Los duplicados se descartan automáticamente.

---

## ELIMINAR ELEMENTOS (~2 minutos)

> Hay tres formas de eliminar, con una diferencia importante entre ellas:

```python
frutas = {"manzana", "banana", "naranja"}

# .remove() — lanza KeyError si el elemento NO está
frutas.remove("banana")
print(frutas)   # {'manzana', 'naranja'}

frutas.remove("kiwi")   # ❌ KeyError: 'kiwi'
```

```python
# .discard() — NO lanza error si no está (la más segura)
frutas.discard("naranja")    # elimina si existe
frutas.discard("kiwi")       # no hace nada, sin error
print(frutas)   # {'manzana'}
```

> La regla: usen `.discard()` cuando no están seguros de si el elemento existe. Usen `.remove()` solo cuando están seguros — el error les alerta si algo salió mal.

```python
# .pop() — elimina un elemento "cualquiera" (el orden no está garantizado)
elemento = frutas.pop()
print(elemento)   # puede ser cualquier elemento del set
```

```python
# .clear() — vacía el set completamente
frutas.clear()
print(frutas)   # set()
```

---

## CIERRE (~20 segundos)

> En el próximo video vemos la parte más poderosa de los sets: las **operaciones de conjuntos** — unión, intersección, diferencia.
>
> ¡Nos vemos!
