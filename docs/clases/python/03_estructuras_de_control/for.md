# 🔁 Estructura de control `for` en Python

## 🤔 ¿Qué es un bucle `for`?

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

## 🔢 `range()`: el mejor amigo del `for`

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

## ⚔️ `for` vs `while`: comparación directa

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

## ⏭️ `break` y `continue`

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

## 🧪 Ejercicios de repaso

### 🟢 Nivel 1 — Comprensión básica

!!! exercise "Ejercicio 1"
    Escribí un programa que imprima los números del 1 al 10 usando `for`.

!!! exercise "Ejercicio 2"
    Escribí un programa que imprima solo los números **pares** entre 1 y 20.  
    *Pista: usá el tercer parámetro de `range()`.*

!!! exercise "Ejercicio 3"
    Pedile al usuario su nombre e imprimí cada letra en una línea distinta.

---

### 🟡 Nivel 2 — Lógica dentro del bucle

!!! exercise "Ejercicio 4"
    Escribí un programa que sume todos los números del 1 al 100 e imprima el resultado.  
    *Resultado esperado: 5050*

!!! exercise "Ejercicio 5"
    Pedile al usuario un número `n` y calculá su factorial usando `for`.  
    *Ejemplo: factorial de 5 = 5 × 4 × 3 × 2 × 1 = 120*

!!! exercise "Ejercicio 6"
    Mostrá la tabla de multiplicar de un número que ingrese el usuario (del 1 al 10).

---

### 🔴 Nivel 3 — Desafío

!!! exercise "Ejercicio 7 ⭐"
    Pedile al usuario que ingrese 5 notas (una por vez, usando `for`) y al final mostrá el **promedio**.

!!! exercise "Ejercicio 8 ⭐"
    Imprimí un triángulo de asteriscos de `n` filas, donde `n` lo ingresa el usuario.  
    ```
    *
    **
    ***
    ****
    ```
    *Pista: vas a necesitar un `for` dentro de otro `for`, o bien multiplicar strings.*

---



---

## 💡 Soluciones de referencia

??? note "Ver soluciones"

    ```python
    # Ejercicio 1
    for i in range(1, 11):
        print(i)
    ```

    ```python
    # Ejercicio 2
    for i in range(2, 21, 2):
        print(i)
    ```

    ```python
    # Ejercicio 3
    nombre = input("Ingresá tu nombre: ")
    for letra in nombre:
        print(letra)
    ```

    ```python
    # Ejercicio 4
    suma = 0
    for i in range(1, 101):
        suma += i
    print(suma)
    ```

    ```python
    # Ejercicio 5
    n = int(input("Ingresá un número: "))
    factorial = 1
    for i in range(1, n + 1):
        factorial *= i
    print(f"El factorial de {n} es {factorial}")
    ```

    ```python
    # Ejercicio 6
    n = int(input("¿De qué número querés la tabla? "))
    for i in range(1, 11):
        print(f"{n} x {i} = {n * i}")
    ```

    ```python
    # Ejercicio 7
    suma = 0
    for i in range(5):
        nota = float(input(f"Nota {i + 1}: "))
        suma += nota
    promedio = suma / 5
    print(f"Promedio: {promedio}")
    ```

    ```python
    # Ejercicio 8
    n = int(input("¿Cuántas filas? "))
    for i in range(1, n + 1):
        print("*" * i)
    ```

## [⬅️ Anterior: While](./while.md)
## [📚 Índice](../../clases.md#estructuras-de-control)
## [➡️ Siguiente: Ejercicios — Estructuras de Control](./ejercicios_estructuras_control.md)