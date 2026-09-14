# Video 3 — Archivos: escribir, y sumar sin borrar

**Serie:** Archivos y Persistencia
**Duración estimada:** ~6 minutos

---

## INTRO (~15 segundos)

> Hola. Ya sabemos leer un archivo, así que ahora vamos a escribir.
>
> Son dos formas, con una diferencia entre ellas que conviene tener clara desde el principio. Y al
> final, lo que más se usa en la vida real.

---

## `write()`: NO PONE EL SALTO DE LÍNEA (~1 minuto 30)

```python
with open("mate.txt", "w", encoding="utf-8") as archivo:
    archivo.write("Hervir el agua")
    archivo.write("Poner la yerba")
```

*(Ejecutar y abrir el archivo)*

```
Hervir el aguaPoner la yerba
```

> Escribí dos cosas, una en cada línea del programa… y en el archivo quedaron **todas pegadas**.
>
> Y no es un error: es exactamente lo que le pedí. **`write()` escribe lo que le das, ni un
> carácter más.** Yo nunca le dije que quería un salto de línea, así que no lo puso.
>
> Es distinto a `print`, que te viene agregando el salto solo desde el primer día del curso. Tanto,
> que uno se olvida de que el salto existe.

```python
with open("mate.txt", "w", encoding="utf-8") as archivo:
    archivo.write("Hervir el agua\n")
    archivo.write("Poner la yerba\n")
```

*(Ejecutar y mostrar)*

```
Hervir el agua
Poner la yerba
```

> Ahora sí. El salto de línea se lo puse yo, con ese `\n` al final de cada texto.
>
> Y fijate que es **el mismo `\n`** que veíamos venir pegado cuando **leíamos**, en el video
> anterior. Ahora ya sabés de dónde salía: alguien, en algún momento, lo escribió.

---

## `print(file=...)`: LO PONE SOLO (~1 minuto 15)

```python
with open("mate.txt", "w", encoding="utf-8") as archivo:
    print("Hervir el agua", file=archivo)
    print("Poner la yerba", file=archivo)
```

*(Ejecutar y mostrar que queda igual que antes)*

> Y esta es la segunda forma, que a mucha gente le resulta más cómoda.
>
> Es el `print` de toda la vida, pero con un dato extra: **`file=archivo`**. Eso le dice *"en vez de
> mostrarlo en pantalla, escribilo en este archivo"*.
>
> Y como sigue siendo `print`, hace lo que hace siempre: **agrega el salto de línea solo**. Ya no
> tenés que acordarte del `\n`.
>
> Y hay otra ventaja: te deja usar **todo lo que ya sabés de `print`**. F-strings, formato de
> decimales, todo.

```python
temperatura = 80.5
with open("mate.txt", "a", encoding="utf-8") as archivo:
    print(f"Agua a {temperatura:.1f} grados", file=archivo)
```

> Mirá: f-string con `.1f` para un decimal, escrito directo al archivo.
>
> Las dos formas son correctas. Usá la que te resulte más clara a vos.

---

## EL MODO `"a"`: SUMAR SIN BORRAR (~1 minuto 45)

> Y ahora sí, lo que más se usa en la vida real.
>
> Acordate del video uno: `"w"` **borra todo** apenas abre el archivo. Entonces, ¿cómo hago para
> agregarle algo a un archivo que ya tiene cosas, sin perder lo que había?

```python
with open("visitas.txt", "a", encoding="utf-8") as archivo:
    print("Llegó Ana", file=archivo)
```

*(Ejecutar tres o cuatro veces, mostrando el archivo después de cada una)*

```
Llegó Ana
Llegó Ana
Llegó Ana
```

> Ahí está. Cada vez que lo corro, **se suma una línea más**. Nada se pisa, nada se pierde.
>
> Ese es el modo `"a"`, de *append*, que en inglés es "añadir". Escribe siempre **al final** de lo
> que ya había.
>
> Y tiene un detalle que lo hace todavía más cómodo: **si el archivo no existía, lo crea**. Así que
> no tenés que andar preguntando "¿ya existe o es la primera vez?". Con `"a"` funciona igual en los
> dos casos.
>
> Pensalo aplicado a algo real: un registro de quién entró al centro de formación. Cada vez que
> alguien llega, una línea más al final. Eso es exactamente el modo `"a"`.

---

## LOS DOS MODOS, UNO AL LADO DEL OTRO (~30 segundos)

| Querés… | Modo |
|---|---|
| Reemplazar todo por lo nuevo | `"w"` |
| Sumar al final, conservando lo anterior | `"a"` |

> Y para no equivocarte, la pregunta que te tenés que hacer antes de escribir la línea es siempre
> la misma: **¿esto reemplaza, o suma?**
>
> La respuesta te da la letra. Y si te equivocás para el lado de `"w"`, te comiste el archivo.

📌 **Y esto queda escrito:**

```python
# DOS FORMAS DE ESCRIBIR

with open("mate.txt", "w", encoding="utf-8") as f:
    f.write("Hervir el agua")        # NO pone el salto de línea
    f.write("Poner la yerba")        # -> queda "Hervir el aguaPoner la yerba"

    f.write("Hervir el agua\n")      # el \n se lo ponés VOS
    #                      ^^        (el mismo que venía pegado al LEER)

    print("Hervir el agua", file=f)  # el print de siempre, pero al archivo
    #                       ^^^^^^   y el salto lo pone SOLO
    print(f"Agua a {temp:.1f} grados", file=f)   # con todo lo de print

# EL MODO "a": SUMAR SIN BORRAR
with open("visitas.txt", "a", encoding="utf-8") as f:
    print("Llegó Ana", file=f)
# corrélo 3 veces -> 3 líneas. Nada se pisa.
# Y si el archivo no existía, lo crea: no hay que preguntar si es la 1ª vez.

# ─────────────────────────────────────────────
# "w" -> REEMPLAZA todo    ·    "a" -> SUMA al final
# La pregunta antes de escribir: ¿esto reemplaza, o suma?
# ─────────────────────────────────────────────
```

---

## CIERRE (~20 segundos)

> Ya podemos leer y escribir, que es casi todo. En el último video vemos el error que más te va a
> hacer renegar con archivos: el `FileNotFoundError`, que casi nunca significa lo que parece.
>
> ¡Nos vemos!
