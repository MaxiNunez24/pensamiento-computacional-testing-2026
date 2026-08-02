# 💾 Manejo de archivos en Python

Los programas que hiciste hasta ahora "olvidan" todo cuando los cerrás. Aprender a leer y escribir **archivos** es lo que le da **memoria** a tus programas: la próxima vez que los ejecutés, los datos siguen ahí.

!!! info "🎯 Objetivos de la clase"
    Al terminar la clase deberían poder:

    - Abrir archivos con `open()` en distintos **modos** (lectura, escritura, append).
    - Leer el contenido completo de un archivo o **línea por línea**.
    - Escribir y agregar texto a un archivo.
    - Usar el bloque `with` para trabajar con archivos **de forma segura**.
    - Especificar codificación `utf-8` correctamente.

!!! tip "🗺️ Cómo aprovechamos la clase de hoy (200 min)"
    Es una clase con mucha herramienta nueva. Para que rinda y **la entiendan con práctica**, la damos
    así:

    - **En clase (🔵):** la teoría con ejemplos, armamos juntos el apunte `conceptos.py`, y hacemos los
      **Ejercicios 1 y 3** (los más alineados al proyecto).
    - **Práctica extra (⭐):** los Ejercicios 2, 4 y 5, cortos y autocontenidos. Como **ya vimos Git y
      GitHub**, podés **pushear tu carpeta y seguir practicándolos en casa** (o en cualquier máquina).
      Tienen la solución abajo.

    No hace falta llegar a todo hoy: el ritmo lo marca el grupo. Lo que no entre, queda para practicar. 🙂

---

## 🧠 ¿Por qué guardar en archivos?

Hasta ahora los datos viven en variables — y cuando el programa termina, desaparecen. Los archivos nos permiten **persistir** información entre ejecuciones.

```python
# ❌ Sin archivos: lo que el usuario carga se pierde al cerrar
nombres = []
nombre = input("Nombre a guardar: ")
nombres.append(nombre)
print("Guardados:", nombres)

# Cerrás el programa, lo volvés a abrir... y la lista arranca VACÍA de nuevo.
# Todo lo que escribiste, perdido. 😢

# ✅ Con archivos: lo que el usuario carga SIGUE ahí la próxima vez
# (así funcionan las notas del celu, los contactos, las partidas guardadas...)
```

---

## 🧠 ¿Dónde viven los datos? La jerarquía de memoria

Una computadora guarda datos en **varios niveles**, con un trade-off clave: cuanto **más rápido** es un
nivel, **más chico y caro** es (y arriba de todo, **más volátil**: se borra al apagar). Cuanto **más
abajo**, **más lento pero más grande y permanente**.

<div class="mem-piramide">
<div class="mem-fila"><div class="mem-tec"></div><div class="mem-barra-wrap"><div class="mem-barra" style="width:22%">registros</div></div><div class="mem-tam">&lt; 1 kB</div></div>
<div class="mem-fila"><div class="mem-tec">SRAM</div><div class="mem-barra-wrap"><div class="mem-barra" style="width:34%">L1 caché</div></div><div class="mem-tam">32 – 64 kB</div></div>
<div class="mem-fila"><div class="mem-tec">SRAM</div><div class="mem-barra-wrap"><div class="mem-barra" style="width:46%">L2 caché</div></div><div class="mem-tam">256 KB – 8 MB</div></div>
<div class="mem-fila"><div class="mem-tec">SRAM</div><div class="mem-barra-wrap"><div class="mem-barra" style="width:58%">L3 caché</div></div><div class="mem-tam">10 – 100 MB</div></div>
<div class="mem-fila"><div class="mem-tec">DRAM</div><div class="mem-barra-wrap"><div class="mem-barra" style="width:72%">memoria principal (RAM)</div></div><div class="mem-tam">&gt; 1 GB</div></div>
<div class="mem-fila"><div class="mem-tec">SSD / HD</div><div class="mem-barra-wrap"><div class="mem-barra" style="width:86%">almacenamiento secundario</div></div><div class="mem-tam">&gt; 256 GB</div></div>
<div class="mem-fila"><div class="mem-tec">nube / offline</div><div class="mem-barra-wrap"><div class="mem-barra" style="width:100%">almacenamiento externo</div></div><div class="mem-tam">TB</div></div>
</div>
<p class="mem-cap">⬆️ rápido, chico y volátil · ⬇️ lento, grande y permanente</p>

Tus **variables** viven arriba, en la **RAM** (memoria principal): rapidísima, pero **se borra al
cerrar el programa**. Para que los datos **sobrevivan**, hay que bajarlos al **almacenamiento
secundario** (el SSD o disco) — y eso es, justamente, **escribir un archivo**. 💾

---

## 📍 ¿Dónde se guardan los archivos? (la carpeta de trabajo)

Antes de crear un solo archivo, la pregunta más importante —y la que más confunde al principio—:
**¿dónde van a quedar?**

Cuando escribís `open("datos.txt", "w")`, Python crea `datos.txt` en la **carpeta de trabajo**: la
carpeta **desde donde se está ejecutando el programa** (en la práctica, la carpeta que tenés abierta en
el editor). Si solo ponés el nombre del archivo, sin carpetas, va **ahí**. Por eso, si no prestás
atención, los `.txt` te aparecen desparramados donde menos lo esperás.

!!! tip "🗂️ Regla de oro de la clase: una carpeta para todo"
    Creá **una sola carpeta** para hoy —la vamos a llamar `clase_archivos`— y trabajá **adentro**:
    guardá ahí tus scripts `.py` y ejecutalos desde ahí. Así **todos** los archivos que generes caen
    **juntos** en esa carpeta y no se te pierden.

    - En **VS Code**: `Archivo → Abrir carpeta…` y elegí `clase_archivos`. Con eso, la terminal y el
      "Run" ya quedan parados adentro de esa carpeta.
    - Si algún archivo se creó en otro lado (te puede pasar con el script de preparación de abajo),
      **movelo** a mano dentro de `clase_archivos` y listo. 🙂

### Rutas relativas vs. absolutas (en criollo)

- **Relativa** → `"datos.txt"` o `"subcarpeta/datos.txt"`: se entiende **desde la carpeta de trabajo**.
  Es la que vamos a usar siempre (funciona en cualquier computadora).
- **Absoluta** → `"C:/Users/Maxi/Escritorio/datos.txt"`: la ruta completa desde la raíz del disco.
  Funciona, pero queda **clavada a tu compu**: en la de otra persona esa carpeta no existe. Evitala.

!!! note "🧭 ¿En qué carpeta estoy parado?"
    Si dudás de dónde va a crear los archivos, preguntáselo a Python:

    ```python
    from pathlib import Path
    print("Estoy trabajando en:", Path.cwd())   # cwd = current working directory
    ```

    Ejecutá eso primero y fijate que la ruta termine en `...\clase_archivos`. Si no, abrí esa carpeta
    en el editor y volvé a probar.

---

## 🧰 Preparación — copiá, pegá y ejecutá

Ya con tu carpeta `clase_archivos` abierta (ver arriba), vamos a dejar lista la "cancha" para los
ejercicios de hoy. **Copiá este código, pegalo en un archivo `preparar.py` DENTRO de `clase_archivos`
y ejecutalo una vez.** Te va a crear los archivos de práctica **en esa misma carpeta**.

```python
from pathlib import Path

# 1) Un archivo de texto con varios párrafos (lo usa el Ejercicio 2)
texto = """La informática transformó el mundo en pocas décadas.
Hoy programar es una habilidad tan útil como leer o escribir.
Con Python, automatizar tareas aburridas es cuestión de minutos.
Y esto recién empieza."""
Path("texto.txt").write_text(texto, encoding="utf-8")

# 2) Una carpeta con archivos de nombres "sucios" (los vas a ordenar en el último ejercicio)
carpeta = Path("practica_archivos")
carpeta.mkdir(exist_ok=True)

nombres = [
    "Apunte De Clase.txt", "Tarea Para El Lunes.txt", "Lista De Compras.txt",
    "NOTAS Importantes.txt", "Mi Resumen Final.txt", "Fotos Del Viaje.txt",
    "Presupuesto 2026.txt", "Ideas Locas.txt", "Pendientes De Hoy.txt",
    "Receta De La Abuela.txt", "Cosas Por Comprar.txt", "Borrador Sin Titulo.txt",
]
for nombre in nombres:
    (carpeta / nombre).write_text("archivo de práctica", encoding="utf-8")

print(f"✅ Listo: creé 'texto.txt' y {len(nombres)} archivos en '{carpeta}/' en un parpadeo.")
```

!!! tip "🤯 Sentí la potencia"
    Acabás de crear 13 archivos en una fracción de segundo. ¿Querés ver algo más loco? Cambiá la
    lista por `for i in range(1000): (carpeta / f"archivo_{i}.txt").write_text("hola")` y vas a tener
    **mil archivos** al instante. Eso a mano, en el explorador, te llevaría una tarde entera. 😎

!!! note "🔮 No te preocupes si no entendés todo este código todavía"
    Usa cosas que vamos a ver hoy mismo (`write_text`, `Path`, carpetas). La idea es justo esa:
    **al terminar la clase, volvé a leer este código y lo vas a entender entero.** Es tu meta del día.

---

## 📂 Abrir un archivo con open()

La función `open()` abre un archivo y devuelve un **objeto de archivo** (file object) con el que podemos leer o escribir.

```python
archivo = open("datos.txt", "r")  # "r" = modo lectura
# ... hacemos algo con el archivo ...
archivo.close()                    # ¡siempre hay que cerrarlo!
```

### 🔑 Modos de apertura

| Modo | Nombre | ¿Qué hace? |
|------|--------|------------|
| `"r"` | read | Abre para **leer**. Error si no existe. *(por defecto)* |
| `"w"` | write | Abre para **escribir**. Crea el archivo o **sobreescribe** si ya existe. |
| `"a"` | append | Abre para **agregar** al final. Crea el archivo si no existe. |
| `"x"` | exclusive create | Crea el archivo. Error si ya existe. |
| `"r+"` | read + write | Abre para leer **y** escribir. Error si no existe. |

!!! warning "⚠️ El modo `w` borra el contenido existente"
    Si abrís un archivo existente con `"w"`, su contenido se **destruye** inmediatamente, antes incluso de que escribas nada. Si querés conservar lo que había, usá `"a"`.

---

## 🛡️ El bloque with (la forma correcta)

En lugar de acordarte siempre de hacer `.close()`, Python nos da el bloque `with`, que **cierra el archivo automáticamente** al terminar — incluso si ocurre un error.

```python
# ❌ Forma manual (propensa a errores si hay excepciones)
archivo = open("datos.txt", "r")
contenido = archivo.read()
archivo.close()

# ✅ Forma correcta con with
with open("datos.txt", "r") as archivo:
    contenido = archivo.read()
# El archivo se cierra solo al salir del bloque
```

!!! tip "🏆 Regla de oro"
    Siempre usá `with open(...) as archivo:` para trabajar con archivos. Es más seguro, más limpio, y es la forma estándar en Python moderno.

---

## 📖 Leer archivos

=== "📜 `.read()` — todo de una vez"

    Devuelve el contenido completo como un **string**.

    ```python
    with open("poema.txt", "r", encoding="utf-8") as f:
        contenido = f.read()

    print(contenido)
    print(type(contenido))  # <class 'str'>
    ```

    !!! tip "Cuándo usarlo"
        Para archivos pequeños donde necesitás todo el texto de una vez.

=== "📋 `.readlines()` — lista de líneas"

    Devuelve una **lista de strings**, una por línea. Cada línea incluye el `\n` al final.

    ```python
    with open("lista.txt", "r", encoding="utf-8") as f:
        lineas = f.readlines()

    print(lineas)
    # ['Ana\n', 'Beto\n', 'Cami\n']

    # Para quitarles el \n:
    lineas = [linea.strip() for linea in lineas]
    print(lineas)
    # ['Ana', 'Beto', 'Cami']
    ```

=== "🔁 `for` línea por línea (lo más eficiente)"

    Podemos iterar el archivo directamente sin cargar todo en memoria. Es la forma más **eficiente** para archivos grandes.

    ```python
    with open("alumnos.txt", "r", encoding="utf-8") as f:
        for linea in f:
            nombre = linea.strip()  # quita espacios y \n
            print(f"Alumno: {nombre}")
    ```

!!! warning "🌐 Siempre especificá `encoding='utf-8'`"
    Sin `encoding`, Python usa la codificación del sistema operativo (que en Windows suele ser `cp1252` o `latin-1`). Esto rompe los tildes y la ñ. Por eso **siempre** escribí `encoding="utf-8"`.

---

## ✍️ Escribir archivos

=== "📝 Modo `w` — crear / sobreescribir"

    ```python
    nombres = ["Ana", "Beto", "Cami"]

    with open("alumnos.txt", "w", encoding="utf-8") as f:
        for nombre in nombres:
            f.write(nombre + "\n")  # write() no agrega \n solo
    ```

    Después de ejecutar esto, el archivo `alumnos.txt` contiene:
    ```
    Ana
    Beto
    Cami
    ```

=== "➕ Modo `a` — agregar al final"

    ```python
    # El archivo ya existe con Ana, Beto y Cami
    with open("alumnos.txt", "a", encoding="utf-8") as f:
        f.write("Dante\n")

    # Ahora el archivo tiene: Ana, Beto, Cami, Dante
    ```

!!! info "`.write()` vs `print()`"
    - `.write(texto)` escribe exactamente el texto dado (sin `\n` automático).
    - También podés usar `print("algo", file=f)` que sí agrega `\n` al final automáticamente.

---

## 📍 Rutas: un repaso rápido

Ya lo charlamos [al principio](#donde-se-guardan-los-archivos-la-carpeta-de-trabajo), pero para
tenerlo a mano también acá:

```python
# Ruta relativa — se entiende desde la CARPETA DE TRABAJO (lo que usamos siempre)
with open("datos.txt", "r") as f: ...           # mismo directorio
with open("datos/alumnos.txt", "r") as f: ...   # subcarpeta "datos"

# Ruta absoluta — la ruta completa desde la raíz del disco (evitala: está clavada a tu compu)
with open("C:/Users/Maxi/Escritorio/datos.txt", "r") as f: ...  # Windows
with open("/home/maxi/datos.txt", "r") as f: ...                # Linux/Mac
```

!!! tip "💡 En proyectos reales"
    Usá **rutas relativas** al proyecto. Las absolutas "hardcodeadas" no funcionan en la computadora de
    otra persona. En el proyecto vamos a trabajar siempre con rutas relativas a la carpeta del proyecto.

---

## 📁 Trabajar con carpetas

Hasta acá abrimos archivos **de a uno**, sabiendo su nombre. Pero, ¿y si querés recorrer **todos** los
archivos de una carpeta (por ejemplo, para ordenarlos)? Para eso usamos el módulo `pathlib`.

!!! info "📦 Módulo: pathlib"
    `pathlib` viene incluido en Python. Representa rutas (archivos y carpetas) como **objetos**
    cómodos de manejar.

    ```python
    from pathlib import Path
    ```

    Lo que vamos a usar:

    | Esto | Qué hace | Ejemplo |
    |------|----------|---------|
    | `Path("carpeta")` | Crea un objeto que representa esa ruta | `Path("practica_archivos")` |
    | `.iterdir()` | Recorre **todo** lo que hay adentro | `for f in carpeta.iterdir():` |
    | `.glob("*.txt")` | Recorre solo lo que coincide con un patrón | `carpeta.glob("*.txt")` |
    | `.name` | El nombre con extensión | `"foto.txt"` |
    | `.stem` | El nombre **sin** extensión | `"foto"` |
    | `.suffix` | Solo la extensión | `".txt"` |
    | `.exists()` | ¿Existe ese archivo/carpeta? | `carpeta.exists()` |
    | `.rename(nuevo)` | Lo **renombra** (o lo mueve) | `f.rename(carpeta / "nuevo.txt")` |

Ejemplo — listar los `.txt` de una carpeta:

```python
from pathlib import Path

carpeta = Path("practica_archivos")
for archivo in carpeta.glob("*.txt"):
    print(archivo.name)
```

!!! tip "💡 El operador `/` arma rutas"
    Con `pathlib`, la barra `/` une carpeta y archivo de forma prolija y multiplataforma:
    `carpeta / "datos.txt"` → la ruta a `practica_archivos/datos.txt`. Nada de pegar strings a mano.

!!! note "👴 También lo vas a ver con `os.listdir()`"
    Un montón de código y de tutoriales usan el módulo `os`: `os.listdir("carpeta")` devuelve una
    **lista con los nombres** (como strings) de lo que hay adentro. `pathlib` es la forma más moderna
    y cómoda, pero te conviene **reconocer `os.listdir()`** cuando lo cruces por ahí.

---

## 📝 Tu apunte de la clase: `conceptos.py`

Para que te quede **todo junto y a mano**, vamos a armar un archivo `conceptos.py` con **un ejemplo de
cada cosa** que vimos, comentado. Crealo en tu carpeta `clase_archivos`, escribí esto (podés ir
armándolo en vivo con el profe) y **ejecutalo**: cada bloque te muestra una idea funcionando. Guardalo
—es tu chuleta para el proyecto—.

```python
# conceptos.py — apunte de la clase de Archivos 📁
# Ejecutalo parado en la carpeta clase_archivos (mirá que Path.cwd() termine ahí).
from pathlib import Path

# 0) ¿Dónde estoy parado? Acá van a caer los archivos que cree.
print("Carpeta de trabajo:", Path.cwd())

# 1) ESCRIBIR con modo "w": CREA el archivo (o lo SOBREESCRIBE si ya existía).
#    Ojo: write() NO agrega el salto de línea solo, se lo ponemos con "\n".
with open("apunte.txt", "w", encoding="utf-8") as f:
    f.write("primera línea\n")
    f.write("segunda línea\n")

# 2) AGREGAR con modo "a": suma AL FINAL, sin borrar lo que ya había.
with open("apunte.txt", "a", encoding="utf-8") as f:
    f.write("tercera línea (agregada después)\n")

# 3) LEER todo de una vez con modo "r" (es el modo por defecto):
with open("apunte.txt", "r", encoding="utf-8") as f:
    print("\n--- todo el contenido ---")
    print(f.read())

# 4) LEER línea por línea (lo más común y lo más eficiente):
print("--- línea por línea ---")
with open("apunte.txt", "r", encoding="utf-8") as f:
    for linea in f:
        print("•", linea.strip())   # strip() saca el "\n" del final

# 5) ¿Existe el archivo antes de intentar leerlo?
if Path("apunte.txt").exists():
    print("\napunte.txt existe ✅")

# 6) Recorrer una CARPETA: todos los .txt que hay en la carpeta actual.
print("\n--- .txt en esta carpeta ---")
for archivo in Path(".").glob("*.txt"):   # "." = la carpeta actual
    print(archivo.name)

# 💡 Recordá:
#   - SIEMPRE usar  with open(...) as f:  (cierra el archivo solo).
#   - SIEMPRE poner  encoding="utf-8"  (para que anden tildes y ñ).
#   - "w" borra, "a" agrega, "r" lee.
```

!!! tip "💡 Por qué te sirve este apunte"
    `conceptos.py` es tu **resumen que se puede correr**. Cuando en el proyecto no te acuerdes cómo se
    abría en modo "agregar" o cómo se leía línea por línea, abrís este archivo, lo mirás (o lo
    ejecutás) y listo. Mejor que un apunte en papel, porque **funciona**.

---

## ✅ Buenas prácticas

!!! success "Hacé esto ✅"
    - Siempre usá `with open(...)` para cerrar el archivo automáticamente.
    - Siempre especificá `encoding="utf-8"` al abrir.
    - Usá `.strip()` al leer líneas para eliminar el `\n` del final.
    - Para archivos grandes, iterá el archivo con `for linea in f:` en lugar de `.read()`.

!!! failure "Evitá esto ❌"
    - No abras archivos sin `with` si podés evitarlo.
    - No uses modo `"w"` si querés conservar el contenido existente.
    - No asumas que el archivo existe: si puede no existir, manejá el caso con `if Path(...).exists()`.

---

## 🎮 Ejercicios

!!! tip "🧪 Los ejercicios ahora son interactivos"
    Escribís el código, lo ejecutás con **Python de verdad en el navegador** y los tests te dicen al
    instante si está bien. Sin instalar nada: funciona desde la máquina del CFP, desde tu casa y
    desde el celular. Tu avance **se guarda solo**.

    Si te trabás, cada ejercicio tiene pistas — y un botón para mandarme tu código y tu consulta.

    [🚀 Ir a los ejercicios de Manejo de archivos](/pensamiento-computacional-testing-2026/ejercicios/clases/archivos/){ .md-button .md-button--primary }

## [⬅️ Anterior: Git y GitHub](./git_github.md)
## [📚 Índice](../../clases.md#persistencia)
## [➡️ Siguiente: JSON](./json.md)
