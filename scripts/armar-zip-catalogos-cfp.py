"""Arma public/proyecto-catalogos-cfp/proyecto-catalogos-cfp.zip: los catálogos para todo el CFP.

    python scripts/armar-zip-catalogos-cfp.py

La plantilla vive en material-docente/catalogos-cfp/plantilla-repo/ (es lo que
después va al repo cfp401-ensenada/catalogos). Antes de empaquetar, copia ahí
los estilos del catálogo de la clase (public/proyecto-catalogo/estilos.css, que
a su vez sale de la clase: ver armar-zip-catalogo.py) y sus adornos, así no hay
dos copias que se desfasen. Correlo después de armar-zip-catalogo.py.

El zip suma la planilla de ejemplo (datos inventados) y el formulario, y deja
afuera lo que genera el programa (sitio/) y los cachés.
"""
import pathlib
import shutil
import zipfile

RAIZ = pathlib.Path(__file__).resolve().parent.parent
FUENTE = RAIZ / 'material-docente' / 'catalogos-cfp'
PLANTILLA = FUENTE / 'plantilla-repo'
DESTINO = RAIZ / 'public' / 'proyecto-catalogos-cfp' / 'proyecto-catalogos-cfp.zip'
AFUERA = {'sitio', '__pycache__', '.pytest_cache', '.venv'}

shutil.copyfile(RAIZ / 'public' / 'proyecto-catalogo' / 'estilos.css', PLANTILLA / 'estilos' / 'estilos.css')
for adorno in (RAIZ / 'public' / 'web' / 'catalogo' / 'adornos').iterdir():
    shutil.copyfile(adorno, PLANTILLA / 'estilos' / 'adornos' / adorno.name)

DESTINO.parent.mkdir(exist_ok=True)
archivos = []
with zipfile.ZipFile(DESTINO, 'w', zipfile.ZIP_DEFLATED) as z:
    for archivo in sorted(PLANTILLA.rglob('*')):
        relativo = archivo.relative_to(PLANTILLA)
        if archivo.is_dir() or AFUERA & set(relativo.parts):
            continue
        z.write(archivo, f'catalogos/{relativo.as_posix()}')
        archivos.append(relativo)
    for extra in ('respuestas-ejemplo.xlsx', 'formulario.md', 'apps-script/Codigo.gs', 'apps-script/LEEME.md'):
        z.write(FUENTE / extra, f'catalogos/{extra}')
        archivos.append(extra)

print(f'{DESTINO.name}: {len(archivos)} archivos, {DESTINO.stat().st_size // 1024} KB')
