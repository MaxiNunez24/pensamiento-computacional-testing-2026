# Video 0 — Funciones: repaso completo (1 y 2 en uno)

**Serie:** Funciones
**Duración estimada:** ~9 minutos

> **Para qué es este video.** Es el repaso de **Funciones I y II en uno solo**: lo mínimo que hay
> que tener firme para seguir. Los videos 1 a 7 de esta misma carpeta son el desarrollo largo,
> tema por tema — si algo de acá queda flojo, ahí está explicado con calma.

---

## INTRO (~20 segundos)

*(Archivo Python vacío en el editor)*

> Hola! Este es el repaso de **Funciones**, todo junto. Vamos a ir rápido pero sin saltear nada de lo importante. Si algo no termina de cerrar, está el video largo de ese tema.

---

## QUÉ ES Y POR QUÉ (~1 minuto)

```python
precio = 1500
print(precio * 1.21)

precio2 = 2300
print(precio2 * 1.21)

precio3 = 890
print(precio3 * 1.21)
```

> Tres veces la misma cuenta. Y si mañana el IVA cambia, tengo que acordarme de los tres lugares. Si me olvido de uno, el programa da mal y no me avisa nadie.

```python
def con_iva(precio):
    return precio * 1.21

print(con_iva(1500))
print(con_iva(2300))
print(con_iva(890))
```

> Ahora la regla está **en un solo lugar**. Cambia el IVA, cambio una línea.
>
> Eso es una función: **un pedazo de programa con nombre**, que podés usar todas las veces que quieras.

---

## ANATOMÍA (~1 minuto)

```python
def con_iva(precio):
    return precio * 1.21
```

> - `def` — le avisa a Python que empieza una función.
> - `con_iva` — el nombre, el que vas a usar después.
> - `(precio)` — el **parámetro**: lo que la función necesita para trabajar.
> - `:` y todo **indentado** debajo — el cuerpo.

> Y ojo con algo que confunde al principio: **definir no es ejecutar**.

```python
def con_iva(precio):
    print("¡me ejecuté!")
    return precio * 1.21
```

*(Ejecutar el archivo con SOLO eso)*

> No pasó nada. La función está **definida**, pero nadie la **llamó**. Es como tener una receta escrita: existe, pero nadie cocinó.
>
> Se ejecuta recién cuando ponés el nombre con paréntesis: `con_iva(1500)`.

---

## `return` vs `print`: LA MÁS IMPORTANTE (~1 minuto 30)

> Si de este video se llevan una sola cosa, que sea esta.

```python
def mostrar_iva(precio):
    print(precio * 1.21)

resultado = mostrar_iva(1000)
print(resultado)          # None ← no devolvió nada
print(resultado + 100)    # 💥 explota
```

```python
def con_iva(precio):
    return precio * 1.21

resultado = con_iva(1000)
print(resultado)          # 1210.0
print(resultado + 100)    # 1310.0 ← puedo seguir usándolo
```

> `print` **muestra algo para que lo vea un humano**. `return` **devuelve un valor para que lo use el programa**.
>
> Una función que solo hace `print` es un callejón sin salida: no la podés guardar en una variable, ni sumarla, ni pasársela a otra función.
>
> La regla: **usá `return`**, salvo que el único propósito de la función sea mostrar algo en pantalla.

> Y toda función devuelve algo. Si no escribís `return`, Python devuelve `None`. Ese `None` es el que aparece cuando algo "no funciona y no entiendo por qué".

---

## `return` CORTA LA FUNCIÓN (~45 segundos)

```python
def primera_vocal(texto):
    for letra in texto:
        if letra in "aeiou":
            return letra
    return None

print(primera_vocal("ritmo"))    # i
print(primera_vocal("crmb"))     # None
```

> Apenas Python llega a un `return`, **se va de la función**. Lo que viene después no se ejecuta. Por eso podemos salir en cuanto encontramos lo que buscábamos, sin recorrer el resto.

---

## UNA FUNCIÓN QUE USA A OTRA (~1 minuto)

> Acá es donde las funciones empiezan a valer de verdad.

```python
def con_iva(precio):
    return precio * 1.21

def total_carrito(precios):
    total = 0
    for p in precios:
        total = total + con_iva(p)
    return total

print(total_carrito([1500, 2300, 890]))
```

> `total_carrito` **no vuelve a escribir la regla del IVA**: le pregunta a quien ya sabe.
>
> Y eso es lo importante: si el IVA cambia, `total_carrito` se entera solo. La regla sigue viviendo en un único lugar.
>
> Cuando vean que están copiando una regla que ya escribieron en otra función: no la copien, **llámenla**.

---

## SCOPE: LO DE ADENTRO NO SE VE AFUERA (~1 minuto 15)

```python
def calcular():
    resultado = 42
    print(resultado)     # 42

calcular()
print(resultado)         # 💥 NameError
```

> `resultado` **nace y muere dentro de la función**. Afuera no existe.
>
> Y esto no es un castigo, es una protección: gracias a eso podés usar el nombre `total` en veinte funciones distintas sin que se pisen entre ellas.

```python
mensaje = "hola"

def leer():
    print(mensaje)       # ✅ puede LEER lo de afuera

def cambiar():
    mensaje = "chau"     # ❌ crea una variable NUEVA, local
                         #    la de afuera queda intacta

leer()
cambiar()
print(mensaje)           # sigue diciendo "hola"
```

> Desde adentro **se puede leer** lo de afuera, pero al asignarle un valor Python crea una variable local nueva.
>
> La regla de oro, y sirve para todo el año: **lo que la función necesita, entra por parámetro. Lo que produce, sale por `return`.** Nada de tocar variables de afuera.

---

## VALORES POR DEFECTO (~1 minuto)

```python
def etiqueta(texto, ancho=20, relleno="."):
    return texto.ljust(ancho, relleno)

print(etiqueta("Yerba"))                    # Yerba...............
print(etiqueta("Yerba", 10))                # Yerba.....
print(etiqueta("Yerba", 10, "-"))           # Yerba-----
print(etiqueta("Yerba", relleno="*"))       # Yerba***************
```

> Un parámetro con `=` tiene **valor por defecto**: si no se lo pasás, usa ese.
>
> Miren la última: pasé `relleno` **por nombre** y me salteé `ancho`. Eso se llama argumento por palabra clave, y sirve justo para esto.
>
> Dos reglas:
>
> 1. Los parámetros **con** valor por defecto van **después** de los que no tienen.
> 2. **Nunca** pongan una lista o un diccionario como valor por defecto. Se comparte entre todas las llamadas y da errores rarísimos. Si necesitás eso, el default es `None` y la creás adentro.

---

## `*args` Y `**kwargs` (~1 minuto)

> Para cuando **no sabés cuántos** te van a pasar.

```python
def juntar(*palabras):
    print(type(palabras))        # <class 'tuple'>
    return " ".join(palabras)

print(juntar("hola"))                      # hola
print(juntar("hola", "buenas", "tardes"))  # hola buenas tardes
```

> El asterisco junta **todo lo que venga** en una **tupla**.

```python
def describir(**datos):
    print(type(datos))           # <class 'dict'>
    for clave, valor in datos.items():
        print(f"{clave}: {valor}")

describir(nombre="Yerba", peso=500, origen="Misiones")
```

> Dos asteriscos junta los que vienen **con nombre**, en un **diccionario**.
>
> Un asterisco → tupla. Dos asteriscos → diccionario. Y el orden cuando están todos: primero los normales, después los que tienen default, después `*args`, y al final `**kwargs`.

---

## CIERRE (~30 segundos)

> Repasando lo que no se puede olvidar:
>
> - **Definir no es ejecutar.** Hace falta llamarla.
> - **`return` devuelve, `print` muestra.** No son lo mismo.
> - **Sin `return` la función devuelve `None`.**
> - Lo que entra, **por parámetro**; lo que sale, **por `return`**.
> - Si ya escribiste esa regla en otra función, **llamala en vez de copiarla**.
>
> Ahora sí, a la plataforma. Y si algo no sale, mandá la consulta desde el mismo ejercicio con **✉️ Enviar a mi profe**: llega con tu código y con lo que probaste.
>
> ¡Nos vemos!
