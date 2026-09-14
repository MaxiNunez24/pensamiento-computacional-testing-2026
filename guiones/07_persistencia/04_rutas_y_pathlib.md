# Video 4 — Archivos: rutas, `FileNotFoundError` y `pathlib`

**Serie:** Archivos y Persistencia
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

> Último video de Archivos. Vemos el error que más los va a hacer renegar — y que casi nunca significa lo que parece — y una herramienta que les va a simplificar la vida.

---

## EL ERROR (~1 minuto)

*(Tener `datos.txt` en una carpeta distinta de donde se ejecuta)*

```python
with open("datos.txt", "r", encoding="utf-8") as archivo:
    print(archivo.read())
```

```
FileNotFoundError: [Errno 2] No such file or directory: 'datos.txt'
```

> "No such file or directory". Archivo no encontrado.
>
> Y uno va, mira la carpeta… **y el archivo está ahí**. Entonces, ¿qué pasa?

---

## PYTHON NO BUSCA DONDE VOS CREÉS (~1 minuto 30)

> Acá está la clave, y es lo más importante del video:
>
> Cuando escribís `open("datos.txt")`, Python **no** lo busca al lado de tu archivo `.py`. Lo busca **desde la carpeta donde estás parado cuando ejecutás**.
>
> Y esas dos cosas son distintas más seguido de lo que uno cree: si abrís la terminal en una carpeta y el `.py` está en otra, ya no coinciden.

> Antes de pelearte con la ruta, preguntale a Python dónde está parado:

```python
from pathlib import Path
print(Path.cwd())
```

*(Ejecutarlo y mostrar la carpeta)*

> `cwd` es *current working directory*, la carpeta actual. **Ahí** es donde está buscando.
>
> Así que el error no dice "el archivo no existe". Dice **"el archivo no está donde yo estoy mirando"**. Son cosas muy distintas, y una se arregla y la otra no.

---

## RELATIVAS Y ABSOLUTAS (~1 minuto)

```python
open("datos.txt")                      # relativa: al lado de donde ejecutás
open("clase_archivos/datos.txt")       # relativa, bajando una carpeta
open("C:/Users/maxi/datos.txt")        # absoluta: siempre el mismo lugar
```

> La **relativa** depende de dónde estés parado. La **absoluta** arranca desde la raíz del disco y siempre apunta al mismo lado.
>
> En los programas se usan relativas casi siempre, porque si le pasás el programa a otro, su compu no tiene tus carpetas. Pero cuando algo no anda y no entendés por qué, probar con la absoluta te dice enseguida si el problema era la ruta.

---

## `pathlib`: PREGUNTAR ANTES DE ROMPER (~1 minuto 30)

> Vimos que abrir en `"r"` un archivo que no existe **explota**. ¿Y si no sé si existe?

```python
from pathlib import Path

archivo = Path("configuracion.txt")

if archivo.exists():
    print("Ya estaba, lo leo")
else:
    print("Primera vez, lo creo")
```

> `Path` es un objeto que representa una ruta, y sabe contestar preguntas sobre ella. `exists()` es la que más van a usar.
>
> Esto es **el patrón de un programa que se puede correr dos veces**: la primera arranca de cero, la segunda encuentra lo que dejó la anterior. Que es justo lo que queríamos desde el video 1.

*(Ejecutar dos veces seguidas para que se vea el cambio de mensaje)*

---

## OTRAS COSAS QUE SABE `Path` (~40 segundos)

```python
from pathlib import Path

carpeta = Path("respaldos")
carpeta.mkdir(exist_ok=True)        # crea la carpeta si no está

destino = carpeta / "copia.txt"     # se arman rutas con /
print(destino)                      # respaldos\copia.txt   (en Windows)
```

> Dos cosas lindas:
>
> `mkdir` crea la carpeta, y ese `exist_ok=True` significa *"si ya existe, no te quejes"*. Sin eso, la segunda vez que corrés el programa explota.
>
> Y las rutas se arman con la **barra común**, como si fuera una división. Queda mucho más legible que pegar strings.

*(Señalar la salida)*

> Fíjense que **yo escribí `/` y me lo mostró con `\`**. Eso es a propósito: `Path` usa la barra que corresponde a cada sistema. En Windows te la muestra invertida, en Linux o Mac normal.
>
> Ustedes escriben siempre `/` y `Path` se encarga. Esa es justamente la gracia: el mismo código anda en las dos.

---

## CIERRE (~30 segundos)

> Y con esto cerramos Archivos. Repasando:
>
> - Los datos sobreviven si van al **disco**.
> - Siempre `with`, siempre `encoding="utf-8"`.
> - `"w"` **reemplaza**, `"a"` **suma**.
> - `FileNotFoundError` casi nunca es "no existe": es "no está donde miro".
> - `Path.exists()` para que el programa se banque correr dos veces.
>
> Ahora sí: a la plataforma, que los ejercicios de Archivos los están esperando. Si algo no sale, mandá la consulta desde el mismo ejercicio con **✉️ Enviar a mi profe**.
>
> ¡Nos vemos!
