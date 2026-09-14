# Video 4 — Funciones: scope (ámbito de variables)

**Serie:** Funciones
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos el **scope** — o ámbito — de las variables: dónde existe cada variable y por qué las funciones no pueden ver todo lo que existe en el programa.

---

## VARIABLES LOCALES (~1.5 minutos)

```python
def calcular():
    resultado = 42      # variable LOCAL: vive solo dentro de calcular()
    return resultado

calcular()
print(resultado)   # ❌ NameError: name 'resultado' is not defined
```

> Las variables creadas **dentro** de una función son **locales**: existen mientras la función se ejecuta y desaparecen cuando termina. No son accesibles desde afuera.

*(Mostrar que cada llamada tiene sus propias variables:)*

```python
def sumar(a, b):
    total = a + b
    return total

x = sumar(3, 4)    # total = 7, luego desaparece
y = sumar(10, 20)  # total = 30, luego desaparece
```

> Cada llamada a la función crea sus propias variables locales, independientes de las otras llamadas.

---

## VARIABLES GLOBALES (~1.5 minutos)

```python
saludo = "Hola"   # variable GLOBAL

def mostrar():
    print(saludo)  # ✅ puede LEER la variable global

mostrar()   # Hola
```

> Las variables definidas **fuera** de cualquier función son globales. Las funciones pueden **leerlas**, pero no deberían modificarlas directamente.

*(El error clásico:)*

```python
contador = 0

def incrementar():
    contador += 1   # ❌ UnboundLocalError
```

> Cuando Python ve `contador +=` dentro de la función, asume que `contador` es una variable local. Pero no fue definida localmente, así que lanza un error.

---

## LA REGLA DE ORO DEL SCOPE (~1 minuto)

```python
# ❌ Dependencia de variables globales — difícil de testear
total = 0
def agregar(n):
    total += n   # UnboundLocalError

# ✅ Comunicación correcta: parámetros y return
def agregar(total, n):
    return total + n

total = 0
total = agregar(total, 5)
total = agregar(total, 3)
print(total)   # 8
```

> La regla de oro:
> - Si la función necesita un dato de afuera → **pasalo como parámetro**
> - Si la función produce un dato que necesitan afuera → **retornalo con `return`**
>
> Eviten depender de variables globales dentro de funciones. Hace el código difícil de testear y de entender.

---

## VARIABLE LOCAL "TAPA" A LA GLOBAL (~30 segundos)

```python
x = "global"

def foo():
    x = "local"    # esta x es LOCAL — no toca la global
    print(x)       # "local"

foo()
print(x)   # "global" ← no se modificó
```

> Si dentro de una función creamos una variable con el mismo nombre que una global, son dos variables distintas. La local "tapa" a la global dentro de la función, pero la global sigue intacta afuera.

---

## CIERRE (~20 segundos)

> En el próximo video vemos los **parámetros avanzados**: valores por defecto que ya vimos brevemente, y `*args` y `**kwargs` para funciones con cantidad variable de argumentos.
>
> ¡Nos vemos!
