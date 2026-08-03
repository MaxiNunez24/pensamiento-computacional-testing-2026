#!/usr/bin/env python3
"""Verifica el HTML ya construido de la plataforma de ejercicios.

Existe por dos bugs que el build NO detecta y que estuvieron rotos sin que nadie
los notara:

1. **GFM apagado en .mdx** — las 13 tablas del sitio salían como pipes crudos en
   pantalla. Para MDX una tabla rota es texto perfectamente válido, así que
   `astro build` pasa en verde.
2. **favicon 404** — Starlight apuntaba a un archivo que no existía. Otro
   `<link>` más para el build.

Los dos se vieron recién mirando el sitio con los ojos. Este script mira el
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

# Bloques cuyo contenido es texto a propósito: no los miramos.
OPACOS = re.compile(r'<(script|style|pre|textarea|code)[^>]*>.*?</\1>', re.S)
ETIQUETAS = re.compile(r'<[^>]+>')

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

    for f in paginas:
        nombre = f.parent.name or 'inicio'
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

    # Un recurso propio que no existe en el build es un 404 asegurado.
    for r in sorted(recursos):
        if not re.search(r'\.(ico|svg|png|jpg|webp|css|js|woff2?)$', r):
            continue
        destino = raiz / r.split('/')[-1] if '/' in r else raiz / r
        candidatos = [destino, raiz / r.lstrip('/'), *raiz.glob('**/' + r.split('/')[-1])]
        if not any(c.exists() for c in candidatos):
            errores.append(('(global)', 'recurso referenciado que no existe', r))

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
