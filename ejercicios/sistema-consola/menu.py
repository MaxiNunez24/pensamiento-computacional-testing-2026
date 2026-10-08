"""El menú: lo único del sistema que habla con la persona.

La regla de oro: acá solo hay input(), print() y llamadas a las funciones de
repositorio.py. Nada de SQL y nada de reglas (qué es un DNI válido lo decide el
Alumno). Cuando el sistema pase a Flask, este es el único archivo que se
reemplaza: los otros dos se usan tal cual.

Para arrancarlo, en la terminal:  python menu.py
"""
from datetime import date

import repositorio
from alumno import Alumno


def opcion_ver(con):
    alumnos = repositorio.listar_alumnos(con)
    if not alumnos:
        print("Todavía no hay alumnos cargados.")
    for alumno in alumnos:
        print(" ", alumno)


def opcion_alta(con):
    # ✏️ Ejercicio "El alta que no se cae": pegá acá tu función.
    print("Todavía falta: es el ejercicio 'El alta que no se cae'")


def opcion_pasar_lista(con, hoy):
    alumnos = repositorio.listar_alumnos(con)
    if not alumnos:
        print("Todavía no hay alumnos cargados.")
        return
    print(f"Lista del {hoy}. Para cada uno: P (presente), A (ausente) o T (tarde).")
    for alumno in alumnos:
        # Se repite hasta que pongan un estado válido: marcar() levanta
        # ValueError con cualquier otra cosa, y acá se le avisa a la persona.
        while True:
            estado = input(f"  {alumno.nombre_completo()}: ").strip().upper()
            try:
                repositorio.marcar(con, hoy, alumno.dni, estado)
                break
            except ValueError as e:
                print("  No se pudo:", e)


def opcion_lista_de_hoy(con, hoy):
    print(f"Lista del {hoy}:")
    for alumno, estado in repositorio.lista_del_dia(con, hoy):
        print(f"  {estado}  {alumno.nombre_completo()}")


con = repositorio.conectar()
hoy = date.today().isoformat()   # "2026-10-02": el mismo formato que la tabla

# ✏️ Ejercicio "El menú que no se cierra solo": pegá acá tu menú.
print("Todavía falta: es el ejercicio 'El menú que no se cierra solo'")
