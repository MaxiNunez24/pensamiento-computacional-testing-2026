"""Genera un catálogo por cada emprendimiento aprobado en la planilla del formulario.

    python generar.py respuestas.xlsx        (o .csv: la planilla bajada a mano)
    python generar.py                        (así corre en GitHub: lee la planilla de Google)

Para leer la planilla de Google y bajar las fotos hacen falta las credenciales de
la cuenta de servicio: la variable GOOGLE_CREDENTIALS (el JSON entero) o el
archivo credenciales.json al lado de este, y PLANILLA_ID (lo que está entre /d/ y
/edit en la dirección de la planilla). Sin credenciales también anda: los
productos salen con el emoji en vez de la foto.

Deja todo en la carpeta sitio/, que se borra y se arma de cero cada vez:

    sitio/index.html                    la vidriera: todos los catálogos, con su QR
    sitio/imprimir.html                 un QR grande por emprendimiento, para el stand
    sitio/<emprendimiento>/index.html   cada catálogo, con sus fotos

Es el catálogo de la clase "Tu catálogo con Python", con una diferencia que
importa: los datos los escribe cualquiera en un formulario público. Por eso todo
texto pasa por escape() antes de ir al HTML (si no, alguien podría meter un
<script> en la descripción y se publicaría en nombre del CFP), y nada se publica
sin que una persona tilde "Aprobado".
"""
import csv
import json
import os
import pathlib
import re
import shutil
import sys
import unicodedata
from html import escape
from urllib.parse import quote

AQUI = pathlib.Path(__file__).resolve().parent
ESTILOS = AQUI / "estilos"
SALIDA = AQUI / "sitio"
SITIO_URL = "https://cfp401-ensenada.github.io/catalogos/"
MAX_PRODUCTOS = 12

# Las columnas que se usan, con el título exacto de la pregunta del formulario.
NOMBRE = "Nombre del emprendimiento"
RUBRO = "Rubro"
LEMA = "Contanos qué hacés"
LOGO = "Logo"
EMOJI = "Un emoji que lo represente"     # ya no está en el formulario: si viene, se usa
WHATSAPP = "WhatsApp para consultas"
INSTAGRAM = "Instagram"
ESTILO = "Estilo del catálogo"
MOSTRAR = "¿Qué querés mostrar de tus productos?"
CONFORMIDAD = "Conformidad"
APROBADO = "Aprobado"

# Las opciones de MOSTRAR, tal cual están en el formulario. Google guarda las
# tildadas juntas, separadas por coma: "Precio, Descripción, Foto".
OPCIONES = {"precio": "Precio", "descripcion": "Descripción", "foto": "Foto",
            "whatsapp": "Un botón de WhatsApp en cada producto"}
EMOJI_POR_DEFECTO = "🛍️"

# Los estilos que se pueden elegir en el formulario: los colores de la marca,
# que el catálogo usa como variables de CSS (ver "Que se vea como tu marca").
PALETAS = {
    "Natural": {"--fondo": "#d3cac8", "--texto": "#5b6844", "--acento": "#5f6f45",
                "--linea": "#93a77c", "--marca": "#ffffff", "--fondo-foto": "#ecd3dc"},
    "Dulce": {"--fondo": "#f6dfe4", "--texto": "#6d2c3f", "--acento": "#a8324f",
              "--linea": "#d98a9c", "--marca": "#7a1f36", "--fondo-foto": "#fff2f5"},
    "Mar": {"--fondo": "#d8ecf3", "--texto": "#1f4e63", "--acento": "#1f6f8b",
            "--linea": "#7fb6c9", "--marca": "#0f3a4d", "--fondo-foto": "#f2fafc"},
    "Elegante": {"--fondo": "#1f1f1f", "--texto": "#e8e2d0", "--acento": "#b8963e",
                 "--linea": "#8a7440", "--marca": "#e6c66a", "--fondo-foto": "#2c2c2c"},
    "Alegre": {"--fondo": "#fff1d6", "--texto": "#7a3e00", "--acento": "#e0670b",
               "--linea": "#f2a541", "--marca": "#c2410c", "--fondo-foto": "#fffaf0"},
}


# ─────────────────────────── Los datos ───────────────────────────────────

def texto(valor):
    """Lo que venga de la planilla (None, un número, un booleano), como texto limpio."""
    if valor is None:
        return ""
    if isinstance(valor, float) and valor.is_integer():
        valor = int(valor)
    return re.sub(r"\s+", " ", str(valor)).strip()


def slug(nombre):
    """El nombre, apto para una dirección: "Café & Té Ñandú" -> "cafe-te-nandu"."""
    sin_tildes = "".join(c for c in unicodedata.normalize("NFD", nombre)
                         if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", sin_tildes.lower()).strip("-")


def esta_aprobada(fila):
    """La casilla de Google llega como TRUE (o VERDADERO, según el idioma de la cuenta)."""
    return texto(fila.get(APROBADO)).lower() in {"true", "verdadero", "sí", "si", "x", "1"}


def ultimas_aprobadas(filas):
    """{slug: fila}: por cada emprendimiento, su respuesta aprobada MÁS NUEVA.

    Las filas llegan en el orden en que se respondieron. Una respuesta nueva sin
    aprobar no reemplaza a nada: sigue publicada la anterior hasta que alguien
    la revise.
    """
    elegidas = {}
    for fila in filas:
        nombre = texto(fila.get(NOMBRE))
        if nombre and esta_aprobada(fila):
            elegidas[slug(nombre)] = fila
    return elegidas


def precio(valor):
    """"4500" -> "$4.500". Vacío, cero o algo que no es un número -> "Consultar"."""
    entero = texto(valor).split(",")[0]
    digitos = re.sub(r"\D", "", entero)
    if not digitos or int(digitos) == 0:
        return "Consultar"
    return "$" + f"{int(digitos):,}".replace(",", ".")


def numero_whatsapp(valor):
    """"2215550000" -> "5492215550000" (54, el 9 de celular, y el número). Si no son 10 números, None."""
    digitos = re.sub(r"\D", "", texto(valor))
    if len(digitos) == 13 and digitos.startswith("549"):
        return digitos
    if len(digitos) == 10:
        return "549" + digitos
    return None


def que_mostrar(fila):
    """Lo que eligió mostrar de sus productos: {"precio": True, "foto": False, ...}.
    Si la pregunta no se contestó (o la planilla es de antes de que existiera), todo."""
    elegido = texto(fila.get(MOSTRAR))
    if not elegido:
        return {clave: True for clave in OPCIONES}
    return {clave: opcion in elegido for clave, opcion in OPCIONES.items()}


def otros_datos(valor):
    """"Material: PLA\\nMedidas: 10 x 15 cm" -> {"Material": "PLA", "Medidas": "10 x 15 cm"}.

    Uno por renglón, con dos puntos. Los renglones sin dos puntos (o sin nada de
    un lado) se ignoran: es texto libre, y la gente escribe de todo.
    """
    datos = {}
    for renglon in str(valor or "").splitlines():
        clave, dos_puntos, dato = renglon.partition(":")
        clave, dato = texto(clave), texto(dato)
        if dos_puntos and clave and dato:
            datos[clave[0].upper() + clave[1:]] = dato
    return datos


def productos_de(fila):
    """La planilla tiene una columna por pregunta: Producto 1 · Nombre, Producto 1 · Precio...
    Devuelve la lista de productos que tienen nombre, en orden."""
    productos = []
    for n in range(1, MAX_PRODUCTOS + 1):
        nombre = texto(fila.get(f"Producto {n} · Nombre"))
        if not nombre:
            continue
        productos.append({
            "numero": n,
            "nombre": nombre,
            "precio": precio(fila.get(f"Producto {n} · Precio")),
            "descripcion": texto(fila.get(f"Producto {n} · Descripción")),
            "otros": otros_datos(fila.get(f"Producto {n} · Otros datos")),
            "foto": texto(fila.get(f"Producto {n} · Foto")),
        })
    return productos


def revisar(fila):
    """Lo que impide publicar, aunque esté aprobado (por ejemplo, si se editó la planilla a mano)."""
    problemas = []
    if not texto(fila.get(NOMBRE)):
        problemas.append("falta el nombre del emprendimiento")
    if numero_whatsapp(fila.get(WHATSAPP)) is None:
        problemas.append(f'el WhatsApp "{texto(fila.get(WHATSAPP))}" no tiene 10 números')
    if not productos_de(fila):
        problemas.append("no tiene ningún producto")
    if not texto(fila.get(CONFORMIDAD)):
        problemas.append("no tildó la conformidad para publicar")
    return problemas


def id_de_drive(link):
    """El formulario guarda cada archivo como un link de Drive; de ahí sale su id."""
    m = re.search(r"[?&]id=([\w-]+)", link) or re.search(r"/d/([\w-]+)", link)
    return m.group(1) if m else None


# ─────────────────────────── Leer la planilla ────────────────────────────

def leer_planilla(ruta):
    """La planilla bajada a mano: .xlsx (Archivo → Descargar) o .csv."""
    ruta = pathlib.Path(ruta)
    if ruta.suffix.lower() == ".csv":
        with open(ruta, encoding="utf-8-sig", newline="") as f:
            return [dict(fila) for fila in csv.DictReader(f)]
    import openpyxl
    hoja = openpyxl.load_workbook(ruta, data_only=True).worksheets[0]
    filas = hoja.iter_rows(values_only=True)
    titulos = [texto(t) for t in next(filas)]
    resultado = []
    for valores in filas:
        if all(v in (None, "") for v in valores):
            continue
        resultado.append({t: crudo(v) for t, v in zip(titulos, valores) if t})
    return resultado


def crudo(valor):
    """Una celda del .xlsx como texto, TAL CUAL: sin juntar los renglones. ("Otros datos" es uno
    por renglón; texto() los juntaría en uno solo. La limpieza se hace después, campo por campo.)"""
    if valor is True or valor is False:
        return "TRUE" if valor else "FALSE"
    if valor is None:
        return ""
    if isinstance(valor, float) and valor.is_integer():
        return str(int(valor))
    return str(valor)


def sesion_de_google():
    """Una sesión con la cuenta de servicio, o None si no hay credenciales."""
    datos = os.environ.get("GOOGLE_CREDENTIALS")
    archivo = AQUI / "credenciales.json"
    if not datos and archivo.exists():
        datos = archivo.read_text(encoding="utf-8")
    if not datos:
        return None
    from google.oauth2 import service_account
    from google.auth.transport.requests import AuthorizedSession
    credenciales = service_account.Credentials.from_service_account_info(
        json.loads(datos),
        scopes=["https://www.googleapis.com/auth/spreadsheets.readonly",
                "https://www.googleapis.com/auth/drive.readonly"])
    return AuthorizedSession(credenciales)


def leer_de_google(sesion, planilla_id):
    """La primera hoja de la planilla, con la API de Google Sheets."""
    base = f"https://sheets.googleapis.com/v4/spreadsheets/{planilla_id}"
    hojas = sesion.get(base, params={"fields": "sheets.properties.title"})
    hojas.raise_for_status()
    hoja = hojas.json()["sheets"][0]["properties"]["title"]
    r = sesion.get(f"{base}/values/{quote(hoja)}")
    r.raise_for_status()
    valores = r.json().get("values", [])
    if not valores:
        return []
    titulos = [texto(t) for t in valores[0]]
    # La API corta cada fila en la última celda con algo: se completa con vacíos.
    return [dict(zip(titulos, fila + [""] * (len(titulos) - len(fila)))) for fila in valores[1:]]


def bajar_imagen(sesion, link, destino):
    """Baja una foto de Drive, la achica (las del celular pesan varios MB) y la guarda como JPG.
    Devuelve el nombre del archivo, o None si no se pudo: el producto sale con el emoji."""
    id_archivo = id_de_drive(link) if link else None
    if not sesion or not id_archivo:
        return None
    try:
        r = sesion.get(f"https://www.googleapis.com/drive/v3/files/{id_archivo}",
                       params={"alt": "media", "supportsAllDrives": "true"})
        r.raise_for_status()
        import io
        from PIL import Image, ImageOps
        imagen = ImageOps.exif_transpose(Image.open(io.BytesIO(r.content))).convert("RGB")
        imagen.thumbnail((900, 900))
        destino.parent.mkdir(parents=True, exist_ok=True)
        imagen.save(destino, "JPEG", quality=82, optimize=True)
        return destino.name
    except Exception as e:                              # noqa: BLE001
        print(f"   ⚠️  no se pudo bajar {link}: {e}")
        return None


# ─────────────────────────── El HTML ─────────────────────────────────────

def link_whatsapp(numero, mensaje):
    return f"https://wa.me/{numero}?text=" + quote(mensaje)


def qr(link):
    return "https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=" + quote(link, safe="")


def detalles(**datos):
    """Los datos de más de un producto, los que haya puesto: material, medidas, talles...

    Con **datos, la función recibe CUALQUIER dato con nombre, sin saber de
    antemano cuáles son. Y como se la llama desarmando un diccionario
    (detalles(**producto["otros"])), las claves pueden tener espacios:
    "Tiempo de entrega" no sería un nombre válido escrito a mano, pero así sí.
    """
    if not datos:
        return ""
    renglones = "".join(f"\n            <li><strong>{escape(clave)}:</strong> {escape(valor)}</li>"
                        for clave, valor in datos.items())
    return f'\n        <ul class="detalles">{renglones}\n        </ul>'


def tarjeta(producto, numero, emoji, mostrar=None):
    """Una tarjeta. `mostrar` dice qué partes eligió mostrar (ver que_mostrar); sin nada, todas."""
    mostrar = mostrar or {clave: True for clave in OPCIONES}
    nombre = escape(producto["nombre"])
    if mostrar["foto"] and producto.get("archivo"):
        foto = f'<img class="producto__foto" src="fotos/{producto["archivo"]}" alt="{nombre}" loading="lazy">'
    else:
        foto = f'<div class="producto__foto">{escape(emoji)}</div>'
    descripcion = (f'\n        <p class="descripcion">{escape(producto["descripcion"])}</p>'
                   if mostrar["descripcion"] and producto["descripcion"] else "")
    precio_ = f'\n        <p class="precio">{escape(producto["precio"])}</p>' if mostrar["precio"] else ""
    mensaje = link_whatsapp(numero, f"Hola, vi tu catálogo y quería consultar por: {producto['nombre']}")
    boton = (f'\n        <a class="consultar" href="{escape(mensaje)}">Consultar por WhatsApp</a>'
             if mostrar["whatsapp"] else "")
    return f"""
    <article class="producto">
        {foto}
        <h2>{nombre}</h2>{descripcion}{detalles(**producto.get("otros", {}))}{precio_}{boton}
    </article>"""


def pagina(fila, productos, logo=None):
    """El catálogo de un emprendimiento. `productos` puede traer "archivo" (la foto ya bajada)."""
    nombre = texto(fila.get(NOMBRE))
    numero = numero_whatsapp(fila.get(WHATSAPP))
    emoji = texto(fila.get(EMOJI)) or EMOJI_POR_DEFECTO
    paleta = PALETAS.get(texto(fila.get(ESTILO)), PALETAS["Natural"])
    variables = " ".join(f"{k}: {v};" for k, v in paleta.items())
    mostrar = que_mostrar(fila)
    tarjetas = "".join(tarjeta(p, numero, emoji, mostrar) for p in productos)
    arriba = f'<img class="logo" src="{escape(logo)}" alt="Logo de {escape(nombre)}">\n        ' if logo else ""
    lema = texto(fila.get(LEMA))
    lema = f'\n        <p class="lema">{escape(lema)}</p>' if lema else ""
    usuario = re.sub(r"[^A-Za-z0-9._]", "", texto(fila.get(INSTAGRAM)).lstrip("@"))
    instagram = (f'\n        <p><a class="red" href="https://www.instagram.com/{usuario}/">Instagram: @{usuario}</a></p>'
                 if usuario else "")
    return f"""<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{escape(nombre)}</title>
    <link rel="stylesheet" href="../estilos.css">
    <link rel="stylesheet" href="../catalogos.css">
    <style>:root {{ {variables} }}</style>
</head>
<body>
    <header class="encabezado">
        {arriba}<h1>{escape(nombre)}</h1>{lema}
    </header>
    <main class="catalogo">{tarjetas}
    </main>
    <footer class="contacto">
        <h2>¡Contactá conmigo!</h2>
        <a class="consultar" href="{escape(link_whatsapp(numero, f"Hola, vi tu catálogo de {nombre}"))}">Escribime por WhatsApp</a>{instagram}
        <p>Tu consulta no es molestia</p>
    </footer>
    <p class="credito">Catálogo hecho por el curso de Pensamiento Computacional · CFP 401 Ensenada</p>
</body>
</html>
"""


def vidriera(catalogos, url_base):
    """La página de inicio: una tarjeta por catálogo, con su QR."""
    tarjetas = ""
    for c in catalogos:
        link = url_base + c["slug"] + "/"
        marca = (f'<img class="puesto__logo" src="{c["slug"]}/{c["logo"]}" alt="" loading="lazy">'
                 if c.get("logo") else f'<span class="puesto__emoji">{escape(c["emoji"])}</span>')
        tarjetas += f"""
        <a class="puesto" href="{c['slug']}/">
            {marca}
            <h2>{escape(c['nombre'])}</h2>
            <p>{escape(c['rubro'])}</p>
            <img class="puesto__qr" src="{qr(link)}" alt="QR de {escape(c['nombre'])}" loading="lazy">
        </a>"""
    return f"""<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Catálogos del CFP 401</title>
    <link rel="stylesheet" href="catalogos.css">
</head>
<body class="vidriera-pagina">
    <header class="cabecera">
        <h1>Los emprendimientos del CFP 401</h1>
        <p>Escaneá el QR y mirá el catálogo · Hecho por el curso de Pensamiento Computacional</p>
    </header>
    <main class="vidriera">{tarjetas}
    </main>
</body>
</html>
"""


def para_imprimir(catalogos, url_base):
    """Un QR grande por emprendimiento, dos por hoja A4: para llevar al stand."""
    hojas = ""
    for c in catalogos:
        link = url_base + c["slug"] + "/"
        hojas += f"""
    <section class="cartel">
        <h2>{escape(c['nombre'])}</h2>
        <p>{escape(c['rubro'])}</p>
        <img src="{qr(link)}" alt="QR de {escape(c['nombre'])}">
        <p class="cartel__pie">Escaneá y mirá el catálogo<br><small>{escape(link)}</small></p>
        <p class="credito">Hecho por el curso de Pensamiento Computacional · CFP 401 Ensenada</p>
    </section>"""
    return f"""<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>QR para imprimir</title>
    <link rel="stylesheet" href="catalogos.css">
</head>
<body class="imprimir">{hojas}
</body>
</html>
"""


# ─────────────────────────── Todo junto ──────────────────────────────────

def generar(filas, salida=SALIDA, url_base=SITIO_URL, sesion=None):
    """Arma el sitio entero. Devuelve (publicados, salteados): las listas de lo que pasó."""
    if not url_base.endswith("/"):
        url_base += "/"
    if salida.exists():
        shutil.rmtree(salida)
    shutil.copytree(ESTILOS, salida)
    publicados, salteados = [], []
    for nombre_carpeta, fila in ultimas_aprobadas(filas).items():
        nombre = texto(fila.get(NOMBRE))
        problemas = revisar(fila)
        if problemas:
            salteados.append((nombre, problemas))
            continue
        carpeta = salida / nombre_carpeta
        productos = productos_de(fila)
        con_fotos = que_mostrar(fila)["foto"]       # si eligió no mostrarlas, ni se bajan
        for p in productos:
            p["archivo"] = (bajar_imagen(sesion, p["foto"], carpeta / "fotos" / f"producto-{p['numero']}.jpg")
                            if con_fotos else None)
        logo = bajar_imagen(sesion, texto(fila.get(LOGO)), carpeta / "fotos" / "logo.jpg")
        carpeta.mkdir(parents=True, exist_ok=True)
        (carpeta / "index.html").write_text(pagina(fila, productos, logo and f"fotos/{logo}"), encoding="utf-8")
        publicados.append({"slug": nombre_carpeta, "nombre": nombre, "rubro": texto(fila.get(RUBRO)),
                           "emoji": texto(fila.get(EMOJI)) or EMOJI_POR_DEFECTO, "productos": len(productos),
                           "logo": logo and f"fotos/{logo}"})
    publicados.sort(key=lambda c: c["nombre"].lower())
    (salida / "index.html").write_text(vidriera(publicados, url_base), encoding="utf-8")
    (salida / "imprimir.html").write_text(para_imprimir(publicados, url_base), encoding="utf-8")
    return publicados, salteados


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:                                   # noqa: BLE001
        pass
    sesion = sesion_de_google()
    if len(sys.argv) > 1:
        filas = leer_planilla(sys.argv[1])
    elif sesion and os.environ.get("PLANILLA_ID"):
        filas = leer_de_google(sesion, os.environ["PLANILLA_ID"])
    else:
        sys.exit("Pasale la planilla (python generar.py respuestas.xlsx), o configurá "
                 "PLANILLA_ID y las credenciales de Google.")
    if not sesion:
        print("ℹ️  Sin credenciales de Google: los productos salen con el emoji, sin foto.")
    url_base = os.environ.get("SITIO_URL") or SITIO_URL
    publicados, salteados = generar(filas, SALIDA, url_base, sesion)
    print(f"\n{len(filas)} respuestas en la planilla. Publicados: {len(publicados)}")
    for c in publicados:
        print(f"   ✅ {c['nombre']} ({c['productos']} productos) → {url_base.rstrip('/')}/{c['slug']}/")
    for nombre, problemas in salteados:
        print(f"   ⛔ {nombre}: aprobado, pero no se publica: {'; '.join(problemas)}")
    print(f"\nListo: abrí {SALIDA / 'index.html'}")


if __name__ == "__main__":
    main()
