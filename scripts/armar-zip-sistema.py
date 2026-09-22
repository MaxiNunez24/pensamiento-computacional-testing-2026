"""Arma public/sistema-consola/sistema-consola.zip con el proyecto del taller.

Correr cada vez que se cambie algún archivo de public/sistema-consola:

    python scripts/armar-zip-sistema.py

Mismo criterio que el zip del bot: se commitea, y todo va adentro de una
carpeta `sistema-consola/` para que al descomprimir no queden archivos sueltos.

Ojo: si cambian alumno.py o repositorio.py, los ejercicios del taller los usan
tal cual (van en `ARCHIVOS`, arriba de taller-consola.mdx). Hay que regenerar
la página también, o el alumno practica con una versión y descarga otra.
"""
import pathlib
import zipfile

CARPETA = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'sistema-consola'
DESTINO = CARPETA / 'sistema-consola.zip'

ARCHIVOS = ['LEEME.md', 'alumno.py', 'repositorio.py', 'menu.py', '.gitignore']

with zipfile.ZipFile(DESTINO, 'w', zipfile.ZIP_DEFLATED) as z:
    for nombre in ARCHIVOS:
        z.write(CARPETA / nombre, f'sistema-consola/{nombre}')

print(f'{DESTINO.name}: {len(ARCHIVOS)} archivos, {DESTINO.stat().st_size // 1024} KB')
