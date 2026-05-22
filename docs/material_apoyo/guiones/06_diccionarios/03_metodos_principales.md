# Video 3 — Diccionarios: métodos principales

**Serie:** Diccionarios
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python con un diccionario definido)*

> Hola! En este video vemos los métodos más importantes de los diccionarios: `keys()`, `values()`, `items()`, `update()` y `setdefault()`.

---

## KEYS(), VALUES() E ITEMS() (~2 minutos)

```python
estudiante = {"nombre": "Ana", "nota": 9, "ciudad": "La Plata"}

print(estudiante.keys())    # dict_keys(['nombre', 'nota', 'ciudad'])
print(estudiante.values())  # dict_values(['Ana', 9, 'La Plata'])
print(estudiante.items())   # dict_items([('nombre', 'Ana'), ('nota', 9), ...])
```

> Estos tres métodos devuelven **vistas** del diccionario — no copias. Se usan principalmente para iterar.

*(Mostrar la iteración:)*

```python
# Solo claves
for clave in estudiante.keys():       # o simplemente: for clave in estudiante
    print(clave)

# Solo valores
for valor in estudiante.values():
    print(valor)

# Pares clave-valor — la más usada
for clave, valor in estudiante.items():
    print(f"{clave}: {valor}")
# nombre: Ana
# nota: 9
# ciudad: La Plata
```

> `.items()` devuelve tuplas `(clave, valor)` que desempaquetamos directamente en el `for`. Es la forma más común de iterar un diccionario y la que van a usar el 90% de las veces.

---

## UPDATE(): FUSIONAR O ACTUALIZAR (~1 minuto)

```python
perfil = {"nombre": "Beto", "nota": 7}

# Actualizar varios campos de una vez
perfil.update({"nota": 8, "ciudad": "Ensenada"})
print(perfil)
# {'nombre': 'Beto', 'nota': 8, 'ciudad': 'Ensenada'}
```

> `.update()` recibe otro diccionario y **fusiona** sus claves. Si la clave ya existe, actualiza el valor. Si no existe, la agrega.

---

## SETDEFAULT(): INSERTAR SOLO SI NO EXISTE (~1 minuto)

```python
perfil = {"nombre": "Cami", "nota": 9}

# Solo inserta si la clave NO existe
perfil.setdefault("nota",    5)     # ya existe → no cambia nada
perfil.setdefault("ciudad", "Mar del Plata")  # no existe → se inserta

print(perfil)
# {'nombre': 'Cami', 'nota': 9, 'ciudad': 'Mar del Plata'}
```

> `setdefault()` es ideal para inicializar claves sin pisar valores que ya existen. Lo van a ver mucho en el patrón de contar cosas:

```python
conteo = {}
palabras = ["hola", "mundo", "hola", "python"]

for palabra in palabras:
    conteo.setdefault(palabra, 0)   # inicializar en 0 si no existe
    conteo[palabra] += 1

print(conteo)   # {'hola': 2, 'mundo': 1, 'python': 1}
```

---

## CIERRE (~20 segundos)

> En el próximo video vemos cómo **recorrer** diccionarios e introducimos las **dict comprehensions**.
>
> ¡Nos vemos!
