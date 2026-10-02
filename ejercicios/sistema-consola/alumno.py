"""La clase Alumno: la de POO, con lo que le agregamos en Excepciones.

Un Alumno con el DNI roto no llega a existir: el __init__ levanta ValueError,
y quien lo quiso crear decide qué hacer (en el menú: avisarle a la persona).
"""


class Alumno:
    def __init__(self, dni, apellido, nombre, activo=True):
        dni = dni.strip()
        if not dni.isdigit() or len(dni) not in (7, 8):
            raise ValueError("el DNI tiene que ser de 7 u 8 números, sin puntos")
        if not apellido.strip() or not nombre.strip():
            raise ValueError("faltan el apellido o el nombre")
        self.dni = dni
        self.apellido = apellido.strip()
        self.nombre = nombre.strip()
        self.activo = activo

    def nombre_completo(self):
        return f"{self.apellido}, {self.nombre}"

    def __str__(self):
        return f"{self.nombre_completo()} (DNI {self.dni})"
