#!/usr/bin/env python3
"""Verifica el HTML ya construido de la plataforma de ejercicios.

Existe por dos bugs que el build NO detecta y que estuvieron rotos sin que nadie
los notara:

1. **GFM apagado en .mdx** — las 13 tablas del sitio salían como pipes crudos en
   pantalla. Para MDX una tabla rota es texto perfectamente válido, así que
   `astro build` pasa en verde.
2. **favicon 404** — Starlight apuntaba a un archivo que no existía. Otro
   `<link>` más para el build.
3. **links internos sin el `base`** — el botón de la portada apuntaba a
   `/clases/funciones-1/`, que en producción es la raíz del dominio. Starlight
   le pone el `base` al sidebar, pero no a los `hero.actions` ni a los links
   markdown. En local anda, en producción es 404.

Los tres se vieron recién mirando el sitio con los ojos. Este script mira el
resultado en vez del proceso.

Uso:
    python3 scripts/verificar_render.py dist/
    python3 scripts/verificar_render.py site/ejercicios/

Sale con código 1 si encuentra un ERROR (bloquea el deploy). Los AVISOS son
heurísticas que pueden dar falsos positivos y no frenan nada.
"""
import re
import sys
import pathlib

# La consola de Windows usa cp1252, que no sabe escribir ✓ ⚠ ✗: sin esto el
# script CRASHEA al imprimir el resultado, aunque el chequeo haya salido bien.
# En el CI (Linux, UTF-8) no hace falta, pero acá se corre a mano antes de pushear.
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Bloques cuyo contenido es texto a propósito: no los miramos.
OPACOS = re.compile(r'<(script|style|pre|textarea|code)[^>]*>.*?</\1>', re.S)
ETIQUETAS = re.compile(r'<[^>]+>')
CANONICAL = re.compile(r'<link rel="canonical" href="([^"]+)"')


def detectar_base(raiz: pathlib.Path, paginas: list) -> str | None:
    """Deduce el prefijo de URL del sitio (el `base` de Astro) desde el HTML.

    Se saca comparando el `canonical` de una página con su ruta en disco: si el
    archivo `clases/print/index.html` se declara en
    `/pensamiento-computacional-testing-2026/ejercicios/clases/print/`, entonces
    el base es lo que sobra adelante. Se deduce en vez de hardcodearlo para que
    el día que cambie no haya que tocar este script.
    """
    for f in paginas:
        m = CANONICAL.search(f.read_text(encoding='utf-8'))
        if not m:
            continue
        ruta = re.sub(r'^https?://[^/]+', '', m.group(1))
        if not ruta.endswith('/'):
            ruta += '/'
        rel = f.parent.relative_to(raiz).as_posix()
        rel = '' if rel == '.' else rel + '/'
        if rel and not ruta.endswith('/' + rel):
            continue
        return ruta[: len(ruta) - len(rel)] if rel else ruta
    return None

# Sintaxis que, si aparece como texto visible, es que no se renderizó.
ERRORES_TEXTO = [
    (re.compile(r'^\s*\|[-: ]+\|', re.M), 'tabla sin renderizar (¿GFM apagado?)'),
    (re.compile(r'^\s*:::', re.M), 'aside de Starlight sin renderizar'),
    (re.compile(r'^\s*!!!', re.M), 'sintaxis de MkDocs en una página de Astro'),
    (re.compile(r'\[object Object\]'), 'objeto JS filtrado al HTML'),
]

# Heurísticas: pueden confundirse con contenido legítimo (p. ej. **kwargs).
AVISOS_TEXTO = [
    (re.compile(r'\*\*[^*\n]{2,60}\*\*'), 'posible negrita sin renderizar'),
    (re.compile(r'\[[^\]\n]{2,60}\]\([^)\n]{2,80}\)'), 'posible link sin renderizar'),
]


def texto_visible(html: str) -> str:
    return ETIQUETAS.sub(' ', OPACOS.sub('', html))


def main() -> int:
    raiz = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'dist')
    if not raiz.is_dir():
        print(f"✗ No existe el directorio {raiz}")
        return 1

    paginas = sorted(raiz.glob('**/index.html'))
    if not paginas:
        print(f"✗ No encontré ninguna página en {raiz}")
        return 1

    errores, avisos = [], []
    recursos = set()
    enlaces = set()

    for f in paginas:
        nombre = 'inicio' if f.parent == raiz else f.parent.name
        html = f.read_text(encoding='utf-8')
        txt = texto_visible(html)

        for patron, desc in ERRORES_TEXTO:
            m = patron.search(txt)
            if m:
                errores.append((nombre, desc, m.group(0).strip()[:60]))
        for patron, desc in AVISOS_TEXTO:
            m = patron.search(txt)
            if m:
                avisos.append((nombre, desc, m.group(0).strip()[:60]))

        # Recursos propios referenciados por el HTML (favicon, css, js, imágenes).
        for attr in re.findall(r'(?:href|src)="([^"]+)"', html):
            if attr.startswith(('http', 'mailto:', 'data:', '#')):
                continue
            recursos.add(attr)

        # Links de navegación (solo href, y solo absolutos: son los que puede
        # escribir a mano quien autora una clase).
        for href in re.findall(r'href="(/[^"]*)"', html):
            enlaces.add((nombre, href))

    # Un recurso propio que no existe en el build es un 404 asegurado.
    for r in sorted(recursos):
        if not re.search(r'\.(ico|svg|png|jpg|webp|css|js|woff2?)$', r):
            continue
        destino = raiz / r.split('/')[-1] if '/' in r else raiz / r
        candidatos = [destino, raiz / r.lstrip('/'), *raiz.glob('**/' + r.split('/')[-1])]
        if not any(c.exists() for c in candidatos):
            errores.append(('(global)', 'recurso referenciado que no existe', r))

    # Links internos rotos. El caso típico: Starlight le pone el `base` al
    # sidebar, pero NO a los hero.actions ni a los links markdown escritos a
    # mano — esos van al <a href> tal cual, y un "/clases/tema/" apunta a la
    # raíz del dominio. Da 404 solo en producción, así que no se ve al probar.
    base = detectar_base(raiz, paginas)
    if not base:
        avisos.append(('(global)', 'no pude deducir el `base` (¿falta canonical?)',
                       'links internos sin verificar'))
    else:
        construidas = {
            '' if (rel := p.parent.relative_to(raiz).as_posix()) == '.' else rel
            for p in paginas
        }
        # La otra mitad del curso (MkDocs) cuelga de la raíz del proyecto, un
        # nivel arriba del `base`. No está en este build: no se puede verificar
        # desde acá, pero tampoco es un error.
        raiz_proyecto = '/' + base.strip('/').split('/')[0] + '/' if base.strip('/') else '/'

        for nombre, href in sorted(enlaces):
            ruta = href.split('#')[0].split('?')[0]
            if '.' in ruta.rstrip('/').split('/')[-1]:
                continue  # tiene extensión: es un recurso, ya se revisó arriba
            if ruta.startswith(base):
                destino = ruta[len(base):].strip('/')
                if destino not in construidas:
                    errores.append((nombre, 'link a una página que no existe en el build', href))
            elif ruta.startswith(raiz_proyecto):
                continue  # la otra mitad (MkDocs), fuera de este build
            else:
                errores.append((nombre, f'link sin el `base` (debería empezar con {base})', href))

    print(f"Revisadas {len(paginas)} páginas en {raiz}")

    if avisos:
        print(f"\n⚠  {len(avisos)} aviso(s) — revisalos a ojo, pueden ser falsos positivos:")
        for pag, desc, ej in avisos:
            print(f"   [{pag}] {desc}: {ej}")

    if errores:
        print(f"\n✗ {len(errores)} ERROR(es) de render:")
        for pag, desc, ej in errores:
            print(f"   [{pag}] {desc}: {ej}")
        return 1

    print("✓ Sin errores de render")
    return 0


if __name__ == '__main__':
    sys.exit(main())
