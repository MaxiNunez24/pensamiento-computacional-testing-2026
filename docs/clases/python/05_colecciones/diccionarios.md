# 🗝️ Diccionarios

!!! example "🤔 El problema con las listas cuando los datos tienen nombre"
    Querés guardar los datos de un alumno: nombre, edad y promedio. Con lo que sabemos hasta ahora haríamos algo así:

    ```python
    alumno = ["Ana", 20, 9.5]
    print(alumno[2])   # ¿Qué es esto? ¿El promedio? ¿La edad?
    ```

    El número `2` no dice nada. Si alguien agrega un campo en el medio, todo el código que usa índices se rompe. Necesitamos acceder a los datos **por nombre**, no por posición.

!!! tip "🧠 La colección más poderosa de Python"
    Ya conocemos las listas (ordenadas, con índices), las tuplas (inmutables) y los sets (sin orden, sin duplicados). Ahora llegamos a la última — y probablemente **más usada** — colección de Python: el **diccionario**.

    Un diccionario es una colección de pares **clave → valor**. En lugar de acceder a los elementos por posición (`xs[0]`), accedés por una **clave con significado** (`persona["nombre"]`).

!!! info "🎯 Objetivos de la clase"
    Al terminar la clase deberían poder:

    - Crear, modificar y recorrer **diccionarios**.
    - Usar los métodos más importantes: `.keys()`, `.values()`, `.items()`, `.get()`, `.update()`, `.pop()`.
    - Trabajar con **diccionarios anidados**.
    - Escribir **dict comprehensions**.
    - Saber **cuándo usar un diccionario** frente a otras colecciones.

---

## 🧠 ¿Qué es un diccionario?

Pensá en un diccionario real: buscás una **palabra** (clave) y encontrás su **definición** (valor). O en una agenda telefónica: buscás un **nombre** y encontrás su **número**.

```python
agenda = {
    "Maxi":  "221-555-1234",
    "Ana":   "221-555-5678",
    "Beto":  "221-555-9012"
}

print(agenda["Maxi"])  # "221-555-1234"
```

La diferencia clave con las listas:

| Colección | Acceso | Ejemplo |
|-----------|--------|---------|
| Lista | Por **índice** (posición numérica) | `xs[0]` |
| Diccionario | Por **clave** (cualquier inmutable) | `d["nombre"]` |

!!! tip "🧠 Tip mental"
    Si los datos tienen **nombre propio** (nombre, edad, precio, etc.), probablemente necesitás un diccionario. Si son una secuencia de cosas del mismo tipo (notas, temperaturas, productos), probablemente una lista.

---

## 🔧 Cómo se crean

=== "📖 Sintaxis básica"

    ```python
    # Con llaves: { clave: valor, ... }
    persona = {
        "nombre": "Maxi",
        "edad":   27,
        "ciudad": "Ensenada"
    }

    # Diccionario vacío
    vacio = {}        # ← acá sí son llaves de dict, no de set
    vacio = dict()    # equivalente
    ```

=== "🏗️ Con `dict()`"

    ```python
    # Con keyword arguments
    persona = dict(nombre="Maxi", edad=27, ciudad="Ensenada")
    print(persona)
    # {'nombre': 'Maxi', 'edad': 27, 'ciudad': 'Ensenada'}
    ```

=== "📋 Desde una lista de tuplas"

    ```python
    # Útil cuando los datos vienen de otro lado
    pares = [("nombre", "Maxi"), ("edad", 27)]
    persona = dict(pares)
    print(persona)
    # {'nombre': 'Maxi', 'edad': 27}
    ```

=== "🤐 Con `zip()` (dos listas paralelas)"

    `zip()` une dos iterables en pares de tuplas. Combinado con `dict()` es muy elegante para construir un diccionario cuando tenés claves y valores en listas separadas.

    ```python
    claves  = ["nombre", "edad", "ciudad"]
    valores = ["Maxi", 27, "Ensenada"]

    persona = dict(zip(claves, valores))
    print(persona)
    # {'nombre': 'Maxi', 'edad': 27, 'ciudad': 'Ensenada'}
    ```

    !!! tip "📦 Explicación completa de `zip()`"
        Vimos `zip()` en detalle en la clase de [Tuplas y Sets](./tuplas_sets.md), incluyendo el truco de `zip(*matriz)` para recorrer columnas.

!!! warning "⚠️ Las claves deben ser únicas"
    Si repetís una clave, la segunda definición **pisa** a la primera:

    ```python
    d = {"a": 1, "b": 2, "a": 99}
    print(d)  # {'a': 99, 'b': 2}
    ```

---

## 🔍 Acceso a elementos

=== "🗝️ Por corchetes"

    ```python
    persona = {"nombre": "Maxi", "edad": 27}

    print(persona["nombre"])  # "Maxi"
    print(persona["edad"])    # 27

    # ❌ Si la clave no existe → KeyError
    print(persona["apellido"])  # KeyError: 'apellido'
    ```

=== "🛡️ Con `.get()` (más seguro)"

    `.get(clave)` devuelve el valor si existe, o `None` si no. Podés dar un **valor por defecto** como segundo argumento.

    ```python
    persona = {"nombre": "Maxi", "edad": 27}

    print(persona.get("nombre"))           # "Maxi"
    print(persona.get("apellido"))         # None (sin error)
    print(persona.get("apellido", "N/A"))  # "N/A"
    ```

    !!! tip "💡 ¿Cuándo usar `.get()`?"
        Siempre que no estés seguro de que la clave existe. En código de producción, `.get()` es más seguro que `[]`.

=== "✅ Verificar existencia"

    ```python
    persona = {"nombre": "Maxi", "edad": 27}

    print("nombre" in persona)     # True
    print("apellido" in persona)   # False
    print(27 in persona.values())  # True
    ```

---

## ✏️ Modificar, agregar y eliminar

```python
persona = {"nombre": "Maxi", "edad": 27}

# Modificar un valor existente
persona["edad"] = 28
print(persona)  # {'nombre': 'Maxi', 'edad': 28}

# Agregar una clave nueva
persona["ciudad"] = "Ensenada"
print(persona)  # {'nombre': 'Maxi', 'edad': 28, 'ciudad': 'Ensenada'}

# Eliminar con del
del persona["ciudad"]
print(persona)  # {'nombre': 'Maxi', 'edad': 28}

# Eliminar y obtener el valor con .pop()
edad = persona.pop("edad")
print(edad)     # 28
print(persona)  # {'nombre': 'Maxi'}

# .pop() con default (no lanza error si no existe)
x = persona.pop("apellido", "desconocido")
print(x)  # "desconocido"

# Vaciar completamente
persona.clear()
print(persona)  # {}
```

---

## 🛠️ Métodos principales

| Método | Qué devuelve | Ejemplo |
|--------|-------------|---------|
| `.keys()` | Todas las claves | `d.keys()` → `dict_keys(['a', 'b'])` |
| `.values()` | Todos los valores | `d.values()` → `dict_values([1, 2])` |
| `.items()` | Pares `(clave, valor)` | `d.items()` → `dict_items([('a', 1)])` |
| `.get(k, def)` | Valor o default | `d.get("x", 0)` → `0` |
| `.update(d2)` | Fusiona dos dicts | `d.update({"c": 3})` |
| `.pop(k, def)` | Elimina y devuelve | `d.pop("a")` → `1` |
| `.setdefault(k, v)` | Inserta solo si no existe | `d.setdefault("x", 0)` |

```python
estudiante = {"nombre": "Ana", "nota": 9}

# .update() — agregar o actualizar varios de una vez
estudiante.update({"nota": 10, "materia": "Python"})
print(estudiante)
# {'nombre': 'Ana', 'nota': 10, 'materia': 'Python'}

# .setdefault() — solo inserta si la clave NO existe
estudiante.setdefault("nota", 5)    # ya existe → no cambia nada
estudiante.setdefault("año", 2026)  # no existe → se inserta
print(estudiante)
# {'nombre': 'Ana', 'nota': 10, 'materia': 'Python', 'año': 2026}
```

---

## 🔁 Iteración

=== "🗝️ Solo claves (por defecto)"

    ```python
    persona = {"nombre": "Maxi", "edad": 27, "ciudad": "Ensenada"}

    for clave in persona:
        print(clave)
    # nombre
    # edad
    # ciudad
    ```

=== "📦 Solo valores"

    ```python
    for valor in persona.values():
        print(valor)
    # Maxi
    # 27
    # Ensenada
    ```

=== "🔑 Pares clave-valor (lo más común)"

    `.items()` devuelve tuplas `(clave, valor)` que podés desempaquetar directamente.

    ```python
    for clave, valor in persona.items():
        print(f"{clave}: {valor}")
    # nombre: Maxi
    # edad: 27
    # ciudad: Ensenada
    ```

!!! tip "⭐ `.items()` es tu mejor amiga"
    En la práctica, el 90% de las veces que iterás un diccionario vas a querer tanto la clave como el valor → usá `.items()`.

---

## 🪆 Diccionarios anidados

Un diccionario puede contener otros diccionarios como valores. Esto permite modelar **datos más complejos**.

```python
curso = {
    "nombre": "Pensamiento Computacional",
    "año": 2026,
    "alumnos": {
        "Ana":  {"nota": 9,  "asistencia": "95%"},
        "Beto": {"nota": 7,  "asistencia": "80%"},
        "Cami": {"nota": 10, "asistencia": "100%"},
    }
}

# Acceso encadenado
print(curso["alumnos"]["Ana"]["nota"])  # 9

# Iterar el diccionario interno
for alumno, datos in curso["alumnos"].items():
    print(f"{alumno} → nota: {datos['nota']}, asistencia: {datos['asistencia']}")
```

!!! warning "⚠️ No abusar del anidamiento"
    Los diccionarios muy profundamente anidados se vuelven difíciles de leer y mantener. Más de 2-3 niveles es señal de que probablemente necesitás modelar mejor el problema.

---

## ✨ Dict Comprehensions

Al igual que las list comprehensions, existen las **dict comprehensions**:

```python
# { clave: valor  for elemento in iterable  if condición }

# Cuadrados: número → su cuadrado
cuadrados = {n: n**2 for n in range(1, 6)}
print(cuadrados)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Invertir un diccionario (valor → clave)
original  = {"a": 1, "b": 2, "c": 3}
invertido = {v: k for k, v in original.items()}
print(invertido)  # {1: 'a', 2: 'b', 3: 'c'}

# Solo alumnos aprobados
notas     = {"Ana": 9, "Beto": 4, "Cami": 7, "Dante": 3}
aprobados = {nombre: nota for nombre, nota in notas.items() if nota >= 6}
print(aprobados)  # {'Ana': 9, 'Cami': 7}
```

---

## 🎯 ¿Cuándo usar diccionarios?

!!! success "✅ Usá diccionarios cuando..."
    - Los datos tienen **atributos con nombre**: `{"nombre": "Ana", "edad": 20}`.
    - Necesitás **búsqueda rápida por clave** (O(1), igual que sets).
    - Querés **contar o agrupar** cosas: `{"Python": 5, "Java": 3}`.
    - Modelás **entidades del mundo real**: un alumno, un producto, una clase.

!!! warning "❌ NO uses diccionarios cuando..."
    - Los datos son una secuencia simple del mismo tipo → lista.
    - Solo necesitás saber si algo está en la colección → set.

### 🌟 Patrón muy útil: contar elementos

```python
texto    = "el gato come el ratón y el gato duerme"
palabras = texto.split()

conteo = {}
for palabra in palabras:
    conteo[palabra] = conteo.get(palabra, 0) + 1

print(conteo)
# {'el': 3, 'gato': 2, 'come': 1, 'ratón': 1, 'y': 1, 'duerme': 1}
```

Este patrón **"contador con `.get(k, 0) + 1`"** es uno de los más usados en Python. Memorizalo.

---

## 🎮 Ejercicios

!!! tip "🧪 Los ejercicios ahora son interactivos"
    Escribís el código, lo ejecutás con **Python de verdad en el navegador** y los tests te dicen al
    instante si está bien. Sin instalar nada: funciona desde la máquina del CFP, desde tu casa y
    desde el celular. Tu avance **se guarda solo**.

    Si te trabás, cada ejercicio tiene pistas — y un botón para mandarme tu código y tu consulta.

    [🚀 Ir a los ejercicios de Diccionarios](/pensamiento-computacional-testing-2026/ejercicios/clases/diccionarios/){ .md-button .md-button--primary }

## 📌 Cheatsheet final

```python
# Crear
d = {"clave": "valor", "otra": 42}
d = dict(clave="valor", otra=42)
d = {}            # vacío (¡no set!)

# Acceder
d["clave"]                      # KeyError si no existe
d.get("clave")                  # None si no existe
d.get("clave", "por defecto")   # valor por defecto

# Modificar / agregar
d["nueva"] = 99
d.update({"x": 1, "y": 2})

# Eliminar
del d["clave"]
valor = d.pop("clave")
valor = d.pop("clave", None)    # sin error si no existe
d.clear()

# Verificar
"clave" in d
"val"   in d.values()

# Iterar
for clave in d:                       # solo claves
for valor in d.values():              # solo valores
for clave, valor in d.items():        # pares (lo más común ⭐)

# Comprehension
{k: v * 2 for k, v in d.items() if v > 0}

# Patrón contador
for x in coleccion:
    conteo[x] = conteo.get(x, 0) + 1
```

---

## 🚀 ¿Y ahora qué viene?

!!! success "🎯 Próxima clase: Funciones I"
    En la próxima clase arrancamos con **funciones** 🧱 — la herramienta para evitar repetir código y empezar a pensar en bloques reutilizables.

    ```python
    def saludar(nombre):
        return f"Hola, {nombre}!"

    print(saludar("Maxi"))  # Hola, Maxi!
    print(saludar("Ana"))   # Hola, Ana!
    ```

¡Nos vemos el viernes! 🗝️✨

---

## [⬅️ Anterior: Tuplas y Sets](./tuplas_sets.md)
## [📚 Índice](../../clases.md#colecciones)
## [➡️ Siguiente: Funciones I](../06_funciones/funciones_1.md)
