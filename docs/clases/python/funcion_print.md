# 🖨️ La función `print()`

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

## 🔍 Profundizando en `print()`

Hasta ahora usamos `print()` de forma básica…
Pero esta función tiene **mucho más poder** del que parece 😏

---

### 🧩 Sintaxis general

```python
print(valor1, valor2, valor3, ..., sep=" ", end="\n")
```

---

### 📌 Parámetros importantes

#### 🔹 `sep` (separador)

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

#### 🔹 `end` (final)

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

## 🔤 Combinando texto y variables

También podemos mezclar texto con valores:

```python
nombre = "Maxi"
edad = 25

print("Hola", nombre, "tenés", edad, "años")
```

---

### ⚠️ Forma más prolija (recomendada)

```python
print(f"Hola {nombre}, tenés {edad} años")
```

👉 Esto se llama **f-string** (lo vamos a usar mucho)

---

## 🧪 Ejercicios con `print()`

Antes de avanzar, practicamos bien esto 👇

1. Mostrar tu nombre y apellido en una misma línea
2. Mostrar tres palabras separadas por `-`
3. Mostrar tres números separados por `,`
4. Mostrar dos mensajes en la misma línea usando `end`
5. Mostrar un mensaje como:
   `"Hola Juan, tenés 20 años"` (usando variables)

---

## 🚀 Desafío

👉 Intentá generar esta salida:

```
Python -> Java -> C++ -> JavaScript
```

---

## 🧩 Mini cierre conceptual

* `print()` sirve para mostrar información
* Puede recibir múltiples valores
* Podemos controlar:

  * Separación (`sep`)
  * Final (`end`)
* Podemos combinar texto y variables