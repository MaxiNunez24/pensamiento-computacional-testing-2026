# Video 1 — Archivos: por qué guardar en disco

**Serie:** Archivos y Persistencia
**Duración estimada:** ~5 minutos

> ⚠️ **Grabar después del repaso de Funciones.** Este video no usa `def`, pero **los ejercicios de
> Archivos sí**: los ocho arrancan con una función a completar.

---

## INTRO (~20 segundos)

*(Abrir un archivo Python vacío en el editor)*

> Hola! Arrancamos **Archivos**. Hasta ahora todo lo que programamos se olvidaba de todo apenas cerrábamos el programa. En estos videos vemos cómo hacer que los datos sobrevivan.

---

## EL PROBLEMA, EN VIVO (~1 minuto)

*(Escribir y ejecutar esto, de verdad, delante de cámara)*

```python
peliculas = ["Matrix", "Coco", "Shrek"]
peliculas.append("Interestelar")
print(peliculas)
```

> Lo ejecuto y funciona. Ahora lo cierro… y lo vuelvo a ejecutar.

*(Ejecutarlo de nuevo)*

```
['Matrix', 'Coco', 'Shrek', 'Interestelar']
```

> Miren bien: **está igual que antes**. El "Interestelar" que agregué la vez pasada no quedó. Cada vez que arranca, el programa empieza de cero.
>
> Y esto no es un error: es cómo funciona. Todo lo que vimos hasta ahora vive en la **memoria RAM**, que es rapidísima pero se borra cuando el programa termina.

---

## RAM Y DISCO (~1 minuto)

*(Sin código, hablando a cámara)*

> Piénsenlo así:
>
> La **RAM** es el escritorio donde estás trabajando. Tenés todo a mano, lo agarrás rapidísimo… pero cuando te vas, alguien limpia el escritorio y no queda nada.
>
> El **disco** es el cajón. Es más lento abrirlo y buscar, pero **lo que guardás ahí sigue estando mañana**.
>
> Todo lo que programamos hasta hoy vivió en el escritorio. Hoy aprendemos a usar el cajón.
>
> Y la regla es simple: si querés que algo siga existiendo después de cerrar el programa, **tiene que ir al disco**. O sea: a un archivo.

---

## `open()`: DÓNDE Y PARA QUÉ (~1 minuto 30)

```python
archivo = open("notas.txt", "w")
archivo.write("Hoy empecé a usar archivos")
archivo.close()
```

> Tres líneas. Abro, escribo, cierro.
>
> `open()` necesita dos cosas: **dónde** está el archivo, y **para qué** lo abro. Ese segundo dato se llama el **modo**, y es esa letrita entre comillas.

*(Mostrar el archivo `notas.txt` creado, abrirlo)*

> Ahí está. Cierro todo, apago la compu si quiero, y mañana el archivo sigue ahí.

---

## LOS MODOS (~1 minuto)

> Son cuatro, y la diferencia entre dos de ellos es la que más dolores de cabeza da.

| Modo | Qué hace | Si el archivo no existe |
|---|---|---|
| `"r"` | **Leer** — es el que usa por defecto | 💥 Error |
| `"w"` | Escribir **borrando todo** lo anterior | Lo crea |
| `"a"` | Escribir **agregando al final** | Lo crea |
| `"x"` | Crear, y fallar si ya existe | Lo crea |

> Quiero que se queden con `"w"` y `"a"`, porque acá se pierden datos de verdad.

---

## ⚠️ `"w"` BORRA SIN PREGUNTAR (~1 minuto)

*(Esto hay que mostrarlo, no contarlo)*

```python
# El archivo notas.txt ya tiene algo escrito de antes.
archivo = open("notas.txt", "w")
archivo.close()
```

> Miren lo que hice: abrí el archivo en modo `"w"` y lo cerré. **No escribí nada.**

*(Abrir `notas.txt` y mostrar que está vacío)*

> Vacío. Lo que había se borró.
>
> Y ojo con **cuándo** pasó: no se borró al escribir, se borró **en el momento exacto de abrirlo**. Con solo abrir en `"w"`, ya perdiste lo que había.
>
> Así que la regla: **`"w"` es para cuando querés empezar de cero.** Si lo que querés es sumar sin perder lo anterior, el modo es `"a"`, y eso lo vemos en el video 3.

---

## CIERRE (~20 segundos)

> En el próximo video vemos por qué ese `close()` que escribí es un problema esperando a pasar, y cuál es la forma correcta de abrir archivos en Python.
>
> ¡Nos vemos!
