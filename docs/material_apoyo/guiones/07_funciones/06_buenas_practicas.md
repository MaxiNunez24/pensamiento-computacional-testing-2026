# Video 6 — Funciones: buenas prácticas

**Serie:** Funciones
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! Último video de la serie de Funciones. Vemos las buenas prácticas: cómo nombrar, cuándo crear una función, y los errores de diseño más comunes.

---

## NOMBRES: VERBO EN SNAKE_CASE (~1 minuto)

```python
# ❌ Nombres vagos o en camelCase
def f(x): ...
def procesarDatos(lista): ...
def data(n): ...

# ✅ Verbo descriptivo en snake_case
def calcular_promedio(notas): ...
def filtrar_aprobados(alumnos): ...
def es_par(numero): ...
def validar_email(email): ...
```

> Las funciones **hacen algo**, así que su nombre debe ser un verbo que describa qué hacen. `calcular_promedio` dice exactamente qué esperar. `f` no dice nada.
>
> Las funciones que devuelven `True` o `False` suelen empezar con `es_` o `tiene_`: `es_par()`, `tiene_mayusculas()`.

---

## UNA FUNCIÓN = UNA RESPONSABILIDAD (~1.5 minutos)

> El principio más importante al diseñar funciones: **cada función debe hacer una sola cosa**.

```python
# ❌ Hace demasiado — difícil de reutilizar y de testear
def procesar_todo(notas):
    total = sum(notas)
    promedio = total / len(notas)
    if promedio >= 6:
        print("Aprobado")
    else:
        print("Desaprobado")

# ✅ Responsabilidades separadas
def calcular_promedio(notas):
    return sum(notas) / len(notas)

def estado(promedio):
    return "Aprobado" if promedio >= 6 else "Desaprobado"

# Ahora podemos usar cada parte por separado
prom = calcular_promedio([8, 7, 9])
print(estado(prom))

# Y también podemos combinarlas
print(estado(calcular_promedio([4, 5, 3])))
```

> Cuando separamos responsabilidades, cada función es más fácil de testear, de reutilizar y de cambiar sin romper lo demás.

---

## RETURN EN LUGAR DE PRINT (~1 minuto)

```python
# ❌ Solo imprime — no se puede usar en cálculos
def area(base, alto):
    print(base * alto)

# ✅ Devuelve el resultado — reutilizable
def area(base, alto):
    return base * alto

# Ahora podemos hacer:
total = area(3, 4) + area(5, 2)
areas = [area(b, h) for b, h in dimensiones]
```

> Preferir `return` sobre `print` dentro de las funciones. Una función que devuelve el resultado puede usarse en cualquier contexto. Una que solo imprime, no.

---

## TAMAÑO: MENOS DE 20 LÍNEAS (~45 segundos)

> Si una función supera las 20 líneas, es probable que esté haciendo demasiadas cosas. Es señal de que conviene dividirla.

```python
# ❌ Función enorme — difícil de entender
def generar_reporte(datos):
    # ... 50 líneas de código ...

# ✅ Dividida en partes comprensibles
def calcular_estadisticas(datos): ...
def formatear_tabla(estadisticas): ...
def imprimir_encabezado(): ...
def generar_reporte(datos):
    stats = calcular_estadisticas(datos)
    tabla = formatear_tabla(stats)
    imprimir_encabezado()
    print(tabla)
```

---

## CIERRE (~20 segundos)

> Listo, eso es todo en la serie de Funciones. Seis videos: definición, parámetros, return, scope, args/kwargs y buenas prácticas.
>
> Con esto tienen cubiertos todos los temas de Bloque 1 y Bloque 2. ¡Mucho éxito en el repaso!
>
> ¡Nos vemos!
