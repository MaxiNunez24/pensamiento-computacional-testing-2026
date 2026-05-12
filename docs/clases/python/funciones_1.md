# 📦 Funciones I — Definición, parámetros y retorno

!!! tip "🧱 El bloque fundamental de la programación"
    Hasta ahora escribimos programas como recetas lineales: una instrucción tras otra. Las **funciones** nos permiten darle **nombre a un bloque de código** y reutilizarlo cuantas veces queramos, con datos distintos cada vez.

    === "❌ Sin funciones"

        ```python
        print(f"Área: {3 * 4}")
        print(f"Área: {5 * 7}")
        print(f"Área: {10 * 2}")
        # Repetición → si cambia la fórmula, hay que cambiarla en 3 lugares
        ```

    === "✅ Con funciones"

        ```python
        def area_rectangulo(base, alto):
            return base * alto

        print(f"Área: {area_rectangulo(3, 4)}")
        print(f"Área: {area_rectangulo(5, 7)}")
        print(f"Área: {area_rectangulo(10, 2)}")
        # Si cambia la fórmula, solo cambia en un lugar
        ```

!!! info "🎯 Objetivos de la clase"
    Al terminar la clase deberían poder:

    - Definir y llamar **funciones** propias con `def` y `return`.
    - Entender la diferencia entre **parámetros** y **argumentos**.
    - Diseñar funciones con **una sola responsabilidad**.
    - Retornar **múltiples valores** con tuplas.

---

## 🤔 ¿Por qué necesitamos funciones?

!!! success "1. 🔄 Evitar repetición (principio DRY)"
    **DRY** = *Don't Repeat Yourself*. Si el mismo código aparece en tres lugares y necesitás cambiarlo, tenés que cambiarlo en los tres. Con una función, lo cambiás en un solo lugar.

!!! success "2. 🧩 Dividir problemas grandes en partes pequeñas"
    `calcular_promedio()`, `filtrar_aprobados()`, `imprimir_boletin()` son mucho más legibles que 60 líneas de código plano. Las funciones permiten **nombrar** las partes del problema.

!!! success "3. 🧪 Facilitar el testing"
    Más adelante vamos a aprender a testear código automáticamente. Una función es la **unidad mínima de testing**: podés verificar que `calcular_promedio([8, 9, 10])` devuelve `9.0` sin ejecutar todo el programa.

---

## 🔧 Anatomía de una función

```python
#↓ palabra clave ↓ nombre ↓ parámetros
def area_rectangulo(base, alto):
    resultado = base * alto    # ← cuerpo (indentado)
    return resultado           # ← valor de retorno
#   ↑ palabra clave
```

| Parte | Qué es |
|-------|--------|
| `def` | Indica "estoy definiendo una función" |
| `area_rectangulo` | Nombre (snake_case, descriptivo) |
| `(base, alto)` | **Parámetros**: variables que recibe la función |
| Cuerpo indentado | El código que ejecuta la función |
| `return` | El valor que devuelve al código llamador |

### 📞 Definición vs. llamada

```python
# Definición: solo describe qué hace, NO lo ejecuta
def area_rectangulo(base, alto):
    return base * alto

# Llamada: acá SÍ se ejecuta
resultado = area_rectangulo(3, 4)   # base=3, alto=4
print(resultado)  # 12

print(area_rectangulo(5, 7))  # 35 — también podés usarlo directamente
```

!!! warning "⚠️ Definir ≠ Ejecutar"
    El bloque `def` solo **registra** la función. El código del cuerpo se ejecuta únicamente cuando **llamás** a la función. Si nunca la llamás, nunca se ejecuta.

---

## 🔤 Parámetros vs. argumentos

```python
def saludar(nombre):       # 'nombre' es el PARÁMETRO (definición)
    print(f"Hola, {nombre}!")

saludar("Maxi")            # "Maxi" es el ARGUMENTO (llamada)
```

- **Parámetro**: variable que aparece en la *definición*. Es un "hueco" con nombre.
- **Argumento**: valor concreto que pasás al *llamar*. Rellena el hueco.

---

## 🔙 Return: devolver valores

`return` hace dos cosas: **detiene** la función y **devuelve** un valor al llamador.

=== "📤 Con return"

    ```python
    def cuadrado(n):
        return n ** 2

    x = cuadrado(5)
    print(x)       # 25
    print(x + 1)   # 26 — podés operar con el resultado
    ```

=== "❌ Sin return (devuelve None)"

    ```python
    def imprimir_cuadrado(n):
        print(n ** 2)   # muestra en pantalla, pero no devuelve nada

    x = imprimir_cuadrado(5)  # imprime 25
    print(x)                  # None ← no tiene valor de retorno
    ```

    !!! tip "🧠 `print` vs `return`"
        `print()` muestra algo en pantalla para que lo **vea un humano**.
        `return` devuelve un valor para que lo **use el programa**.
        Son cosas distintas. Una función que solo hace `print` no puede ser usada en cálculos.

=== "⛔ Return corta la ejecución"

    ```python
    def primera_par(nums):
        for n in nums:
            if n % 2 == 0:
                return n    # ← sale de la función acá
        return None         # si no encontró ninguna

    print(primera_par([1, 3, 4, 7]))  # 4
    print(primera_par([1, 3, 5]))     # None
    ```

---

## 🔢 Múltiples parámetros

```python
def presentar(nombre, edad, ciudad):
    return f"Soy {nombre}, tengo {edad} años y vivo en {ciudad}."

print(presentar("Maxi", 27, "Ensenada"))
print(presentar("Ana",  20, "La Plata"))
```

!!! warning "⚠️ El orden importa"
    Los argumentos se asignan a los parámetros **en orden**. En la próxima clase vemos cómo pasar argumentos **por nombre** para evitar confusiones.

---

## 📦 Retornar múltiples valores

Una función puede "devolver dos cosas" usando una tupla (que se desempaqueta automáticamente):

```python
def estadisticas(numeros):
    minimo   = min(numeros)
    maximo   = max(numeros)
    promedio = sum(numeros) / len(numeros)
    return minimo, maximo, promedio   # Python crea la tupla (a, b, c)

mn, mx, prom = estadisticas([3, 7, 2, 9, 4])
print(f"Min: {mn}, Max: {mx}, Promedio: {prom:.2f}")
# Min: 2, Max: 9, Promedio: 5.00
```

---

## 🎯 Buenas prácticas para diseñar funciones

!!! success "✅ Reglas de oro"
    1. **Una función = una responsabilidad.** Si tu función hace dos cosas, probablemente deberían ser dos funciones.
    2. **Nombre en snake_case con verbo**: `calcular_promedio()`, `filtrar_aprobados()`, `es_par()`.
    3. **Breve**: si supera las 20 líneas, considerá dividirla.
    4. **Usá `return`, no `print`**: una función que devuelve un valor es más reutilizable que una que solo imprime.

!!! example "🔍 Ejemplo de refactor"
    ```python
    # ❌ Hace demasiado, difícil de reutilizar
    def procesar_todo(notas):
        total = 0
        for n in notas:
            total += n
        promedio = total / len(notas)
        if promedio >= 6:
            print("Aprobado")
        else:
            print("Desaprobado")

    # ✅ Responsabilidades separadas, cada parte reutilizable
    def calcular_promedio(notas):
        return sum(notas) / len(notas)

    def estado_alumno(promedio):
        return "Aprobado" if promedio >= 6 else "Desaprobado"

    prom = calcular_promedio([8, 7, 9])
    print(estado_alumno(prom))
    ```

---

## 🎮 Ejercicios

### 🌱 Ejercicio 1 — Tus primeras funciones

Escribí las siguientes funciones y probá que funcionan:

1. `saludar(nombre)` → devuelve `"Hola, {nombre}!"`.
2. `es_par(n)` → devuelve `True` si `n` es par, `False` si no.
3. `celsius_a_fahrenheit(c)` → convierte temperatura (fórmula: `c * 9/5 + 32`).
4. `valor_absoluto(n)` → devuelve el valor absoluto **sin usar `abs()`**.

??? success "✅ Solución"
    ```python
    def saludar(nombre):
        return f"Hola, {nombre}!"

    def es_par(n):
        return n % 2 == 0

    def celsius_a_fahrenheit(c):
        return c * 9/5 + 32

    def valor_absoluto(n):
        return n if n >= 0 else -n

    print(saludar("Maxi"))             # Hola, Maxi!
    print(es_par(4), es_par(7))        # True False
    print(celsius_a_fahrenheit(100))   # 212.0
    print(valor_absoluto(-5))          # 5
    ```

### 🌱 Ejercicio 2 — La calculadora

Escribí cuatro funciones: `sumar(a, b)`, `restar(a, b)`, `multiplicar(a, b)`, `dividir(a, b)`. Para `dividir`, retorná `None` si `b == 0`.

??? success "✅ Solución"
    ```python
    def sumar(a, b):       return a + b
    def restar(a, b):      return a - b
    def multiplicar(a, b): return a * b
    def dividir(a, b):     return None if b == 0 else a / b

    print(sumar(3, 4))        # 7
    print(multiplicar(4, 5))  # 20
    print(dividir(10, 0))     # None
    ```

### 🌿 Ejercicio 3 — Refactorizando el boletín

Tomá el código del ejercicio 3 de diccionarios y **extraé las operaciones en funciones**:

- `calcular_promedio(lista_notas)` → float.
- `estado(promedio)` → `"Aprobado"` o `"Desaprobado"`.
- `mejor_alumno(notas_dict)` → nombre del alumno con mejor promedio.

Usá esas funciones para imprimir el boletín.

??? success "✅ Solución"
    ```python
    def calcular_promedio(lista_notas):
        return sum(lista_notas) / len(lista_notas)

    def estado(promedio):
        return "Aprobado" if promedio >= 6 else "Desaprobado"

    def mejor_alumno(notas_dict):
        mejor, mejor_prom = None, -1
        for alumno, notas in notas_dict.items():
            prom = calcular_promedio(notas)
            if prom > mejor_prom:
                mejor_prom, mejor = prom, alumno
        return mejor

    notas = {
        "Ana":   [8, 9, 10],
        "Beto":  [5, 6, 4],
        "Cami":  [7, 8, 9],
        "Dante": [3, 4, 5],
        "Eva":   [10, 10, 9]
    }

    for alumno, lista in notas.items():
        prom = calcular_promedio(lista)
        print(f"{alumno}: {prom:.2f} — {estado(prom)}")

    print(f"\n🏆 Mejor: {mejor_alumno(notas)}")
    ```

### 🌿 Ejercicio 4 — Estadísticas con múltiples retornos

Escribí `analizar(numeros)` que devuelva una **tupla** con `(minimo, maximo, promedio, cantidad_pares)`. Desempaquetala al llamarla.

??? success "✅ Solución"
    ```python
    def analizar(numeros):
        minimo      = min(numeros)
        maximo      = max(numeros)
        promedio    = sum(numeros) / len(numeros)
        cant_pares  = sum(1 for n in numeros if n % 2 == 0)
        return minimo, maximo, promedio, cant_pares

    mn, mx, prom, pares = analizar([3, 7, 2, 8, 5, 4, 9, 6])
    print(f"Min: {mn}, Max: {mx}, Promedio: {prom:.2f}, Pares: {pares}")
    ```

### 🌶️ Ejercicio 5 — Validador de contraseñas

Escribí `validar_password(password)` que devuelva `True` si la contraseña cumple **todas** las reglas:

- Al menos 8 caracteres.
- Al menos una mayúscula.
- Al menos un número.
- Sin espacios.

Después escribí `describir_password(password)` que devuelva una **lista de errores** (vacía si todo está bien).

??? tip "💡 Pista"
    Usá `any(c.isupper() for c in password)` para verificar mayúsculas. Para la segunda función, construí la lista de errores con `.append()`.

??? success "✅ Solución"
    ```python
    def validar_password(password):
        return (
            len(password) >= 8 and
            any(c.isupper() for c in password) and
            any(c.isdigit() for c in password) and
            " " not in password
        )

    def describir_password(password):
        errores = []
        if len(password) < 8:
            errores.append("Debe tener al menos 8 caracteres")
        if not any(c.isupper() for c in password):
            errores.append("Debe contener al menos una mayúscula")
        if not any(c.isdigit() for c in password):
            errores.append("Debe contener al menos un número")
        if " " in password:
            errores.append("No debe contener espacios")
        return errores

    for pw in ["hola", "HolaMundo1", "hola mundo1", "Corta1"]:
        errores = describir_password(pw)
        if errores:
            print(f"❌ '{pw}': {errores}")
        else:
            print(f"✅ '{pw}': contraseña válida")
    ```

### 🌶️🌶️ Ejercicio 6 — El asistente de texto 📄

Escribí las siguientes funciones y usálas para procesar el texto dado:

1. `contar_palabras(texto)` → int: total de palabras.
2. `palabras_unicas(texto)` → set: palabras únicas en minúsculas.
3. `palabra_mas_frecuente(texto)` → str: la que más aparece.
4. `palabras_largas(texto, min_largo)` → list: palabras de más de `min_largo` letras (sin repetir).
5. `resumen(texto)` → dict con todos los datos anteriores.

```python
texto = """python es un lenguaje de programacion muy usado
python se usa en ciencia de datos en web y en automatizacion
aprender python es aprender a pensar"""
```

??? success "✅ Solución"
    ```python
    def contar_palabras(texto):
        return len(texto.split())

    def palabras_unicas(texto):
        return set(texto.lower().split())

    def palabra_mas_frecuente(texto):
        palabras = texto.lower().split()
        conteo = {}
        for p in palabras:
            conteo[p] = conteo.get(p, 0) + 1
        return max(conteo, key=conteo.get)

    def palabras_largas(texto, min_largo):
        return list({p for p in texto.lower().split() if len(p) > min_largo})

    def resumen(texto):
        return {
            "total_palabras":  contar_palabras(texto),
            "palabras_unicas": len(palabras_unicas(texto)),
            "mas_frecuente":   palabra_mas_frecuente(texto),
            "palabras_largas": palabras_largas(texto, 5),
        }

    texto = """python es un lenguaje de programacion muy usado
    python se usa en ciencia de datos en web y en automatizacion
    aprender python es aprender a pensar"""

    for clave, valor in resumen(texto).items():
        print(f"{clave}: {valor}")
    ```

---

## 📌 Cheatsheet final

```python
# Definir una función
def nombre_funcion(param1, param2):
    # cuerpo
    return valor

# Llamar una función
resultado = nombre_funcion(arg1, arg2)

# Sin return → devuelve None implícitamente
def solo_imprime(x):
    print(x)

# Retornar múltiples valores (tupla)
def minmax(lista):
    return min(lista), max(lista)

mn, mx = minmax([3, 7, 1, 9])

# Buenas prácticas
# ✅ snake_case con verbo: calcular_promedio, es_par, filtrar_aprobados
# ✅ Una responsabilidad por función
# ✅ return en lugar de print siempre que sea posible
# ✅ Menos de 20 líneas idealmente
```

---

## 🚀 ¿Y ahora qué viene?

!!! success "🎯 Próxima clase: Funciones II"
    En la próxima clase profundizamos en las funciones:

    - **Scope** (ámbito): ¿qué variables puede "ver" una función?
    - **Parámetros con valor por defecto**: `def saludar(nombre, saludo="Hola")`.
    - **Argumentos por nombre**: `presentar(ciudad="Ensenada", nombre="Maxi")`.
    - **`*args` y `**kwargs`**: funciones que aceptan cualquier cantidad de argumentos.

¡Nos vemos el miércoles! 📦✨

---

## [⬅️ Anterior: Diccionarios](./diccionarios.md)
## [📚 Índice](../clases.md#colecciones)
## [➡️ Siguiente: Funciones II](./funciones_2.md)
