# Video 1 — if, elif y else: tomar decisiones

**Serie:** Estructuras de Control
**Duración estimada:** ~5 minutos

---

## INTRO (~30 segundos)

*(Abrir un archivo Python vacío en el editor)*

> Hola! Hasta ahora nuestros programas ejecutaban todo de arriba hacia abajo, línea por línea. En este video aprendemos a que el programa **tome decisiones**: ejecutar un bloque de código solo si se cumple una condición.

---

## EL IF BÁSICO (~1.5 minutos)

*(Escribir en el editor:)*

```python
nota = 7

if nota >= 6:
    print("Aprobado")
```

> Este es un `if`. Funciona así: evaluamos la condición `nota >= 6`. Si es `True`, se ejecuta el bloque indentado. Si es `False`, no pasa nada y el programa continúa.

> La **indentación** es obligatoria en Python. Todo lo que depende del `if` debe estar sangrado con 4 espacios o un tab. Si nos olvidamos, Python lanza un error.

*(Mostrar el error:)*

```python
if nota >= 6:
print("Aprobado")   # ❌ IndentationError
```

> Otro error clásico: olvidar los dos puntos al final del `if`:

```python
if nota >= 6   # ❌ SyntaxError — faltan los ':'
    print("Aprobado")
```

> Y el más frecuente de todos: usar `=` (asignación) en lugar de `==` (comparación):

```python
if nota = 6:   # ❌ SyntaxError
```

---

## IF / ELSE (~1 minuto)

> ¿Qué pasa si la condición es falsa? Usamos `else` para el caso alternativo.

```python
nota = 4

if nota >= 6:
    print("Aprobado")
else:
    print("Desaprobado")
```

> Con `if/else` siempre se ejecuta exactamente uno de los dos bloques. Si la condición es verdadera, entra al `if`. Si es falsa, entra al `else`. Nunca los dos, nunca ninguno.

---

## IF / ELIF / ELSE (~1.5 minutos)

> Cuando tenemos más de dos casos posibles, usamos `elif` (abreviatura de "else if"):

```python
nota = 8

if nota >= 9:
    print("Excelente")
elif nota >= 7:
    print("Muy bien")
elif nota >= 6:
    print("Aprobado")
else:
    print("Desaprobado")
```

> Python evalúa de arriba hacia abajo y ejecuta el primer bloque cuya condición sea verdadera. El resto los ignora. Si ninguna condición es verdadera, ejecuta el `else`.
>
> Esto significa que el orden importa. Si pusieramos `nota >= 6` primero, una nota de 9 entraría ahí y nunca llegaríamos a "Excelente".

---

## CONDICIONES COMPUESTAS (~45 segundos)

> Podemos combinar condiciones con `and`, `or` y `not`:

```python
edad      = 20
tiene_dni = True

if edad >= 18 and tiene_dni:
    print("Puede votar")

temperatura = 35
llueve      = False

if temperatura > 30 or llueve:
    print("Cuidado con el clima")
```

> `and` requiere que ambas condiciones sean verdaderas. `or` requiere que al menos una lo sea.

---

## CIERRE (~30 segundos)

> Perfecto. Con `if`, `elif` y `else` el programa puede tomar decisiones — ejecutar distintos bloques según las condiciones que se cumplan.
>
> En el próximo video vemos `while`: cómo repetir acciones automáticamente.
>
> ¡Nos vemos!
