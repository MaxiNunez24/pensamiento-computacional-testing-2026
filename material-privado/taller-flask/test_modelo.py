"""Los tests del modelo. Corren sin abrir nada: `pytest`"""

import pytest
from modelo import Alumno, Curso


def curso_de_prueba():
    c = Curso("1978", "Pensamiento Computacional", dias_cursada=[2, 4])
    c.inscribir(Alumno("***REMOVED***", "***REMOVED***", "***REMOVED***"))
    c.inscribir(Alumno("***REMOVED***", "Alvarez", "***REMOVED***"))
    return c


def test_inscribir_y_buscar():
    c = curso_de_prueba()
    assert len(c.activos()) == 2
    assert c.buscar("***REMOVED***").apellido == "***REMOVED***"
    assert c.buscar("00000000") is None


def test_no_se_puede_inscribir_dos_veces():
    c = curso_de_prueba()
    with pytest.raises(ValueError):
        c.inscribir(Alumno("***REMOVED***", "Otro", "Nombre"))


def test_marcar_y_contar():
    c = curso_de_prueba()
    c.marcar("2026-08-21", "***REMOVED***", "P")
    c.marcar("2026-08-21", "***REMOVED***", "A")
    assert c.presentes("2026-08-21") == 1


def test_el_que_llega_tarde_vino():
    c = curso_de_prueba()
    c.marcar("2026-08-21", "***REMOVED***", "T")
    assert c.presentes("2026-08-21") == 1


def test_porcentaje():
    c = curso_de_prueba()
    c.marcar("2026-08-19", "***REMOVED***", "P")
    c.marcar("2026-08-21", "***REMOVED***", "A")
    assert c.porcentaje("***REMOVED***") == 50


def test_porcentaje_sin_datos_no_explota():
    c = curso_de_prueba()
    assert c.porcentaje("***REMOVED***") == 0


def test_no_se_puede_marcar_a_alguien_de_otro_curso():
    c = curso_de_prueba()
    with pytest.raises(ValueError):
        c.marcar("2026-08-21", "99999999", "P")


def test_dia_de_clase():
    c = curso_de_prueba()
    assert c.es_dia_de_clase("2026-08-21") is True    # viernes
    assert c.es_dia_de_clase("2026-08-22") is False   # sábado
