"""Etapa 3 y 4: la pantalla.

Flask hace UNA cosa esencial: conecta una dirección (URL) con una función de
Python. Eso es todo el misterio.

    @app.route("/lista")     ->  cuando alguien entra a /lista
    def lista():             ->  se ejecuta esta función
        return "hola"        ->  y lo que devuelve es lo que ve

Fijate que este archivo NO calcula nada. Le pide todo al modelo. Si acá
apareciera un `sum()` o un `if estado == "P"`, sería la señal de que una regla
se escapó del lugar donde se puede probar.
"""

from datetime import date

from flask import Flask, redirect, render_template, request, url_for

import datos

app = Flask(__name__)


@app.route("/")
def inicio():
    return redirect(url_for("lista", dia=date.today().isoformat()))


@app.route("/lista/<dia>")
def lista(dia):
    curso = datos.cargar()
    return render_template(
        "lista.html",
        curso=curso,
        dia=dia,
        alumnos=curso.activos(),
        presentes=curso.presentes(dia),
        hay_clase=curso.es_dia_de_clase(dia),
    )


@app.route("/lista/<dia>", methods=["POST"])
def guardar_lista(dia):
    curso = datos.cargar()
    # request.form trae lo que el usuario tocó, con el `name` de cada control.
    for alumno in curso.activos():
        estado = request.form.get(f"estado-{alumno.dni}", "")
        curso.marcar(dia, alumno.dni, estado)
    datos.guardar(curso)
    # Redirigir después de guardar: si no, al apretar F5 el navegador
    # re-envía el formulario y vuelve a guardar. Se llama patrón POST-Redirect-GET.
    return redirect(url_for("lista", dia=dia))


@app.route("/merienda")
def merienda():
    """La pantalla de las auxiliares: los mismos datos, otra pregunta."""
    curso = datos.cargar()
    hoy = date.today().isoformat()
    return render_template("merienda.html", cuantos=curso.presentes(hoy))


if __name__ == "__main__":
    # host="0.0.0.0" = "aceptá conexiones de otras máquinas de la red".
    # Sin esto solo se puede entrar desde esta misma computadora.
    app.run(host="0.0.0.0", port=5000, debug=True)
