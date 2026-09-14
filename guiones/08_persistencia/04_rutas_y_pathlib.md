# Video 4 — Archivos: rutas, `FileNotFoundError` y `pathlib`

**Serie:** Archivos y Persistencia
**Duración estimada:** ~7 minutos

---

## INTRO (~20 segundos)

> Hola, último video de archivos.
>
> Vemos el error que más te va a hacer renegar —y que casi nunca significa lo que parece— y una
> herramienta que te va a simplificar bastante la vida.

---

## EL ERROR (~50 segundos)

*(Tener `datos.txt` en una carpeta distinta de donde se ejecuta)*

```python
with open("datos.txt", "r", encoding="utf-8") as archivo:
    print(archivo.read())
```

*(Ejecutar)*

```
FileNotFoundError: [Errno 2] No such file or directory: 'datos.txt'
```

> *"No such file or directory"*. Archivo no encontrado.
>
> Y uno va, mira la carpeta… **y el archivo está ahí**. Lo está viendo. Entonces, ¿qué pasa?

---

## PYTHON NO BUSCA DONDE VOS CREÉS (~1 minuto 30)

> Acá está la clave, y es lo más importante de todo el video.
>
> Cuando escribís `open("datos.txt")`, Python **no** lo busca al lado de tu archivo `.py`. Lo busca
> **desde la carpeta donde estás parado en el momento de ejecutar**.
>
> Y esas dos cosas son distintas mucho más seguido de lo que uno cree: si abrís la terminal en una
> carpeta y el programa está en otra, ya no coinciden.

```python
from pathlib import Path
print(Path.cwd())
```

*(Ejecutar y mostrar la carpeta)*

> Así que antes de pelearte con la ruta, preguntale a Python **dónde está parado**.
>
> `cwd` viene de *current working directory*: el directorio de trabajo actual. **Esa** es la carpeta
> desde la que está buscando.
>
> Y con esto, el error cambia de significado. No dice *"el archivo no existe"*. Dice **"el archivo
> no está donde yo estoy mirando"**.
>
> Son dos cosas muy distintas: una se arregla en dos segundos y la otra no. Y la mayoría de las
> veces es la primera.

---

## RELATIVAS Y ABSOLUTAS (~1 minuto)

```python
open("datos.txt")                      # relativa: al lado de donde ejecutás
open("clase_archivos/datos.txt")       # relativa, bajando una carpeta
open("C:/Users/maxi/datos.txt")        # absoluta: siempre el mismo lugar
```

> Hay dos tipos de ruta.
>
> La **relativa** depende de dónde estés parado. Es la que veníamos usando: le doy el nombre nomás,
> o el nombre con una carpeta adelante.
>
> La **absoluta** arranca desde la raíz del disco y **siempre apunta al mismo lado**, ejecutes
> desde donde ejecutes.
>
> En los programas de verdad se usan relativas casi siempre, y hay un motivo: si le pasás el
> programa a un compañero, su computadora no tiene tus carpetas. Una ruta absoluta le va a fallar
> seguro.
>
> Pero como truco, cuando algo no anda y no entendés por qué, probá un momento con la absoluta. Si
> con la absoluta funciona, el problema era la ruta y no otra cosa.

📌 **Y esto queda escrito:**

```python
# FileNotFoundError casi nunca significa "el archivo no existe"

# Python NO busca al lado de tu archivo .py
# Busca desde LA CARPETA DONDE ESTÁS PARADO al ejecutar

from pathlib import Path
print(Path.cwd())      # <- preguntale DÓNDE está parado. Ahí busca.

open("datos.txt")                  # RELATIVA: depende de dónde ejecutes
open("carpeta/datos.txt")          # relativa, bajando una carpeta
open("C:/Users/maxi/datos.txt")    # ABSOLUTA: siempre el mismo lugar

# En los programas van RELATIVAS: la compu de tu compañero
# no tiene tus carpetas.
# ¿No entendés por qué falla? Probá un momento con la absoluta:
# si así anda, el problema era la ruta.
```

---

## `pathlib`: PREGUNTAR ANTES DE ROMPER (~1 minuto 45)

> Y ahora algo que vas a necesitar en el proyecto.
>
> Ya vimos que abrir en modo `"r"` un archivo que no existe **explota**. ¿Y si no sé si existe?

```python
from pathlib import Path

archivo = Path("configuracion.txt")

if archivo.exists():
    print("Ya estaba, lo leo")
else:
    print("Primera vez, lo creo")
```

*(Ejecutar dos veces seguidas, para que se vea el cambio de mensaje)*

> `Path` es un objeto que representa una ruta, y **sabe contestar preguntas sobre ella**. La que más
> vas a usar es `exists()`: ¿existe o no existe?
>
> Y mirá lo que pasa si lo ejecuto dos veces. La primera dice *"primera vez"*. La segunda, *"ya
> estaba"*.
>
> Eso que acabás de ver tiene nombre: es **el patrón de un programa que se puede correr más de una
> vez**. La primera arranca de cero, y de ahí en adelante **encuentra lo que dejó la vez anterior**.
>
> Que es exactamente lo que queríamos desde el video uno, cuando el "Interestelar" no quedaba
> guardado.

---

## OTRAS COSAS QUE SABE `Path` (~50 segundos)

```python
from pathlib import Path

carpeta = Path("respaldos")
carpeta.mkdir(exist_ok=True)

destino = carpeta / "copia.txt"
print(destino)
```

*(Ejecutar DOS veces, para que se vea que no explota la segunda)*

> Dos cosas más que te van a servir.
>
> `mkdir` crea la carpeta. Y ese `exist_ok=True` significa *"si ya existe, no te quejes"*. Sin eso,
> la primera vez funciona y **la segunda explota**, que es de las cosas más molestas que hay.
>
> Y lo otro: las rutas se arman **con la barra**, como si fuera una división. Mucho más legible que
> andar pegando strings.

*(Señalar la salida)*

> Ahora, mirá bien esto: **yo escribí barra normal y me lo mostró con barra invertida**.
>
> Eso es a propósito. `Path` usa la barra que corresponde a **cada sistema**: en Windows te la
> muestra invertida, en Linux o en Mac te la muestra normal.
>
> Vos escribís siempre la barra normal y `Path` se encarga. Y esa es justamente la gracia: el mismo
> código funciona igual en las dos.

📌 **Y esto queda escrito:**

```python
from pathlib import Path

# ¿EXISTE? -> preguntar antes de romper
archivo = Path("configuracion.txt")
if archivo.exists():
    print("Ya estaba, lo leo")
else:
    print("Primera vez, lo creo")
# Corrélo 2 veces: la 1ª crea, la 2ª ENCUENTRA lo de la vez anterior.
# Ese es el patrón de un programa que se puede correr más de una vez.

# CREAR UNA CARPETA
carpeta = Path("respaldos")
carpeta.mkdir(exist_ok=True)   # "si ya existe, no te quejes"
#              ^^^^^^^^^^^^^   sin esto, la 2ª corrida explota

# ARMAR RUTAS: con la barra, como una división
destino = carpeta / "copia.txt"
print(destino)                 # respaldos\copia.txt   (en Windows)
# Escribís /  y Path pone la barra de cada sistema.
# El mismo código anda en Windows, en Linux y en Mac.
```

---

## CIERRE (~40 segundos)

> Y con esto cerramos archivos. Te dejo el resumen de los cuatro videos:

📌 **Y esto queda escrito:**

```python
# ═══════════ ARCHIVOS, LO QUE NO SE OLVIDA ═══════════
#
# 1. Lo que está en la RAM se pierde al cerrar.
#    Si tiene que sobrevivir, va al DISCO.
#
# 2. Siempre with, siempre encoding="utf-8".
#
# 3. "w" REEMPLAZA (y borra al abrir)  ·  "a" SUMA al final
#
# 4. Al leer, cada línea trae su \n pegado -> .strip()
#
# 5. FileNotFoundError casi nunca es "no existe":
#    es "no está donde estoy mirando". -> Path.cwd()
#
# 6. Path("x").exists() = que el programa se banque
#    correr más de una vez.
# ═════════════════════════════════════════════════════
```

> Ahora sí, a la plataforma, que los ejercicios de Archivos te están esperando.
>
> Y acordate: si te trabás, mandá la consulta desde el mismo ejercicio con el botón **✉️ Enviar a
> mi profe**. Llega con tu código y con lo que probaste, así te puedo ayudar mucho mejor.
>
> Nos vemos en el próximo. ¡Chau!
