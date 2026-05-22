# 🔁 Estructura de control for en Python

## 🤔 ¿Qué es un bucle for?

La clase pasada vimos `while`, que repite un bloque **mientras** se cumpla una condición. El `for` es distinto: lo usamos cuando sabemos (o podemos calcular) **cuántas veces** queremos repetir algo, o cuando queremos **recorrer** una secuencia elemento por elemento.

!!! info "Diferencia clave con `while`"
    - `while` → repetir **hasta que** algo cambie  
    - `for` → repetir **para cada elemento** de una secuencia, o una cantidad fija de veces

---

## 📝 Sintaxis básica

```python
for variable in secuencia:
    # bloque que se repite
```

- `variable` toma el valor de cada elemento de la secuencia en cada iteración
- el bloque debe estar **indentado** (4 espacios o 1 tab)

---

## 🔢 range(): el mejor amigo del for

`range()` genera una secuencia de números. Es la forma más común de controlar cuántas veces se repite el bucle.

| Forma | Resultado |
|---|---|
| `range(5)` | 0, 1, 2, 3, 4 |
| `range(1, 6)` | 1, 2, 3, 4, 5 |
| `range(0, 10, 2)` | 0, 2, 4, 6, 8 |
| `range(5, 0, -1)` | 5, 4, 3, 2, 1 |

```python
# Imprimir del 1 al 5
for i in range(1, 6):
    print(i)
```

```python
# Contar de 2 en 2
for i in range(0, 11, 2):
    print(i)
```

---

## 🔤 Recorrer cadenas de texto

Los `string` también son secuencias, podemos recorrerlos letra por letra:

```python
nombre = "Python"
for letra in nombre:
    print(letra)
```

```
P
y
t
h
o
n
```

---

## ⚔️ for vs while: comparación directa

Mismo problema, dos soluciones:

```python
# Con while
i = 1
while i <= 5:
    print(i)
    i += 1

# Con for
for i in range(1, 6):
    print(i)
```

!!! tip "¿Cuándo usar cada uno?"
    Usá `for` cuando sabés cuántas veces repetir. Usá `while` cuando dependés de una condición que puede cambiar de formas imprevisibles.

---

## ⏭️ break y continue

Funcionan igual que en `while`:

```python
# break: sale del bucle antes de terminar
for i in range(10):
    if i == 5:
        break
    print(i)
# Imprime: 0 1 2 3 4
```

```python
# continue: saltea la iteración actual y sigue
for i in range(6):
    if i == 3:
        continue
    print(i)
# Imprime: 0 1 2 4 5
```

---

## 🎮 Ejercicios

### 🌱 Ejercicio 1 — Del 1 al 10 con for

Escribí un programa que imprima los números del 1 al 10 usando `for`.

```
1
2
...
10
```

??? tip "💡 Pista"
    `range(1, 11)` genera los números del 1 al 10 inclusive. El último valor de `range` no se incluye.

??? success "✅ Solución"
    ```python
    for i in range(1, 11):
        print(i)
    ```

### 🌱 Ejercicio 2 — Solo los pares

Escribí un programa que imprima solo los números **pares** entre 1 y 20.

```
2
4
6
...
20
```

??? tip "💡 Pista"
    `range()` acepta un tercer parámetro: el paso. ¿Qué paso te daría solo los pares si arrancás en 2?

??? success "✅ Solución"
    ```python
    for i in range(2, 21, 2):
        print(i)
    ```

### 🌱 Ejercicio 3 — Letra por letra

Pedile al usuario su nombre e imprimí cada letra en una línea distinta.

```
Ingresá tu nombre: Ana
A
n
a
```

??? tip "💡 Pista"
    Un string es una secuencia de caracteres. El `for` puede recorrer cualquier secuencia directamente, no solo `range()`.

??? success "✅ Solución"
    ```python
    nombre = input("Ingresá tu nombre: ")
    for letra in nombre:
        print(letra)
    ```

### 🌿 Ejercicio 4 — Suma del 1 al 100

Escribí un programa que sume todos los números del 1 al 100 e imprima el resultado.

```
5050
```

??? tip "💡 Pista"
    Necesitás un acumulador que empiece en 0 y en cada vuelta del `for` sume el valor actual de `i`.

??? success "✅ Solución"
    ```python
    suma = 0
    for i in range(1, 101):
        suma += i
    print(suma)
    ```

### 🌿 Ejercicio 5 — Factorial

Pedile al usuario un número `n` y calculá su factorial usando `for`.

```
Ingresá un número: 5
El factorial de 5 es 120
```

*El factorial de 5 = 5 × 4 × 3 × 2 × 1 = 120*

??? tip "💡 Pista"
    El acumulador para el factorial arranca en 1 (no en 0), y en lugar de sumar, multiplica. ¿Qué rango de números necesitás multiplicar?

??? success "✅ Solución"
    ```python
    n = int(input("Ingresá un número: "))
    factorial = 1
    for i in range(1, n + 1):
        factorial *= i
    print(f"El factorial de {n} es {factorial}")
    ```

### 🌿 Ejercicio 6 — Tabla de multiplicar

Mostrá la tabla de multiplicar de un número que ingrese el usuario (del 1 al 10).

```
¿De qué número querés la tabla? 7
7 x 1 = 7
7 x 2 = 14
...
7 x 10 = 70
```

??? tip "💡 Pista"
    El número ingresado es fijo — lo que varía es el multiplicador, que va del 1 al 10.

??? success "✅ Solución"
    ```python
    n = int(input("¿De qué número querés la tabla? "))
    for i in range(1, 11):
        print(f"{n} x {i} = {n * i}")
    ```

### 🌶️ Ejercicio 7 — Promedio de 5 notas ⭐

Pedile al usuario que ingrese 5 notas (una por vez, usando `for`) y al final mostrá el **promedio**.

```
Nota 1: 8
Nota 2: 7
Nota 3: 9
Nota 4: 6
Nota 5: 10
Promedio: 8.0
```

??? tip "💡 Pista"
    Usá `range(5)` para pedir 5 notas. Para mostrar el número de nota en el mensaje usá `i + 1` (porque `range(5)` empieza en 0). Acumulá la suma y dividí al final.

??? success "✅ Solución"
    ```python
    suma = 0
    for i in range(5):
        nota = float(input(f"Nota {i + 1}: "))
        suma += nota
    print(f"Promedio: {suma / 5}")
    ```

### 🌶️ Ejercicio 8 — Triángulo de asteriscos ⭐

Pedile al usuario un número `n` e imprimí un triángulo de asteriscos de `n` filas.

```
¿Cuántas filas? 4
*
**
***
****
```

??? tip "💡 Pista"
    En cada iteración, la fila número `i` tiene `i` asteriscos. ¿Cómo multiplicás un string en Python para repetirlo? ¿Y cuántas veces repetís `"*"` en la fila `i`?

??? success "✅ Solución"
    ```python
    n = int(input("¿Cuántas filas? "))
    for i in range(1, n + 1):
        print("*" * i)
    ```

## [⬅️ Anterior: While](./while.md)
## [📚 Índice](../../clases.md#estructuras-de-control)
## [➡️ Siguiente: Ejercicios — Estructuras de Control](./ejercicios_estructuras_control.md)