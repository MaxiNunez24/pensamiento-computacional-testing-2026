# 📝 Mini Parcial — Módulo Python Básico

!!! info "📋 Instrucciones generales"
    * Este parcial tiene **8 ejercicios** de distintos tipos: opción múltiple, preguntas conceptuales y código.
    * Los ejercicios de **opción múltiple** tienen una sola respuesta correcta.
    * Los ejercicios de **código** deben entregarse como archivos `.py` con el nombre indicado.
    * Las **preguntas conceptuales** se responden por escrito (puede ser un comentario dentro del `.py` o en un documento aparte).
    * Podés usar VS Code pero **no** podés consultar a otra persona ni buscar en internet.
    * Duración sugerida: **60 minutos**.

!!! warning "⚠️ Antes de arrancar"
    Leé cada enunciado **completo** antes de escribir código. En los ejercicios de opción múltiple, justificá mentalmente por qué descartás las opciones incorrectas.

---

## 1️⃣ Tipos de datos — Opción múltiple

**Puntaje: 1 punto**

¿Cuál es el tipo de dato del resultado de la siguiente operación en Python?

```python
resultado = 10 / 2
```

**Opciones:**

- A) `int`
- B) `float`
- C) `str`
- D) `bool`

??? success "✅ Respuesta"
    **B) `float`** — En Python 3, el operador `/` siempre devuelve `float`, incluso cuando el resultado es un número entero. `10 / 2 = 5.0`.

---

## 2️⃣ Operador módulo — Opción múltiple

**Puntaje: 1 punto**

¿Cuál es el valor de `x` después de ejecutar este código?

```python
x = 17 % 5
```

**Opciones:**

- A) `3`
- B) `2`
- C) `3.4`
- D) `0`

??? success "✅ Respuesta"
    **B) `2`** — El operador `%` devuelve el resto de la división. `17 = 3 × 5 + 2`, por lo tanto `17 % 5 = 2`.

---

## 3️⃣ Lectura de código — Opción múltiple

**Puntaje: 1 punto**

¿Qué imprime el siguiente programa?

```python
for i in range(1, 8):
    if i % 2 == 0:
        print(i)
```

**Opciones:**

- A) `1 3 5 7`
- B) `2 4 6 8`
- C) `2 4 6`
- D) `1 2 3 4 5 6 7`

??? success "✅ Respuesta"
    **C) `2 4 6`** — `range(1, 8)` genera del 1 al 7 inclusive. El `if i % 2 == 0` filtra solo los pares. El 8 no está porque `range(1, 8)` no incluye el 8.

---

## 4️⃣ Listas — Opción múltiple

**Puntaje: 1 punto**

Dado el siguiente código:

```python
frutas = ["manzana", "banana", "naranja", "uva"]
print(frutas[-2])
```

¿Qué imprime?

**Opciones:**

- A) `"banana"`
- B) `"naranja"`
- C) `"uva"`
- D) Genera un error

??? success "✅ Respuesta"
    **B) `"naranja"`** — Los índices negativos cuentan desde el final: `-1` es `"uva"`, `-2` es `"naranja"`, `-3` es `"banana"`, `-4` es `"manzana"`.

---

## 5️⃣ While vs For — Pregunta conceptual

**Puntaje: 1 punto**

Explicá con tus palabras **cuándo usarías un `while` y cuándo usarías un `for`**.  
Dá un ejemplo concreto de cada uno (no hace falta que funcionen, solo que ilustren la idea).

??? tip "💡 Para pensar"
    Pensá en qué diferencia hay entre saber de antemano cuántas veces algo se repite, y no saberlo.

---

## 6️⃣ Condicionales — Código

**Puntaje: 2 puntos** | **Archivo: `ejercicio_6.py`**

Escribí un programa que le pida al usuario su **edad** y muestre la categoría correspondiente:

| Rango | Categoría |
|-------|-----------|
| 0 – 12 | 🧒 Niño/a |
| 13 – 17 | 🎒 Adolescente |
| 18 – 64 | 🧑 Adulto/a |
| 65 o más | 👴 Adulto mayor |

Si la edad ingresada es **negativa o mayor a 120**, mostrá un mensaje de error.

**Ejemplo de salida esperada:**

```
Ingresá tu edad: 25
🧑 Sos adulto/a.

Ingresá tu edad: -3
⚠️ Edad inválida.
```

---

## 7️⃣ While — Código

**Puntaje: 1 punto** | **Archivo: `ejercicio_7.py`**

Escribí un programa que le pida números al usuario **uno por uno** y los vaya sumando. El programa termina cuando el usuario ingresa el número **0**. Al final, mostrá la suma total y la **cantidad de números** que ingresó (sin contar el 0).

**Ejemplo de salida esperada:**

```
Ingresá un número (0 para terminar): 5
Ingresá un número (0 para terminar): 12
Ingresá un número (0 para terminar): 3
Ingresá un número (0 para terminar): 0
📊 Ingresaste 3 números.
➕ Suma total: 20
```

---

## 8️⃣ Integrador — Código

**Puntaje: 2 puntos** | **Archivo: `ejercicio_8.py`**

Tenés esta lista con información de alumnos. Cada sublista tiene el formato `[nombre, nota1, nota2, nota3]`:

```python
curso = [
    ["Lucía", 7, 8, 9],
    ["Tomás", 4, 3, 5],
    ["Valentina", 10, 9, 8],
    ["Mateo", 6, 5, 7],
    ["Sofía", 2, 4, 3],
]
```

Escribí un programa que:

1. Calcule el **promedio** de cada alumno.
2. Imprima solo los alumnos que **aprobaron** (promedio ≥ 6), con su nombre y promedio redondeado a 1 decimal.
3. Imprima el **nombre del alumno con el mejor promedio**.

**Ejemplo de salida esperada:**

```
=== Alumnos aprobados ===
Lucía: 8.0
Valentina: 9.0
Mateo: 6.0

🏆 Mejor promedio: Valentina (9.0)
```

??? tip "💡 Pista"
    Las notas de cada alumno están en `alumno[1:]` (slicing). El promedio es `sum(alumno[1:]) / len(alumno[1:])`. Para el mejor promedio, llevá un registro del nombre y promedio del mejor a medida que recorrés.

??? success "✅ Solución"
    ```python
    curso = [
        ["Lucía", 7, 8, 9],
        ["Tomás", 4, 3, 5],
        ["Valentina", 10, 9, 8],
        ["Mateo", 6, 5, 7],
        ["Sofía", 2, 4, 3],
    ]

    print("=== Alumnos aprobados ===")
    mejor_nombre = None
    mejor_prom   = -1

    for alumno in curso:
        nombre = alumno[0]
        notas  = alumno[1:]
        prom   = sum(notas) / len(notas)
        if prom >= 6:
            print(f"{nombre}: {prom:.1f}")
        if prom > mejor_prom:
            mejor_prom   = prom
            mejor_nombre = nombre

    print(f"\n🏆 Mejor promedio: {mejor_nombre} ({mejor_prom:.1f})")
    ```

---

## 📊 Tabla de puntaje

| Ejercicio | Tipo | Puntaje |
|-----------|------|---------|
| 1 | Opción múltiple | 1 pt |
| 2 | Opción múltiple | 1 pt |
| 3 | Opción múltiple | 1 pt |
| 4 | Opción múltiple | 1 pt |
| 5 | Pregunta conceptual | 1 pt |
| 6 | Código | 2 pt |
| 7 | Código | 1 pt |
| 8 | Código integrador | 2 pt |
| **Total** | | **10 pt** |

!!! success "🎯 Escala de aprobación"
    * **6 pt o más** → ✅ Aprobado
    * **Menos de 6 pt** → ❌ Desaprobado

---

## [⬅️ Anterior: Cuadernillo de ejercicios sobre Listas](./cuadernillo_listas_finde.md)
## [📚 Índice](../../clases.md#listas)
## [➡️ Siguiente: Tuplas y Sets](../05_colecciones/tuplas_sets.md)
