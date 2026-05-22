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

??? tip "💡 Pista"
    Vas a necesitar varios `elif`. ¿Qué pasa si el usuario escribe `11` o `-1`?

??? success "✅ Solución"
    ```python
    nota = int(input("Ingresá una nota entre 0 y 10: "))

    if nota < 0 or nota > 10:
        print("❌ Nota fuera de rango.")
    elif nota <= 3:
        print("❌ Insuficiente")
    elif nota <= 5:
        print("⚠️ Regular")
    elif nota <= 7:
        print("✅ Aprobado")
    elif nota <= 9:
        print("⭐ Bueno")
    else:
        print("🏆 Excelente")
    ```

---

### 2️⃣ ¿Puedo entrar al boliche?

**Dificultad:** 🌿 Intermedio

Un boliche permite entrar si la persona tiene **18 años o más** Y además **tiene entrada**.

Pedí los siguientes datos:

- `edad` → número entero
- `tiene_entrada` → el usuario escribe `"si"` o `"no"`

Mostrá si puede ingresar o no, y explicá el motivo si no puede.

??? tip "💡 Pista"
    Combiná condiciones con `and`. Pensá también en los casos donde solo falla una de las dos condiciones.

??? success "✅ Solución"
    ```python
    edad = int(input("¿Cuántos años tenés? "))
    tiene_entrada = input("¿Tenés entrada? (si/no): ").lower()

    if edad >= 18 and tiene_entrada == "si":
        print("✅ Podés ingresar.")
    elif edad < 18:
        print("❌ Sos menor de edad.")
    else:
        print("❌ No tenés entrada.")
    ```

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

??? tip "💡 Pista"
    Primero verificá si la operación es válida. Dentro de la rama `/`, verificá por separado si el divisor es cero antes de operar.

??? success "✅ Solución"
    ```python
    a = float(input("Ingresá el primer número: "))
    b = float(input("Ingresá el segundo número: "))
    op = input("Operación (+, -, *, /): ")

    if op == "+":
        print(f"Resultado: {a + b}")
    elif op == "-":
        print(f"Resultado: {a - b}")
    elif op == "*":
        print(f"Resultado: {a * b}")
    elif op == "/":
        if b == 0:
            print("⚠️ Error: no se puede dividir por cero.")
        else:
            print(f"Resultado: {a / b}")
    else:
        print("❌ Operación no válida.")
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

??? tip "💡 Pista"
    Primero calculá el IMC con la fórmula. Después usá `elif` para cada rango — ¿en qué orden conviene poner las condiciones?

??? success "✅ Solución"
    ```python
    peso   = float(input("Peso en kg: "))
    altura = float(input("Altura en metros: "))

    if peso <= 0 or altura <= 0:
        print("❌ Valores inválidos.")
    else:
        imc = peso / (altura ** 2)
        print(f"Tu IMC es: {imc:.1f}")
        if imc < 18.5:
            print("🔵 Bajo peso")
        elif imc < 25:
            print("🟢 Normal")
        elif imc < 30:
            print("🟡 Sobrepeso")
        else:
            print("🔴 Obesidad")
    ```

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

??? tip "💡 Pista"
    La regla es: bisiesto si (`divisible por 4` Y `no divisible por 100`) O (`divisible por 400`). Escribila tal cual con `and` y `or`.

??? success "✅ Solución"
    ```python
    año = int(input("Ingresá un año: "))

    if (año % 4 == 0 and año % 100 != 0) or (año % 400 == 0):
        print(f"✅ {año} es bisiesto.")
    else:
        print(f"❌ {año} no es bisiesto.")
    ```

---

### 🚀 Desafío

Creá un programa que simule el acceso a un sistema. El usuario debe ingresar su **nombre de usuario** y su **contraseña**. Según lo que ingrese, mostrá:

- `"✅ Bienvenido, [nombre]"` si ambos son correctos
- `"❌ Contraseña incorrecta"` si el usuario existe pero la clave no coincide
- `"❌ Usuario no encontrado"` si el usuario no existe

??? tip "💡 Pista"
    Podés hardcodear un único usuario válido con su contraseña. No hace falta una lista.

??? success "✅ Solución"
    ```python
    USUARIO_VALIDO   = "admin"
    CONTRASENA_VALIDA = "1234"

    usuario    = input("Usuario: ")
    contrasena = input("Contraseña: ")

    if usuario == USUARIO_VALIDO:
        if contrasena == CONTRASENA_VALIDA:
            print(f"✅ Bienvenido, {usuario}")
        else:
            print("❌ Contraseña incorrecta")
    else:
        print("❌ Usuario no encontrado")
    ```

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

```
Contraseña: hola
❌ Incorrecto. Te quedan 2 intentos.
Contraseña: python2025
✅ Acceso concedido.
```

??? tip "💡 Pista"
    ¿Con qué variable llevás la cuenta de los intentos? ¿Cuándo tiene que terminar el `while`: cuando aciertan O cuando se agotan los intentos?

??? success "✅ Solución"
    ```python
    CONTRASENA = "python2025"
    intentos   = 0
    max_intentos = 3

    while intentos < max_intentos:
        ingresada = input("Contraseña: ")
        intentos += 1
        if ingresada == CONTRASENA:
            print("✅ Acceso concedido.")
            break
        else:
            restantes = max_intentos - intentos
            if restantes > 0:
                print(f"❌ Incorrecto. Te quedan {restantes} intentos.")
    else:
        print("🚫 Cuenta bloqueada.")
    ```

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

??? tip "💡 Pista"
    `while True` es una buena base para un menú que se repite. ¿Cuándo usás `break` para salir del bucle?

??? success "✅ Solución"
    ```python
    while True:
        print("\n1 - Saludar")
        print("2 - Mostrar año actual")
        print("3 - Salir")
        opcion = input("Elegí una opción: ")

        if opcion == "1":
            print("¡Hola!")
        elif opcion == "2":
            print("Año actual: 2026")
        elif opcion == "3":
            print("¡Hasta luego!")
            break
        else:
            print("❌ Opción no válida. Intentá de nuevo.")
    ```

---

### 3️⃣ Contador de intentos 🌿
 
**Dificultad:** 🌿 Intermedio
 
El programa le hace una pregunta de cultura general al usuario (podés elegir cualquiera). El usuario puede intentar responderla hasta que acierte o hasta que se agoten **5 intentos**.
 
Mostrá en cada intento si la respuesta es correcta o no. Al finalizar, mostrá cuántos intentos usó.
 
**Ejemplo de salida esperada:**
 
```
¿Cuál es la capital de Australia? Londres
❌ Incorrecto, intentá de nuevo. (Intento 1 de 5)
¿Cuál es la capital de Australia? Sídney
❌ Incorrecto, intentá de nuevo. (Intento 2 de 5)
¿Cuál es la capital de Australia? Canberra
✅ ¡Correcto! Lo lograste en 3 intentos.
```
 
??? tip "💡 Pista"
    Necesitás un contador de intentos. ¿Cuándo termina el bucle: cuando el usuario acierta, o cuando llega al límite, o ambas cosas?

??? success "✅ Solución"
    ```python
    RESPUESTA_CORRECTA = "Canberra"
    max_intentos = 5
    intento = 0

    while intento < max_intentos:
        intento += 1
        respuesta = input("¿Cuál es la capital de Australia? ")
        if respuesta == RESPUESTA_CORRECTA:
            print(f"✅ ¡Correcto! Lo lograste en {intento} intento(s).")
            break
        else:
            print(f"❌ Incorrecto, intentá de nuevo. (Intento {intento} de {max_intentos})")
    else:
        print(f"🚫 Se agotaron los intentos. La respuesta era: {RESPUESTA_CORRECTA}")
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

??? tip "💡 Pista"
    Usá `while True` con `break` para salir. Dentro del menú, cada opción modifica el saldo. ¿Qué verificás antes de permitir un retiro?

??? success "✅ Solución"
    ```python
    saldo = 1000

    while True:
        print(f"\nSaldo actual: ${saldo}")
        print("1 - Depositar")
        print("2 - Retirar")
        print("3 - Ver saldo")
        print("4 - Salir")
        opcion = input("Elegí: ")

        if opcion == "1":
            monto = float(input("Monto a depositar: "))
            if monto > 0:
                saldo += monto
                print(f"✅ Depositaste ${monto}. Saldo: ${saldo}")
            else:
                print("❌ El monto debe ser mayor a 0.")
        elif opcion == "2":
            monto = float(input("Monto a retirar: "))
            if monto <= 0:
                print("❌ El monto debe ser mayor a 0.")
            elif monto > saldo:
                print("❌ Saldo insuficiente.")
            else:
                saldo -= monto
                print(f"✅ Retiraste ${monto}. Saldo: ${saldo}")
        elif opcion == "3":
            print(f"Tu saldo es: ${saldo}")
        elif opcion == "4":
            print("¡Hasta luego!")
            break
        else:
            print("❌ Opción no válida.")
    ```

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

??? tip "💡 Pista"
    Si un número es divisible por 15 (que es 3×5), es FizzBuzz. ¿Esa condición tiene que ir antes o después de las otras?

??? success "✅ Solución"
    ```python
    for n in range(1, 51):
        if n % 15 == 0:
            print("FizzBuzz")
        elif n % 3 == 0:
            print("Fizz")
        elif n % 5 == 0:
            print("Buzz")
        else:
            print(n)
    ```

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

??? tip "💡 Pista"
    Verificá que `inicio < fin` antes de arrancar el `for`. Usá dos contadores (uno para pares, otro para impares) que se incrementan dentro del bucle.

??? success "✅ Solución"
    ```python
    inicio = int(input("Inicio: "))
    fin    = int(input("Fin: "))

    if inicio >= fin:
        print("❌ El inicio debe ser menor que el fin.")
    else:
        pares = 0
        impares = 0
        for n in range(inicio, fin + 1):
            if n % 2 == 0:
                print(f"{n} → par")
                pares += 1
            else:
                print(f"{n} → impar")
                impares += 1
        print(f"📊 Pares: {pares} | Impares: {impares}")
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

??? tip "💡 Pista"
    Podés convertir el número a `str` para recorrer cada carácter. ¿Cómo convertís cada carácter de vuelta a número para sumarlo?

??? success "✅ Solución"
    ```python
    numero = input("Ingresá un número: ")
    suma = 0
    for digito in numero:
        suma += int(digito)
    print(f"Suma de dígitos: {suma}")
    ```

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

??? tip "💡 Pista"
    Para cada número del rango, necesitás saber si es primo. ¿Cómo chequeás eso? Un número es primo si ningún número entre 2 y él mismo lo divide exactamente.

??? success "✅ Solución"
    ```python
    inicio = int(input("Inicio: "))
    fin    = int(input("Fin: "))
    primos = []

    for n in range(max(2, inicio), fin + 1):
        es_primo = True
        for divisor in range(2, n):
            if n % divisor == 0:
                es_primo = False
                break
        if es_primo:
            primos.append(n)

    print(f"Primos: {', '.join(str(p) for p in primos)}")
    ```

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

```
Temperatura: 100
Unidad (C/F): C
→ 212.0°F
```

??? tip "💡 Pista"
    ¿Qué estructura usás para elegir entre dos casos? ¿Qué pasa si la unidad no es ni `C` ni `F`?

??? success "✅ Solución"
    ```python
    temp  = float(input("Temperatura: "))
    unidad = input("Unidad (C/F): ").upper()

    if unidad == "C":
        resultado = temp * 9/5 + 32
        print(f"→ {resultado:.1f}°F")
    elif unidad == "F":
        resultado = (temp - 32) * 5/9
        print(f"→ {resultado:.1f}°C")
    else:
        print("❌ Unidad no válida. Usá C o F.")
    ```

---

### 2️⃣ Contador de vocales 🌿

**Dificultad:** 🌿 Intermedio

Pedile al usuario una palabra o frase. Contá cuántas vocales tiene (considerá mayúsculas y minúsculas) y mostrá el resultado.

**Ejemplo:**

```
Ingresá una frase: Hola Mundo
Vocales encontradas: 4
```

??? tip "💡 Pista"
    Podés definir una variable `vocales = "aeiouAEIOU"` y chequear si cada carácter está en ella.

??? success "✅ Solución"
    ```python
    frase  = input("Ingresá una frase: ")
    vocales = "aeiouAEIOU"
    conteo = 0
    for c in frase:
        if c in vocales:
            conteo += 1
    print(f"Vocales encontradas: {conteo}")
    ```

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

??? tip "💡 Pista"
    `range(0, 101, 10)` te da los valores de 0 a 100 de 10 en 10. ¿Cómo formateás el resultado para que los números queden alineados?

??? success "✅ Solución"
    ```python
    print(f"{'km':<6} | {'millas'}")
    print("-" * 16)
    for km in range(0, 101, 10):
        millas = km * 0.621371
        print(f"{km:<6} | {millas:.2f}")
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

??? tip "💡 Pista"
    Si `n = 5`, la primera fila tiene 5 asteriscos, la segunda 4, la tercera 3... ¿Cómo expresás eso con `range(n, 0, -1)` y `"*" * cantidad`?

??? success "✅ Solución"
    ```python
    n = int(input("Ingresá el tamaño: "))
    for i in range(n, 0, -1):
        print("*" * i)
    ```

## [⬅️ Anterior: For](./for.md)
## [📚 Índice](../../clases.md#estructuras-de-control)
## [➡️ Siguiente: Listas en Python](../04_listas/listas.md)