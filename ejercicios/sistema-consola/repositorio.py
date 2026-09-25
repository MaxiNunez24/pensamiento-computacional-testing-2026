"""Todo lo que toca la base vive acá. Ningún otro archivo escribe SQL.

El resto del sistema pide un Alumno y recibe un Alumno: de las filas y las
tablas no se entera nadie más. Por eso, cuando el sistema pase a Flask, este
archivo se usa tal cual, sin cambiarle una línea.
"""
import sqlite3

from alumno import Alumno

# Los estados posibles de una marca: presente, ausente, tarde.
ESTADOS = ("P", "A", "T")


def conectar(archivo="asistencias.db"):
    """Abre la base (si no existe, la crea) y se asegura de que estén las tablas."""
    con = sqlite3.connect(archivo)
    crear_tablas(con)
    return con


def crear_tablas(con):
    con.execute(
        "CREATE TABLE IF NOT EXISTS alumnos "
        "(dni TEXT PRIMARY KEY, apellido TEXT, nombre TEXT, activo INTEGER DEFAULT 1)"
    )
    # Una fila por alumno y por día. La fecha va como texto "2026-10-02": así,
    # ordenada alfabéticamente, también queda ordenada por fecha.
    con.execute("CREATE TABLE IF NOT EXISTS marcas (fecha TEXT, dni TEXT, estado TEXT)")
    con.commit()


def guardar_alumno(con, alumno):
    """Agrega un Alumno a la base. Devuelve False si ese DNI ya estaba."""
    try:
        con.execute(
            "INSERT INTO alumnos (dni, apellido, nombre) VALUES (?, ?, ?)",
            (alumno.dni, alumno.apellido, alumno.nombre),
        )
    except sqlite3.IntegrityError:
        return False
    con.commit()
    return True


def buscar_alumno(con, dni):
    """El Alumno con ese DNI, o None si no está."""
    fila = con.execute(
        "SELECT dni, apellido, nombre, activo FROM alumnos WHERE dni = ?", (dni,)
    ).fetchone()
    if fila is None:
        return None
    return Alumno(fila[0], fila[1], fila[2], fila[3] == 1)


def listar_alumnos(con):
    """Los alumnos activos, ordenados por apellido."""
    filas = con.execute(
        "SELECT dni, apellido, nombre FROM alumnos WHERE activo = 1 ORDER BY apellido, nombre"
    ).fetchall()
    return [Alumno(f[0], f[1], f[2]) for f in filas]


# ---------------------------------------------------------------------------
# ✏️ De acá para abajo es tuyo: son los ejercicios del taller. Cuando la
#    plataforma te dé ✓, pegá tu función en lugar de la que está.
# ---------------------------------------------------------------------------

def marcar(con, fecha, dni, estado):
    """Anota la marca de un alumno en un día. Si ya tenía una, la corrige."""
    # ✏️ Ejercicio "Marcar la asistencia". Acordate: en tu compu, después de
    #    escribir en la base va con.commit().
    raise NotImplementedError("Todavía falta: es el ejercicio 'Marcar la asistencia'")


def lista_del_dia(con, fecha):
    """Una tupla (Alumno, estado) por cada alumno activo. Sin marca: '-'."""
    # ✏️ Ejercicio "La lista del día".
    raise NotImplementedError("Todavía falta: es el ejercicio 'La lista del día'")
