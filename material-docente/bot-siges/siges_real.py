"""Cómo se completa el formulario REAL del SiGeS.

Está separado de bot.py a propósito: el simulador de la clase y el sistema del
Ministerio son dos formularios distintos, y mezclarlos en una sola función llena
de `if` termina en que se rompen los dos. `bot.py` elige uno u otro según se
corra con `--real`.

De dónde salen estos selectores
-------------------------------
De las 16 pantallas reales guardadas el 15/10/2026, el proceso entero de punta a
punta (`material-docente/capturas_bot/siges-2026-10-15/`, fuera de Git: tienen
datos de personas). Ver `mapa_siges.md`. `probar_selectores.py` verifica, sobre
esas pantallas, que cada selector de acá encuentre EXACTAMENTE un elemento.

Cómo se encuentra cada cosa (y por qué así)
-------------------------------------------
- **Los campos de texto, por `formcontrolname` o `name`** (`apellido`, `calle`).
  Los pusieron los programadores del sistema: no cambian solos. Los `id`
  (`mat-input-12`) sí, los genera Angular.
- **Las opciones, por el nombre del grupo y su `value`**: `sexo` = `femenino`,
  `hijos` = `false`. NO por el texto: en el formulario hay nueve pares "Si / No",
  y buscar "Si" encuentra nueve. Se hace clic en la etiqueta de esa opción (el
  `<input>` lo tapa el circulito que dibuja Material).
- **Distrito y Localidad, por su rótulo**: no tienen nombre. Son buscadores: se
  escribe y se elige de la lista.

Lo que este módulo NO hace, y no es un olvido
---------------------------------------------
1. **No inicia sesión.** La sesión la abre una persona, siempre.
2. **No inventa datos.** Vivienda, Transportes, WhatsApp sí/no, Educación y la
   encuesta del final no vienen del formulario de inscripción. Elegirlos (a mano
   o al azar) es poner en el sistema del Ministerio datos sobre una persona que
   nadie le preguntó. Se dejan marcados para la preceptora.
3. **No toca salud, discapacidad, restricción judicial, redes ni programas
   sociales.** Por lo mismo, y más grave.
4. **No pisa datos.** Si la persona ya estaba cargada y el formulario viene con
   datos, avisa qué difiere con la planilla y no escribe nada.
5. **No guarda.** Deja el formulario completo y una persona revisa y aprieta
   "Guardar estudiante". La encuesta y "Finalizar inscripción", también ella.
   Y nunca, en ningún caso, "Generar matrícula inicial".
"""
import re
import unicodedata

# El tiempo que se le da a cada pantalla para aparecer. Es un sistema del
# Ministerio, con días lentos: mejor esperar de más que fallar por apurado.
ESPERA_MS = 20_000

# Campo de texto (por formcontrolname) → clave de los datos de la planilla.
# En el orden de la pantalla, para que en la demo se vea bajar por el formulario.
CAMPOS_DE_TEXTO = [
    ('apellido', 'apellidos', 'Apellido/s'),
    ('nombre', 'nombres', 'Nombres'),
    ('nacionalidad', 'nacionalidad', 'Nacionalidad'),
    ('lugar_de_nacimiento', 'lugar_nacimiento', 'Lugar de nacimiento'),
    ('fecha_nacimiento', 'fecha_nacimiento', 'Fecha de nacimiento'),
]

# Opciones que se eligen siempre igual: (grupo, value, para el mensaje).
RADIOS_FIJOS = [
    ('tipo_de_carga', 'comun', 'Carga común'),
    ('estado_del_documento', 'DNI_fisico', 'DNI Físico'),
]

# normalizar.py entrega "Femenino" / "Masculino"; el formulario usa estos value.
SEXO = {'femenino': 'femenino', 'masculino': 'masculino', 'x': 'x'}

# El distrito de cada localidad de la zona. Una que no esté acá, la elige la
# preceptora: un distrito mal puesto manda al alumno a otra región educativa.
DISTRITO = {
    'ensenada': 'Ensenada', 'punta lara': 'Ensenada', 'el dique': 'Ensenada',
    'villa catela': 'Ensenada', 'cambaceres': 'Ensenada', 'isla santiago': 'Ensenada',
    'berisso': 'Berisso', 'la plata': 'La Plata', 'tolosa': 'La Plata',
    'ringuelet': 'La Plata', 'city bell': 'La Plata', 'gonnet': 'La Plata',
    'villa elisa': 'La Plata', 'los hornos': 'La Plata', 'san carlos': 'La Plata',
}

# Lo que no viene de la planilla y queda para una persona. Son botones o
# secciones del formulario: el bot los resalta en la pantalla.
PARA_LA_PRECEPTORA = ['Agregar vivienda', 'Agregar educacion']
SECCIONES_SIN_DATOS = ['Transportes']


def sin_acentos(texto):
    t = unicodedata.normalize('NFD', str(texto or ''))
    return ''.join(c for c in t if unicodedata.category(c) != 'Mn').lower().strip()


# ─────────────────────────── Piezas ──────────────────────────────────────

def _campo(page, nombre):
    """Un campo de texto por su formcontrolname (o su name, en los sub-formularios)."""
    loc = page.locator(f'[formcontrolname="{nombre}"]')
    if loc.count() == 0:
        loc = page.locator(f'input[name="{nombre}"]')
    return loc


def _radio(page, grupo, valor):
    """Elige una opción por el nombre de su grupo y su value. Devuelve (ok, detalle)."""
    boton = page.locator(f'mat-radio-button:has(input[type="radio"][name="{grupo}"][value="{valor}"])')
    n = boton.count()
    if n != 1:
        return False, f'esperaba UNA opción {grupo}={valor} y hay {n}: ¿cambió el formulario?'
    boton.locator('label').first.click()
    return True, ''


def _aparece(loc):
    """Espera a que aparezca; True/False en vez de un error de Playwright, que en
    plena demo no le dice nada a nadie."""
    try:
        loc.wait_for(timeout=ESPERA_MS)
        return True
    except Exception:                                   # noqa: BLE001
        return False


def _boton(page, texto, exacto=True):
    return page.get_by_role('button', name=texto, exact=exacto)


def _elegir_opcion(page, texto):
    """En un menú o lista ya abierta, elige la opción cuyo texto coincide (sin
    importar tildes ni mayúsculas). Devuelve True si la encontró."""
    opciones = page.get_by_role('option')
    try:
        opciones.first.wait_for(timeout=5_000)
    except Exception:                                   # noqa: BLE001
        return False
    buscado = sin_acentos(texto)
    for i in range(opciones.count()):
        op = opciones.nth(i)
        if sin_acentos(op.inner_text()) == buscado:
            op.click()
            return True
    return False


def _menu(page, abridor, opcion):
    """Abre un mat-select y elige. Si la opción no está, lo cierra y avisa:
    nunca elige otra "parecida"."""
    abridor.click()
    if _elegir_opcion(page, opcion):
        return True, ''
    page.keyboard.press('Escape')
    return False, f'el menú no tiene la opción "{opcion}"'


def _buscador(page, rotulo, texto):
    """Distrito y Localidad: se escribe y se elige de la lista que aparece."""
    campo = page.get_by_label(rotulo, exact=True)
    if campo.count() != 1:
        return False, f'no encontré el buscador "{rotulo}"'
    campo.click()
    campo.fill('')
    campo.press_sequentially(texto, delay=60)   # como una persona: la lista se arma letra por letra
    if _elegir_opcion(page, texto):
        return True, ''
    campo.fill('')
    return False, f'"{texto}" no apareció en la lista de {rotulo}'


def _resaltar(page, texto_boton):
    """Un recuadro amarillo alrededor de lo que falta: es solo visual, en esta
    pantalla, para que en la demo se vea qué le queda a la preceptora."""
    page.evaluate(
        """(texto) => {
            // Igual al texto, o con el "(Obligatorio)" que llevan los títulos de sección.
            const t = texto.toLowerCase();
            const quien = [...document.querySelectorAll('button, h3, h4, mat-card-title, legend, span, div')]
              .find(e => e.children.length <= 2 &&
                         [t, t + ' (obligatorio)'].includes(e.textContent.trim().toLowerCase()));
            if (quien) { quien.style.outline = '3px solid #f1c40f'; quien.style.outlineOffset = '3px'; }
        }""",
        texto_boton,
    )


# ─────────────────────────── Los pasos ───────────────────────────────────

def buscar_dni(page, dni):
    """Del listado del trayecto al formulario "Agregar estudiante". Devuelve (ok, detalle)."""
    mas = page.locator('button:has(mat-icon:text-is("add"))')
    if mas.count() != 1:
        return False, f'esperaba UN botón "+" y hay {mas.count()}: ¿estás en el listado del trayecto?'
    mas.click()

    tipo = page.get_by_label('Tipo de documento', exact=True)
    if not _aparece(tipo):
        return False, 'no se abrió el buscador de estudiantes al tocar "+"'
    if sin_acentos(tipo.inner_text()) != 'dni':
        ok, detalle = _menu(page, tipo, 'DNI')
        if not ok:
            return False, 'Tipo de documento: ' + detalle

    numero = page.locator('input[name="numero_de_documento"]')
    numero.fill(str(dni))
    _boton(page, 'Buscar estudiante', exacto=False).click()

    if not _aparece(_campo(page, 'apellido')):
        return False, ('no se abrió el formulario "Agregar estudiante": '
                       'fijate qué mostró el sistema (¿ya está inscripto? ¿DNI inválido?)')
    return True, ''


def ya_tiene_datos(page, datos):
    """Si el formulario vino completo (la persona ya existía), qué difiere.

    Devuelve None si vino vacío. Si no, la lista de diferencias (puede estar
    vacía si coincide todo): en los dos casos el bot NO escribe.
    """
    apellido = _campo(page, 'apellido').input_value().strip()
    if not apellido:
        return None
    diferencias = []
    for nombre, clave, rotulo in CAMPOS_DE_TEXTO:
        en_pantalla = _campo(page, nombre).input_value().strip()
        en_planilla = str(datos.get(clave) or '').strip()
        if en_pantalla and en_planilla and sin_acentos(en_pantalla) != sin_acentos(en_planilla):
            diferencias.append(f'{rotulo}: en el SiGeS "{en_pantalla}", en la planilla "{en_planilla}"')
    return diferencias


def completar(page, datos, respirar=lambda: None):
    """Completa el formulario ya abierto. Devuelve (ok, detalle).

    `ok` es False solo si algo del formulario no estaba donde se esperaba. Lo
    que falta por falta de datos va en el detalle, para la preceptora.
    """
    pendientes = []

    previo = ya_tiene_datos(page, datos)
    if previo is not None:
        if previo:
            return False, 'la persona YA estaba cargada y no coincide: ' + '; '.join(previo)
        return False, 'la persona YA estaba cargada (coincide con la planilla): no se tocó nada'

    for grupo, valor, rotulo in RADIOS_FIJOS:
        ok, detalle = _radio(page, grupo, valor)
        if not ok:
            return False, f'{rotulo}: {detalle}'
        respirar()

    for nombre, clave, rotulo in CAMPOS_DE_TEXTO:
        valor = datos.get(clave)
        if valor in (None, ''):
            pendientes.append(rotulo)
            continue
        campo = _campo(page, nombre)
        if campo.count() != 1:
            return False, f'{rotulo}: esperaba UN campo y hay {campo.count()}'
        campo.fill(str(valor))
        if nombre == 'fecha_nacimiento':
            campo.press('Tab')              # el calendario interpreta la fecha al salir del campo
            if not campo.input_value().strip():
                pendientes.append('Fecha de nacimiento (el sistema no aceptó el formato: cargala vos)')
        respirar()

    sexo = SEXO.get(sin_acentos(datos.get('sexo')))
    if sexo is None:
        pendientes.append('Sexo según DNI')
    else:
        ok, detalle = _radio(page, 'sexo', sexo)
        if not ok:
            return False, f'Sexo: {detalle}'
        respirar()

    genero = datos.get('identidad_genero')
    if genero:
        ok, detalle = _menu(page, page.locator('mat-select[formcontrolname="identidad"]'), genero)
        if not ok:
            pendientes.append(f'Identidad de género ({detalle})')
        respirar()
    else:
        pendientes.append('Identidad de género')

    # Primero Dirección, que se cierra sola con "Agregar" si encontró todo; al
    # final Contacto, que queda abierto a propósito (falta el WhatsApp). Al revés,
    # Contacto abierto podría trabar la apertura de Dirección: hay un
    # sub-formulario abierto por vez.
    falta_direccion = _direccion(page, datos, respirar)
    pendientes += falta_direccion
    if falta_direccion:
        pendientes.append('Contacto (después de terminar Dirección): el celular es ' + str(datos.get('celular') or '—'))
    else:
        pendientes += _contacto(page, datos, respirar)

    for boton in PARA_LA_PRECEPTORA:
        _resaltar(page, boton)
    for seccion in SECCIONES_SIN_DATOS:
        _resaltar(page, seccion)
    pendientes += ['Vivienda', 'Transportes', 'Educación']

    return True, 'queda para la preceptora: ' + ', '.join(pendientes)


def _contacto(page, datos, respirar):
    """Contacto: el celular. WhatsApp sí/no NO viene en la planilla: queda abierto."""
    celular = datos.get('celular')
    if not celular:
        return ['Contacto (no hay celular en la planilla)']
    _boton(page, 'Agregar contacto').click()
    tipo = page.locator('mat-select[formcontrolname="tipo_de_contacto"]')
    if not _aparece(tipo):
        return [f'Contacto (no se abrió el sub-formulario): el celular es {celular}']
    ok, detalle = _menu(page, tipo, 'Celular')
    if not ok:
        return [f'Contacto ({detalle})']
    respirar()
    _campo(page, 'valor').fill(str(celular))
    respirar()
    # Sin tocar "Agregar": falta elegir si tiene WhatsApp, y eso lo sabe la persona.
    _resaltar(page, 'Agregar')
    return ['Contacto: elegí si tiene WhatsApp y tocá "Agregar"']


def _direccion(page, datos, respirar):
    """Dirección: calle, altura, distrito y localidad."""
    if not datos.get('calle'):
        return ['Dirección (no se pudo partir el domicilio de la planilla)']
    _boton(page, 'Agregar direccion').click()
    if not _aparece(_campo(page, 'calle')):
        return ['Dirección (no se abrió el sub-formulario)']
    _campo(page, 'calle').fill(datos['calle'])
    respirar()
    if datos.get('altura'):
        _campo(page, 'altura').fill(str(datos['altura']))
        respirar()
    falta = []
    distrito = DISTRITO.get(sin_acentos(datos.get('localidad')))
    if distrito:
        ok, detalle = _buscador(page, 'Distrito', distrito)
        if not ok:
            falta.append(detalle)
    else:
        falta.append(f'el distrito de "{datos.get("localidad")}"')
    if datos.get('localidad'):
        ok, detalle = _buscador(page, 'Localidad', datos['localidad'])
        if not ok:
            falta.append(detalle)
    if falta:
        return ['Dirección: ' + '; '.join(falta) + ', y tocá "Agregar"']
    _boton(page, 'Agregar').click()
    return []
