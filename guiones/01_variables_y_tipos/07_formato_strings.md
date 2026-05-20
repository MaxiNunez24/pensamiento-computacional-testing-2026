# Video 7 — Formato de strings y f-strings

**Serie:** Variables y Tipos de Datos
**Duración estimada:** ~6 minutos

---

## INTRO (~30 segundos)

*(Abrir un archivo Python vacío en el editor)*

> Hola! Ya sabemos usar f-strings para combinar variables con texto. En este video vemos cómo controlar **cómo se muestra** cada valor: cuánto espacio ocupa, si va alineado a la izquierda o derecha, y cuántos decimales mostrar.
>
> Esto es especialmente útil cuando queremos mostrar datos en forma de tabla.

---

## LA SINTAXIS DE FORMATO (~1 minuto)

> Dentro de las llaves de una f-string, después de los dos puntos, podemos escribir una especificación de formato:

*(Escribir en el editor:)*

```python
f"{valor:formato}"
```

> Es opcional: si no ponemos nada, Python elige el formato por defecto. Pero cuando lo necesitamos, nos da un control muy preciso.

---

## ALINEACIÓN Y ANCHO (~2 minutos)

> Con tres símbolos controlamos la alineación, y con un número controlamos el ancho total del campo:

*(Escribir:)*

```python
texto = "Python"

print(f"{texto:<10}")   # "Python    "
print(f"{texto:>10}")   # "    Python"
print(f"{texto:^10}")   # "  Python  "
```

> `<` alinea a la izquierda, `>` a la derecha, `^` centra. El `10` es el ancho total: Python tiene 6 caracteres, así que Python rellena con 4 espacios para llegar a 10.

*(Mostrar con un borde para que se vea el ancho:)*

```python
print(f"|{texto:<10}|")   # |Python    |
print(f"|{texto:>10}|")   # |    Python|
print(f"|{texto:^10}|")   # |  Python  |
```

> Los pipes nos ayudan a ver exactamente cuánto espacio ocupa cada campo.

---

## DECIMALES (~1 minuto)

> Para números decimales usamos `.Nf` donde `N` es cuántos decimales queremos mostrar:

*(Escribir:)*

```python
pi = 3.14159265

print(f"{pi:.2f}")   # 3.14
print(f"{pi:.4f}")   # 3.1416
print(f"{pi:.0f}")   # 3
```

> También podemos combinar ancho y decimales:

```python
nota = 9.5
print(f"{nota:8.2f}")   # "    9.50"  ← ancho 8, 2 decimales
```

---

## ANCHO CON VARIABLE (~1 minuto)

> En vez de escribir el número fijo, podemos usar una variable como ancho. Las llaves internas se reemplazan por el valor de la variable:

*(Escribir:)*

```python
ancho = 15
nombre = "Beto"
nota   = 7.5

print(f"{nombre:<{ancho}} {nota:>{ancho}.2f}")
# "Beto               7.50"
```

> Esto es muy útil cuando no sabemos de antemano qué ancho va a tener la tabla, o cuando lo queremos configurable.

---

## EJEMPLO COMPLETO: TABLA (~1 minuto)

*(Escribir el ejemplo final:)*

```python
alumnos = [("Ana", 9.5), ("Beto", 6.0), ("Cami", 8.75), ("Dante", 4.0)]
ancho = 12

print(f"{'Nombre':<{ancho}} {'Nota':>{ancho}}")
print("-" * (ancho * 2 + 1))

for nombre, nota in alumnos:
    print(f"{nombre:<{ancho}} {nota:>{ancho}.2f}")
```

```
Nombre            Nota
-------------------------
Ana               9.50
Beto              6.00
Cami              8.75
Dante             4.00
```

> Con pocas líneas tenemos una tabla perfectamente alineada. Este mismo patrón lo van a ver en ejercicios más adelante.

---

## CIERRE (~30 segundos)

> Eso es el formato de f-strings. No necesitan memorizarlo todo: con `<`, `>` para alinear y `.2f` para decimales ya cubren el 90% de los casos.
>
> Con este video cerramos la serie de Variables y Tipos de Datos. En la próxima serie arrancamos con las **estructuras de control**: `if`, `elif` y `else`.
>
> ¡Nos vemos!
