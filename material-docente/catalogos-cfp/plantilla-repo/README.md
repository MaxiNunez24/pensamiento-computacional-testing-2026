# Catálogos del CFP 401

Un catálogo en internet, gratis, para cada estudiante del CFP 401 que tenga un emprendimiento. Se
completa un formulario de Google, alguien del CFP lo aprueba, y en menos de una hora el catálogo está
publicado, con su QR. Lo hizo el curso de **Pensamiento Computacional**.

- **El formulario y qué es aprobar:** `formulario.md` (en el repo del curso, junto a esta plantilla).
- **Cómo funciona por dentro:** las clases *Catálogos para todo el CFP* y *CI/CD* de la plataforma
  del curso, en "Preparando la Expo".

## Qué hay

| | Qué hace |
|---|---|
| `generar.py` | Lee la planilla, se queda con lo aprobado y arma el sitio en `sitio/` |
| `tests/` | Los tests: si alguno falla, no se publica nada |
| `estilos/` | Los estilos del catálogo de la clase, más los de la vidriera y los carteles |
| `.github/workflows/publicar.yml` | Lo que hace GitHub solo: cada hora, tests → generar → publicar |

## Probarlo en tu compu

```
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
pytest
python generar.py ruta\a\respuestas.xlsx
```

Abrí `sitio\index.html`. Sin credenciales de Google, los productos salen con el emoji en vez de la
foto: para probar alcanza. Hay una planilla de ejemplo, `respuestas-ejemplo.xlsx`, en el repo del
curso.

## Ponerlo en marcha (una sola vez)

### 1. El repo

1. Crear la organización **cfp401-ensenada** en GitHub (gratis): *Your organizations → New
   organization → Free*. Sumar como dueños a quienes vayan a mantenerlo.
2. Crear el repo **catalogos** (público) en la organización y subir esta carpeta.
3. *Settings → Pages → Source: **GitHub Actions***.

El sitio queda en `https://cfp401-ensenada.github.io/catalogos/`.

### 2. Que GitHub pueda leer la planilla y las fotos

La planilla tiene correos y teléfonos, así que **no se publica**: GitHub la lee con una **cuenta
de servicio** de Google, que es como un usuario para programas.

1. En [console.cloud.google.com](https://console.cloud.google.com), con la cuenta del CFP: crear un
   proyecto (por ejemplo, *catalogos-cfp401*).
2. *APIs y servicios → Biblioteca*: habilitar **Google Sheets API** y **Google Drive API**.
3. *IAM y administración → Cuentas de servicio → Crear*: nombre *catalogos*. Sin roles.
4. En la cuenta creada: *Claves → Agregar clave → JSON*. Se baja un archivo: **es una llave, no se
   comparte ni se sube a ningún repo**.
5. Copiar el correo de la cuenta de servicio (termina en `iam.gserviceaccount.com`) y **compartirle
   como Lector**: la planilla de respuestas, y la carpeta *(File responses)* del formulario en Drive.

### 3. Los secretos en GitHub

En el repo: *Settings → Secrets and variables → Actions*.

- **Secrets → New repository secret:** `GOOGLE_CREDENTIALS`, con **todo el contenido** del JSON.
- **Variables → New repository variable:** `PLANILLA_ID`, con el código de la planilla (lo que está
  entre `/d/` y `/edit` en su dirección).

### 4. Probar

*Actions → Publicar los catálogos → Run workflow*. En un par de minutos, si todo está en verde, el
sitio está publicado. Desde ahí corre solo, cada hora.

## A tener en cuenta

- **El horario del cron es UTC**: `17 * * * *` es "en el minuto 17 de cada hora", a cualquier hora.
- **GitHub apaga los workflows programados** de los repos públicos que pasan **60 días sin cambios**.
  Si pasa, avisa por correo: se reactiva desde *Actions*, con un botón.
- **Para que alguien pueda cambiar su catálogo**, completa el formulario de nuevo con el mismo nombre
  de emprendimiento. Hasta que se apruebe la respuesta nueva, sigue publicado el de antes.
- **Para darlo de baja**, se destilda *Aprobado* en todas sus respuestas: en la próxima corrida
  desaparece.
- La lectura desde Google (`leer_de_google` y `bajar_imagen`) se prueba de verdad recién con la
  cuenta de servicio creada: el resto está cubierto por los tests.
