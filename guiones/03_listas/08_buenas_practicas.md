# Video 8 — Listas: buenas prácticas y cuándo usarlas

**Serie:** Listas
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este último video de la serie de Listas vemos las **buenas prácticas**: qué hacer, qué evitar, y cuándo elegir una lista por sobre otras colecciones.

---

## BUENOS NOMBRES (~1 minuto)

> El nombre de una lista debería dejar claro qué contiene:

```python
# ❌ Nombres que no dicen nada
lista1 = ["Ana", "Beto", "Cami"]
x = [10, 20, 30]

# ✅ Nombres descriptivos
nombres_alumnos = ["Ana", "Beto", "Cami"]
temperaturas    = [10, 20, 30]
```

> Los nombres en plural son una buena señal: `alumnos`, `precios`, `errores`. Si el nombre está en singular, probablemente debería ser una variable normal, no una lista.

---

## NO MODIFICAR MIENTRAS RECORRÉS (~1.5 minutos)

> Este es uno de los errores más peligrosos con listas:

```python
# ❌ NUNCA hagas esto
numeros = [1, 2, 3, 4, 5, 6]

for n in numeros:
    if n % 2 == 0:
        numeros.remove(n)

print(numeros)   # [1, 3, 5]... ¿o no?
```

> Cuando modificamos una lista mientras la recorremos con `for`, el iterador se confunde: se saltan elementos. El resultado es impredecible.

```python
# ✅ Solución 1: crear una nueva lista con los que queremos conservar
impares = [n for n in numeros if n % 2 != 0]

# ✅ Solución 2: recorrer una copia
for n in numeros[:]:   # copia con slicing
    if n % 2 == 0:
        numeros.remove(n)
```

---

## COPIAR CORRECTAMENTE (~1 minuto)

> Ya lo vimos en el video de métodos, pero merece repetirse:

```python
# ❌ Esto no copia, crea un alias
lista2 = lista1         # ambas apuntan al mismo objeto

# ✅ Copiar independientemente
lista2 = lista1.copy()
```

> Siempre que necesiten una copia independiente, usen `.copy()`.

---

## CUÁNDO USAR LISTA VS OTRAS COLECCIONES (~1.5 minutos)

> Python tiene varias colecciones. Elegir la correcta hace la diferencia:

```python
# Lista: cuando el ORDEN importa y el contenido puede cambiar
historial_busquedas = ["python", "listas", "for loops"]

# Tupla: cuando el orden importa pero el contenido NO debe cambiar
coordenadas = (35.7, -58.4)

# Set: cuando necesitamos unicidad y no importa el orden
etiquetas_unicas = {"python", "programacion", "back-end"}

# Diccionario: cuando los datos tienen nombre propio
alumno = {"nombre": "Ana", "nota": 9, "ciudad": "La Plata"}
```

> Preguntas para elegir:
> 1. ¿Importa el orden? → si no: set o dict
> 2. ¿Puede cambiar? → si no: tupla
> 3. ¿Necesito acceder por nombre? → diccionario
> 4. Si el orden importa y puede cambiar → **lista**

---

## CIERRE (~20 segundos)

> Listo, eso es todo en la serie de Listas. Ocho videos, ocho temas: creación, slicing, agregar, eliminar, recorrer, métodos, comprehensions y buenas prácticas.
>
> El próximo tema son las **Tuplas**: similares a las listas pero inmutables. ¡Nos vemos!
