# -*- coding: utf-8 -*-
"""Datos de demostracion para el taller de Flask.

TODO INVENTADO. Nombres de los ejercicios del curso y DNIs que no existen
(arrancan en 40.000.00x). Nunca datos reales de alumnos: el repo es publico y
esto se muestra en pantalla delante de gente.

`datos.json` esta gitignoreado, asi que esto no sale de la maquina.
"""
import sys
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from modelo import Alumno, Curso        # noqa: E402
import datos as almacen                 # noqa: E402

curso = Curso('1978', 'Pensamiento Computacional y Testing', dias_cursada=[2, 4])

GENTE = [
    ('40000001', 'Gómez',    'Lucía'),
    ('40000002', 'Fernández', 'Tomás'),
    ('40000003', 'Ríos',     'Valentina'),
    ('40000004', 'Paz',      'Mateo'),
    ('40000005', 'Herrera',  'Sofía'),
    ('40000006', 'Aguirre',  'Joaquín'),
]
for dni, ape, nom in GENTE:
    curso.inscribir(Alumno(dni, ape, nom))

# Historia de asistencia de las ultimas semanas, para que el porcentaje y la
# pantalla de merienda muestren algo real en vez de ceros.
PATRON = {
    '40000001': 'PPPPPPPP',   # no falta nunca
    '40000002': 'PPAPPTPP',   # una falta y una llegada tarde
    '40000003': 'PPPPPPPT',
    '40000004': 'PAAPPAPP',   # el que viene irregular
    '40000005': 'PPPTPPPP',
    '40000006': 'PPPPJPPP',   # una justificada
}

# Los dias de clase (miercoles y viernes) hacia atras desde hoy.
dias = []
d = date.today()
while len(dias) < 8:
    if d.weekday() in curso.dias_cursada:
        dias.append(d.isoformat())
    d -= timedelta(days=1)
dias.reverse()

for i, dia in enumerate(dias):
    for dni, patron in PATRON.items():
        curso.marcar(dia, dni, patron[i])

almacen.guardar(curso)

print(f'{len(curso.activos())} alumnos, {len(dias)} dias de clase cargados')
print('dias:', dias[0], '->', dias[-1])
for dni, ape, nom in GENTE:
    print(f'  {ape}, {nom}: {curso.porcentaje(dni)}% de asistencia')
print('presentes el ultimo dia:', curso.presentes(dias[-1]))
