# 📋 Listas en Python

Las listas son una de las estructuras de datos más usadas en Python. Nos permiten agrupar varios valores en una sola variable, recorrerlos, modificarlos y organizarlos. En esta clase vamos a ir desde los conceptos básicos hasta herramientas más avanzadas.

---

## 🧠 ¿Qué es una lista?

Una **lista** es una colección **ordenada** y **mutable** de elementos. Puede contener valores de cualquier tipo: números, strings, booleanos, o incluso otras listas.

```python
frutas = ["manzana", "banana", "naranja"]
numeros = [10, 20, 30, 40]
mixta = [1, "hola", True, 3.14]
```

!!! info "Dato clave"
    En Python, las listas se escriben entre corchetes `[ ]` y los elementos se separan con comas.

---

## 🔢 Índices y acceso a elementos

🌱 *Nivel: básico*

Cada elemento de una lista tiene una **posición** llamada **índice**, que empieza desde `0`.

```python
frutas = ["manzana", "banana", "naranja"]

print(frutas[0])   # manzana
print(frutas[1])   # banana
print(frutas[2])   # naranja
```

También podemos usar **índices negativos** para acceder desde el final:

```python
print(frutas[-1])  # naranja  (el último)
print(frutas[-2])  # banana   (el anteúltimo)
```

!!! warning "Cuidado con los índices"
    Si intentás acceder a un índice que no existe, Python lanza un error `IndexError`. Siempre verificá que el índice esté dentro del rango de la lista.

---

## ✂️ Slicing (rebanado)

🌿 *Nivel: intermedio*

Podemos obtener una **sublista** usando la notación `lista[inicio:fin]`. El elemento en la posición `fin` **no se incluye**.

```python
numeros = [10, 20, 30, 40, 50]

print(numeros[1:4])   # [20, 30, 40]
print(numeros[:3])    # [10, 20, 30]  (desde el inicio)
print(numeros[2:])    # [30, 40, 50]  (hasta el final)
print(numeros[::2])   # [10, 30, 50]  (de dos en dos)
```

Los **índices negativos** también funcionan en slicing:

```python
letras = ["a", "b", "c", "d", "e"]

print(letras[-3:])    # ['c', 'd', 'e']  — los últimos 3
print(letras[:-2])    # ['a', 'b', 'c']  — todo menos los últimos 2
```

!!! tip "Truco útil"
    `lista[-n:]` te da los últimos `n` elementos. `lista[:-n]` te da todo excepto los últimos `n`. Son combinaciones muy comunes en código real.

---

## ✏️ Modificar elementos

🌱 *Nivel: básico*

Las listas son **mutables**: podemos cambiar cualquier elemento usando su índice.

```python
frutas = ["manzana", "banana", "naranja"]
frutas[1] = "mango"
print(frutas)  # ["manzana", "mango", "naranja"]
```

---

## ➕ Agregar y eliminar elementos

🌱 *Nivel: básico*

| Método | ¿Qué hace? | Ejemplo |
|---|---|---|
| `.append(x)` | Agrega `x` al final | `lista.append(5)` |
| `.insert(i, x)` | Inserta `x` en la posición `i` | `lista.insert(0, "primero")` |
| `.remove(x)` | Elimina la primera aparición de `x` | `lista.remove("banana")` |
| `.pop(i)` | Elimina y retorna el elemento en posición `i` (por defecto el último) | `lista.pop()` |
| `del lista[i]` | Elimina el elemento en posición `i` | `del lista[0]` |

```python
colores = ["rojo", "verde", "azul"]

colores.append("amarillo")
print(colores)  # ["rojo", "verde", "azul", "amarillo"]

colores.insert(1, "blanco")
print(colores)  # ["rojo", "blanco", "verde", "azul", "amarillo"]

colores.remove("verde")
print(colores)  # ["rojo", "blanco", "azul", "amarillo"]

ultimo = colores.pop()
print(ultimo)   # amarillo
print(colores)  # ["rojo", "blanco", "azul"]
```

---

## 🔁 Recorrer una lista con for

🌱 *Nivel: básico*

Como ya sabemos usar `for`, podemos recorrer todos los elementos de una lista fácilmente:

```python
frutas = ["manzana", "banana", "naranja"]

for fruta in frutas:
    print(fruta)
```

Si también necesitamos el **índice**, usamos `enumerate()`:

```python
for i, fruta in enumerate(frutas):
    print(i, fruta)
# 0 manzana
# 1 banana
# 2 naranja
```

!!! tip "Buena práctica"
    Usá `for elemento in lista` cuando solo necesitás el valor. Reservá `enumerate()` para cuando el índice también importa.

---

## 📏 Otras operaciones útiles

🌱 *Nivel: básico*

```python
numeros = [3, 1, 4, 1, 5, 9, 2]

print(len(numeros))       # 7        → cantidad de elementos
print(sum(numeros))       # 25       → suma de todos
print(min(numeros))       # 1        → el mínimo
print(max(numeros))       # 9        → el máximo
print(4 in numeros)       # True     → ¿está el 4?
print(numeros.count(1))   # 2        → ¿cuántas veces aparece el 1?
```

---

## 🔃 Ordenar y revertir

🌿 *Nivel: intermedio*

### Ordenar con .sort() y sorted()

```python
numeros = [3, 1, 4, 1, 5, 9, 2]

numeros.sort()                     # modifica la lista original
print(numeros)                     # [1, 1, 2, 3, 4, 5, 9]

numeros.sort(reverse=True)         # orden descendente
print(numeros)                     # [9, 5, 4, 3, 2, 1, 1]

nueva = sorted([3, 1, 4])          # NO modifica, devuelve una nueva lista
print(nueva)                       # [1, 3, 4]
```

!!! info "`.sort()` vs `sorted()`"
    - `.sort()` modifica la lista **en el lugar** y no devuelve nada.
    - `sorted()` **devuelve una nueva lista** y deja la original intacta.
    Preferí `sorted()` cuando no querés perder el orden original.

### Revertir con .reverse()

```python
letras = ["a", "b", "c", "d"]
letras.reverse()
print(letras)  # ["d", "c", "b", "a"]
```

---

## 📋 Copiar listas

🌿 *Nivel: intermedio*

!!! danger "Trampa clásica"
    En Python, hacer `lista2 = lista1` **no copia** la lista: ambas variables apuntan al **mismo objeto**. Si modificás una, modificás la otra.

```python
# ❌ Esto NO es una copia
original = [1, 2, 3]
copia_falsa = original
copia_falsa.append(4)
print(original)    # [1, 2, 3, 4]  ← ¡también se modificó!

# ✅ Formas correctas de copiar
copia1 = original.copy()
copia2 = list(original)
copia3 = original[:]       # slicing completo

copia1.append(99)
print(original)    # [1, 2, 3, 4]  ← no se modifica
```

---

## 🧩 Listas anidadas (matrices)

🌿 *Nivel: intermedio*

Una lista puede contener otras listas. Esto es útil para representar **tablas** o **matrices**.

```python
matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

print(matriz[0])       # [1, 2, 3]       → primera fila
print(matriz[1][2])    # 6               → fila 1, columna 2
```

Para recorrer todos los elementos de una matriz:

```python
for fila in matriz:
    for elemento in fila:
        print(elemento, end=" ")
    print()

# 1 2 3
# 4 5 6
# 7 8 9
```

!!! example "Ejemplo aplicado"
    Imaginate una grilla de un juego, un tablero de ajedrez, o una tabla de notas de alumnos: todos se pueden modelar con listas anidadas.

---

## ⚡ Comprensión de listas (list comprehensions)

🌶️ *Nivel: avanzado*

Las **comprensiones de listas** son una forma compacta y elegante de crear listas en una sola línea, combinando un `for` (y opcionalmente un `if`) dentro de los corchetes.

**Sintaxis general:**
```python
nueva_lista = [expresión for elemento in iterable if condición]
```

### Ejemplos progresivos

```python
# Sin comprensión
cuadrados = []
for n in range(1, 6):
    cuadrados.append(n ** 2)

# Con comprensión ✅
cuadrados = [n ** 2 for n in range(1, 6)]
print(cuadrados)  # [1, 4, 9, 16, 25]
```

```python
# Solo los números pares del 1 al 10
pares = [n for n in range(1, 11) if n % 2 == 0]
print(pares)  # [2, 4, 6, 8, 10]
```

```python
# Convertir lista de strings a mayúsculas
frutas = ["manzana", "banana", "naranja"]
mayusculas = [f.upper() for f in frutas]
print(mayusculas)  # ["MANZANA", "BANANA", "NARANJA"]
```

!!! tip "¿Cuándo usarlas?"
    Usá comprensiones de listas cuando la lógica es simple y el resultado queda legible. Si necesitás más de una condición compleja o lógica anidada, preferí un `for` tradicional para mantener la claridad.

---

## ✅ Buenas prácticas

🌿 *Nivel: intermedio*

!!! success "Hacé esto ✅"
    - Usá nombres descriptivos: `nombres_alumnos` en vez de `lista1`.
    - Preferí `.append()` para agregar elementos al final en vez de concatenar con `+`.
    - Usá `sorted()` si querés conservar la lista original sin modificar.
    - Usá comprensiones de listas para transformaciones simples: son más legibles y rápidas.
    - Siempre copiá explícitamente con `.copy()` si no querés compartir la referencia.

!!! failure "Evitá esto ❌"
    - No uses índices "a mano" en un `for` si no los necesitás: preferí `for x in lista`.
    - No modifiques una lista mientras la estás recorriendo con `for`.
    - No asumas que `lista2 = lista1` crea una copia independiente.

---

## 🧪 Ejercicios

### 🌱 Ejercicio 1 — Básico
Pedile al usuario 5 números y guardalos en una lista. Luego mostrá el mayor, el menor y la suma.

### 🌿 Ejercicio 2 — Intermedio
Dada la lista `[5, 3, 8, 1, 9, 2, 7]`, mostrala ordenada de menor a mayor **sin modificar la original**.

### 🌿 Ejercicio 3 — Intermedio
Creá una lista de 10 números ingresados por el usuario. Luego mostrá solo los que sean mayores que el promedio.

### 🌶️ Ejercicio 4 — Avanzado
Usando comprensión de listas, generá una lista con los cuadrados de todos los números impares del 1 al 20.

### 🌶️ Ejercicio 5 — Avanzado
Representá una matriz 3×3 con una lista anidada. Calculá la suma de cada fila y mostrala.

---

!!! quote "Para cerrar"
    Las listas son el pan de cada día en Python. Dominarlas bien — desde cómo acceder a sus elementos hasta cómo copiarlas correctamente — te ahorra muchos errores y te abre la puerta a escribir código más limpio y expresivo.

## [⬅️ Anterior: Ejercicios — Estructuras de Control](../03_estructuras_de_control/ejercicios_estructuras_control.md)
## [📚 Índice](../../clases.md#listas)
## [➡️ Siguiente: Cuadernillo de ejercicios sobre Listas](./cuadernillo_listas_finde.md)