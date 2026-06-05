# 📖 Glosario de Python

!!! tip "💡 Cómo buscar"
    Usá **Ctrl+F** (o **⌘+F** en Mac) para buscar cualquier término — es la forma más rápida.
    El índice de abajo tiene anclas para saltar directo a cada entrada.

---

## 🗂️ Índice rápido

[`and`](#and) · [`append`](#append) · [`argumento`](#argumento) · [`bool`](#bool) · [`break`](#break) · [`bucle infinito`](#bucle-infinito) · [`comentario`](#comentario) · [`condición`](#condicion) · [`continue`](#continue) · [`def`](#def) · [`del`](#del) · [`dict`](#dict) · [`discard`](#discard) · [`elif`](#elif) · [`else`](#else) · [`enumerate`](#enumerate) · [`error de lógica`](#error-logica) · [`extend`](#extend) · [`f-string`](#f-string) · [`False`](#false) · [`float`](#float) · [`for`](#for) · [`from`](#from) · [`función`](#funcion) · [`get`](#get-dict) · [`if`](#if) · [`import`](#import) · [`in`](#in) · [`IndexError`](#indexerror) · [`índice`](#indice) · [`input`](#input) · [`insert`](#insert) · [`int`](#int) · [`is`](#is) · [`isupper/islower`](#isupper) · [`items`](#items) · [`isdigit`](#isdigit) · [`join`](#join) · [`KeyError`](#keyerror) · [`keys`](#keys) · [`len`](#len) · [`list`](#list) · [`list comprehension`](#list-comprehension) · [`lower/upper`](#lower) · [`max`](#max) · [`min`](#min) · [`módulo`](#modulo) · [`NameError`](#nameerror) · [`None`](#none) · [`not`](#not) · [`or`](#or) · [`parámetro`](#parametro) · [`pass`](#pass) · [`pop (lista)`](#pop-list) · [`pop (dict)`](#pop-dict) · [`print`](#print) · [`range`](#range) · [`remove (lista)`](#remove-list) · [`remove (set)`](#remove-set) · [`replace`](#replace) · [`return`](#return) · [`reverse`](#reverse) · [`scope`](#scope) · [`set`](#set) · [`slicing`](#slicing) · [`sort`](#sort) · [`sorted`](#sorted) · [`split`](#split) · [`startswith/endswith`](#startswith) · [`str`](#str) · [`strip`](#strip) · [`sum`](#sum) · [`True`](#true) · [`tuple`](#tuple) · [`type`](#type) · [`TypeError`](#typeerror) · [`update`](#update-dict) · [`values`](#values) · [`variable`](#variable) · [`while`](#while) · [`zip`](#zip)

---

## 🔑 Palabras clave (reservadas)

Palabras que Python usa internamente — no podés usarlas como nombre de variables.

### `and` { #and }

Operador lógico: `True` si **ambas** condiciones son verdaderas.

```python
if edad >= 18 and tiene_dni:
    print("Puede ingresar")
```

📖 [Clase: `if` / `elif` / `else`](../clases/python/03_estructuras_de_control/if_else.md)

---

### `break` { #break }

Interrumpe un `for` o `while` antes de que termine naturalmente.

```python
for n in range(10):
    if n == 5:
        break
# el bucle termina cuando n vale 5
```

📖 [Clase: `while`](../clases/python/03_estructuras_de_control/while.md)

---

### `continue` { #continue }

Salta al principio del bucle en la iteración actual, sin ejecutar el resto del cuerpo.

```python
for n in range(5):
    if n == 2:
        continue    # saltea el 2
    print(n)        # imprime 0, 1, 3, 4
```

📖 [Clase: `while`](../clases/python/03_estructuras_de_control/while.md)

---

### `def` { #def }

Define una función nueva.

```python
def saludar(nombre):
    return f"Hola, {nombre}!"
```

📖 [Clase: Funciones I](../clases/python/06_funciones/funciones_1.md)

---

### `del` { #del }

Elimina una variable o un elemento de una lista o diccionario.

```python
lista = [1, 2, 3]
del lista[0]    # lista queda [2, 3]
```

📖 [Clase: Listas](../clases/python/04_listas/listas.md)

---

### `elif` { #elif }

"Else if": rama adicional en un condicional, se evalúa si el `if` previo fue `False`.

```python
if nota >= 90:
    print("Sobresaliente")
elif nota >= 60:
    print("Aprobado")
else:
    print("Desaprobado")
```

📖 [Clase: `if` / `elif` / `else`](../clases/python/03_estructuras_de_control/if_else.md)

---

### `else` { #else }

Rama que se ejecuta cuando la condición del `if` no se cumplió. También se puede usar al final de un `for` o `while` (se ejecuta si el bucle terminó sin `break`).

📖 [Clase: `if` / `elif` / `else`](../clases/python/03_estructuras_de_control/if_else.md)

---

### `False` { #false }

Uno de los dos valores booleanos — "falso". Siempre con **F mayúscula**.

```python
activo = False
print(type(activo))  # <class 'bool'>
```

📖 [Clase: Variables y Tipos](../clases/python/02_variables_y_tipos/variables.md)

---

### `for` { #for }

Bucle que recorre cada elemento de una secuencia (lista, rango, string, tupla, etc.).

```python
frutas = ["manzana", "banana", "pera"]
for fruta in frutas:
    print(fruta)
```

📖 [Clase: `for`](../clases/python/03_estructuras_de_control/for.md)

---

### `from` { #from }

Importa algo específico de un módulo (en vez del módulo completo).

```python
from datetime import date
hoy = date.today()
```

📖 [Clase: Funciones II](../clases/python/06_funciones/funciones_2.md)

---

### `if` { #if }

Ejecuta un bloque de código solo si la condición es `True`.

```python
if temperatura > 30:
    print("Hace calor")
```

📖 [Clase: `if` / `elif` / `else`](../clases/python/03_estructuras_de_control/if_else.md)

---

### `import` { #import }

Importa un módulo para usar sus funciones.

```python
import random
numero = random.randint(1, 10)
```

📖 [Clase: Funciones II](../clases/python/06_funciones/funciones_2.md)

---

### `in` { #in }

Verifica si un elemento está dentro de una secuencia, set o diccionario. También se usa en `for`.

```python
if "banana" in frutas:    # verificar pertenencia
    print("Sí está")

for x in lista:           # recorrer
    print(x)
```

📖 [Clase: Listas](../clases/python/04_listas/listas.md)

---

### `is` { #is }

Compara **identidad** (si dos variables apuntan al mismo objeto), no igualdad. Más común con `None`.

```python
if resultado is None:    # preferible a resultado == None
    print("Sin resultado")
```

---

### `None` { #none }

Valor especial que significa "sin valor". Es de tipo `NoneType`. Cuando una función no tiene `return`, devuelve `None` automáticamente.

```python
def sin_return():
    print("hola")

x = sin_return()
print(x)   # None
```

📖 [Clase: Funciones I](../clases/python/06_funciones/funciones_1.md)

---

### `not` { #not }

Niega una condición booleana.

```python
if not logueado:
    print("Tenés que iniciar sesión")
```

📖 [Clase: `if` / `elif` / `else`](../clases/python/03_estructuras_de_control/if_else.md)

---

### `or` { #or }

Operador lógico: `True` si **al menos una** condición es verdadera.

```python
if dia == "sábado" or dia == "domingo":
    print("Es fin de semana")
```

📖 [Clase: `if` / `elif` / `else`](../clases/python/03_estructuras_de_control/if_else.md)

---

### `pass` { #pass }

Marcador de posición que no hace nada. Útil en esqueletos de funciones o bucles vacíos.

```python
def funcion_a_completar():
    pass    # TODO: implementar
```

📖 [Clase: Funciones I](../clases/python/06_funciones/funciones_1.md)

---

### `return` { #return }

Devuelve un valor desde una función y termina su ejecución.

```python
def doble(n):
    return n * 2

resultado = doble(5)   # 10
```

Sin `return`, la función devuelve `None`. Ver [`None`](#none).

📖 [Clase: Funciones I](../clases/python/06_funciones/funciones_1.md)

---

### `True` { #true }

Uno de los dos valores booleanos — "verdadero". Siempre con **T mayúscula**.

📖 [Clase: Variables y Tipos](../clases/python/02_variables_y_tipos/variables.md)

---

### `while` { #while }

Bucle que se repite mientras una condición sea `True`.

```python
intentos = 0
while intentos < 3:
    print("Intentá de nuevo")
    intentos += 1
```

📖 [Clase: `while`](../clases/python/03_estructuras_de_control/while.md)

---

## 🧱 Tipos de datos

### `bool` — Booleano { #bool }

Solo dos valores posibles: `True` o `False`. Resultado natural de comparaciones y condiciones.

```python
mayor = 5 > 3         # True
vacio = len([]) == 0  # True
```

Conversión: `bool(0)` → `False`, `bool(1)` → `True`, `bool("")` → `False`, `bool("x")` → `True`.

📖 [Clase: Variables y Tipos](../clases/python/02_variables_y_tipos/variables.md)

---

### `dict` — Diccionario { #dict }

Colección de pares **clave → valor**. Las claves son únicas. El acceso es por clave, no por índice.

```python
alumno = {"nombre": "Ana", "edad": 20, "activo": True}
print(alumno["nombre"])   # Ana
alumno["nota"] = 9        # agregar clave nueva
```

📖 [Clase: Diccionarios](../clases/python/05_colecciones/diccionarios.md)

---

### `float` — Número decimal { #float }

Tipo numérico con parte decimal (punto flotante).

```python
precio = 19.99
pi = 3.14159
```

📖 [Clase: Variables y Tipos](../clases/python/02_variables_y_tipos/variables.md)

---

### `int` — Entero { #int }

Tipo numérico sin decimales. El más usado para contar, índices y operaciones enteras.

```python
edad = 25
cantidad = 10 + 3   # 13
```

📖 [Clase: Variables y Tipos](../clases/python/02_variables_y_tipos/variables.md)

---

### `list` — Lista { #list }

Colección **ordenada** y **modificable**. Permite duplicados. Acceso por índice numérico.

```python
notas = [8, 7, 9, 6, 10]
notas[0]           # 8  (primer elemento)
notas[-1]          # 10 (último)
notas.append(7)    # agrega al final
```

📖 [Clase: Listas](../clases/python/04_listas/listas.md)

---

### `set` — Conjunto { #set }

Colección de elementos **únicos** y **sin orden**. Ideal para eliminar duplicados y operaciones de conjuntos (`|`, `&`, `-`).

```python
votos = ["Ana", "Beto", "Ana", "Cami"]
set(votos)   # {"Ana", "Beto", "Cami"}  — solo únicos
```

📖 [Clase: Tuplas y Sets](../clases/python/05_colecciones/tuplas_sets.md)

---

### `str` — Cadena de texto { #str }

Tipo para texto. Se crea con comillas simples o dobles. Es **inmutable** (no se puede modificar, solo reemplazar).

```python
nombre = "Marta"
saludo = f"Hola, {nombre}!"
```

📖 [Clase: Variables y Tipos](../clases/python/02_variables_y_tipos/variables.md)

---

### `tuple` — Tupla { #tuple }

Colección **ordenada** e **inmutable** (no se puede modificar). Ideal para datos que no deben cambiar.

```python
coordenada = (-34.6, -58.4)
dia, mes, anio = (15, 3, 1998)   # desempaquetado
```

📖 [Clase: Tuplas y Sets](../clases/python/05_colecciones/tuplas_sets.md)

---

## ⚙️ Funciones integradas (built-ins)

No hace falta importarlas — vienen con Python.

### `enumerate()` — Índice + valor { #enumerate }

Recorre una secuencia devolviendo el índice y el valor en cada iteración.

```python
for i, fruta in enumerate(["manzana", "banana", "pera"]):
    print(f"{i}: {fruta}")
# 0: manzana   1: banana   2: pera
```

📖 [Clase: `for`](../clases/python/03_estructuras_de_control/for.md)

---

### `input()` — Leer del teclado { #input }

Lee lo que escribe el usuario. **Siempre devuelve `str`** — convertí con `int()` o `float()` si necesitás número.

```python
nombre = input("¿Cómo te llamás? ")
edad = int(input("¿Cuántos años tenés? "))
```

📖 [Clase: `input()`](../clases/python/02_variables_y_tipos/funcion_input.md)

---

### `int()` / `float()` / `str()` — Conversión de tipos { #int-fn }

```python
int("42")     # 42
int(3.9)      # 3   (trunca, no redondea)
float("3.14") # 3.14
str(42)       # "42"
```

Causa del error más frecuente: olvidar `int()` con `input()`.

📖 [Clase: Variables y Tipos](../clases/python/02_variables_y_tipos/variables.md)

---

### `len()` — Longitud { #len }

Cantidad de elementos de una lista, string, set o diccionario.

```python
len([1, 2, 3])      # 3
len("hola")         # 4
len({"a", "b"})     # 2
```

📖 [Clase: Listas](../clases/python/04_listas/listas.md)

---

### `max()` / `min()` — Máximo y mínimo { #max }

```python
max([5, 1, 9, 3])   # 9
min([5, 1, 9, 3])   # 1
max(4, 7, 2)         # 7
```

### `min()` { #min }

Ver [`max()`](#max).

---

### `print()` — Mostrar en consola { #print }

```python
print("Hola")
print("Nombre:", nombre, "Edad:", edad)
print(f"Hola, {nombre}!")    # con f-string
print()                       # línea en blanco
```

📖 [Clase: `print()`](../clases/python/02_variables_y_tipos/funcion_print.md)

---

### `range()` — Rango de números { #range }

Genera una secuencia de números. El límite final **no se incluye**.

```python
range(5)         # 0, 1, 2, 3, 4
range(1, 6)      # 1, 2, 3, 4, 5
range(0, 10, 2)  # 0, 2, 4, 6, 8  (salto de 2)
```

📖 [Clase: `for`](../clases/python/03_estructuras_de_control/for.md)

---

### `sorted()` — Ordenar sin modificar original { #sorted }

Devuelve una **nueva** lista ordenada. Diferente de `.sort()` que modifica la original.

```python
notas = [8, 3, 9, 1]
sorted(notas)              # [1, 3, 8, 9]  — notas sin cambios
sorted(notas, reverse=True)  # [9, 8, 3, 1]
```

---

### `sum()` — Sumar { #sum }

```python
sum([1, 2, 3, 4, 5])   # 15
```

---

### `type()` — Ver el tipo de una variable { #type }

```python
type(42)      # <class 'int'>
type("hola")  # <class 'str'>
type([1, 2])  # <class 'list'>
```

📖 [Clase: Variables y Tipos](../clases/python/02_variables_y_tipos/variables.md)

---

### `zip()` — Emparejar dos secuencias { #zip }

Une dos (o más) listas en pares, elemento a elemento.

```python
nombres = ["Ana", "Beto", "Cami"]
notas   = [8, 9, 7]
for nombre, nota in zip(nombres, notas):
    print(f"{nombre}: {nota}")
```

📖 [Clase: Tuplas y Sets](../clases/python/05_colecciones/tuplas_sets.md)

---

## 📋 Métodos de lista

Se llaman sobre la lista: `mi_lista.metodo()`. Los métodos con `→` modifican la lista **en el lugar** y devuelven `None`.

### `.append(elemento)` — Agregar al final { #append }

```python
lista = [1, 2, 3]
lista.append(4)    # [1, 2, 3, 4]
```

📖 [Clase: Listas](../clases/python/04_listas/listas.md)

---

### `.count(valor)` — Contar apariciones { #count-list }

```python
["a", "b", "a", "a"].count("a")   # 3
```

---

### `.extend(otra_lista)` — Agregar múltiples elementos { #extend }

```python
lista = [1, 2]
lista.extend([3, 4])   # [1, 2, 3, 4]
```

---

### `.index(valor)` — Posición de un elemento { #index-list }

Devuelve el índice de la primera aparición. Lanza `ValueError` si no existe.

```python
["a", "b", "c"].index("b")   # 1
```

---

### `.insert(pos, elemento)` — Insertar en posición { #insert }

```python
lista = ["a", "c"]
lista.insert(1, "b")    # ["a", "b", "c"]
```

---

### `.pop(índice?)` — Eliminar y devolver { #pop-list }

Sin argumento saca el último. Con índice, saca ese elemento. Devuelve el elemento sacado.

```python
lista = [1, 2, 3]
lista.pop()     # devuelve 3, lista queda [1, 2]
lista.pop(0)    # devuelve 1, lista queda [2]
```

📖 [Clase: Listas](../clases/python/04_listas/listas.md)

---

### `.remove(valor)` — Eliminar por valor { #remove-list }

Elimina la **primera** aparición. Lanza `ValueError` si no existe.

```python
[1, 2, 3, 2].remove(2)    # [1, 3, 2]
```

---

### `.reverse()` — Invertir en lugar { #reverse }

```python
lista = [1, 2, 3]
lista.reverse()    # lista queda [3, 2, 1]
```

---

### `.sort()` — Ordenar en lugar { #sort }

Modifica la lista original. Para no modificarla, usá `sorted()`.

```python
notas = [8, 3, 9, 1]
notas.sort()              # [1, 3, 8, 9]
notas.sort(reverse=True)  # [9, 8, 3, 1]
```

📖 [Clase: Listas](../clases/python/04_listas/listas.md)

---

## 📝 Métodos de string

Los métodos de string **no modifican** el original — devuelven un string nuevo.

### `.endswith(sufijo)` / `.startswith(prefijo)` — Verificar inicio/final { #startswith }

```python
"hola.txt".endswith(".txt")    # True
"hola.py".startswith("hola")   # True
```

---

### `.isdigit()` / `.isnumeric()` — ¿Es numérico? { #isdigit }

```python
"123".isdigit()    # True
"12.3".isdigit()   # False (el punto no es dígito)
"abc".isnumeric()  # False
```

Útil para validar el `input()` antes de convertir.

---

### `.isupper()` / `.islower()` — ¿Mayúsculas o minúsculas? { #isupper }

```python
"HOLA".isupper()   # True
"hola".islower()   # True
"Hola".isupper()   # False
```

---

### `.join(iterable)` — Unir lista en string { #join }

```python
" ".join(["hola", "mundo"])    # "hola mundo"
"-".join(["2024", "06", "04"]) # "2024-06-04"
```

---

### `.lower()` / `.upper()` — Cambiar mayúsculas { #lower }

```python
"Hola Mundo".lower()   # "hola mundo"
"hola".upper()         # "HOLA"
```

Muy útil para comparar sin importar si el usuario escribió en mayúscula o no.

📖 [Clase: Variables y Tipos](../clases/python/02_variables_y_tipos/variables.md)

---

### `.replace(viejo, nuevo)` — Reemplazar texto { #replace }

```python
"Hola mundo".replace("mundo", "Python")   # "Hola Python"
```

---

### `.split(separador?)` — Dividir en lista { #split }

```python
"hola mundo".split()     # ["hola", "mundo"]
"1,2,3".split(",")       # ["1", "2", "3"]
```

---

### `.strip()` — Eliminar espacios al inicio y final { #strip }

```python
"  hola  ".strip()    # "hola"
```

Útil para limpiar el `input()` cuando el usuario pone espacios sin querer.

---

## 🔵 Métodos de set

### `.add(elemento)` — Agregar al set { #add }

```python
s = {1, 2, 3}
s.add(4)    # {1, 2, 3, 4}
s.add(2)    # sin cambios (ya existe)
```

📖 [Clase: Tuplas y Sets](../clases/python/05_colecciones/tuplas_sets.md)

---

### `.discard(elemento)` — Eliminar sin error { #discard }

Como `.remove()` pero no lanza error si el elemento no existe.

```python
s = {1, 2, 3}
s.discard(99)   # sin error
```

---

### `.remove(elemento)` — Eliminar del set { #remove-set }

```python
s = {1, 2, 3}
s.remove(2)    # {1, 3}
# s.remove(99) → KeyError
```

---

### Operaciones de conjuntos { #operaciones-set }

| Operación | Símbolo | Qué hace |
|-----------|---------|----------|
| Unión | `\|` | Todos los elementos (sin repetidos) |
| Intersección | `&` | Solo los que están en **ambos** |
| Diferencia | `-` | Los que están en A pero **no** en B |

```python
a = {1, 2, 3}
b = {2, 3, 4}
a | b   # {1, 2, 3, 4}
a & b   # {2, 3}
a - b   # {1}
```

📖 [Clase: Tuplas y Sets](../clases/python/05_colecciones/tuplas_sets.md)

---

## 🟡 Métodos de diccionario

### `.get(clave, default?)` — Buscar sin error { #get-dict }

Devuelve el valor de la clave. Si no existe, devuelve `None` (o el valor por defecto que especifiques).

```python
d = {"Ana": 90}
d.get("Ana")       # 90
d.get("Beto")      # None
d.get("Beto", 0)   # 0
```

Preferible a `d["clave"]` cuando no estás seguro de que la clave existe.

📖 [Clase: Diccionarios](../clases/python/05_colecciones/diccionarios.md)

---

### `.items()` — Pares clave–valor { #items }

```python
for clave, valor in d.items():
    print(f"{clave}: {valor}")
```

📖 [Clase: Diccionarios](../clases/python/05_colecciones/diccionarios.md)

---

### `.keys()` — Solo las claves { #keys }

```python
d = {"a": 1, "b": 2}
list(d.keys())   # ["a", "b"]
```

---

### `.pop(clave)` — Eliminar clave { #pop-dict }

```python
d = {"a": 1, "b": 2}
d.pop("a")   # devuelve 1, d queda {"b": 2}
```

---

### `.update(otro_dict)` — Agregar/pisar claves { #update-dict }

```python
d = {"a": 1}
d.update({"b": 2, "c": 3})   # {"a": 1, "b": 2, "c": 3}
```

---

### `.values()` — Solo los valores { #values }

```python
d = {"a": 1, "b": 2}
list(d.values())   # [1, 2]
```

---

## 💡 Conceptos del curso

### Argumento { #argumento }

El valor **concreto** que se pasa a una función al llamarla. Distinto del **parámetro**, que es el nombre en la definición.

```python
def saludar(nombre):    # nombre → PARÁMETRO
    print(f"Hola, {nombre}!")

saludar("Ana")          # "Ana" → ARGUMENTO
```

📖 [Clase: Funciones I](../clases/python/06_funciones/funciones_1.md)

---

### Comentario { #comentario }

Texto que Python ignora completamente. Empieza con `#`. Un buen comentario explica el *por qué*, no el *qué*.

```python
# Calculamos el promedio antes de filtrar (requerido por el enunciado)
promedio = sum(notas) / len(notas)
```

---

### Condición { #condicion }

Expresión que evalúa a `True` o `False`. Base de los `if` y los `while`.

```python
edad >= 18            # True o False
"x" == "X"            # False (case-sensitive)
len(lista) == 0       # True si está vacía
```

---

### `f-string` — String con formato { #f-string }

Forma de insertar variables o expresiones dentro de un string usando `f"..."` y llaves `{}`.

```python
nombre = "Ana"
edad = 20
print(f"Hola, {nombre}. Tenés {edad} años.")
print(f"El doble de 7 es {7 * 2}")
print(f"Precio: ${precio:.2f}")   # 2 decimales
```

📖 [Clase: Formato de strings](../clases/python/02_variables_y_tipos/formato_strings.md)

---

### Función { #funcion }

Bloque de código con nombre propio que recibe datos (parámetros), hace algo, y opcionalmente devuelve un resultado.

```python
def area_rectangulo(base, altura):
    return base * altura

area = area_rectangulo(5, 3)   # 15
```

📖 [Clase: Funciones I](../clases/python/06_funciones/funciones_1.md)

---

### Índice { #indice }

Número que identifica la posición de un elemento en una lista o string. **Empieza en 0**, no en 1. Los índices negativos cuentan desde el final.

```python
lista = ["a", "b", "c", "d"]
lista[0]    # "a"  — primero
lista[3]    # "d"  — cuarto
lista[-1]   # "d"  — último
lista[-2]   # "c"  — penúltimo
```

📖 [Clase: Listas](../clases/python/04_listas/listas.md)

---

### List comprehension { #list-comprehension }

Forma compacta de crear una lista aplicando una expresión a cada elemento de otra secuencia.

```python
# Forma larga
cuadrados = []
for n in range(5):
    cuadrados.append(n ** 2)

# List comprehension
cuadrados = [n ** 2 for n in range(5)]   # [0, 1, 4, 9, 16]

# Con filtro
pares = [n for n in range(10) if n % 2 == 0]   # [0, 2, 4, 6, 8]
```

📖 [Clase: Listas](../clases/python/04_listas/listas.md)

---

### Módulo { #modulo }

Archivo Python (o librería) con funciones y herramientas listas para usar. Se importa con `import`.

```python
import random
import math
from datetime import date
```

📖 [Clase: Funciones II](../clases/python/06_funciones/funciones_2.md)

---

### Parámetro { #parametro }

El nombre de la variable que recibe datos en la **definición** de una función. Ver también [`argumento`](#argumento).

```python
def doblar(numero):      # numero → PARÁMETRO
    return numero * 2
```

📖 [Clase: Funciones I](../clases/python/06_funciones/funciones_1.md)

---

### Scope (ámbito) { #scope }

Las variables creadas **dentro** de una función solo existen dentro de ella. Las de **afuera** son globales.

```python
def calcular():
    resultado = 42    # solo existe dentro de calcular()

calcular()
print(resultado)    # NameError — resultado no existe acá
```

📖 [Clase: Funciones II](../clases/python/06_funciones/funciones_2.md)

---

### Slicing { #slicing }

Seleccionar un fragmento de una lista o string: `[inicio:fin:paso]`. El índice final **no se incluye**.

```python
lista = [1, 2, 3, 4, 5]
lista[1:3]     # [2, 3]
lista[:2]      # [1, 2]       (desde el principio)
lista[2:]      # [3, 4, 5]   (hasta el final)
lista[::2]     # [1, 3, 5]   (de 2 en 2)
lista[::-1]    # [5, 4, 3, 2, 1]  (invertida)
```

📖 [Clase: Listas](../clases/python/04_listas/listas.md)

---

### Variable { #variable }

Nombre que apunta a un valor almacenado en memoria. En Python no hace falta declarar el tipo — se infiere del valor.

```python
edad = 25           # int
nombre = "Ana"      # str
precios = [10, 20]  # list
activo = True       # bool
```

📖 [Clase: Variables y Tipos](../clases/python/02_variables_y_tipos/variables.md)

---

## ❌ Tipos de error

### `IndexError` — Índice fuera de rango { #indexerror }

Al acceder a un índice que no existe en la lista.

```python
lista = [1, 2, 3]    # índices: 0, 1, 2
lista[5]             # IndexError: list index out of range
```

**Solución:** Verificar que el índice esté entre `0` y `len(lista) - 1`. Usar `[-1]` para el último.

📖 [Clase: Lectura y corrección de código](../clases/python/06_funciones/lectura_codigo.md)

---

### `KeyError` — Clave inexistente en diccionario { #keyerror }

Al acceder a una clave que no existe. Las claves son **case-sensitive**: `"Ana"` ≠ `"ana"`.

```python
d = {"Ana": 90}
d["Beto"]    # KeyError: 'Beto'
d["ana"]     # KeyError: 'ana'  (aunque "Ana" sí existe)
```

**Solución:** Usar `.get()` en vez de `d["clave"]`.

📖 [Clase: Lectura y corrección de código](../clases/python/06_funciones/lectura_codigo.md)

---

### `NameError` — Nombre no definido { #nameerror }

Al usar una variable que no fue creada todavía, o hay un typo en el nombre.

```python
print(resultado)    # NameError si resultado no fue definido antes
```

---

### `TypeError` — Tipo incorrecto { #typeerror }

Al hacer una operación entre tipos incompatibles.

```python
"hola" + 5     # TypeError
None + 1       # TypeError
```

Causa más común: olvidar convertir `input()`.

```python
edad = input("Edad: ")
edad + 10      # TypeError: str + int
# Solución:
edad = int(input("Edad: "))
```

📖 [Clase: Lectura y corrección de código](../clases/python/06_funciones/lectura_codigo.md)

---

### Error de lógica { #error-logica }

No lanza excepción — el programa corre pero el resultado está mal. El más difícil de detectar.

```python
# ¿Es par? — INCORRECTO (lógica invertida)
if numero % 2 == 1:
    print(f"{numero} es par")   # debería decir "impar"
```

**Solución:** Trazar el código a mano con valores de ejemplo. Usar Python Tutor.

📖 [Clase: Lectura y corrección de código](../clases/python/06_funciones/lectura_codigo.md)

---

### Bucle infinito { #bucle-infinito }

Un `while` cuya condición nunca se vuelve `False`. El programa "se cuelga".

```python
contador = 0
while contador >= 0:    # siempre True
    contador += 1       # y crece para siempre
```

**Señal:** el programa no muestra nada y no responde. **Terminarlo con Ctrl+C**.

📖 [Clase: `while`](../clases/python/03_estructuras_de_control/while.md)

---

## [📚 Material de apoyo](./material_apoyo.md)
