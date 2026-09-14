# Video 3 — Funciones: return

**Serie:** Funciones
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos el `return`: cómo una función devuelve un resultado y por qué es diferente a simplemente imprimir.

---

## RETURN VS PRINT: LA DIFERENCIA CLAVE (~2 minutos)

```python
# Con print: muestra en pantalla, pero no devuelve nada útil
def imprimir_cuadrado(n):
    print(n ** 2)

x = imprimir_cuadrado(5)   # imprime 25 en pantalla
print(x)                    # None ← la función no devolvió nada
```

```python
# Con return: devuelve el resultado para que el programa lo use
def cuadrado(n):
    return n ** 2

x = cuadrado(5)
print(x)        # 25
print(x + 1)    # 26 ← podemos usar el resultado en cálculos
```

> `print()` muestra algo en pantalla para que lo **vea un humano**.
> `return` devuelve un valor para que lo **use el programa**.
>
> Son cosas completamente distintas. Una función que solo hace `print` no puede ser usada en cálculos, ni pasada a otra función, ni guardada en una variable con sentido.
>
> La regla general: **usá `return`, no `print`**, salvo que el propósito explícito de la función sea mostrar algo en pantalla.

---

## RETURN CORTA LA EJECUCIÓN (~1 minuto)

```python
def primera_par(nums):
    for n in nums:
        if n % 2 == 0:
            return n        # ← sale de la función acá
    return None             # si no encontró ninguna

print(primera_par([1, 3, 4, 7]))   # 4
print(primera_par([1, 3, 5]))      # None
```

> Cuando Python ejecuta `return`, **sale inmediatamente de la función**. El código que viene después del `return` no se ejecuta. Esto es útil para hacer "early returns": salir en cuanto encontramos lo que buscábamos.

---

## RETORNAR MÚLTIPLES VALORES (~1 minuto)

```python
def estadisticas(numeros):
    minimo   = min(numeros)
    maximo   = max(numeros)
    promedio = sum(numeros) / len(numeros)
    return minimo, maximo, promedio   # Python crea una tupla

mn, mx, prom = estadisticas([3, 7, 2, 9, 4])
print(f"Min: {mn}, Max: {mx}, Promedio: {prom:.2f}")
# Min: 2, Max: 9, Promedio: 5.00
```

> Cuando ponemos varios valores separados por comas después del `return`, Python los empaqueta en una **tupla**. El llamador los desempaqueta en varias variables. Es la forma estándar de devolver múltiples resultados.

---

## FUNCIÓN SIN RETURN (~30 segundos)

```python
def mostrar_bienvenida(nombre):
    print(f"Bienvenido, {nombre}!")
    print("Este es tu primer acceso.")
    # Sin return → devuelve None implícitamente
```

> Toda función en Python devuelve algo. Si no hay `return`, devuelve `None`. Esto está bien cuando la función tiene efectos secundarios (mostrar en pantalla, escribir en un archivo) y no necesita devolver un valor calculado.

---

## CIERRE (~20 segundos)

> En el próximo video vemos el **scope**: qué variables puede "ver" una función y cómo comunicarse correctamente entre funciones.
>
> ¡Nos vemos!
