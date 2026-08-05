# 🔁 Estructura de control for en Python

## 🤔 ¿Qué es un bucle for?

La clase pasada vimos `while`, que repite un bloque **mientras** se cumpla una condición. El `for` es distinto: lo usamos cuando sabemos (o podemos calcular) **cuántas veces** queremos repetir algo, o cuando queremos **recorrer** una secuencia elemento por elemento.

!!! info "Diferencia clave con `while`"
    - `while` → repetir **hasta que** algo cambie  
    - `for` → repetir **para cada elemento** de una secuencia, o una cantidad fija de veces

---

## 📝 Sintaxis básica

```python
for variable in secuencia:
    # bloque que se repite
```

- `variable` toma el valor de cada elemento de la secuencia en cada iteración
- el bloque debe estar **indentado** (4 espacios o 1 tab)

---

## 🔢 range(): el mejor amigo del for

`range()` genera una secuencia de números. Es la forma más común de controlar cuántas veces se repite el bucle.

| Forma | Resultado |
|---|---|
| `range(5)` | 0, 1, 2, 3, 4 |
| `range(1, 6)` | 1, 2, 3, 4, 5 |
| `range(0, 10, 2)` | 0, 2, 4, 6, 8 |
| `range(5, 0, -1)` | 5, 4, 3, 2, 1 |

```python
# Imprimir del 1 al 5
for i in range(1, 6):
    print(i)
```

```python
# Contar de 2 en 2
for i in range(0, 11, 2):
    print(i)
```

---

## 🔤 Recorrer cadenas de texto

Los `string` también son secuencias, podemos recorrerlos letra por letra:

```python
nombre = "Python"
for letra in nombre:
    print(letra)
```

```
P
y
t
h
o
n
```

---

## ⚔️ for vs while: comparación directa

Mismo problema, dos soluciones:

```python
# Con while
i = 1
while i <= 5:
    print(i)
    i += 1

# Con for
for i in range(1, 6):
    print(i)
```

!!! tip "¿Cuándo usar cada uno?"
    Usá `for` cuando sabés cuántas veces repetir. Usá `while` cuando dependés de una condición que puede cambiar de formas imprevisibles.

---

## ⏭️ break y continue

Funcionan igual que en `while`:

```python
# break: sale del bucle antes de terminar
for i in range(10):
    if i == 5:
        break
    print(i)
# Imprime: 0 1 2 3 4
```

```python
# continue: saltea la iteración actual y sigue
for i in range(6):
    if i == 3:
        continue
    print(i)
# Imprime: 0 1 2 4 5
```

---

## 🎮 Ejercicios

!!! tip "🧪 Los ejercicios ahora son interactivos"
    Escribís el código, lo ejecutás con **Python de verdad en el navegador** y los tests te dicen al
    instante si está bien. Sin instalar nada: funciona desde la máquina del CFP, desde tu casa y
    desde el celular. Tu avance **se guarda solo**.

    Si te trabás, cada ejercicio tiene pistas — y un botón para mandarme tu código y tu consulta.

    [🚀 Ir a los ejercicios de Bucles](/pensamiento-computacional-testing-2026/ejercicios/clases/bucles/){ .md-button .md-button--primary }

## [⬅️ Anterior: While](./while.md)
## [📚 Índice](../clases.md#estructuras-de-control)
## [➡️ Siguiente: Ejercicios — Estructuras de Control](./ejercicios_estructuras_control.md)