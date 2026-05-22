# Video 2 — Listas: slicing (rebanar)

**Serie:** Listas
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python con una lista ya definida)*

> Hola! En el video anterior vimos cómo acceder a un elemento por su índice. Hoy vemos **slicing**: cómo obtener una porción de la lista usando la notación de rango.

---

## LA NOTACIÓN DE SLICING (~2 minutos)

*(Escribir en el editor:)*

```python
numeros = [10, 20, 30, 40, 50]
#            0   1   2   3   4
```

> La sintaxis del slicing es `lista[inicio:fin]`. Python devuelve los elementos desde la posición `inicio` hasta `fin - 1`. El elemento en `fin` **no se incluye**.

```python
print(numeros[1:4])   # [20, 30, 40]  — posiciones 1, 2 y 3
print(numeros[0:3])   # [10, 20, 30]  — posiciones 0, 1 y 2
```

> Si omitimos el `inicio`, Python empieza desde el principio:

```python
print(numeros[:3])    # [10, 20, 30]  — los primeros 3
```

> Si omitimos el `fin`, Python llega hasta el final:

```python
print(numeros[2:])    # [30, 40, 50]  — desde la posición 2 en adelante
```

> Si omitimos ambos, obtenemos una **copia completa** de la lista:

```python
print(numeros[:])     # [10, 20, 30, 40, 50]
```

---

## EL PASO (~1 minuto)

> El slicing acepta un tercer parámetro: el **paso** (cuántos elementos saltear entre cada uno).

```python
numeros = [10, 20, 30, 40, 50, 60, 70, 80]

print(numeros[::2])    # [10, 30, 50, 70]  — uno sí, uno no
print(numeros[1::2])   # [20, 40, 60, 80]  — los que están en posiciones impares
```

> Y el truco más conocido: paso `-1` para **invertir** la lista:

```python
print(numeros[::-1])   # [80, 70, 60, 50, 40, 30, 20, 10]
```

> Esta es la forma pythónica de obtener la lista al revés, sin modificar la original.

---

## SLICING CON ÍNDICES NEGATIVOS (~45 segundos)

> Los índices negativos también funcionan en slicing:

```python
letras = ["a", "b", "c", "d", "e"]

print(letras[-3:])    # ['c', 'd', 'e']  — los últimos 3
print(letras[:-2])    # ['a', 'b', 'c']  — todo menos los últimos 2
```

> `letras[-3:]` es muy útil cuando queremos "los últimos N elementos" sin saber cuántos hay en total.

---

## SLICING NO MODIFICA LA ORIGINAL (~30 segundos)

> Una cosa importante: el slicing **siempre devuelve una nueva lista**, no modifica la original.

```python
numeros  = [10, 20, 30, 40, 50]
primeros = numeros[:3]

print(primeros)   # [10, 20, 30]
print(numeros)    # [10, 20, 30, 40, 50] — sin cambios
```

---

## CIERRE (~20 segundos)

> Listo. Slicing es una herramienta muy poderosa para obtener porciones de una lista de forma compacta.
>
> En el próximo video vemos cómo **agregar elementos** a una lista.
>
> ¡Nos vemos!
