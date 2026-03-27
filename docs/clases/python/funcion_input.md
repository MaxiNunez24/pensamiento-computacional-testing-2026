# ⌨️​ La función `input()` (Entrada de datos)

## 🤔​ ¿Qué es input?

Hasta ahora nuestros programas tenían valores “fijos” dentro del código.

Con `input()` podemos hacer programas **interactivos**, es decir, que el usuario ingrese datos.

```python
input("Ingresá tu nombre: ")
```

👉 El programa se detiene, imprime el mensaje, espera que el usuario escriba algo y le de Enter.

---

## 💾​ Guardar lo que escribe el usuario

El valor ingresado se puede guardar en una variable:

```python
nombre = input("Ingresá tu nombre: ")

print(nombre)
```

Como en la variable `nombre` en este ejemplo. 

---

## 🖨️​ Usar input con f-string

```python
nombre = input("Ingresá tu nombre: ")

print(f"Hola {nombre}")
```

??? warning "Para concatenar cadenas de texto se utiliza el operador `+` o las f-strings. Ambas son equivalentes. Ejemplo:"
    ```python
    nombre = input("Ingrese su nombre: ")
    apellido = input("Ingrese su apellido: ")
    
    nombre_completo = nombre + " " + apellido
    nombre_completo = f"{nombre} {apellido}"

    print(nombre_completo)
    ```
    En este ejemplo se necesita agregar un espacio entre el nombre y el apellido, por eso se incluye `" "` en la concatenación. En las f-strings, el espacio se agrega directamente dentro de la cadena.

---

## 🔴 IMPORTANTE: input siempre devuelve texto

Todo lo que el usuario escribe se guarda como **string (str)**

```python
edad = input("Ingresá tu edad: ")

print(type(edad))  # <class 'str'>
```

Aunque el usuario escriba un número, Python lo guarda como texto.

---

## 🔄​ CASTING (Conversión de tipos)

### 📌 ¿Qué es el casting?

Es convertir un tipo de dato en otro.

👉 Lo vamos a usar mucho con `input()`

---

#### 🔢 Convertir a entero

```python
edad = int(input("Ingresá tu edad: "))
```

---

#### 🔢 Convertir a punto flotante

```python
altura = float(input("Ingresá tu altura: "))
```

---

### ✅​ Ejemplo completo

```python
edad = int(input("Ingresá tu edad: "))

print(f"El año que viene vas a tener {edad + 1}")
```

---

### 🔴 Error común

```python
edad = input("Edad: ")

print(edad + 1)  # ❌ ERROR
```

👉 Porque `edad` es texto

✔ Solución:

```python
edad = int(input("Edad: "))
```

---

### ​🔄​ Tipos de casting más usados

```python
int()     # entero
float()   # decimal
str()     # texto
```

---

## 🧪 EJERCICIOS (INPUT + CASTING)

👉 Importante: muchos de estos ya los vieron en diagramas/pseudocódigo → ahora los pasamos a Python

---

### 🟢 1. Nombre

Pedir el nombre del usuario y mostrar:

```
Hola Juan
```

---

### 🟢 2. Edad

Pedir edad y mostrar:

```
Tenés X años
```

---

### 🟡 3. Suma de dos números

Pedir dos números al usuario y mostrar la suma.

👉 Usar `int()`

---

### 🟡 4. Conversión de metros a centímetros

Pedir una medida en metros y convertirla a centímetros.

👉 Recordar:

```
1 metro = 100 cm
```

---

### 🟡 5. Conversión de grados Celsius a Fahrenheit

Pedir temperatura en Celsius y convertir a Fahrenheit.

👉 Fórmula:

```
F = C * 9/5 + 32
```

---

### 🟡 6. Precio con IVA

Pedir el precio de un producto y mostrar el precio final con 21% de IVA.

---

### 🟡 7. Promedio de 3 números

Pedir tres números y mostrar el promedio.

---

### 🔵 8. Conversión de horas a minutos

Pedir una cantidad de horas y convertirla a minutos.

---

### 🔵 9. Sueldo mensual

Pedir:

* sueldo por hora
* cantidad de horas trabajadas

Mostrar sueldo total.

---

### 🔵 10. Datos del usuario

Pedir:

* nombre
* edad
* altura

Mostrar:

```
Hola Juan, tenés 25 años y medís 1.75 metros
```

---

## [🔙 ​Volver a Python Básico](./python_basico.md)