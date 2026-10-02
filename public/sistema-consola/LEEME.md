# El sistema de asistencias, por consola

La primera versión del sistema que anda de verdad: dar de alta alumnos, pasar
lista y ver la lista del día. Todo guardado en una base SQLite.

## Los archivos

| Archivo | ¿De quién? | Qué hace |
|---|---|---|
| `alumno.py` | ya viene hecho | La clase `Alumno`: la de POO, con el `raise` de Excepciones |
| `repositorio.py` | ✏️ **tuyo** (abajo de todo) | Todo lo que toca la base. Te faltan `marcar` y `lista_del_dia` |
| `menu.py` | ✏️ **tuyo** | Lo que habla con la persona. Te faltan el alta y el menú |
| `asistencias.db` | se crea sola | La base. **No se sube a GitHub**: tiene datos de personas reales |

## Cómo se arranca

Abrí la carpeta en VS Code (**Archivo → Abrir carpeta**), abrí la terminal y:

```
python menu.py
```

No hay que instalar nada: `sqlite3` viene con Python.

> ⚠️ **Si bajaste el proyecto antes y ya tenías un `asistencias.db`**, borralo
> antes de arrancar. Las tablas se crean con `CREATE TABLE IF NOT EXISTS`, así
> que una base vieja se queda como estaba y te va a decir
> `no such column: marcado_por`. Borrar el archivo lo arregla: se crea sola de
> nuevo. (Cuando el sistema esté en el CFP con datos de verdad esto no se hace
> así, se migra; pero eso lo vemos cuando llegue.)

## La regla de oro

En `menu.py` solo hay `input()`, `print()` y llamadas a `repositorio`. Nada de
SQL, nada de reglas. Así, cuando pasemos a Flask, se reemplaza ese archivo solo.
