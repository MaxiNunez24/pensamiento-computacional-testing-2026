# 🎰 Bingo — Ejercicio Integrador

!!! info "🎯 ¿Qué vamos a construir?"
    Un **simulador de Bingo** completo, desde cero. Vamos a pasar por 5 etapas progresivas: empezamos con un cartón como set, y terminamos con un juego multijugador con estadísticas.

    Este ejercicio integra todo lo que vimos en el Bloque 2:

    | Concepto | ¿Dónde aparece? |
    |----------|----------------|
    | **Sets** | El cartón, los números sorteados, la condición de victoria |
    | **Listas** | El historial del sorteo, la lista de jugadores |
    | **Diccionarios** | Los datos de cada jugador (nombre + cartón) |
    | **Tuplas** | El registro de partidas (nombre, cantidad de turnos) |
    | **Funciones** | Cada acción del juego encapsulada y reutilizable |

!!! tip "🧠 Por qué Bingo"
    El Bingo es un ejemplo perfecto de por qué los sets existen: un cartón tiene números **únicos**, verificar si "salió" un número es una **consulta de pertenencia** (`in`), y la condición de victoria es una **operación de subconjunto** (`issubset`). En una lista esto sería mucho más engorroso.

---

## 🗺️ Hoja de ruta

```
Etapa 1 → Generar un cartón                   (set + random)
Etapa 2 → Sortear y verificar                  (funciones + sets)
Etapa 3 → Mostrar el estado del juego          (funciones + formateo)
Etapa 4 → El juego completo (un jugador)       (bucle + integración)
Etapa 5 → Múltiples jugadores                  (listas + dicts)
🌶️ Extra → Estadísticas de partidas           (simulación)
```

---

## Etapa 1 — El cartón

🌱 *Sets + random*

Un cartón de Bingo tiene **15 números únicos** entre el 1 y el 90.

**Tu tarea:**

1. Importá el módulo `random`.
2. Generá un cartón usando `random.sample()` y convertilo a `set`.
3. Imprimí el cartón ordenado para que sea legible.

??? tip "💡 Pista"
    ```python
    import random

    # Pista: random.sample(iterable, k) devuelve k elementos únicos al azar
    # range(1, 91) genera los números del 1 al 90
    ```

??? success "✅ Solución"
    ```python
    import random

    carton = set(random.sample(range(1, 91), 15))

    print("Tu cartón:")
    print(sorted(carton))
    ```

    Probá ejecutarlo varias veces — cada vez obtenés un cartón diferente.

---

## Etapa 2 — Sortear y verificar

🌱🌿 *Funciones + sets*

Ahora necesitamos dos cosas: una función para sortear números (sin repetir) y otra para saber si el jugador ganó.

**Tu tarea:** Escribí estas tres funciones.

```python
def generar_carton(cantidad=15, maximo=90):
    """Genera y devuelve un cartón como set."""
    ...

def sortear_numero(bolillero):
    """
    Recibe el conjunto de números disponibles (bolillero).
    Extrae uno al azar, lo elimina del bolillero y lo devuelve.
    """
    ...

def verificar_ganador(carton, sorteados):
    """
    Devuelve True si todos los números del cartón ya fueron sorteados.
    """
    ...
```

!!! info "🎱 El bolillero"
    El bolillero es el conjunto de números que **todavía no salieron**. Empezamos con todos los números posibles y vamos sacando de ahí. Usar un set nos permite eliminar un número en O(1).

??? tip "💡 Pista — `verificar_ganador`"
    Los sets tienen una operación perfecta para esto: `A.issubset(B)` devuelve `True` si todos los elementos de `A` están en `B`. También podés escribirlo como `A <= B`.

    ```python
    {1, 2, 3}.issubset({1, 2, 3, 4, 5})  # True
    {1, 2, 9}.issubset({1, 2, 3, 4, 5})  # False
    ```

??? tip "💡 Pista — `sortear_numero`"
    `random.choice()` elige un elemento al azar de una secuencia, pero los sets no son secuencias. Podés convertirlo:

    ```python
    numero = random.choice(list(bolillero))
    bolillero.remove(numero)
    return numero
    ```

??? success "✅ Solución"
    ```python
    import random

    def generar_carton(cantidad=15, maximo=90):
        return set(random.sample(range(1, maximo + 1), cantidad))

    def sortear_numero(bolillero):
        numero = random.choice(list(bolillero))
        bolillero.remove(numero)
        return numero

    def verificar_ganador(carton, sorteados):
        return carton.issubset(sorteados)

    # Prueba rápida
    carton   = generar_carton()
    bolillero = set(range(1, 91))
    sorteados = set()

    print("Cartón:", sorted(carton))
    print("¿Ganó?", verificar_ganador(carton, sorteados))  # False

    # Simulamos que "salieron" exactamente los números del cartón
    sorteados = carton.copy()
    print("¿Ganó?", verificar_ganador(carton, sorteados))  # True
    ```

---

## Etapa 3 — Mostrar el estado del juego

🌿 *Funciones + formateo*

No alcanza con saber si ganó: queremos **ver** el cartón con los números marcados y cuántos faltan.

**Tu tarea:** Escribí la función `mostrar_carton`.

```python
def mostrar_carton(carton, sorteados):
    """
    Imprime el cartón mostrando qué números ya salieron (marcados con ✓)
    y cuáles faltan.
    """
    ...
```

La salida debería verse algo así:

```
------------------------------
 5✓  12   23✓  44   67
 8   19✓  31   55✓  73✓
 11   27   38✓  61   88
------------------------------
Marcados: 6 / 15  |  Faltan: 9
```

!!! tip "💡 Sugerencia de diseño"
    No te enrosques demasiado con el formato visual. Lo importante es que se vea **qué números salieron y cuáles no**. Una versión simple con una lista en una línea ya cumple el objetivo.

??? tip "💡 Pista — versión simple"
    ```python
    def mostrar_carton(carton, sorteados):
        marcados = carton & sorteados       # intersección: salieron Y están en el cartón
        pendientes = carton - sorteados     # diferencia: en el cartón pero no salieron

        print("Marcados: ", sorted(marcados))
        print("Pendientes:", sorted(pendientes))
        print(f"{len(marcados)} / {len(carton)} — faltan {len(pendientes)}")
    ```

??? success "✅ Solución"
    ```python
    def mostrar_carton(carton, sorteados):
        marcados  = carton & sorteados
        pendientes = carton - sorteados

        numeros_ordenados = sorted(carton)
        fila = ""
        for num in numeros_ordenados:
            marca = "✓" if num in sorteados else " "
            fila += f"{num:>2}{marca}  "

        print("─" * 40)
        print(fila.strip())
        print("─" * 40)
        print(f"Marcados: {len(marcados)} / {len(carton)}  |  Faltan: {len(pendientes)}")
    ```

---

## Etapa 4 — El juego completo (un jugador)

🌿 *Bucle + integración*

Ahora unimos todo en un juego real: sorteamos números uno a uno hasta que el jugador gane.

**Tu tarea:** Escribí la función `jugar_solitario` que use las funciones anteriores.

```python
def jugar_solitario():
    """
    Simula una partida completa de un jugador.
    Devuelve cuántos números se necesitaron para ganar.
    """
    carton    = generar_carton()
    bolillero = set(range(1, 91))
    sorteados = set()
    turnos    = 0

    print("¡Empieza el juego!")
    mostrar_carton(carton, sorteados)

    while not verificar_ganador(carton, sorteados):
        ...  # ¿Qué va acá?

    print(f"\n🎉 ¡BINGO! Ganaste en {turnos} turnos.")
    return turnos
```

??? tip "💡 Pista"
    Dentro del `while`:

    1. Sorteá un número con `sortear_numero(bolillero)`.
    2. Agregalo a `sorteados`.
    3. Incrementá `turnos`.
    4. Mostrá el número que salió.
    5. Mostrá el cartón actualizado (opcional: solo si el número estaba en el cartón).

??? success "✅ Solución"
    ```python
    def jugar_solitario():
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

    jugar_solitario()
    ```

---

## Etapa 5 — Múltiples jugadores

🌶️ *Listas + dicts*

Un Bingo real tiene varios jugadores. Vamos a representar cada jugador como un diccionario y guardarlos en una lista.

**Tu tarea:** Escribí `jugar_multijugador(nombres)`.

```python
def jugar_multijugador(nombres):
    """
    Recibe una lista de nombres.
    Simula una partida hasta que alguien gane.
    Devuelve el nombre del ganador y cuántos turnos tomó.
    """
    # Creá la lista de jugadores como dicts: {"nombre": ..., "carton": ...}
    jugadores = [...]

    bolillero = set(range(1, 91))
    sorteados = set()
    turnos    = 0

    while True:
        numero = sortear_numero(bolillero)
        sorteados.add(numero)
        turnos += 1
        print(f"Turno {turnos}: salió el {numero}")

        for jugador in jugadores:
            if verificar_ganador(jugador["carton"], sorteados):
                print(f"\n🏆 ¡{jugador['nombre']} ganó en {turnos} turnos!")
                return jugador["nombre"], turnos
```

!!! tip "🧠 Detalle importante"
    ¿Qué pasa si dos jugadores ganan en el mismo turno? En el Bingo real, ambos ganan. ¿Cómo lo modelarías?

??? success "✅ Solución"
    ```python
    def jugar_multijugador(nombres):
        jugadores = [{"nombre": n, "carton": generar_carton()} for n in nombres]

        for j in jugadores:
            print(f"\n🎴 Cartón de {j['nombre']}: {sorted(j['carton'])}")

        bolillero = set(range(1, 91))
        sorteados = set()
        turnos    = 0

        while True:
            numero = sortear_numero(bolillero)
            sorteados.add(numero)
            turnos += 1
            print(f"Turno {turnos}: {numero}")

            ganadores = [j["nombre"] for j in jugadores
                         if verificar_ganador(j["carton"], sorteados)]

            if ganadores:
                if len(ganadores) == 1:
                    print(f"\n🏆 ¡{ganadores[0]} ganó en {turnos} turnos!")
                else:
                    print(f"\n🏆 ¡Empate! Ganaron: {', '.join(ganadores)} en {turnos} turnos!")
                return ganadores, turnos

    ganadores, turnos = jugar_multijugador(["Ana", "Beto", "Cami", "Dante"])
    ```

---

## 🌶️🌶️ Desafío extra — Estadísticas

*Simulación + listas + dicts*

Ahora que tenemos el juego funcionando, podemos responder preguntas interesantes:

**¿Cuántos turnos se necesitan en promedio para ganar al Bingo?**

Escribí una función `simular(partidas)` que:

1. Simule `partidas` partidas de un jugador (sin imprimir nada).
2. Guarde cuántos turnos tardó cada partida en una lista.
3. Al final imprima:
    - El mínimo, máximo y promedio de turnos.
    - Un histograma simple con `*` (cuántas partidas terminaron en cada rango).

```python
def simular(partidas=1000):
    resultados = []

    for _ in range(partidas):
        ...  # jugar sin imprimir, guardar los turnos

    print(f"Partidas simuladas: {partidas}")
    print(f"Mínimo:  {min(resultados)} turnos")
    print(f"Máximo:  {max(resultados)} turnos")
    print(f"Promedio: {sum(resultados) / len(resultados):.1f} turnos")
    # ¿Podés agregar el histograma?
```

??? tip "💡 Pista — versión sin `print` del juego"
    Necesitás una versión "silenciosa" de `jugar_solitario`. Podés agregar un parámetro `silencioso=False` a la función original:

    ```python
    def jugar_solitario(silencioso=False):
        ...
        while not verificar_ganador(carton, sorteados):
            numero = sortear_numero(bolillero)
            sorteados.add(numero)
            turnos += 1
            if not silencioso:
                print(f"Salió el {numero}")
        ...
        return turnos
    ```

    Luego en `simular`: `turnos = jugar_solitario(silencioso=True)`.

??? success "✅ Solución"
    ```python
    def jugar_solitario(silencioso=False):
        carton    = generar_carton()
        bolillero = set(range(1, 91))
        sorteados = set()
        turnos    = 0

        while not verificar_ganador(carton, sorteados):
            numero = sortear_numero(bolillero)
            sorteados.add(numero)
            turnos += 1
            if not silencioso and numero in carton:
                print(f"🎱 Salió el {numero} — ¡está en tu cartón!")
                mostrar_carton(carton, sorteados)

        if not silencioso:
            print(f"\n🎉 ¡BINGO! Ganaste en {turnos} turnos.")
        return turnos


    def simular(partidas=1000):
        resultados = [jugar_solitario(silencioso=True) for _ in range(partidas)]

        minimo  = min(resultados)
        maximo  = max(resultados)
        promedio = sum(resultados) / len(resultados)

        print(f"\n📊 Estadísticas de {partidas} partidas simuladas")
        print(f"  Mínimo:   {minimo} turnos")
        print(f"  Máximo:   {maximo} turnos")
        print(f"  Promedio: {promedio:.1f} turnos")

        # Histograma por rangos de 10
        print("\n  Histograma:")
        rangos = range(10, maximo + 10, 10)
        for limite in rangos:
            desde = limite - 9
            cuenta = sum(1 for r in resultados if desde <= r <= limite)
            barra = "*" * (cuenta * 40 // partidas)
            print(f"  {desde:>3}–{limite:<3} │{barra} {cuenta}")

    simular(1000)
    ```

    ??? info "🤔 ¿Qué resultado esperás?"
        El promedio suele caer entre **55 y 65 turnos**. El mínimo teórico es 15 (que salgan los 15 de tu cartón en los primeros 15). ¿Cuándo viste eso en tus simulaciones?

---

## 📌 Cheatsheet de operaciones de sets usadas en este ejercicio

```python
# Crear un cartón único
carton = set(random.sample(range(1, 91), 15))

# Verificar si un número "cayó" en el cartón
if numero in carton: ...

# Números del cartón que ya salieron (intersección)
marcados = carton & sorteados

# Números del cartón que todavía faltan (diferencia)
pendientes = carton - sorteados

# ¿Ganó? (¿todos los del cartón están en sorteados?)
gano = carton.issubset(sorteados)
gano = carton <= sorteados          # equivalente, más corto
```

---

## 🚀 ¿Y ahora qué viene?

!!! success "🎯 Lo que acabás de construir"
    Sin darte cuenta, construiste un sistema con:

    - **Separación de responsabilidades**: cada función hace una sola cosa.
    - **Estado mutable compartido**: el bolillero y los sorteados se modifican entre turnos.
    - **Abstracción**: `jugar_multijugador` no sabe cómo funciona `verificar_ganador` por dentro.
    - **Simulación**: podés correr mil partidas y sacar estadísticas reales.

    Esto ya es el esqueleto de cómo se construyen sistemas más complejos. En el primer proyecto (Sistema de Asistencias) vamos a usar exactamente esta misma lógica: funciones bien definidas, datos persistidos, menú interactivo.

## [⬅️ Anterior: Funciones II](./funciones_2.md)
## [📚 Índice](../../clases.md#colecciones)
## [➡️ Siguiente: Manejo de archivos](../07_persistencia/archivos.md)
