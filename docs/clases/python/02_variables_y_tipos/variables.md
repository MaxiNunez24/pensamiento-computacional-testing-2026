# 📊 Variables, tipos de datos y operadores

En esta clase vamos a empezar a programar “de verdad”.

👉 Hasta ahora mostramos información…  
👉 Ahora vamos a **guardar datos, usarlos y hacer cálculos**

---

## 📦 ¿Qué es una variable?

Una variable es un **espacio en memoria donde guardamos un valor**.

👉 Pensalo como una caja con nombre

---

## ✨ Ejemplo básico

```python
nombre = "Maxi"
edad = 22
```

📌 Creamos dos variables:

* `nombre` guarda texto
* `edad` guarda un número

---

## 🖨️ Usando variables con print()

```python
nombre = "Maxi"
edad = 22

print(nombre)
print(edad)
```

---

### 🔤 Combinando variables

```python
print("Hola", nombre)
print("Tenés", edad, "años")
```

---

### ⚠️ Forma recomendada (f-strings)

```python
print(f"Hola {nombre}, tenés {edad} años")
```

👉 Más limpio y más profesional

## 🚀 Desafío

👉 Crear un programa que muestre:

```
Hola Maxi, tenés 22 años y medís 1.81 metros
```

👉 Usar variables y `f-string`

---

---

## 📏 Reglas para nombres de variables

✔️ Pueden tener letras, números y `_`

✔️ No pueden empezar con números

✔️ No usar espacios

✔️ Son sensibles a mayúsculas/minúsculas

---

### ✅ Correctos

```python
nombre = "Ana"
edad_2 = 30
totalCompra = 100
```

---

### ❌ Incorrectos

```python
2edad = 30
mi nombre = "Juan"
```

---

## 🔢 Tipos de datos

Cada variable guarda un tipo de información.

---

### 🔤 String (texto)

```python
nombre = "Maxi"
```

---

### 🔢 Int (número entero)

```python
edad = 22
```

---

### 🔢 Float (número decimal)

```python
altura = 1.81
```

---

### 🔘 Boolean (verdadero o falso)

```python
es_estudiante = True
```

---

### 🔍 Ver el tipo de dato

```python
print(type(nombre)) # <class 'str'>
print(type(edad)) # <class 'int'>
print(type(altura)) # <class 'float'>
print(type(es_estudiante)) # <class 'bool'>
```

👉 Nos dice qué tipo de dato es cada variable

---

## ➕ Operadores

Los operadores nos permiten **hacer cálculos o comparaciones**

---

## 🔢 Operadores aritméticos

```python
a = 10
b = 3

print(a + b)  # suma
print(a - b)  # resta
print(a * b)  # multiplicación
print(a / b)  # división
print(a // b) # división entera
print(a % b)  # resto
print(a ** b) # potencia
```

---

## 🔍 Operadores de comparación

Devuelven `True` o `False`

```python
a = 10
b = 5

print(a > b) # a mayor que b
print(a < b) # a menor que b
print(a == b) # a igual a b
print(a != b) # a distinto de b
print(a >= b) # a mayor o igual que b
print(a <= b) # a menor o igual que b
```

---

## 🔗 Operadores lógicos

```python
x = True
y = False

print(x and y) # True si ambos son True (Y lógico)
print(x or y)  # True si al menos uno es True (Ó lógico)
print(not x)   # False si x es True o True si x es False (NEGACIÓN lógico)
```

---

## 🔤 Operaciones y métodos con Strings

Los Strings tienen un montón de operaciones útiles que vamos a usar constantemente.

---

### ➕ Concatenación y repetición

```python
saludo = "Hola" + " " + "Maxi"
print(saludo)      # Hola Maxi

separador = "-" * 20
print(separador)   # --------------------
```

---

### 📏 Longitud

```python
nombre = "Maxi"
print(len(nombre))  # 4
```

---

### 🔡 Mayúsculas y minúsculas

```python
texto = "hola mundo"

print(texto.upper())       # HOLA MUNDO
print(texto.lower())       # hola mundo
print(texto.capitalize())  # Hola mundo
print(texto.title())       # Hola Mundo
```

---

### ✂️ Limpiar espacios

```python
texto = "   Hola   "
print(texto.strip())   # "Hola"  — elimina espacios de ambos lados
```

---

### 🔁 Reemplazar

```python
frase = "Hola Mundo"
print(frase.replace("Mundo", "Python"))  # Hola Python
```

---

### ✂️ Dividir y unir

```python
# split: divide el string en una lista
frase = "Hola Maxi Perez"
palabras = frase.split(" ")
print(palabras)   # ['Hola', 'Maxi', 'Perez']

# join: une una lista en un string
# ⚠️ Muy usado en el curso!
nombres = ["Maxi", "Ana", "Luis"]
resultado = ", ".join(nombres)
print(resultado)  # Maxi, Ana, Luis
```

👉 `.join(lista)` se llama sobre el **separador**, no sobre la lista

---

### 🔍 Buscar dentro de un string

```python
frase = "Python es genial"

print(frase.find("es"))        # 7  — posición donde aparece
print(frase.count("a"))        # 1  — cuántas veces aparece
print(frase.startswith("Py"))  # True
print(frase.endswith("ial"))   # True
print("genial" in frase)       # True — pertenencia
```

---

### 📌 Acceso por índice y slicing

```python
nombre = "Python"

print(nombre[0])    # P   — primer carácter
print(nombre[-1])   # n   — último carácter
print(nombre[0:3])  # Pyt — desde índice 0 hasta 2
```

---

## 🎮 Ejercicios

### Variables y tipos

**Ejercicio 1 🌱** — Creá variables `nombre`, `edad`, `altura` y `es_estudiante`. Mostrálas todas en una sola línea usando f-string.

??? success "✅ Solución"
    ```python
    nombre = "Maxi"
    edad = 22
    altura = 1.81
    es_estudiante = True
    print(f"Nombre: {nombre} | Edad: {edad} | Altura: {altura} | Estudiante: {es_estudiante}")
    ```

**Ejercicio 2 🌱** — Mostrá el tipo de dato de cada una de esas variables con `type()`.

??? success "✅ Solución"
    ```python
    print(type(nombre))        # <class 'str'>
    print(type(edad))          # <class 'int'>
    print(type(altura))        # <class 'float'>
    print(type(es_estudiante)) # <class 'bool'>
    ```

### Operadores

**Ejercicio 3 🌱** — Creá dos números y mostrá el resultado de: suma, resta, multiplicación, división y resto.

??? success "✅ Solución"
    ```python
    a = 10
    b = 3
    print(f"Suma: {a + b}")
    print(f"Resta: {a - b}")
    print(f"Multiplicación: {a * b}")
    print(f"División: {a / b:.2f}")
    print(f"Resto: {a % b}")
    ```

**Ejercicio 4 🌱** — Verificá si un número es par usando `%` y un operador de comparación.

??? success "✅ Solución"
    ```python
    n = 8
    es_par = n % 2 == 0
    print(f"{n} es par: {es_par}")
    ```

**Ejercicio 5 🌿** — Escribí una condición que sea `True` solo si la edad es mayor a 17 **y** la persona es estudiante.

??? success "✅ Solución"
    ```python
    edad = 20
    es_estudiante = True
    puede_inscribirse = edad > 17 and es_estudiante
    print(puede_inscribirse)  # True
    ```

### Strings

**Ejercicio 6 🌱** — Creá una variable con tu nombre completo y mostrá: su longitud, en mayúsculas y en minúsculas.

??? success "✅ Solución"
    ```python
    nombre = "Maximiliano Nuñez"
    print(len(nombre))       # 17
    print(nombre.upper())    # MAXIMILIANO NUÑEZ
    print(nombre.lower())    # maximiliano nuñez
    ```

**Ejercicio 7 🌱** — Dada la frase `"hola mundo maravilloso"`, contá cuántas veces aparece la letra `"o"`.

??? success "✅ Solución"
    ```python
    frase = "hola mundo maravilloso"
    print(frase.count("o"))  # 4
    ```

**Ejercicio 8 🌱** — Separá `"lunes,martes,miércoles,jueves,viernes"` en una lista usando `split()`.

??? success "✅ Solución"
    ```python
    dias = "lunes,martes,miércoles,jueves,viernes"
    lista = dias.split(",")
    print(lista)  # ['lunes', 'martes', 'miércoles', 'jueves', 'viernes']
    ```

**Ejercicio 9 🌱** — Dada la lista `["Python", "es", "genial"]`, uní los elementos en un string con un espacio como separador.

??? success "✅ Solución"
    ```python
    palabras = ["Python", "es", "genial"]
    frase = " ".join(palabras)
    print(frase)  # Python es genial
    ```

**Ejercicio 10 🌱** — Verificá si la frase `"Python es genial"` empieza con `"Py"` y termina con `"al"`.

??? success "✅ Solución"
    ```python
    frase = "Python es genial"
    print(frase.startswith("Py"))   # True
    print(frase.endswith("al"))     # True
    print(frase.startswith("Py") and frase.endswith("al"))  # True
    ```

---

## 🧩 Mini cierre conceptual

* Una **variable** guarda información
* Cada valor tiene un **tipo de dato**
* Podemos usar **operadores** para trabajar con esos datos
* Los **Strings** tienen métodos propios para manipular texto
* Python es: 
    * **Tipado Dinámico**: no necesitamos declarar el tipo y puede cambiar en tiempo de ejecución.
    * **Tipado Fuerte**: cada valor tiene un tipo y no se mezclan entre sí automáticamente.

---

💡 A partir de ahora:

👉 Ya podés empezar a hacer programas más interesantes

👉 En la próxima clase vamos a aprender a formatear strings 😏

---

## [⬅️ Anterior: La función print()](./funcion_print.md)
## [📚 Índice](../../clases.md#variables)
## [➡️ Siguiente: Formato de strings](./formato_strings.md)
