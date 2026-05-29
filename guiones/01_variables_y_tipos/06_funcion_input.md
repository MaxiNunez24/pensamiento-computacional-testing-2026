# Video 6 — La función `input()`

**Serie:** Variables y Tipos de Datos
**Duración estimada:** ~5 minutos

---

## INTRO (~30 segundos)

*(Abrir un archivo Python vacío en el editor)*

> Hola! En este video vemos `input()`: la función que le permite al programa **recibir datos del usuario** mientras se ejecuta.
>
> Con `print()` el programa habla. Con `input()` el programa escucha.

---

## ¿QUÉ HACE `input()`? (~1 minuto)

> `input()` detiene la ejecución del programa, muestra un mensaje opcional, espera a que el usuario escriba algo y presione Enter, y devuelve lo que escribió como un **string**.

*(Escribir en el editor y ejecutar:)*

```python
nombre = input("¿Cuál es tu nombre? ")
print(f"Hola, {nombre}!")
```

> Al ejecutarlo, el programa se pausa y espera. Escribimos nuestro nombre, presionamos Enter, y el programa sigue con ese valor guardado en `nombre`.

---

## SIEMPRE DEVUELVE STRING (~1.5 minutos)

> Este es el punto más importante: **`input()` siempre devuelve texto**, sin importar qué escriba el usuario.

*(Escribir:)*

```python
dato = input("Escribí un número: ")
print(type(dato))   # <class 'str'>
```

> Aunque escribamos `42`, lo que queda en `dato` es el string `"42"`, no el número `42`. Si intentamos operar con él como número, obtenemos un error:

```python
dato = input("Escribí un número: ")
print(dato + 1)   # ❌ TypeError: can only concatenate str (not "int") to str
```

---

## CONVERSIÓN DE TIPOS (~1.5 minutos)

> Para usar el valor ingresado como número hay que **convertirlo** con `int()` o `float()`.

*(Escribir:)*

```python
edad = int(input("¿Cuántos años tenés? "))
print(f"En 10 años vas a tener {edad + 10}.")
```

```python
precio = float(input("Precio del producto: "))
cantidad = int(input("Cantidad: "))
total = precio * cantidad
print(f"Total: ${total:.2f}")
```

> El patrón es siempre el mismo: envolvemos `input()` con `int()` o `float()` para convertir en el momento.

---

## EJEMPLO COMPLETO (~30 segundos)

*(Escribir un mini programa interactivo:)*

```python
nombre = input("Nombre: ")
nota1  = float(input("Nota 1: "))
nota2  = float(input("Nota 2: "))
nota3  = float(input("Nota 3: "))

promedio = (nota1 + nota2 + nota3) / 3
estado   = "Aprobado" if promedio >= 6 else "Desaprobado"

print(f"\n{nombre}: promedio {promedio:.2f} — {estado}")
```

> Un programa simple que lee datos del usuario y produce un resultado. Esto es la base de cualquier programa interactivo.

---

## CIERRE (~30 segundos)

> Eso es `input()`. Recordá siempre: devuelve string, así que si necesitás un número tenés que convertirlo.
>
> En el próximo video vemos cómo **formatear** la salida de las f-strings para controlar alineación, ancho y decimales.
>
> ¡Nos vemos!
