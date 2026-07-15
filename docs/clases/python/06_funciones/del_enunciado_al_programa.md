# 🧠 Del enunciado al programa

!!! tip "💻 Clase virtual — hoy se habla más de lo que se tipea"
    Hoy no hay tema nuevo: hoy entrenamos **lo que más cuesta**, que es pasar de un **enunciado en
    castellano** a un **programa**. La consigna del día: **pensamos en voz alta antes de tocar el
    teclado**. 🗣️

!!! info "🎯 Objetivos de la clase"
    Al terminar deberías poder:

    - Leer un enunciado y decir **con tus palabras** qué te piden, sin usar la palabra "código".
    - Identificar **qué datos entran** y **qué resultado sale**, antes de escribir nada.
    - Resolver el problema **a mano** con un ejemplo chico, y detectar los **casos borde**.
    - **Partirlo en funciones** y escribir el **esqueleto** antes de completarlo.

---

## 🧱 El problema: el enunciado no es el programa

Ya sabés escribir `for`, `if`, funciones y diccionarios. Sin embargo, pasa esto:

> Te dan un enunciado nuevo, lo leés… y te quedás mirando la pantalla en blanco. 😶

No es que te falte Python. Lo que falta es el **paso del medio**: entender el problema y **traducirlo**
a algo que se pueda programar. Eso es una habilidad aparte — y **se entrena**, como cualquier otra.

!!! warning "🚧 El error más común"
    Abrir el editor y empezar a tipear apenas terminás de leer. Ahí el problema todavía **no está
    resuelto** — estás intentando resolverlo *y* escribirlo al mismo tiempo, y por eso se traba.

---

## 🗺️ El protocolo (repaso rápido)

Ya lo tenés: son los [5 pasos para encarar un ejercicio](./como_encarar_ejercicios.md). Hoy los usamos
en serio, con problemas nuevos.

| Paso | Pregunta | Qué buscás |
|------|----------|------------|
| 1 | **¿Qué me dan?** | Tipo y forma de los datos de entrada |
| 2 | **¿Qué tengo que devolver / mostrar?** | Tipo del resultado: número, lista, bool, nada |
| 3 | **¿Cómo lo haría a mano?** | La lógica sin Python, con un ejemplo chico |
| 4 | **¿Puedo partir en pasos?** | Lista de acciones en español, una por línea |
| 5 | **Esqueleto primero** | La firma vacía y las variables iniciales |

!!! danger "🔒 La regla de oro de hoy"
    **No se abre el editor hasta terminar el paso 4.** Los pasos 1 a 4 se hacen **hablando** (o en el
    cuaderno). Si no podés explicar qué hace tu función en **una oración sin decir "código"**, todavía
    no entendiste el problema.

---

## 🎮 Los problemas de hoy

Tres enunciados, de menor a mayor. Con cada uno hacemos **lo mismo**: los 5 pasos, en voz alta, entre
todos. El código va **al final**, y casi se escribe solo.

---

### Problema 1 — Asistencia del curso 🌱

En el CFP se toma asistencia en cada clase. Queremos automatizarlo.

**Enunciado.** Tenés la lista de **todos los alumnos** del curso y la lista de los que **vinieron hoy**.
Escribí una función que devuelva **cuántos vinieron**, **cuántos faltaron** y el **porcentaje de
asistencia**.

```python
alumnos   = ["Ana", "Beto", "Cami", "Dante", "Eli"]
vinieron  = ["Ana", "Cami", "Eli"]

# Resultado esperado:
# Vinieron: 3 | Faltaron: 2 | Asistencia: 60.0%
```

!!! note "🗣️ Hagamos los pasos 1 a 4 juntos"
    Antes de mirar nada: ¿qué te dan? ¿qué devolvés? Y sobre todo: **¿cómo lo harías a mano** con
    esas 5 personas?

??? tip "💡 Pista"
    - Paso 3: si tuvieras la lista en papel, ¿qué harías para saber **quién faltó**? ¿Los tachás? ¿Qué
      operación es "los que están en una lista **pero no** en la otra"?
    - ¿Qué colección vimos que sirve justo para **comparar conjuntos** de cosas?
    - El porcentaje sale de una división… ¿entre qué y qué?

??? tip "🧨 Casos borde (pensalos antes de codear)"
    - ¿Y si **no vino nadie**? ¿Y si **vinieron todos**?
    - ¿Y si la lista de alumnos está **vacía**? (¿qué pasa con la división?)
    - ¿Y si en `vinieron` aparece alguien que **no está** en `alumnos`?

??? success "✅ Solución"
    ```python
    def resumen_asistencia(alumnos, vinieron):
        presentes = set(alumnos) & set(vinieron)   # los que están en las dos
        ausentes  = set(alumnos) - set(vinieron)   # están en alumnos, pero no vinieron

        if not alumnos:
            return 0, 0, 0.0                       # sin alumnos no hay división posible

        porcentaje = len(presentes) / len(alumnos) * 100
        return len(presentes), len(ausentes), porcentaje


    alumnos  = ["Ana", "Beto", "Cami", "Dante", "Eli"]
    vinieron = ["Ana", "Cami", "Eli"]

    p, a, pct = resumen_asistencia(alumnos, vinieron)
    print(f"Vinieron: {p} | Faltaron: {a} | Asistencia: {pct}%")
    ```

    Fijate que los **sets** hicieron casi todo el trabajo: `&` (los que están en ambas) y `-` (los que
    están en una y no en la otra). Elegir bien la colección **es** resolver medio problema.

!!! success "🌱 Ojo con esto"
    Acabás de escribir el corazón del **Sistema de Asistencias**, el primer proyecto del curso. Sí:
    ese proyecto arranca justo acá. 😉

---

### Problema 2 — La tabla de posiciones del Mundial ⚽ 🌿

*El plato fuerte del día.*

**Enunciado.** Te dan la lista de **partidos jugados**. Cada partido es una tupla:
`(equipo_A, goles_A, equipo_B, goles_B)`. Armá la **tabla de posiciones**, ordenada de mejor a peor.

Una tabla de posiciones tiene **una fila por equipo** y estas columnas (son las siglas que ves en
cualquier tabla del Mundial):

| Sigla | Qué es | Cómo se calcula |
|-------|--------|-----------------|
| **PJ** | **P**artidos **J**ugados | cuántos partidos jugó ese equipo |
| **GF** | **G**oles a **F**avor | los goles que **hizo** (sumando todos sus partidos) |
| **GC** | **G**oles en **C**ontra | los goles que le **hicieron** |
| **DG** | **D**iferencia de **G**ol | **GF − GC** (puede ser negativa) |
| **Pts** | Puntos | **ganar = 3**, **empatar = 1**, **perder = 0** |

!!! example "🧮 Veamos una fila a mano: Argentina"
    Argentina jugó **2** partidos: le ganó **3 a 0** a México y empató **1 a 1** con Francia.

    - **PJ** = 2 → jugó dos
    - **GF** = 3 + 1 = **4** → los goles que hizo en total
    - **GC** = 0 + 1 = **1** → los que le hicieron en total
    - **DG** = 4 − 1 = **+3**
    - **Pts** = 3 (ganó) + 1 (empató) = **4**

    Y esa es, justamente, la primera fila de la tabla de abajo. **Hacé lo mismo con Francia y México
    en tu cuaderno** antes de seguir: eso es el **paso 3** del protocolo. ✍️

```python
partidos = [
    ("Argentina", 3, "México",   0),
    ("Argentina", 1, "Francia",  1),
    ("Francia",   3, "México",   1),
]

# Resultado esperado:
# Equipo       PJ  GF  GC  DG  Pts
# Argentina     2   4   1  +3    4
# Francia       2   4   2  +2    4
# México        2   1   6  -5    0
```

!!! note "🗣️ Pasos 1 a 4, en voz alta"
    Este es más grande, así que el paso **3** vale doble: agarrá papel y **calculá la tabla a mano**
    con esos 3 partidos. Recién cuando te dé igual que el ejemplo, seguimos.

??? tip "💡 Pista — el modelado (paso 1 y 3)"
    - La entrada es una **lista de partidos**, pero la salida es **una fila por equipo**. O sea: tenés
      que **dar vuelta** la información. ¿Qué colección te deja guardar datos **por nombre de equipo**?
    - Cada equipo necesita **varios números** (PJ, GF, GC, Pts). ¿Cómo guardás varios datos juntos
      para cada equipo?
    - Cuando aparece un equipo **por primera vez**, ¿qué tiene que pasar antes de sumarle algo?
    - **Cada partido toca a DOS equipos.** Lo que le pasa a uno es el espejo de lo que le pasa al otro.

??? tip "🧨 Casos borde (pensalos antes de codear)"
    - **Empate**: ¿cuántos puntos suma cada uno? ¿Y si el partido es 0 a 0?
    - **Equipo nuevo**: aparece por primera vez en el 3er partido. ¿Explota tu código?
    - **DG negativo**: ¿se muestra bien el signo?
    - **Empate en puntos** (mirá el ejemplo: Argentina y Francia tienen 4): ¿quién va primero? Hay que
      **elegir un criterio de desempate**.

!!! info "🔧 Herramienta nueva: `sorted(..., key=...)`"
    Ya usaste `sorted(lista)` para ordenar números o nombres. Cuando la lista tiene cosas más
    complejas (como equipos con varios datos), hay que decirle a Python **por qué valor** ordenar. Eso
    se hace con `key`:

    ```python
    equipos = [("Argentina", 4), ("México", 0), ("Francia", 4)]

    # ordenar por el número (posición 1 de la tupla), de mayor a menor
    print(sorted(equipos, key=lambda e: e[1], reverse=True))
    # [('Argentina', 4), ('Francia', 4), ('México', 0)]
    ```

    - `key=` recibe una función que, dado un elemento, devuelve **el valor por el que se ordena**.
    - `lambda e: e[1]` es una función corta y sin nombre: "dado `e`, usá `e[1]`".
    - `reverse=True` ordena de **mayor a menor**.

    **Para desempatar**, devolvé una **tupla**: Python compara el primer valor y, si empatan, pasa al
    segundo. `key=lambda e: (e["pts"], e["dg"])` = "por puntos y, si empatan, por diferencia de gol".

??? success "✅ Solución"
    ```python
    def tabla_de_posiciones(partidos):
        tabla = {}   # nombre del equipo -> sus números

        def asegurar(equipo):
            # Si el equipo no estaba, lo creamos en cero.
            if equipo not in tabla:
                tabla[equipo] = {"pj": 0, "gf": 0, "gc": 0, "pts": 0}

        for local, goles_local, visitante, goles_visitante in partidos:
            asegurar(local)
            asegurar(visitante)

            # Lo que le pasa a uno es el espejo del otro
            tabla[local]["pj"] += 1
            tabla[local]["gf"] += goles_local
            tabla[local]["gc"] += goles_visitante

            tabla[visitante]["pj"] += 1
            tabla[visitante]["gf"] += goles_visitante
            tabla[visitante]["gc"] += goles_local

            if goles_local > goles_visitante:
                tabla[local]["pts"] += 3
            elif goles_visitante > goles_local:
                tabla[visitante]["pts"] += 3
            else:
                tabla[local]["pts"] += 1
                tabla[visitante]["pts"] += 1

        return tabla


    def mostrar_tabla(tabla):
        # Pasamos el dict a una lista de filas para poder ordenarla
        filas = []
        for equipo, d in tabla.items():
            dg = d["gf"] - d["gc"]
            filas.append((equipo, d["pj"], d["gf"], d["gc"], dg, d["pts"]))

        # Desempate: primero puntos, después diferencia de gol, después goles a favor
        filas.sort(key=lambda f: (f[5], f[4], f[2]), reverse=True)

        print(f"{'Equipo':<12}{'PJ':>3}{'GF':>4}{'GC':>4}{'DG':>4}{'Pts':>5}")
        for equipo, pj, gf, gc, dg, pts in filas:
            print(f"{equipo:<12}{pj:>3}{gf:>4}{gc:>4}{dg:>+4}{pts:>5}")


    partidos = [
        ("Argentina", 3, "México",  0),
        ("Argentina", 1, "Francia", 1),
        ("Francia",   3, "México",  1),
    ]

    mostrar_tabla(tabla_de_posiciones(partidos))
    ```

    Dos ideas para quedarse:

    - **Un dict por equipo** dio vuelta la información: de "lista de partidos" a "fila por equipo".
    - La función `asegurar()` resuelve el caso borde del **equipo nuevo** de una vez y para siempre.
      Ese es el premio de haber pensado los casos borde **antes**.

---

### Problema 3 — La tabla que sobrevive 🌿

!!! note "⏳ Si el tiempo apura, este queda de tarea"
    El importante de hoy es el 2. Este es el broche.

**Enunciado.** La tabla está buenísima… pero se borra al cerrar el programa (te suena, ¿no? 😉).
Guardala en un archivo `tabla.txt` y escribí también la función que la **vuelve a leer** y la muestra,
sin recalcular nada.

```python
guardar_tabla(tabla, "tabla.txt")
# ... cerrás el programa, lo abrís de nuevo ...
mostrar_desde_archivo("tabla.txt")
# Equipo       PJ  GF  GC  DG  Pts
# Argentina     2   4   1  +3    4
# ...
```

??? tip "💡 Pista"
    - Ya sabés escribir y leer archivos (`with open(...)`, `"w"`, `"r"`, `encoding="utf-8"`).
    - Para **leer de vuelta** los números, ¿qué problema tenés? Todo lo que sale de un archivo es
      **texto**. ¿Cómo separás los campos de cada línea? ¿Qué formato le darías al guardar para que
      después sea fácil de partir?
    - No busques la solución perfecta: elegí **un separador** y sé consistente.

??? success "✅ Solución"
    ```python
    def guardar_tabla(tabla, ruta):
        with open(ruta, "w", encoding="utf-8") as f:
            for equipo, d in tabla.items():
                # un separador simple y consistente: la coma
                f.write(f"{equipo},{d['pj']},{d['gf']},{d['gc']},{d['pts']}\n")


    def mostrar_desde_archivo(ruta):
        filas = []
        with open(ruta, "r", encoding="utf-8") as f:
            for linea in f:
                equipo, pj, gf, gc, pts = linea.strip().split(",")
                # ¡ojo! todo vino como texto: hay que convertir
                pj, gf, gc, pts = int(pj), int(gf), int(gc), int(pts)
                filas.append((equipo, pj, gf, gc, gf - gc, pts))

        filas.sort(key=lambda f: (f[5], f[4], f[2]), reverse=True)
        print(f"{'Equipo':<12}{'PJ':>3}{'GF':>4}{'GC':>4}{'DG':>4}{'Pts':>5}")
        for equipo, pj, gf, gc, dg, pts in filas:
            print(f"{equipo:<12}{pj:>3}{gf:>4}{gc:>4}{dg:>+4}{pts:>5}")
    ```

!!! tip "🔮 Lo que viene"
    ¿Te resultó incómodo inventar un formato, partir por comas y convertir todo a `int` a mano? Muy
    bien: **esa incomodidad tiene nombre y tiene solución**. Se llama **JSON**, y es la próxima clase.

---

## 📌 Para llevar

- El cuello de botella casi nunca es Python: es **entender y traducir** el problema.
- **Pasos 1 a 4 sin teclado.** Si no lo podés hacer a mano con 3 datos, no lo vas a poder programar.
- **Elegir bien la colección** (lista, set, dict) es la mitad del problema resuelto.
- Los **casos borde** pensados antes se convierten en funciones limpias después.
- `sorted(..., key=lambda x: ...)` ordena por lo que vos quieras; con una **tupla** en la `key`,
  desempatás.

!!! success "🏠 Tarea"
    Terminá de codear la **tabla del Mundial**, guardala en tu carpeta del curso y **subila a GitHub**
    (`add` → `commit` → `push`). En un solo ejercicio juntás **lógica + archivos + Git**. 💪

## [⬅️ Anterior: Manejo de archivos](../07_persistencia/archivos.md)
## [📚 Índice](../../clases.md#colecciones)
## [➡️ Siguiente: JSON](../07_persistencia/json.md)
