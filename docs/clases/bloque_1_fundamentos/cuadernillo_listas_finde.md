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

## 🎮 Ejercicios

!!! tip "🧪 Los ejercicios ahora son interactivos"
    Escribís el código, lo ejecutás con **Python de verdad en el navegador** y los tests te dicen al
    instante si está bien. Sin instalar nada. Tu avance **se guarda solo**.

    Si te trabás, cada ejercicio tiene pistas — y un botón para mandarme tu código y tu consulta.

    [🚀 Ir a los ejercicios de el Cuadernillo](/pensamiento-computacional-testing-2026/ejercicios/clases/cuadernillo-listas/){ .md-button .md-button--primary }
