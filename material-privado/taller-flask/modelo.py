"""Etapa 1: el sistema SIN pantalla.

Acá no hay web, no hay Flask, no hay HTML. Solo Python.

Esto es a propósito y es la decisión más importante del proyecto: si las
reglas viven acá, se pueden PROBAR sin abrir nada, y el día que cambiemos
la pantalla (o le agreguemos otra) este archivo no se toca.
"""

from datetime import date


class Alumno:
    def __init__(self, dni, apellido, nombre):
        self.dni = dni
        self.apellido = apellido
        self.nombre = nombre
        self.activo = True

    def nombre_completo(self):
        return f"{self.apellido}, {self.nombre}"

    def __repr__(self):
        # Para que al imprimir una lista de alumnos se entienda qué hay adentro.
        return f"<Alumno {self.dni} {self.nombre_completo()}>"


class Curso:
    def __init__(self, numero, nombre, dias_cursada):
        self.numero = numero
        self.nombre = nombre
        self.dias_cursada = dias_cursada     # [2, 4] = miércoles y viernes
        self.alumnos = []
        # { "2026-08-21": { "***REMOVED***": "P" } }
        self.asistencia = {}

    # ---------- alumnos ----------

    def inscribir(self, alumno):
        if self.buscar(alumno.dni):
            raise ValueError(f"El DNI {alumno.dni} ya está inscripto")
        self.alumnos.append(alumno)

    def buscar(self, dni):
        for a in self.alumnos:
            if a.dni == dni:
                return a
        return None

    def activos(self):
        return [a for a in self.alumnos if a.activo]

    # ---------- asistencia ----------

    def marcar(self, dia, dni, estado):
        """estado: 'P' presente, 'A' ausente, 'T' tarde, 'J' justificado, '' sin marcar."""
        if estado not in ('P', 'A', 'T', 'J', ''):
            raise ValueError(f"Estado desconocido: {estado!r}")
        if not self.buscar(dni):
            raise ValueError(f"El DNI {dni} no está en este curso")
        self.asistencia.setdefault(dia, {})[dni] = estado

    def estado_de(self, dia, dni):
        return self.asistencia.get(dia, {}).get(dni, '')

    def presentes(self, dia):
        """Cuántos vinieron. El que llegó tarde vino igual."""
        del_dia = self.asistencia.get(dia, {})
        return sum(1 for e in del_dia.values() if e in ('P', 'T'))

    def porcentaje(self, dni):
        """Sobre los días que efectivamente se tomó asistencia."""
        marcados = [dia for dia, d in self.asistencia.items() if d.get(dni)]
        if not marcados:
            return 0
        vino = sum(1 for dia in marcados if self.estado_de(dia, dni) in ('P', 'T'))
        return round(vino / len(marcados) * 100)

    def es_dia_de_clase(self, dia):
        return date.fromisoformat(dia).weekday() in self.dias_cursada
