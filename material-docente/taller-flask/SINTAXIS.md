# Glosario: la sintaxis de Flask, símbolo por símbolo

> Para leer al lado del código. Nada de acá es magia de Flask: casi todo es Python normal usado de
> una forma que todavía no habías visto.
>
> 🎓 **Los conceptos de Python que no vimos en el curso** (decoradores, `with`, `try/except`,
> `__init__`/`self`, comprensiones, `enumerate`) tienen ahora su propia clase **para los
> alumnos**, con ejercicios: **Lo que Python hace por vos**. Cada atajo está al lado de cómo
> sería el mismo código sin él. Este archivo se queda con lo específico de Flask.

---

## 1. El `@` — decoradores

Es la pregunta que hiciste, y es la buena.

```python
@app.route("/lista")
def lista():
    return "hola"
```

El `@` **no es de Flask**: es de Python, y se llama **decorador**. Significa *"antes de seguir,
pasá esta función por acá"*.

### Qué está pasando de verdad

Las dos líneas de arriba son **exactamente equivalentes** a esto:

```python
def lista():
    return "hola"

lista = app.route("/lista")(lista)     # ← esto hace el @
```

O sea: se define la función, y después se la manda a `app.route("/lista")`, que la **anota en una
libreta**: *"cuando alguien pida /lista, llamá a esta función"*. Flask guarda esa libreta y, cuando
llega un pedido, busca ahí.

### Probalo en dos minutos, sin Flask

Escribí esto en un archivo suelto y corrélo. Es el mejor ejercicio para entender el `@`:

```python
def gritar(funcion):
    def envuelta():
        return funcion().upper() + "!!!"
    return envuelta

@gritar
def saludar():
    return "hola"

print(saludar())        # HOLA!!!
```

`saludar` ya no es la función que escribiste: es `envuelta`, que llama a la tuya y le hace algo
al resultado. **Un decorador es una función que recibe una función y devuelve otra.**

> 🧑‍🏫 **Para la clase:** este ejemplo dura cinco minutos y desmitifica el `@` para siempre. No hace
> falta que sepan escribir decoradores; sí que sepan que no es magia.

---

## 2. Las partes de una ruta

```python
@app.route("/lista/<dia>", methods=["POST"])
def guardar_lista(dia):
    ...
```

| Parte | Qué es |
|---|---|
| `app` | El objeto Flask, creado con `Flask(__name__)`. Es "la aplicación". |
| `.route(...)` | El decorador que anota la dirección en la libreta. |
| `"/lista/<dia>"` | La dirección. Lo que va entre `< >` es un **hueco**. |
| `<dia>` | Ese pedazo de la URL **llega como parámetro** de la función. Por eso `def guardar_lista(dia)`. |
| `methods=["POST"]` | Qué tipo de pedido acepta. Sin esto, solo acepta GET. |

Si alguien entra a `/lista/2026-08-28`, Flask llama a `guardar_lista(dia="2026-08-28")`.

> ⚠️ **El nombre del hueco y el del parámetro tienen que coincidir.** `<dia>` con `def f(dia)`. Si
> no, Flask tira un error que asusta pero dice exactamente eso.

---

## 3. GET y POST

Son los dos tipos de pedido que vas a usar. La diferencia es de **intención**:

| | GET | POST |
|---|---|---|
| Qué significa | "mostrame algo" | "tomá esto y guardalo" |
| Lo dispara | escribir una dirección, un link | apretar el botón de un formulario |
| Se puede repetir sin peligro | sí | **no** (guardaría dos veces) |

```python
@app.route("/lista/<dia>")                      # GET  → mostrar
@app.route("/lista/<dia>", methods=["POST"])    # POST → guardar
```

Misma dirección, dos funciones distintas, según cómo se pida.

---

## 4. `request` — lo que mandó el usuario

```python
from flask import request

estado = request.form.get("estado-40000001", "")
```

- `request` es el **pedido que está llegando ahora**. Flask lo pone a mano; no hay que pasarlo.
- `request.form` es un diccionario con lo que venía en el formulario. **Las claves son los `name`
  de los controles del HTML.**
- `.get(clave, "")` es el `.get` de diccionarios de siempre: si no está, devolvé `""` en vez de
  explotar. Acá importa: si el usuario no marcó nada, la clave no viene.

Por eso en el HTML los radios se llaman así:

```html
<input type="radio" name="estado-{{ a.dni }}" value="P">
```

El `name` es el puente entre la pantalla y el Python. **Si no coinciden, llega vacío y no hay error
que avise** — es la falla más silenciosa del taller.

> 🧑‍🏫 Cuando alguien diga "me guarda vacío": `print(request.form)` y mirar qué llegó de verdad.

---

## 5. `render_template` — el HTML con agujeros

```python
return render_template("lista.html", curso=curso, dia=dia)
```

- Busca el archivo en la carpeta **`templates/`**. Eso es fijo: Flask siempre mira ahí.
- Todo lo que le pases por nombre (`curso=curso`) queda disponible **con ese nombre** adentro del
  HTML.

### Los dos símbolos de las plantillas

```html
{{ a.nombre_completo() }}      ← MOSTRAR el valor de algo
{% for a in alumnos %}         ← HACER algo (bucle, if)
```

La regla es fácil de recordar:

| | Para qué | Se ve en la pantalla |
|---|---|---|
| `{{ }}` | mostrar un valor | **sí** |
| `{% %}` | ejecutar lógica | no |

Y todo `{% for %}` o `{% if %}` se cierra:

```html
{% for a in alumnos %}
  <li>{{ a.nombre_completo() }}</li>
{% else %}
  <li>Todavía no hay alumnos.</li>
{% endfor %}
```

> 💡 Ese `{% else %}` adentro de un `for` **no existe en Python**: es de las plantillas, y corre
> cuando la lista está vacía. Es comodísimo y sorprende a todo el mundo.

---

## 6. `url_for` y `redirect`

```python
return redirect(url_for("lista", dia=dia))
```

- `url_for("lista", dia="2026-08-28")` arma la dirección **a partir del nombre de la función**, no
  escribiéndola a mano. Devuelve `/lista/2026-08-28`.
- `redirect(...)` le dice al navegador *"andá a esta otra dirección"*.

**Por qué no escribir la URL a mano:** el día que cambies `"/lista/<dia>"` por `"/asistencia/<dia>"`,
con `url_for` no hay que tocar nada más. Escritas a mano, hay que buscarlas por todo el proyecto y
alguna se te escapa.

---

## 7. `if __name__ == "__main__":`

```python
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
```

Esto tampoco es de Flask: es Python de siempre. Significa **"esto corre solo si ejecutás ESTE
archivo directamente"**, no si otro archivo lo importa.

Sin eso, cuando `test_app.py` haga `import app`, arrancaría un servidor en medio de los tests.

| Parámetro | Qué hace |
|---|---|
| `host="0.0.0.0"` | Aceptar conexiones **de otras máquinas de la red**. Sin esto, solo desde esta compu. |
| `port=5000` | El número de puerta. La dirección queda `http://la-ip:5000`. |
| `debug=True` | Se reinicia solo al guardar y muestra el error en pantalla. **Solo mientras desarrollás.** |

> ⚠️ **`debug=True` jamás en producción.** Con debug activado, cualquiera que provoque un error ve
> el código y puede ejecutar Python en el servidor. Es literalmente una consola abierta.

---

## 8. Chuleta

```python
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)                      # crear la aplicación

@app.route("/")                            # GET /
def inicio():
    return "hola"                          # texto → se muestra tal cual

@app.route("/curso/<numero>")              # <numero> llega como parámetro
def ver(numero):
    return render_template("curso.html",   # busca templates/curso.html
                           numero=numero)  # y ahí adentro {{ numero }}

@app.route("/guardar", methods=["POST"])   # solo POST
def guardar():
    dato = request.form.get("campo", "")   # lo que mandó el formulario
    return redirect(url_for("inicio"))     # y lo mandamos a otra página
```

```html
{{ variable }}                 <!-- mostrar -->
{% if x %} ... {% endif %}     <!-- decidir -->
{% for a in lista %} ... {% endfor %}   <!-- repetir -->
<form method="post">           <!-- el botón manda POST -->
  <input name="campo">         <!-- 'campo' es la clave en request.form -->
</form>
```

---

## 9. Los cinco errores que vas a ver

| El error dice | Qué pasa |
|---|---|
| `404 Not Found` | No hay ninguna ruta con esa dirección. Fijate el `@app.route`. |
| `405 Method Not Allowed` | La ruta existe pero no acepta POST. Falta `methods=["POST"]`. |
| `TemplateNotFound: lista.html` | El archivo no está en `templates/` o el nombre no coincide. |
| `'curso' is undefined` (en el HTML) | No se lo pasaste en `render_template`, o con otro nombre. |
| `Address already in use` | Quedó otro Flask corriendo. Cerrá la terminal anterior. |

Los cinco dicen exactamente qué pasa. **Leerlos es la habilidad que hay que enseñar**, más que
memorizar la solución.
