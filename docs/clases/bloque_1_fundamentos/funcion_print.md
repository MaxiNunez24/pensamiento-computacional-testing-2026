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

## 🎮 Ejercicios

!!! tip "🧪 Los ejercicios ahora son interactivos"
    Escribís el código, lo ejecutás con **Python de verdad en el navegador** y los tests te dicen al
    instante si está bien. Sin instalar nada: funciona desde la máquina del CFP, desde tu casa y
    desde el celular. Tu avance **se guarda solo**.

    Si te trabás, cada ejercicio tiene pistas — y un botón para mandarme tu código y tu consulta.

    [🚀 Ir a los ejercicios de print()](/pensamiento-computacional-testing-2026/ejercicios/clases/print/){ .md-button .md-button--primary }

## 🚀 Desafío

Hay uno extra esperándote al final de los ejercicios interactivos. 😉

---

## 🧩 Mini cierre conceptual

* `print()` sirve para mostrar información
* Puede recibir múltiples valores
* Podemos controlar:

  * Separación (`sep`)
  * Final (`end`)
* Podemos combinar texto y variables


## [⬅️ Anterior: Ejecutar el programa](./ejecutar_programa.md)
## [📚 Índice](../clases.md#variables)
## [➡️ Siguiente: Variables, tipos de datos y operadores](./variables.md)