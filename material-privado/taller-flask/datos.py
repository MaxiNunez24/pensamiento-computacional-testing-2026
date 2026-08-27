"""Etapa 2: que los datos sobrevivan a cerrar el programa.

Un objeto de Python vive en la memoria: cuando el programa termina, se
evapora. Guardar es pasar esos objetos a texto (JSON) y volver a armarlos
al arrancar.

Fijate que este archivo NO sabe nada de asistencia ni de porcentajes. Solo
sabe guardar y traer. Esa separación es la que después permite cambiar JSON
por una base de datos sin tocar el resto.
"""

import json
from pathlib import Path

from modelo import Alumno, Curso

ARCHIVO = Path(__file__).parent / "datos.json"


def guardar(curso, ruta=ARCHIVO):
    datos = {
        "numero": curso.numero,
        "nombre": curso.nombre,
        "dias_cursada": curso.dias_cursada,
        "alumnos": [
            {"dni": a.dni, "apellido": a.apellido, "nombre": a.nombre, "activo": a.activo}
            for a in curso.alumnos
        ],
        "asistencia": curso.asistencia,
    }
    # ensure_ascii=False para que los acentos se guarden como acentos y el
    # archivo se pueda leer con cualquier editor.
    Path(ruta).write_text(
        json.dumps(datos, indent=2, ensure_ascii=False), encoding="utf-8"
    )


def cargar(ruta=ARCHIVO):
    """Devuelve el curso guardado, o uno vacío si todavía no hay nada."""
    ruta = Path(ruta)
    if not ruta.exists():
        return Curso("1978", "Pensamiento Computacional", dias_cursada=[2, 4])

    datos = json.loads(ruta.read_text(encoding="utf-8"))
    curso = Curso(datos["numero"], datos["nombre"], datos["dias_cursada"])
    for d in datos["alumnos"]:
        a = Alumno(d["dni"], d["apellido"], d["nombre"])
        a.activo = d.get("activo", True)
        curso.alumnos.append(a)
    curso.asistencia = datos.get("asistencia", {})
    return curso
