# Auditoría: qué se da en teoría y no tiene ejercicios

> Hecha el 28/8/2026, después de notar que **slicing se tomó en el mini parcial y no está en la
> plataforma**. La pregunta era si había más agujeros iguales. Los hay, y están todos en el mismo
> lugar.

---

## El resultado en una línea

**El agujero es `listas`.** Todo lo demás está cubierto.

| | |
|---|---|
| Archivos de teoría sin **ninguna** página de ejercicios | 1 (`imports_y_modulos`) |
| Conceptos de la teoría sin ejercicio que los toque | **7**, y 6 son de listas o strings |
| Páginas de ejercicios que no salen de ninguna teoría | 6 (son las nuevas: lógica, testing, atajos) |

---

## 1. `listas` — cuatro ejercicios para once temas

La teoría de `listas.md` cubre: índices, **slicing**, modificar, agregar/eliminar, recorrer,
`len`/`in`, **ordenar y revertir**, **copiar**, **anidadas**, y **comprensiones**.

`listas.mdx` tiene **cuatro ejercicios**: primero/último/cuántos, agregar, ordenar sin modificar, y
mín/máx/suma.

### Qué falta y dónde está (o no)

| Concepto | ¿Está en algún lado? |
|---|---|
| **Slicing** | ✅ En el **cuadernillo** (`cuadernillo-listas`), no en `listas` |
| **Listas anidadas** | ✅ En el cuadernillo (sección 3, cinco ejercicios) |
| **Comprensiones** | ✅ En el cuadernillo (sección 2, seis ejercicios) |
| **Modificar por índice** (`lista[0] = x`) | ❌ **En ningún lado** |
| **Copiar listas** (`.copy()`, el alias) | ❌ **En ningún lado** |
| **`sort()` vs `sorted()`** | ⚠️ Solo `sorted`. La diferencia —que uno modifica y el otro no— **no se ejercita** |

### Por qué pasó, que es lo que importa

El cuadernillo se armó **para el fin de semana largo**, como material extra. Después el mini
parcial tomó de la teoría, no de los ejercicios. Resultado: **un alumno que hizo solo los
ejercicios de `listas` nunca vio slicing**, aunque estaba en la teoría y en el parcial.

> 📌 **La regla que sale de acá:** si un tema entra en una evaluación, tiene que tener un ejercicio
> en la página de su clase. El material extra es extra; no puede ser el único lugar donde vive un
> concepto.

---

## 2. Los tres agujeros reales

Estos no están en ninguna parte de la plataforma:

| Concepto | Dónde se da | Por qué importa para el proyecto |
|---|---|---|
| **Modificar por índice** | `listas.md` | El sistema cambia el estado de un alumno todo el tiempo |
| **Copiar listas** | `listas.md` | El alias es de los bugs más difíciles de ver: dos nombres, una sola lista |
| **`sort()` vs `sorted()`** | `listas.md` | La planilla ordena alumnos por apellido; conviene saber cuál usar |
| **Formato con `:.2f` y alineación** | `formato_strings.md` | La planilla alinea columnas. Se usa, y no se ejercitó |

**Cuatro ejercicios nuevos** los cubren. Es una hora de trabajo, y los cuatro se pueden escribir
apuntando al sistema, que es hacia donde va todo:

1. *Cambiar el estado de un alumno* → modificar por índice
2. *La lista que se modificó sola* → el alias, presentado como un bug a encontrar
3. *Ordenar sin romper el original* → `sort()` vs `sorted()`
4. *La columna alineada* → formato, con la planilla como excusa

### ✅ Hechos el 29/8/2026

Los cuatro están en `listas.mdx`, que pasó de **4 a 8 ejercicios**:

| Ejercicio | Concepto | Forma |
|---|---|---|
| **Cambiar el estado de un alumno** | `lista[i] = x` y `lista[-1]` | `EjercicioPython`, 🌱 |
| **Las dos formas de ordenar** | `sort()` **vs** `sorted()`, las dos en el mismo programa | `EjercicioPython`, 🌿 |
| **El respaldo que se modificó solo** | el alias | `EncontrarElError`, 🌿 — hay que **ubicar** la línea antes de arreglarla |
| **La planilla alineada** | `:<14`, `:>6.2f` | `EjercicioPython`, 🌿 |

Tres decisiones que vale la pena tener anotadas:

- **El del alias es `EncontrarElError` y no un ejercicio común.** El bug del alias no se resuelve
  escribiendo: se resuelve *leyendo*. En un editor libre el alumno tantea `.copy()` hasta que pasa
  el test y no entendió nada. Acá primero tiene que señalar cuál de las cinco líneas es la culpable.
- **`sort()` vs `sorted()` quedó como ejercicio aparte** del que ya existía. El viejo solo pedía
  `sorted`; la diferencia no se ve hasta que las dos están en el mismo programa, una debajo de la
  otra.
- **El de formato pide tres `print` casi iguales** y eso es a propósito: la consigna dice que es
  repetitivo, y esa incomodidad es el argumento de la clase siguiente (`for`).

Los ocho pasan con una solución de referencia y —lo que importa más— **rechazan las soluciones
equivocadas típicas**: el `3` escrito a mano donde iba `-1`, `sort()` donde iba `sorted()`, el bug
del alias sin arreglar, y las tres líneas de la planilla escritas a mano en vez de calculadas.

---

## 3. `imports_y_modulos` sin ejercicios

Es el único archivo de teoría sin página propia en la plataforma. **No es urgente**: se dio como
anexo el 26/6 y se vuelve a necesitar recién cuando el proyecto tenga varios archivos —o sea, en
la etapa del CLI, en septiembre.

Conviene hacerlo **entonces y con el proyecto adentro**: importar `modelo.py` desde `app.py` es
mucho mejor ejemplo que dos archivos de juguete.

---

## 4. Lo que está bien cubierto

Para no perder de vista que la mayoría está sano: **variables** (11 ejercicios), **condicionales**
(12), **bucles** (19), **diccionarios**, **funciones I y II**, **tuplas**, **sets**, **archivos**,
**JSON** y **POO** tienen ejercicios para todo lo que la teoría cubre. `funciones-2` incluso cubre
`*args`/`**kwargs`, que es lo más avanzado del curso.

---

## 5. Recomendación sobre dónde dar la clase

**Astro es el lugar de la clase; MkDocs queda como material de consulta.**

Los alumnos ya viven en la plataforma: ahí está su progreso, ahí mandan las consultas, ahí se
sincroniza todo. Abrir dos sitios en clase parte la atención.

Pero eso **obliga a que la plataforma esté completa**, y esta auditoría muestra que no lo estaba
del todo. Con los cuatro ejercicios de arriba, sí — y desde el 29/8 están escritos.

> Cuando se reescriban las clases apuntando al proyecto (ver `REESTRUCTURA-HACIA-EL-PROYECTO.md`),
> conviene hacer esta misma comprobación por cada clase que se toque: **¿todo lo que explico tiene
> un ejercicio donde se use?** Si no, o sobra en la teoría o falta un ejercicio.
