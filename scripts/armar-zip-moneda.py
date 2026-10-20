"""Arma public/proyecto-moneda/proyecto-moneda.zip con el proyecto de la moneda.

Correr cada vez que se cambie algún archivo de public/proyecto-moneda, o los
estilos de la clase:

    python scripts/armar-zip-moneda.py

estilos.css NO se edita a mano: sale de las constantes BASE y MONEDA de la
clase (src/content/docs/preparando-expo/moneda.mdx). Así el ejercicio "La
moneda completa" y el proyecto que se descarga usan exactamente la misma
moneda. (Igual que armar-zip-catalogo.py.)

Todo va adentro de una carpeta `moneda/`, así al descomprimir no quedan
archivos sueltos en Descargas.
"""
import pathlib
import re
import zipfile

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CLASE = RAIZ / 'src' / 'content' / 'docs' / 'preparando-expo' / 'moneda.mdx'
CARPETA = RAIZ / 'public' / 'proyecto-moneda'
DESTINO = CARPETA / 'proyecto-moneda.zip'
ARCHIVOS = ['LEEME.md', 'index.html', 'estilos.css', 'juego.js']

texto = CLASE.read_text(encoding='utf-8')
partes = []
for nombre in ('BASE', 'MONEDA'):
    m = re.search(rf'export const {nombre} = `(.*?)`;', texto, re.S)
    if not m:
        raise SystemExit(f'No encontré "export const {nombre}" en {CLASE}')
    if '${' in m.group(1) or '\\' in m.group(1):
        raise SystemExit(f'{nombre} tiene ${{ o una barra invertida: acá se copia tal cual y saldría distinto')
    partes.append(m.group(1))
# Un título y un poco de aire arriba, que en la clase no hacen falta.
extra = 'h1 {\n    margin: 8px 0 0;\n}\n'
(CARPETA / 'estilos.css').write_bytes(('/* Sale de la clase: no editar acá (ver scripts/armar-zip-moneda.py). */\n\n'
                                       + partes[0] + '\n' + extra + '\n' + partes[1]).encode('utf-8'))

with zipfile.ZipFile(DESTINO, 'w', zipfile.ZIP_DEFLATED) as z:
    for nombre in ARCHIVOS:
        z.write(CARPETA / nombre, f'moneda/{nombre}')

print(f'{DESTINO.name}: {len(ARCHIVOS)} archivos, {DESTINO.stat().st_size // 1024} KB (estilos.css desde la clase)')
