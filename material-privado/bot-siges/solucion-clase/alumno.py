# Solución de referencia de la clase del bot (18/9). Solo profe.
#
# No es "la" solución: es una. Hay varias formas correctas de escribir cada
# control, y compararlas en clase vale más que llegar a esta.

from datetime import date

from ayudas import leer_fecha


class Alumno:
    def __init__(self, dni, apellidos, nombres, fecha_nacimiento, celular, nacionalidad, domicilio):
        self.dni = dni
        self.apellidos = apellidos
        self.nombres = nombres
        self.fecha_nacimiento = fecha_nacimiento
        self.celular = celular
        self.nacionalidad = nacionalidad
        self.domicilio = domicilio

    def nombre_completo(self):
        return f"{self.apellidos}, {self.nombres}"

    def problemas(self):
        lista = []

        # 1. El DNI
        if not self.dni.isdigit() or len(self.dni) not in (7, 8):
            lista.append(f'el DNI "{self.dni}" tiene que ser solo números, 7 u 8')

        # 2. La fecha
        fecha = leer_fecha(self.fecha_nacimiento)
        if fecha is None:
            lista.append(f'no se entiende la fecha "{self.fecha_nacimiento}"')
        elif fecha > date.today():
            lista.append(f'la fecha "{self.fecha_nacimiento}" está en el futuro')

        # 3. El celular
        celular = self.celular.replace(" ", "")
        if not celular.isdigit() or len(celular) != 10:
            lista.append(f'el celular "{self.celular}" no tiene 10 números')

        # 4. La nacionalidad
        if self.nacionalidad.strip() == "" or self.nacionalidad.lower() == "completar":
            lista.append("falta la nacionalidad")

        # 5. El domicilio
        if self.domicilio.strip() == self.dni:
            lista.append("el domicilio es el DNI: se pegó en la columna equivocada")

        return lista

    def esta_listo(self):
        return len(self.problemas()) == 0
