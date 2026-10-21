"""Los tests de generar.py. GitHub los corre ANTES de publicar: si alguno falla,
no se publica nada y el sitio queda como estaba.

    pytest
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import generar as g  # noqa: E402


def respuesta(nombre="Dulces de la Isla", aprobado="TRUE", whatsapp="2215550000", productos=1, **extra):
    """Una fila como las del formulario, con lo mínimo para publicarse."""
    fila = {g.NOMBRE: nombre, g.RUBRO: "Dulces caseros", g.WHATSAPP: whatsapp, g.ESTILO: "Dulce",
            g.CONFORMIDAD: "Acepto, Las fotos son mías, Entiendo", g.APROBADO: aprobado}
    for n in range(1, productos + 1):
        fila[f"Producto {n} · Nombre"] = f"Producto {n}"
        fila[f"Producto {n} · Precio"] = "4500"
    fila.update(extra)
    return fila


# ── Los datos ────────────────────────────────────────────────────────────

def test_slug_sin_tildes_ni_simbolos():
    assert g.slug("Dulces de la Isla") == "dulces-de-la-isla"
    assert g.slug("Café & Té Ñandú") == "cafe-te-nandu"
    assert g.slug("  Mates   del Río!! ") == "mates-del-rio"


def test_precio_con_punto_y_consultar():
    assert g.precio("4500") == "$4.500"
    assert g.precio("12500") == "$12.500"
    assert g.precio("$ 4.500") == "$4.500"
    assert g.precio("4500,50") == "$4.500"
    assert g.precio("") == "Consultar"
    assert g.precio("a convenir") == "Consultar"
    assert g.precio("0") == "Consultar"


def test_numero_whatsapp():
    assert g.numero_whatsapp("2215550000") == "5492215550000"
    assert g.numero_whatsapp("221 555-0000") == "5492215550000"
    assert g.numero_whatsapp("5492215550000") == "5492215550000"
    assert g.numero_whatsapp("221555") is None
    assert g.numero_whatsapp("") is None


def test_productos_de_saltea_los_vacios():
    fila = respuesta(productos=2)
    fila["Producto 5 · Nombre"] = "Alfajores"
    nombres = [p["nombre"] for p in g.productos_de(fila)]
    assert nombres == ["Producto 1", "Producto 2", "Alfajores"]


def test_aprobado_acepta_como_lo_escribe_google():
    for valor in ["TRUE", "VERDADERO", "true", "Sí"]:
        assert g.esta_aprobada(respuesta(aprobado=valor))
    for valor in ["FALSE", "FALSO", "", None]:
        assert not g.esta_aprobada(respuesta(aprobado=valor))


# ── Qué se publica ──────────────────────────────────────────────────────

def test_sin_aprobar_no_se_publica():
    elegidas = g.ultimas_aprobadas([respuesta(aprobado="FALSE")])
    assert elegidas == {}


def test_gana_la_aprobada_mas_nueva():
    vieja = respuesta(productos=1)
    nueva = respuesta(productos=3)
    assert len(g.productos_de(g.ultimas_aprobadas([vieja, nueva])["dulces-de-la-isla"])) == 3


def test_un_cambio_sin_aprobar_no_reemplaza_al_publicado():
    publicada = respuesta(productos=1)
    cambio = respuesta(productos=3, aprobado="FALSE")
    elegida = g.ultimas_aprobadas([publicada, cambio])["dulces-de-la-isla"]
    assert len(g.productos_de(elegida)) == 1


def test_revisar_frena_lo_que_no_se_puede_publicar():
    assert g.revisar(respuesta()) == []
    assert any("WhatsApp" in p for p in g.revisar(respuesta(whatsapp="123")))
    assert any("producto" in p for p in g.revisar(respuesta(productos=0)))
    assert any("conformidad" in p for p in g.revisar(respuesta(**{g.CONFORMIDAD: ""})))


# ── El HTML ─────────────────────────────────────────────────────────────

def test_lo_que_escribe_la_gente_no_puede_meter_codigo():
    fila = respuesta(**{g.LEMA: '<script>alert("hola")</script>'})
    fila["Producto 1 · Nombre"] = '<img src=x onerror="alert(1)">'
    html = g.pagina(fila, g.productos_de(fila))
    assert "<script>alert" not in html
    assert "<img src=x" not in html
    assert "&lt;script&gt;" in html


def test_la_pagina_tiene_una_tarjeta_por_producto_y_el_whatsapp():
    fila = respuesta(productos=3)
    html = g.pagina(fila, g.productos_de(fila))
    assert html.count('<article class="producto">') == 3
    assert "https://wa.me/5492215550000" in html
    assert "$4.500" in html


def test_la_paleta_elegida_pinta_el_catalogo():
    fila = respuesta(**{g.ESTILO: "Mar"})
    assert g.PALETAS["Mar"]["--fondo"] in g.pagina(fila, g.productos_de(fila))


# ── Todo junto ──────────────────────────────────────────────────────────

def test_generar_arma_el_sitio(tmp_path):
    filas = [respuesta("Dulces de la Isla"), respuesta("Hilos y Agujas"),
             respuesta("La Vela Encendida", aprobado="FALSE"), respuesta("Mates del Río", whatsapp="221")]
    publicados, salteados = g.generar(filas, tmp_path / "sitio", "https://ejemplo.github.io/catalogos")
    assert [c["slug"] for c in publicados] == ["dulces-de-la-isla", "hilos-y-agujas"]
    assert [n for n, _ in salteados] == ["Mates del Río"]
    sitio = tmp_path / "sitio"
    assert (sitio / "dulces-de-la-isla" / "index.html").exists()
    assert not (sitio / "la-vela-encendida").exists()
    assert (sitio / "estilos.css").exists() and (sitio / "adornos").is_dir()
    inicio = (sitio / "index.html").read_text(encoding="utf-8")
    assert inicio.count('class="puesto"') == 2
    assert "https%3A%2F%2Fejemplo.github.io%2Fcatalogos%2Fhilos-y-agujas%2F" in inicio
    assert (sitio / "imprimir.html").read_text(encoding="utf-8").count('class="cartel"') == 2


def test_dar_de_baja_borra_el_catalogo(tmp_path):
    sitio = tmp_path / "sitio"
    g.generar([respuesta("Dulces de la Isla")], sitio, "https://ejemplo.github.io/catalogos/")
    assert (sitio / "dulces-de-la-isla").exists()
    g.generar([respuesta("Dulces de la Isla", aprobado="FALSE")], sitio, "https://ejemplo.github.io/catalogos/")
    assert not (sitio / "dulces-de-la-isla").exists()


def test_leer_planilla_csv(tmp_path):
    ruta = tmp_path / "respuestas.csv"
    ruta.write_text(f"{g.NOMBRE},{g.APROBADO}\nDulces de la Isla,TRUE\n", encoding="utf-8")
    assert g.leer_planilla(ruta) == [{g.NOMBRE: "Dulces de la Isla", g.APROBADO: "TRUE"}]
