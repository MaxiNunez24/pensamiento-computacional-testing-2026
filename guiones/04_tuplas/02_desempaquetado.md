# Video 2 — Tuplas: desempaquetado (la feature estrella)

**Serie:** Tuplas
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos la razón principal por la que las tuplas son tan usadas en Python: el **desempaquetado** — asignar los elementos de una tupla a múltiples variables en una sola línea.

---

## DESEMPAQUETADO BÁSICO (~1.5 minutos)

```python
# Sin desempaquetado
punto = (10, 20)
x = punto[0]
y = punto[1]

# Con desempaquetado — una sola línea
x, y = punto
print(x, y)   # 10 20
```

> En lugar de acceder por índice uno por uno, asignamos todos los valores de una vez. Python "abre" la tupla y asigna cada elemento a la variable correspondiente en orden.

*(El truco más mágico: intercambio de variables)*

```python
a = 1
b = 2

# En otros lenguajes necesitaríamos una variable temporal:
# temp = a
# a = b
# b = temp

# En Python, con desempaquetado:
a, b = b, a
print(a, b)   # 2 1
```

> Python crea la tupla `(b, a)` y la desempaqueta en `a, b`. Es la forma pythónica de intercambiar variables — sin variable temporal, en una sola línea.

---

## EN BUCLES FOR (~1.5 minutos)

> El desempaquetado brilla cuando recorremos una lista de tuplas:

```python
alumnos = [
    ("Ana", 9),
    ("Beto", 6),
    ("Cami", 8)
]

for nombre, nota in alumnos:
    print(f"{nombre}: {nota}")
# Ana: 9
# Beto: 6
# Cami: 8
```

> En lugar de `alumno[0]` y `alumno[1]`, desempaquetamos directamente en el `for`. Mucho más legible.

```python
# enumerate() usa desempaquetado por detrás
for i, fruta in enumerate(["manzana", "banana", "naranja"]):
    print(f"{i}: {fruta}")

# zip() también
nombres = ["Ana", "Beto"]
notas   = [9, 6]
for nombre, nota in zip(nombres, notas):
    print(f"{nombre}: {nota}")
```

---

## FUNCIONES QUE DEVUELVEN MÚLTIPLES VALORES (~1 minuto)

> Una función puede "devolver varias cosas" usando una tupla:

```python
def estadisticas(numeros):
    return min(numeros), max(numeros), sum(numeros) / len(numeros)

minimo, maximo, promedio = estadisticas([3, 7, 2, 9, 4])
print(f"Min: {minimo}, Max: {maximo}, Promedio: {promedio:.2f}")
# Min: 2, Max: 9, Promedio: 5.00
```

> La función devuelve una tupla de tres valores. El llamador la desempaqueta en tres variables. Es la forma estándar en Python para funciones que necesitan devolver más de un resultado.

---

## CIERRE (~20 segundos)

> El desempaquetado es una de las razones por las que Python es tan expresivo. Lo van a ver y usar constantemente.
>
> En el próximo video vemos los **métodos** de las tuplas y cuándo conviene usarlas.
>
> ¡Nos vemos!
