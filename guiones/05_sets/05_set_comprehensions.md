# Video 5 — Set comprehensions

**Serie:** Sets
**Duración estimada:** ~4 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos las **set comprehensions**: la versión "set" de las list comprehensions que ya conocemos. Mismo concepto, misma sintaxis, pero con llaves en vez de corchetes — y el resultado es un set.

---

## REPASO RÁPIDO: LIST COMPREHENSION (~30 segundos)

> Ya conocemos esto:

```python
cuadrados = [x ** 2 for x in range(6)]
print(cuadrados)   # [0, 1, 4, 9, 16, 25]
```

> Una list comprehension genera una lista. Si cambiamos los corchetes por llaves, generamos un set.

---

## SET COMPREHENSION: SINTAXIS (~1 minuto)

*(Cambiar los corchetes por llaves:)*

```python
cuadrados_set = {x ** 2 for x in range(6)}
print(cuadrados_set)   # {0, 1, 4, 9, 16, 25}
print(type(cuadrados_set))   # <class 'set'>
```

> Misma lógica, resultado diferente: un set sin orden y sin duplicados.

*(Agregar un filtro con if:)*

```python
pares = {x for x in range(20) if x % 2 == 0}
print(pares)   # {0, 2, 4, 6, 8, 10, 12, 14, 16, 18}
```

---

## CUANDO LOS DUPLICADOS IMPORTAN (~1.5 minutos)

> La diferencia clave entre list y set comprehension es que el set **elimina duplicados automáticamente**. Esto puede ser exactamente lo que necesitamos — o un problema si queremos conservarlos.

*(Ejemplo donde los duplicados se eliminan de forma útil:)*

```python
palabras = ["python", "es", "genial", "python", "es", "fácil"]

# Palabras únicas
unicas = {p for p in palabras}
print(unicas)   # {'python', 'es', 'genial', 'fácil'}
```

*(Ejemplo aplicado: artistas únicos de una playlist)*

```python
canciones = [
    ("Daft Punk", "Around the World"),
    ("Aphex Twin", "Xtal"),
    ("Daft Punk", "One More Time"),
    ("Burial",    "Archangel"),
]

artistas = {artista for artista, cancion in canciones}
print(artistas)   # {'Daft Punk', 'Aphex Twin', 'Burial'}
```

> Desempaquetamos la tupla directamente en el `for`. Es la forma más concisa de extraer valores únicos de una estructura de datos.

---

## CIERRE (~20 segundos)

> Las set comprehensions son una herramienta simple pero muy útil: cuando querés construir un conjunto de valores únicos a partir de otro iterable, es exactamente lo que necesitás.
>
> ¡Nos vemos!
