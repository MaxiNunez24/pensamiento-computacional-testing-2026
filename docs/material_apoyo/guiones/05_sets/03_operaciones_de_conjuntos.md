# Video 3 — Sets: operaciones de conjuntos

**Serie:** Sets
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos la razón principal por la que existen los sets: las **operaciones de conjuntos** — la misma matemática de conjuntos que vieron en la escuela, directamente en Python.

---

## SETUP: DOS GRUPOS (~30 segundos)

```python
matematica = {"Ana", "Beto", "Cami", "Dante"}
fisica     = {"Cami", "Dante", "Eva", "Franco"}
```

> Tenemos dos sets: los alumnos que cursan Matemática y los que cursan Física. Algunos están en las dos materias.

---

## LAS CUATRO OPERACIONES (~3 minutos)

*(Mostrar cada una con su resultado:)*

```python
# UNIÓN: alumnos en AL MENOS UNA de las dos materias
todos = matematica | fisica
todos = matematica.union(fisica)    # equivalente

print(todos)
# {'Ana', 'Beto', 'Cami', 'Dante', 'Eva', 'Franco'}
```

> El operador `|` (pipe) o el método `.union()` devuelve todos los elementos que están en A, en B, o en ambos — sin repetir.

```python
# INTERSECCIÓN: alumnos que cursan AMBAS materias
ambas = matematica & fisica
ambas = matematica.intersection(fisica)   # equivalente

print(ambas)   # {'Cami', 'Dante'}
```

> El operador `&` devuelve solo los elementos que están en **los dos** sets.

```python
# DIFERENCIA: alumnos que cursan Matemática pero NO Física
solo_mate = matematica - fisica
solo_mate = matematica.difference(fisica)   # equivalente

print(solo_mate)   # {'Ana', 'Beto'}
```

> ⚠️ La diferencia **no es simétrica**: `matematica - fisica` ≠ `fisica - matematica`.

```python
# DIFERENCIA SIMÉTRICA: alumnos en UNA SOLA materia (no en ambas)
una_sola = matematica ^ fisica
una_sola = matematica.symmetric_difference(fisica)   # equivalente

print(una_sola)   # {'Ana', 'Beto', 'Eva', 'Franco'}
```

---

## RELACIONES ENTRE CONJUNTOS (~1 minuto)

```python
materias_de_ana  = {"Python", "JavaScript", "Rust"}
materias_comunes = {"Python", "JavaScript"}
materias_de_beto = {"Java", "C++"}

# ¿Todas las materias comunes están en las de Ana?
print(materias_comunes.issubset(materias_de_ana))    # True
print(materias_comunes <= materias_de_ana)            # equivalente

# ¿Ana tiene todas las materias comunes?
print(materias_de_ana.issuperset(materias_comunes))  # True

# ¿Ana y Beto no comparten ninguna materia?
print(materias_de_ana.isdisjoint(materias_de_beto))  # True
```

> `issubset()` / `<=` pregunta si todos los elementos de A están en B.
> `issuperset()` / `>=` pregunta si A contiene todos los elementos de B.
> `isdisjoint()` pregunta si no tienen ningún elemento en común.

---

## CIERRE (~20 segundos)

> En el próximo video vemos cuándo conviene usar un set y cuándo no.
>
> ¡Nos vemos!
