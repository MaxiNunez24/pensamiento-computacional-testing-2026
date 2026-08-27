# Taller: construir el sistema vos mismo

> Para hacer en un día, antes de dárselo a los alumnos. Todo el código de esta guía **está en
> esta carpeta y probado**: 10 tests en verde y las dos pantallas funcionando.
>
> La idea no es que copies los archivos. Es que **los escribas vos, en este orden**, para que
> cuando un alumno se trabe sepas exactamente dónde está parado.

---

## Primero: la pregunta de Flask

> *"Yo pensaba que hacía falta aprender mucho más para lograr un sistema profesional, pero esto es
> muy rústico… ¿es la forma adecuada? Los otros frameworks por detrás hacen esto mismo, ¿no?"*

**Sí, hacen esto mismo.** Y sí, es la forma adecuada. Vale la pena desarmarlo porque de esto
depende cómo dirigís el proyecto.

### Qué es Flask realmente

Flask no es "sesiones y UI". Flask es el **framework web**: lo que conecta una dirección con una
función de Python.

```python
@app.route("/lista")     # cuando alguien entra a /lista
def lista():             # se ejecuta esta función
    return "hola"        # y esto es lo que ve
```

Eso —**mapear URLs a funciones**— es el 90% de lo que hace *cualquier* framework web. Django,
Rails, Laravel, Express: todos hacen eso. Lo que cambia es cuánto traen de fábrica.

| | Flask | Django |
|---|---|---|
| Rutas, request/response, plantillas, sesiones | ✅ | ✅ |
| ORM (hablar con la base sin escribir SQL) | ❌ lo elegís vos | ✅ incluido |
| Panel de administración automático | ❌ | ✅ |
| Sistema de usuarios armado | ❌ | ✅ |
| Migraciones de base de datos | ❌ | ✅ |

Django trae más. Eso **no lo hace más profesional**: lo hace más grande. Django existe para
manejar complejidad que aparece en sistemas grandes, con equipos grandes.

### Por qué acá corresponde Flask

**Por el tamaño real del problema.** ~30 cursos, unos cientos de alumnos, diez personas usándolo a
la vez, dentro de un edificio. Eso es chico. Usar Django acá es alquilar un camión para llevar la
compra.

**Y sobre todo, por lo pedagógico.** Si arrancás con Django, tus alumnos aprenden *Django*: cómo se
llaman sus archivos, qué comando genera qué. Cuando algo se rompe no tienen idea de qué está
pasando, porque nunca vieron el mecanismo. Con Flask ven la cadena entera:

```
alguien toca un botón  →  llega un pedido  →  corre TU función
   →  que le pregunta al modelo  →  que lee los datos  →  y devuelve una pantalla
```

Cuando entendieron eso, **cualquier framework es "ah, esto automatiza lo que yo hacía a mano"**. Al
revés no funciona.

### Qué te vas a perder, para que lo sepas

Ser honesto con esto es parte de dirigir bien:

- **Vas a escribir el SQL a mano.** A esta escala está bien, y encima se aprende.
- **Los cambios de estructura de la base son manuales.** Django tiene migraciones; vos vas a tener
  que acordarte de actualizar la base cuando agregues un campo. **Anotalo, es la trampa real.**
- **Cada pantalla la construís.** No hay panel de administración regalado.
- **La seguridad hay que ponerla a propósito**: contraseñas hasheadas, sesiones. Flask te da las
  herramientas, no te las aplica solo.

### La definición de "profesional" que te sirve

Un sistema profesional no es el que usa el framework de moda. Es el que:

- **funciona** y resuelve el problema de verdad,
- **está probado**, así se puede cambiar sin miedo,
- **otro puede mantenerlo**, porque se entiende,
- **no pierde los datos**, porque tiene copias,
- y **está donde la gente lo necesita**.

Una app en Flask con tests y backups es más profesional que una en Django sin ellos. Vas a tener
las cinco cosas.

---

## Antes de arrancar (20 minutos)

```bash
mkdir sistema && cd sistema
python -m venv .venv
.venv\Scripts\activate        # en Windows. En Linux/Mac: source .venv/bin/activate
pip install flask pytest
```

El **entorno virtual** (`venv`) es una carpeta donde viven las librerías de *este* proyecto y de
ningún otro. Sin él, instalar algo para un proyecto puede romper otro.

> 🧑‍🏫 **Para cuando lo des:** hacé que instalen algo, cierren la terminal, abran otra y vean que
> "no está instalado". Ahí se entiende `activate` de una vez y para siempre.

---

## Etapa 1 — El sistema sin pantalla (2 horas)

**Archivo: `modelo.py`.** Nada de web todavía. Ni Flask, ni HTML.

Esta es la etapa que más se subestima y la más importante. Acá van las **clases** (`Alumno`,
`Curso`) y las **reglas** (contar presentes, calcular porcentaje).

Escribí `modelo.py` de esta carpeta. Mientras lo hacés, prestá atención a tres cosas:

1. **`Curso` guarda la asistencia como un diccionario de diccionarios**:
   `{"2026-08-21": {"***REMOVED***": "P"}}`. Día → alumno → estado. Que elijan ellos esta estructura es
   un ejercicio buenísimo: si la eligen mal, todo lo demás se complica y **lo van a sentir**.
2. **`presentes()` cuenta `P` y `T` juntos.** El que llegó tarde vino. Es una *regla del negocio*,
   no una decisión técnica, y es el ejemplo perfecto de por qué hay que preguntarle al cliente.
3. **`marcar()` valida.** Si el DNI no está en el curso, `raise ValueError`. Un modelo que acepta
   cualquier cosa es un modelo que después miente.

### Y ahora los tests (`test_modelo.py`)

```bash
pytest
```

Los ocho tests de esta carpeta cubren: inscribir, no duplicar, marcar, contar, el que llega tarde,
el porcentaje, el porcentaje **sin datos** (que no explote) y marcar a alguien de otro curso.

> 🧑‍🏫 **El momento de la clase:** cambiá `('P', 'T')` por `('P',)` en `presentes()` y corré
> `pytest`. Un test se pone en rojo y dice exactamente cuál. **Eso** es para qué sirven los tests, y
> se entiende en diez segundos.

---

## Etapa 2 — Que no se pierda al cerrar (1 hora)

**Archivo: `datos.py`.**

Un objeto de Python vive en la memoria. Cuando el programa termina, se evapora. Guardar es pasar
esos objetos a texto y volver a armarlos al arrancar.

Dos funciones y nada más: `guardar(curso)` y `cargar()`.

Lo que hay que mirar:

- **`json.dumps` no sabe guardar tus objetos.** Hay que convertirlos a diccionarios a mano. Eso
  molesta, y esa molestia es la que después explica para qué sirve un ORM.
- **`cargar()` devuelve un curso vacío si el archivo no existe.** Que el programa arranque bien la
  primera vez, sin que nadie tenga que crear un archivo antes.
- **`ensure_ascii=False`** para que los acentos se guarden como acentos.

> 🧑‍🏫 Abrí el `datos.json` con el Bloc de notas y mostráselo. Ver los datos en texto plano, que
> se pueden leer y hasta editar a mano, desmitifica todo.

---

## Etapa 3 — La primera pantalla (1 hora)

**Archivo: `app.py`.** Arrancá con esto y nada más:

```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def inicio():
    return "<h1>Hola CFP</h1>"

if __name__ == "__main__":
    app.run(debug=True)
```

```bash
python app.py
```

Abrí `http://localhost:5000`. **Ese momento es el que engancha**: hay un servidor web corriendo en
tu máquina y vos lo escribiste en seis líneas.

Después: `render_template("lista.html", ...)` en vez de devolver texto. Las plantillas van en
`templates/` (Flask las busca ahí solo) y son HTML con agujeros:

```html
{% for a in alumnos %}
  <li>{{ a.nombre_completo() }}</li>
{% endfor %}
```

> 🧑‍🏫 **A tus alumnos las plantillas se las das hechas.** No hace falta enseñar HTML: lo que
> escriben ellos es el `{% for %}` y el `{{ }}`, que es un bucle y una variable — cosas que ya
> saben.

---

## Etapa 4 — Que se pueda guardar desde la web (2 horas)

Acá aparecen los dos conceptos que hay que entender de verdad:

**GET y POST.** La misma dirección hace dos cosas distintas:

```python
@app.route("/lista/<dia>")                      # GET: mostrame la lista
@app.route("/lista/<dia>", methods=["POST"])    # POST: tomá, guardá esto
```

**`request.form`** trae lo que el usuario tocó, con el `name` de cada control. Por eso los radios
del template se llaman `estado-***REMOVED***`: así el código sabe de quién es cada respuesta.

Y una trampa que conviene conocer antes de pisarla:

> ⚠️ **Después de guardar, redirigí.** Si el POST devuelve la página directamente, cuando el
> usuario apriete F5 el navegador re-envía el formulario y guarda de nuevo. Se arregla con
> `return redirect(...)`. Se llama **POST-Redirect-GET** y le pasa a todo el mundo la primera vez.

---

## Etapa 5 — La segunda pantalla (20 minutos)

**`/merienda`**: un número grande.

```python
@app.route("/merienda")
def merienda():
    curso = datos.cargar()
    return render_template("merienda.html", cuantos=curso.presentes(date.today().isoformat()))
```

Tres líneas. **Y esa es toda la lección**: se agregó una pantalla nueva, para otro usuario, con
otra pregunta, y **no hubo que tocar el modelo ni los datos**.

> 🧑‍🏫 Este es el mejor momento de todo el taller para decir en voz alta por qué separamos las
> capas. No lo digas antes: se entiende recién cuando lo ven pasar.

---

## Etapa 6 — Que entre todo el CFP (10 minutos)

```python
app.run(host="0.0.0.0", port=5000)
```

`0.0.0.0` significa "aceptá conexiones de otras máquinas de la red". Averiguá tu IP (`ipconfig`) y
entrá desde el celular a `http://192.168.x.x:5000`.

> 🧑‍🏫 **Que lo hagan todos a la vez, con su teléfono, en el aula.** Ese momento vale más que
> cualquier explicación de qué es un servidor.

---

## Cómo guiarlos: dónde se van a trabar

Esto es lo que más te va a servir el día que lo des.

| Se traban en | Lo que van a decir | Qué está pasando | Qué preguntarles |
|---|---|---|---|
| `venv` | "no me reconoce flask" | No activaron el entorno | "¿Ves `(.venv)` al principio de la línea?" |
| Rutas | "no pasa nada cuando toco el botón" | Falta `methods=["POST"]` | "¿El formulario manda POST y la ruta lo acepta?" |
| Plantillas | "no me muestra el nombre" | Pasaron la variable con otro nombre | "¿Cómo se llama en el `render_template` y cómo en el HTML?" |
| `request.form` | "me guarda vacío" | El `name` del input no coincide | "Imprimí `request.form` y mirá qué llegó" |
| Guardar | "se guarda dos veces" | Falta el redirect | "¿Qué pasa si apretás F5?" |
| JSON | "no puede serializar Alumno" | Están mandando objetos a `json.dumps` | "¿Qué sabe guardar JSON? ¿Y qué le estás dando?" |
| Todo | "no anda" | 90% es un error escrito en la terminal | **"Leé el último renglón del error en voz alta"** |

La última es la más importante. **El error dice qué pasa y en qué línea.** Enseñarles a leerlo es
más valioso que resolvérselo, y es lo que más rápido los vuelve autónomos.

---

## El orden importa, y este es el porqué

Si tuviera que defender una sola decisión de todo el taller es esta: **la web va al final**.

Es tentador arrancar por Flask porque es lo vistoso. Pero si arrancás ahí, las reglas terminan
escritas adentro de las funciones que dibujan pantallas, y a partir de ahí no se pueden probar, no
se pueden reusar y no se pueden cambiar.

Exactamente el problema que tiene hoy el Excel del CFP: **las fórmulas mezcladas con las celdas**.
Por eso se rompe todo al borrar una celda.

Cuando lo construís en este orden, el sistema queda dividido solo. No porque lo hayas diseñado
bien: porque no había otra forma de avanzar.
