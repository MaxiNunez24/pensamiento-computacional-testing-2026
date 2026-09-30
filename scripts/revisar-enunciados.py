"""Revisa que ningún ejercicio pida trabajar con datos que nunca muestra.

    python scripts/revisar-enunciados.py

Por qué existe
--------------
Tres veces pasó lo mismo: el enunciado explicaba muy bien QUÉ había que hacer,
pero no CON QUÉ. El alumno recibía un parámetro llamado `lista_del_dia` o `mes`,
suponía que era una lista, escribía una solución razonable y el test le decía
que no. El problema no era del alumno ni del test: faltaba una línea.

    "Marcar y corregir"        — lista_del_dia era un {dni: estado}
    "Las marcas del mes"       — mes era un diccionario de diccionarios
    "Etapa 5 · Multijugador"   — devolvía una tupla (lista, número)

Qué mira
--------
Un ejercicio queda marcado cuando **los tests arman una estructura compuesta**
—un diccionario con claves de texto, o una lista de listas/tuplas/diccionarios—
y el enunciado **no muestra ningún ejemplo**: ni bloque de código, ni una flecha
`→`, ni un literal.

No mira los que traen `datos`, porque esos ya muestran sus valores arriba del
editor, en el recuadro "Esto ya está cargado".

Si alguna vez un ejercicio tiene que quedar sin ejemplo a propósito, se le pone
el comentario `{/* sin-ejemplo */}` adentro del enunciado y deja de avisar.
"""
import pathlib
import re
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:                                       # noqa: BLE001
    pass

CLASES = pathlib.Path(__file__).resolve().parent.parent / 'src' / 'content' / 'docs' / 'clases'

# Un diccionario con claves de texto: {"30111222": ...
COMPUESTA = re.compile(r'\{\s*["\'][^"\']+["\']\s*:')
# Una lista de cosas compuestas: [[ , [( , [{
LISTA_DE = re.compile(r'\[\s*[\[({]')


def revisar():
    faltan = []
    for pagina in sorted(CLASES.glob('*.mdx')):
        texto = pagina.read_text(encoding='utf-8')
        for inicio in re.finditer(r'<EjercicioPython\b', texto):
            corte = texto.index('\n>', inicio.end())
            fin = texto.index('</EjercicioPython>', corte)
            cabecera, enunciado = texto[inicio.end():corte], texto[corte + 2:fin]
            titulo = re.search(r'titulo="([^"]*)"', cabecera).group(1)

            if 'datos={`' in cabecera or 'sin-ejemplo' in enunciado:
                continue
            tests = re.search(r'tests=\{`(.*?)`\}', cabecera, re.S)
            if not tests:
                continue
            arma_estructura = COMPUESTA.search(tests.group(1)) or LISTA_DE.search(tests.group(1))
            muestra_ejemplo = ('```' in enunciado or '→' in enunciado
                               or COMPUESTA.search(enunciado) or LISTA_DE.search(enunciado))
            if arma_estructura and not muestra_ejemplo:
                faltan.append((pagina.stem, titulo))
    return faltan


faltan = revisar()
if not faltan:
    print('✅ Todos los enunciados muestran con qué datos se trabaja.')
    sys.exit(0)

print(f'⚠️  {len(faltan)} ejercicio(s) piden trabajar con datos que no muestran:\n')
for clase, titulo in faltan:
    print(f'   {clase:24} {titulo}')
print('\nAgregales un bloque con la entrada y la salida, como en "Las marcas del mes".')
sys.exit(1)
