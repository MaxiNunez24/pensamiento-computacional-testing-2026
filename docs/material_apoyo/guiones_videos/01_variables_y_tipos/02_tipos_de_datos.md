# Video 2 — Tipos de datos

**Serie:** Variables y Tipos de Datos
**Duración estimada:** ~5 minutos

---

## INTRO (~30 segundos)

*(Archivo Python abierto en el editor)*

> Hola! En el video anterior vimos qué es una variable. Ahora vemos los **tipos de datos**: qué clase de información puede guardar una variable y por qué importa distinguirlos.

---

## LOS CUATRO TIPOS BÁSICOS (~2 minutos)

> Python tiene cuatro tipos de datos fundamentales que vamos a usar todo el tiempo.

*(Escribir en el editor:)*

```python
# str — texto (string)
nombre = "Maxi"
ciudad = 'Ensenada'   # comillas simples o dobles, da igual

# int — número entero
edad  = 22
anio  = 2026
deuda = -1500

# float — número decimal
altura   = 1.81
promedio = 8.5

# bool — verdadero o falso
es_estudiante = True
aprobo        = False
```

> **str** (de *string*, cadena) almacena texto. Se escribe entre comillas, simples o dobles.
>
> **int** almacena números enteros: sin punto decimal, positivos o negativos.
>
> **float** almacena números con decimales. El punto es el separador decimal, no la coma.
>
> **bool** solo puede valer `True` o `False`. La mayúscula es obligatoria — Python distingue entre `True` y `true`.

*(Mostrar type():)*

```python
print(type(nombre))       # <class 'str'>
print(type(edad))         # <class 'int'>
print(type(altura))       # <class 'float'>
print(type(es_estudiante))# <class 'bool'>
```

> Con `type()` podemos preguntarle a Python qué tipo de dato tiene una variable. Es muy útil para debuggear cuando algo no funciona como esperamos.

---

## NONE: EL VALOR "NADA" (~30 segundos)

```python
resultado = None
print(resultado)       # None
print(type(resultado)) # <class 'NoneType'>
```

> `None` es un tipo especial que representa la ausencia de valor. Es el "nada" de Python. Lo van a ver cuando una función no devuelve nada explícitamente. Lo veremos más en detalle cuando lleguemos a funciones.

---

## CONVERSIÓN DE TIPOS (~1.5 minutos)

> A veces necesitamos convertir un dato de un tipo a otro. Esto se llama **casting**.

*(Mostrar conversiones:)*

```python
# str → int
numero_texto = "42"
numero_int   = int(numero_texto)
print(numero_int + 1)   # 43

# int → str
edad    = 22
mensaje = "Tengo " + str(edad) + " años"
print(mensaje)

# str → float
precio = float("9.99")
print(precio * 2)   # 19.98

# int → float y viceversa
print(float(5))    # 5.0
print(int(3.9))    # 3   ← trunca, NO redondea
```

> `int()`, `float()`, `str()`, `bool()` — cada tipo tiene su función de conversión. Ojo con `int()`: cuando convierte un float, **trunca** (descarta los decimales), no redondea.

*(Mostrar el error clásico:)*

```python
edad = 22
print("Tengo " + edad + " años")   # ❌ TypeError
```

> Este es el error más común al principio: intentar concatenar un string y un número con `+`. Python no hace esa conversión automáticamente. La solución es convertir con `str()` o usar una f-string.

```python
# Forma correcta:
print(f"Tengo {edad} años")        # ✅
print("Tengo " + str(edad) + " años") # ✅
```

---

## CIERRE (~30 segundos)

> Listo. Los tipos de datos son la base: saber qué tipo tiene cada variable evita muchos errores y hace el código más claro.
>
> En el próximo video vemos los **operadores**: cómo hacer cálculos y comparaciones con nuestros datos.
>
> ¡Nos vemos!
