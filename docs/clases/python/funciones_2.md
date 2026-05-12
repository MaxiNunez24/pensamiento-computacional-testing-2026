# 📦 Funciones II — Scope, parámetros avanzados y `*args`/`**kwargs`

!!! tip "🔍 Profundizando en las funciones"
    En la clase anterior aprendimos a definir funciones con parámetros y retorno. Hoy vamos a entender cómo las funciones "ven" las variables (scope), cómo hacer parámetros más flexibles con valores por defecto, y cómo manejar funciones que reciben una cantidad variable de argumentos.

!!! info "🎯 Objetivos de la clase"
    Al terminar la clase deberían poder:

    - Explicar qué es el **scope** y por qué importa.
    - Usar **parámetros con valores por defecto**.
    - Pasar argumentos **por nombre** (keyword arguments).
    - Entender `*args` y `**kwargs` y saber cuándo usarlos.

---

## 🔭 Scope: ¿qué puede "ver" una función?

El **scope** (ámbito) define en qué parte del código una variable existe y puede ser usada.

### 📍 Scope local

Las variables creadas **dentro** de una función solo existen mientras esa función se ejecuta. Al terminar, desaparecen.

```python
def calcular():
    resultado = 42      # variable LOCAL: vive solo dentro de calcular()
    return resultado

calcular()
print(resultado)  # ❌ NameError: 'resultado' no existe acá afuera
```

### 🌍 Scope global

Las variables creadas **fuera** de cualquier función son globales y pueden ser **leídas** desde dentro.

```python
saludo = "Hola"   # variable GLOBAL

def mostrar():
    print(saludo)  # ✅ puede LEER la variable global

mostrar()  # Hola
```

### ⚡ La regla fundamental

!!! warning "⚠️ Las funciones pueden LEER variables globales, pero no modificarlas directamente"

    ```python
    contador = 0

    def incrementar():
        contador += 1  # ❌ UnboundLocalError
        # Python ve que 'contador' aparece en una asignación dentro de la función
        # → la trata como LOCAL → pero no fue definida localmente → error

    # La solución correcta: pasarla como parámetro y retornarla
    def incrementar(contador):
        return contador + 1

    contador = incrementar(contador)
    print(contador)  # 1
    ```

!!! tip "🧠 Regla de oro del scope"
    Si una función necesita un dato de afuera → **pasalo como parámetro**.
    Si una función produce un dato que necesita afuera → **retornalo con `return`**.

    Evitá depender de variables globales dentro de funciones: hace el código difícil de testear y entender.

### 🪆 Variables locales "tapan" a las globales

```python
x = "global"

def foo():
    x = "local"   # variable LOCAL, no toca la global
    print(x)      # "local"

foo()
print(x)   # "global" ← no se modificó
```

---

## ⚙️ Parámetros con valores por defecto

Podés darle a un parámetro un **valor por defecto** que se usa cuando ese argumento no se pasa:

```python
def saludar(nombre, saludo="Hola"):
    return f"{saludo}, {nombre}!"

print(saludar("Maxi"))                # "Hola, Maxi!"       ← usa el default
print(saludar("Ana", "Buenos días"))  # "Buenos días, Ana!" ← usa el argumento
```

!!! warning "⚠️ Los parámetros con default van AL FINAL"
    ```python
    # ✅ Correcto: parámetros sin default primero
    def conectar(host, puerto=8080, seguro=True):
        ...

    # ❌ SyntaxError: el sin default no puede ir después de uno con default
    def conectar(host="localhost", puerto, seguro=True):
        ...
    ```

---

## 🏷️ Argumentos por nombre (keyword arguments)

Al llamar una función, podés especificar **a qué parámetro** va cada argumento usando su nombre. El orden ya no importa.

```python
def crear_usuario(nombre, edad, ciudad, activo=True):
    return {"nombre": nombre, "edad": edad, "ciudad": ciudad, "activo": activo}

# Llamada posicional (orden importa)
u1 = crear_usuario("Maxi", 27, "Ensenada")

# Llamada con keywords (orden no importa)
u2 = crear_usuario(ciudad="La Plata", nombre="Ana", edad=20)

# Mezcla: posicionales primero, keywords después
u3 = crear_usuario("Beto", 25, ciudad="Mar del Plata", activo=False)
```

!!! tip "💡 ¿Cuándo usar keyword arguments?"
    - Cuando una función tiene **muchos parámetros** y el orden no es obvio.
    - Cuando solo querés cambiar **uno** de varios parámetros con default.
    - Para hacer el código más autodocumentado: `conectar(seguro=False)` es más claro que `conectar("localhost", 8080, False)`.

---

## ✨ `*args`: cantidad variable de argumentos posicionales

¿Qué pasa si no sabés de antemano cuántos argumentos va a recibir tu función?

```python
def sumar_todo(*args):
    print(type(args))  # <class 'tuple'>
    return sum(args)

print(sumar_todo(1, 2, 3))          # 6
print(sumar_todo(10, 20))           # 30
print(sumar_todo(1, 2, 3, 4, 5))   # 15
```

`*args` captura **todos los argumentos posicionales extra** en una **tupla**. El nombre `args` es convención; lo importante es el `*`.

```python
def describir_persona(nombre, *hobbies):
    print(f"{nombre} le gusta: {', '.join(hobbies)}")

describir_persona("Maxi", "música", "programación", "ajedrez")
# Maxi le gusta: música, programación, ajedrez

describir_persona("Ana", "leer")
# Ana le gusta: leer
```

---

## ✨ `**kwargs`: cantidad variable de argumentos nombrados

`**kwargs` captura **argumentos keyword extra** en un **diccionario**:

```python
def mostrar_info(**kwargs):
    print(type(kwargs))  # <class 'dict'>
    for clave, valor in kwargs.items():
        print(f"  {clave}: {valor}")

mostrar_info(nombre="Maxi", edad=27, ciudad="Ensenada")
# nombre: Maxi
# edad: 27
# ciudad: Ensenada
```

!!! info "🧠 ¿Por qué existen `*args` y `**kwargs`?"
    Son útiles cuando escribís funciones que deben ser **genéricas** o **extensibles**: wrappers, funciones de logging, APIs flexibles. En código básico no los vas a usar mucho todavía, pero los vas a **ver constantemente** en librerías de Python. La idea es que cuando aparezcan en código de terceros, sepas exactamente qué significan.

### 🔢 El orden de los parámetros

Cuando combinás todo, el orden es estricto:

```python
def todo(pos1, pos2, *args, kwonly=True, **kwargs):
    pass
```

| Tipo | Descripción |
|------|-------------|
| Parámetros normales | `pos1, pos2` — primero |
| `*args` | Captura posicionales extra |
| Parámetros solo-keyword | Después del `*`, solo se pueden pasar por nombre |
| `**kwargs` | Captura keyword extra — último |

!!! tip "🧘 No te abrumes"
    Para el 95% del código de este curso, alcanza con parámetros normales y valores por defecto. `*args` y `**kwargs` están acá para que los reconozcas cuando los veas, no para usarlos en todo.

---

## 🎮 Ejercicios

### 🌱 Ejercicio 1 — Scope: ¿qué imprime?

Antes de ejecutarlo, adiviná qué imprime cada bloque:

```python
# Bloque A
x = 10
def doble():
    return x * 2
print(doble())

# Bloque B
def triple():
    y = 5
    return y * 3
triple()
print(y)   # ¿?

# Bloque C
z = "global"
def cambiar():
    z = "local"
cambiar()
print(z)   # ¿?
```

??? success "✅ Solución"
    ```
    Bloque A: 20         ← lee la variable global x
    Bloque B: NameError  ← 'y' no existe fuera de la función
    Bloque C: "global"   ← la función crea su propia 'z' local, no toca la global
    ```

### 🌱 Ejercicio 2 — Valores por defecto

Escribí `saludar_formal(nombre, titulo="Sr./Sra.", idioma="es")` que devuelva:

- En español (`"es"`): `"Buenos días, {titulo} {nombre}."`
- En inglés (`"en"`): `"Good morning, {titulo} {nombre}."`

Probala con distintas combinaciones de argumentos.

??? success "✅ Solución"
    ```python
    def saludar_formal(nombre, titulo="Sr./Sra.", idioma="es"):
        if idioma == "en":
            return f"Good morning, {titulo} {nombre}."
        return f"Buenos días, {titulo} {nombre}."

    print(saludar_formal("García"))
    print(saludar_formal("Smith", titulo="Dr.", idioma="en"))
    print(saludar_formal("López", idioma="es", titulo="Ing."))
    ```

### 🌿 Ejercicio 3 — `*args` en acción

Escribí las siguientes funciones usando `*args`:

1. `maximo(*nums)` → devuelve el mayor **sin usar `max()`**.
2. `concatenar(*palabras, separador=" ")` → une las palabras con el separador.
3. `promedio(*nums)` → calcula el promedio; si no recibe números, devuelve `0`.

??? success "✅ Solución"
    ```python
    def maximo(*nums):
        mayor = nums[0]
        for n in nums:
            if n > mayor:
                mayor = n
        return mayor

    def concatenar(*palabras, separador=" "):
        return separador.join(palabras)

    def promedio(*nums):
        if not nums:
            return 0
        return sum(nums) / len(nums)

    print(maximo(3, 7, 2, 9, 4))                    # 9
    print(concatenar("hola", "mundo"))               # "hola mundo"
    print(concatenar("a", "b", "c", separador="-")) # "a-b-c"
    print(promedio(4, 8, 6))                         # 6.0
    print(promedio())                                # 0
    ```

### 🌿 Ejercicio 4 — Perfiles con `**kwargs`

Escribí `crear_perfil(nombre, **datos)` que construya y devuelva un diccionario con `nombre` como clave fija y el resto de los datos que lleguen por `**kwargs`.

```python
p = crear_perfil("Maxi", edad=27, ciudad="Ensenada", activo=True)
# {"nombre": "Maxi", "edad": 27, "ciudad": "Ensenada", "activo": True}
```

??? success "✅ Solución"
    ```python
    def crear_perfil(nombre, **datos):
        return {"nombre": nombre, **datos}

    print(crear_perfil("Maxi", edad=27, ciudad="Ensenada"))
    print(crear_perfil("Ana", materia="Python", nota=9))
    ```

### 🌶️ Ejercicio 5 — Logger flexible

Escribí `log(nivel, *mensajes, separador="\n", prefijo="")` que imprima cada mensaje precedido de `[{nivel}] {prefijo}`, uniendo los mensajes con `separador`.

```python
log("INFO", "Sistema iniciado", "Conexión establecida")
# [INFO] Sistema iniciado
# [INFO] Conexión establecida

log("ERROR", "Fallo de red", "Reintentando...", prefijo=">> ")
# [ERROR] >> Fallo de red
# [ERROR] >> Reintentando...

log("DEBUG", "a=1", "b=2", "c=3", separador=" | ")
# [DEBUG] a=1 | [DEBUG] b=2 | [DEBUG] c=3
```

??? success "✅ Solución"
    ```python
    def log(nivel, *mensajes, separador="\n", prefijo=""):
        lineas = [f"[{nivel}] {prefijo}{msg}" for msg in mensajes]
        print(separador.join(lineas))

    log("INFO", "Sistema iniciado", "Conexión establecida")
    print()
    log("ERROR", "Fallo de red", "Reintentando...", prefijo=">> ")
    print()
    log("DEBUG", "a=1", "b=2", "c=3", separador=" | ")
    ```

### 🌶️🌶️ Ejercicio 6 — Mini-framework de reportes 📊

Creá un sistema de reportes con las siguientes funciones:

1. `agregar_fila(tabla, **campos)` → agrega un dict de campos a la lista `tabla`.
2. `filtrar(tabla, **criterios)` → devuelve las filas donde todos los criterios coinciden.
3. `proyectar(tabla, *columnas)` → devuelve las filas con solo las columnas indicadas.
4. `imprimir_tabla(tabla)` → imprime la tabla formateada con encabezados.

```python
tabla = []
agregar_fila(tabla, nombre="Ana",   nota=9, ciudad="La Plata")
agregar_fila(tabla, nombre="Beto",  nota=5, ciudad="Ensenada")
agregar_fila(tabla, nombre="Cami",  nota=8, ciudad="La Plata")
agregar_fila(tabla, nombre="Dante", nota=4, ciudad="Ensenada")

aprobados_lp = filtrar(tabla, ciudad="La Plata")
resumen      = proyectar(aprobados_lp, "nombre", "nota")
imprimir_tabla(resumen)
```

??? success "✅ Solución"
    ```python
    def agregar_fila(tabla, **campos):
        tabla.append(campos)

    def filtrar(tabla, **criterios):
        return [fila for fila in tabla
                if all(fila.get(k) == v for k, v in criterios.items())]

    def proyectar(tabla, *columnas):
        return [{col: fila[col] for col in columnas if col in fila} for fila in tabla]

    def imprimir_tabla(tabla):
        if not tabla:
            print("(vacía)")
            return
        cols  = list(tabla[0].keys())
        ancho = 15
        print(" | ".join(f"{col:<{ancho}}" for col in cols))
        print("-" * (ancho * len(cols) + 3 * (len(cols) - 1)))
        for fila in tabla:
            print(" | ".join(f"{str(fila.get(col, '')):<{ancho}}" for col in cols))

    tabla = []
    agregar_fila(tabla, nombre="Ana",   nota=9, ciudad="La Plata")
    agregar_fila(tabla, nombre="Beto",  nota=5, ciudad="Ensenada")
    agregar_fila(tabla, nombre="Cami",  nota=8, ciudad="La Plata")
    agregar_fila(tabla, nombre="Dante", nota=4, ciudad="Ensenada")

    imprimir_tabla(proyectar(filtrar(tabla, ciudad="La Plata"), "nombre", "nota"))
    ```

---

## 📌 Cheatsheet final

```python
# Parámetros con valor por defecto
def conectar(host, puerto=8080, seguro=True):
    ...

# Argumentos por nombre
conectar(host="localhost", seguro=False)

# *args: tupla de posicionales extra
def sumar(*nums):        # nums = (1, 2, 3)
    return sum(nums)

sumar(1, 2, 3)           # 6

# **kwargs: dict de keyword extra
def info(**datos):       # datos = {"nombre": "Maxi"}
    for k, v in datos.items():
        print(f"{k}: {v}")

info(nombre="Maxi", edad=27)

# Scope: las variables locales no "escapan"
def foo():
    x = 10    # muere cuando foo() termina

# Cómo pasar datos correctamente (sin tocar globales)
def sumar_n(lista, n):
    return [x + n for x in lista]

# Orden de parámetros (más restrictivo → más flexible):
def todo(pos1, pos2, *args, kwonly=True, **kwargs):
    ...
```

---

## 🚀 ¿Y ahora qué viene?

!!! success "🎯 Próxima clase: Archivos y JSON"
    En la próxima clase vemos cómo **guardar datos entre ejecuciones** 💾. Hasta ahora todo lo que creamos desaparece cuando cerramos Python. Con archivos y JSON, los datos persisten.

    ```python
    import json

    datos = {"nombre": "Maxi", "nota": 9}

    with open("datos.json", "w") as f:
        json.dump(datos, f)

    with open("datos.json", "r") as f:
        cargado = json.load(f)

    print(cargado)  # {'nombre': 'Maxi', 'nota': 9}
    ```

¡Nos vemos la próxima! 📦✨

---

## [⬅️ Anterior: Funciones I](./funciones_1.md)
## [📚 Índice](../clases.md#colecciones)
