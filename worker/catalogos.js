/* Worker de los catálogos: guarda los productos de cada catálogo y sus fotos.
 *
 * Reemplaza al formulario de Google. Cada catálogo tiene una dirección corta
 * (el "slug", ej. dulces-de-la-isla) y un CÓDIGO secreto para editarlo, que se
 * puede regenerar si se pierde o se filtra. El código nunca se guarda: se guarda
 * su hash, como una contraseña.
 *
 * Lo público (leer productos y fotos) lo puede pedir cualquier página: los
 * catálogos viven en GitHub Pages, en la cuenta de cada alumno o en la de la
 * organización. Editar solo se puede desde el editor (ORIGENES_EDITOR) y con el
 * código. Dar de alta y regenerar códigos pide la clave de administración, que
 * vive como secreto ADMIN_CLAVE en Cloudflare, nunca en el repo.
 *
 * Datos en KV (binding CATALOGOS):
 *   cat:<slug>     → { slug, nombre, enlace, productos: [...], actualizado }
 *   codigo:<hash>  → slug          (para entrar al editor solo con el código)
 *   hash:<slug>    → hash          (para borrar el código viejo al regenerar)
 *   foto:<id>      → la imagen, con { slug, tipo } en la metadata
 *
 * Despliegue y pasos: worker/README.md, sección "Worker de los catálogos".
 */

const ORIGENES_EDITOR = [
    'https://cfp401-ensenada.github.io',
    'https://maxinunez24.github.io',
    'http://localhost:4778',
    'http://127.0.0.1:4778',
];

const SLUG_OK = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;
const FOTO_OK = /^(w:[a-z0-9]{12,32}|[A-Za-z0-9._-]{1,80})$/;
const ID_OK = /^[a-z0-9]{6,24}$/;
const LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0, O, 1 ni I: no se confunden al dictarlo
const MAX_PRODUCTOS = 80;
const MAX_DETALLES = 8;
const MAX_FOTO = 700 * 1024;
const MAX_GIF = 2560 * 1024; // un GIF no se achica en el editor sin perder la animación: va tal cual
const TIPOS_FOTO = ['image/jpeg', 'image/webp', 'image/png', 'image/gif'];

function respuesta(datos, estado, cabeceras, extra = {}) {
    return new Response(JSON.stringify(datos), {
        status: estado,
        headers: { ...cabeceras, 'Content-Type': 'application/json; charset=utf-8', ...extra },
    });
}

function cors(origen, abierto) {
    return {
        'Access-Control-Allow-Origin': abierto ? '*' : origen,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Codigo, X-Admin',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin',
    };
}

/* El código se compara sin guiones, sin espacios y en mayúsculas: "k7f2-ab9c" entra igual. */
function normalizarCodigo(codigo) {
    return String(codigo || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

async function hashDe(codigo) {
    const bytes = new TextEncoder().encode('catalogos:' + normalizarCodigo(codigo));
    const digesto = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digesto)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function azar(cantidad, letras) {
    const bytes = crypto.getRandomValues(new Uint8Array(cantidad));
    return [...bytes].map((b) => letras[b % letras.length]).join('');
}

function nuevoCodigo() {
    const c = azar(8, LETRAS);
    return c.slice(0, 4) + '-' + c.slice(4);
}

function nuevoId() {
    return azar(16, 'abcdefghijklmnopqrstuvwxyz0123456789');
}

/* La clave del producto: mayúsculas, sin tildes ni espacios de más. "Táza  " y "TAZA" son el mismo. */
function claveDe(nombre) {
    return String(nombre || '')
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .toUpperCase().replace(/\s+/g, ' ').trim();
}

function texto(valor, maximo) {
    return String(valor ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, maximo);
}

/* Qué parte de la foto se ve en el círculo: x e y en porcentaje (50 es el centro) y cuánto se acerca. */
function limpiarEncuadre(e) {
    if (!e || typeof e !== 'object') return undefined;
    const numero = (v, min, max, siNo) => {
        const n = Number(v);
        return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n * 100) / 100)) : siNo;
    };
    const r = { x: numero(e.x, 0, 100, 50), y: numero(e.y, 0, 100, 50), zoom: numero(e.zoom, 1, 3, 1) };
    return r.x === 50 && r.y === 50 && r.zoom === 1 ? undefined : r;
}

function limpiarProducto(p) {
    if (!p || typeof p !== 'object') return null;
    const nombre = texto(p.nombre, 80);
    if (!nombre) return null;
    const precio = texto(p.precio, 12).replace(/\D/g, '').slice(0, 9);
    const foto = texto(p.foto, 80);
    const detalles = Array.isArray(p.detalles) ? p.detalles : [];
    return {
        id: typeof p.id === 'string' && ID_OK.test(p.id) ? p.id : nuevoId(),
        nombre,
        precio,
        descripcion: texto(p.descripcion, 240),
        emoji: texto(p.emoji, 8),
        foto: FOTO_OK.test(foto) ? foto : '',
        encuadre: FOTO_OK.test(foto) ? limpiarEncuadre(p.encuadre) : undefined,
        detalles: detalles
            .map((d) => [texto(d && d[0], 30), texto(d && d[1], 120)])
            .filter(([clave, valor]) => clave && valor)
            .slice(0, MAX_DETALLES),
    };
}

/* Si dos productos tienen el mismo nombre (sin contar mayúsculas ni tildes), queda el último. */
function limpiarProductos(lista) {
    const porClave = new Map();
    for (const p of (Array.isArray(lista) ? lista : []).slice(0, MAX_PRODUCTOS)) {
        const limpio = limpiarProducto(p);
        if (limpio) porClave.set(claveDe(limpio.nombre), limpio);
    }
    return [...porClave.values()];
}

/* Cómo se ve el catálogo, elegido en el editor: nombre, WhatsApp, colores y foto de fondo. Los
 * colores llegan ya ajustados para que se lean (lo hace el editor con colores.js). */
function limpiarAspecto(a) {
    if (!a || typeof a !== 'object') return null;
    const color = (c) => (/^#[0-9a-fA-F]{6}$/.test(c) ? c.toLowerCase() : null);
    const r = {
        nombre: texto(a.nombre, 60),
        numero: /^\d{10,15}$/.test(a.numero || '') ? a.numero : '',
        fondo: color(a.fondo),
        texto: color(a.texto),
        acento: color(a.acento),
        marca: color(a.marca),
        sobreAcento: color(a.sobreAcento),
        imagen: /^w:[a-z0-9]{12,32}$/.test(a.imagen || '') ? a.imagen : '',
        velo: Math.min(0.9, Math.max(0, Number(a.velo) || 0)),
    };
    return r.fondo && r.texto && r.acento && r.marca && r.sobreAcento ? r : null;
}

/* Las fotos que usa un catálogo: las de sus productos y la de fondo. */
function fotosDe(productos, aspecto) {
    const fotos = productos.map((p) => p.foto).concat(aspecto && aspecto.imagen ? [aspecto.imagen] : []);
    return new Set(fotos.filter((f) => f.startsWith('w:')).map((f) => f.slice(2)));
}

async function leerCatalogo(env, slug) {
    return JSON.parse((await env.CATALOGOS.get('cat:' + slug)) || 'null');
}

async function slugDelCodigo(env, codigo) {
    if (normalizarCodigo(codigo).length !== 8) return null;
    return env.CATALOGOS.get('codigo:' + (await hashDe(codigo)));
}

async function asignarCodigo(env, slug) {
    const anterior = await env.CATALOGOS.get('hash:' + slug);
    if (anterior) await env.CATALOGOS.delete('codigo:' + anterior);
    const codigo = nuevoCodigo();
    const hash = await hashDe(codigo);
    await env.CATALOGOS.put('codigo:' + hash, slug);
    await env.CATALOGOS.put('hash:' + slug, hash);
    return codigo;
}

/* Comparación de largo fijo, para no regalar por el tiempo de respuesta cuántas letras acertaste. */
function mismaClave(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    let distinto = 0;
    for (let i = 0; i < a.length; i++) distinto |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return distinto === 0;
}

/* Un límite de pedidos por IP (binding de Cloudflare, ver wrangler.catalogos.toml). Sin él, alguien
 * podría probar códigos sin parar: 32^8 combinaciones no se terminan nunca a 20 por minuto. Se
 * cuenta ANTES de mirar si el código es bueno, así pasado el límite no se aprende nada. */
async function excedido(limite, request) {
    if (!limite) return false;
    const { success } = await limite.limit({ key: request.headers.get('CF-Connecting-IP') || 'sin-ip' });
    return !success;
}

const DEMASIADOS = { error: 'Demasiados intentos seguidos. Esperá un minuto y probá de nuevo.' };

/* El tipo de una imagen se mira en sus primeros bytes, no en lo que dice el pedido: así no se puede
 * subir una página con trampa diciendo que es una foto. */
function tipoReal(bytes) {
    const b = new Uint8Array(bytes.slice(0, 12));
    const letras = (desde, hasta) => String.fromCharCode(...b.slice(desde, hasta));
    if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
    if (b[0] === 0x89 && letras(1, 4) === 'PNG') return 'image/png';
    if (letras(0, 4) === 'GIF8') return 'image/gif';
    if (letras(0, 4) === 'RIFF' && letras(8, 12) === 'WEBP') return 'image/webp';
    return null;
}

async function cuerpoJson(request) {
    try {
        return await request.json();
    } catch {
        return null;
    }
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const partes = url.pathname.split('/').filter(Boolean);
        const origen = request.headers.get('Origin') || '';
        const esEditor = ORIGENES_EDITOR.includes(origen);
        const publico = request.method === 'GET' && (partes[0] === 'catalogo' || partes[0] === 'foto');
        const cabeceras = cors(esEditor ? origen : '', publico);

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: cabeceras });
        }

        // ---- Lo público: los productos y las fotos de un catálogo ----
        if (publico && partes[0] === 'catalogo' && partes.length === 2) {
            const cat = SLUG_OK.test(partes[1]) ? await leerCatalogo(env, partes[1]) : null;
            if (!cat) return respuesta({ error: 'No existe ese catálogo' }, 404, cabeceras);
            return respuesta(
                { nombre: cat.nombre, productos: cat.productos, aspecto: cat.aspecto || null, actualizado: cat.actualizado },
                200,
                cabeceras,
                { 'Cache-Control': 'public, max-age=15' },
            );
        }
        if (publico && partes[0] === 'foto' && partes.length === 2 && /^[a-z0-9]{12,32}$/.test(partes[1])) {
            const { value, metadata } = await env.CATALOGOS.getWithMetadata('foto:' + partes[1], 'arrayBuffer');
            if (!value) return new Response('No existe esa foto', { status: 404, headers: cabeceras });
            const tipo = metadata && TIPOS_FOTO.includes(metadata.tipo) ? metadata.tipo : 'image/jpeg';
            return new Response(value, {
                headers: {
                    ...cabeceras,
                    'Content-Type': tipo,
                    'Cache-Control': 'public, max-age=31536000, immutable',
                    // Que el navegador la trate siempre como imagen, nunca como página
                    'X-Content-Type-Options': 'nosniff',
                    'Content-Security-Policy': "default-src 'none'; sandbox",
                },
            });
        }

        if (!esEditor) return respuesta({ error: 'Origen no permitido' }, 403, cabeceras);

        if (['/entrar', '/catalogo', '/foto'].includes(url.pathname) && (await excedido(env.LIMITE_CODIGO, request))) {
            return respuesta(DEMASIADOS, 429, cabeceras);
        }

        // ---- El editor: entrar con el código, guardar, subir fotos ----
        if (request.method === 'POST' && url.pathname === '/entrar') {
            const datos = await cuerpoJson(request);
            const slug = await slugDelCodigo(env, datos && datos.codigo);
            const cat = slug ? await leerCatalogo(env, slug) : null;
            if (!cat) return respuesta({ error: 'Ese código no es de ningún catálogo' }, 401, cabeceras);
            return respuesta(cat, 200, cabeceras);
        }

        if (request.method === 'PUT' && url.pathname === '/catalogo') {
            const datos = await cuerpoJson(request);
            const slug = await slugDelCodigo(env, datos && datos.codigo);
            const cat = slug ? await leerCatalogo(env, slug) : null;
            if (!cat) return respuesta({ error: 'Ese código no es de ningún catálogo' }, 401, cabeceras);
            const productos = limpiarProductos(datos.productos);
            // Sin "aspecto" en el pedido, queda el que estaba; con null, vuelve al diseño original
            const aspecto = 'aspecto' in datos ? limpiarAspecto(datos.aspecto) : cat.aspecto || null;
            const quedan = fotosDe(productos, aspecto);
            for (const id of fotosDe(cat.productos, cat.aspecto)) {
                if (!quedan.has(id)) await env.CATALOGOS.delete('foto:' + id);
            }
            const nuevo = { ...cat, productos, aspecto, actualizado: new Date().toISOString() };
            await env.CATALOGOS.put('cat:' + slug, JSON.stringify(nuevo));
            return respuesta(nuevo, 200, cabeceras);
        }

        if (request.method === 'POST' && url.pathname === '/foto') {
            const slug = await slugDelCodigo(env, request.headers.get('X-Codigo'));
            if (!slug) return respuesta({ error: 'Ese código no es de ningún catálogo' }, 401, cabeceras);
            const bytes = await request.arrayBuffer();
            const tipo = tipoReal(bytes);
            if (!tipo) return respuesta({ error: 'La foto tiene que ser JPG, WEBP, PNG o GIF' }, 415, cabeceras);
            if (bytes.byteLength > (tipo === 'image/gif' ? MAX_GIF : MAX_FOTO)) {
                return respuesta({ error: 'La foto pesa demasiado' }, 413, cabeceras);
            }
            const id = nuevoId();
            await env.CATALOGOS.put('foto:' + id, bytes, { metadata: { slug, tipo } });
            return respuesta({ foto: 'w:' + id }, 200, cabeceras);
        }

        // ---- Administración: alta, códigos y lista ----
        if (partes[0] === 'admin') {
            if (await excedido(env.LIMITE_ADMIN, request)) return respuesta(DEMASIADOS, 429, cabeceras);
            if (!env.ADMIN_CLAVE || !mismaClave(request.headers.get('X-Admin') || '', env.ADMIN_CLAVE)) {
                return respuesta({ error: 'Clave de administración incorrecta' }, 401, cabeceras);
            }
            if (request.method === 'GET' && url.pathname === '/admin/catalogos') {
                const lista = [];
                let cursor;
                do {
                    const pagina = await env.CATALOGOS.list({ prefix: 'cat:', cursor });
                    for (const k of pagina.keys) {
                        const cat = await leerCatalogo(env, k.name.slice(4));
                        if (cat) lista.push({ slug: cat.slug, nombre: cat.nombre, productos: cat.productos.length, actualizado: cat.actualizado });
                    }
                    cursor = pagina.list_complete ? null : pagina.cursor;
                } while (cursor);
                return respuesta(lista, 200, cabeceras);
            }
            const datos = (await cuerpoJson(request)) || {};
            const slug = String(datos.slug || '').trim().toLowerCase();
            if (!SLUG_OK.test(slug)) {
                return respuesta({ error: 'La dirección va en minúsculas, con números y guiones: de 3 a 40 letras' }, 400, cabeceras);
            }
            if (request.method === 'POST' && url.pathname === '/admin/alta') {
                if (await leerCatalogo(env, slug)) return respuesta({ error: 'Ya existe un catálogo con esa dirección' }, 409, cabeceras);
                const nombre = texto(datos.nombre, 80) || slug;
                const enlace = /^https:\/\/[^\s"'<>]{4,200}$/.test(datos.enlace || '')
                    ? datos.enlace
                    : `https://cfp401-ensenada.github.io/catalogos/${slug}/`;
                const cat = { slug, nombre, enlace, productos: limpiarProductos(datos.productos), actualizado: new Date().toISOString() };
                await env.CATALOGOS.put('cat:' + slug, JSON.stringify(cat));
                return respuesta({ slug, nombre, codigo: await asignarCodigo(env, slug) }, 200, cabeceras);
            }
            /* La baja borra todo lo del catálogo: sus datos, su código y sus fotos. Pide la dirección
             * escrita de nuevo, para que no se borre uno por un clic de más. La carpeta del repo de la
             * organización se borra aparte. */
            if (request.method === 'POST' && url.pathname === '/admin/baja') {
                if (datos.confirmar !== slug) return respuesta({ error: 'Para dar de baja, escribí la dirección del catálogo' }, 400, cabeceras);
                const cat = await leerCatalogo(env, slug);
                if (!cat) return respuesta({ error: 'No existe ese catálogo' }, 404, cabeceras);
                for (const id of fotosDe(cat.productos, cat.aspecto)) await env.CATALOGOS.delete('foto:' + id);
                const hash = await env.CATALOGOS.get('hash:' + slug);
                if (hash) await env.CATALOGOS.delete('codigo:' + hash);
                await env.CATALOGOS.delete('hash:' + slug);
                await env.CATALOGOS.delete('cat:' + slug);
                return respuesta({ slug, nombre: cat.nombre }, 200, cabeceras);
            }
            if (request.method === 'POST' && url.pathname === '/admin/codigo') {
                if (!(await leerCatalogo(env, slug))) return respuesta({ error: 'No existe ese catálogo' }, 404, cabeceras);
                return respuesta({ slug, codigo: await asignarCodigo(env, slug) }, 200, cabeceras);
            }
        }

        return respuesta({ error: 'No encontrado' }, 404, cabeceras);
    },
};
