"""Arma public/proyecto-catalogo/proyecto-catalogo.zip con el proyecto del catálogo.

Correr cada vez que se cambie algún archivo de public/proyecto-catalogo, o los
estilos de la clase:

    python scripts/armar-zip-catalogo.py

estilos.css NO se edita a mano: sale de la constante ESTILOS de la clase
(src/content/docs/web/catalogo.mdx). Así los ejercicios, la vista de Python y
el proyecto que se descargan usan exactamente los mismos estilos, y no hay
dos copias que se desfasen.

Las fotos de ejemplo y los adornos tampoco se copian: son los mismos que usan
los ejercicios, en public/web/catalogo/ (ahí los encuentra la vista de la
clase, porque las rutas `fotos/...` y `adornos/...` se resuelven contra la
dirección de la página).

Todo va adentro de una carpeta `catalogo/`, así al descomprimir no quedan
archivos sueltos en Descargas.
"""
import pathlib
import re
import zipfile

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CLASE = RAIZ / 'src' / 'content' / 'docs' / 'web' / 'catalogo.mdx'
CARPETA = RAIZ / 'public' / 'proyecto-catalogo'
DESTINO = CARPETA / 'proyecto-catalogo.zip'
DE_LA_CLASE = RAIZ / 'public' / 'web' / 'catalogo'

ARCHIVOS = ['LEEME.md', 'catalogo.py', 'productos.csv', 'estilos.css']

texto = CLASE.read_text(encoding='utf-8')
m = re.search(r'export const ESTILOS = `(.*?)`;', texto, re.S)
if not m:
    raise SystemExit(f'No encontré "export const ESTILOS" en {CLASE}')
estilos = m.group(1)
if '${' in estilos or '\\' in estilos:
    raise SystemExit('ESTILOS tiene ${ o una barra invertida: acá se copia tal cual y saldría distinto')
(CARPETA / 'estilos.css').write_bytes(estilos.encode('utf-8'))

with zipfile.ZipFile(DESTINO, 'w', zipfile.ZIP_DEFLATED) as z:
    for nombre in ARCHIVOS:
        z.write(CARPETA / nombre, f'catalogo/{nombre}')
    for carpeta in ['fotos', 'adornos']:
        for archivo in sorted((DE_LA_CLASE / carpeta).iterdir()):
            z.write(archivo, f'catalogo/{carpeta}/{archivo.name}')
            ARCHIVOS.append(f'{carpeta}/{archivo.name}')

print(f'{DESTINO.name}: {len(ARCHIVOS)} archivos, {DESTINO.stat().st_size // 1024} KB (estilos.css desde la clase)')
