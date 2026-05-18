# Video 3 — For: recorrer secuencias

**Serie:** Estructuras de Control
**Duración estimada:** ~5 minutos

---

## INTRO (~30 segundos)

*(Abrir un archivo Python vacío en el editor)*

> Hola! En este video vemos el bucle `for`. Es distinto al `while`: lo usamos cuando queremos **recorrer una secuencia elemento por elemento**, o cuando sabemos de antemano cuántas veces queremos repetir algo.

---

## FOR CON RANGE() (~2 minutos)

> La forma más básica del `for` usa `range()` para generar una secuencia de números.

*(Escribir en el editor:)*

```python
for i in range(5):
    print(i)
# 0, 1, 2, 3, 4
```

> `range(5)` genera los números del 0 al 4 (cinco números, sin incluir el 5). En cada vuelta, `i` toma el valor del siguiente número.

> `range()` tiene tres formas:

```python
range(5)        # 0, 1, 2, 3, 4         — desde 0, 5 elementos
range(1, 6)     # 1, 2, 3, 4, 5         — desde 1 hasta 5 inclusive
range(0, 11, 2) # 0, 2, 4, 6, 8, 10    — de 2 en 2
range(5, 0, -1) # 5, 4, 3, 2, 1        — cuenta regresiva
```

*(Mostrar ejemplos:)*

```python
# Imprimir del 1 al 5
for i in range(1, 6):
    print(i)

# Solo pares del 0 al 10
for i in range(0, 11, 2):
    print(i)

# Cuenta regresiva
for i in range(5, 0, -1):
    print(i)
print("¡Despegue!")
```

---

## FOR SOBRE STRINGS (~45 segundos)

> Los strings son secuencias de letras, así que también podemos recorrerlos con `for`:

```python
nombre = "Python"

for letra in nombre:
    print(letra)
# P
# y
# t
# h
# o
# n
```

> En cada iteración, `letra` toma el valor de un carácter. Esto funciona porque los strings en Python son **iterables**: colecciones que se pueden recorrer elemento por elemento. Las listas, tuplas y otras colecciones que vamos a ver después también son iterables.

---

## FOR VS WHILE: CUÁNDO USAR CADA UNO (~1 minuto)

> El mismo resultado, dos formas distintas:

```python
# Con while
i = 1
while i <= 5:
    print(i)
    i += 1

# Con for — más compacto y claro
for i in range(1, 6):
    print(i)
```

> La regla general:
>
> - Usá `for` cuando sabés cuántas veces repetir, o cuando querés recorrer una colección.
> - Usá `while` cuando la cantidad de iteraciones depende de algo que puede cambiar de forma impredecible (la respuesta del usuario, un evento externo, etc.).

---

## PATRÓN ACUMULADOR CON FOR (~45 segundos)

```python
suma = 0

for i in range(1, 101):
    suma += i

print(suma)   # 5050
```

> El acumulador con `for` es más limpio que con `while` cuando el rango es conocido. Inicializamos en cero antes del bucle, acumulamos dentro, y usamos el resultado al salir.

---

## CIERRE (~30 segundos)

> Listo. `for` es el bucle que más van a usar para trabajar con colecciones — listas, tuplas, diccionarios. Cuando lleguemos a esas estructuras, el `for` va a ser su herramienta principal.
>
> En el próximo video vemos `break` y `continue`: cómo controlar el flujo dentro de los bucles.
>
> ¡Nos vemos!
