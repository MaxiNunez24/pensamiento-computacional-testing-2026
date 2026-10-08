# ─────────────────────────────────────────────────────────────────────
#  catalogo.py  —  ESTE ES EL TUYO
# ─────────────────────────────────────────────────────────────────────
#
#  Arma tu catálogo (index.html) a partir de la planilla productos.csv.
#
#  1. Completá las funciones: son las de los ejercicios de la clase
#     "Tu catálogo con Python". Copialas de ahí, una por una.
#  2. Cambiá TITULO y NUMERO, acá abajo.
#  3. En la terminal, parado en esta carpeta:   python catalogo.py
#  4. Abrí index.html con doble clic.
#
#  Cada vez que cambie un precio o un producto: editás productos.csv y
#  volvés a correr el paso 3. El HTML no se toca nunca a mano.
# ─────────────────────────────────────────────────────────────────────

import csv
from urllib.parse import quote

TITULO = "Mi catálogo"

# Tu WhatsApp, sin + ni espacios ni guiones: 54 + 9 + la característica sin
# el 0 + el número sin el 15. Un 221 15 555-0000 queda "5492215550000".
NUMERO = "5492215550000"


def leer_productos(ruta):
    """Ejercicio "Los productos, desde la planilla"."""
    productos = []

    return productos


def link_whatsapp(numero, nombre):
    """Ejercicio "El botón de WhatsApp"."""
    return ""


def tarjeta(producto, numero):
    """La de "Una tarjeta, armada por Python", con el botón de WhatsApp.

    La versión con el botón está en el ejercicio "La página entera", en lo que
    ya viene cargado.
    """
    return ""


def pagina(titulo, productos, numero):
    """Ejercicio "La página entera"."""
    return ""


def generar(ruta_csv, ruta_html, titulo, numero):
    """Ejercicio "Guardar la página"."""
    pass


generar("productos.csv", "index.html", TITULO, NUMERO)
print("Listo: se generó index.html. Abrilo con doble clic para verlo.")
