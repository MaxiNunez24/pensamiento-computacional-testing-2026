# Video 2 — Funciones: parámetros y argumentos

**Serie:** Funciones
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

*(Abrir archivo Python en el editor)*

> Hola! En este video vemos los **parámetros y argumentos**: cómo pasarle datos a una función y las distintas formas de hacerlo.

---

## PARÁMETROS VS ARGUMENTOS (~1 minuto)

```python
def saludar(nombre):       # 'nombre' es el PARÁMETRO
    print(f"Hola, {nombre}!")

saludar("Maxi")            # "Maxi" es el ARGUMENTO
```

> Terminología:
> - **Parámetro**: la variable que aparece en la **definición**. Es un "hueco" con nombre que espera un valor.
> - **Argumento**: el valor concreto que pasamos al **llamar** la función. Rellena el hueco.

---

## MÚLTIPLES PARÁMETROS (~1 minuto)

```python
def presentar(nombre, edad, ciudad):
    return f"Soy {nombre}, tengo {edad} años y vivo en {ciudad}."

print(presentar("Maxi", 27, "Ensenada"))
print(presentar("Ana",  20, "La Plata"))
```

> Los argumentos se asignan a los parámetros **en orden**. El primero va al primer parámetro, el segundo al segundo, y así.

---

## VALORES POR DEFECTO (~1.5 minutos)

> Podemos darle a un parámetro un valor por defecto que se usa cuando no se pasa ese argumento:

```python
def saludar(nombre, saludo="Hola"):
    return f"{saludo}, {nombre}!"

print(saludar("Maxi"))                 # "Hola, Maxi!"    ← usa el default
print(saludar("Ana", "Buenos días"))   # "Buenos días, Ana!" ← usa el argumento
```

> ⚠️ Los parámetros con default deben ir **al final**:

```python
# ✅ Correcto: los sin default primero
def conectar(host, puerto=8080, seguro=True):
    ...

# ❌ SyntaxError: el sin default no puede ir después de uno con default
def conectar(host="localhost", puerto):
    ...
```

---

## ARGUMENTOS POR NOMBRE (KEYWORD ARGUMENTS) (~1.5 minutos)

> Al llamar una función, podemos especificar **a qué parámetro va** cada argumento usando su nombre. El orden deja de importar.

```python
def crear_usuario(nombre, edad, ciudad, activo=True):
    return {"nombre": nombre, "edad": edad, "ciudad": ciudad, "activo": activo}

# Posicional (orden importa)
u1 = crear_usuario("Maxi", 27, "Ensenada")

# Por nombre (orden no importa)
u2 = crear_usuario(ciudad="La Plata", nombre="Ana", edad=20)

# Mezcla: posicionales primero, por nombre después
u3 = crear_usuario("Beto", 25, ciudad="Mar del Plata", activo=False)
```

> Los argumentos por nombre hacen el código más legible, especialmente cuando la función tiene muchos parámetros o varios con default. `conectar(seguro=False)` es más claro que `conectar("localhost", 8080, False)`.

---

## CIERRE (~20 segundos)

> En el próximo video vemos el **return**: cómo las funciones devuelven resultados y la diferencia entre `print` y `return`.
>
> ¡Nos vemos!
