# 📒 Cuadernillo de Listas — Finde Largo

!!! tip "🎯 Bienvenidos al laboratorio portátil"
    Este cuadernillo es para que **practiquen listas durante el finde largo**, mientras yo no estoy para molestarlos con preguntas raras 🧪. Los ejercicios están ordenados de menor a mayor dificultad usando nuestra escala habitual:

    - 🌱 **Suave**: para entrar en confianza y refrescar lo visto.
    - 🌿 **Medio**: requiere pensar un poco más, especialmente con *list comprehensions* y *listas de listas*.
    - 🌶️ **Picante**: desafíos integradores. Si sale, son cracks 🧠.

!!! info "📌 Cómo encarar el cuadernillo"
    No tienen que hacer todos los ejercicios en una sentada. La idea es:

    1. **Leé el repaso relámpago** primero, especialmente las secciones de *list comprehensions* y *listas de listas* — son los temas que vimos por arriba en clase.
    2. **Hacé los ejercicios en orden**, de a poco. Si te trabás, abrí la pista (clic en el bloque "💡 Pista").
    3. Si te trabás MUCHO, no pasa nada. **Anotá la duda** y consultá por el grupo de **Whatsapp** o la vemos juntos en clase.
    4. Trabajá en un archivo `.py` por bloque (por ejemplo `bloque_1.py`, `bloque_2.py`...) para tener todo ordenado.

---

## 📚 Repaso relámpago

### 🔁 Lo que ya manejamos

Las listas son colecciones **ordenadas** y **modificables** que pueden contener cualquier tipo de dato. Estas son las operaciones más comunes que ya vimos:

| Operación | Ejemplo | ¿Qué hace? |
|-----------|---------|------------|
| Crear | `xs = [1, 2, 3]` | Crea una lista con 3 elementos |
| Acceder | `xs[0]` | Devuelve el primer elemento (`1`) |
| Modificar | `xs[0] = 99` | Cambia el primer elemento |
| Agregar al final | `xs.append(4)` | Suma `4` al final |
| Insertar | `xs.insert(1, 50)` | Inserta `50` en la posición 1 |
| Eliminar por valor | `xs.remove(2)` | Elimina la primera aparición de `2` |
| Eliminar por índice | `xs.pop(0)` | Saca y devuelve el elemento en posición 0 |
| Largo | `len(xs)` | Cantidad de elementos |
| Recorrer | `for x in xs:` | Itera sobre los elementos |
| Slicing | `xs[1:3]` | Sub-lista desde índice 1 hasta 3 (sin incluir) |

### 🆕 Lo que vamos a reforzar

#### ✨ List Comprehensions

Una *list comprehension* es **azúcar sintáctico** ✨ para un patrón muy común: recorrer una lista, transformar/filtrar elementos, y guardar el resultado en una lista nueva.

=== "🐢 Versión clásica con `for`"

    ```python
    numeros = [1, 2, 3, 4, 5]
    cuadrados = []
    for n in numeros:
        cuadrados.append(n ** 2)
    print(cuadrados)  # [1, 4, 9, 16, 25]
    ```

=== "🚀 Versión con comprehension"

    ```python
    numeros = [1, 2, 3, 4, 5]
    cuadrados = [n ** 2 for n in numeros]
    print(cuadrados)  # [1, 4, 9, 16, 25]
    ```

**La estructura general** es:

```python
[ expresión   for elemento in iterable   if condición ]
#  ↑                ↑                       ↑
#  qué guardar      de dónde sacar          (opcional) cuándo guardar
```

!!! example "Ejemplos rápidos"
    ```python
    # Solo los pares
    pares = [n for n in range(10) if n % 2 == 0]
    # → [0, 2, 4, 6, 8]

    # Cuadrados solo de los pares
    cuadrados_pares = [n ** 2 for n in range(10) if n % 2 == 0]
    # → [0, 4, 16, 36, 64]

    # Largo de cada palabra
    palabras = ["hola", "mundo", "python"]
    largos = [len(p) for p in palabras]
    # → [4, 5, 6]
    ```

!!! warning "⚠️ Cuándo NO usar comprehensions"
    Si tu lógica es muy compleja (varios `if`/`else` anidados, efectos colaterales, prints, etc.), **mejor un `for` clásico**. Las comprehensions brillan cuando son cortas y legibles.

#### 🔲 Listas de listas (matrices)

Una **lista de listas** es exactamente eso: una lista cuyos elementos son a su vez listas. Sirven para representar tablas, grillas, tableros de juegos, o cualquier estructura bidimensional.

```python
matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
```

Visualizado como tabla:

|       | col 0 | col 1 | col 2 |
|-------|-------|-------|-------|
| **fila 0** | 1     | 2     | 3     |
| **fila 1** | 4     | 5     | 6     |
| **fila 2** | 7     | 8     | 9     |

**Acceso con doble índice**: primero la fila, después la columna.

```python
matriz[0][0]  # → 1   (fila 0, col 0)
matriz[1][2]  # → 6   (fila 1, col 2)
matriz[2][1]  # → 8   (fila 2, col 1)
```

**Recorrido completo con `for` anidado**:

```python
for fila in matriz:
    for valor in fila:
        print(valor, end=" ")
    print()  # salto de línea al final de cada fila
```

!!! tip "🧠 Tip mental"
    Cuando recorras una matriz, pensá en voz alta: *"voy a ir fila por fila, y dentro de cada fila voy columna por columna"*. Eso te ordena la cabeza para escribir el `for` anidado.

---

## 🌱 Bloque 1 — Calentamiento

!!! note "Objetivo del bloque"
    Refrescar las operaciones básicas que ya manejamos. Si hacés estos 5 sin mirar, estás listo para el resto.

### 🌱 Ejercicio 1.1 — Doble parada

Dada la lista `numeros = [3, 7, 2, 9, 4, 11, 6]`, imprimí cada número multiplicado por 2 usando un `for`.

??? tip "💡 Pista"
    - ¿Cómo recorrés todos los elementos de una lista con un `for`?
    - Dentro del loop, ¿cómo calculás el doble de cada número?

??? success "✅ Solución"
    ```python
    numeros = [3, 7, 2, 9, 4, 11, 6]
    for n in numeros:
        print(n * 2)
    ```

### 🌱 Ejercicio 1.2 — El podio

Dada `puntajes = [85, 42, 91, 77, 33, 60, 99, 12]`, encontrá el **mayor** y el **menor** valor **sin usar `max()` ni `min()`** (queremos entender el algoritmo).

??? tip "💡 Pista"
    Empezá asumiendo que el primer elemento es el mayor (y el menor). Después recorré el resto y actualizá las variables si encontrás algo mejor.

??? success "✅ Solución"
    ```python
    puntajes = [85, 42, 91, 77, 33, 60, 99, 12]
    mayor = puntajes[0]
    menor = puntajes[0]
    for p in puntajes:
        if p > mayor:
            mayor = p
        if p < menor:
            menor = p
    print(f"Mayor: {mayor}, Menor: {menor}")
    ```

### 🌱 Ejercicio 1.3 — Filtro de palabras largas

Dada `palabras = ["sol", "luna", "estrella", "mar", "cometa", "nube"]`, creá una **nueva lista** con las palabras que tengan **más de 4 letras**, usando un `for` clásico (todavía no comprehensions).

??? tip "💡 Pista"
    Empezá con una lista vacía `largas = []` y andá haciendo `largas.append(palabra)` dentro del `if`.

??? success "✅ Solución"
    ```python
    palabras = ["sol", "luna", "estrella", "mar", "cometa", "nube"]
    largas = []
    for p in palabras:
        if len(p) > 4:
            largas.append(p)
    print(largas)  # ['estrella', 'cometa']
    ```

### 🌱 Ejercicio 1.4 — Suma manual

Dada `nums = [12, 5, 8, 21, 3, 17]`, calculá la **suma total** de la lista **sin usar `sum()`**.

??? tip "💡 Pista"
    Variable acumuladora en 0 antes del loop, y `total += n` adentro.

??? success "✅ Solución"
    ```python
    nums = [12, 5, 8, 21, 3, 17]
    total = 0
    for n in nums:
        total += n
    print(total)  # 66
    ```

### 🌱 Ejercicio 1.5 — Limpieza de duplicados

Dada `con_repetidos = [1, 2, 2, 3, 4, 4, 4, 5, 1, 6]`, creá una nueva lista **sin elementos duplicados**, conservando el orden de aparición. Usá solo lo que sabemos de listas (todavía no vimos `set()`).

??? tip "💡 Pista"
    Recorré la lista original y, para cada elemento, fijate si **ya está** en la lista nueva con `if elemento not in lista_nueva`.

??? success "✅ Solución"
    ```python
    con_repetidos = [1, 2, 2, 3, 4, 4, 4, 5, 1, 6]
    sin_repetidos = []
    for n in con_repetidos:
        if n not in sin_repetidos:
            sin_repetidos.append(n)
    print(sin_repetidos)  # [1, 2, 3, 4, 5, 6]
    ```

---

## 🌿 Bloque 2 — List Comprehensions

!!! note "Objetivo del bloque"
    Que les caiga la ficha de cuándo y cómo usar comprehensions, y que dejen de tener miedo a esa sintaxis rara con corchetes y `for` adentro 😄.

### 🌿 Ejercicio 2.1 — Tu primera traducción

Acá tenés un `for` clásico. **Reescribilo como list comprehension**:

```python
numeros = [1, 2, 3, 4, 5, 6, 7, 8]
triples = []
for n in numeros:
    triples.append(n * 3)
```

??? tip "💡 Pista"
    Estructura: `[ expresión for variable in iterable ]`. La expresión es lo que ponés dentro del `append`.

??? success "✅ Solución"
    ```python
    numeros = [1, 2, 3, 4, 5, 6, 7, 8]
    triples = [n * 3 for n in numeros]
    print(triples)  # [3, 6, 9, 12, 15, 18, 21, 24]
    ```

### 🌿 Ejercicio 2.2 — Solo los pares

Dada `numeros = list(range(1, 21))` (los números del 1 al 20), generá con **una sola línea de comprehension** una lista con solo los pares.

??? tip "💡 Pista"
    Esta vez la comprehension lleva un `if` al final: `[n for n in numeros if n % 2 == 0]`.

??? success "✅ Solución"
    ```python
    numeros = list(range(1, 21))
    pares = [n for n in numeros if n % 2 == 0]
    print(pares)  # [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
    ```

### 🌿 Ejercicio 2.3 — Transformar Y filtrar

Generá una lista con los **cuadrados de los números pares** del 1 al 15, en una sola comprehension.

??? tip "💡 Pista"
    La expresión transforma (`n ** 2`) y el `if` filtra (`if n % 2 == 0`). Las dos cosas pasan en la misma línea.

??? success "✅ Solución"
    ```python
    cuadrados_pares = [n ** 2 for n in range(1, 16) if n % 2 == 0]
    print(cuadrados_pares)  # [4, 16, 36, 64, 100, 144, 196]
    ```

### 🌿 Ejercicio 2.4 — Anatomía de palabras

Dada `palabras = ["python", "es", "un", "lenguaje", "increíble"]`:

1. Generá una lista con la **longitud** de cada palabra usando comprehension.
2. Generá una lista con las palabras **en mayúsculas** (usá `.upper()`).
3. Generá una lista con las palabras que tengan **más de 3 letras**, en mayúsculas.

??? tip "💡 Pista"
    Para el punto 3, combiná transformación (`p.upper()`) con filtro (`if len(p) > 3`).

??? success "✅ Solución"
    ```python
    palabras = ["python", "es", "un", "lenguaje", "increíble"]

    # 1
    largos = [len(p) for p in palabras]
    print(largos)  # [6, 2, 2, 8, 9]

    # 2
    en_mayus = [p.upper() for p in palabras]
    print(en_mayus)  # ['PYTHON', 'ES', 'UN', 'LENGUAJE', 'INCREÍBLE']

    # 3
    largas_mayus = [p.upper() for p in palabras if len(p) > 3]
    print(largas_mayus)  # ['PYTHON', 'LENGUAJE', 'INCREÍBLE']
    ```

### 🌿 Ejercicio 2.5 — El boletín exprés

Dada una lista de notas: `notas = [4, 7, 9, 2, 6, 8, 5, 10, 3]`, generá una nueva lista que tenga `"Aprobado"` si la nota es **≥ 6** y `"Desaprobado"` si es menor. Usá el operador ternario dentro de la comprehension.

!!! info "🧠 Operador ternario"
    Sintaxis: `valor_si_verdadero if condición else valor_si_falso`
    Ejemplo: `"par" if n % 2 == 0 else "impar"`

??? tip "💡 Pista"
    Estructura completa: `[ <ternario> for n in notas ]`. El ternario va donde antes ponías la expresión simple.

??? success "✅ Solución"
    ```python
    notas = [4, 7, 9, 2, 6, 8, 5, 10, 3]
    estados = ["Aprobado" if n >= 6 else "Desaprobado" for n in notas]
    print(estados)
    # ['Desaprobado', 'Aprobado', 'Aprobado', 'Desaprobado', 'Aprobado',
    #  'Aprobado', 'Desaprobado', 'Aprobado', 'Desaprobado']
    ```

### 🌿 Ejercicio 2.6 — Comprehension con strings

Dada una frase: `frase = "El zorro marrón salta sobre el perro perezoso"`, hacé lo siguiente:

1. Una lista con **todas las palabras** (usá `frase.split()`).
2. Una lista con las palabras que **empiezan con vocal** (usá `palabra[0].lower() in "aeiou"`).
3. Una lista con la **primera letra** de cada palabra.

??? tip "💡 Pista"
    - Para el punto 1: ¿qué método divide un string en lista de palabras?
    - Para el punto 2: ¿cómo accedés al primer carácter de una string? ¿Cómo verificás si una letra es vocal?
    - Para el punto 3: dentro de la comprehension, ¿qué índice usás para tomar solo la primera letra?

??? success "✅ Solución"
    ```python
    frase = "El zorro marrón salta sobre el perro perezoso"
    palabras = frase.split()

    # 1
    print(palabras)
    # ['El', 'zorro', 'marrón', 'salta', 'sobre', 'el', 'perro', 'perezoso']

    # 2
    con_vocal = [p for p in palabras if p[0].lower() in "aeiou"]
    print(con_vocal)  # ['El', 'el']

    # 3
    iniciales = [p[0] for p in palabras]
    print(iniciales)  # ['E', 'z', 'm', 's', 's', 'e', 'p', 'p']
    ```

---

## 🔲 Bloque 3 — Listas de listas

!!! note "Objetivo del bloque"
    Que se familiaricen con la idea de "lista bidimensional" y se sientan cómodos recorriéndola con `for` anidado. Esto va a ser **fundamental** para el primer proyecto que viene 👀.

### 🌿 Ejercicio 3.1 — El centro de la grilla

Dada la siguiente matriz 3x3:

```python
grilla = [
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
]
```

Imprimí el **elemento del centro** (debería ser `50`), accediendo con doble índice.

??? tip "💡 Pista"
    - ¿Cuál es el índice de la fila del centro en una grilla 3x3?
    - ¿Cómo accedés a un elemento dentro de una sublista usando `grilla[fila][columna]`?

??? success "✅ Solución"
    ```python
    grilla = [
        [10, 20, 30],
        [40, 50, 60],
        [70, 80, 90]
    ]
    print(grilla[1][1])  # 50
    ```

### 🌿 Ejercicio 3.2 — Imprimir como tabla

Dada la misma `grilla` del ejercicio anterior, imprimila como tabla, con **un espacio** entre números y un **salto de línea** al final de cada fila. La salida debería verse así:

```
10 20 30
40 50 60
70 80 90
```

??? tip "💡 Pista"
    `for` anidado: el de afuera recorre filas, el de adentro recorre valores. Usá `print(valor, end=" ")` y al terminar la fila un `print()` vacío.

??? success "✅ Solución"
    ```python
    grilla = [
        [10, 20, 30],
        [40, 50, 60],
        [70, 80, 90]
    ]
    for fila in grilla:
        for valor in fila:
            print(valor, end=" ")
        print()  # salto de línea al final de cada fila
    ```

### 🌿 Ejercicio 3.3 — Suma por filas

Dada la matriz:

```python
matriz = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
]
```

Calculá e imprimí la **suma de cada fila**. La salida esperada:

```
Fila 0 → 10
Fila 1 → 26
Fila 2 → 42
```

??? tip "💡 Pista"
    Podés usar `sum(fila)` directamente sobre cada sublista mientras la recorrés con `enumerate`, o sumar manualmente con un loop interno.

??? success "✅ Solución (versión con `sum()`)"
    ```python
    matriz = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12]
    ]
    for i, fila in enumerate(matriz):
        print(f"Fila {i} → {sum(fila)}")
    ```

??? success "✅ Solución (versión manual)"
    ```python
    for i in range(len(matriz)):
        total = 0
        for valor in matriz[i]:
            total += valor
        print(f"Fila {i} → {total}")
    ```

### 🌶️ Ejercicio 3.4 — Suma por columnas

Usando la misma `matriz` del ejercicio anterior, calculá la **suma de cada columna**. Salida esperada:

```
Col 0 → 15
Col 1 → 18
Col 2 → 21
Col 3 → 24
```

!!! warning "⚠️ Esto es más difícil"
    Recorrer columnas significa que el índice **de afuera** es el de la columna, y el de adentro es el de la fila. Usá `range(len(...))` para los dos.

??? tip "💡 Pista"
    Asumí que todas las filas tienen el mismo largo. La cantidad de columnas la sacás con `len(matriz[0])`. Después: `for c in range(len(matriz[0])):` por afuera y `for f in range(len(matriz)):` por adentro.

??? success "✅ Solución"
    ```python
    matriz = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12]
    ]
    cantidad_columnas = len(matriz[0])
    cantidad_filas = len(matriz)

    for c in range(cantidad_columnas):
        total = 0
        for f in range(cantidad_filas):
            total += matriz[f][c]
        print(f"Col {c} → {total}")
    ```

### 🌶️ Ejercicio 3.5 — Boletín de asistencias 📋

!!! tip "🚀 Guiño al futuro"
    Este ejercicio es un **adelanto** del primer proyecto que vamos a hacer juntos. Si entra acá, va a entrar fácil después.

Tenemos una lista de alumnos y una matriz de asistencias. Cada **fila** representa un alumno; cada **columna**, una clase. El valor `1` significa "asistió" y `0` significa "faltó".

```python
alumnos = ["Ana", "Beto", "Cami", "Dante"]
asistencias = [
    [1, 1, 0, 1, 1],   # Ana
    [0, 1, 1, 1, 0],   # Beto
    [1, 1, 1, 1, 1],   # Cami
    [0, 0, 1, 0, 1],   # Dante
]
```

Imprimí el **porcentaje de asistencia** de cada alumno, redondeado al entero más cercano. Salida esperada (aprox):

```
Ana: 80%
Beto: 60%
Cami: 100%
Dante: 40%
```

??? tip "💡 Pista"
    Recorré `alumnos` con `enumerate` para tener el índice. Para cada alumno, sumá su fila y dividilo por la cantidad de clases (largo de la fila). Multiplicá por 100 y usá `round()`.

??? success "✅ Solución"
    ```python
    alumnos = ["Ana", "Beto", "Cami", "Dante"]
    asistencias = [
        [1, 1, 0, 1, 1],   # Ana
        [0, 1, 1, 1, 0],   # Beto
        [1, 1, 1, 1, 1],   # Cami
        [0, 0, 1, 0, 1],   # Dante
    ]

    for i, alumno in enumerate(alumnos):
        fila = asistencias[i]
        porcentaje = round(sum(fila) / len(fila) * 100)
        print(f"{alumno}: {porcentaje}%")
    ```

---

## 🌶️ Bloque 4 — Desafíos integradores

!!! note "Objetivo del bloque"
    Combinar todo lo de los bloques anteriores en problemas más reales. Si te trabás, no te frustres: **anotá las dudas y las vemos juntos**.

### 🌶️ Desafío 4.1 — El sistema de notas

Tenemos un curso con varios alumnos, cada uno con tres notas. La estructura es una **lista de listas**, donde cada sublista contiene `[nombre, nota1, nota2, nota3]`:

```python
curso = [
    ["Ana", 8, 7, 9],
    ["Beto", 4, 5, 6],
    ["Cami", 10, 9, 10],
    ["Dante", 3, 5, 4],
    ["Eva", 7, 7, 8],
]
```

Resolvé en un mismo programa:

1. **Imprimir el promedio de cada alumno**, con dos decimales, en formato `"Ana: 8.00"`.
2. **Listar los aprobados** (promedio ≥ 6) y los **desaprobados** por separado.
3. **Encontrar al alumno con el mejor promedio** e imprimir su nombre y promedio.

??? tip "💡 Pista (parte 1)"
    Para el promedio de cada alumno, las notas están en `alumno[1:]` (slicing desde el índice 1 hasta el final). El promedio es `sum(alumno[1:]) / 3` (o mejor `/ len(alumno[1:])`).

??? tip "💡 Pista (parte 3)"
    Misma lógica que el ejercicio 1.2 (mayor de una lista) pero ahora "mayor" lo medís por promedio. Necesitás dos variables: `mejor_nombre` y `mejor_promedio`.

??? success "✅ Solución"
    ```python
    curso = [
        ["Ana", 8, 7, 9],
        ["Beto", 4, 5, 6],
        ["Cami", 10, 9, 10],
        ["Dante", 3, 5, 4],
        ["Eva", 7, 7, 8],
    ]

    # 1. Promedios
    print("=== Promedios ===")
    for alumno in curso:
        nombre = alumno[0]
        notas = alumno[1:]
        promedio = sum(notas) / len(notas)
        print(f"{nombre}: {promedio:.2f}")

    # 2. Aprobados / desaprobados
    aprobados = []
    desaprobados = []
    for alumno in curso:
        promedio = sum(alumno[1:]) / len(alumno[1:])
        if promedio >= 6:
            aprobados.append(alumno[0])
        else:
            desaprobados.append(alumno[0])
    print("\n=== Resultados ===")
    print(f"Aprobados: {aprobados}")
    print(f"Desaprobados: {desaprobados}")

    # 3. Mejor promedio
    mejor_nombre = curso[0][0]
    mejor_promedio = sum(curso[0][1:]) / len(curso[0][1:])
    for alumno in curso:
        prom = sum(alumno[1:]) / len(alumno[1:])
        if prom > mejor_promedio:
            mejor_promedio = prom
            mejor_nombre = alumno[0]
    print(f"\n🏆 Mejor promedio: {mejor_nombre} ({mejor_promedio:.2f})")
    ```

### 🌶️🌶️ Desafío 4.2 — El secuenciador rítmico 🥁

!!! tip "🎵 Guiño al universo musical"
    Este ejercicio modela algo muy parecido a lo que hace una *drum machine* o un *step sequencer* (tipo los que aparecen en cualquier DAW). Si te gusta la música, lo vas a disfrutar.

Un patrón rítmico se puede representar como una **matriz** donde cada fila es un instrumento y cada columna es un "step" (paso temporal). Un `1` significa que ese instrumento suena en ese step; un `0`, que no.

```python
instrumentos = ["Kick", "Snare", "HiHat", "Clap"]
patron = [
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],   # Kick
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],   # Snare
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],   # HiHat
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],   # Clap
]
```

Hacé las siguientes consignas:

1. **Imprimí el patrón visualmente**, con `■` cuando hay hit y `·` cuando no, separando por espacios. La salida debería verse así:

    ```
    Kick   ■ · · · ■ · · · ■ · · · ■ · · ·
    Snare  · · · · ■ · · · · · · · ■ · · ·
    HiHat  ■ · ■ · ■ · ■ · ■ · ■ · ■ · ■ ·
    Clap   · · · · · · · · · · · · ■ · · ·
    ```

2. **Contá la cantidad de hits** que tiene cada instrumento.

3. Encontrá el **step con más hits simultáneos** (ese momento donde "explota" el ritmo). Devolvé el número de step y la cantidad.

??? tip "💡 Pista (parte 1)"
    Usá `enumerate` sobre `instrumentos` para tener el índice y el nombre. Después, recorré la fila correspondiente y usá un ternario dentro de `print` o construí un string con comprehension: `" ".join(["■" if v else "·" for v in patron[i]])`.

??? tip "💡 Pista (parte 3)"
    Para los hits simultáneos por step, fijate que es básicamente "suma por columna" (ejercicio 3.4). El step ganador es el que tenga la suma más alta.

??? success "✅ Solución"
    ```python
    instrumentos = ["Kick", "Snare", "HiHat", "Clap"]
    patron = [
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    ]

    # 1. Visualización
    print("=== Patrón ===")
    for i, nombre in enumerate(instrumentos):
        visual = " ".join(["■" if v else "·" for v in patron[i]])
        print(f"{nombre:<6} {visual}")

    # 2. Hits por instrumento
    print("\n=== Hits por instrumento ===")
    for i, nombre in enumerate(instrumentos):
        print(f"{nombre}: {sum(patron[i])} hits")

    # 3. Step con más hits simultáneos
    cantidad_steps = len(patron[0])
    mejor_step = 0
    mejor_simultaneos = 0
    for s in range(cantidad_steps):
        simultaneos = 0
        for i in range(len(patron)):
            simultaneos += patron[i][s]
        if simultaneos > mejor_simultaneos:
            mejor_simultaneos = simultaneos
            mejor_step = s
    print(f"\n🎯 Step con más hits: {mejor_step} ({mejor_simultaneos} simultáneos)")
    ```

---

## 🚀 ¿Y ahora qué?

!!! success "🎉 Si llegaste hasta acá, sos crack"
    En serio. Si terminás los 4 bloques, vas a estar **muy bien parado** para lo que viene en el curso. Las próximas semanas vamos a meternos con:

    - **Tuplas y sets** (otras colecciones que se complementan con listas).
    - **Diccionarios** (la estructura más útil de Python, capaz).
    - **Funciones** (para no repetir código y empezar a modularizar).
    - **Archivos JSON** (para guardar datos entre sesiones).
    - **Git y GitHub** (para que puedan llevarse el código a sus casas).
    - Y después... **el primer proyecto fuerte**: el **Sistema de Asistencias del CFP** 🚀.

!!! info "📤 Cómo entregar"
    No hace falta que entreguen nada formal: la idea es que **traigan los archivos `.py`** (o capturas, lo que prefieran) la próxima clase para que los revisemos juntos. Si **alguno se traba mucho** con un ejercicio, marquen cuál y lo resolvemos en conjunto.

!!! warning "🆘 Si te trabás"
    1. Releé el repaso relámpago de la sección correspondiente.
    2. Mirá la **pista** del ejercicio antes de la solución.
    3. Si nada te destraba, **pasá al siguiente** y marcá el que te frenó.
    4. **NO HAY PROBLEMA si no terminás todos**. Lo importante es que practiquen, no que sufran 🧪.

¡Buen finde largo, científicos! 🧬✨

---

## [⬅️ Anterior: Listas en Python](./listas.md)
## [📚 Índice](../../clases.md#listas)
## [➡️ Siguiente: Mini Parcial](./mini_parcial.md)