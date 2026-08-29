# ¿JSON o SQLite para el sistema de asistencias?

> Análisis del 29/8/2026. La pregunta era si conviene dejar los datos en JSON o pasar a SQLite u
> otro motor. Está medido, no opinado: los números de abajo salen de correr las dos opciones con
> la forma de datos real del prototipo y la escala que contó la preceptora (~30 cursos).
>
> Scripts: `scratchpad/medir_persistencia.py`, `medir_corte_de_luz.py`, `medir_sqlite_locks.py`.

---

## La respuesta corta

**SQLite. Pero recién el 30/10, y JSON hasta entonces.**

Las dos mitades de esa frase importan igual:

- **SQLite es lo que tiene que quedar** en la máquina del CFP. No por velocidad —JSON es más que
  suficiente de rápido— sino porque el sistema va a tener **varias personas cargando al mismo
  tiempo** y va a vivir en una computadora que **se apaga**. JSON pierde datos en los dos casos.
  Medido, más abajo.
- **JSON va primero igual**, porque el camino de aprendizaje es ese y porque el sistema por
  consola tiene que estar funcionando el 2/10, mucho antes de que sepan SQL.

Lo que sí hay que cambiar desde ahora es **cómo se escribe el código**, para que el 30/10 cambiar
de uno a otro sea tocar **un archivo** y no reescribir el sistema. Eso está en §7, y es lo único
de este documento que hay que hacer ya.

> El plan de clases ya tiene **SQLite el 30/10** y **SQLite II el 4/11**. Este análisis no cambia
> el cronograma: lo confirma y le da el argumento.

---

## 1. La escala real, que es chica

| | |
|---|---|
| Cursos simultáneos | ~30 |
| Alumnos por curso | ~20 |
| Días de clase por año | ~90 |
| **Marcas de asistencia al año** | **~47.000** |
| Personas usando el sistema a la vez | 2 a 8 (preceptoría + docentes + la puerta) |

47.000 filas es **nada** para cualquiera de las dos opciones. Por eso el argumento no puede ser el
tamaño, y hay que decirlo antes de que alguien lo use.

---

## 2. Lo que NO es el argumento: la velocidad

Medido con esos 30 cursos cargados:

| Operación | JSON (1 archivo por curso) | SQLite |
|---|---|---|
| Guardar una marca de asistencia | **1,7 ms** | 5,8 ms |
| Leer el mes de un curso | 0,3 ms | 0,3 ms |
| Buscar un DNI entre los 30 cursos | 5,6 ms | **0,06 ms** |
| Tamaño en disco | 22 KB por curso (660 KB) | 2,2 MB |

**Para guardar una marca, JSON es más rápido que SQLite** —tres veces— y ocupa un tercio del
espacio. Cualquiera que argumente "SQLite porque es más rápido" no lo midió.

> ⚠️ **Con un solo archivo JSON para todo, sí se rompe:** guardar entero tarda **41 ms** y eso
> pasa en **cada** marca de asistencia. Si se va por JSON, tiene que ser **un archivo por curso**.
> Es la diferencia entre 1,7 ms y 41 ms, y es gratis.

La única fila donde SQLite gana feo es la búsqueda por DNI: 100 veces más rápido. Y da la
casualidad de que **la autoasistencia con teclado numérico en la entrada** —la idea que más
entusiasmó al grupo— es exactamente esa consulta, repetida por cada persona que entra.

---

## 3. El argumento de verdad: dos personas guardando a la vez

Esta es la prueba. La preceptora marca a Ana; el docente, desde el aula, marca a Beto. Al mismo
tiempo.

```
JSON  -> Ana quedó marcada: None   | Beto quedó marcado: A
SQLite-> Ana quedó marcada: P      | Beto quedó marcado: A
```

**La marca de Ana desapareció.** Nadie vio un error. Los dos vieron "Guardado ✓".

Por qué pasa: con JSON el programa **lee el archivo entero, lo modifica en memoria y lo escribe
entero**. Los dos leyeron la misma foto, cada uno le agregó su marca, y el segundo en guardar pisó
el archivo con una foto que no tenía la marca del primero. No es un bug del código: es cómo
funciona escribir un archivo completo.

> 📌 **Esto ya nos pasó en este curso.** Es exactamente lo que le borró el progreso a un alumno en
> la plataforma en agosto: dos computadoras, cada una mandando su foto entera del progreso, la
> última pisando a la anterior. Lo arreglamos fusionando en vez de pisar, y agregando un timestamp
> por ejercicio. **Es el mismo problema, y da para una clase entera.**

SQLite no tiene que elegir: cada marca es una fila distinta, y el motor las guarda las dos.

---

## 4. El otro argumento: la computadora se apaga

Va a estar prendida todo el día en una escuela. Alguien la apaga del botón, se corta la luz, se
tropieza con el cable. La pregunta no es si pasa, es qué queda cuando pasa.

Simulado matando el proceso **en medio de la escritura**:

| | Qué quedó |
|---|---|
| **JSON** | Archivo de 169 KB → 56 KB. **No se puede leer más**: `JSONDecodeError`. Se perdió **todo el año**, no la marca que se estaba guardando |
| **SQLite** | Base sana (`integrity_check: ok`). Están las 500 marcas viejas; las 500 que se estaban guardando se descartaron enteras |

JSON no pierde *la operación*: pierde **el archivo**. Un año de asistencias de un curso se vuelve
ilegible porque se cortó la luz en el segundo equivocado.

> Se puede mitigar en JSON: escribir a un archivo temporal y **renombrar** al final (`os.replace`,
> que es atómico). Es una línea y hay que hacerla igual. Pero mitiga *este* problema, no el de §3.

---

## 5. El tercer argumento: preguntas que con JSON no se contestan

Con SQLite, "quién va por debajo del 75% de asistencia" es una consulta de seis líneas que tarda
**13 ms sobre los 30 cursos**:

```sql
SELECT a.apellido,
       ROUND(100.0 * SUM(s.estado IN ('P','T')) / COUNT(*), 1) AS pct
FROM alumno a JOIN asistencia s ON s.alumno_id = a.id
GROUP BY a.id HAVING pct < 75 ORDER BY pct;
```

Con JSON hay que abrir 30 archivos, recorrer todo y contar a mano. Se puede —es un buen ejercicio
de bucles, de hecho— pero cada pregunta nueva es un programa nuevo.

Y la lista de preguntas que ya pidieron es larga: cuántas meriendas preparar hoy, quién no vino
tres veces seguidas, cuántos egresados por curso, el número histórico de alumno. **Eso es una base
de datos**, y llamarla por su nombre ahorra pelear contra el formato.

---

## 6. El límite de SQLite, dicho de frente

SQLite deja **un escritor a la vez**. Vale saberlo antes de recomendarlo, así que se midió: 8
personas marcando asistencia simultáneamente, 50 marcas cada una.

| Modo | Resultado |
|---|---|
| Por defecto (`DELETE`) | **400/400 guardadas**, 0 errores, 6,8 ms por marca |
| `PRAGMA journal_mode=WAL` | **400/400 guardadas**, 0 errores, **2,3 ms por marca** |
| WAL, pero con `timeout=0.5` | 398/400 — **2 errores `database is locked`** |

No se perdió ni una y nadie esperó más de unos milisegundos. Con 8 personas y una marca cada
pocos segundos, ese límite **no se toca ni de lejos**.

> ⚠️ La tercera fila es la letra chica: cuando un escritor encuentra la base ocupada, **espera**.
> Cuánto espera lo decide `sqlite3.connect(archivo, timeout=...)`, que **por defecto son 5
> segundos**. Bajarlo a medio segundo alcanzó para perder 2 marcas de 400. Moraleja para la clase:
> ese error no significa "SQLite no aguanta", significa "alguien se cansó de esperar". **No tocar
> el `timeout`.**

> 🔧 **Poner `PRAGMA journal_mode=WAL` el primer día.** Es una línea, triplica la velocidad con
> varios escribiendo y no tiene contra en este escenario. Se configura una vez y queda en el
> archivo.

Dónde sí se tocaría el límite: cientos de escrituras por segundo, o varias máquinas escribiendo
sobre un archivo compartido en red. **Ninguna de las dos es este proyecto** —hay una sola máquina
sirviendo— y si algún día lo fuera, ahí recién aparece PostgreSQL.

---

## 7. Por qué no PostgreSQL, MySQL ni "algo más serio"

| | Por qué no |
|---|---|
| **PostgreSQL / MySQL** | Son un **servicio aparte**: hay que instalarlo, arrancarlo con la máquina, crear usuarios, sacarle copia por separado. En una netbook de un CFP que además tiene que estar prendida sola, es una pieza más que se puede romper y nadie sabe arreglar. Resuelven un problema —muchas máquinas escribiendo a la vez— que este sistema **no tiene** |
| **MongoDB** | Guarda documentos parecidos a JSON, así que suena natural. Pero trae el mismo servicio aparte y **ninguna** de las garantías que hacen falta acá; los datos son tabla pura (alumno, fecha, estado), que es justo lo que SQL hace bien |
| **Google Sheets como base** | Tentador porque ya lo usan. Pero necesita internet, y en §12 del documento del proyecto se decidió **red local sin internet**. Queda descartado por esa decisión, no por técnico |
| **SQLite** | ✅ Es **un archivo**. Se copia con Ctrl+C, se manda por mail, se abre con [DB Browser](https://sqlitebrowser.org). Viene **dentro de Python** (`import sqlite3`, no se instala nada). Es lo que usan Firefox, Android y los aviones |

> El argumento de la copia de seguridad es más fuerte de lo que parece. §12.2 dice: "si se rompe
> esa computadora, se pierde todo". Con SQLite la copia de seguridad es **copiar un archivo**, y
> eso lo puede hacer la preceptora sin saber nada. Con Postgres hay que enseñarle `pg_dump`.

---

## 8. Lo único que hay que hacer AHORA: la puerta de entrada a los datos

Nada de esto obliga a decidir hoy, **si el código se escribe bien desde el principio**. La regla es
una sola:

> 🔑 **Ninguna parte del sistema abre un archivo. Todas le piden los datos a un módulo.**

En vez de esto, repartido por todos lados:

```python
# ❌ en la vista, en el CLI, en Flask... en doce lugares distintos
with open("curso_1978.json") as f:
    datos = json.load(f)
datos["asistencia"]["2026-08"]["7"]["29"] = "P"
with open("curso_1978.json", "w") as f:
    json.dump(datos, f)
```

esto, en un solo archivo `repositorio.py`:

```python
# ✅ repositorio.py — el ÚNICO archivo que sabe dónde viven los datos
def marcar_asistencia(alumno_id, fecha, estado): ...
def asistencia_del_mes(curso_id, anio, mes): ...
def buscar_por_dni(dni): ...
def alumnos_de(curso_id): ...
```

y en todo el resto del sistema:

```python
import repositorio
repositorio.marcar_asistencia(7, "2026-08-29", "P")
```

Migrar el 30/10 es entonces **escribir un `repositorio.py` nuevo con las mismas funciones por
fuera y SQL por dentro**. El CLI, Flask y los tests no se enteran. Sin esto, la migración es
buscar `json.load` en todo el proyecto y rezar.

> 💡 **Y esto es la mejor clase del año.** No hay forma de explicar "separá la lógica del
> almacenamiento" que se entienda tanto como cambiarle el motor a un sistema que ya funciona y ver
> que **no se rompió nada**. El 30/10 no es "damos SQLite": es *cobrar* el trabajo bien hecho en
> octubre. Los tests de pytest (7-9/10) son la prueba: **los mismos tests tienen que pasar con las
> dos versiones del repositorio.** Ahí se ve para qué servían los tests.

---

## 9. La migración, el 30/10

El script es corto porque el modelo ya está pensado:

```sql
CREATE TABLE curso  (id INTEGER PRIMARY KEY, numero TEXT, certificacion TEXT,
                     docente TEXT, inicio TEXT, fin TEXT);
CREATE TABLE alumno (id INTEGER PRIMARY KEY, curso_id INTEGER REFERENCES curso(id),
                     apellido TEXT, nombre TEXT, sexo TEXT, dni TEXT,
                     tel TEXT, email TEXT, estado TEXT);
CREATE TABLE asistencia (alumno_id INTEGER REFERENCES alumno(id),
                         fecha TEXT, estado TEXT,
                         PRIMARY KEY (alumno_id, fecha));
CREATE INDEX ix_alumno_dni ON alumno(dni);
```

Tres cosas que valen una explicación en clase:

1. **`fecha` es una sola columna `"2026-08-29"`**, no mes + día como en el JSON. La estructura
   `{"2026-08": {"7": {"29": "P"}}}` es cómoda para dibujar la grilla del mes y **incómoda para
   todo lo demás**. Guardar la fecha entera cuesta lo mismo y contesta más preguntas.
2. **`PRIMARY KEY (alumno_id, fecha)`** hace **imposible** que un alumno tenga dos marcas el mismo
   día. En JSON eso lo tiene que garantizar el código, y el código se olvida.
3. **`REFERENCES`** hace imposible una asistencia de un alumno que no existe. En SQLite hay que
   pedirlo: `PRAGMA foreign_keys = ON`.

Checklist:

- [ ] `repositorio_sqlite.py` con las mismas funciones que el de JSON
- [ ] Correr **los mismos tests** contra los dos. Si pasan, la migración está bien
- [ ] Script `importar_json.py` que lea los `.json` y llene la base (se corre una vez)
- [ ] `PRAGMA journal_mode=WAL` y `PRAGMA foreign_keys=ON` al abrir
- [ ] **Guardar los `.json` viejos**, no borrarlos. Son la copia de seguridad de la migración
- [ ] Copia automática del `.db` a un pendrive y **una copia fuera del edificio** (§12.2)

---

## 10. Dónde JSON se queda para siempre

No es "JSON malo, SQL bueno". JSON sigue siendo la respuesta correcta para:

| | Por qué |
|---|---|
| **La configuración del curso** | Se lee al arrancar, la toca una persona, es un puñado de campos |
| **Exportar e importar** | Mandar datos a otro programa. El CSV de Google Forms entra así hoy |
| **La copia de seguridad legible** | Un `.json` se abre con el Bloc de notas dentro de diez años; para el `.db` hace falta un programa |
| **Hablar con el navegador** | Cuando el sistema tenga JavaScript, lo que viaja entre el servidor y la página **es JSON**. La clase del 2/9 no se desperdicia: se usa distinto |

> Vale decirlo en clase el 30/10, porque si no queda la idea de que lo aprendido se tira: **JSON no
> se reemplaza, se le da el trabajo que hace bien.** Un archivo para configuración y para
> intercambio; una base para datos que crecen y que tocan varias personas.
