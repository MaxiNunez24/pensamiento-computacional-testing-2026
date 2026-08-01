# 📦 Anexo: Importar módulos

Hasta ahora cada programa que escribiste vivía en **un solo archivo**. Pero cuando un programa crece
—como el **Bingo**— ese archivo se vuelve largo y difícil de manejar. La solución es **repartir el
código en varios archivos** y que se **llamen entre sí**. Eso es lo que hacés con `import`.

!!! tip "🧩 Ya lo viste en clase"
    En la última clase movimos una función del Bingo (`generar_carton()`) a un archivo aparte
    `bingo.py` y la llamamos desde `main.py`. Este anexo explica **por qué** y **cómo** funciona eso,
    para que lo puedas hacer solo/a.

!!! info "🎯 Objetivos de la clase"
    Al terminar deberías poder:

    - Entender que **cada archivo `.py` es un módulo** que se puede importar.
    - Usar `import modulo` y `from modulo import nombre`.
    - Reconocer que `random`, `os` o `json` se importan **igual** que tu propio código.
    - **Repartir** un programa grande (el Bingo) en varios archivos que se llaman entre sí.

---

## 1. Un módulo es un archivo `.py`

Un **módulo** no es nada raro: es simplemente **un archivo `.py`**. El **nombre del módulo** es el
nombre del archivo **sin la extensión**.

- El archivo `bingo.py` → el módulo se llama `bingo`.
- El archivo `carton.py` → el módulo se llama `carton`.

Cuando un archivo `importa` a otro, **los dos tienen que estar en la misma carpeta** (por ahora; más
adelante vas a ver cómo organizarlos en subcarpetas).

!!! note "💡 La idea de fondo"
    Importar es como decir: *"che, en este archivo quiero usar una función que está escrita en aquel
    otro"*. Python va, la busca, y te la deja lista para usar.

---

## 2. `import modulo`

La forma más básica: `import` seguido del **nombre del módulo** (sin `.py`).

```python
import random

carton = random.sample(range(1, 91), 15)
```

Fijate que para usar algo del módulo escribís `modulo.cosa()`: primero el nombre del módulo, un punto,
y después la función. **Esto ya lo venías haciendo en el Bingo** sin darte cuenta:

```python
import random
import os

random.sample(...)   # función sample, del módulo random
random.choice(...)   # función choice, del módulo random
os.system("clear")   # función system, del módulo os
```

`import random` ES importar un módulo. La única diferencia con tu propio código es que `random` viene
**incluido con Python** y `bingo.py` lo escribís vos.

---

## 3. `from modulo import nombre`

A veces escribir `modulo.cosa()` todo el tiempo es engorroso. Con `from ... import ...` traés
**directamente** lo que necesitás y lo usás **sin el prefijo**:

```python
from random import sample

carton = sample(range(1, 91), 15)   # sin "random." adelante
```

Con tu propio código es igual. Si `generar_carton()` está en `bingo.py`:

```python
from bingo import generar_carton

carton = generar_carton()
```

Podés traer **varias cosas** a la vez separándolas con comas:

```python
from bingo import jugar_individual, jugar_multijugador
```

!!! warning "🚫 Evitá `from modulo import *`"
    `from bingo import *` trae **todo** de golpe. Parece cómodo, pero te llena el archivo de nombres
    que no sabés de dónde salieron y es fácil que se pisen entre sí. Importá **solo lo que vas a
    usar**.

??? note "✨ Bonus: `import ... as` (apodo)"
    Si un nombre es muy largo, podés ponerle un apodo con `as`:

    ```python
    import random as rnd
    rnd.choice([1, 2, 3])
    ```

    Lo vas a ver mucho en librerías de datos (`import pandas as pd`). Por ahora no lo necesitás, pero
    cuando lo veas, ya sabés qué es.

---

## 4. El caso del Bingo: repartir el juego en varios archivos

Esta es la parte importante. El Bingo tiene muchas funciones; meterlas **todas** en un solo `main.py`
lo vuelve un archivo enorme. Mejor lo **repartimos** y dejamos `main.py` lo más **chiquito** posible:
que solo **elija** qué jugar y llame a la función correspondiente.

La estructura que vamos a armar:

```
📁 bingo/
 ├── carton.py   →  generar y mostrar el cartón
 ├── sorteo.py   →  sacar números y verificar al ganador
 ├── bingo.py    →  arma el juego (usa carton.py y sorteo.py)
 └── main.py     →  el menú: solo llama a jugar
```

Fijate la cadena de imports: `main.py` importa de `bingo.py`, y `bingo.py` a su vez importa de
`carton.py` y `sorteo.py`. **Los imports se encadenan.**

=== "carton.py"

    ```python
    import random

    def generar_carton(cantidad=15, maximo=90):
        return set(random.sample(range(1, maximo + 1), cantidad))

    def mostrar_carton(carton, sorteados):
        marcados   = carton & sorteados
        pendientes = carton - sorteados

        fila = ""
        for num in sorted(carton):
            marca = "✓" if num in sorteados else " "
            fila += f"{num:>2}{marca}  "

        print("─" * 40)
        print(fila.strip())
        print("─" * 40)
        print(f"Marcados: {len(marcados)} / {len(carton)}  |  Faltan: {len(pendientes)}")
    ```

=== "sorteo.py"

    ```python
    import random

    def sortear_numero(bolillero):
        numero = random.choice(list(bolillero))
        bolillero.remove(numero)
        return numero

    def verificar_ganador(carton, sorteados):
        return carton.issubset(sorteados)
    ```

=== "bingo.py"

    ```python
    # bingo.py usa funciones que viven en OTROS archivos: las importa.
    from carton import generar_carton, mostrar_carton
    from sorteo import sortear_numero, verificar_ganador

    def jugar_individual():
        carton    = generar_carton()
        bolillero = set(range(1, 91))
        sorteados = set()
        turnos    = 0

        print("¡Empieza el juego!")
        mostrar_carton(carton, sorteados)
        input("\nPresioná Enter para empezar...")

        while not verificar_ganador(carton, sorteados):
            numero = sortear_numero(bolillero)
            sorteados.add(numero)
            turnos += 1
            if numero in carton:
                print(f"\n🎱 Salió el {numero} — ¡está en tu cartón!")
                mostrar_carton(carton, sorteados)
            else:
                print(f"Salió el {numero}.")

        print(f"\n🎉 ¡BINGO! Ganaste en {turnos} turnos.")
        return turnos

    def jugar_multijugador(nombres):
        jugadores = [{"nombre": n, "carton": generar_carton()} for n in nombres]
        bolillero = set(range(1, 91))
        sorteados = set()
        turnos    = 0

        while True:
            numero = sortear_numero(bolillero)
            sorteados.add(numero)
            turnos += 1
            ganadores = [j["nombre"] for j in jugadores
                         if verificar_ganador(j["carton"], sorteados)]
            if ganadores:
                print(f"\n🏆 Ganó/Ganaron: {', '.join(ganadores)} en {turnos} turnos!")
                return ganadores, turnos
    ```

=== "main.py"

    ```python
    # main.py NO sabe cómo funciona el juego por dentro: solo lo ejecuta.
    from bingo import jugar_individual, jugar_multijugador

    print("🎰 BINGO")
    print("1) Un jugador")
    print("2) Varios jugadores")
    opcion = input("Elegí (1/2): ")

    if opcion == "1":
        jugar_individual()
    else:
        jugar_multijugador(["Ana", "Beto", "Cami"])
    ```

!!! tip "👀 Mirá qué corto quedó `main.py`"
    Toda la lógica del juego está repartida en `carton.py`, `sorteo.py` y `bingo.py`. `main.py` solo
    **elige** y **llama**. Si mañana cambia cómo se sortea un número, tocás `sorteo.py` y **nada más**:
    los otros archivos ni se enteran. Eso es lo que ganás al separar el código.

---

## 5. Tu código vs. la librería estándar

`random`, `os`, `json`, `math`… son **módulos que vienen con Python** (la "librería estándar"): no hay
que instalar nada, solo importarlos. Tu `bingo.py` o tu `carton.py` son módulos que **escribís vos**.
Pero para Python **son todos lo mismo**: archivos con código que podés importar.

| | De dónde sale | Cómo se usa |
|---|---|---|
| `import random` | Viene con Python | `random.choice(...)` |
| `import json` | Viene con Python | `json.dumps(...)` |
| `from carton import generar_carton` | Lo escribiste vos | `generar_carton()` |

!!! note "🔭 Para saber más (lo vemos completo más adelante)"
    - **Ojo con importar un archivo que ejecuta código:** si tu `main.py` tiene `print(...)`,
      `input(...)` o el juego al nivel de arriba (sin estar dentro de una función), ese código
      **se ejecuta apenas lo importás**. Para evitarlo se usa una línea especial,
      `if __name__ == "__main__":`, que vamos a ver en su propia clase.
    - **Carpetas y paquetes** (organizar muchos módulos en subcarpetas) y **entornos virtuales**
      (`venv`, para aislar las librerías de cada proyecto) también tienen su clase aparte. Son el
      siguiente escalón cuando tus proyectos crezcan.

---

## 🛠️ Ejercicios

!!! tip "Cómo trabajar"
    Creá los archivos en una misma carpeta y ejecutá siempre el que tiene el menú/uso (`main.py` o el
    que diga la consigna). Acordate: el nombre del módulo es el nombre del archivo **sin** `.py`.

### 🌱 Ejercicio 1 — Tu primer módulo

Creá dos archivos en la misma carpeta:

- `saludos.py`: con una función `saludar(nombre)` que **devuelva** `"¡Hola, <nombre>!"`.
- `main.py`: que **importe** `saludar` desde `saludos` y la use con tu nombre.

??? tip "💡 Pista"
    En `main.py`, la primera línea es `from saludos import saludar`. Después la usás como cualquier
    función: `print(saludar("Ana"))`.

??? success "✅ Solución"
    === "saludos.py"

        ```python
        def saludar(nombre):
            return f"¡Hola, {nombre}!"
        ```

    === "main.py"

        ```python
        from saludos import saludar

        print(saludar("Ana"))
        # ¡Hola, Ana!
        ```

### 🌿 Ejercicio 2 — Repartí el Bingo en módulos

Tomá tu Bingo (el de la clase anterior) y **repartilo** en estos archivos, todos en la misma carpeta:

- `carton.py` → `generar_carton()` y `mostrar_carton()`.
- `sorteo.py` → `sortear_numero()` y `verificar_ganador()`.
- `bingo.py` → **importa** de `carton` y `sorteo`, y define `jugar_individual()` y
  `jugar_multijugador()`.
- `main.py` → **solo** importa `jugar_individual` y `jugar_multijugador` de `bingo` y, según un menú,
  llama a una de las dos.

La meta: que `main.py` no tenga **nada** de la lógica del juego, solo el menú y las llamadas.

??? tip "💡 Pistas"
    - Empezá por `carton.py` y `sorteo.py` (no importan nada tuyo, solo `random`).
    - En `bingo.py`, arriba de todo:
      `from carton import generar_carton, mostrar_carton` y
      `from sorteo import sortear_numero, verificar_ganador`.
    - Ejecutá **`main.py`**. Si Python dice `ModuleNotFoundError: No module named 'carton'`, fijate que
      los archivos estén **en la misma carpeta** y bien escritos los nombres.

??? success "✅ Solución"
    Es exactamente la estructura de la sección 4: mirá las pestañas **carton.py**, **sorteo.py**,
    **bingo.py** y **main.py** de arriba. Esa repartición es la solución del ejercicio.

    La clave es que `main.py` queda así de corto:

    ```python
    from bingo import jugar_individual, jugar_multijugador

    opcion = input("Elegí (1) individual o (2) multijugador: ")
    if opcion == "1":
        jugar_individual()
    else:
        jugar_multijugador(["Ana", "Beto", "Cami"])
    ```

---

!!! success "🎯 Lo que te llevás"
    - Un **módulo** es un archivo `.py`; lo importás por su nombre **sin** `.py`.
    - `import modulo` → usás `modulo.cosa()`. `from modulo import cosa` → usás `cosa()` directo.
    - `random`/`os`/`json` se importan **igual** que tu propio código.
    - Repartir un programa grande en módulos lo hace **más ordenado y fácil de cambiar**: cada archivo
      hace una cosa, y `main.py` solo orquesta.

## [⬅️ Anterior: Bingo](./bingo.md)
## [📚 Índice](../../clases.md#colecciones)
## [➡️ Siguiente: Git y GitHub](../07_persistencia/git_github.md)
