# Video 3 — Archivos: escribir, y sumar sin borrar

**Serie:** Archivos y Persistencia
**Duración estimada:** ~4 minutos

---

## INTRO (~15 segundos)

> Ya sabemos leer. Ahora escribimos. Son dos formas, y una diferencia entre ellas que conviene tener clara desde el principio.

---

## `write()`: NO PONE EL SALTO DE LÍNEA (~1 minuto 15)

```python
with open("mate.txt", "w", encoding="utf-8") as archivo:
    archivo.write("Hervir el agua")
    archivo.write("Poner la yerba")
```

*(Abrir el archivo y mostrarlo)*

```
Hervir el aguaPoner la yerba
```

> Todo pegado. `write()` escribe **exactamente** lo que le das, ni un carácter más.
>
> Si querés que cada cosa quede en su renglón, el salto de línea lo ponés vos:

```python
with open("mate.txt", "w", encoding="utf-8") as archivo:
    archivo.write("Hervir el agua\n")
    archivo.write("Poner la yerba\n")
```

```
Hervir el agua
Poner la yerba
```

> Ese `\n` es el salto de línea. Es el mismo que veíamos venir pegado cuando **leíamos**: ahora entienden de dónde salía.

---

## `print(file=...)`: LO PONE SOLO (~1 minuto)

```python
with open("mate.txt", "w", encoding="utf-8") as archivo:
    print("Hervir el agua", file=archivo)
    print("Poner la yerba", file=archivo)
```

> Es el `print` de siempre, con un dato extra: `file=archivo`. En vez de mostrar en pantalla, **escribe en el archivo**.
>
> Y como es `print`, hace lo que hace siempre: **agrega el salto de línea solo**. Por eso a mucha gente le resulta más cómoda.
>
> Además te deja usar todo lo que ya sabés de `print`: f-strings, separadores, formato de decimales.

```python
temperatura = 80.5
with open("mate.txt", "a", encoding="utf-8") as archivo:
    print(f"Agua a {temperatura:.1f} grados", file=archivo)
```

> Las dos formas son correctas. Usá la que te resulte más clara.

---

## EL MODO `"a"`: SUMAR SIN BORRAR (~1 minuto 15)

> Acá está lo que más se usa en la vida real.
>
> Acuérdense del video 1: `"w"` **borra todo** apenas abre. Entonces, ¿cómo hago para agregar algo a un archivo que ya tiene contenido, sin perderlo?

```python
with open("visitas.txt", "a", encoding="utf-8") as archivo:
    print("Llegó Ana", file=archivo)
```

*(Ejecutarlo tres o cuatro veces, mostrando el archivo después de cada una)*

```
Llegó Ana
Llegó Ana
Llegó Ana
```

> Cada vez que lo corro, **se suma una línea más**. Nada se pisa.
>
> Ese es el modo `"a"`, de *append*, "añadir". Escribe siempre **al final** de lo que ya había.
>
> Y si el archivo no existía, lo crea. Así que no hace falta preguntarse "¿ya existe?": con `"a"` funciona igual las dos veces.

---

## LOS DOS MODOS, UNO AL LADO DEL OTRO (~30 segundos)

| Querés… | Modo |
|---|---|
| Reemplazar todo por lo nuevo | `"w"` |
| Sumar al final, conservando lo anterior | `"a"` |

> La pregunta que se tienen que hacer antes de escribir la línea es siempre la misma: **¿esto reemplaza, o suma?** La respuesta les da la letra.

---

## CIERRE (~20 segundos)

> Ya podemos leer y escribir. En el último video vemos el error que más los va a hacer renegar: `FileNotFoundError`, que casi nunca significa lo que parece.
>
> ¡Nos vemos!
