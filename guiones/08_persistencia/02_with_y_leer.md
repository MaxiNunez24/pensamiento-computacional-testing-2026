# Video 2 — Archivos: `with` y las tres formas de leer

**Serie:** Archivos y Persistencia
**Duración estimada:** ~7 minutos

---

## INTRO (~20 segundos)

> Hola de nuevo. En el video anterior abrimos un archivo con `open` y lo cerramos con `close`.
>
> Hoy vemos por qué ese `close` casi nunca se escribe a mano, y las tres formas que hay de leer un
> archivo.

---

## EL PROBLEMA DEL `close()` (~1 minuto 15)

```python
archivo = open("notas.txt", "w")
archivo.write("primera parte")
resultado = 10 / 0
archivo.write("segunda parte")
archivo.close()
```

*(Ejecutar y mostrar el error)*

> Mirá lo que puse en el medio: una división por cero, que revienta seguro.
>
> Lo ejecuto y explota ahí. Y ahora fijate en la última línea: ese `close()` **nunca se ejecutó**.
> El programa se cortó antes de llegar.
>
> ¿Y qué queda? Un archivo abierto, que Python no cerró, y lo que escribiste antes puede no haber
> llegado al disco.
>
> Y no hace falta un error tan obvio como dividir por cero. Alcanza con un `return` en el medio, un
> `break`, o cualquier cosa que salga antes de tiempo. En un programa de verdad eso pasa todo el
> tiempo.

---

## LA SOLUCIÓN: `with` (~1 minuto 30)

```python
with open("notas.txt", "w", encoding="utf-8") as archivo:
    archivo.write("primera parte")

# acá afuera el archivo YA ESTÁ CERRADO
```

> Esta es la forma correcta, y la vas a escribir así siempre.
>
> Se lee: *"abrí el archivo, llamalo `archivo`, y hacé todo lo que está indentado abajo"*.
>
> Y acá está lo bueno: cuando el bloque termina, **Python lo cierra solo**. Pero no solo cuando
> termina bien: **lo cierra aunque adentro haya explotado algo**.
>
> O sea que el problema del video anterior desaparece. Y no porque te acuerdes de cerrarlo: **no te
> podés olvidar, porque no lo estás escribiendo**. Esa es la diferencia.
>
> Por eso en Python **siempre** se usa `with` para abrir archivos. No es una preferencia de estilo
> ni una cuestión de gustos: es **la** forma de hacerlo.

*(Señalar el `encoding`)*

> Y ese `encoding="utf-8"` ponelo siempre también. Es lo que hace que las **eñes y los acentos** se
> guarden bien. Si no lo ponés, en Windows te pueden salir símbolos raros, y es de esos errores que
> aparecen recién cuando alguien escribe su apellido con tilde.

📌 **Y esto queda escrito:**

```python
# ❌ El close() a mano es un problema esperando:
archivo = open("notas.txt", "w")
archivo.write("algo")
10 / 0                    # 💥 explota acá
archivo.close()           # <- esta línea NUNCA se ejecuta

# ✅ Con with, Python lo cierra SOLO
with open("notas.txt", "w", encoding="utf-8") as archivo:
    archivo.write("algo")
# acá afuera ya está cerrado, AUNQUE adentro haya explotado algo

# No te podés olvidar de cerrarlo porque no lo estás escribiendo.
# encoding="utf-8" -> va SIEMPRE: es lo que salva las eñes y los acentos.
```

---

## LEER, FORMA 1: TODO DE UNA (~1 minuto)

*(Tener preparado un `receta.txt` con 4 o 5 líneas)*

```python
with open("receta.txt", "r", encoding="utf-8") as archivo:
    texto = archivo.read()

print(texto)
```

*(Ejecutar)*

> Tengo este `receta.txt` con unas cuantas líneas, y lo leo con `read()`.
>
> `read()` te trae **todo el archivo en un solo string**. Un texto largo, con los saltos de línea
> adentro.
>
> Sirve cuando el archivo es chico y querés el contenido completo de una. Pero pensá qué pasa si el
> archivo tiene dos millones de líneas: estarías metiendo todo eso en la RAM de golpe, que es justo
> lo que queríamos evitar.

---

## LEER, FORMA 2: UNA LISTA DE LÍNEAS (~1 minuto)

```python
with open("receta.txt", "r", encoding="utf-8") as archivo:
    lineas = archivo.readlines()

print(lineas)
```

*(Ejecutar)*

```
['Hervir el agua\n', 'Poner la yerba\n', 'Esperar\n']
```

> `readlines`, con ese plural al final, te devuelve una **lista**: una línea por elemento.
>
> Y esto ya te resulta familiar, porque es una lista común y corriente. La podés recorrer con un
> `for`, pedirle el `len`, quedarte con la primera.
>
> Pero mirá bien un detalle que está a la vista y es la causa de un montón de dolores de cabeza:
> **cada elemento termina en `\n`**.
>
> Ese `\n` es el salto de línea, y viene **incluido** en el texto. No es algo que Python agregue
> al mostrarlo: está adentro del string.

---

## LEER, FORMA 3: LÍNEA POR LÍNEA (~1 minuto 30)

```python
with open("receta.txt", "r", encoding="utf-8") as archivo:
    for linea in archivo:
        print(linea)
```

*(Ejecutar SIN el `end=""`, para que se vean los renglones vacíos)*

> Esta es la tercera forma, y es **la mejor de las tres**: el archivo se puede recorrer con un
> `for`, igual que una lista, pero va trayendo **una línea por vez**. Nunca carga todo en la RAM.
>
> Pero mirá la salida… quedaron **renglones vacíos en el medio**. ¿Por qué?
>
> Por lo que acabamos de ver: cada línea **ya trae su propio `\n`**. Y `print`, que agrega el suyo
> siempre, le suma otro. Dos saltos de línea, un renglón vacío.

```python
with open("receta.txt", "r", encoding="utf-8") as archivo:
    for linea in archivo:
        print(linea, end="")
```

*(Ejecutar de nuevo, ahora bien)*

> Con `end=""` le digo a `print` que no agregue nada al final, y listo: se ve como tiene que verse.
>
> Cuando te pasen los renglones vacíos —y te van a pasar— ya sabés de dónde vienen.

---

## SI QUERÉS LA LÍNEA LIMPIA (~40 segundos)

```python
with open("receta.txt", "r", encoding="utf-8") as archivo:
    for linea in archivo:
        paso = linea.strip()
        print(f"👉 {paso}")
```

> Y esta es la que más vas a usar. `strip()` le saca el salto de línea **y** los espacios de los
> costados, y te deja el texto limpio.
>
> La regla práctica: **cada vez que leas algo de un archivo y lo quieras comparar, o guardar, o
> mostrar, va `strip()`**. Si no, estás comparando `"Guada\n"` contra `"Guada"` y no te va a dar
> nunca, aunque en pantalla se vean iguales.

📌 **Y esto queda escrito:**

```python
# TRES FORMAS DE LEER

with open("receta.txt", "r", encoding="utf-8") as f:
    texto = f.read()        # TODO en un solo string
                            # cómodo, pero carga el archivo entero en RAM

with open("receta.txt", "r", encoding="utf-8") as f:
    lineas = f.readlines()  # una LISTA, una línea por elemento
                            # ['Hervir el agua\n', 'Poner la yerba\n']
                            #                  ^^ ojo: el \n VIENE INCLUIDO

with open("receta.txt", "r", encoding="utf-8") as f:
    for linea in f:         # ⭐ LA MEJOR: una línea por vez, no carga todo
        print(linea, end="")
        #            ^^^^^^^ sin esto quedan renglones vacíos:
        #                    la línea ya trae su \n y print agrega otro

# ¿Vas a comparar o guardar lo que leíste? -> .strip()
linea.strip()   # saca el \n y los espacios de los costados
# "Guada\n" != "Guada"  aunque en pantalla se vean igual
```

---

## CIERRE (~20 segundos)

> Ya sabemos leer. En el próximo video escribimos: las dos formas que hay, y cómo sumar contenido a
> un archivo **sin borrar** lo que ya estaba.
>
> ¡Nos vemos!
