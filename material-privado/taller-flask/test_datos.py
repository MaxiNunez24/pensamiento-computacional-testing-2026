from modelo import Alumno, Curso
from datos import guardar, cargar


def test_lo_guardado_vuelve_igual(tmp_path):
    ruta = tmp_path / "prueba.json"
    c = Curso("1978", "Pensamiento", dias_cursada=[2, 4])
    c.inscribir(Alumno("40000001", "Gómez", "Lucía"))
    c.marcar("2026-08-21", "40000001", "P")
    guardar(c, ruta)

    otro = cargar(ruta)
    assert otro.numero == "1978"
    assert otro.buscar("40000001").nombre == "Lucía"
    assert otro.estado_de("2026-08-21", "40000001") == "P"
    assert otro.presentes("2026-08-21") == 1


def test_si_no_hay_archivo_arranca_vacio(tmp_path):
    c = cargar(tmp_path / "no-existe.json")
    assert c.activos() == []
