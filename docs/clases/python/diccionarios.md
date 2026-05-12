# 🗝️ Diccionarios

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

!!! info "📌 Escalera de dificultad habitual"
    - 🌱 Aplicación directa.
    - 🌿 Combinación de conceptos.
    - 🌶️ Pensamiento más abstracto.

### 🌱 Ejercicio 1 — Tu primera agenda

Creá un diccionario `agenda` con al menos 4 contactos (nombre → teléfono). Luego:

1. Imprimí el teléfono de uno usando `[]`.
2. Intentá acceder a un contacto inexistente con `.get()` y un valor por defecto.
3. Agregá un contacto nuevo.
4. Eliminá uno existente con `.pop()`.
5. Imprimí todos los contactos con `for` y `.items()`.

??? success "✅ Solución"
    ```python
    agenda = {
        "Maxi":  "221-555-1234",
        "Ana":   "221-555-5678",
        "Beto":  "221-555-9012",
        "Cami":  "221-555-3456"
    }

    print(agenda["Ana"])
    print(agenda.get("Dante", "No encontrado"))
    agenda["Dante"] = "221-555-7890"
    agenda.pop("Beto")
    for nombre, tel in agenda.items():
        print(f"{nombre}: {tel}")
    ```

### 🌱 Ejercicio 2 — Contador de votos

Dada esta lista de votos:

```python
votos = ["Python", "Java", "Python", "C++", "Python", "Java", "Go", "Python", "C++"]
```

Usá el patrón "contador con `.get()`" para construir un diccionario `conteo` con la cantidad de votos de cada lenguaje.

??? tip "💡 Pista"
    `conteo[v] = conteo.get(v, 0) + 1` dentro de un `for`.

??? success "✅ Solución"
    ```python
    votos = ["Python", "Java", "Python", "C++", "Python", "Java", "Go", "Python", "C++"]

    conteo = {}
    for v in votos:
        conteo[v] = conteo.get(v, 0) + 1

    print(conteo)
    # {'Python': 4, 'Java': 2, 'C++': 2, 'Go': 1}
    ```

### 🌿 Ejercicio 3 — El boletín de notas

Tenés este diccionario:

```python
notas = {
    "Ana":   [8, 9, 10],
    "Beto":  [5, 6, 4],
    "Cami":  [7, 8, 9],
    "Dante": [3, 4, 5],
    "Eva":   [10, 10, 9]
}
```

1. Calculá e imprimí el **promedio** de cada alumno.
2. Imprimí solo los **aprobados** (promedio ≥ 6).
3. Encontrá al alumno con el **mejor promedio**.

??? tip "💡 Pista"
    Usá `.items()` para iterar. Para el mejor, reutilizá la lógica de "mayor" de ejercicios anteriores.

??? success "✅ Solución"
    ```python
    notas = {
        "Ana":   [8, 9, 10],
        "Beto":  [5, 6, 4],
        "Cami":  [7, 8, 9],
        "Dante": [3, 4, 5],
        "Eva":   [10, 10, 9]
    }

    print("=== Promedios ===")
    promedios = {}
    for alumno, lista in notas.items():
        prom = sum(lista) / len(lista)
        promedios[alumno] = prom
        print(f"{alumno}: {prom:.2f}")

    print("\n=== Aprobados ===")
    for alumno, prom in promedios.items():
        if prom >= 6:
            print(f"✅ {alumno}: {prom:.2f}")

    mejor = max(promedios, key=promedios.get)
    print(f"\n🏆 Mejor: {mejor} ({promedios[mejor]:.2f})")
    ```

### 🌿 Ejercicio 4 — Dict comprehensions

Usando dict comprehensions resolvé:

1. Dado `numeros = list(range(1, 11))`, creá `{n: "par" if n % 2 == 0 else "impar" for ...}`.
2. Dado `precios = {"manzana": 150, "banana": 80, "naranja": 120, "uva": 200}`, creá un dict con solo las frutas que cuestan **menos de 130**.
3. Del mismo `precios`, creá un dict con los precios **aumentados un 10%**.

??? success "✅ Solución"
    ```python
    numeros = list(range(1, 11))
    paridad = {n: "par" if n % 2 == 0 else "impar" for n in numeros}
    print(paridad)

    precios = {"manzana": 150, "banana": 80, "naranja": 120, "uva": 200}
    baratas    = {f: p for f, p in precios.items() if p < 130}
    aumentados = {f: round(p * 1.10) for f, p in precios.items()}
    print(baratas)     # {'banana': 80, 'naranja': 120}
    print(aumentados)  # {'manzana': 165, 'banana': 88, 'naranja': 132, 'uva': 220}
    ```

### 🌶️ Ejercicio 5 — Inventario de una tienda

```python
inventario = {
    "laptop":      {"precio": 1500, "stock": 3, "categoria": "electronica"},
    "mouse":       {"precio": 250,  "stock": 0, "categoria": "electronica"},
    "teclado":     {"precio": 800,  "stock": 5, "categoria": "electronica"},
    "silla":       {"precio": 1200, "stock": 2, "categoria": "muebles"},
    "escritorio":  {"precio": 2500, "stock": 1, "categoria": "muebles"},
    "auriculares": {"precio": 400,  "stock": 8, "categoria": "electronica"},
}
```

1. Imprimí todos los productos **disponibles** (stock > 0) con su precio.
2. Calculá el **valor total del inventario** (precio × stock de cada producto).
3. Imprimí cuántos productos hay por **categoría**.
4. Encontrá el **producto más caro** disponible.

??? tip "💡 Pista (parte 3)"
    Usá el patrón contador: `categorias[cat] = categorias.get(cat, 0) + 1`.

??? success "✅ Solución"
    ```python
    inventario = {
        "laptop":      {"precio": 1500, "stock": 3, "categoria": "electronica"},
        "mouse":       {"precio": 250,  "stock": 0, "categoria": "electronica"},
        "teclado":     {"precio": 800,  "stock": 5, "categoria": "electronica"},
        "silla":       {"precio": 1200, "stock": 2, "categoria": "muebles"},
        "escritorio":  {"precio": 2500, "stock": 1, "categoria": "muebles"},
        "auriculares": {"precio": 400,  "stock": 8, "categoria": "electronica"},
    }

    print("=== Disponibles ===")
    for producto, d in inventario.items():
        if d["stock"] > 0:
            print(f"- {producto}: ${d['precio']} (stock: {d['stock']})")

    total = sum(d["precio"] * d["stock"] for d in inventario.values())
    print(f"\nValor total: ${total}")

    categorias = {}
    for d in inventario.values():
        cat = d["categoria"]
        categorias[cat] = categorias.get(cat, 0) + 1
    print(f"\nPor categoría: {categorias}")

    disponibles = {p: d for p, d in inventario.items() if d["stock"] > 0}
    mas_caro    = max(disponibles, key=lambda p: disponibles[p]["precio"])
    print(f"\nMás caro disponible: {mas_caro} (${disponibles[mas_caro]['precio']})")
    ```

### 🌶️🌶️ Ejercicio 6 — Tabla de posiciones ⚽

Tenés los resultados de una liga:

```python
partidos = [
    {"local": "Boca",        "visitante": "River",       "goles_local": 2, "goles_visitante": 1},
    {"local": "River",       "visitante": "San Lorenzo", "goles_local": 0, "goles_visitante": 0},
    {"local": "Boca",        "visitante": "Independiente","goles_local": 3, "goles_visitante": 1},
    {"local": "San Lorenzo", "visitante": "Boca",        "goles_local": 1, "goles_visitante": 2},
    {"local": "Independiente","visitante": "River",      "goles_local": 2, "goles_visitante": 2},
    {"local": "River",       "visitante": "Boca",        "goles_local": 1, "goles_visitante": 0},
]
```

Construí una **tabla de posiciones** (dict de dicts) con puntos, partidos jugados, goles a favor y en contra. Victoria = 3 pts, empate = 1 pt, derrota = 0 pts. Imprimí la tabla ordenada por puntos.

??? tip "💡 Pista"
    Usá `.setdefault()` para inicializar cada equipo. Podés ordenar con `sorted(tabla.items(), key=lambda x: x[1]["puntos"], reverse=True)`.

??? success "✅ Solución"
    ```python
    partidos = [
        {"local": "Boca",        "visitante": "River",       "goles_local": 2, "goles_visitante": 1},
        {"local": "River",       "visitante": "San Lorenzo", "goles_local": 0, "goles_visitante": 0},
        {"local": "Boca",        "visitante": "Independiente","goles_local": 3, "goles_visitante": 1},
        {"local": "San Lorenzo", "visitante": "Boca",        "goles_local": 1, "goles_visitante": 2},
        {"local": "Independiente","visitante": "River",      "goles_local": 2, "goles_visitante": 2},
        {"local": "River",       "visitante": "Boca",        "goles_local": 1, "goles_visitante": 0},
    ]

    tabla = {}

    def init(tabla, equipo):
        tabla.setdefault(equipo, {"pts": 0, "pj": 0, "gf": 0, "gc": 0})

    for p in partidos:
        loc, vis = p["local"], p["visitante"]
        gl, gv   = p["goles_local"], p["goles_visitante"]
        init(tabla, loc); init(tabla, vis)
        tabla[loc]["pj"] += 1;  tabla[vis]["pj"] += 1
        tabla[loc]["gf"] += gl; tabla[loc]["gc"] += gv
        tabla[vis]["gf"] += gv; tabla[vis]["gc"] += gl
        if   gl > gv: tabla[loc]["pts"] += 3
        elif gl == gv: tabla[loc]["pts"] += 1; tabla[vis]["pts"] += 1
        else:          tabla[vis]["pts"] += 3

    print(f"{'Equipo':<15} {'PJ':>3} {'PTS':>4} {'GF':>4} {'GC':>4} {'DIF':>4}")
    print("-" * 36)
    for equipo, s in sorted(tabla.items(), key=lambda x: x[1]["pts"], reverse=True):
        dif = s["gf"] - s["gc"]
        print(f"{equipo:<15} {s['pj']:>3} {s['pts']:>4} {s['gf']:>4} {s['gc']:>4} {dif:>+4}")
    ```

---

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
## [📚 Índice](../clases.md#colecciones)
## [➡️ Siguiente: Funciones I](./funciones_1.md)
