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

## 🖨️ Usando variables con `print()`

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

## 🔍 Ver el tipo de dato

```python
print(type(nombre))
print(type(edad))
```

👉 Nos dice qué tipo de dato es cada variable

---

## ➕ Operadores

Los operadores nos permiten **hacer cálculos o comparaciones**

---

## 🔢 Operadores matemáticos

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

print(a > b)
print(a < b)
print(a == b)
print(a != b)
```

---

## 🔗 Operadores lógicos

```python
x = True
y = False

print(x and y)
print(x or y)
print(not x)
```

---

## 🧪 Ejercicios

1. Crear una variable con tu nombre y otra con tu edad. Mostrarlas en pantalla.
2. Crear dos números y mostrar:

   * suma
   * resta
   * multiplicación
3. Crear una variable con tu altura y mostrar su tipo
4. Mostrar si un número es mayor que otro
5. Crear una variable booleana e imprimirla

---

## 🚀 Desafío

👉 Crear un programa que muestre:

```
Hola Maxi, tenés 22 años y medís 1.81 metros
```

👉 Usar variables y `f-string`

---

## 🧩 Mini cierre conceptual

* Una **variable** guarda información
* Cada valor tiene un **tipo de dato**
* Podemos usar **operadores** para trabajar con esos datos
* Python es dinámico: no necesitamos declarar el tipo

---

💡 A partir de ahora:
👉 Ya podés empezar a hacer programas más interesantes
👉 En la próxima clase vamos a tomar datos del usuario 😏

---

