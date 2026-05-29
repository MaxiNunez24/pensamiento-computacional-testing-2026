# Video 4 — Operaciones con Strings

**Serie:** Variables y Tipos de Datos
**Duración estimada:** ~6 minutos

---

## INTRO (~30 segundos)

*(Abrir un archivo Python vacío en el editor)*

> Hola! En este video vemos todo lo que podemos hacer con un **String**.
>
> Los Strings parecen simples — solo texto — pero tienen un montón de operaciones y métodos que los vuelven muy poderosos. Vamos a ver los más importantes, incluyendo `.split()` y `.join()`, que van a ver en muchos ejercicios del curso.

---

## CONCATENACIÓN Y REPETICIÓN (~45 segundos)

*(Escribir en el editor:)*

```python
saludo = "Hola" + " " + "Maxi"
print(saludo)      # Hola Maxi

separador = "-" * 20
print(separador)   # --------------------
```

> El operador `+` concatena strings: los pega uno tras otro. El operador `*` repite el string la cantidad de veces indicada. Muy útil para crear líneas decorativas o separadores.

---

## LARGO Y ACCESO POR ÍNDICE (~1 minuto)

```python
nombre = "Python"

print(len(nombre))  # 6 — cantidad de caracteres

print(nombre[0])    # P  — primer carácter (índice 0)
print(nombre[-1])   # n  — último carácter (índice negativo)
print(nombre[0:3])  # Pyt — desde índice 0 hasta el 2 (el 3 no se incluye)
```

> Los Strings se comportan como listas de caracteres. El primer carácter está en el índice `0`. Los índices negativos cuentan desde el final: `-1` es el último, `-2` el anteúltimo, y así.
>
> El **slicing** `[inicio:fin]` devuelve una porción del string. El índice de fin no se incluye.

---

## MAYÚSCULAS, MINÚSCULAS Y LIMPIEZA (~1 minuto)

```python
texto = "  hola mundo  "

print(texto.upper())       # "  HOLA MUNDO  "
print(texto.lower())       # "  hola mundo  "
print(texto.capitalize())  # "  hola mundo  " → solo la primera letra del string
print(texto.title())       # "  Hola Mundo  " → primera letra de cada palabra
print(texto.strip())       # "hola mundo"     → elimina espacios de ambos lados
```

> Estos métodos son muy usados cuando procesamos texto del usuario. Por ejemplo, si el usuario ingresa `"  MAXI  "` y nosotros queremos compararlo, hacemos `.strip().lower()` para normalizar.

*(Mostrar encadenamiento:)*

```python
entrada = "  MAXI  "
normalizado = entrada.strip().lower()
print(normalizado)   # "maxi"
```

> Podemos encadenar métodos: el resultado del primero se usa como entrada del siguiente.

---

## REEMPLAZAR Y BUSCAR (~1 minuto)

```python
frase = "Python es genial"

# replace: reemplaza todas las ocurrencias
print(frase.replace("genial", "increíble"))   # Python es increíble

# find: devuelve la posición donde aparece (o -1 si no está)
print(frase.find("es"))    # 7

# count: cuántas veces aparece
print(frase.count("a"))    # 1

# startswith / endswith
print(frase.startswith("Py"))    # True
print(frase.endswith("ial"))     # True

# in: pertenencia
print("genial" in frase)   # True
print("Java" in frase)     # False
```

> `in` es el operador más simple para verificar si un substring está adentro. `find()` es útil cuando además necesitás saber en qué posición está.

---

## SPLIT Y JOIN (~1.5 minutos)

> Estos dos métodos son muy importantes y los van a ver constantemente en el curso.

*(Escribir:)*

```python
# split: divide el string → genera una lista
frase = "Hola Maxi Perez"
palabras = frase.split(" ")
print(palabras)    # ['Hola', 'Maxi', 'Perez']

# También podemos separar por otro caracter
fecha = "2026-05-18"
partes = fecha.split("-")
print(partes)      # ['2026', '05', '18']
```

> `.split(separador)` divide el string cada vez que encuentra el separador y devuelve una **lista** de partes.

```python
# join: une una lista → genera un string
# ⚠️ join se llama sobre el SEPARADOR, no sobre la lista
nombres = ["Maxi", "Ana", "Luis"]

resultado = ", ".join(nombres)
print(resultado)   # Maxi, Ana, Luis

resultado = " - ".join(nombres)
print(resultado)   # Maxi - Ana - Luis

resultado = "".join(nombres)
print(resultado)   # MaxiAnaLuis
```

> La trampa de `.join()`: se llama sobre la cadena que va a actuar como separador, no sobre la lista. `separador.join(lista)`. Al principio parece raro, pero es así.

*(Mostrar el patrón split + join):*

```python
frase = "hola como estas"
palabras = frase.split(" ")           # ['hola', 'como', 'estas']
en_mayus = [p.upper() for p in palabras]  # ['HOLA', 'COMO', 'ESTAS']
resultado = " ".join(en_mayus)        # 'HOLA COMO ESTAS'
print(resultado)
```

> El patrón de separar, transformar y volver a unir es muy común cuando necesitamos procesar partes de un texto.

---

## CIERRE (~30 segundos)

> Listo. Con estos métodos pueden manipular texto de forma muy completa: limpiar entradas del usuario, buscar, dividir, unir, cambiar mayúsculas.
>
> Los más importantes para recordar: `.strip()`, `.lower()`, `.upper()`, `.split()`, `.join()`, `.replace()` y el operador `in`.
>
> En el próximo video arrancamos con las **estructuras de control**: cómo hacer que el programa tome decisiones.
>
> ¡Nos vemos!
