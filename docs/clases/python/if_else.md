# 🔀 Condicionales: if, else y elif

Hasta ahora nuestros programas ejecutaban todo en orden…

👉 Pero en la vida real necesitamos tomar decisiones:

- Si llueve → llevo paraguas ☔  
- Si tengo hambre → como 🍕  
- Si apruebo → festejo 🎉  

En programación hacemos lo mismo con **condicionales**

---

## 🧠 ¿Qué es un `if`?

La estructura `if` nos permite ejecutar código **solo si se cumple una condición**

---

### ✨ Ejemplo básico

```python
edad = 18

if edad >= 18:
    print("Sos mayor de edad")
```

📌 Si la condición es verdadera → se ejecuta el bloque
📌 Si es falsa → no pasa nada

---

## ⚠️ ¡Muy importante! Indentación

Python usa **indentación (espacios)** para definir bloques

```python
if edad >= 18:
    print("Esto está bien")
```

---

### ❌ Error común

```python
if edad >= 18:
print("Esto rompe todo")
```

👉 Esto da error porque falta indentación

---

### 🧠 Regla clave

👉 Todo lo que depende del `if` debe estar **indentado (tab o 4 espacios)**

---

## 🔍 Operadores que usamos en condiciones

```python
>   mayor que
<   menor que
>=  mayor o igual
<=  menor o igual
==  igual
!=  distinto
```

---

### 🧪 Ejemplo con comparación

```python
nota = 7

if nota >= 6:
    print("Aprobado")
```

---

## 🔁 Agregando `else`

¿Qué pasa si la condición es falsa?

👉 Usamos `else`

---

### ✨ Ejemplo

```python
nota = 4

if nota >= 6:
    print("Aprobado")
else:
    print("Desaprobado")
```

---

## 🧠 ¿Cómo funciona?

* Si el `if` es verdadero → ejecuta ese bloque
* Si no → ejecuta el `else`

👉 Siempre se ejecuta **uno de los dos**

---

## 🔀 Múltiples caminos: `elif`

Cuando tenemos más de dos opciones usamos `elif`

---

## ✨ Ejemplo

```python
nota = 8

if nota >= 9:
    print("Excelente")
elif nota >= 6:
    print("Aprobado")
else:
    print("Desaprobado")
```

---

## 🧠 Importante

👉 Python evalúa de arriba hacia abajo

👉 Se queda con la **primera condición verdadera**

---

## 🔗 Combinando condiciones

```python
edad = 20
tiene_dni = True

if edad >= 18 and tiene_dni:
    print("Puede votar")
```

---

## ⚠️ Errores comunes

### ❌ Usar `=` en vez de `==`

```python
if edad = 18:  # ERROR
```

✔️ Correcto:

```python
if edad == 18:
```

---

### ❌ Olvidar los `:`

```python
if edad >= 18   # ERROR
```

✔️ Correcto:

```python
if edad >= 18:
```

---

### ❌ Mala indentación

```python
if edad >= 18:
print("Hola")  # ERROR
```

---

## 🔄 Relación con diagramas de flujo

Un `if` se representa como una decisión:

```
        ¿edad >= 18?
           /   \
         Sí     No
        /         \
  "Mayor"     "Menor"
```

👉 Cada camino representa una decisión del programa

---

## 🧪 Ejercicios

1. Pedir la edad al usuario y mostrar si es mayor de edad
2. Pedir un número y mostrar si es positivo
3. Pedir una nota y mostrar si aprobó o no (>= 6)
4. Pedir dos números y mostrar cuál es mayor
5. Pedir un número y mostrar si es par o impar
6. Pedir una temperatura y decir si hace frío (<15) o calor
7. Pedir una contraseña y verificar si es correcta
8. Pedir un número y decir si es mayor que 10, menor o igual
9. Pedir tres notas y mostrar:
    * "Promociona" (>= 8)
    * "Aprueba" (>= 6)
    * "Recupera" (< 6)
10. Pedir un número y decir si está entre 1 y 100

---

## 🚀 Desafío

👉 Crear un programa que:

* Pida la edad
* Pida si tiene licencia (True/False)
* Muestre si puede conducir

---

## 🧩 Mini cierre conceptual

* `if` permite tomar decisiones
* `else` cubre el caso contrario
* `elif` permite múltiples caminos
* La indentación en Python es obligatoria
* Las condiciones devuelven `True` o `False`

---

💡 A partir de ahora:

👉 Tus programas ya pueden "pensar"

👉 En la próxima clase vamos a repetir acciones automáticamente 😏

---

## [🔙 ​Volver a Python Básico](./python_basico.md)
