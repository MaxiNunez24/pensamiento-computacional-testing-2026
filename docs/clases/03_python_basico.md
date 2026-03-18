# 🐍 Introducción a Python

## 📜 Un poco de historia

Python es uno de los lenguajes más importantes del mundo actual, pero… ¿de dónde viene? 🤔

* Fue creado por **Guido Van Rossum** en **diciembre de 1989**
* Su primera versión se publicó en **febrero de 1991**
* Es un lenguaje **de código abierto**, lo que significa que cualquiera puede usarlo y mejorarlo
* Su nombre viene de **Monty Python**, un grupo británico de comedia 🎭

---

## ⚙️ Características de Python

Python tiene varias características que lo hacen único:

* !!! info "🧠 **Es interpretado** (no se compila antes de ejecutarse)"
* !!! info "🚀 **Es de alto nivel** (más cercano al lenguaje humano que a la máquina)"
* ??? info "🛠️ **Es de propósito general**, se puede usar para:"
    * Desarrollo web
    * Aplicaciones de escritorio
    * Ciencia de datos
    * Inteligencia artificial 🤖
    * Administración de sistemas
    * Juegos
    * Automatización de tareas
    * Etc.
* ??? info "🔀 **Es multiparadigma**:"
     * Imperativo
     * Orientado a objetos (POO)
     * Funcional
* ??? info "💻 **Es multiplataforma**:"
     * Windows
     * Linux
     * MacOS
* !!! info "📚 Tiene una **biblioteca estándar muy amplia**"

---

## 🧭 Filosofía de Python

Python no solo es un lenguaje… también tiene una filosofía 🧘‍♂️

### Sus pilares principales:

* ✅ Ser **fácil e intuitivo**, pero potente como sus principales competidores
* 🌍 Ser **código abierto** para que cualquiera pueda colaborar
* 📖 El código debe ser **tan legible como un texto en inglés**
* ⚡ Ser apto para actividades diarias, pudiendo construir prototipos en poco tiempo

---

## 🎯 ¿Por qué aprender Python?

Python es uno de los lenguajes más elegidos hoy en día:

* ✍️ Sintaxis **simple y legible**
* 📈 **Curva de aprendizaje rápida**
* 💡 Permite hacer mucho con poco código
* 🔄 **Muy versátil** (especialmente en IA 🤖)
* 💻 Funciona en cualquier sistema operativo
* 🏆 Es uno de los lenguajes más populares del mundo

### 🏢 Empresas que lo utilizan:

* YouTube
* Netflix
* NASA

---

## ⚠️ Desventajas

Como todo lenguaje, Python también tiene puntos débiles:

* 🐢 No es el más rápido (al ser interpretado)
* 🧵 Manejo limitado de múltiples hilos (multithreading)
* 🧠 Mayor consumo de memoria
* ⚠️ Algunos errores aparecen en tiempo de ejecución
* 📱 Poco usado en desarrollo móvil
* 📦 Hay muchas librerías para lo mismo (hay que saber elegir)
* 🧪 Algunas pueden estar desactualizadas

---

## 💻 Instalando las herramientas

Para programar en Python vamos a necesitar instalar su intérprete y un editor de código:

👉 **Intérprete de Python**

🔗 [Instalar Python](../instalacion/instalar_python.md)

👉 **IDE Visual Studio Code (VS Code)**

🔗 [Instalar Visual Studio Code](../instalacion/instalar_vscode.md)


### 🔌 Extensiones necesarias

Para trabajar cómodamente con Python en VS Code necesitamos:

* Python (Microsoft)
* Pylance
* Debugger

---

## 📁 Archivos en Python

Para escribir código en Python:

* Creamos archivos con extensión: `.py`



### 📌 Convención de nombres

Usamos **snake_case**:

```python
primer_programa.py
```

---

## 🖥️ Otra forma de ejecutar Python

Python también se puede usar desde la terminal:

* Ejecutando:

```bash
py
```

o

```bash
python
```

o

```bash
python3
```

Esto abre el **intérprete interactivo (REPL)**:

👉 Read – Eval – Print – Loop

---

## 🧪 La función `print()`

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

## ▶️ Ejecutar el programa

Podés ejecutar el código de dos formas:

### Desde VS Code

* Botón ▶️ (play)

### Desde la terminal

```bash
python archivo.py
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