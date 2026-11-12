"""Arma el menú de los juegos de la Expo a partir de los .html que hicieron los estudiantes.

    python armar_menu.py                 (lee juegos/ y escribe menu/)
    python armar_menu.py OTRA_CARPETA    (lee los juegos de otra carpeta)

En menu/ quedan:
  index.html        el menú: flechas para elegir, Enter para jugar
  juegos/*.html     una copia de cada juego con la vuelta al menú agregada
                    (Escape dos veces seguidas, o 3 minutos sin tocar nada)
  abrir-juegos.bat  abre el menú en modo kiosco en Windows (Chrome, si no Edge)
  estilos-juegos.json  el <meta name="premio"> de cada juego, como estilos para el estudio de fotos
                    (si existe D:/Programas/ia-fotos/estudio, se copia ahí también)

Récords y premios: cada juego guarda sus 5 mejores en localStorage, con la clave "expo-records:" +
su título. El menú muestra al primero de cada juego, y con Ctrl+Alt+P abre la pantalla de PREMIOS
(quién va primero en cada juego). Ctrl+Alt+N = premios entregados: pide confirmar con Y (N o Esc
cancela), guarda a los ganadores y los récords arrancan de cero para el período siguiente. En el
estudio de fotos, los estilos 🎮 están escondidos: Ctrl+Alt+P los desbloquea para una sola foto.

No necesita internet ni nada instalado aparte de Python. La carpeta menu/ se copia entera a la PC
del stand.
"""
import html
import json
import re
import shutil
import sys
import unicodedata
from html.parser import HTMLParser
from pathlib import Path

AQUI = Path(__file__).parent
ORIGEN = Path(sys.argv[1]) if len(sys.argv) > 1 else AQUI / "juegos"
SALIDA = AQUI / "menu"
MINUTOS_SIN_TOCAR = 3
ESTUDIO = Path(r"D:\Programas\ia-fotos\estudio")  # el estudio de fotos (en la PC del profe)

# Se agrega al principio del <head> de cada juego: así su escucha se registra antes que las del
# juego y ve el Escape aunque el juego frene el evento.
VOLVER = """<script>
/* Agregado por armar_menu.py: volver al menú de la Expo */
(() => {
    const menu = '../index.html#__ID__';
    let ultimoEscape = 0;
    let quieto;
    const volver = () => { location.href = menu; };
    const despertar = () => { clearTimeout(quieto); quieto = setTimeout(volver, __MS__); };
    addEventListener('keydown', (e) => {
        despertar();
        if (e.key !== 'Escape') return;
        const ahora = Date.now();
        if (ahora - ultimoEscape < 800) volver();
        ultimoEscape = ahora;
    }, true);
    for (const tipo of ['mousedown', 'mousemove', 'touchstart']) addEventListener(tipo, despertar, true);
    despertar();
})();
</script>
"""

USA_INTERNET = re.compile(r"""(src|href)\s*=\s*["']\s*(https?:)?//|@import|url\(\s*["']?https?:|fetch\(\s*["']https?:""", re.I)


class Datos(HTMLParser):
    """Saca el título y los <meta> description y autor."""

    def __init__(self):
        super().__init__()
        self.titulo, self.descripcion, self.autor, self.premio = "", "", "", ""
        self._en_titulo = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self._en_titulo = True
        elif tag == "meta" and a.get("name", "").lower() == "description":
            self.descripcion = (a.get("content") or "").strip()
        elif tag == "meta" and a.get("name", "").lower() == "autor":
            self.autor = (a.get("content") or "").strip()
        elif tag == "meta" and a.get("name", "").lower() == "premio":
            self.premio = " ".join((a.get("content") or "").split())

    def handle_endtag(self, tag):
        if tag == "title":
            self._en_titulo = False

    def handle_data(self, data):
        if self._en_titulo:
            self.titulo += data


def identificador(nombre: str, usados: set) -> str:
    """Nombre de archivo seguro: sin tildes, sin espacios, sin repetir."""
    base = unicodedata.normalize("NFKD", nombre).encode("ascii", "ignore").decode()
    base = re.sub(r"[^a-z0-9]+", "-", base.lower()).strip("-") or "juego"
    nuevo, n = base, 2
    while nuevo in usados:
        nuevo, n = f"{base}-{n}", n + 1
    usados.add(nuevo)
    return nuevo


def con_vuelta(codigo: str, ident: str) -> str:
    script = VOLVER.replace("__ID__", ident).replace("__MS__", str(MINUTOS_SIN_TOCAR * 60_000))
    # Después del <meta charset>, si lo hay: tiene que quedar en los primeros 1024 bytes
    cabeza = re.search(r"<meta[^>]*charset[^>]*>", codigo, re.I) or re.search(r"<head[^>]*>", codigo, re.I)
    if cabeza:
        return codigo[:cabeza.end()] + "\n" + script + codigo[cabeza.end():]
    inicio = re.search(r"<html[^>]*>", codigo, re.I)
    if inicio:
        return codigo[:inicio.end()] + "\n<head>" + script + "</head>" + codigo[inicio.end():]
    return script + codigo


def tarjeta(j) -> str:
    autor = f'<span class="autor">por {html.escape(j["autor"])}</span>' if j["autor"] else ""
    clave = html.escape("expo-records:" + j["titulo"], quote=True)
    return (f'<a class="juego" id="{j["id"]}" href="juegos/{j["id"]}.html" style="--tono: {j["tono"]}"'
            f' data-clave="{clave}" data-premio="{"si" if j["premio"] else ""}">'
            f'<span class="titulo">{html.escape(j["titulo"])}</span>'
            f'<span class="descripcion">{html.escape(j["descripcion"])}</span>{autor}'
            f'<span class="lider" hidden></span></a>')


MENU = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Juegos hechos con IA</title>
<style>
    :root { --fondo: #10161f; --texto: #f2f5f7; --suave: #9fb0bf; }
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; }
    body {
        background: radial-gradient(circle at 50% 0%, #1d2a3a, var(--fondo) 70%);
        color: var(--texto);
        font: 20px/1.4 "Segoe UI", system-ui, sans-serif;
        display: grid; grid-template-rows: auto 1fr auto; gap: 24px;
        padding: 36px 48px; cursor: default;
    }
    h1 { margin: 0; font-size: clamp(2rem, 4.5vw, 3.6rem); line-height: 1.05; }
    header p { margin: 8px 0 0; color: var(--suave); font-size: 1.15rem; }
    body { overflow: hidden; }
    /* Se desplaza sola al elegir con las flechas: sin barras a la vista. El margen deja lugar
       para que la tarjeta elegida crezca sin salirse. */
    .grilla {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; align-content: start;
        overflow-x: hidden; overflow-y: auto; padding: 14px; margin: -14px;
        scrollbar-width: none;
    }
    .grilla::-webkit-scrollbar { display: none; }
    .juego {
        display: grid; gap: 8px; align-content: start; min-height: 170px;
        padding: 22px 24px; border-radius: 16px; text-decoration: none; color: var(--texto);
        background: color-mix(in srgb, var(--tono) 22%, #18212c);
        border: 3px solid transparent; transition: transform .12s, border-color .12s;
    }
    .juego:focus, .juego:hover { outline: none; border-color: var(--tono); transform: scale(1.04); background: color-mix(in srgb, var(--tono) 38%, #18212c); }
    .titulo { font-size: 1.6rem; font-weight: 700; line-height: 1.15; }
    .descripcion { color: #d5dee6; }
    .autor { color: var(--suave); font-size: .95rem; margin-top: auto; }
    footer { display: flex; flex-wrap: wrap; gap: 10px 28px; color: var(--suave); font-size: 1.05rem; }
    kbd { font: inherit; font-weight: 700; color: var(--texto); padding: 1px 8px; border-radius: 6px; border: 2px solid #3a4a5c; }
    .vacio { color: var(--suave); }
    .lider { font-weight: 700; color: #ffd36b; font-size: 1.05rem; }
    .premios {
        position: fixed; inset: 0; z-index: 10; padding: 36px 48px; overflow: auto;
        background: rgb(8 12 18 / .97); display: grid; gap: 18px; align-content: start;
    }
    .premios h2 { margin: 0; font-size: 2.4rem; color: #ffd36b; }
    .premios table { border-collapse: collapse; font-size: 1.25rem; }
    .premios th, .premios td { text-align: left; padding: 8px 18px 8px 0; border-bottom: 1px solid #2c3a4a; }
    .premios th { color: var(--suave); font-weight: 600; }
    .premios p { margin: 0; color: var(--suave); }
    .premios .ojo { color: #ff9b7a; }
    @media (prefers-reduced-motion: reduce) { .juego { transition: none; } .juego:focus { transform: none; } }
</style>
</head>
<body>
<header>
    <h1>Juegos hechos con IA</h1>
    <p>Los inventaron los estudiantes del curso y los programaron conversando con una inteligencia artificial.</p>
</header>
<main class="grilla">
__TARJETAS__
</main>
<section class="premios" hidden aria-live="polite">
    <h2>🏆 Premios</h2>
    <p>Quien va primero en cada juego se lleva su foto con IA adentro del juego: en el estudio de fotos, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>P</kbd> desbloquea los estilos 🎮 y se elige el del juego.</p>
    <table><thead><tr><th>Juego</th><th>Primero</th><th>Puntos</th><th>Segundo</th></tr></thead><tbody data-tabla></tbody></table>
    <p><kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd> premios entregados (pide confirmar con <kbd>Y</kbd>): se anotan los ganadores y los récords arrancan de cero · <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>P</kbd> cerrar</p>
    <p class="ojo" data-aviso></p>
    <h2 style="font-size:1.6rem">Ganadores anteriores</h2>
    <table><tbody data-historial></tbody></table>
</section>
<footer>
    <span><kbd>← ↑ → ↓</kbd> elegir</span>
    <span><kbd>Enter</kbd> jugar</span>
    <span><kbd>Esc</kbd> <kbd>Esc</kbd> volver acá desde un juego</span>
</footer>
<script>
    const juegos = [...document.querySelectorAll('.juego')];
    const elegir = (i) => { if (juegos.length) juegos[(i + juegos.length) % juegos.length].focus(); };
    const actual = () => Math.max(0, juegos.indexOf(document.activeElement));
    const columnas = () => {
        const arriba = juegos[0]?.offsetTop;
        return Math.max(1, juegos.filter((j) => j.offsetTop === arriba).length);
    };
    addEventListener('keydown', (e) => {
        const paso = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columnas(), ArrowUp: -columnas() }[e.key];
        if (paso === undefined || !premios.hidden) return;
        e.preventDefault();
        if (!juegos.includes(document.activeElement)) return elegir(0);
        const i = actual() + paso;
        elegir(Math.min(Math.max(i, 0), juegos.length - 1));
    });
    // Los récords los guarda cada juego (todos los archivos de esta carpeta comparten el localStorage)
    const leer = (clave, vacio) => { try { return JSON.parse(localStorage.getItem(clave)) ?? vacio; } catch { return vacio; } };
    const records = (j) => {
        const lista = leer(j.dataset.clave, []);
        return Array.isArray(lista) ? lista.filter((r) => r && typeof r.puntos === 'number').sort((a, b) => b.puntos - a.puntos) : [];
    };
    const titulo = (j) => j.querySelector('.titulo').textContent;
    function mostrarLideres() {
        for (const j of juegos) {
            const [primero] = records(j);
            const lugar = j.querySelector('.lider');
            lugar.hidden = !primero;
            if (primero) lugar.textContent = `🏆 ${primero.apodo || '???'} · ${primero.puntos} puntos`;
        }
    }
    const premios = document.querySelector('.premios');
    function mostrarPremios() {
        const fila = (celdas) => { const tr = document.createElement('tr'); for (const c of celdas) tr.append(Object.assign(document.createElement('td'), { textContent: c })); return tr; };
        document.querySelector('[data-tabla]').replaceChildren(...juegos.map((j) => {
            const [a, b] = records(j);
            return fila([titulo(j) + (j.dataset.premio ? '' : ' (sin estilo de premio)'), a ? a.apodo || '???' : '—', a ? a.puntos : '', b ? `${b.apodo || '???'} (${b.puntos})` : '—']);
        }));
        const historial = leer('expo-ganadores', []);
        document.querySelector('[data-historial]').replaceChildren(...historial.slice().reverse().map((g) => fila([g.hora, g.juego, g.apodo, g.puntos])));
    }
    // Ctrl+Alt+N pregunta, y recién con Y (o S) anota a los ganadores; N o Esc cancela.
    // Mientras pregunta, se traga todas las teclas: así nada más se mueve por accidente.
    let preguntando = false;
    addEventListener('keydown', (e) => {
        const tecla = e.key.toLowerCase();
        const aviso = document.querySelector('[data-aviso]');
        if (preguntando) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (tecla === 'y' || tecla === 's') { preguntando = false; entregar(aviso); }
            else if (tecla === 'n' || tecla === 'escape') { preguntando = false; aviso.textContent = 'Cancelado: no se borró nada.'; }
            return;
        }
        if (e.ctrlKey && e.altKey && tecla === 'p') {
            e.preventDefault();
            premios.hidden = !premios.hidden;
            if (!premios.hidden) mostrarPremios();
            return;
        }
        if (e.ctrlKey && e.altKey && tecla === 'n') {
            e.preventDefault();
            premios.hidden = false;
            mostrarPremios();
            preguntando = true;
            aviso.textContent = '¿Premios entregados? Se anotan los ganadores y los récords vuelven a cero. Y = sí · N = no';
        }
    }, true);
    function entregar(aviso) {
        const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
        const historial = leer('expo-ganadores', []);
        for (const j of juegos) {
            const [a] = records(j);
            if (a) historial.push({ hora, juego: titulo(j), apodo: a.apodo || '???', puntos: a.puntos });
            try { localStorage.removeItem(j.dataset.clave); } catch {}
        }
        try { localStorage.setItem('expo-ganadores', JSON.stringify(historial)); } catch {}
        aviso.textContent = `Listo (${hora}): ganadores anotados y récords en cero.`;
        mostrarPremios();
        mostrarLideres();
    }
    mostrarLideres();
    const desde = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    elegir(desde ? juegos.indexOf(desde) : 0);
</script>
</body>
</html>
"""

BAT = r"""@echo off
rem Abre el menu de juegos de la Expo en modo kiosco (pantalla completa). Para salir: Alt+F4.
set "MENU=%~dp0index.html"
set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if exist "%CHROME%" (
    start "" "%CHROME%" --kiosk --no-first-run --user-data-dir="%TEMP%\expo-juegos" "%MENU%"
    exit /b
)
start "" msedge --kiosk "%MENU%" --edge-kiosk-type=fullscreen --no-first-run
"""


def main():
    archivos = sorted(ORIGEN.glob("*.htm*"))
    if not archivos:
        print(f"No hay juegos en {ORIGEN}: poné ahí los .html de los estudiantes.")
        return 1
    if SALIDA.exists():
        shutil.rmtree(SALIDA)
    (SALIDA / "juegos").mkdir(parents=True)

    juegos, usados, avisos = [], set(), []
    for i, archivo in enumerate(archivos):
        codigo = archivo.read_text(encoding="utf-8", errors="replace")
        datos = Datos()
        datos.feed(codigo)
        titulo = " ".join(datos.titulo.split()) or archivo.stem.replace("-", " ").capitalize()
        ident = identificador(archivo.stem, usados)
        if USA_INTERNET.search(codigo):
            avisos.append(f"  {archivo.name}: parece que usa algo de internet; probalo sin conexión.")
        if re.search(r"\b(alert|confirm|prompt)\s*\(", codigo):
            avisos.append(f"  {archivo.name}: usa alert/confirm/prompt; en el kiosco puede trabar.")
        (SALIDA / "juegos" / f"{ident}.html").write_text(con_vuelta(codigo, ident), encoding="utf-8")
        if not datos.premio or "{quien}" not in datos.premio:
            avisos.append(f"  {archivo.name}: no tiene <meta name=\"premio\"> con {{quien}}; su ganador no tiene estilo de foto.")
        juegos.append({"id": ident, "titulo": titulo, "descripcion": datos.descripcion,
                       "autor": datos.autor, "premio": datos.premio if "{quien}" in datos.premio else "",
                       "tono": f"hsl({(i * 137) % 360} 70% 58%)"})

    tarjetas = "\n".join(tarjeta(j) for j in juegos)
    (SALIDA / "index.html").write_text(MENU.replace("__TARJETAS__", tarjetas), encoding="utf-8")
    (SALIDA / "abrir-juegos.bat").write_text(BAT.replace("\n", "\r\n"), encoding="utf-8")

    estilos = [{"clave": f"juego-{j['id']}", "titulo": f"🎮 {j['titulo']}", "texto": j["premio"]}
               for j in juegos if j["premio"]]
    texto = json.dumps(estilos, ensure_ascii=False, indent=2)
    (SALIDA / "estilos-juegos.json").write_text(texto, encoding="utf-8")
    if ESTUDIO.is_dir():
        (ESTUDIO / "estilos-juegos.json").write_text(texto, encoding="utf-8")
        print(f"Estilos de premio copiados al estudio ({len(estilos)}): reiniciá el estudio para que aparezcan.")

    print(f"Menú armado con {len(juegos)} juego(s) en {SALIDA}")
    for j in juegos:
        print(f"  {j['titulo']}" + (f"  (por {j['autor']})" if j["autor"] else "  (sin autor)"))
    if avisos:
        print("Para revisar:")
        print("\n".join(avisos))
    return 0


if __name__ == "__main__":
    sys.exit(main())
