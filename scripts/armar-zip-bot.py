"""Arma public/bot-siges/proyecto-bot-siges.zip con los archivos del proyecto.

Correr cada vez que se cambie algún archivo de public/bot-siges:

    python scripts/armar-zip-bot.py

El zip se commitea. No se arma en el build porque el build es de Astro y esto
es un archivo más para descargar; un paso extra en el deploy para un zip de
30 KB no vale la complejidad.

Todo va adentro de una carpeta `bot-siges/`, así al descomprimir no quedan
ocho archivos sueltos en la carpeta de Descargas.
"""
import pathlib
import zipfile

CARPETA = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'bot-siges'
DESTINO = CARPETA / 'proyecto-bot-siges.zip'

ARCHIVOS = [
    'LEEME.md', 'alumno.py', 'planilla.py', 'bot.py', 'ayudas.py',
    'inscriptos.csv', 'siges_falso.html', 'requirements.txt', '.gitignore',
]

with zipfile.ZipFile(DESTINO, 'w', zipfile.ZIP_DEFLATED) as z:
    for nombre in ARCHIVOS:
        z.write(CARPETA / nombre, f'bot-siges/{nombre}')

print(f'{DESTINO.name}: {len(ARCHIVOS)} archivos, {DESTINO.stat().st_size // 1024} KB')
