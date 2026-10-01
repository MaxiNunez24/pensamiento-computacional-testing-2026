# Video — Excepciones: cuando algo sale mal

**Serie:** El proyecto
**Duración estimada:** ~10 minutos

> 📄 **La clase está en la plataforma**, con cuatro ejercicios y dos chequeos:
> `/clases/excepciones/`. Este video **no los resuelve**: cuenta los conceptos para que lleguen a
> los ejercicios sabiendo de qué se trata.

> 🎯 **Para qué existe este video.** El 25/9 no hubo clase, y Excepciones quedó como tarea. Esto
> reemplaza la explicación, no la práctica.

---

## INTRO (~30 segundos)

*(Abrir un archivo Python vacío)*

> Hola, ¿cómo va? Hoy: **excepciones**. Lo que pasa cuando el programa se encuentra con algo que no
> puede hacer.
>
> Y te aviso para qué lo vamos a usar, porque esta vez tiene un motivo muy concreto: en el sistema
> del CFP **los datos no los escribimos nosotros**. Los escriben treinta personas en un formulario.
> Alguien va a poner "doce" donde iba un número, y el sistema no se puede caer por eso.

---

## 1. EL PROGRAMA SE CAE (~1 minuto 15)

```python
edad = int("doce")
print("Tiene", edad, "años")
```

*(Ejecutarlo. Dejar el traceback en pantalla unos segundos antes de hablar)*

> Lo ejecuto y pasa esto. Pará un segundo y leelo conmigo, porque esto lo venís viendo todo el año
> y quizás nunca lo leíste en serio.
>
> La última línea dice **`ValueError`**, y después el motivo: no puede convertir `"doce"` a número.
>
> Fijate en dos cosas. La primera: el `print` de abajo **no se ejecutó**. El programa se frenó ahí
> mismo. La segunda, y es la importante: **ese error tiene nombre**. No es "se rompió todo", es
> `ValueError`. Y el nombre nos va a servir.

📌 **Y esto queda escrito**

```python
# Una EXCEPCIÓN es Python diciendo "no puedo hacer esto".
# Cuando aparece, el programa se FRENA ahí: lo que viene abajo no corre.
# Cada excepción tiene un NOMBRE, y el nombre dice qué pasó.
```

---

## 2. LAS QUE YA CONOCÉS (~1 minuto)

*(Ir escribiendo y ejecutando una por una, rápido)*

```python
int("doce")        # ValueError
"Tenés " + 3       # TypeError
{"dni": "30"}["nombre"]   # KeyError
[1, 2, 3][10]      # IndexError
10 / 0             # ZeroDivisionError
```

> Estas cinco ya te las cruzaste todas este año.
>
> **ValueError**: el tipo está bien, pero el valor no sirve. "doce" es un texto, está perfecto, lo
> que no se puede es convertirlo.
>
> **TypeError**: mezclaste tipos que no van juntos, texto más número.
>
> **KeyError**: esa clave no está en el diccionario. Y acá va un dato: casi siempre es un error de
> tipeo.
>
> **IndexError**: esa posición no existe en la lista.
>
> Y **ZeroDivisionError**, que se explica solo.

---

## 3. ATAJARLA: TRY Y EXCEPT (~2 minutos 30)

```python
texto = "doce"

try:
    edad = int(texto)
    print("Tiene", edad, "años")
except ValueError:
    print("Eso no es un número")
```

*(Ejecutar con `"doce"`)*

> `try` quiere decir **intentá**. Adentro va lo que puede salir mal.
>
> Y abajo, en el `except`, va **qué hacer si sale mal**. Fijate que digo el nombre: `except
> ValueError`. Estoy diciendo "si pasa justo esto, hacé esto otro".
>
> Lo ejecuto con "doce" y mirá: dice "Eso no es un número", **y el programa sigue vivo**. No hay
> traceback, no hay nada roto.

*(Cambiar `texto` a `"12"` y ejecutar de nuevo)*

> Y ahora con "12". Convierte perfecto, imprime la edad, **y el `except` ni se entera**.
>
> Esa es toda la idea: si el `try` sale bien, el `except` no existe. Si algo adentro del `try`
> falla, Python salta directo al `except` — y ojo con esto: **lo que quedaba del `try` no se
> ejecuta**. Por eso el `print` de la edad está adentro, y no abajo.

📌 **Y esto queda escrito**

```python
# try:    intentá esto
# except NombreDelError:    y si falla, hacé esto otro
#
# Si el try sale bien, el except no corre.
# Si falla, Python SALTA al except: lo que quedaba del try no se ejecuta.
```

---

## 4. POR QUÉ NO PREGUNTAR ANTES (~1 minuto 30)

*(Esta parte es la que más se traba. Ir despacio.)*

```python
print("12".isdigit())
print("-3".isdigit())
print(int("-3"))
```

*(Ejecutar)*

> Acá viene la pregunta que me van a hacer: *"profe, ¿y no era más fácil preguntar antes si es un
> número, con `isdigit`?"*. Vamos a ver por qué no.
>
> Con `"12"`, `isdigit` dice `True`. Bien.
>
> Pero mirá la segunda: `"-3".isdigit()` dice **`False`**. Porque el guion no es un dígito.
>
> Y sin embargo —tercera línea— **`int("-3")` anda perfecto**. Da menos tres.
>
> Entonces, si yo preguntaba con `isdigit`, le decía a alguien "eso no es un número" sobre un
> número que Python convierte sin problema.
>
> Esa es la diferencia: **preguntar antes te obliga a adivinar todos los casos** —el menos, el
> espacio al final, el más adelante—. Intentar le deja la pregunta **a quien sabe la respuesta**,
> que es el propio `int`.

📌 **Y esto queda escrito**

```python
# Intentar le gana a preguntar antes:
#   "-3".isdigit()  ->  False   (el guion no es dígito)
#   int("-3")       ->  -3      (anda perfecto)
# El que sabe si se puede convertir es int(), no nosotros.
```

---

## 5. NUNCA UN EXCEPT SOLO (~1 minuto 15)

```python
def a_numero(texto):
    try:
        return int(textto)
    except:
        return None

print(a_numero("12"))
```

*(Ejecutar. Sale `None`.)*

> Se puede escribir `except` **sin nombre**, y ataja cualquier cosa. Parece más cómodo. Es una
> trampa, y te la muestro.
>
> Esta función le pasa `"12"`, que es un número perfecto, y devuelve `None`. Siempre devuelve
> `None`, para cualquier texto.
>
> ¿Por qué? Mirá bien la línea del `int`.

*(Señalar `textto` con el cursor, sin arreglarlo todavía)*

> **`textto`**, con dos te. Un error de tipeo mío.
>
> Eso tira un `NameError`, que no tiene nada que ver con convertir números. Pero como el `except`
> está **sin nombre**, se lo come igual, devuelve `None` y nadie se entera nunca.

*(Ahora sí, cambiar `except:` por `except ValueError:` y ejecutar)*

> Le pongo el nombre, y mirá: ahora **sí** explota, y me dice exactamente que `textto` no existe.
>
> Esa es la diferencia. El `except` con nombre ataja **lo que esperabas**; cualquier otra cosa
> sigue avisando, que es lo que querés.

📌 **Y esto queda escrito**

```python
# NUNCA un except: solo.
# Se come TUS propios errores (un typo, un nombre mal escrito) y los esconde.
# except ValueError:  ataja lo que esperabas; el resto sigue avisando.
```

---

## 6. LEVANTAR LAS TUYAS: RAISE (~2 minutos)

```python
class Alumno:
    def __init__(self, dni, apellido, nombre):
        if not dni.isdigit() or len(dni) not in (7, 8):
            raise ValueError("el DNI tiene que ser de 7 u 8 números, sin puntos")
        self.dni = dni
        self.apellido = apellido
        self.nombre = nombre

ana = Alumno("30111222", "Perez", "Ana")
print(ana.dni)
```

*(Ejecutar: anda normal)*

> Hasta acá **atajamos** excepciones. Ahora al revés: las vamos a **levantar** nosotros.
>
> Acordate del bot: el `Alumno` decía si estaba listo con `problemas()`. Pero hay datos tan rotos
> que el alumno **no debería ni existir**. Un DNI con letras no es un alumno a medio cargar: es un
> error.
>
> Para eso está `raise`. Con un DNI bueno, esto anda como siempre.

*(Cambiar a `Alumno("30.111.222", "Perez", "Ana")` y ejecutar)*

> Y ahora con puntos. Explota, y explota **con mi mensaje**.
>
> Lo importante: `raise` **corta el `__init__` ahí mismo**. El objeto no llega a existir. No hay
> ningún `Alumno` a medio hacer dando vueltas por el programa.
>
> Y fijate que levanto `ValueError`, el mismo que tira `int("doce")`. No me inventé un error nuevo,
> porque es el mismo problema: **el valor no sirve**.

📌 **Y esto queda escrito**

```python
# raise ValueError("motivo")  ->  frena todo acá y avisa.
# En __init__, el objeto NO llega a crearse: no hay alumnos a medio hacer.
#
# El que DETECTA el error es el Alumno.
# El que DECIDE qué hacer (avisar y seguir) es el menú.
```

---

## CIERRE (~45 segundos)

> Resumiendo lo que viste: una excepción es Python diciendo "no puedo". Se ataja con `try` y
> `except NombreDelError`, nunca con un `except` pelado. Y se levanta con `raise` cuando un dato no
> sirve.
>
> Lo que sigue es la parte que importa: **los cuatro ejercicios de la clase de Excepciones**, en la
> plataforma. Ahí vas a escribir vos las tres cosas, incluida una que usamos todo el tiempo en el
> sistema: que **un alumno roto no frene a los demás**.
>
> Si algo no sale, mandámelo desde el botón de **Enviar a mi profe**, que lo vemos.
>
> Nos vemos en la próxima 👋

---

## 🎬 Para quien graba

| | |
|---|---|
| **Lo que más se traba** | El punto 4, el de `isdigit`. Si el video se tiene que alargar en algún lado, que sea ahí |
| **Lo que se puede recortar** | El punto 2 (las cinco excepciones): se puede decir en 30 segundos nombrando solo `ValueError` y `KeyError` |
| **Ojo** | En el punto 5, **no arreglar el typo antes de tiempo**: la gracia es que lo vean devolver `None` con un dato bueno |
| **Zoom** | Agrandar el editor con **A+** antes de grabar: el traceback se lee mal en el celular |
