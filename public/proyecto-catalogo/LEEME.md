# Tu catálogo con Python

Un catálogo de productos, con botón de WhatsApp, armado por Python desde una planilla.
La clase con los ejercicios:
https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/web/catalogo/

## Qué hay en la carpeta

| Archivo | Qué es |
|---|---|
| `catalogo.py` | ✏️ **Tuyo.** Las funciones de los ejercicios, para completar |
| `productos.csv` | La planilla: **acá van tus productos** |
| `fotos/` | Las fotos de los productos |
| `estilos.css` | Los estilos, ya hechos. Los colores y la letra están arriba de todo |
| `adornos/` | Las ramitas de hojas que usan los estilos |

## Los pasos

1. **Completá `catalogo.py`** con las funciones de los ejercicios de la clase.
2. **Generá la página.** En la terminal, parado en esta carpeta:

   ```bash
   python catalogo.py
   ```

   (En Linux o Mac, `python3`.)
3. **Abrí `index.html` con doble clic.** Es el catálogo de ejemplo.

## Hacerlo tuyo

No se toca más código: se cambian datos.

| Quiero cambiar… | Dónde |
|---|---|
| El nombre de la marca y el WhatsApp | `TITULO` y `NUMERO`, arriba de todo en `catalogo.py` |
| Los productos, los precios, las descripciones | `productos.csv` |
| Las fotos | La carpeta `fotos/`, y su nombre en la columna `foto` |
| Los colores y la letra | Las variables de arriba de `estilos.css` |

- `productos.csv` se abre con una planilla de cálculo (al guardar, elegí *CSV UTF-8*) o con un
  editor de texto como VS Code. No borres la primera línea: son los nombres de las columnas.
- El precio va **solo el número**: `7900`, sin `$` ni puntos.
- Si un producto no tiene foto, dejá la columna `foto` vacía: sale el emoji.
- El nombre de la foto, **exactamente igual** en la planilla y en el archivo (mayúsculas
  incluidas), sin espacios ni tildes. Cuadradas y livianas (unos 800 píxeles de ancho).
- **Datos de más** (material, medidas, talles, lo que necesites): agregá una columna a la planilla
  con ese nombre (`tiempo_de_entrega`, con guiones bajos en vez de espacios). Si la dejás vacía en
  un producto, ahí no aparece. Se muestran cuando completes `detalles()`, el ejercicio optativo
  *Detalles a tu medida*: la planilla de ejemplo ya trae `material` y `tiempo_de_entrega`.

Después de cada cambio: `python catalogo.py` de nuevo.

## Publicarlo gratis en GitHub Pages

1. Creá un repositorio **público** en GitHub, por ejemplo `catalogo`.
2. Subí todo lo de esta carpeta: `index.html`, `estilos.css`, `fotos/` y `adornos/`.
   (En **Add file → Upload files** se pueden arrastrar las carpetas enteras.)
3. En el repositorio: **Settings → Pages → Branch: `main`, carpeta `/ (root)` → Save**.
4. En uno o dos minutos aparece el link: `https://tu-usuario.github.io/catalogo/`.

Para actualizarlo: `python catalogo.py` y volvés a subir `index.html` (y las fotos nuevas).

> ⚠️ Lo que subís es **público**: ahí no van datos que no pondrías en una vidriera.
