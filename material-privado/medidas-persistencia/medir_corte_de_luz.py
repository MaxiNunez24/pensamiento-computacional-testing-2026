"""Se corta la luz mientras el sistema esta guardando. Que queda.

La computadora del CFP va a estar prendida todo el dia en una escuela; un corte
de luz o alguien que la apaga de un boton no es hipotetico. La pregunta no es si
va a pasar sino que se pierde cuando pase.

Se simula matando el proceso EN MEDIO de la escritura (os._exit no corre
finally, no cierra archivos, no vacia buffers: es lo mas parecido a tirar del
enchufe que se puede hacer sin tirar del enchufe).
"""
import json, os, sqlite3, subprocess, sys, tempfile

BASE = tempfile.mkdtemp(prefix="corte_")
ARCH = os.path.join(BASE, "datos.json")
BD = os.path.join(BASE, "datos.db")

DATOS = {"alumnos": [{"id": i, "apellido": f"APELLIDO{i}", "dni": str(30_000_000 + i)}
                     for i in range(500)],
         "asistencia": {f"2026-{m:02d}": {str(i): {"1": "P", "3": "A"} for i in range(500)}
                        for m in range(3, 13)}}

# ---------------------------------------------------------------- preparar
with open(ARCH, "w", encoding="utf-8") as f:
    json.dump(DATOS, f, ensure_ascii=False)
tam_bueno = os.path.getsize(ARCH)

con = sqlite3.connect(BD)
con.execute("CREATE TABLE asistencia (alumno_id INTEGER, fecha TEXT, estado TEXT, "
            "PRIMARY KEY (alumno_id, fecha))")
con.executemany("INSERT INTO asistencia VALUES (?,?,?)",
                [(i, "2026-08-26", "P") for i in range(500)])
con.commit()
con.close()

HIJO = r'''
import json, os, sqlite3, sys
modo, arch = sys.argv[1], sys.argv[2]
if modo == "json":
    datos = json.load(open(arch, encoding="utf-8"))
    datos["asistencia"]["2026-08"]["7"]["29"] = "P"
    f = open(arch, "w", encoding="utf-8")
    texto = json.dumps(datos, ensure_ascii=False)
    f.write(texto[: len(texto) // 3])   # se corta la luz a un tercio del archivo
    f.flush(); os.fsync(f.fileno())
    os._exit(1)
else:
    con = sqlite3.connect(arch)
    con.execute("BEGIN")
    con.executemany("INSERT OR REPLACE INTO asistencia VALUES (?,?,?)",
                    [(i, "2026-08-29", "P") for i in range(500)])
    os._exit(1)                          # se corta la luz antes del commit
'''
guion = os.path.join(BASE, "hijo.py")
open(guion, "w", encoding="utf-8").write(HIJO)

print("=" * 68)
print("SE CORTA LA LUZ MIENTRAS GUARDA")
print("=" * 68)

subprocess.run([sys.executable, guion, "json", ARCH])
print(f"\nJSON   archivo antes: {tam_bueno/1024:.0f} KB -> despues: {os.path.getsize(ARCH)/1024:.0f} KB")
try:
    json.load(open(ARCH, encoding="utf-8"))
    print("       se pudo leer: SI")
except Exception as e:
    print(f"       se pudo leer: NO -> {type(e).__name__}: {str(e)[:60]}")
    print("       => se perdio TODO el archivo, no solo la marca que se estaba guardando")

subprocess.run([sys.executable, guion, "sqlite", BD])
con = sqlite3.connect(BD)
try:
    antes = con.execute("SELECT COUNT(*) FROM asistencia WHERE fecha='2026-08-26'").fetchone()[0]
    nuevas = con.execute("SELECT COUNT(*) FROM asistencia WHERE fecha='2026-08-29'").fetchone()[0]
    integridad = con.execute("PRAGMA integrity_check").fetchone()[0]
    print(f"\nSQLite base abierta: {integridad}")
    print(f"       lo de antes sigue estando: {antes} marcas del 26/8")
    print(f"       lo que se estaba guardando: {nuevas} marcas del 29/8 (se descarto entero)")
    print("       => se pierde la operacion a medio hacer; la base queda sana")
except Exception as e:
    print(f"\nSQLite -> {type(e).__name__}: {e}")
con.close()

print("\narchivos de prueba en:", BASE)
