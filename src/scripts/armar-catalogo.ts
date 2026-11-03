/* Arma, en el navegador, el ZIP del catálogo: el del alumno o el de un emprendimiento.
 *
 * El del alumno junta su catalogo.py función por función: la suya si el ejercicio
 * está Resuelto en este navegador, la de la clase si no. Las soluciones de la clase
 * llegan desde la página (las constantes de catalogo.mdx, las mismas de los
 * ejercicios), así no hay una segunda copia que se desfase.
 */
import { strToU8, zipSync, type Zippable } from 'fflate';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '') + '/';
const RUTA_CLASE = `${BASE}web/catalogo/`;

const LEER_PRODUCTOS = `def leer_productos(ruta):
    with open(ruta, encoding="utf-8") as archivo:
        return list(csv.DictReader(archivo))`;

const DETALLES = `def detalles(**datos):
    if not datos:
        return ""
    renglones = ""
    for clave, valor in datos.items():
        nombre = clave.replace("_", " ").capitalize()
        renglones += f"\\n    <li><strong>{nombre}:</strong> {valor}</li>"
    return f'<ul class="detalles">{renglones}\\n</ul>'`;

const PAGINA = `def pagina(titulo, productos, numero):
    tarjetas = ""
    for producto in productos:
        tarjetas += tarjeta(producto, numero)
    return f"""<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{titulo}</title>
    <link rel="stylesheet" href="estilos.css">
</head>
<body>
    <header class="encabezado"><h1>{titulo}</h1></header>
    <main class="catalogo">{tarjetas}</main>
    <footer class="contacto">
        <h2>¡Contactá conmigo!</h2>
        <a class="consultar" href="https://wa.me/{numero}" target="_blank">Escribime por WhatsApp</a>
        <p>Tu consulta no es molestia</p>
    </footer>
    <script src="catalogo.js" data-catalogo="{CATALOGO}" data-numero="{numero}"></script>
</body>
</html>
"""`;

const GENERAR = `def generar(ruta_csv, ruta_html, titulo, numero):
    productos = leer_productos(ruta_csv)
    html = pagina(titulo, productos, numero)
    with open(ruta_html, "w", encoding="utf-8") as archivo:
        archivo.write(html)`;

interface Funcion {
    nombre: string;
    titulo?: string; // el ejercicio de donde sale la del alumno
    siempreDeLaClase?: string; // por qué va siempre la de la clase
}

const FUNCIONES: Funcion[] = [
    { nombre: 'leer_productos', titulo: 'Los productos, desde la planilla' },
    { nombre: 'precio', titulo: 'El precio, siempre igual' },
    { nombre: 'link_whatsapp', titulo: 'El botón de WhatsApp' },
    { nombre: 'foto', titulo: 'La foto, o el emoji' },
    { nombre: 'extras', siempreDeLaClase: 'viene hecha' },
    { nombre: 'detalles', titulo: 'Detalles a tu medida' },
    { nombre: 'tarjeta', siempreDeLaClase: 'muestra los datos de más' },
    { nombre: 'pagina', siempreDeLaClase: 'suma el editor' },
    { nombre: 'generar', titulo: 'Guardar la página' },
];

function leerLocal(clave: string): string | null {
    try {
        return localStorage.getItem(clave);
    } catch {
        return null;
    }
}

/* El bloque de un def, de su primera línea hasta la siguiente que no está sangrada.
 * Adentro de un texto de triples comillas las líneas no van sangradas (el HTML de
 * tarjeta() y pagina()), así que esas se cuentan aparte. */
export function extraerFuncion(codigo: string, nombre: string): string | null {
    const lineas = codigo.replace(/\r\n?/g, '\n').split('\n');
    const inicio = lineas.findIndex((l) => new RegExp(`^def\\s+${nombre}\\s*\\(`).test(l));
    if (inicio < 0) return null;
    let enTexto = false;
    const cambiaTexto = (linea: string) => ((linea.match(/"""|'''/g) || []).length % 2 === 1);
    if (cambiaTexto(lineas[inicio])) enTexto = !enTexto;
    let fin = inicio + 1;
    while (fin < lineas.length && (enTexto || lineas[fin].trim() === '' || /^[ \t]/.test(lineas[fin]))) {
        if (cambiaTexto(lineas[fin])) enTexto = !enTexto;
        fin++;
    }
    return lineas.slice(inicio, fin).join('\n').replace(/\s+$/, '');
}

function importsDe(codigo: string): string[] {
    return codigo
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .filter((l) => /^(import\s+\S|from\s+\S+\s+import\s)/.test(l))
        .map((l) => l.trim());
}

export interface FuncionArmada {
    nombre: string;
    tuya: boolean;
    motivo: string;
    codigo?: string; // la del alumno, si es suya
}

export function funcionesDelAlumno(): FuncionArmada[] {
    return FUNCIONES.map((f) => {
        if (f.siempreDeLaClase) return { nombre: f.nombre, tuya: false, motivo: f.siempreDeLaClase };
        const clave = `${RUTA_CLASE}::${f.titulo}`;
        const resuelto = leerLocal(`pcp:done:${clave}`) === '1';
        const codigo = leerLocal(`pcp:code:${clave}`);
        const propia = resuelto && codigo ? extraerFuncion(codigo, f.nombre) : null;
        if (propia) return { nombre: f.nombre, tuya: true, motivo: 'la resolviste en la clase', codigo };
        return {
            nombre: f.nombre,
            tuya: false,
            motivo: resuelto ? 'no encontré tu def en este navegador' : 'todavía no está Resuelta en este navegador',
        };
    });
}

function solucionesDeLaClase(clase: Record<string, string>): Record<string, string> {
    const pedir = (nombre: string, texto: string | undefined) => {
        const def = texto ? extraerFuncion(texto, nombre) : null;
        if (!def) throw new Error(`falta la solución de ${nombre} en la página`);
        return def;
    };
    return {
        leer_productos: LEER_PRODUCTOS,
        precio: pedir('precio', clase.PRECIO),
        link_whatsapp: pedir('link_whatsapp', clase.LINK),
        foto: pedir('foto', clase.FOTO),
        extras: clase.EXTRAS,
        detalles: DETALLES,
        tarjeta: pedir('tarjeta', clase.TARJETA_CON_DETALLES),
        pagina: PAGINA,
        generar: GENERAR,
    };
}

function cadenaPython(texto: string): string {
    return JSON.stringify(texto); // un string de JSON también es un string válido de Python
}

export function armarCatalogoPy(
    datos: { nombre: string; numero: string; catalogo: string },
    clase: Record<string, string>,
    funciones: FuncionArmada[] = funcionesDelAlumno(),
): string {
    const deLaClase = solucionesDeLaClase(clase);
    const imports = new Set(['import csv', 'from urllib.parse import quote']);
    const bloques = funciones.map((f) => {
        if (f.tuya && f.codigo) {
            importsDe(f.codigo).forEach((i) => imports.add(i));
            const titulo = FUNCIONES.find((x) => x.nombre === f.nombre)?.titulo;
            return `# ✏️ La tuya, del ejercicio "${titulo}".\n${extraerFuncion(f.codigo, f.nombre)}`;
        }
        return `# 📎 De la clase: ${f.motivo}.\n${deLaClase[f.nombre]}`;
    });
    return `# ─────────────────────────────────────────────────────────────────────
#  catalogo.py  —  ESTE ES EL TUYO
# ─────────────────────────────────────────────────────────────────────
#
#  Arma tu catálogo (index.html) a partir de la planilla productos.csv.
#  Lo armó el panel de la clase, con una marca en cada función:
#     ✏️  la tuya: la resolviste en la clase y vino tal cual
#     📎  la de la clase: no estaba Resuelta en tu navegador, o viene hecha
#
#  En la terminal, parado en esta carpeta:   python catalogo.py
#  Después abrí index.html con doble clic.
# ─────────────────────────────────────────────────────────────────────

${[...imports].join('\n')}

TITULO = ${cadenaPython(datos.nombre)}

# Tu WhatsApp: 54 + 9 + la característica sin el 0 + el número sin el 15.
NUMERO = ${cadenaPython(datos.numero)}

# La dirección de tu catálogo en el editor, la que te dieron con tu código.
# Con ella, lo que cambies en el editor aparece solo en tu página publicada.
# Vacía, la página muestra solo lo que tiene productos.csv.
CATALOGO = ${cadenaPython(datos.catalogo)}


${bloques.join('\n\n\n')}


generar("productos.csv", "index.html", TITULO, NUMERO)
print("Listo: se generó index.html. Abrilo con doble clic para verlo.")
`;
}

/* ---------- Los colores y la foto de fondo ---------- */

export interface DatosMarca {
    nombre: string;
    whatsapp: string;
    catalogo: string;
    fondo: string;
    acento: string;
    texto: string;
    foto: File | null;
    respetarColores?: boolean; // true: van los colores elegidos, aunque no se lean bien
}

const VELO_CON_FOTO = '0.55';

/* ---------- Que se lea: el contraste entre dos colores ----------
 * Es la cuenta de las pautas de accesibilidad (WCAG): de 1 (iguales) a 21 (negro
 * sobre blanco). Para leer texto común hace falta 4,5; para letras grandes o en
 * negrita, como el precio y los botones, alcanza con 3. */

function rgb(hex: string): number[] {
    return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function hex(c: number[]): string {
    return '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

function luminancia(color: string): number {
    const [r, g, b] = rgb(color).map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(a: string, b: string): number {
    const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
    return (claro + 0.05) / (oscuro + 0.05);
}

/* Lleva el color hacia el negro (o el blanco, sobre un fondo oscuro) de a poco, hasta que se lea. */
function legible(color: string, fondo: string, minimo: number): string {
    if (contraste(color, fondo) >= minimo) return color;
    const destino = luminancia(fondo) > 0.18 ? [0, 0, 0] : [255, 255, 255];
    const origen = rgb(color);
    for (let t = 0.05; t <= 1; t += 0.05) {
        const mezcla = hex(origen.map((v, i) => v + (destino[i] - v) * t));
        if (contraste(mezcla, fondo) >= minimo) return mezcla;
    }
    return hex(destino);
}

/* El acento es el color de las letras del botón, sobre el fondo de la página: tiene que leerse como
 * cualquier texto. Las letras del precio, que van encima del acento, son blancas si se leen; si no,
 * del color del fondo, que ya se lee seguro (es justo el par que se acaba de ajustar). */
function acentoLegible(acento: string, fondo: string): string {
    return legible(acento, fondo, 4.5);
}

function sobreAcento(acento: string, fondo: string): string {
    return contraste('#ffffff', acento) >= 4.5 ? '#ffffff' : fondo;
}

export interface Colores {
    fondo: string;
    texto: string;
    acento: string;
    marca: string;
    sobreAcento: string;
    avisos: string[];
}

/* Los de estilos.css: el diseño de la clase, que queda tal cual si nadie los cambia. */
const DE_LA_CLASE = { fondo: '#d3cac8', texto: '#5b6844', acento: '#5f6f45' };

export function coloresLegibles(d: Pick<DatosMarca, 'fondo' | 'texto' | 'acento' | 'respetarColores'>): Colores {
    const sinTocar = d.fondo === DE_LA_CLASE.fondo && d.texto === DE_LA_CLASE.texto && d.acento === DE_LA_CLASE.acento;
    if (sinTocar) return { ...DE_LA_CLASE, marca: '#ffffff', sobreAcento: '#ffffff', avisos: [] };
    const blancoSeLee = contraste('#ffffff', d.fondo) >= 3;
    if (d.respetarColores) {
        const marca = blancoSeLee ? '#ffffff' : d.acento;
        return { fondo: d.fondo, texto: d.texto, acento: d.acento, marca, sobreAcento: '#ffffff', avisos: [] };
    }
    const texto = legible(d.texto, d.fondo, 4.5);
    const acento = acentoLegible(d.acento, d.fondo);
    // Sobre un fondo claro el nombre va del color de los botones: con su color, y ya ajustado para que se lea
    const marca = blancoSeLee ? '#ffffff' : acento;
    const avisos: string[] = [];
    if (texto !== d.texto) {
        avisos.push(`Las letras casi no se leían sobre ese fondo: las ${luminancia(d.fondo) > 0.18 ? 'oscurecí' : 'aclaré'} un poco.`);
    }
    if (acento !== d.acento) avisos.push('El color de los botones y el precio no se distinguía bien: lo ajusté para que se lean.');
    return { fondo: d.fondo, texto, acento, marca, sobreAcento: sobreAcento(acento, d.fondo), avisos };
}

/* Los arreglos de un botón: las letras que se leen sobre ese fondo, o el fondo sobre el que se leen esas letras. */
export function arreglarLetras(fondo: string, texto: string): string {
    return legible(texto, fondo, 4.5);
}

export function arreglarFondo(fondo: string, texto: string): string {
    return legible(fondo, texto, 4.5);
}

/* Paletas listas, para quien no sabe qué elegir. Las cinco primeras son las de los catálogos del CFP. */
export const PALETAS = [
    { nombre: 'Natural', fondo: '#d3cac8', texto: '#4d583a', acento: '#4c5937' },
    { nombre: 'Dulce', fondo: '#f6dfe4', texto: '#6d2c3f', acento: '#a8324f' },
    { nombre: 'Mar', fondo: '#d8ecf3', texto: '#1f4e63', acento: '#1f6f8b' },
    { nombre: 'Elegante', fondo: '#1f1f1f', texto: '#e8e2d0', acento: '#9d8343' },
    { nombre: 'Alegre', fondo: '#fff1d6', texto: '#7a3e00', acento: '#af4d09' },
    { nombre: 'Lavanda', fondo: '#ece6f6', texto: '#3f2d63', acento: '#6a4c9c' },
    { nombre: 'Terracota', fondo: '#f4e3d7', texto: '#5a2e1c', acento: '#a8492a' },
    { nombre: 'Bosque', fondo: '#1e2b22', texto: '#e3eadf', acento: '#779e80' },
    { nombre: 'Café', fondo: '#efe4d6', texto: '#4b3426', acento: '#7b4b2a' },
    { nombre: 'Noche', fondo: '#18202f', texto: '#e6e9f0', acento: '#6f89c5' },
    { nombre: 'Chicle', fondo: '#ffe3ef', texto: '#6b1d3d', acento: '#b82e67' },
    { nombre: 'Menta', fondo: '#e2f4ec', texto: '#1d4a3a', acento: '#2a7a5c' },
];

/* Una paleta a partir de la foto: el color promedio, aclarado para el fondo y oscurecido para el resto. */
export async function paletaDeFoto(archivo: File) {
    const bmp = await createImageBitmap(archivo);
    const lienzo = document.createElement('canvas');
    lienzo.width = lienzo.height = 24;
    const ctx = lienzo.getContext('2d')!;
    ctx.drawImage(bmp, 0, 0, 24, 24);
    const px = ctx.getImageData(0, 0, 24, 24).data;
    const suma = [0, 0, 0];
    for (let i = 0; i < px.length; i += 4) for (let k = 0; k < 3; k++) suma[k] += px[i + k];
    const promedio = suma.map((v) => v / (px.length / 4));
    const hacia = (destino: number, t: number) => hex(promedio.map((v) => v + (destino - v) * t));
    const fondo = hacia(255, 0.78);
    return { nombre: 'De tu foto', fondo, texto: legible(hacia(0, 0.7), fondo, 4.5), acento: acentoLegible(hacia(0, 0.35), fondo) };
}

export function estilosConMarca(css: string, d: DatosMarca): string {
    const c = coloresLegibles(d);
    let r = css
        .replace(/--fondo:\s*#[0-9a-fA-F]{6};/, `--fondo: ${c.fondo};`)
        .replace(/--acento:\s*#[0-9a-fA-F]{6};/, `--acento: ${c.acento};`)
        .replace(/--texto:\s*#[0-9a-fA-F]{6};/, `--texto: ${c.texto};`)
        .replace(/--marca:\s*#[0-9a-fA-F]{6};/, `--marca: ${c.marca};`)
        .replace(/--linea:\s*#[0-9a-fA-F]{6};/, `--linea: ${c.acento};`)
        .replace(/--sobre-acento:\s*#[0-9a-fA-F]{6};/, `--sobre-acento: ${c.sobreAcento};`);
    if (d.foto) {
        r = r.replace('--imagen-de-fondo: none;', `--imagen-de-fondo: url("${nombreFondo(d.foto)}");`).replace('--velo: 0;', `--velo: ${VELO_CON_FOTO};`);
    }
    return r;
}

/* Un GIF de fondo va tal cual, animado; cualquier otra foto se achica a JPG. */
function nombreFondo(foto: File): string {
    return foto.type === 'image/gif' ? 'fondo.gif' : 'fondo.jpg';
}

async function archivoFondo(foto: File): Promise<Uint8Array> {
    if (foto.type === 'image/gif') return new Uint8Array(await foto.arrayBuffer());
    return achicar(foto, 1600);
}

async function achicar(archivo: File, lado: number): Promise<Uint8Array> {
    const bmp = await createImageBitmap(archivo, { imageOrientation: 'from-image' });
    const escala = Math.min(1, lado / Math.max(bmp.width, bmp.height));
    const lienzo = document.createElement('canvas');
    lienzo.width = Math.round(bmp.width * escala);
    lienzo.height = Math.round(bmp.height * escala);
    lienzo.getContext('2d')!.drawImage(bmp, 0, 0, lienzo.width, lienzo.height);
    const blob = await new Promise<Blob | null>((ok) => lienzo.toBlob(ok, 'image/jpeg', 0.8));
    if (!blob) throw new Error('no se pudo achicar la foto de fondo');
    return new Uint8Array(await blob.arrayBuffer());
}

async function bajar(ruta: string): Promise<Uint8Array> {
    const r = await fetch(BASE + ruta);
    if (!r.ok) throw new Error(`no se pudo bajar ${ruta}`);
    return new Uint8Array(await r.arrayBuffer());
}

async function bajarTexto(ruta: string): Promise<string> {
    return new TextDecoder().decode(await bajar(ruta));
}

/* "Dulces de la Isla" → "dulces-de-la-isla": para el nombre del ZIP y la dirección sugerida. */
export function direccionDe(nombre: string): string {
    return nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}

function zip(archivos: Zippable, nombreArchivo: string) {
    const bytes = zipSync(archivos, { level: 6 });
    return { nombreArchivo, blob: new Blob([bytes], { type: 'application/zip' }) };
}

/* ---------- Modo clase: el proyecto de Python ---------- */

export async function armarProyectoClase(d: DatosMarca, clase: Record<string, string>) {
    const numero = '549' + d.whatsapp;
    const [productos, leeme, estilos, script] = await Promise.all([
        bajarTexto('proyecto-catalogo/productos.csv'),
        bajarTexto('proyecto-catalogo/LEEME.md'),
        bajarTexto('proyecto-catalogo/estilos.css'),
        bajarTexto('proyecto-catalogo/catalogo.js'),
    ]);
    const imagenes = ['fotos/taza.svg', 'fotos/mate.svg', 'fotos/vela.svg', 'adornos/rama-blanca.svg', 'adornos/rama-verde.svg'];
    const binarios = await Promise.all(imagenes.map((r) => bajar('web/catalogo/' + r)));
    const archivos: Zippable = {
        'catalogo/catalogo.py': strToU8(armarCatalogoPy({ nombre: d.nombre, numero, catalogo: d.catalogo }, clase)),
        'catalogo/productos.csv': strToU8(productos),
        'catalogo/LEEME.md': strToU8(leeme),
        'catalogo/estilos.css': strToU8(estilosConMarca(estilos, d)),
        'catalogo/catalogo.js': strToU8(script),
    };
    imagenes.forEach((r, i) => (archivos['catalogo/' + r] = binarios[i]));
    if (d.foto) archivos['catalogo/' + nombreFondo(d.foto)] = await archivoFondo(d.foto);
    return zip(archivos, `catalogo-${d.catalogo || direccionDe(d.nombre) || 'mi-marca'}.zip`);
}

/* ---------- Modo emprendedor: la carpeta para el repo de la organización ---------- */

function html(texto: string): string {
    return texto.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export function paginaEmprendedor(d: DatosMarca): string {
    const numero = '549' + d.whatsapp;
    const c = coloresLegibles(d);
    const variables = [`--fondo: ${c.fondo};`, `--acento: ${c.acento};`, `--texto: ${c.texto};`, `--marca: ${c.marca};`, `--linea: ${c.acento};`, `--sobre-acento: ${c.sobreAcento};`];
    if (d.foto) variables.push(`--imagen-de-fondo: url("${nombreFondo(d.foto)}");`, `--velo: ${VELO_CON_FOTO};`);
    return `<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${html(d.nombre)}</title>
    <meta name="description" content="Catálogo de ${html(d.nombre)}: productos, precios y consultas por WhatsApp.">
    <link rel="stylesheet" href="../estilos.css">
    <style>
        :root {
            ${variables.join('\n            ')}
        }
    </style>
</head>
<body>
    <header class="encabezado"><h1>${html(d.nombre)}</h1></header>
    <main class="catalogo catalogo--cargando"><p class="descripcion">Cargando los productos…</p></main>
    <footer class="contacto">
        <h2>¡Contactá conmigo!</h2>
        <a class="consultar" href="https://wa.me/${numero}" target="_blank">Escribime por WhatsApp</a>
        <p>Tu consulta no es molestia</p>
    </footer>
    <script src="../catalogo.js" data-catalogo="${html(d.catalogo)}" data-numero="${numero}"></script>
</body>
</html>
`;
}

export async function armarCarpetaEmprendedor(d: DatosMarca) {
    const archivos: Zippable = { [`${d.catalogo}/index.html`]: strToU8(paginaEmprendedor(d)) };
    if (d.foto) archivos[`${d.catalogo}/${nombreFondo(d.foto)}`] = await archivoFondo(d.foto);
    return zip(archivos, `${d.catalogo}.zip`);
}
