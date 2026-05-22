# Video 5 — La función `print()`

**Serie:** Variables y Tipos de Datos
**Duración estimada:** ~5 minutos

---

## INTRO (~30 segundos)

*(Abrir un archivo Python vacío en el editor)*

> Hola! En este video vemos la función `print()`: la primera herramienta que usamos en Python para mostrar información en pantalla.
>
> Ya la venimos usando hace rato, pero hoy la miramos con más detalle para sacarle todo el jugo.

---

## ¿QUÉ HACE `print()`? (~1 minuto)

> `print()` toma uno o más valores y los muestra en la terminal. Es la forma más básica de comunicación entre el programa y quien lo usa.

*(Escribir en el editor:)*

```python
print("Hola Mundo!")
print(42)
print(3.14)
print(True)
```

> Podemos pasarle texto, números enteros, decimales, booleanos — cualquier tipo de dato. Siempre lo muestra en la terminal y baja una línea al final.

---

## MÚLTIPLES VALORES (~1 minuto)

> `print()` puede recibir varios valores separados por coma. Los muestra uno al lado del otro, separados por un espacio.

*(Escribir:)*

```python
nombre = "Ana"
edad   = 20

print("Nombre:", nombre, "— Edad:", edad)
# Nombre: Ana — Edad: 20
```

> Cada valor va separado por coma. El resultado sale todo en una misma línea.

---

## EL PARÁMETRO `sep` (~1 minuto)

> Por defecto los valores se separan con un espacio. Pero podemos cambiar eso con el parámetro `sep`.

*(Escribir:)*

```python
print("2026", "05", "19", sep="-")
# 2026-05-19

print("Python", "Java", "C++", sep=" | ")
# Python | Java | C++

print("a", "b", "c", sep="")
# abc
```

> `sep` define qué va entre cada valor. Puede ser cualquier texto, incluso vacío.

---

## EL PARÁMETRO `end` (~1 minuto)

> Al terminar, `print()` siempre agrega un salto de línea. Con `end` podemos cambiar eso.

*(Escribir:)*

```python
print("Cargando", end="")
print("... Listo!")
# Cargando... Listo!
```

```python
print("uno", end=" — ")
print("dos", end=" — ")
print("tres")
# uno — dos — tres
```

> Usando `end` podemos controlar que varios `print()` queden en la misma línea.

---

## F-STRINGS: COMBINAR TEXTO Y VARIABLES (~1 minuto)

> La forma más cómoda de mostrar variables junto con texto son las **f-strings**. Se escriben con una `f` antes de las comillas, y las variables van entre llaves.

*(Escribir:)*

```python
nombre = "Maxi"
edad   = 27

print(f"Hola {nombre}, tenés {edad} años.")
# Hola Maxi, tenés 27 años.
```

> Cualquier expresión Python puede ir entre las llaves, no solo variables:

```python
a = 10
b = 3
print(f"{a} dividido {b} es {a / b:.2f}")
# 10 dividido 3 es 3.33
```

---

## CIERRE (~30 segundos)

> Eso es `print()`. Parece simple, pero `sep`, `end` y las f-strings le dan bastante flexibilidad para mostrar datos exactamente como queremos.
>
> En el próximo video vemos `input()`: el complemento de `print()`, que nos permite leer datos ingresados por el usuario.
>
> ¡Nos vemos!
