# Video 0 — Funciones: repaso completo (1 y 2 en uno)

**Serie:** Funciones
**Duración estimada:** ~16 minutos

> ⏱️ **El número está medido, no estimado a ojo.** La narración son ~1900 palabras, que a ritmo de
> explicar con calma (~150 por minuto) dan 12:40 de habla. Sumando las pausas de escribir y
> ejecutar, ~16. Las secciones de abajo suman lo mismo.
>
> Si querés que sea más corto, el corte natural es donde lo corta la plataforma: hasta *"Una
> función que usa a otra"* es **Funciones I**, y de *Scope* en adelante es **Funciones II**.

> **Para qué es este video.** Es el repaso de **Funciones I y II en uno solo**: lo mínimo que hay
> que tener firme para seguir. Los videos 1 a 7 de esta misma carpeta son el desarrollo largo,
> tema por tema — si algo de acá queda flojo, ahí está explicado con calma.

---

## 🎬 Cómo está escrito este guion

| Bloque | Qué es |
|---|---|
| ```python``` | **Lo que se escribe en pantalla.** Copiar y pegar, o tipear en vivo |
| Texto en `>` | **Lo que se dice**, ya redactado. Se lee tal cual |
| 📌 **Y esto queda escrito** | El resumen **en comentarios**, para pegar en pantalla **después** de explicar, así los que toman apuntes lo copian |
| 💡 **Nuevo** | Algo que **no se vio en el curso**. Hay que aclararlo, o se pierden |

La regla del orden: **primero se explica, después aparece el resumen.** Al revés, leen el resumen
y dejan de escuchar.

---

## INTRO (~20 segundos)

*(Archivo Python vacío en el editor)*

> Hola, ¿cómo va? En este video repasamos **funciones**, todo junto: lo que vimos en Funciones I y
> lo de Funciones II.
>
> Vamos a ir a buen ritmo, pero sin saltear nada de lo importante. Y si algo no termina de cerrar,
> acordate que está el video largo de ese tema para verlo con calma.
>
> Arranquemos.

---

## QUÉ ES Y POR QUÉ (~1 minuto 30)

```python
precio = 1500
print(precio * 1.21)

precio2 = 2300
print(precio2 * 1.21)

precio3 = 890
print(precio3 * 1.21)
```

> Mirá este código. Tengo tres precios y a los tres les calculo el IVA, multiplicando por uno
> veintiuno.
>
> Funciona. Pero fijate que **escribí la misma cuenta tres veces**. Y ahí hay un problema que
> todavía no se ve: ¿qué pasa si mañana el IVA cambia?
>
> Tengo que acordarme de los tres lugares y cambiarlos uno por uno. Y si me olvido de uno, el
> programa **sigue funcionando y da mal**. No me avisa nadie. Ese es el peor tipo de error: el que
> no se queja.

```python
def con_iva(precio):
    return precio * 1.21

print(con_iva(1500))
print(con_iva(2300))
print(con_iva(890))
```

> Ahora lo mismo, pero con una función.
>
> Le puse un nombre a la cuenta, `con_iva`, y la escribí **una sola vez**. Abajo la uso tres veces,
> con tres precios distintos.
>
> Y ahora sí: si cambia el IVA, **cambio una línea y listo**. No hay forma de que se me escape un
> lugar, porque hay un solo lugar.

📌 **Y esto queda escrito:**

```python
# Una función es un pedazo de programa CON NOMBRE.
# Se escribe una vez y se usa todas las veces que quieras.

# Sin función:  la misma cuenta repetida en 3 lugares
#               si cambia, hay que acordarse de los 3
#               si te olvidás de uno, NO da error: da mal

# Con función:  la cuenta vive en UN solo lugar
#               cambia una vez y cambia en todos lados
```

---

## ANATOMÍA (~1 minuto 30)

```python
def con_iva(precio):
    return precio * 1.21
```

> Vamos parte por parte, porque cada pedacito tiene su razón de ser.
>
> **`def`** le avisa a Python: *"acá empieza una función"*. Es la palabra clave, siempre va.
>
> **`con_iva`** es el nombre. El que vas a escribir después para usarla. Ponele un nombre que diga
> qué hace, porque lo vas a leer muchas más veces de las que lo escribís.
>
> **`(precio)`** es el **parámetro**: lo que la función necesita para poder trabajar. Adentro de la
> función, `precio` funciona como una variable normal.
>
> Y después los **dos puntos**, y todo lo que va **indentado** abajo es el cuerpo de la función: lo
> que hace.

```python
def con_iva(precio):
    print("¡me ejecuté!")
    return precio * 1.21
```

*(Ejecutar el archivo con SOLO esto)*

> Y acá una que confunde muchísimo al principio. Le puse un `print` adentro, ejecuto el archivo…
> y **no pasa nada**. No se imprimió nada.
>
> ¿Por qué? Porque **definir no es ejecutar**. Yo escribí la función, Python la leyó y se la
> guardó, pero **nadie la llamó**.
>
> Es como tener una receta anotada en un papel: la receta existe, está ahí, pero si nadie se pone a
> cocinar no aparece la comida.

```python
con_iva(1500)
```

> Recién ahora, cuando escribo el nombre **con paréntesis**, se ejecuta.
>
> Esa es la diferencia entre **definir** —escribir la receta— y **llamar** —ponerse a cocinar.

📌 **Y esto queda escrito:**

```python
# ANATOMÍA
def  con_iva  (precio):        # def = "acá empieza una función"
#              ^^^^^^          # el nombre: que diga qué hace
#                              # el parámetro: lo que necesita para trabajar
    return precio * 1.21       # el cuerpo va INDENTADO

# DEFINIR no es EJECUTAR
# def con_iva(...)  -> Python la guarda. No corre nada.
# con_iva(1500)     -> ACÁ recién se ejecuta.
# La receta escrita no cocina sola.
```

---

## `return` vs `print`: LA MÁS IMPORTANTE (~2 minutos)

> Si de todo el video te llevás una sola cosa, quiero que sea esta. Es el error más común y el que
> más tiempo hace perder.

```python
def mostrar_iva(precio):
    print(precio * 1.21)

resultado = mostrar_iva(1000)
print(resultado)
```

> Mirá esta función. Calcula el IVA y lo **imprime**. La llamo, guardo lo que devuelve en
> `resultado`, y lo muestro.
>
> Ejecuto… y sale **1210 punto 0**, que es lo que imprimió la función. Pero abajo, cuando muestro
> `resultado`, sale **`None`**.
>
> `None` en Python quiere decir *"nada"*. La función **no devolvió nada**. Mostró algo en pantalla,
> sí, pero no me **entregó** el resultado.

```python
print(resultado + 100)
```

> Y si intento usarlo, explota. No puedo sumarle 100 a la nada.

```python
def con_iva(precio):
    return precio * 1.21

resultado = con_iva(1000)
print(resultado)          # 1210.0
print(resultado + 100)    # 1310.0
```

> Con `return` es otra cosa. Ahora la función **me entrega** el número. Lo guardo, lo muestro, le
> sumo cien, se lo paso a otra función… lo que quiera.
>
> Y esta es la idea que quiero que quede: **`print` es para que lo vea una persona. `return` es
> para que lo use el programa.** Son cosas completamente distintas, aunque en pantalla a veces
> parezcan lo mismo.
>
> Una función que solamente hace `print` es un callejón sin salida: hace su trabajo y no te deja
> nada en la mano.
>
> Así que la regla práctica: **usá `return`**. La única excepción es cuando el propósito de la
> función *sea* mostrar algo en pantalla.

> Y ojo con una cosa más: **toda función devuelve algo**. Si no escribís `return`, Python devuelve
> `None` igual, sin avisarte. Ese `None` que aparece de la nada casi siempre es un `return` que
> falta.

📌 **Y esto queda escrito:**

```python
# LA REGLA MÁS IMPORTANTE DE TODAS

# print  -> MUESTRA algo para que lo vea una PERSONA
# return -> DEVUELVE un valor para que lo use el PROGRAMA

def mostrar(n):
    print(n * 1.21)        # muestra, pero no entrega nada

def calcular(n):
    return n * 1.21        # entrega el valor: lo podés seguir usando

x = mostrar(1000)          # x vale None
y = calcular(1000)         # y vale 1210.0  <- este sirve

# Si la función NO tiene return, devuelve None.
# ¿Te aparece un None de la nada? Casi seguro falta un return.
```

---

## `return` CORTA LA FUNCIÓN (~1 minuto)

```python
def primera_vocal(texto):
    for letra in texto:
        if letra in "aeiou":
            return letra
    return None

print(primera_vocal("ritmo"))    # i
print(primera_vocal("crmb"))     # None
```

> Esta función busca la primera vocal de una palabra.
>
> Recorre letra por letra. Cuando encuentra una vocal, hace `return` y **se va**. No sigue
> recorriendo el resto de la palabra: ya encontró lo que buscaba, ¿para qué va a seguir?
>
> Eso es lo importante acá: **apenas Python llega a un `return`, sale de la función**. Todo lo que
> venga después no se ejecuta.
>
> Y fijate el último `return None`. Ese se ejecuta **solo si el `for` terminó sin encontrar
> ninguna vocal**, como pasa con "crmb". Es la forma de decir *"busqué en todo y no había"*.

📌 **Y esto queda escrito:**

```python
# return CORTA la función: sale en el acto.
# Lo que viene después NO se ejecuta.

def primera_vocal(texto):
    for letra in texto:
        if letra in "aeiou":
            return letra     # encontró -> se va, no sigue buscando
    return None              # llegó acá = recorrió TODO y no había

# Sirve para salir apenas encontrás lo que buscabas.
```

---

## UNA FUNCIÓN QUE USA A OTRA (~1 minuto 30)

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

> Tengo dos funciones. `con_iva` ya la conocemos. Y `total_carrito` recibe una **lista** de precios
> y me da el total con IVA incluido.
>
> Mirá lo que **no** hice: dentro de `total_carrito` **no volví a escribir** el `* 1.21`. En vez de
> eso, **llamé a la función que ya sabe hacer esa cuenta**.
>
> ¿Y por qué importa? Porque el día que cambie el IVA, yo toco `con_iva` y **`total_carrito` se
> entera sola**. La regla sigue viviendo en un solo lugar, aunque ahora la usen dos funciones
> distintas.
>
> Esto te va a pasar todo el tiempo: vas a estar escribiendo una función y te vas a dar cuenta de
> que esa cuenta ya la escribiste antes, en otro lado. Cuando te pase, **no la copies: llamala.**

📌 **Y esto queda escrito:**

```python
# Una función puede LLAMAR a otra. Y conviene.

def con_iva(precio):
    return precio * 1.21

def total_carrito(precios):
    total = 0
    for p in precios:
        total = total + con_iva(p)   # <- NO repite el * 1.21
    return total                     #    le pregunta al que ya sabe

# ¿Estás por copiar una regla que ya escribiste en otra función?
# No la copies: llamala.
# Si la copiás, el día que cambie tenés que acordarte de TODAS las copias.
```

---

## SCOPE: LO DE ADENTRO NO SE VE AFUERA (~2 minutos)

```python
def calcular():
    resultado = 42
    print(resultado)

calcular()
print(resultado)
```

> Acá tengo una función que crea una variable `resultado` y la imprime. La llamo, y adentro
> funciona perfecto: muestra 42.
>
> Pero después, **afuera** de la función, intento mostrar `resultado`… y explota:
> **`NameError: name 'resultado' is not defined`**. No está definida.
>
> ¿Por qué, si recién la vi funcionar? Porque **`resultado` nace y muere adentro de la función**.
> Cuando la función termina, esa variable deja de existir. Afuera nunca existió.
>
> Y esto no es un castigo: es una **protección**. Gracias a esto vos podés usar el nombre `total`
> en veinte funciones distintas sin que se pisen entre ellas. Cada una tiene su propio `total`, y
> ninguna le arruina la variable a la otra.

```python
mensaje = "hola"

def leer():
    print(mensaje)

def cambiar():
    mensaje = "chau"

leer()
cambiar()
print(mensaje)
```

> Ahora al revés: una variable **afuera** y dos funciones que la tocan.
>
> `leer` la imprime, y funciona: desde adentro de una función **se puede leer** lo de afuera.
>
> `cambiar` le asigna "chau". La ejecuto… y después, cuando muestro `mensaje`, **sigue diciendo
> "hola"**.
>
> Lo que pasó es que al escribir `mensaje = "chau"` dentro de la función, Python **no modificó** la
> de afuera: **creó una variable nueva**, local, que también se llama `mensaje` y que murió cuando
> la función terminó.
>
> Y acá va la regla que te va a servir todo el año, para todo lo que viene:
>
> **Lo que la función necesita, entra por parámetro. Lo que produce, sale por `return`.**
>
> Nada de andar tocando variables de afuera. Una función que se comunica así es una función que
> podés leer sola, entender sola y usar en cualquier lado.

📌 **Y esto queda escrito:**

```python
# SCOPE = hasta dónde "se ve" una variable

def calcular():
    resultado = 42        # nace acá adentro...
calcular()
print(resultado)          # 💥 NameError: ...y murió al terminar la función

# Esto NO es un castigo, es una protección:
# podés usar el nombre "total" en 20 funciones sin que se pisen.

mensaje = "hola"
def leer():
    print(mensaje)        # ✅ desde adentro SE PUEDE LEER lo de afuera
def cambiar():
    mensaje = "chau"      # ❌ NO cambia la de afuera:
                          #    crea una variable NUEVA y local
# afuera "mensaje" sigue valiendo "hola"

# ───────────────────────────────────────────
# LA REGLA DE ORO:
#   lo que la función NECESITA -> entra por PARÁMETRO
#   lo que la función PRODUCE  -> sale por RETURN
# ───────────────────────────────────────────
```

---

## VALORES POR DEFECTO (~2 minutos)

```python
def etiqueta(texto, ancho=20, relleno="."):
    return texto.ljust(ancho, relleno)

print(etiqueta("Yerba"))
print(etiqueta("Yerba", 10))
print(etiqueta("Yerba", 10, "-"))
print(etiqueta("Yerba", relleno="*"))
```

*(💡 **Nuevo:** `ljust()` no se dio en el curso. La explicación va acá abajo, en la narración.)*

> Antes de mirar la función, una cosa nueva que aparece ahí: **`ljust`**.
>
> `"Yerba".ljust(20, ".")` agarra el texto, lo deja pegado a la izquierda y rellena con puntos
> hasta completar veinte caracteres. El nombre viene de *left justify*: justificar a la izquierda.
>
> Y tiene dos hermanas: **`rjust`** hace lo mismo pero empuja el texto **a la derecha**, y
> **`center`** lo deja **en el medio**.
>
> Ahora, ¿te suena de algo? Porque esto ya lo hicimos, escrito de otra manera. Cuando vimos formato
> de f-strings usábamos `f"{texto:.<20}"`, donde el `<` era a la izquierda, el `>` a la derecha y
> el `^` al centro. **Es exactamente lo mismo.** Dos formas de escribir la misma idea, y las dos se
> usan por ahí, así que está bueno reconocer las dos.

> Vamos ahora sí con la función. `etiqueta` recibe un texto y lo rellena hasta un ancho fijo —
> sirve para alinear cosas en una lista, tipo un menú de precios.
>
> Fijate en los parámetros: `ancho` tiene un **igual veinte**, y `relleno` un **igual punto**. Eso
> es un **valor por defecto**: si no se lo paso, usa ese.
>
> Por eso la primera llamada, con solo el texto, funciona: usa ancho 20 y rellena con puntos.
>
> En la segunda le paso el ancho, y pisa el valor por defecto. En la tercera le paso los tres.
>
> Y mirá la última, que es la más interesante: le paso `relleno` **por su nombre**, y me **salteo**
> `ancho`. Eso se llama **argumento por palabra clave**, y sirve exactamente para esto: cuando
> querés cambiar solo uno de los de atrás sin tener que escribir todos los del medio.

> Dos reglas para anotar:
>
> La primera: los parámetros **con** valor por defecto van **después** de los que no tienen. Si lo
> hacés al revés, Python te tira error, porque no tendría forma de saber a cuál le estás pasando
> qué.
>
> Y la segunda, que es más rara pero alguna vez te va a morder: **nunca pongas una lista o un
> diccionario como valor por defecto**. Es de esas cosas que parecen razonables y no lo son: ese
> valor **se comparte entre todas las llamadas**, así que lo que agregues en una llamada te aparece
> en la siguiente. Si lo necesitás, el valor por defecto va `None` y la lista la creás adentro.

📌 **Y esto queda escrito:**

```python
# VALORES POR DEFECTO: un parámetro con "=" ya trae un valor puesto

def etiqueta(texto, ancho=20, relleno="."):
    return texto.ljust(ancho, relleno)

etiqueta("Yerba")                 # usa los defaults: ancho 20, relleno "."
etiqueta("Yerba", 10)             # pisa ancho
etiqueta("Yerba", relleno="*")    # pisa SOLO relleno, saltea ancho
#                ^^^^^^^          # argumento POR NOMBRE (keyword argument)

# ljust() = "left justify": alinea a la izquierda y rellena hasta el ancho.
#   rjust() alinea a la derecha  ·  center() centra
#   Es lo mismo que ya vimos con f-strings:
#       f"{texto:.<20}"   <  izquierda   >  derecha   ^  centrado

# DOS REGLAS
# 1) Los parámetros CON default van DESPUÉS de los que no tienen.
# 2) NUNCA pongas una lista o un dict como valor por defecto:
#    se comparte entre todas las llamadas y da errores rarísimos.
#    Si lo necesitás -> default None, y la creás adentro.
```

---

## `*args` Y `**kwargs` (~2 minutos)

> Esto es para cuando **no sabés cuántos valores te van a pasar**.

```python
def juntar(*palabras):
    print(type(palabras))
    return " ".join(palabras)

print(juntar("hola"))
print(juntar("hola", "buenas", "tardes"))
```

> Mirá la función `juntar`. Recibe un parámetro que se llama `palabras`, pero fijate que tiene un
> **asterisco adelante**. Ese asterisco lo cambia todo.
>
> Quiere decir: *"acá pueden venir todos los argumentos que quieran"*. Uno, tres, quince o ninguno.
>
> Y adentro de la función imprimo el **tipo** de `palabras`, para que veamos qué hizo Python con
> todo eso. Ejecuto… y dice **`tuple`**: una **tupla**.
>
> O sea que el asterisco **junta todo lo que venga y lo mete en una tupla**. Por eso después puedo
> recorrerla, o pasársela a `join` como cualquier colección.
>
> Y fijate en las dos llamadas: la primera con una sola palabra, la segunda con tres. **La misma
> función**, sin cambiarle nada, se la banca igual.

```python
def describir(**datos):
    print(type(datos))
    for clave, valor in datos.items():
        print(f"{clave}: {valor}")

describir(nombre="Yerba", peso=500, origen="Misiones")
```

> Ahora el hermano: **dos asteriscos**.
>
> Es la misma idea, pero para los argumentos que vienen **con nombre**. Acá le paso `nombre`, `peso`
> y `origen`, cada uno con su valor.
>
> Imprimo el tipo y ahora dice **`dict`**: un **diccionario**. Y tiene todo el sentido, porque cada
> valor viene con una etiqueta: la clave es el nombre del argumento y el valor es lo que le pasé.
>
> Por eso lo puedo recorrer con `.items()`, como cualquier diccionario de los que ya vimos.

> Y el resumen es fácil de acordarse: **un asterisco, tupla. Dos asteriscos, diccionario.**

📌 **Y esto queda escrito:**

```python
# Para cuando NO SABÉS CUÁNTOS argumentos te van a pasar

def juntar(*palabras):          # UN asterisco
    print(type(palabras))       # <class 'tuple'>   -> los junta en una TUPLA
    return " ".join(palabras)

juntar("hola")                          # anda con uno
juntar("hola", "buenas", "tardes")      # y con tres, sin tocar nada

def describir(**datos):         # DOS asteriscos
    print(type(datos))          # <class 'dict'>    -> los junta en un DICCIONARIO
    for clave, valor in datos.items():
        print(f"{clave}: {valor}")

describir(nombre="Yerba", peso=500)     # los que vienen CON NOMBRE

# *  un asterisco  -> TUPLA  (los sueltos)
# ** dos asteriscos -> DICCIONARIO (los que tienen nombre)
```

---

## EL ORDEN CUANDO ESTÁN TODOS (~1 minuto)

```python
def ejemplo(a, b=2, *args, **kwargs):
    print(f"a={a}, b={b}, args={args}, kwargs={kwargs}")

ejemplo(1)
ejemplo(1, x=10)
ejemplo(1, 3, x=10)
ejemplo(1, 3, 4, x=10)
ejemplo(1, 3, 4, 5, x=10, y=20) 
```

> Para cerrar: cuando tenés los cuatro tipos juntos, **el orden no es opcional**. Python los
> necesita en este orden para saber qué es cada cosa.
>
> Primero los normales, después los que tienen valor por defecto, después `*args`, y al final
> `**kwargs`.
>
> Vamos a ejecutar las cinco llamadas y mirar cómo se van acomodando los valores.

*(Ejecutar y recorrer las salidas una por una)*

```
a=1, b=2, args=(), kwargs={}
a=1, b=2, args=(), kwargs={'x': 10}
a=1, b=3, args=(), kwargs={'x': 10}
a=1, b=3, args=(4,), kwargs={'x': 10}
a=1, b=3, args=(4, 5), kwargs={'x': 10, 'y': 20}
```

> En la primera paso solo el 1: `a` vale 1, `b` usa su default, y los otros dos quedan vacíos.
>
> En la segunda agrego `x=10`: como viene con nombre y no coincide con ningún parámetro, se va
> derecho a `kwargs`.
>
> En la tercera paso un 3 suelto: ese sí pisa a `b`.
>
> Y de ahí en adelante, todo lo suelto que sobre se va apilando en `args`, y todo lo que tenga
> nombre se va a `kwargs`. **Cada uno cae donde le toca.**

📌 **Y esto queda escrito:**

```python
# EL ORDEN NO ES OPCIONAL
# 1. parámetros normales
# 2. parámetros con valor por defecto
# 3. *args
# 4. **kwargs

def ejemplo(a, b=2, *args, **kwargs):
    print(f"a={a}, b={b}, args={args}, kwargs={kwargs}")

ejemplo(1)                       # a=1, b=2, args=(),      kwargs={}
ejemplo(1, x=10)                 # a=1, b=2, args=(),      kwargs={'x': 10}
ejemplo(1, 3, x=10)              # a=1, b=3, args=(),      kwargs={'x': 10}
ejemplo(1, 3, 4, x=10)           # a=1, b=3, args=(4,),    kwargs={'x': 10}
ejemplo(1, 3, 4, 5, x=10, y=20)  # a=1, b=3, args=(4, 5),  kwargs={'x': 10, 'y': 20}

# Lo suelto que sobra -> args   ·   Lo que viene con nombre -> kwargs
```

---

## CIERRE (~40 segundos)

> Y con esto cerramos el repaso. Te dejo lo que no se puede olvidar:

📌 **Y esto queda escrito:**

```python
# ═══════════ FUNCIONES, LO QUE NO SE OLVIDA ═══════════
#
# 1. DEFINIR no es EJECUTAR. Hay que llamarla con ( ).
#
# 2. return DEVUELVE, print MUESTRA. No son lo mismo.
#
# 3. Sin return, la función devuelve None.
#
# 4. Lo que NECESITA entra por parámetro.
#    Lo que PRODUCE sale por return.
#
# 5. ¿Esa regla ya la escribiste en otra función?
#    No la copies: llamala.
#
# 6. * -> tupla    ·    ** -> diccionario
# ══════════════════════════════════════════════════════
```

> Ahora sí, a la plataforma, que los ejercicios de Funciones los están esperando. Y acordate: si
> te trabás, mandá la consulta desde el mismo ejercicio con el botón **✉️ Enviar a mi profe**.
> Llega con tu código y con lo que probaste, así te puedo ayudar mejor.
>
> Nos vemos en el próximo. ¡Chau!
