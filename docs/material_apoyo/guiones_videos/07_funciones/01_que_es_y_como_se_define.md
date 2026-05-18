# Video 1 — Funciones: qué son y cómo se definen

**Serie:** Funciones
**Duración estimada:** ~5 minutos

---

## INTRO (~30 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video arrancamos con las **Funciones**: la herramienta para evitar repetir código y empezar a pensar en bloques reutilizables.
>
> Una función es un bloque de código con nombre que podemos ejecutar cuantas veces queramos, con datos distintos cada vez.

---

## EL PROBLEMA QUE RESUELVEN (~1 minuto)

```python
# Sin funciones: repetición
print(f"Área: {3 * 4}")
print(f"Área: {5 * 7}")
print(f"Área: {10 * 2}")
# Si mañana cambia la fórmula, hay que cambiarla en 3 lugares
```

```python
# Con función: un solo lugar para cambiar
def area_rectangulo(base, alto):
    return base * alto

print(f"Área: {area_rectangulo(3, 4)}")
print(f"Área: {area_rectangulo(5, 7)}")
print(f"Área: {area_rectangulo(10, 2)}")
```

> Este principio se llama **DRY** — Don't Repeat Yourself. Si el mismo código aparece en tres lugares, debería estar en una función.

---

## ANATOMÍA DE UNA FUNCIÓN (~1.5 minutos)

```python
#    ↓ palabra clave    ↓ nombre    ↓ parámetros
def area_rectangulo(base, alto):
    resultado = base * alto    # ← cuerpo (indentado)
    return resultado           # ← valor de retorno
```

*(Explicar cada parte:)*

> `def` le dice a Python "estoy definiendo una función".
>
> El nombre sigue la misma convención que las variables: **snake_case con verbo** — `calcular_area`, `es_par`, `filtrar_aprobados`.
>
> Los **parámetros** son las variables que la función recibe. Van entre paréntesis separados por comas.
>
> El **cuerpo** es el código que ejecuta la función. Debe estar indentado.
>
> `return` devuelve el resultado al código que llamó la función.

---

## DEFINICIÓN VS LLAMADA (~1.5 minutos)

```python
# Definición: solo describe qué hace — NO lo ejecuta
def area_rectangulo(base, alto):
    return base * alto

# Llamada: acá SÍ se ejecuta
resultado = area_rectangulo(3, 4)   # base=3, alto=4
print(resultado)   # 12
```

> El bloque `def` solo **registra** la función. El código del cuerpo se ejecuta únicamente cuando **llamamos** a la función. Si nunca la llamamos, nunca se ejecuta.

*(Mostrar varios usos:)*

```python
# Podemos usarla cuantas veces queramos
print(area_rectangulo(5, 7))    # 35
print(area_rectangulo(10, 2))   # 20
print(area_rectangulo(1, 1))    # 1

# El resultado puede usarse en cálculos
total = area_rectangulo(3, 4) + area_rectangulo(2, 5)
print(total)   # 22
```

---

## CIERRE (~30 segundos)

> Las funciones son el primer paso hacia programar en bloques. En lugar de un script largo y lineal, empezamos a pensar en piezas con nombre y responsabilidad propia.
>
> En el próximo video vemos en detalle los **parámetros y argumentos**.
>
> ¡Nos vemos!
