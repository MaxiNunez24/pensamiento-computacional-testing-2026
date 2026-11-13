"""Arma kahoot-expo.xlsx: las preguntas del Kahoot de la Expo (13/11/2026), listas para importar.

    python armar_kahoot.py

En Kahoot: Crear → Kahoot → "Importar hoja de cálculo" y elegir kahoot-expo.xlsx. El archivo sigue
la plantilla de Kahoot (la tabla arranca en la fila 8: pregunta, 4 respuestas, tiempo y cuál es la
correcta). Si Kahoot no lo acepta, se descarga su plantilla desde ese mismo botón y se pegan las
filas de acá.

Sin librerías: el .xlsx es un zip con unos XML adentro, y se escribe a mano.
"""
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

AQUI = Path(__file__).parent

# (pregunta, [respuestas], segundos, correctas: números de respuesta empezando en 1)
PREGUNTAS = [
    ("¿Qué es un algoritmo?", ["Una receta paso a paso", "Un virus", "Una marca de compu", "Un idioma secreto"], 20, [1]),
    ("Si cambiás el orden de los pasos de una receta…", ["Puede salir mal: el orden importa", "Da igual", "La compu lo arregla sola", "Sale más rico"], 20, [1]),
    ("Una variable es como…", ["Una caja con nombre que guarda un dato", "Un cable", "Un error", "Un juego"], 20, [1]),
    ('nombre = "Ana" y después nombre = "Maxi". ¿Qué guarda nombre al final?', ['"Maxi"', '"Ana"', "Los dos", "Nada"], 20, [1]),
    ('"Si llueve, llevo paraguas; si no, no." En programación eso es…', ["Un condicional", "Un bucle", "Una variable", "Una foto"], 20, [1]),
    ("Con if llueve: ☂️ else: 😎 … si NO llueve, ¿qué muestra?", ["😎", "☂️", "Los dos", "Un error"], 20, [1]),
    ('Para que la compu diga "¡Hola!" 100 veces, conviene usar…', ["Un bucle (repetir)", "Escribirlo 100 veces", "Un condicional", "Apagarla y prenderla"], 20, [1]),
    ('for vez in range(3): print("¡Hola!") … ¿Cuántas veces dice "¡Hola!"?', ["3", "1", "2", "4"], 20, [1]),
    ("¿Cómo se llama un error en un programa?", ["Bug 🐛", "Pixel", "Wifi", "Mouse"], 20, [1]),
    ("¿Git y GitHub son lo mismo?", ["No: Git es la herramienta y GitHub, el lugar en la nube", "Sí, son lo mismo", "GitHub es un antivirus", "Git es una red social"], 30, [1]),
    ("¿Para qué sirve un commit en Git?", ["Guardar una versión con un mensaje", "Borrar todo", "Mandar un mail", "Imprimir el código"], 20, [1]),
    ("¿Qué comando sube tus cambios a GitHub?", ["git push", "git pull", "git print", "git subir"], 20, [1]),
    ("¿Cómo hace la IA para dibujarte en otro estilo?", ["Aprendió de muchísimas imágenes", "Hay un dibujante escondido", "Copia una foto de internet", "Es magia"], 20, [1]),
    ("¿Con qué lenguaje aprendimos a programar este año?", ["Python 🐍", "Morse", "Latín", "Ninguno"], 20, [1]),
    ("¿Qué cursos nuevos llegan al CFP en 2027?", ["IA generativa", "Programador Web", "Domador de dragones", "Astronauta"], 20, [1, 2]),
]

ENCABEZADO = ["Question - max 120 characters", "Answer 1 - max 75 characters", "Answer 2 - max 75 characters",
              "Answer 3 - max 75 characters", "Answer 4 - max 75 characters",
              "Time limit (sec) – 5, 10, 20, 30, 60, 90, 120, or 240 secs", "Correct answer(s) - choose at least one"]


def revisar():
    for i, (p, rs, seg, ok) in enumerate(PREGUNTAS, 1):
        assert len(p) <= 120, f"la pregunta {i} tiene {len(p)} caracteres"
        assert all(len(r) <= 75 for r in rs), f"una respuesta de la {i} pasa los 75"
        assert seg in (5, 10, 20, 30, 60, 90, 120, 240) and ok


def celda(col, fila, valor):
    ref = f"{col}{fila}"
    if isinstance(valor, (int, float)):
        return f'<c r="{ref}"><v>{valor}</v></c>'
    return f'<c r="{ref}" t="inlineStr"><is><t xml:space="preserve">{escape(str(valor))}</t></is></c>'


def hoja():
    filas = [f'<row r="1">{celda("B", 1, "Kahoot de la Expo · Pensamiento Computacional y Testing · CFP 401")}</row>',
             '<row r="8">' + "".join(celda(c, 8, t) for c, t in zip("BCDEFGH", ENCABEZADO)) + "</row>"]
    for i, (p, rs, seg, ok) in enumerate(PREGUNTAS, 1):
        f = 8 + i
        valores = [p, *rs, seg, ",".join(map(str, ok))]
        filas.append(f'<row r="{f}">' + celda("A", f, i) + "".join(celda(c, f, v) for c, v in zip("BCDEFGH", valores)) + "</row>")
    return ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
            '<cols><col min="2" max="2" width="70" customWidth="1"/><col min="3" max="6" width="40" customWidth="1"/></cols>'
            f'<sheetData>{"".join(filas)}</sheetData></worksheet>')


ARCHIVOS = {
    "[Content_Types].xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
    "_rels/.rels": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    "xl/workbook.xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets></workbook>',
    "xl/_rels/workbook.xml.rels": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
}

if __name__ == "__main__":
    revisar()
    destino = AQUI / "kahoot-expo.xlsx"
    with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED) as z:
        for nombre, contenido in ARCHIVOS.items():
            z.writestr(nombre, contenido)
        z.writestr("xl/worksheets/sheet1.xml", hoja())
    print(f"Listo: {destino} ({len(PREGUNTAS)} preguntas)")
