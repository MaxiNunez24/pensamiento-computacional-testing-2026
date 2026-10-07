# Bot del SiGeS — Parte 2: leer la planilla y el primer control (~16 min)

> **De dónde sale.** Es la regrabación de la segunda mitad de la clase del 2/10, que se grabó sin
> imagen (ver `material-docente/videos/2026-10-02_bot-siges.md`). La narración sale de **tu audio
> de ese día**, con tus palabras, pero sin las vueltas que quedaron grabadas: `isdigit`, el
> `if self.problemas()` y el `and` del DNI, que tenía que ser `or`.
>
> **Antes de grabar:** tener abierta la página de la clase en
> [*Leer la planilla*](https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/clases/bot-siges/#leer-la-planilla),
> y VS Code con la carpeta `bot-siges` abierta y el entorno activado, como quedó en la Parte 1.
> Si querés capítulos automáticos, apretá el atajo de marcador de OBS **al empezar cada sección,
> desde la 2** (ver `guiones/README.md`, *Capítulos para YouTube*).
>
> 🎥 Al apretar *Iniciar grabación*, **mové el mouse y fijate que la vista previa de OBS se
> mueva.** El 2/10 la captura se colgó y se grabaron 38 minutos de una imagen quieta.

---

## 1. Dónde quedamos (~1 min)

*(En la página de la clase, arriba de todo: el esquema de los tres archivos.)*

> Seguimos con el bot del SiGeS desde donde lo dejamos. En la Parte 1 dejamos la compu lista: el
> proyecto en VS Code, el entorno virtual creado y activado, y Playwright instalado con su
> navegador. Si no lo hiciste, frená acá y mirá ese video primero, porque sin eso el bot no
> arranca.
>
> Ahora pasamos a la acción. Acordate de que el bot son dos programas: el que carga, `bot.py`, que
> ya viene hecho, y el que decide quién se carga, que lo escribís vos. Ese tiene dos archivos:
> `planilla.py`, que lee la planilla del formulario, y `alumno.py`, que es la clase `Alumno` de
> siempre, con un método nuevo que dice si está listo para cargarse.
>
> Hoy completamos los dos. Y al final de este video, el bot ya va a tener su primer control.

---

## 2. Qué es un CSV (~1:30 min)

*(Bajar hasta **Leer la planilla**. Señalar el bloque con las dos líneas del CSV.)*

```text
dni,apellidos,nombres,fecha_nacimiento,celular,nacionalidad,domicilio
40000004,Paz,Mateo Ariel,3/12/2004,2215550004,Argentino,Calle 47 nro 629
```

> El formulario de inscripción deja una planilla. Cuando la bajás como archivo, sale en un formato
> que se llama CSV: *comma separated values*, valores separados por coma.
>
> Es texto plano, nada más. Una fila por línea, y los datos separados por comas. La primera línea
> son los títulos, las columnas. Y de ahí para abajo, los datos de cada inscripto, en el mismo
> orden que los títulos.
>
> Es la misma idea que una tabla, pero escrita toda en texto. Ojo, que acá se suele confundir: no es
> una base de datos. Es un archivo de texto con una forma acordada, y por eso cualquier programa lo
> puede leer: una planilla de cálculo, un editor de texto, y Python.

---

## 3. `csv.DictReader` (~2:30 min)

*(Señalar el bloque de código de la página.)*

```python
import csv

with open("inscriptos.csv", encoding="utf-8") as archivo:
    for fila in csv.DictReader(archivo):
        print(fila["apellidos"], fila["dni"])
```

> Python trae un módulo para leer CSV, que viene incluido y no hay que instalar nada: se llama
> `csv`. Y lo más cómodo que tiene es esto: `csv.DictReader`. Te da cada fila como un
> diccionario, algo que ya sabés manejar, con los títulos como claves.
>
> Vamos por partes. El `with open` es el de Archivos. Ahora que ya vimos objetos lo podés leer
> mejor: `open` te devuelve un objeto archivo, y el `with` lo guarda en la variable `archivo` y lo
> cierra solo cuando terminás. El `encoding="utf-8"` es lo que hace que las eñes y los acentos se
> lean bien. No te lo olvides: en esta planilla hay un Gómez y un Ríos.
>
> Después, el `for`. En vez de recorrer el archivo línea por línea, lo recorrés con
> `csv.DictReader(archivo)`, y en cada vuelta te da una fila ya convertida en diccionario.

*(💡 Demo: crear un `prueba.py` en la carpeta del bot, pegar el bloque y ejecutarlo. Sale un apellido y un DNI por renglón. Borrar `prueba.py` después.)*

> Para que veas que no te miento, lo pego en un archivo de prueba y lo corro. Fijate: apellido,
> DNI, apellido, DNI. Y fijate también lo que **no** aparece: la línea de los títulos. No sale
> "apellidos, dni" como si fuera un inscripto más. `DictReader` usa esa primera línea para saber
> cómo se llama cada columna, y por eso después podés pedir `fila["apellidos"]` en vez de tener que
> acordarte de que era la columna 2.
>
> Las claves son siempre las mismas, las de los títulos. Lo que cambia en cada vuelta son los
> valores.

📌 **Y esto queda escrito:**

```python
# csv.DictReader(archivo) -> una fila por vuelta, como diccionario
# las claves son los títulos de la primera línea (por eso esa línea no aparece como fila)
# fila["apellidos"] en vez de acordarte del número de columna
```

---

## 4. Ejercicio: Leer la planilla (~2 min)

*(Bajar al ejercicio **Leer la planilla**.)*

> Primer ejercicio. Hay que completar `leer_filas(ruta)` para que abra la planilla y devuelva una
> lista con una fila por inscripto, cada una como diccionario. La planilla ya está creada, con tres
> inscriptos.
>
> Si querés, pausá el video y probá vos primero. Lo que sigue es la explicación para cuando te
> trabes.

```python
import csv

def leer_filas(ruta):
    filas = []
    with open(ruta, encoding="utf-8") as archivo:
        for fila in csv.DictReader(archivo):
            filas.append(fila)
    return filas
```

> Es lo mismo de recién, con una sola diferencia: antes cada fila se imprimía, y ahora se agrega a
> la lista con `append`. Fijate que el archivo no es `"inscriptos.csv"` escrito a mano: es `ruta`,
> el parámetro. Así la función sirve para cualquier planilla.
>
> Y el `return` va afuera del `with`, a la misma altura que `filas = []`: primero se recorre todo,
> y recién después se devuelve.

*(▶ Verificar. Sale "¡Planilla leída!".)*

> Ahí está: una lista de diccionarios, con todos los datos a cargar.

---

## 5. Ejercicio: De cada fila, un Alumno (~3 min)

*(Bajar a **De cada fila, un Alumno**.)*

> Ahora que tenemos la lista de diccionarios, vamos a hacer que cada fila se convierta en un
> objeto. El diccionario funciona como una especie de pseudo-objeto, pero acá queremos que tenga su
> propio comportamiento: que pueda decir si está listo para cargarse.
>
> Y acá se juntan las dos cosas: la planilla trae los datos y la clase les da comportamiento.
>
> La clase `Alumno` ya está definida. No hace falta que la escribas, porque ya pasaste por POO I y
> II. Fijate que solo tiene el `__init__`, con los mismos datos que vienen en la planilla.

```python
import csv

def leer_inscriptos(ruta):
    inscriptos = []
    with open(ruta, encoding="utf-8") as archivo:
        for fila in csv.DictReader(archivo):
            inscriptos.append(Alumno(
                fila["dni"],
                fila["apellidos"],
                fila["nombres"],
                fila["fecha_nacimiento"],
                fila["celular"],
                fila["nacionalidad"],
                fila["domicilio"],
            ))
    return inscriptos
```

> Es el ejercicio de antes, con un paso más adentro del `for`: antes de agregar la fila a la lista,
> la convertís en un `Alumno`.
>
> Al constructor le pasás cada dato sacándolo de la fila por su título. Y el orden importa: son
> argumentos posicionales, así que van en el mismo orden que en el `__init__`. DNI, apellidos,
> nombres, fecha de nacimiento, celular, nacionalidad y domicilio. Te recomiendo copiar los nombres
> de las claves en vez de tipearlos: un error de tipeo y chau. Con doble clic seleccionás la
> palabra entera.
>
> Y fijate en los paréntesis. Es una sola instrucción, partida en varios renglones: puedo cortarla
> así porque está adentro de un paréntesis abierto. Hay dos: el del `append` y el del `Alumno`. Por
> eso al final cierran los dos.

*(💡 Mostrar, sin borrar lo anterior, que es lo mismo que esto:)*

```python
            alumno = Alumno(fila["dni"], fila["apellidos"], fila["nombres"], fila["fecha_nacimiento"],
                            fila["celular"], fila["nacionalidad"], fila["domicilio"])
            inscriptos.append(alumno)
```

> Es exactamente lo mismo. Usá la que te resulte más cómoda de leer.
>
> Y fijate lo que estamos haciendo: no creo una variable por cada alumno. Los objetos se crean
> solos, a partir de lo que viene en la planilla. Si mañana la planilla trae treinta, se crean
> treinta.

*(▶ Verificar. Sale "¡Cada fila ya es un Alumno!".)*

📌 **Y esto queda escrito:**

```python
# fila (diccionario) -> Alumno(fila["dni"], fila["apellidos"], ...)
# los argumentos van en el MISMO ORDEN que en el __init__
# una instrucción se puede partir en renglones si está adentro de un paréntesis
```

---

## 6. Pasarlo a `planilla.py` (~1:30 min)

*(VS Code, `planilla.py`.)*

> Ahora lo llevamos al proyecto. En la página, hacé clic adentro del editor, Ctrl+A para
> seleccionar todo y Ctrl+C para copiar. Pero ojo: del ejercicio solo te sirve la función. El
> `import csv` ya está en tu archivo.
>
> En VS Code, abrí `planilla.py`. Arriba tenés `import csv` y `from alumno import Alumno`: eso es
> lo que trae tu clase desde el otro archivo, no lo borres. Seleccioná la función
> `leer_inscriptos` entera, desde el `def` hasta el `return`, y pegá encima.

*(Pegar. Mostrar que quedó un solo `def leer_inscriptos`, y que la indentación está bien.)*

> Fijate que no te haya quedado repetida, y que la indentación esté bien: el `def` pegado al margen
> y todo lo demás adentro.

---

## 7. Ejercicio: ¿Está listo para cargarse? (~2:30 min)

*(Página, **Primero, sin controles**.)*

> La clase `Alumno` de tu `alumno.py` ya tiene el `__init__` y `nombre_completo`, que es lo que
> siempre hacíamos. Te los dejé completos, porque con tantos datos un error de tipeo y chau. Ya ves
> que una clase puede crecer un poquito más de lo que estábamos acostumbrados.
>
> Le falta decir si está lista para cargarse. Para eso tiene dos métodos. `problemas()` devuelve
> una lista con los motivos por los que **no** se puede cargar. Todavía no tiene ningún control,
> así que por ahora vuelve siempre vacía. Y `esta_listo()`, que es el que hay que completar:
> tiene que devolver `True` si el alumno no tiene ningún problema, y `False` si tiene alguno.

```python
    def esta_listo(self):
        if len(self.problemas()) == 0:
            return True
        return False
```

> ¿Cuándo está listo? Cuando la lista de problemas está vacía. Y una lista está vacía cuando su
> largo es cero.
>
> Fijate que no hace falta el `else`. Si entra al `if`, hace `return True`, y el `return` corta la
> función ahí: nunca llega a la línea de abajo. Así que si llegó al `return False` es porque no
> entró al `if`.
>
> Ahora, `len(self.problemas()) == 0` ya es `True` o `False`. Así que esto mismo se puede escribir
> en una sola línea:

```python
    def esta_listo(self):
        return len(self.problemas()) == 0
```

> Las dos están bien. La de una línea es la que vas a ver en los ejercicios que siguen.

*(💡 Opcional, 20 segundos: poner `return True` y Verificar. Falla con "¿No estarás devolviendo True siempre?". Volver a la versión buena y Verificar.)*

> Un detalle. Si pensás "como todavía no hay controles, devuelvo `True` y listo", probalo: el
> test te frena. Prueba también un alumno **con** un problema, y ese no puede dar `True`.
> `esta_listo()` tiene que mirar la lista, no adivinar.

---

## 8. Correr el bot sin controles (~2:30 min)

*(VS Code, `alumno.py`.)*

> Copiá solo el `esta_listo`: todo lo demás de la clase ya lo tenés. Pegalo en tu `alumno.py`,
> reemplazando el que tiene el `pass`, y fijate que quede indentado adentro de la clase.
>
> Y algo muy importante: mirá la pestaña del archivo, arriba. Si tiene un puntito en vez de la
> cruz, **el archivo no está guardado**, y el bot va a correr la versión vieja. Ctrl+S, y el
> puntito desaparece. Hacelo también en `planilla.py`.

*(Mostrar el punto, apretar Ctrl+S, mostrar que se va. En la terminal: `clear`.)*

```bash
python bot.py
```

> Ahora sí. En la terminal escribí `python bot.py` (en Linux, `python3`) y enter.
>
> Fijate lo que pasa: se abre el navegador con el simulador del SiGeS, y el bot carga cada
> inscripto solo. Escribe en cada campo, le da a guardar, y sigue con el siguiente. Los ocho en un
> par de segundos.
>
> Acordate de que esto es el simulador: no está cargando nada en el sistema del Ministerio.

*(Cuando termina: cerrar el navegador, Enter en la terminal. Subir en la salida.)*

```text
✅ LISTOS PARA CARGAR: 8
⛔ FRENADOS, los tiene que mirar una persona: 0
```

> Mirá lo que cargó. **Todo.** Incluida Marta Ledesma, que según la planilla nace en 2072. Y Camila
> Sosa, que en el domicilio tiene su DNI, pegado en la columna equivocada.
>
> Frenados: cero. Eso es un bot sin controles: hace exactamente lo que le pedimos, a toda
> velocidad, sin pensar. Ahora le vamos a enseñar.
>
> Para volver a correrlo no hace falta escribir todo de nuevo: en la terminal, la flecha para
> arriba te trae el último comando.

---

## 9. Control 1: el DNI (~3 min)

*(Página, **Los cinco controles** → **Control 1: el DNI**.)*

> Cada control es una pregunta que se le hace al alumno antes de cargarlo. Si la respuesta está
> mal, se agrega un problema a la lista, con un mensaje que explique qué pasa. Ese mensaje es lo
> que va a leer la preceptora, así que tiene que entenderse.
>
> El primero: el DNI tiene que ser solo números, y tener 7 u 8.
>
> Son dos preguntas. ¿Son todos números? Para eso los textos tienen un método, `isdigit()`: da
> `True` si son todos dígitos. Es un método de los textos, como `upper()` o `strip()`, así que va
> después del texto con un punto: `self.dni.isdigit()`. `"40000004"` da `True`, y `"40.000.004"`
> da `False`, por los puntos.
>
> Y la otra: ¿cuántos son? Eso te lo dice `len(self.dni)`, que tiene que ser 7 u 8.

```python
    def problemas(self):
        lista = []
        if not self.dni.isdigit() or len(self.dni) not in (7, 8):
            lista.append("DNI: no es un número válido de 7 u 8 dígitos")
        return lista
```

> Fijate en el `or`. Si falla **cualquiera** de las dos, ya hay un problema: con letras, o con un
> largo que no es 7 ni 8. Si pusieras `and`, el problema aparecería solo cuando fallan las dos a la
> vez. Y `"4000000A"` pasaría como bueno: tiene una letra, pero tiene 8 caracteres, así que la
> segunda condición no falla. Es el primer caso que prueba el test, justamente por eso.
>
> El `not in (7, 8)` se lee como suena: que el largo no esté entre 7 y 8. Es más corto que
> escribir `len(self.dni) != 7 and len(self.dni) != 8`, y dice lo mismo.
>
> Y el mensaje lo escribís vos, pero tiene que decir DNI en algún lado: el bot se lo muestra a la
> preceptora.

*(▶ Verificar. Sale "¡Control del DNI OK!".)*

📌 **Y esto queda escrito:**

```python
# un control = un if que, si algo está mal, agrega un mensaje a la lista
# "40000004".isdigit() -> True   ·   "40.000.004".isdigit() -> False
# si falla CUALQUIERA de las dos condiciones -> or
# len(x) not in (7, 8) -> el largo no es ni 7 ni 8
```

---

## 10. El control en el bot, y cierre (~2 min)

*(VS Code, `alumno.py`: pegar el `if` debajo del comentario `# 1. El DNI`. Ctrl+S. Correr `python bot.py --solo-control`.)*

> Copialo a tu `alumno.py`, debajo del comentario del DNI, y guardá. Y ahora un truco: si le
> agregás `--solo-control`, el bot hace el control pero no abre el navegador. Es más rápido para
> probar.
>
> Frenados: cero. ¿No anduvo? Sí anduvo: todos los DNI de esta planilla están bien. Camila Sosa
> tiene su DNI en el domicilio, pero el DNI en sí está bien escrito. Eso lo atrapa otro control, el
> del domicilio.

*(💡 Para que se vea el freno: abrir `inscriptos.csv`, cambiar el DNI de Paz por `40.000.004`, Ctrl+S y correr de nuevo. Sale `FRENADOS: 1` con el mensaje. **Ctrl+Z y Ctrl+S para dejarlo como estaba.**)*

> Para verlo funcionar, rompo un DNI a propósito: le pongo puntos al de Mateo Paz. Guardo, corro,
> y ahí está: un frenado, con el mensaje que escribimos. Eso es lo que leería la preceptora. Y lo
> dejo como estaba, que la planilla es de prueba.
>
> Así se va armando el bot, como un rompecabezas, pieza por pieza: un control por vez. Quedan
> cuatro más: la fecha de nacimiento, el celular, la nacionalidad y el domicilio. Cada uno es un
> ejercicio de la página, y cada uno que hacés es un alumno con datos rotos que el bot deja de
> cargar.
>
> Y para la clase que viene: leé la clase de Excepciones y hacé sus ejercicios, que son cortitos.
> Nos vemos.

---

## ⏱️ Duración

Narración: **1.905 palabras** (contadas, sin este encabezado) → **~13 min** a 150 palabras por
minuto. Más ~3 min de verificar, pegar y correr el bot: **~16 min**.

✅ **Verificado el 6/10:** todo el código del guion pasa los tests reales de cada ejercicio de la
página, y la variante con `and` del Control 1 falla en `"4000000A"`, como dice la sección 9. La
salida del bot (8 listos y 0 frenados, también con el control del DNI, y 1 frenado al poner
`40.000.004`) sale de correr `bot.py --solo-control` con estas soluciones.
