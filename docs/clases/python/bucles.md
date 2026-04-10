# 🔃​ Bucles: While y For

En programación a menudo necesitamos repetir un bloque de código varias veces

👉 Para eso usamos **bucles** o **loops**

---
## 🧠 Bucles `while`
El bucle `while` repite un bloque de código **mientras se cumpla una condición**

```python
contador = 0
while contador < 5:
    print("Hola")
    contador += 1
```
📌 En este ejemplo, el bloque dentro del `while` se ejecuta mientras `contador` sea menor que 5

### ⚠️ Cuidado con los bucles infinitos
Si la condición del `while` nunca se vuelve falsa, el bucle se ejecutará para siempre → ¡cuidado con eso!

```python
while True:
    print("Esto es un bucle infinito")
```

#### 📝 Regla clave 
Al usar bucles, siempre asegúrate de que la condición eventualmente se vuelva falsa para evitar bucles infinitos.

### ➡️ Continuar con el capítulo 9 del material de apoyo **Python Ya**
#### [🔗 Enlace al capítulo](https://www.tutorialesprogramacionya.com/pythonya/detalleconcepto.php?punto=9&codigo=9&inicio=0)

--- 

## 🧠 Bucles `for`
El bucle `for` se usa para iterar sobre una secuencia (como una lista o un rango de números)

```python
for i in range(5):
    print("Hola")
```
📌 En este ejemplo, el bloque dentro del `for` se ejecuta 5 veces, con `i` tomando los valores de 0 a 4

### ➡️ Continuar con el capítulo 10 del material de apoyo **Python Ya**
#### [🔗 Enlace al capítulo](https://www.tutorialesprogramacionya.com/pythonya/detalleconcepto.php?punto=10&codigo=10&inicio=0)


---

### 😢 Disculpen por no haber tenido tiempo de preparar esta clase!
Tuve que entregar un trabajo de la materia Sistemas Paralelos en la universidad y no me dio tiempo de preparar esta clase como me hubiera gustado.

Va a estar todo más completo para el miércoles que viene!

Mientras tanto utilicen el material de apoyo para entender, practicar y experimentar con los bucles `while` y `for`.

## [⬅️ Volver a la clase de Python Básico](./python_basico.md)