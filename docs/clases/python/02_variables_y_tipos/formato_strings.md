# 📐 Formato de strings y f-strings

Ya sabemos que las f-strings nos permiten combinar variables con texto:

```python
nombre = "Ana"
nota   = 9.5
print(f"{nombre} sacó {nota}")   # Ana sacó 9.5
```

Pero las f-strings tienen un poder extra: podemos controlar **exactamente cómo se muestra** cada valor.

---

## 🧩 Sintaxis de formato

Dentro de las llaves, después de los dos puntos, va la especificación de formato:

```python
f"{valor:formato}"
```

---

## ↔️ Alineación y ancho

Podemos definir cuántos caracteres ocupa un valor y hacia dónde se alinea:

| Símbolo | Significado |
|---------|-------------|
| `<` | Alinear a la **izquierda** |
| `>` | Alinear a la **derecha** |
| `^` | **Centrar** |

```python
texto = "Python"

print(f"{texto:<10}")   # "Python    "  ← rellena espacios a la derecha
print(f"{texto:>10}")   # "    Python"  ← rellena espacios a la izquierda
print(f"{texto:^10}")   # "  Python  "  ← rellena en ambos lados
```

👉 El número después del símbolo es el **ancho total** del campo en caracteres.

---

## 🔢 Decimales

Para números con decimales usamos `.Nf` donde `N` es la cantidad de decimales:

```python
pi = 3.14159

print(f"{pi:.2f}")   # 3.14
print(f"{pi:.4f}")   # 3.1416
print(f"{pi:.0f}")   # 3
```

Se puede combinar con ancho y alineación:

```python
nota = 9.5
print(f"{nota:8.2f}")   # "    9.50"  ← ancho 8, 2 decimales, derecha por defecto
```

---

## 🔧 Ancho con variable

En vez de escribir el número fijo, podemos usar una variable como ancho:

```python
ancho = 12
nombre = "Beto"

print(f"{nombre:<{ancho}}")   # "Beto        "
```

👉 Las llaves internas `{ancho}` se reemplazan por el valor de la variable antes de aplicar el formato.

---

## 📊 Ejemplo práctico: tabla alineada

```python
ancho = 12
alumnos = [("Ana", 9.5), ("Beto", 6.0), ("Cami", 8.75)]

print(f"{'Nombre':<{ancho}} {'Nota':>{ancho}}")
print("-" * (ancho * 2 + 1))
for nombre, nota in alumnos:
    print(f"{nombre:<{ancho}} {nota:>{ancho}.2f}")
```

```
Nombre            Nota
-------------------------
Ana               9.50
Beto              6.00
Cami              8.75
```

---

## 🎮 Ejercicios

**Ejercicio 1 🌱** — Mostrá tu nombre centrado en un campo de 20 caracteres.

??? success "✅ Solución"
    ```python
    nombre = "Maxi"
    print(f"{nombre:^20}")  # "        Maxi        "
    ```

**Ejercicio 2 🌱** — Mostrá el número `1234.5678` con exactamente 2 decimales.

??? success "✅ Solución"
    ```python
    n = 1234.5678
    print(f"{n:.2f}")  # 1234.57
    ```

**Ejercicio 3 🌿** — Creá una "tabla" con 3 productos y sus precios, alineando el nombre a la izquierda y el precio a la derecha con 2 decimales.

```
Manzana           $   1.50
Banana            $   0.80
Naranja           $   1.20
```

??? success "✅ Solución"
    ```python
    productos = [("Manzana", 1.5), ("Banana", 0.8), ("Naranja", 1.2)]
    for nombre, precio in productos:
        print(f"{nombre:<18}$ {precio:>6.2f}")
    ```

---

## 🧩 Mini cierre conceptual

* `{valor:<N}` → izquierda, `{valor:>N}` → derecha, `{valor:^N}` → centrado
* `{valor:.2f}` → 2 decimales
* Se pueden combinar: `{valor:>10.2f}`
* El ancho puede ser una variable: `{valor:<{ancho}}`

---

## [⬅️ Anterior: Variables, tipos de datos y operadores](./variables.md)
## [📚 Índice](../../clases.md#variables)
## [➡️ Siguiente: La función input()](./funcion_input.md)
