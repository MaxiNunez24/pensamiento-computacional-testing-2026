# Video 1 — Diccionarios: qué son y cómo se crean

**Serie:** Diccionarios
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video arrancamos con los **Diccionarios**: la colección más usada y versátil de Python. A diferencia de las listas, no accedemos a los datos por posición sino por **clave**.

---

## ¿QUÉ ES UN DICCIONARIO? (~1.5 minutos)

> Imaginen una agenda telefónica: buscan un **nombre** (la clave) y encuentran un **número** (el valor). Eso es exactamente un diccionario.

```python
agenda = {
    "Maxi":  "221-555-1234",
    "Ana":   "221-555-5678",
    "Beto":  "221-555-9012"
}

print(agenda["Maxi"])   # "221-555-1234"
```

> La diferencia con las listas:

```python
lista = ["Ana", "Beto", "Cami"]
lista[0]       # acceso por POSICIÓN numérica

diccionario = {"nombre": "Ana", "edad": 20}
diccionario["nombre"]   # acceso por CLAVE con significado
```

> El diccionario es mejor cuando los datos tienen **nombre propio**: nombre, edad, precio, ciudad. Si son una secuencia de cosas del mismo tipo, probablemente una lista.

---

## CÓMO SE CREAN (~1.5 minutos)

```python
# Con llaves — la forma más común
persona = {
    "nombre": "Maxi",
    "edad":   27,
    "ciudad": "Ensenada"
}

# Diccionario vacío
vacio = {}       # ✅ acá sí son llaves de dict (no de set)
vacio = dict()   # equivalente

# Con dict() y keyword arguments
persona2 = dict(nombre="Ana", edad=20, ciudad="La Plata")
```

> ⚠️ Las claves deben ser **únicas**. Si repetimos una clave, la segunda definición pisa a la primera:

```python
d = {"a": 1, "b": 2, "a": 99}
print(d)   # {'a': 99, 'b': 2} — "a" quedó con el último valor
```

---

## TIPOS DE CLAVES Y VALORES (~1 minuto)

```python
# Las claves pueden ser cualquier tipo INMUTABLE
d = {
    "nombre":    "Ana",     # string como clave
    1:           "uno",     # int como clave
    (35, -58):   "BA",      # tupla como clave
}

# Los valores pueden ser CUALQUIER COSA
estudiante = {
    "nombre":  "Beto",
    "notas":   [7, 8, 9],           # lista como valor
    "activo":  True,                 # bool como valor
    "puntaje": 8.5,                  # float como valor
}
```

> Las claves deben ser inmutables (strings, números, tuplas). Los valores pueden ser cualquier cosa, incluso otras listas o diccionarios.

---

## CIERRE (~20 segundos)

> En el próximo video vemos cómo **acceder y modificar** los datos de un diccionario.
>
> ¡Nos vemos!
