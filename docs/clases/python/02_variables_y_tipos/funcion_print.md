# 🖨️ La función print() (Salida de datos)

La función más importante para empezar es:

```python
print()
```

👉 Sirve para mostrar información en la terminal

---

## ✨ Ejemplo básico

```python
print("Hola Mundo!")
```

📌 Al ejecutarlo vas a ver:

```
Hola Mundo!
```

🎉 Este es el primer programa en casi todos los lenguajes

---

## 🔤 Strings (cadenas de texto)

Para escribir texto usamos comillas:

* `"comillas dobles"`
* `'comillas simples'`

### Ejemplos:

```python
print("Hola!")
print('Hola!')
```

También podemos combinarlas:

```python
print("Usamos 'comillas simples' dentro de dobles")
print('Usamos "comillas dobles" dentro de simples')
```

---

## 🔍 Profundizando en print()

Hasta ahora usamos `print()` de forma básica…
Pero esta función tiene **mucho más poder** del que parece 😏

---

### 🧩 Sintaxis general

```python
print(valor1, valor2, valor3, ..., sep=" ", end="\n")
```

---

### 📌 Parámetros importantes

#### 🔹 sep (separador)

Define **cómo se separan los valores** dentro del `print()`

👉 Por defecto es un espacio `" "`

##### Ejemplo:

```python
print("Hola", "Mundo")
```

Salida:

```
Hola Mundo
```

---

##### 🔧 Cambiando el separador

```python
print("Hola", "Mundo", sep="-")
```

Salida:

```
Hola-Mundo
```

---

#### 🔹 end (final)

Define **qué pasa al final del print**

👉 Por defecto es un salto de línea `\n`

---

##### Ejemplo:

```python
print("Hola", end=" ")
print("Mundo")
```

Salida:

```
Hola Mundo
```

---

##### 🧠 ¿Qué significa esto?

👉 Normalmente cada `print()` baja de línea
👉 Pero con `end` podemos cambiar ese comportamiento

---

### 🧪 Más ejemplos

```python
print("Uno", "Dos", "Tres", sep=", ")
```

```
Uno, Dos, Tres
```

---

```python
print("Cargando...", end="")
print("Listo!")
```

```
Cargando...Listo!
```

---

## 🎮 Ejercicios con print()

**Ejercicio 1 🌱** — Mostrá tu nombre y apellido en una misma línea.

??? success "✅ Solución"
    ```python
    print("Maxi", "Nuñez")
    ```

**Ejercicio 2 🌱** — Mostrá tres palabras separadas por `-`.

??? success "✅ Solución"
    ```python
    print("Python", "es", "genial", sep="-")
    # Python-es-genial
    ```

**Ejercicio 3 🌱** — Mostrá tres números separados por `,`.

??? success "✅ Solución"
    ```python
    print(1, 2, 3, sep=",")
    # 1,2,3
    ```

**Ejercicio 4 🌱** — Mostrá dos mensajes en la misma línea usando `end`.

??? success "✅ Solución"
    ```python
    print("Hola", end=" ")
    print("Mundo")
    # Hola Mundo
    ```

**Ejercicio 5 🌱** — Mostrá `"Hola Juan, tenés 20 años"` usando variables.

??? success "✅ Solución"
    ```python
    nombre = "Juan"
    edad = 20
    print(f"Hola {nombre}, tenés {edad} años")
    ```

---

## 🚀 Desafío

Intentá generar esta salida:

```
Python -> Java -> C++ -> JavaScript
```

??? success "✅ Solución"
    ```python
    print("Python", "Java", "C++", "JavaScript", sep=" -> ")
    ```

---

## 🧩 Mini cierre conceptual

* `print()` sirve para mostrar información
* Puede recibir múltiples valores
* Podemos controlar:

  * Separación (`sep`)
  * Final (`end`)
* Podemos combinar texto y variables


## [⬅️ Anterior: Ejecutar el programa](../01_introduccion/ejecutar_programa.md)
## [📚 Índice](../../clases.md#variables)
## [➡️ Siguiente: Variables, tipos de datos y operadores](./variables.md)