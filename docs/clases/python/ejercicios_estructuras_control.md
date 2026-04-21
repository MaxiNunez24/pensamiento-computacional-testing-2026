# 🧠 Estructuras de Control — Práctica Integradora

En esta práctica vas a trabajar con las tres estructuras de control fundamentales de Python:

- 🔀 **`if / elif / else`** → tomar decisiones
- 🔁 **`while`** → repetir mientras se cumpla una condición
- 🔂 **`for`** → repetir una cantidad conocida de veces

!!! tip "Consejo antes de arrancar"
    Leé el enunciado completo antes de escribir código. Identificá **qué datos entran**, **qué debe hacer el programa** y **qué debe mostrar**.

---

## 🔀 If / Elif / Else — Condicionales

Estos ejercicios trabajan la toma de decisiones: distintas respuestas según distintas condiciones.

### 🧪 Ejercicios

---

### 1️⃣ Clasificador de notas extendido

**Dificultad:** 🌿 Intermedio

Pedí una nota entre 0 y 10. Según el valor, mostrá la categoría correspondiente:

| Rango | Categoría |
|-------|-----------|
| 0 – 3 | ❌ Insuficiente |
| 4 – 5 | ⚠️ Regular |
| 6 – 7 | ✅ Aprobado |
| 8 – 9 | ⭐ Bueno |
| 10 | 🏆 Excelente |

Si el número está fuera del rango 0–10, mostrá un mensaje de error.

!!! note "Pista"
    Vas a necesitar varios `elif`. ¿Qué pasa si el usuario escribe `11` o `-1`?

---

### 2️⃣ ¿Puedo entrar al boliche?

**Dificultad:** 🌿 Intermedio

Un boliche permite entrar si la persona tiene **18 años o más** Y además **tiene entrada**.

Pedí los siguientes datos:

- `edad` → número entero
- `tiene_entrada` → el usuario escribe `"si"` o `"no"`

Mostrá si puede ingresar o no, y explicá el motivo si no puede.

!!! note "Pista"
    Combiná condiciones con `and`. Pensá también en los casos donde solo falla una de las dos condiciones.

---

### 3️⃣ Calculadora básica

**Dificultad:** 🌿 Intermedio

Pedí dos números y una operación (`+`, `-`, `*`, `/`). Realizá la operación y mostrá el resultado.

Tené en cuenta estos casos especiales:

- Si la operación ingresada **no es válida**, mostrá un mensaje de error.
- Si se intenta **dividir por cero**, avisale al usuario.

**Ejemplo de salida esperada:**

```
Ingresá el primer número: 10
Ingresá el segundo número: 0
Operación: /
⚠️ Error: no se puede dividir por cero.
```

---

### 4️⃣ Categoría de IMC

**Dificultad:** 🌿 Intermedio

Pedí el peso (en kg) y la altura (en metros) del usuario. Calculá el IMC con la fórmula:

```
IMC = peso / (altura ** 2)
```

Luego mostrá la categoría:

| IMC | Categoría |
|-----|-----------|
| Menor a 18.5 | 🔵 Bajo peso |
| 18.5 – 24.9 | 🟢 Normal |
| 25 – 29.9 | 🟡 Sobrepeso |
| 30 o más | 🔴 Obesidad |

!!! warning "Atención"
    No validamos si los valores son médicamente correctos, pero sí que sean números mayores a 0.

---

### 5️⃣ Año bisiesto

**Dificultad:** 🌶️ Avanzado

Pedí un año e indicá si es **bisiesto** o no. Un año es bisiesto si:

- Es divisible por **4**, **pero no** por 100
- **O** es divisible por **400**

**Ejemplo de salida esperada:**

```
Ingresá un año: 2000
✅ 2000 es bisiesto.

Ingresá un año: 1900
❌ 1900 no es bisiesto.
```

!!! tip "Desafío extra"
    ¿Podés hacerlo en una sola condición usando `and` y `or`?

---

### 🚀 Desafío

Creá un programa que simule el acceso a un sistema. El usuario debe ingresar su **nombre de usuario** y su **contraseña**. Según lo que ingrese, mostrá:

- `"✅ Bienvenido, [nombre]"` si ambos son correctos
- `"❌ Contraseña incorrecta"` si el usuario existe pero la clave no coincide
- `"❌ Usuario no encontrado"` si el usuario no existe

!!! note "Pista"
    Podés hardcodear un único usuario válido con su contraseña. No hace falta una lista.

---

## 🔁 While — Repetición con condición

Estos ejercicios repiten una acción **mientras se cumpla una condición**. El número de repeticiones no se conoce de antemano.

### 🧪 Ejercicios

---

### 1️⃣ Validación de contraseña 🌱

**Dificultad:** 🌱 Básico

El programa tiene una contraseña correcta: `"python2025"`. Pedile al usuario que la ingrese. Si no coincide, volvé a pedirla.

Reglas:

- El usuario tiene **máximo 3 intentos**.
- Si acierta → mostrá `"✅ Acceso concedido"`.
- Si se agotan los intentos → mostrá `"🚫 Cuenta bloqueada"`.

---

### 2️⃣ Menú de opciones 🌱

**Dificultad:** 🌱 Básico

Mostrá un menú con las siguientes opciones:

```
1 - Saludar
2 - Mostrar año actual
3 - Salir
```

El programa debe seguir mostrando el menú hasta que el usuario elija **Salir**. Si elige una opción que no existe, avisale con un mensaje de error y volvé a mostrar el menú.

---

### 3️⃣ Registro de asistencia 🌿

**Dificultad:** 🌿 Intermedio

El programa tiene una lista con 5 nombres de alumnos definidos en el código. Por cada alumno, preguntá si asistió (`"si"` / `"no"`). Al finalizar, mostrá:

- Cuántos alumnos **asistieron**
- Los nombres de los que **faltaron**

**Ejemplo de salida esperada:**

```
¿Asistió Ana? si
¿Asistió Bruno? no
...
✅ Asistieron: 3 alumnos
❌ Faltaron: Bruno, Diego
```

---

### 4️⃣ Mini banco 🌶️

**Dificultad:** 🌶️ Avanzado

Simulá una cuenta bancaria con saldo inicial de `$1000`. El programa muestra un menú con estas operaciones:

```
1 - Depositar
2 - Retirar
3 - Ver saldo
4 - Salir
```

Reglas:

- **Depositar**: el monto debe ser mayor a 0.
- **Retirar**: no se puede retirar más de lo que hay en la cuenta.
- El programa **continúa** hasta que el usuario elija Salir.
- Mostrá el saldo actualizado después de cada operación.

!!! tip "Desafío extra"
    ¿Podrías llevar un registro de todas las operaciones realizadas y mostrarlo al salir?

---

## 🔂 For — Repetición con rango

Estos ejercicios repiten una acción una **cantidad conocida de veces**, usando `range()` o recorriendo una secuencia.

### 🧪 Ejercicios

---

### 1️⃣ FizzBuzz 🌿

**Dificultad:** 🌿 Intermedio

Mostrá los números del 1 al 50, pero con estas reglas:

- Si el número es divisible por **3** → mostrá `Fizz`
- Si el número es divisible por **5** → mostrá `Buzz`
- Si es divisible por **ambos** → mostrá `FizzBuzz`
- Si no cumple ninguna → mostrá el número normalmente

!!! warning "¡Ojo con el orden!"
    El orden en que escribís los `if` importa. ¿Por cuál condición conviene chequear primero?

---

### 2️⃣ Detector de par/impar en rango 🌿

**Dificultad:** 🌿 Intermedio

Pedí dos números: `inicio` y `fin`. Recorrelos y mostrá cuáles son pares y cuáles impares. Al final, mostrá cuántos pares y cuántos impares hay en ese rango.

Validaciones:

- El `inicio` debe ser **menor que el fin**.
- Si no lo es, mostrá un mensaje de error.

**Ejemplo de salida esperada:**

```
2 → par
3 → impar
4 → par
...
📊 Pares: 5 | Impares: 4
```

---

### 3️⃣ Suma de dígitos 🌿

**Dificultad:** 🌿 Intermedio

Pedile al usuario un número entero positivo. Calculá la **suma de sus dígitos** recorriéndolos con `for`.

**Ejemplo:**

```
Ingresá un número: 1234
Suma de dígitos: 10
```

!!! note "Pista"
    Podés convertir el número a `str` para recorrer cada carácter, y luego convertir cada uno a `int`.

---

### 4️⃣ Números primos en un rango 🌶️

**Dificultad:** 🌶️ Avanzado

Pedí dos números: `inicio` y `fin`. Mostrá todos los números **primos** que hay en ese rango.

Un número es primo si solo es divisible por 1 y por sí mismo.

**Ejemplo:**

```
Inicio: 1
Fin: 20
Primos: 2, 3, 5, 7, 11, 13, 17, 19
```

!!! note "Pista"
    Vas a necesitar un `for` dentro de otro `for`: uno para recorrer el rango, y otro para chequear si el número es primo.

---

## 🆓 Ejercicios Libres — Elegí la estructura vos

!!! info "¿Qué significa «libre»?"
    En estos ejercicios **no se indica qué estructura usar**. Analizá el problema, decidí cuál es la más adecuada y justificá tu elección. En algunos casos vas a necesitar **combinar más de una**.

---

### 1️⃣ Conversor de temperatura 🌱

**Dificultad:** 🌱 Básico

Pedí una temperatura y la unidad en que está expresada (`C` para Celsius, `F` para Fahrenheit). Convertila a la otra unidad y mostrá el resultado.

Fórmulas:

```
°F = °C × 9/5 + 32
°C = (°F - 32) × 5/9
```

Si la unidad ingresada no es válida, mostrá un mensaje de error.

---

### 2️⃣ Contador de vocales 🌿

**Dificultad:** 🌿 Intermedio

Pedile al usuario una palabra o frase. Contá cuántas vocales tiene (considerá mayúsculas y minúsculas) y mostrá el resultado.

**Ejemplo:**

```
Ingresá una frase: Hola Mundo
Vocales encontradas: 4
```

!!! note "Pista"
    Podés definir una variable `vocales = "aeiouAEIOU"` y chequear si cada carácter está en ella.

---

### 3️⃣ Tabla de conversión 🌿

**Dificultad:** 🌿 Intermedio

Generá una tabla que muestre la conversión de **kilómetros a millas** para valores del 0 al 100, de 10 en 10.

La fórmula es: `millas = km × 0.621371`

**Ejemplo de salida esperada:**

```
km    | millas
------|-------
0     | 0.0
10    | 6.21
20    | 12.43
...
```

---

### 4️⃣ Pirámide invertida 🌶️

**Dificultad:** 🌶️ Avanzado

Pedí un número `n` e imprimí una pirámide **invertida** de asteriscos de `n` filas.

**Ejemplo con `n = 5`:**

```
*****
****
***
**
*
```

!!! tip "Desafío extra"
    ¿Podés hacer que la pirámide esté **centrada**? Para eso vas a necesitar agregar espacios antes de cada fila.