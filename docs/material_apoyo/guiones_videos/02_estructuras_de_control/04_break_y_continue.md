# Video 4 — Break y Continue: controlar el flujo de los bucles

**Serie:** Estructuras de Control
**Duración estimada:** ~4 minutos

---

## INTRO (~20 segundos)

*(Abrir un archivo Python vacío en el editor)*

> Hola! En este video vemos dos palabras clave que nos dan más control dentro de los bucles: `break` y `continue`.

---

## BREAK: SALIR DEL BUCLE (~1.5 minutos)

> `break` sale del bucle **inmediatamente**, sin importar si la condición todavía es verdadera.

*(Escribir en el editor:)*

```python
for i in range(10):
    if i == 5:
        break
    print(i)

print("Fin")
```

*(Mostrar salida:)*

```
0
1
2
3
4
Fin
```

> Cuando `i` llega a 5, `break` interrumpe el bucle y el programa salta directamente al código que viene después. Los números del 5 al 9 nunca se imprimen.

*(Caso de uso real:)*

```python
# Buscar el primer número par en una lista
numeros = [3, 7, 4, 9, 2, 6]

for n in numeros:
    if n % 2 == 0:
        print(f"Primer par: {n}")   # Primer par: 4
        break
```

> En este caso, encontramos el primero y no tiene sentido seguir recorriendo. `break` es la herramienta exacta para esto.

---

## CONTINUE: SALTEAR UNA ITERACIÓN (~1.5 minutos)

> `continue` no sale del bucle — **salta el resto de la iteración actual** y vuelve a evaluar la condición para la siguiente.

```python
for i in range(6):
    if i == 3:
        continue
    print(i)
```

*(Mostrar salida:)*

```
0
1
2
4
5
```

> El `3` no se imprime. Cuando `i == 3`, `continue` hace que Python se saltee el `print(i)` y pase directamente a la siguiente iteración.

*(Caso de uso real:)*

```python
# Imprimir solo los números impares
for i in range(1, 11):
    if i % 2 == 0:
        continue      # saltear los pares
    print(i)          # solo llega acá si es impar
```

> Es el equivalente de decir "si este elemento no me interesa, ignoralo y seguí con el siguiente".

---

## BREAK VS CONTINUE: RESUMEN (~30 segundos)

```
break    → sale del bucle por completo
continue → saltea solo la iteración actual y continúa
```

> Funciona igual en `while` que en `for`.

*(Mostrar con while:)*

```python
numero = 0
while numero < 10:
    numero += 1
    if numero % 2 == 0:
        continue          # saltea los pares
    print(numero)         # imprime: 1, 3, 5, 7, 9
```

---

## CIERRE (~20 segundos)

> Listo. `break` para salir antes de tiempo, `continue` para saltear una iteración. Los van a usar bastante, sobre todo `break` para búsquedas y menús interactivos.
>
> En el próximo video arrancamos con las **Listas**, la primera colección de Python.
>
> ¡Nos vemos!
