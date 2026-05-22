# ⌨️​ La función input() (Entrada de datos)

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

## 🎮 Ejercicios

### 🌱 1. Nombre

Pedí el nombre del usuario y mostrá `"Hola Juan"`.

??? success "✅ Solución"
    ```python
    nombre = input("Ingresá tu nombre: ")
    print(f"Hola {nombre}")
    ```

### 🌱 2. Edad

Pedí la edad y mostrá `"Tenés X años"`.

??? success "✅ Solución"
    ```python
    edad = int(input("¿Cuántos años tenés? "))
    print(f"Tenés {edad} años")
    ```

### 🌱 3. Suma de dos números

Pedí dos números al usuario y mostrá la suma.

```
Primer número: 5
Segundo número: 3
Suma: 8
```

??? tip "💡 Pista"
    `input()` siempre devuelve un string. Para sumar números, necesitás convertirlos con `int()` o `float()`.

??? success "✅ Solución"
    ```python
    a = int(input("Primer número: "))
    b = int(input("Segundo número: "))
    print(f"Suma: {a + b}")
    ```

### 🌱 4. Metros a centímetros

Pedí una medida en metros y convertila a centímetros.

```
Metros: 1.75
175.0 cm
```

??? success "✅ Solución"
    ```python
    metros = float(input("Metros: "))
    print(f"{metros * 100} cm")
    ```

### 🌱 5. Celsius a Fahrenheit

Pedí temperatura en Celsius y convertila a Fahrenheit (fórmula: `F = C * 9/5 + 32`).

```
Temperatura en Celsius: 100
212.0°F
```

??? success "✅ Solución"
    ```python
    c = float(input("Temperatura en Celsius: "))
    f = c * 9/5 + 32
    print(f"{f}°F")
    ```

### 🌿 6. Precio con IVA

Pedí el precio de un producto y mostrá el precio final con 21% de IVA.

```
Precio: 100
Precio con IVA: $121.00
```

??? success "✅ Solución"
    ```python
    precio = float(input("Precio: "))
    final  = precio * 1.21
    print(f"Precio con IVA: ${final:.2f}")
    ```

### 🌿 7. Promedio de 3 números

Pedí tres números y mostrá el promedio.

```
Número 1: 7
Número 2: 9
Número 3: 8
Promedio: 8.0
```

??? success "✅ Solución"
    ```python
    a = float(input("Número 1: "))
    b = float(input("Número 2: "))
    c = float(input("Número 3: "))
    print(f"Promedio: {(a + b + c) / 3}")
    ```

### 🌿 8. Horas a minutos

Pedí una cantidad de horas y convertila a minutos.

```
Horas: 2
120 minutos
```

??? success "✅ Solución"
    ```python
    horas = int(input("Horas: "))
    print(f"{horas * 60} minutos")
    ```

### 🌿 9. Sueldo mensual

Pedí el sueldo por hora y la cantidad de horas trabajadas. Mostrá el sueldo total.

```
Sueldo por hora: 500
Horas trabajadas: 160
Sueldo total: $80000.00
```

??? success "✅ Solución"
    ```python
    sueldo_hora = float(input("Sueldo por hora: "))
    horas       = int(input("Horas trabajadas: "))
    print(f"Sueldo total: ${sueldo_hora * horas:.2f}")
    ```

### 🌿 10. Datos del usuario

Pedí nombre, edad y altura. Mostrá: `"Hola Juan, tenés 25 años y medís 1.75 metros"`.

??? success "✅ Solución"
    ```python
    nombre = input("Nombre: ")
    edad   = int(input("Edad: "))
    altura = float(input("Altura (en metros): "))
    print(f"Hola {nombre}, tenés {edad} años y medís {altura} metros")
    ```

---

## [⬅️ Anterior: Formato de strings](./formato_strings.md)
## [📚 Índice](../../clases.md#variables)
## [➡️ Siguiente: If / Else](../03_estructuras_de_control/if_else.md)