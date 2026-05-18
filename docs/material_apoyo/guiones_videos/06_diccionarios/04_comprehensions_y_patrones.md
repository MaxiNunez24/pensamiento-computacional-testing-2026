# Video 4 — Diccionarios: dict comprehensions y patrones útiles

**Serie:** Diccionarios
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos las **dict comprehensions** — el equivalente de las list comprehensions pero para diccionarios — y dos patrones muy comunes en código real.

---

## DICT COMPREHENSIONS (~2 minutos)

> La sintaxis es `{clave: valor for elemento in iterable if condición}`:

```python
# Cuadrados: número → su cuadrado
cuadrados = {n: n**2 for n in range(1, 6)}
print(cuadrados)   # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
```

> Comparado con el `for` equivalente:

```python
# Equivalente sin comprehension
cuadrados = {}
for n in range(1, 6):
    cuadrados[n] = n ** 2
```

*(Más ejemplos:)*

```python
# Solo los aprobados (filtro con if)
notas     = {"Ana": 9, "Beto": 4, "Cami": 7, "Dante": 3}
aprobados = {nombre: nota for nombre, nota in notas.items() if nota >= 6}
print(aprobados)   # {'Ana': 9, 'Cami': 7}

# Aumentar precios un 10%
precios    = {"manzana": 150, "banana": 80, "naranja": 120}
aumentados = {fruta: round(precio * 1.10) for fruta, precio in precios.items()}
print(aumentados)  # {'manzana': 165, 'banana': 88, 'naranja': 132}

# Invertir un diccionario (claves ↔ valores)
original  = {"a": 1, "b": 2, "c": 3}
invertido = {v: k for k, v in original.items()}
print(invertido)   # {1: 'a', 2: 'b', 3: 'c'}
```

---

## PATRÓN CONTADOR (~1.5 minutos)

> Este patrón es uno de los más usados en Python. Memorícenlo:

```python
texto    = "el gato come el ratón y el gato duerme"
palabras = texto.split()

conteo = {}
for palabra in palabras:
    conteo[palabra] = conteo.get(palabra, 0) + 1

print(conteo)
# {'el': 3, 'gato': 2, 'come': 1, 'ratón': 1, 'y': 1, 'duerme': 1}
```

> `.get(palabra, 0)` devuelve el conteo actual si la palabra ya está, o `0` si es la primera vez que aparece. Luego le sumamos 1.
>
> Este patrón sirve para contar votos, frecuencia de palabras, ocurrencias de eventos, cualquier cosa.

---

## PATRÓN AGRUPAR (~1 minuto)

```python
alumnos = [
    {"nombre": "Ana",   "ciudad": "La Plata"},
    {"nombre": "Beto",  "ciudad": "Ensenada"},
    {"nombre": "Cami",  "ciudad": "La Plata"},
    {"nombre": "Dante", "ciudad": "Ensenada"},
]

por_ciudad = {}
for alumno in alumnos:
    ciudad = alumno["ciudad"]
    por_ciudad.setdefault(ciudad, [])
    por_ciudad[ciudad].append(alumno["nombre"])

print(por_ciudad)
# {'La Plata': ['Ana', 'Cami'], 'Ensenada': ['Beto', 'Dante']}
```

> Agrupamos elementos de una lista en un diccionario según alguna propiedad. Muy útil para organizar datos.

---

## CIERRE (~20 segundos)

> En el próximo y último video de la serie vemos cuándo usar diccionarios y los errores más comunes.
>
> ¡Nos vemos!
