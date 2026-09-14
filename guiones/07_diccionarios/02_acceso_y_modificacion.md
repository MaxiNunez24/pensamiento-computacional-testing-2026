# Video 2 — Diccionarios: acceso y modificación

**Serie:** Diccionarios
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python con un diccionario definido)*

> Hola! En este video vemos cómo **acceder a los valores** de un diccionario y cómo **modificarlo**: agregar claves, cambiar valores y eliminar entradas.

---

## ACCESO POR CLAVE (~1.5 minutos)

```python
persona = {"nombre": "Maxi", "edad": 27, "ciudad": "Ensenada"}

# Con corchetes
print(persona["nombre"])   # Maxi
print(persona["edad"])     # 27
```

> Accedemos con corchetes y la clave entre comillas. Si la clave existe, devuelve el valor. Si no existe:

```python
print(persona["apellido"])   # ❌ KeyError: 'apellido'
```

> Para evitar el `KeyError`, usamos `.get()`:

```python
print(persona.get("nombre"))             # Maxi
print(persona.get("apellido"))           # None — sin error
print(persona.get("apellido", "N/A"))   # N/A — valor por defecto
```

> `.get(clave)` devuelve el valor si existe, o `None` si no. `.get(clave, default)` devuelve el default en lugar de `None`. En código real, `.get()` es más seguro que los corchetes cuando no estamos seguros de que la clave existe.

```python
# Verificar si una clave existe
print("nombre" in persona)      # True
print("apellido" in persona)    # False
```

---

## MODIFICAR Y AGREGAR (~1.5 minutos)

```python
persona = {"nombre": "Maxi", "edad": 27}

# Modificar un valor existente
persona["edad"] = 28
print(persona)   # {'nombre': 'Maxi', 'edad': 28}

# Agregar una clave nueva — misma sintaxis
persona["ciudad"] = "Ensenada"
print(persona)   # {'nombre': 'Maxi', 'edad': 28, 'ciudad': 'Ensenada'}
```

> La misma sintaxis sirve para modificar y para agregar. Si la clave existe, actualiza el valor. Si no existe, crea la clave nueva.

---

## ELIMINAR (~1 minuto)

```python
persona = {"nombre": "Maxi", "edad": 28, "ciudad": "Ensenada"}

# del — elimina sin devolver
del persona["ciudad"]
print(persona)   # {'nombre': 'Maxi', 'edad': 28}

# .pop() — elimina y devuelve el valor
edad = persona.pop("edad")
print(edad)      # 28
print(persona)   # {'nombre': 'Maxi'}

# .pop() con default — sin error si no existe
x = persona.pop("apellido", "desconocido")
print(x)   # "desconocido"

# .clear() — vacía completamente
persona.clear()
print(persona)   # {}
```

> `.pop()` es ideal cuando necesitamos el valor antes de descartarlo. Con el segundo argumento evitamos el `KeyError` si la clave no existe.

---

## CIERRE (~20 segundos)

> En el próximo video vemos los **métodos principales** de los diccionarios: `keys()`, `values()`, `items()` y `update()`.
>
> ¡Nos vemos!
