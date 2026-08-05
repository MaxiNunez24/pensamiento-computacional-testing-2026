# 📦 Funciones II — Scope, parámetros avanzados y *args/**kwargs

!!! example "⚡ Un bug misterioso"
    Alguien escribe este código para acumular el total de una venta:

    ```python
    total = 0

    def agregar_item(precio):
        total += precio   # ← ¿por qué falla esto?

    agregar_item(100)
    agregar_item(50)
    print(total)
    ```

    Al ejecutarlo: `UnboundLocalError: local variable 'total' referenced before assignment`.

    ¿No declaramos `total` antes? ¿Por qué Python dice que no existe? La respuesta está en el **scope**.

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

## ✨ *args: cantidad variable de argumentos posicionales

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

## ✨ **kwargs: cantidad variable de argumentos nombrados

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

!!! info "¿Qué es `pass`?"
    `pass` es una instrucción que **no hace nada**. Python la exige porque la sintaxis requiere al menos una línea dentro de un bloque (función, clase, `if`, etc.). Se usa como **marcador de posición** cuando todavía no querés escribir el cuerpo, o cuando el punto del ejemplo es la firma y no la implementación.

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

!!! tip "🧪 Los ejercicios ahora son interactivos"
    Escribís el código, lo ejecutás con **Python de verdad en el navegador** y los tests te dicen al
    instante si está bien. Sin instalar nada: funciona desde la máquina del CFP, desde tu casa y
    desde el celular. Tu avance **se guarda solo**.

    Si te trabás, cada ejercicio tiene pistas — y un botón para mandarme tu código y tu consulta.

    [🚀 Ir a los ejercicios de Funciones II](/pensamiento-computacional-testing-2026/ejercicios/clases/funciones-2/){ .md-button .md-button--primary }

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

!!! tip "🎰 Pero antes de seguir..."
    Ya vimos variables, estructuras de control, listas, colecciones y funciones. Antes de arrancar con persistencia, ¿qué tal si ponemos todo eso junto en algo un poco más divertido?

    👉 **[Ejercicio Bingo →](./bingo.md)** Un simulador completo de Bingo que integra sets, listas, diccionarios, tuplas y funciones. Todo en un solo ejercicio.

---

## [⬅️ Anterior: Funciones I](./funciones_1.md)
## [📚 Índice](../clases.md#colecciones)
## [➡️ Siguiente: Cómo encarar un ejercicio](./como_encarar_ejercicios.md)
