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
    dni = input("DNI: ")
    apellido = input("Apellido: ")
    nombre = input("Nombre: ")
    try:
        alumno = Alumno(dni, apellido, nombre)
    except ValueError as e:
        print("No se pudo:", e)
        return
    if repositorio.guardar_alumno(con, alumno):
        print("Listo:", alumno.nombre_completo())
    else:
        print("Ese DNI ya estaba cargado")


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

while True:
    print()
    print("1) Ver alumnos")
    print("2) Dar de alta")
    print("3) Pasar lista de hoy")
    print("4) Ver la lista de hoy")
    print("5) Salir")
    opcion = input("Opción: ")
    if opcion == "1":
        opcion_ver(con)
    elif opcion == "2":
        opcion_alta(con)
    elif opcion == "3":
        opcion_pasar_lista(con, hoy)
    elif opcion == "4":
        opcion_lista_de_hoy(con, hoy)
    elif opcion == "5":
        print("¡Hasta luego!")
        break
    else:
        print("Opción inválida")
