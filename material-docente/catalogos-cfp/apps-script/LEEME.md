# El script del formulario

`Codigo.gs` le manda a cada emprendedor un mail con **su link, su QR y el link para editar** su
catálogo, le avisa cuando se aprueba, y le pide a GitHub que **publique en minutos**, sin esperar a
la hora.

> ⚠️ No está probado contra Google todavía: se prueba el día que exista el formulario de verdad.
> Si algo falla, el registro está en el editor del script → **Ejecuciones**.

## Ponerlo en marcha (una sola vez)

1. **Pegarlo:** en el formulario, los tres puntitos (arriba a la derecha) → **Editor de secuencias
   de comandos**. Borrar lo que haya, pegar todo `Codigo.gs` y guardar (💾).
2. **Completar `CONFIG`**, arriba de todo: `PLANILLA_ID` (lo que está entre `/d/` y `/edit` en la
   dirección de la planilla de respuestas) y `CONTACTO` (a quién escribir si pierden el link).
3. **Instalar:** arriba, en la lista de funciones, elegir **instalar** y tocar **▶ Ejecutar**. Google
   pide permiso para el formulario, la planilla y mandar mails: hay que aceptarlo con la cuenta del
   CFP (la que creó el formulario). Aparece un aviso de "app no verificada": **Configuración
   avanzada → Ir a…**, porque el script es nuestro.
4. **Publicar en minutos (opcional, pero es lo que lo hace "casi en tiempo real"):**
    1. En GitHub, con una cuenta dueña de la organización: *Settings → Developer settings →
       Personal access tokens → Fine-grained tokens → Generate new token*.
       - **Resource owner:** `cfp401-ensenada`. **Repository access:** solo `catalogos`.
       - **Permissions → Repository → Contents: Read and write** (es lo que pide GitHub para
         disparar un workflow desde afuera).
       - Vencimiento: un año, y anotarse cuándo renovarlo.
    2. En el editor del script: **⚙️ Configuración del proyecto → Propiedades del script → Agregar**:
       nombre `GITHUB_TOKEN`, valor el token. **Ahí no lo ve nadie más; nunca va en el código.**

Sin el paso 4 anda igual: los catálogos se publican en la próxima corrida de la hora.

## En el formulario

- **Configuración → Respuestas → Permitir que se editen las respuestas: SÍ.** Es lo que hace que el
  link para editar abra el formulario con todo lo que ya cargó.
- **Configuración → Presentación → Mensaje de confirmación:**
  > ¡Listo! Te mandamos un mail con el link de tu catálogo, su QR, y el link para editarlo cuando
  > quieras cambiar un precio. Guardalo.

## Si alguien pierde el link para editar

Está en la planilla, en la pestaña **Links para editar**: buscar el emprendimiento, copiar el link y
mandárselo **al correo con el que completó el formulario** (es su llave: no se manda a otro lado).
