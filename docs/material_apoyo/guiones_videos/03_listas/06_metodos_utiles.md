# Video 6 — Listas: métodos útiles

**Serie:** Listas
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos los métodos más útiles que tienen las listas: ordenar, invertir, buscar, contar y copiar.

---

## SORT() Y SORTED(): ORDENAR (~1.5 minutos)

*(Escribir en el editor:)*

```python
numeros = [3, 1, 4, 1, 5, 9, 2, 6]

numeros.sort()
print(numeros)   # [1, 1, 2, 3, 4, 5, 6, 9]
```

> `sort()` ordena la lista **en el lugar**: modifica la lista original y no devuelve nada. Si hacen `resultado = lista.sort()`, `resultado` va a ser `None`.

```python
numeros.sort(reverse=True)
print(numeros)   # [9, 6, 5, 4, 3, 2, 1, 1]
```

> `sorted()` es diferente: **devuelve una nueva lista** ordenada y deja la original intacta.

```python
original  = [3, 1, 4, 1, 5]
ordenada  = sorted(original)

print(ordenada)   # [1, 1, 3, 4, 5]
print(original)   # [3, 1, 4, 1, 5]  — sin cambios
```

> La regla: usen `sorted()` cuando quieran conservar el orden original, usen `sort()` cuando quieran modificar la lista directamente.

---

## REVERSE(): INVERTIR (~30 segundos)

```python
letras = ["a", "b", "c", "d"]

letras.reverse()
print(letras)   # ['d', 'c', 'b', 'a']
```

> `reverse()` invierte el orden de la lista **en el lugar**. Para invertir sin modificar el original, usen slicing: `letras[::-1]`.

---

## INDEX() Y COUNT(): BUSCAR Y CONTAR (~1 minuto)

```python
notas = [7, 8, 9, 7, 6, 7, 10]

print(notas.count(7))    # 3 — cuántas veces aparece 7
print(notas.index(9))    # 2 — posición de la primera aparición de 9
```

> `count(x)` cuenta cuántas veces aparece `x` en la lista.
>
> `index(x)` devuelve la posición de la **primera** aparición de `x`. Si `x` no está en la lista, lanza un `ValueError`. Conviene verificar con `in` antes de usar `index()`.

---

## COPY(): COPIAR UNA LISTA (~1.5 minutos)

> Este es uno de los errores más clásicos en Python:

```python
# ❌ Esto NO es una copia
original   = [1, 2, 3]
copia_mala = original

copia_mala.append(4)
print(original)    # [1, 2, 3, 4]  ← ¡también se modificó!
```

> Cuando hacemos `copia = original`, ambas variables apuntan a **la misma lista** en memoria. Modificar una modifica la otra.

```python
# ✅ Formas correctas de copiar
copia1 = original.copy()
copia2 = list(original)
copia3 = original[:]       # slicing completo

copia1.append(99)
print(original)    # [1, 2, 3]  ← no se modifica
```

> Las tres formas crean una **copia independiente**. Yo prefiero `.copy()` porque el nombre dice exactamente lo que hace.

---

## CIERRE (~20 segundos)

> En el próximo video vemos las **list comprehensions**: una forma compacta y elegante de crear listas en una sola línea.
>
> ¡Nos vemos!
