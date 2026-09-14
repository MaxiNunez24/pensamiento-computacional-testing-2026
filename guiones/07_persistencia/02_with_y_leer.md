# Video 2 — Archivos: `with` y las tres formas de leer

**Serie:** Archivos y Persistencia
**Duración estimada:** ~5 minutos

---

## INTRO (~20 segundos)

> En el video anterior abrimos un archivo con `open` y lo cerramos con `close`. Hoy vemos por qué ese `close` casi nunca se escribe a mano, y las tres formas de leer.

---

## EL PROBLEMA DEL `close()` (~1 minuto)

```python
archivo = open("notas.txt", "w")
archivo.write("primera parte")
resultado = 10 / 0            # 💥 acá explota
archivo.write("segunda parte")
archivo.close()               # ← esta línea NUNCA se ejecuta
```

> Si algo falla en el medio, el programa se corta ahí y **el `close()` nunca llega**. El archivo queda abierto, y lo que escribiste puede no haber llegado al disco.
>
> Y no hace falta un error tan obvio como dividir por cero. Alcanza con un `return` en el medio, o un `break`, o cualquier cosa que salga antes de tiempo.

---

## LA SOLUCIÓN: `with` (~1 minuto 30)

```python
with open("notas.txt", "w", encoding="utf-8") as archivo:
    archivo.write("primera parte")

# acá afuera el archivo YA ESTÁ CERRADO
```

> Esto se lee: *"abrí el archivo, llamalo `archivo`, y hacé todo lo que está indentado abajo"*.
>
> Cuando el bloque termina, **Python lo cierra solo**. Y acá está lo importante: lo cierra **aunque haya explotado algo adentro**. No te podés olvidar, porque no lo estás escribiendo.
>
> Por eso en Python **siempre** se usa `with`. No es una preferencia de estilo: es la forma correcta.

*(Señalar el `encoding`)*

> Y ese `encoding="utf-8"` póngalo siempre. Es lo que hace que las **eñes y los acentos** se guarden bien. Sin eso, en Windows te pueden salir símbolos raros.

---

## LEER, FORMA 1: TODO DE UNA (~1 minuto)

*(Tener preparado un `receta.txt` con 4 o 5 líneas)*

```python
with open("receta.txt", "r", encoding="utf-8") as archivo:
    texto = archivo.read()

print(texto)
```

> `read()` te trae **todo el archivo en un solo string**.
>
> Sirve cuando el archivo es chico y querés el contenido completo de una. Si el archivo es enorme, estás metiendo todo en la RAM de golpe, que es justo lo que queríamos evitar.

---

## LEER, FORMA 2: UNA LISTA DE LÍNEAS (~1 minuto)

```python
with open("receta.txt", "r", encoding="utf-8") as archivo:
    lineas = archivo.readlines()

print(lineas)
```

```
['Hervir el agua\n', 'Poner la yerba\n', 'Esperar\n']
```

> `readlines()` devuelve una **lista**, una línea por elemento.
>
> Miren el detalle: cada elemento **termina en `\n`**. Ese es el salto de línea, y viene incluido. Es la causa número uno de "¿por qué me quedan renglones vacíos?".

---

## LEER, FORMA 3: LÍNEA POR LÍNEA (~1 minuto)

```python
with open("receta.txt", "r", encoding="utf-8") as archivo:
    for linea in archivo:
        print(linea, end="")
```

> El archivo se puede recorrer con un `for`, igual que una lista. Y esta es **la mejor de las tres**: no carga todo en la RAM, va trayendo una línea por vez.
>
> Fíjense en el `end=""`. Como cada línea **ya trae su propio `\n`**, si `print` además agrega el suyo quedan dos saltos y aparecen renglones vacíos en el medio.

*(Ejecutarlo SIN el `end=""` para que se vea el problema, y después con él)*

> Ahí está la diferencia. Cuando les pase eso, ya saben de dónde viene.

---

## SI QUERÉS LA LÍNEA LIMPIA (~30 segundos)

```python
with open("receta.txt", "r", encoding="utf-8") as archivo:
    for linea in archivo:
        paso = linea.strip()        # saca el \n y los espacios de los bordes
        print(f"👉 {paso}")
```

> `strip()` les va a servir muchísimo: saca el salto de línea y los espacios de los costados. Cada vez que leas algo de un archivo y lo quieras comparar o mostrar, va `strip()`.

---

## CIERRE (~20 segundos)

> Ya sabemos leer. En el próximo video escribimos: las dos formas que hay, y cómo sumar contenido **sin borrar** lo que ya estaba.
>
> ¡Nos vemos!
