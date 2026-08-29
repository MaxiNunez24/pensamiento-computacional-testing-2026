"""SQLite tambien tiene su limite: un escritor a la vez.

Antes de recomendarlo conviene ver que pasa cuando 8 personas marcan asistencia
al mismo tiempo (la puerta un lunes a las 13:20). Se prueba con y sin WAL.
"""
import os, sqlite3, sys, tempfile, time
from concurrent.futures import ThreadPoolExecutor

BASE = tempfile.mkdtemp(prefix="locks_")

_n = 0

def preparar(modo):
    global _n
    _n += 1
    bd = os.path.join(BASE, f"{modo}_{_n}.db")   # una base nueva por prueba
    con = sqlite3.connect(bd)
    con.execute("CREATE TABLE asistencia (alumno_id INTEGER, fecha TEXT, estado TEXT, "
                "PRIMARY KEY (alumno_id, fecha))")
    con.execute(f"PRAGMA journal_mode={modo}")
    con.commit(); con.close()
    return bd

def escritor(bd, quien, cuantas, timeout):
    con = sqlite3.connect(bd, timeout=timeout)
    errores = 0
    for i in range(cuantas):
        try:
            con.execute("INSERT OR REPLACE INTO asistencia VALUES (?,?,?)",
                        (quien * 1000 + i, "2026-08-31", "P"))
            con.commit()
        except sqlite3.OperationalError:
            errores += 1
    con.close()
    return errores

def probar(modo, hilos=8, cuantas=50, timeout=5.0):
    bd = preparar(modo)
    t = time.perf_counter()
    with ThreadPoolExecutor(max_workers=hilos) as ex:
        errores = sum(ex.map(lambda q: escritor(bd, q, cuantas, timeout), range(hilos)))
    ms = (time.perf_counter() - t) * 1000
    con = sqlite3.connect(bd)
    guardadas = con.execute("SELECT COUNT(*) FROM asistencia").fetchone()[0]
    con.close()
    esperadas = hilos * cuantas
    print(f"  {modo:8s}: {guardadas}/{esperadas} marcas guardadas, "
          f"{errores} errores 'database is locked', {ms:.0f} ms en total "
          f"({ms/esperadas:.1f} ms por marca)")

print("=" * 68)
print("8 PERSONAS MARCANDO A LA VEZ, 50 MARCAS CADA UNA (400 en total)")
print("=" * 68)
probar("DELETE")   # el modo por defecto
probar("WAL")

print("\nY si alguien no espera (timeout de medio segundo):")
probar("WAL", timeout=0.5)
print("\narchivos de prueba en:", BASE)
