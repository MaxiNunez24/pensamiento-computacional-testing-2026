# Solución de referencia de la clase del bot (18/9). Solo profe.

import csv

from alumno import Alumno


def leer_inscriptos(ruta):
    inscriptos = []
    with open(ruta, encoding="utf-8") as archivo:
        for fila in csv.DictReader(archivo):
            alumno = Alumno(fila["dni"], fila["apellidos"], fila["nombres"],
                            fila["fecha_nacimiento"], fila["celular"],
                            fila["nacionalidad"], fila["domicilio"])
            inscriptos.append(alumno)
    return inscriptos
