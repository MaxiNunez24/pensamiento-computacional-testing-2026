"""Carteles A4 con QR para imprimir antes de la Expo (los imprime una alumna).

Una página por QR, para pegar al frente de las mesas o en la pared, una de sponsors y una hoja
final con tarjetas chicas. Sale un PDF y un PNG por página.
Uso: python carteles_qr.py SALIDA LOGO_CFP LOGO_GRAFICA LOGO_PUERTO
"""
import sys
from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageFont

SALIDA = Path(sys.argv[1])
LOGO_CFP, LOGO_GRAFICA, LOGO_PUERTO = (Path(a) for a in sys.argv[2:5])
SALIDA.mkdir(parents=True, exist_ok=True)

DPI = 200
W, H = 1654, 2339  # A4 a 200 dpi
PIE = 330
FUENTES = "C:/Windows/Fonts/"
TEAL, ORO, TINTA, SUAVE = "#0c7f8a", "#e0a526", "#16292b", "#566b6d"
SITIO = "https://maxinunez24.github.io/pensamiento-computacional-testing-2026/"
EXPO = SITIO + "ejercicios/expo/"
INSTAGRAM_CFP = "https://www.instagram.com/cfp401_eda/"
LOGOS = LOGO_GRAFICA.parent
# Los dos primeros aportaron más (los rollos térmicos y el equipo): van más grandes y aparte
PRINCIPALES = [  # (nombre, instagram, logo)
    ("Puerto Informático", "https://www.instagram.com/puertoinformatico/", LOGO_PUERTO),
    ("La Gráfica", "https://www.instagram.com/lagrafica.ensenada/", LOGO_GRAFICA),
]
SPONSORS = [
    ("Dylcell", "https://www.instagram.com/dylcell/", LOGOS / "dylcell.png"),
    ("CLC Accesorios", "https://www.instagram.com/clc_accesorios_/", LOGOS / "clc.png"),
    ("Tecno Cell", "https://www.instagram.com/telefoniaexpress_/", LOGOS / "tecnocell.png"),
]
# Los logos de fondo blanco se recortan y se les saca el fondo; los cuadrados de Instagram van enteros
FONDO_BLANCO = {LOGO_GRAFICA, LOGO_PUERTO, LOGO_CFP}


def f(nombre, tam):
    return ImageFont.truetype(FUENTES + nombre, tam)


def qr(link, lado):
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=2, box_size=10)
    q.add_data(link)
    q.make(fit=True)
    return q.make_image(fill_color=TINTA, back_color="white").convert("RGB").resize((lado, lado), Image.NEAREST)


def centrado(d, y, texto, fuente, color=TINTA, ancho=W, x0=0):
    """Escribe texto centrado, partido en renglones que entren; devuelve la y de abajo."""
    renglones, actual = [], ""
    for p in texto.split():
        prueba = (actual + " " + p).strip()
        if d.textlength(prueba, font=fuente) > ancho - 220 and actual:
            renglones.append(actual)
            actual = p
        else:
            actual = prueba
    renglones.append(actual)
    for r in renglones:
        d.text((x0 + (ancho - d.textlength(r, font=fuente)) / 2, y), r, font=fuente, fill=color)
        y += fuente.size * 1.22
    return y


def recortar(im):
    """Saca el margen blanco del logo y vuelve transparente el fondo blanco (para el pie gris)."""
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if r > 245 and g > 245 and b > 245:
                px[x, y] = (255, 255, 255, 0)
    caja = im.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox()
    return im.crop(caja) if caja else im


def logo(ruta, alto=None, ancho=None):
    im = Image.open(ruta).convert("RGBA")
    if ruta in FONDO_BLANCO:
        im = recortar(im)
    else:  # esquinas redondeadas, como se ven en Instagram
        mascara = Image.new("L", im.size, 0)
        ImageDraw.Draw(mascara).rounded_rectangle((0, 0, im.width - 1, im.height - 1), im.width // 8, fill=255)
        im.putalpha(mascara)
    if ancho and (not alto or im.width * alto / im.height > ancho):
        return im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    return im.resize((round(im.width * alto / im.height), alto), Image.LANCZOS)


def cabeza_y_pie(lienzo, d):
    d.rectangle((0, 0, W, 150), fill=TEAL)
    t = "CFP 401 · Ensenada  —  Expo 2026"
    d.text(((W - d.textlength(t, font=f("bahnschrift.ttf", 54))) / 2, 44), t, font=f("bahnschrift.ttf", 54), fill="white")
    y = H - PIE
    d.rectangle((0, y, W, H), fill="#f3f6f5")
    d.text((80, y + 28), "Pensamiento Computacional y Testing de Aplicaciones", font=f("arialbd.ttf", 36), fill=TINTA)
    d.text((80, y + 92), "Con el apoyo de:", font=f("arial.ttf", 36), fill=SUAVE)
    p = logo(LOGO_PUERTO, 120)
    lienzo.paste(p, (80, y + 165), p)
    g = logo(LOGO_GRAFICA, 170)
    lienzo.paste(g, (80 + p.width + 50, y + 140), g)
    x = W - 80
    for _, _, ruta in reversed(SPONSORS):  # los otros tres, más chicos, a la derecha
        c = logo(ruta, 105)
        x -= c.width
        lienzo.paste(c, (x, y + 175), c)
        x -= 22


def pagina():
    lienzo = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(lienzo)
    cabeza_y_pie(lienzo, d)
    return lienzo, d


def cartel(nombre, titulo, bajada, link, detalle):
    lienzo, d = pagina()
    y = centrado(d, 240, titulo, f("bahnschrift.ttf", 132), TINTA)
    y = centrado(d, y + 25, bajada, f("arial.ttf", 54), SUAVE)
    lado = 900
    x0, y0 = (W - lado) // 2, int(y) + 60
    d.rounded_rectangle((x0 - 30, y0 - 30, x0 + lado + 30, y0 + lado + 30), 40, outline=ORO, width=12)
    lienzo.paste(qr(link, lado), (x0, y0))
    y = centrado(d, y0 + lado + 70, "Escaneá con la cámara del celu", f("arialbd.ttf", 58), TEAL)
    centrado(d, y + 10, detalle, f("arial.ttf", 40), SUAVE)
    lienzo.save(SALIDA / f"{nombre}.png", dpi=(DPI, DPI))
    return lienzo


def cooperadora():
    lienzo, d = pagina()
    y = centrado(d, 230, "Colaborá con la cooperadora", f("bahnschrift.ttf", 124), TINTA)
    y = centrado(d, y + 15, "Todo lo que se junta en el stand va a la cooperadora del CFP 401.", f("arial.ttf", 50), SUAVE)
    c = logo(LOGO_CFP, 340)
    lienzo.paste(c, ((W - c.width) // 2, int(y) + 40), c)
    y = int(y) + 40 + 340 + 50
    y = centrado(d, y, "Alias", f("arial.ttf", 60), SUAVE)
    y = centrado(d, y + 5, "cfp401.lv", f("bahnschrift.ttf", 180), TEAL)
    y = centrado(d, y + 20, "A nombre de Asoc De For Prof Coop 401", f("arial.ttf", 52), TINTA)
    # El premio: se muestra el comprobante en el stand
    y0 = int(y) + 50
    d.rounded_rectangle((110, y0, W - 110, y0 + 360), 36, fill="#fff6dc", outline=ORO, width=8)
    yy = centrado(d, y0 + 40, "¡Mostranos el comprobante y te ganás un premio!", f("bahnschrift.ttf", 66), TINTA)
    centrado(d, yy + 20, "Tu foto con IA impresa o un catálogo personalizado para tu emprendimiento.",
             f("arial.ttf", 48), SUAVE)
    lienzo.save(SALIDA / "4-cooperadora.png", dpi=(DPI, DPI))
    return lienzo


def sponsors():
    lienzo, d = pagina()
    y = centrado(d, 210, "Gracias a quienes nos apoyan", f("bahnschrift.ttf", 108), TINTA)
    y = centrado(d, y + 5, "Seguilos en Instagram: escaneá el de cada uno.", f("arial.ttf", 46), SUAVE)
    # Los principales: más grandes, con su recuadro dorado
    y0 = int(y) + 30
    d.rounded_rectangle((60, y0, W - 60, y0 + 680), 36, outline=ORO, width=10, fill="#fffaf0")
    etiqueta = "SPONSORS PRINCIPALES"
    fe = f("bahnschrift.ttf", 44)
    d.text(((W - d.textlength(etiqueta, font=fe)) / 2, y0 + 24), etiqueta, font=fe, fill=ORO)
    for i, (nombre, link, ruta) in enumerate(PRINCIPALES):
        x0, cw = 60 + i * (W - 120) // 2, (W - 120) // 2
        lg = logo(ruta, 190, ancho=cw - 80)
        lienzo.paste(lg, (x0 + (cw - lg.width) // 2, y0 + 90 + (190 - lg.height) // 2), lg)
        lado = 380
        lienzo.paste(qr(link, lado), (x0 + (cw - lado) // 2, y0 + 300))
    # Los otros tres, en una fila
    y0 += 710
    cw = W // 3
    for i, (nombre, link, ruta) in enumerate(SPONSORS):
        x0 = i * cw
        lg = logo(ruta, 190)
        lienzo.paste(lg, (x0 + (cw - lg.width) // 2, y0), lg)
        lado = 270
        lienzo.paste(qr(link, lado), (x0 + (cw - lado) // 2, y0 + 225))
    y = centrado(d, y0 + 555, "Si les escribís o vas a sus locales, contales que venís de parte del CFP 401: así nos siguen apoyando el año que viene.",
                 f("arialbd.ttf", 40), TEAL)
    centrado(d, y + 12, "Y gracias a Carlos, instructor de Carpintería, por el soporte del proyector.",
             f("arial.ttf", 38), TINTA)
    lienzo.save(SALIDA / "5-sponsors.png", dpi=(DPI, DPI))
    return lienzo


def tarjetas(items):
    """Cuatro tarjetas A6 en una hoja, para dejar paradas en las mesas."""
    lienzo = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(lienzo)
    cw, ch = W // 2, H // 2
    for i, (titulo, link) in enumerate(items):
        tarjeta = Image.new("RGB", (cw, ch), "white")
        t = ImageDraw.Draw(tarjeta)
        t.rectangle((0, 0, cw, 90), fill=TEAL)
        s = "CFP 401 · Expo 2026"
        t.text(((cw - t.textlength(s, font=f("bahnschrift.ttf", 40))) / 2, 22), s, font=f("bahnschrift.ttf", 40), fill="white")
        yy = centrado(t, 140, titulo, f("bahnschrift.ttf", 68), TINTA, ancho=cw + 120)
        lado = 640
        tarjeta.paste(qr(link, lado), ((cw - lado) // 2, int(yy) + 30))
        lienzo.paste(tarjeta, ((i % 2) * cw, (i // 2) * ch))
    d.line((cw, 0, cw, H), fill="#bbbbbb", width=2)
    d.line((0, ch, W, ch), fill="#bbbbbb", width=2)
    lienzo.save(SALIDA / "6-tarjetas.png", dpi=(DPI, DPI))
    return lienzo


paginas = [
    cartel("1-expo", "Todo el stand en tu celular",
           "Los catálogos de los emprendimientos, los juegos, el Bingo y cómo la IA dibuja tu foto.",
           EXPO, "Lo programamos nosotros: en marzo no sabíamos qué era una variable."),
    cartel("2-cursos-2027", "Cursos 2027",
           "El CFP 401 suma Usuaria/o de IA generativa y Programador/a Web. ¿Qué días y horarios podrías?",
           EXPO + "encuesta/", "Es anónima y tarda un minuto."),
    cartel("3-instagram-cfp", "Seguí al CFP 401",
           "Las inscripciones, los cursos nuevos y todo lo que pasa en el CFP, en Instagram.",
           INSTAGRAM_CFP, "@cfp401_eda"),
    cooperadora(),
    sponsors(),
    tarjetas([
        ("Todo el stand en tu celular", EXPO),
        ("Cursos 2027: ¿qué días podés?", EXPO + "encuesta/"),
        ("Mirá los catálogos", EXPO + "#vidriera"),
        ("Seguí al CFP en Instagram", INSTAGRAM_CFP),
    ]),
]
for viejo in ("3-curso-gratis.png", "5-tarjetas.png", "vista1.png", "vista4.png"):
    (SALIDA / viejo).unlink(missing_ok=True)
paginas[0].save(SALIDA / "carteles-expo.pdf", save_all=True, append_images=paginas[1:], resolution=DPI)
print("listo:", SALIDA)
