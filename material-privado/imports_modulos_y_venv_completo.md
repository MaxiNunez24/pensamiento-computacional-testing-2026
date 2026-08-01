# 📦 Imports, módulos, paquetes y venv — referencia completa (solo profe)

> **Privado.** Vive en `material-privado/` (fuera de `docs/`), así que **no se publica**. Es el
> tratamiento *completo* del tema imports + el borrador de la futura clase de paquetes/entornos
> virtuales. El anexo público para los alumnos (nivel núcleo) está en
> `docs/clases/python/06_funciones/imports_y_modulos.md`.

## Para qué sirve este documento

El anexo público se queda en lo esencial (módulo, `import`, `from import`, el caso Bingo). Acá está
**todo lo demás** que conviene tener a mano y que más adelante se puede convertir en una clase propia:

1. El gotcha `if __name__ == "__main__"` (a fondo).
2. Paquetes: carpetas con `__init__.py`, imports absolutos vs relativos, `sys.path`.
3. Entornos virtuales (`venv`) + `pip` + `requirements.txt`.

---

## 1. `if __name__ == "__main__"` — el gotcha del Bingo

### El problema concreto

El `main.py` del Bingo tiene código **al nivel de arriba** (no dentro de funciones):

```python
print("¡Empieza el juego!")
carton = generar_carton()
input("Presioná Enter para empezar...")
# ... el while del juego ...
```

Cuando un archivo se **importa**, Python **ejecuta todo su contenido de arriba a abajo** para "armar"
el módulo. Eso incluye ese código suelto. Resultado: si alguien hace `import main` (o
`from main import algo`), **el juego arranca solo**, pide Enter, etc. No es lo que querés.

### La solución

Python le pone a cada módulo una variable mágica `__name__`:

- Si el archivo se **ejecuta directo** (`python main.py`) → `__name__ == "__main__"`.
- Si el archivo se **importa** desde otro → `__name__ == "main"` (el nombre del módulo).

Entonces, el código que solo debe correr al ejecutar el archivo se mete dentro de un `if`:

```python
def jugar_individual():
    ...

def jugar_multijugador(nombres):
    ...

if __name__ == "__main__":
    # esto SOLO corre si ejecutás este archivo directamente,
    # NO cuando otro archivo lo importa.
    opcion = input("Elegí (1/2): ")
    if opcion == "1":
        jugar_individual()
    else:
        jugar_multijugador(["Ana", "Beto", "Cami"])
```

### Cómo explicarlo en clase

Demo en vivo de 2 minutos: poné `print("¡hola desde bingo!")` suelto en `bingo.py`, importalo desde
`main.py` y mostrá que el print salta al importar. Después envolvelo en el `if` y mostrá que ya no.
El "clic" es ver que **importar = ejecutar**.

Analogía: un archivo `.py` tiene dos roles — **librería** (lo importan para usar sus funciones) y
**programa** (lo ejecutás). El `if __name__ == "__main__"` es la línea que separa "lo que ofrezco a
otros" de "lo que hago cuando me corren a mí".

---

## 2. Paquetes (organizar módulos en carpetas)

Cuando hay muchos módulos, se agrupan en **carpetas** = **paquetes**.

### `__init__.py`

Históricamente, una carpeta era un paquete si tenía un archivo `__init__.py` (puede estar vacío).
Ejemplo:

```
proyecto/
├── juego/
│   ├── __init__.py
│   ├── carton.py
│   └── sorteo.py
└── main.py
```

Desde `main.py` importás con la carpeta como prefijo:

```python
from juego.carton import generar_carton
from juego import sorteo
```

> Nota técnica: desde Python 3.3 existen los *namespace packages* (carpetas sin `__init__.py` que
> igual funcionan como paquetes en muchos casos). Para enseñar, **mantené el `__init__.py`**: es
> explícito, evita sorpresas y es lo que verán en la mayoría de los proyectos reales.

`__init__.py` también puede tener código que corre al importar el paquete (p. ej. re-exportar cosas
para acortar imports). Para principiantes: dejarlo **vacío** y listo.

### Imports absolutos vs relativos

- **Absoluto** (recomendado, legible): `from juego.sorteo import sortear_numero`.
- **Relativo** (dentro del mismo paquete): `from .sorteo import sortear_numero` (el `.` = "esta misma
  carpeta"), `from ..otra import x` (`..` = carpeta de arriba).

Los relativos solo funcionan **dentro de un paquete** y cuando el código se ejecuta como módulo del
paquete, no como script suelto — fuente típica de `ImportError: attempted relative import with no
known parent package`. Para evitar dolores de cabeza con el grupo: **enseñar solo imports absolutos**.

### `sys.path` y "desde dónde se ejecuta"

Python busca los módulos en una lista de carpetas: `sys.path`. Incluye la carpeta del script que
ejecutás, las del intérprete y las de los paquetes instalados. El 90 % de los
`ModuleNotFoundError` de principiantes es por ejecutar el script **desde otra carpeta** o tener los
archivos en lugares distintos.

```python
import sys
print(sys.path)   # útil para depurar "no encuentra el módulo"
```

Regla práctica para el grupo: **ejecutá siempre desde la carpeta del proyecto** y mantené los archivos
juntos.

---

## 3. Entornos virtuales (`venv`)

> El profe lo marcó: los venv "no están en ningún lado y hoy se usan muchísimo". Acá está el material
> para la futura clase.

### El problema

Cada proyecto necesita librerías (y a veces **versiones distintas** de la misma librería). Si instalás
todo "global" (`pip install` a secas), tarde o temprano un proyecto pisa al otro y se rompe algo. Un
**entorno virtual** es una carpeta aislada con su **propio** Python y sus **propias** librerías, una
por proyecto.

Analogía: un cajón de herramientas por proyecto, en vez de tirar todo en una sola caja gigante.

### Crear y activar

```bash
# 1) Crear el entorno (una sola vez por proyecto). Crea la carpeta .venv/
python -m venv .venv
```

```bash
# 2) Activarlo (cada vez que abrís una terminal nueva para el proyecto)

# Windows (PowerShell)
.venv\Scripts\Activate.ps1
# Windows (cmd)
.venv\Scripts\activate.bat
# macOS / Linux
source .venv/bin/activate
```

Cuando está activo, el prompt muestra `(.venv)` adelante. Para salir: `deactivate`.

> Tip Windows: si PowerShell se queja con "execution of scripts is disabled", correr una vez
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (o activar por `cmd`).

### Instalar librerías y congelarlas

```bash
# con el entorno activo:
pip install requests
pip list                      # qué hay instalado en ESTE entorno
pip freeze > requirements.txt # "foto" de las versiones, para compartir
```

Otra persona (u otra compu) reproduce el entorno con:

```bash
python -m venv .venv
# activar...
pip install -r requirements.txt
```

### `.gitignore`

**Nunca** se commitea la carpeta del entorno (es pesada y específica de cada máquina). Al repo va el
`requirements.txt`, **no** el `.venv/`:

```gitignore
# .gitignore
.venv/
__pycache__/
*.pyc
```

### Cómo encararlo en clase

- Mostrar el problema primero (dos proyectos que necesitan versiones distintas → conflicto).
- Crear el venv juntos, activarlo, instalar algo chico (`requests`), `pip freeze`.
- Conectar con Git/GitHub (ya tienen esa clase): el `requirements.txt` viaja, el `.venv/` no.
- Encaja bien **antes** de cualquier proyecto que use librerías externas (p. ej. el de Asistencias con
  Flask, o el bot con Playwright).

---

## Orden sugerido y prerequisitos

| Tema | Prerequisito | Cuándo |
|------|--------------|--------|
| Anexo público (núcleo) | Funciones + Bingo | ya (publicado) |
| `if __name__ == "__main__"` | el anexo núcleo | clase corta, junto a un repaso de imports |
| Paquetes / `__init__.py` | imports cómodos | cuando un proyecto tenga varias carpetas |
| `venv` + `pip` + `requirements.txt` | Git/GitHub | **antes** del primer proyecto con librerías (Flask/Playwright) |

Idea: una clase "Proyectos Python de verdad" que junte `if __name__`, estructura en carpetas y `venv`
como preparación directa para el Sistema de Asistencias.
