# Video 5 — Archivos: que los datos sobrevivan al programa

**Serie:** Archivos y Persistencia
**Duración estimada:** ~11 minutos

> ⚠️ **Este necesita Diccionarios.** Todo el video va de guardar y recuperar un diccionario, así
> que el video de Diccionarios tiene que estar arriba antes que este.
>
> Y es el que conecta Archivos con el **proyecto del año**: acá aparece el patrón que hace que el
> sistema de asistencias arranque el primer día sin romperse.

---

## INTRO (~25 segundos)

*(Archivo Python vacío)*

> Hola. Este es el último video de archivos, y es distinto a los otros cuatro.
>
> En los anteriores vimos las herramientas: abrir, leer, escribir, rutas. En este las usamos para
> resolver **un problema de verdad**, que es el del proyecto que vamos a hacer.
>
> La pregunta es: ¿cómo hago para que un **diccionario** siga existiendo mañana?

---

## EL PROBLEMA: EL DICCIONARIO SE MUERE (~1 minuto 15)

```python
stock = {"yerba": 12, "azucar": 5, "fideos": 8}
stock["yerba"] = 11
print(stock)
```

*(Ejecutar, cerrar, ejecutar de nuevo)*

> Mirá este diccionario: el stock de un kiosco. Vendo un paquete de yerba, lo bajo a once, muestro.
>
> Funciona. Pero ya sabés lo que viene: cierro, ejecuto de nuevo, y **la yerba volvió a doce**.
>
> Es el mismo problema del primer video, pero ahora con un diccionario. Y acá duele más, porque un
> diccionario es donde guardás **el estado** de tu programa: quién vino, cuánto queda, en qué anda
> cada cosa.
>
> Si eso se pierde al cerrar, no tenés un sistema: tenés una calculadora que se olvida de todo.

---

## DE DICCIONARIO A ARCHIVO (~2 minutos 30)

> Vamos a bajarlo al disco. Y la pregunta es: ¿**cómo** lo escribo? Un archivo de texto son
> renglones, y un diccionario son pares. Hay que elegir una forma.
>
> La más simple, y la que vamos a usar: **un renglón por par, con los dos datos separados por una
> coma.**

```python
stock = {"yerba": 12, "azucar": 5, "fideos": 8}

with open("stock.txt", "w", encoding="utf-8") as archivo:
    for producto in stock:
        print(f"{producto},{stock[producto]}", file=archivo)
```

*(Ejecutar y abrir el archivo)*

```
yerba,12
azucar,5
fideos,8
```

> Recorro el diccionario con un `for`. Y acordate de algo que vimos en Diccionarios: **cuando
> recorrés un diccionario, lo que te da son las claves**. Por eso `producto` va tomando "yerba",
> "azucar", "fideos".
>
> Y adentro armo el renglón con una f-string: la clave, una coma, el valor. Y lo escribo con
> `print(file=archivo)`, que como vimos pone el salto de línea solo.
>
> Listo. El diccionario está en el disco.

> Pero hay algo que quiero que mires: **el orden**. Los renglones salieron en el orden en que yo
> cargué el diccionario. Y eso, para un archivo que después alguien va a abrir y mirar, es un
> problema.

```python
with open("stock.txt", "w", encoding="utf-8") as archivo:
    for producto in sorted(stock):
        print(f"{producto},{stock[producto]}", file=archivo)
```

*(Ejecutar y mostrar)*

```
azucar,5
fideos,8
yerba,12
```

> Con `sorted()` alrededor, las claves salen **ordenadas alfabéticamente**. Y `sorted` ya lo
> conocés, de cuando vimos listas.
>
> ¿Y por qué me tomo la molestia? Porque un archivo ordenado **se puede comparar de un vistazo**.
> Si mañana genero el stock de nuevo y los dos archivos están ordenados igual, veo la diferencia en
> dos segundos. Si cada uno sale en el orden en que se fue cargando, tenés que leerlos enteros.
>
> Ordenar es gratis cuando escribís, y se paga solo la primera vez que tenés que revisar algo a
> mano.

📌 **Y esto queda escrito:**

```python
# UN DICCIONARIO AL DISCO: un renglón por par, separados por coma

stock = {"yerba": 12, "azucar": 5, "fideos": 8}

with open("stock.txt", "w", encoding="utf-8") as f:
    for producto in sorted(stock):
        #              ^^^^^^ ordenado: el archivo se puede COMPARAR de un vistazo
        print(f"{producto},{stock[producto]}", file=f)

# Recorrer un diccionario te da sus CLAVES.
# El valor se pide aparte: stock[producto]

# yerba,12      <- así queda el archivo
# azucar,5
# fideos,8

# "w" porque la lista es UNA SOLA: guardar de nuevo REEMPLAZA.
```

---

## DE ARCHIVO A DICCIONARIO (~2 minutos 30)

> Ahora al revés, que es la parte más interesante. Tengo el archivo, quiero el diccionario de
> vuelta.

```python
with open("stock.txt", "r", encoding="utf-8") as archivo:
    for linea in archivo:
        print(repr(linea))
```

*(Ejecutar)*

```
'azucar,5\n'
'fideos,8\n'
'yerba,12\n'
```

> Antes de armar nada, miremos qué nos llega de verdad. Uso `repr` para ver el string tal cual es,
> sin disimular.
>
> Y ahí está: cada renglón viene como **un solo string**, con la coma en el medio y el **`\n`
> pegado al final**. Ese `\n` es el del video dos, el que siempre viene incluido.
>
> Así que tengo dos cosas para hacer: **sacarle el salto** y **partirlo por la coma**.

```python
recuperado = {}

with open("stock.txt", "r", encoding="utf-8") as archivo:
    for linea in archivo:
        limpia = linea.strip()
        producto, cantidad = limpia.split(",")
        recuperado[producto] = int(cantidad)

print(recuperado)
```

*(Ejecutar)*

```
{'azucar': 5, 'fideos': 8, 'yerba': 12}
```

> Vamos línea por línea.
>
> `strip()` saca el salto de línea y los espacios de los costados. Ya lo vimos: cada vez que leés
> algo de un archivo y lo vas a usar, va `strip`.
>
> `split(",")` parte el string por la coma y me devuelve **una lista de dos**: el producto y la
> cantidad. Y como sé que son exactamente dos, los desempaqueto directo en dos variables.
>
> Y después lo guardo en el diccionario.

> Pero prestá atención a ese **`int(cantidad)`**, porque es el error que más se repite acá.
>
> Todo lo que sale de un archivo es **texto**. Absolutamente todo. Ese `"5"` que leí es el
> **carácter cinco**, no el número cinco. Si no lo convierto, después no le puedo sumar, no lo
> puedo comparar bien, y el día que quieras hacer una cuenta te va a dar cualquier cosa.
>
> Es el mismo error que ya vimos con `input`: lo que entra como texto, se convierte.

📌 **Y esto queda escrito:**

```python
# DEL DISCO AL DICCIONARIO

# Primero MIRÁ lo que llega de verdad:
for linea in archivo:
    print(repr(linea))      # 'azucar,5\n'   <- la coma y el \n pegado

recuperado = {}
with open("stock.txt", "r", encoding="utf-8") as f:
    for linea in f:
        limpia = linea.strip()                   # saca el \n
        producto, cantidad = limpia.split(",")   # parte por la coma -> 2 pedazos
        recuperado[producto] = int(cantidad)
        #                      ^^^^^^^^^^^^^
# ⚠️ TODO lo que sale de un archivo es TEXTO.
#    "5" es el carácter cinco, NO el número cinco.
#    Si no convertís, las cuentas te van a dar cualquier cosa.
#    Es el mismo error de input(): lo que entra como texto, SE CONVIERTE.
```

---

## EL PRIMER DÍA NO HAY ARCHIVO (~2 minutos)

> Y ahora la parte más importante del video. Tan importante que si te la salteás, el sistema no
> arranca.

```python
with open("stock.txt", "r", encoding="utf-8") as archivo:
    ...
```

*(Borrar `stock.txt` y ejecutar)*

```
FileNotFoundError: [Errno 2] No such file or directory: 'stock.txt'
```

> Borré el archivo y ejecuté. Y explotó, como vimos en el video anterior: abrir en `"r"` algo que
> no existe revienta.
>
> Ahora pensalo así. **El primer día no hay ningún archivo.** Nunca. Es imposible que haya, porque
> el programa todavía no corrió una sola vez.
>
> Entonces, si tu código revienta cuando el archivo falta, **el programa no arranca nunca la
> primera vez**. Y eso no lo vas a descubrir en tu casa, donde ya tenés archivos de las pruebas: lo
> vas a descubrir el día que lo instales en la máquina del CFP, delante de todos.

```python
from pathlib import Path

if Path("stock.txt").exists():
    print("Ya había datos: los cargo")
else:
    print("Primera vez: arranco vacío")
    recuperado = {}
```

> La solución es la del video anterior: **preguntar antes**.
>
> Y quiero que cambies cómo lo pensás. Esto **no es** un caso raro, una excepción, algo que
> contemplás por las dudas.
>
> **"Si no está, arrancá vacío" es el caso normal del primer día.** Todo sistema que guarda datos
> empieza sin datos. Que un diccionario vacío sea una respuesta válida, y no un error, es lo que
> hace que el programa pueda existir antes de tener información.

📌 **Y esto queda escrito:**

```python
# ⭐ LA LÍNEA QUE DECIDE SI EL SISTEMA ARRANCA

# Abrir en "r" un archivo que no existe -> 💥 FileNotFoundError
# Y el PRIMER DÍA no hay archivo. Nunca. Es imposible que haya.

from pathlib import Path

if Path("stock.txt").exists():
    ...                    # había datos: los cargo
else:
    recuperado = {}        # primera vez: arranco vacío

# "Si no está, arrancá vacío" NO es un caso raro que contemplás por las dudas.
# Es EL CASO NORMAL DEL PRIMER DÍA.
# Todo sistema que guarda datos empieza sin datos.
```

---

## LA COPIA CON FECHA (~2 minutos)

> Y lo último: la copia de seguridad.
>
> El sistema del proyecto va a vivir en una netbook del CFP, de esas que se apagan de un tirón
> cuando alguien patea el cable. Una copia por día es la diferencia entre perder un día y perder el
> año.
>
> La pregunta técnica es: ¿cómo le armo el nombre a la copia?

*(💡 **Nuevo:** `.stem` y `.suffix` no se dieron. La explicación va en la narración.)*

```python
from pathlib import Path

archivo = Path("stock.txt")
print(archivo.stem)      # stock
print(archivo.suffix)    # .txt
print(archivo.name)      # stock.txt
```

*(Ejecutar)*

> Acá aparecen dos cosas nuevas de `Path`, que en el video anterior no vimos.
>
> **`.stem`** te da el nombre **sin la extensión**: "stock". Se llama así porque es el tronco, la
> parte de la que sale todo lo demás.
>
> **`.suffix`** te da justamente la extensión: ".txt", con el punto incluido.
>
> Y `.name` te da los dos juntos, el nombre completo del archivo.

```python
fecha = "2026-09-16"
nuevo = f"{archivo.stem}-{fecha}{archivo.suffix}"
print(nuevo)             # stock-2026-09-16.txt
```

> Con esas dos piezas armo el nombre nuevo: el tronco, un guion, la fecha, y la extensión pegada al
> final.
>
> Y fijate por qué le pongo **la fecha** y no algo como "stock-backup".
>
> Un solo archivo de respaldo **se pisa a sí mismo**. Y eso parece inofensivo hasta el día que te
> das cuenta de que los datos estaban mal… y resulta que ya lo respaldaste tres veces encima. El
> respaldo te copió el error y borró lo bueno.
>
> Con la fecha en el nombre tenés uno por día, y podés volver al que estaba bien.

📌 **Y esto queda escrito:**

```python
from pathlib import Path
archivo = Path("stock.txt")

archivo.stem      # "stock"      <- el nombre SIN extensión (el tronco)
archivo.suffix    # ".txt"       <- la extensión, con el punto
archivo.name      # "stock.txt"  <- los dos juntos

fecha = "2026-09-16"
nuevo = f"{archivo.stem}-{fecha}{archivo.suffix}"
print(nuevo)      # stock-2026-09-16.txt

# ¿Por qué la FECHA en el nombre y no "stock-backup.txt"?
# Un solo archivo de respaldo SE PISA A SÍ MISMO.
# El día que descubrís que los datos estaban mal,
# ya lo respaldaste tres veces encima: copió el error y borró lo bueno.
# Uno por día = podés volver al que estaba bien.
```

---

## CIERRE (~45 segundos)

> Y con esto cerramos Archivos, los cinco videos. Te dejo lo de este, que es lo que vas a usar en
> el proyecto:

📌 **Y esto queda escrito:**

```python
# ═════════ QUE LOS DATOS SOBREVIVAN AL PROGRAMA ═════════
#
# 1. Un diccionario al disco: un renglón por par, "clave,valor"
#    y ORDENADO, para poder compararlo de un vistazo.
#
# 2. Para volver: .strip() para el \n, .split(",") para partirlo.
#
# 3. TODO lo que sale de un archivo es TEXTO. Convertilo.
#
# 4. El primer día NO HAY ARCHIVO.
#    "Si no está, arrancá vacío" es el caso normal, no la excepción.
#
# 5. El respaldo lleva la FECHA en el nombre.
#    Uno solo se pisa a sí mismo y te copia el error encima.
# ════════════════════════════════════════════════════════
```

> Estas cinco ideas son, literalmente, las que van a hacer que el sistema de asistencias del CFP
> funcione. No es un ejercicio inventado: es lo que vamos a construir.
>
> Ahora sí, a la plataforma. Y si te trabás, mandá la consulta desde el mismo ejercicio con **✉️
> Enviar a mi profe**.
>
> Nos vemos. ¡Chau!
