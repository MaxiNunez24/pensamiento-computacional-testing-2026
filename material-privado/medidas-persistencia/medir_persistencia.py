"""Mide JSON vs SQLite con la forma de datos real del sistema de asistencias.

No es un benchmark de laboratorio: usa el mismo esquema que el prototipo
(state.alumnos / state.asistencia["YYYY-MM"][alumnoId][dia]) y la escala real
que contó la preceptora: ~30 cursos simultáneos.
"""
import json, os, random, sqlite3, statistics, tempfile, time

random.seed(7)
BASE = tempfile.mkdtemp(prefix="asist_")

CURSOS = 30
ALUMNOS_POR_CURSO = 20
MESES = 10          # marzo a diciembre
DIAS_POR_MES = 9    # dos clases por semana

ESTADOS = ["P", "P", "P", "P", "A", "T", "J"]  # sesgado a presente, como la realidad

def alumno(i):
    return {"id": i, "apellido": f"APELLIDO{i:04d}", "nombre": f"Nombre Segundo {i}",
            "sexo": random.choice("MF"), "dni": str(random.randint(20_000_000, 60_000_000)),
            "tel": "221" + str(random.randint(1000000, 9999999)), "email": f"alumno{i}@ejemplo.com",
            "estado": "activo"}

def curso(c):
    alumnos = [alumno(c * 100 + i) for i in range(ALUMNOS_POR_CURSO)]
    asistencia = {}
    for m in range(3, 3 + MESES):
        clave = f"2026-{m:02d}"
        asistencia[clave] = {
            str(a["id"]): {str(random.randint(1, 28)): random.choice(ESTADOS)
                           for _ in range(DIAS_POR_MES)}
            for a in alumnos
        }
    return {"curso": c, "config": {"curso": f"CURSO {1900+c}", "instructor": f"Docente {c}",
                                   "diasCursada": [1, 3], "horarios": {"1": "13:20-16:40"}},
            "alumnos": alumnos, "asistencia": asistencia,
            "temas": {f"2026-{m:02d}": {"tratados": "Tema " * 12, "enTratamiento": "Tema"}
                      for m in range(3, 3 + MESES)}}

datos = [curso(c) for c in range(CURSOS)]

def cronometrar(f, veces=5):
    ts = []
    for _ in range(veces):
        t = time.perf_counter(); f(); ts.append((time.perf_counter() - t) * 1000)
    return statistics.median(ts)

print("=" * 68)
print(f"ESCALA: {CURSOS} cursos x {ALUMNOS_POR_CURSO} alumnos x {MESES*DIAS_POR_MES} dias")
print("=" * 68)

# ---------------------------------------------------------------- JSON: 1 archivo
unico = os.path.join(BASE, "todo.json")
with open(unico, "w", encoding="utf-8") as f:
    json.dump(datos, f, ensure_ascii=False)
tam_unico = os.path.getsize(unico)

def leer_todo():
    with open(unico, encoding="utf-8") as f:
        return json.load(f)

def escribir_todo():
    with open(unico, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False)

print(f"\nJSON, un solo archivo   : {tam_unico/1024:.0f} KB")
print(f"  leer entero           : {cronometrar(leer_todo):.1f} ms")
print(f"  guardar entero        : {cronometrar(escribir_todo):.1f} ms   <- esto pasa en CADA marca de asistencia")

# ------------------------------------------------------- JSON: un archivo por curso
carpeta = os.path.join(BASE, "cursos"); os.makedirs(carpeta, exist_ok=True)
for d in datos:
    with open(os.path.join(carpeta, f"{d['curso']}.json"), "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False)
tam_uno = os.path.getsize(os.path.join(carpeta, "0.json"))

def leer_uno():
    with open(os.path.join(carpeta, "0.json"), encoding="utf-8") as f:
        return json.load(f)

def escribir_uno():
    with open(os.path.join(carpeta, "0.json"), "w", encoding="utf-8") as f:
        json.dump(datos[0], f, ensure_ascii=False)

def buscar_dni_en_json():
    """Autoasistencia: alguien teclea su DNI en la entrada. Hay que encontrarlo."""
    objetivo = datos[17]["alumnos"][5]["dni"]
    for c in range(CURSOS):
        with open(os.path.join(carpeta, f"{c}.json"), encoding="utf-8") as f:
            d = json.load(f)
        for a in d["alumnos"]:
            if a["dni"] == objetivo:
                return d["curso"], a["id"]

print(f"\nJSON, un archivo por curso: {tam_uno/1024:.0f} KB cada uno")
print(f"  leer un curso         : {cronometrar(leer_uno):.1f} ms")
print(f"  guardar un curso      : {cronometrar(escribir_uno):.1f} ms")
print(f"  buscar un DNI (30 arch): {cronometrar(buscar_dni_en_json):.1f} ms   <- autoasistencia en la puerta")

# ---------------------------------------------------------------------- SQLite
bd = os.path.join(BASE, "asistencias.db")
con = sqlite3.connect(bd)
con.executescript("""
CREATE TABLE curso (id INTEGER PRIMARY KEY, nombre TEXT, instructor TEXT);
CREATE TABLE alumno (id INTEGER PRIMARY KEY, curso_id INTEGER, apellido TEXT, nombre TEXT,
                     sexo TEXT, dni TEXT, tel TEXT, email TEXT, estado TEXT);
CREATE TABLE asistencia (alumno_id INTEGER, fecha TEXT, estado TEXT,
                         PRIMARY KEY (alumno_id, fecha));
CREATE INDEX ix_alumno_dni ON alumno(dni);
CREATE INDEX ix_alumno_curso ON alumno(curso_id);
""")
for d in datos:
    con.execute("INSERT INTO curso VALUES (?,?,?)",
                (d["curso"], d["config"]["curso"], d["config"]["instructor"]))
    con.executemany("INSERT INTO alumno VALUES (?,?,?,?,?,?,?,?,?)",
                    [(a["id"], d["curso"], a["apellido"], a["nombre"], a["sexo"],
                      a["dni"], a["tel"], a["email"], a["estado"]) for a in d["alumnos"]])
    filas = []
    for mes, porAlumno in d["asistencia"].items():
        for aid, dias in porAlumno.items():
            for dia, est in dias.items():
                filas.append((int(aid), f"{mes}-{int(dia):02d}", est))
    con.executemany("INSERT OR REPLACE INTO asistencia VALUES (?,?,?)", filas)
con.commit()
tam_bd = os.path.getsize(bd)

def marcar_sqlite():
    con.execute("INSERT OR REPLACE INTO asistencia VALUES (?,?,?)", (5, "2026-08-29", "P"))
    con.commit()

def leer_mes_sqlite():
    return con.execute(
        "SELECT a.apellido, s.fecha, s.estado FROM asistencia s JOIN alumno a ON a.id = s.alumno_id "
        "WHERE a.curso_id = 0 AND s.fecha LIKE '2026-08%'").fetchall()

def buscar_dni_sqlite():
    objetivo = datos[17]["alumnos"][5]["dni"]
    return con.execute("SELECT id, curso_id FROM alumno WHERE dni = ?", (objetivo,)).fetchone()

def porcentaje_asistencia():
    """La pregunta que hoy NO se puede contestar: quien esta por debajo del 75%."""
    return con.execute("""
        SELECT a.apellido,
               ROUND(100.0 * SUM(s.estado IN ('P','T')) / COUNT(*), 1) AS pct
        FROM alumno a JOIN asistencia s ON s.alumno_id = a.id
        GROUP BY a.id HAVING pct < 75 ORDER BY pct LIMIT 20""").fetchall()

print(f"\nSQLite, un solo archivo : {tam_bd/1024:.0f} KB")
print(f"  marcar UNA asistencia : {cronometrar(marcar_sqlite):.1f} ms   <- con commit a disco")
print(f"  leer el mes de un curso: {cronometrar(leer_mes_sqlite):.1f} ms")
print(f"  buscar un DNI         : {cronometrar(buscar_dni_sqlite):.2f} ms")
print(f"  quien va por debajo de 75%: {cronometrar(porcentaje_asistencia):.1f} ms  "
      f"({len(porcentaje_asistencia())} alumnos)")

filas = con.execute("SELECT COUNT(*) FROM asistencia").fetchone()[0]
print(f"\nFilas de asistencia en la base: {filas:,}")

# ------------------------------------------------- la prueba que importa: dos a la vez
print("\n" + "=" * 68)
print("DOS PERSONAS GUARDANDO AL MISMO TIEMPO")
print("=" * 68)

# JSON: leer-modificar-escribir. Preceptora marca a Ana; docente marca a Beto.
with open(unico, encoding="utf-8") as f: copia_preceptora = json.load(f)
with open(unico, encoding="utf-8") as f: copia_docente = json.load(f)
copia_preceptora[0]["asistencia"]["2026-08"]["1"]["29"] = "P"   # Ana
copia_docente[0]["asistencia"]["2026-08"]["2"]["29"] = "A"      # Beto
with open(unico, "w", encoding="utf-8") as f: json.dump(copia_preceptora, f)
with open(unico, "w", encoding="utf-8") as f: json.dump(copia_docente, f)   # llega segundo
final = leer_todo()
print("JSON  -> Ana quedo marcada:",
      final[0]["asistencia"]["2026-08"]["1"].get("29"),
      "| Beto quedo marcado:", final[0]["asistencia"]["2026-08"]["2"].get("29"))

con.execute("INSERT OR REPLACE INTO asistencia VALUES (?,?,?)", (1, "2026-08-29", "P"))
con.execute("INSERT OR REPLACE INTO asistencia VALUES (?,?,?)", (2, "2026-08-29", "A"))
con.commit()
r = dict(con.execute("SELECT alumno_id, estado FROM asistencia WHERE fecha='2026-08-29' "
                     "AND alumno_id IN (1,2)").fetchall())
print("SQLite-> Ana quedo marcada:", r.get(1), "| Beto quedo marcado:", r.get(2))

con.close()
print("\narchivos de prueba en:", BASE)
