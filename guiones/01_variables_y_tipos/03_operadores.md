# Video 3 — Operadores

**Serie:** Variables y Tipos de Datos
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Archivo Python abierto en el editor)*

> Hola! En este video vemos los **operadores**: las herramientas para hacer cálculos, comparaciones y combinar condiciones lógicas.

---

## OPERADORES ARITMÉTICOS (~1.5 minutos)

*(Escribir en el editor:)*

```python
a = 10
b = 3

print(a + b)    # 13  — suma
print(a - b)    # 7   — resta
print(a * b)    # 30  — multiplicación
print(a / b)    # 3.3333... — división (siempre da float)
print(a // b)   # 3   — división entera (descarta decimales)
print(a % b)    # 1   — módulo (el resto de la división)
print(a ** b)   # 1000 — potencia (10 elevado a 3)
```

> Siete operadores aritméticos. Los primeros cuatro los conocen de matemática. Los últimos tres merecen atención:
>
> La **división** con `/` siempre devuelve un float, aunque el resultado sea exacto: `10 / 2` da `5.0`, no `5`.
>
> La **división entera** con `//` descarta los decimales: `10 // 3` da `3`.
>
> El **módulo** con `%` devuelve el resto de la división: `10 % 3` da `1` porque `10 = 3×3 + 1`. Muy útil para saber si un número es par o impar: si `n % 2 == 0`, es par.

*(Mostrar operadores de asignación compuesta:)*

```python
contador = 0
contador += 1    # equivale a: contador = contador + 1
contador += 1
print(contador)  # 2

precio = 100
precio *= 1.10   # aumentar un 10%
print(precio)    # 110.0
```

> Los operadores `+=`, `-=`, `*=`, `/=` son atajos: modifican la variable y la reasignan en una sola línea. Los van a ver todo el tiempo dentro de bucles.

---

## OPERADORES DE COMPARACIÓN (~1 minuto)

```python
a = 10
b = 5

print(a > b)    # True  — mayor que
print(a < b)    # False — menor que
print(a == b)   # False — igual a  (¡dos signos igual!)
print(a != b)   # True  — distinto de
print(a >= b)   # True  — mayor o igual
print(a <= b)   # False — menor o igual
```

> Los operadores de comparación siempre devuelven `True` o `False`. Son la base de todas las condiciones que usamos en `if` y `while`.

> El error más común: usar `=` (asignación) donde debería ir `==` (comparación). `if edad = 18:` da error. `if edad == 18:` compara.

---

## OPERADORES LÓGICOS (~1 minuto)

```python
edad        = 20
tiene_dni   = True

# and: ambas condiciones deben ser True
if edad >= 18 and tiene_dni:
    print("Puede votar")       # True and True → True

# or: al menos una condición debe ser True
llueve     = False
tengo_auto = True

if llueve or tengo_auto:
    print("Puedo salir igual") # False or True → True

# not: invierte el valor
conectado = False
if not conectado:
    print("Sin conexión")      # not False → True
```

> `and` es el "y": ambas condiciones deben ser verdaderas.
> `or` es el "o": alcanza con que una sea verdadera.
> `not` niega: convierte `True` en `False` y viceversa.

---

## PRECEDENCIA (~45 segundos)

```python
# ¿Qué da esto?
resultado = 2 + 3 * 4
print(resultado)   # 14, no 20
```

> La multiplicación se hace antes que la suma, igual que en matemática. La precedencia en Python sigue el orden estándar: primero potencias, luego multiplicación/división, luego suma/resta, luego comparaciones, luego lógicos.
>
> Si no están seguros del orden, usen **paréntesis** para forzar lo que quieren:

```python
resultado = (2 + 3) * 4
print(resultado)   # 20
```

> Los paréntesis siempre tienen prioridad máxima y hacen el código más legible.

---

## CIERRE (~20 segundos)

> Listo. Con variables, tipos y operadores ya tienen las herramientas básicas para hacer cálculos.
>
> En el próximo video arrancamos con las **estructuras de control**: cómo hacer que el programa tome decisiones con `if`, `elif` y `else`.
>
> ¡Nos vemos!
