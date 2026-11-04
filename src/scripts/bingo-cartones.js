/* Los cartones del Bingo de la Expo: el MISMO archivo lo usan el Worker de los catálogos (que
 * entrega los cartones) y las páginas del stand (que los validan). Por eso es JavaScript sin
 * nada de Astro ni de Cloudflare: solo crypto.subtle, que tienen los dos.
 *
 * El problema que resuelve: si el celular armara el cartón solo, alguien podría recargar la página
 * cuando ya salieron 15 bolillas hasta conseguir uno casi lleno (con 20 bolillas afuera, 1 de cada
 * 15 cartones de 6 de 30 ya está ganado). Entonces:
 *
 *   - El cartón lo entrega el Worker, con un CÓDIGO firmado (HMAC) que lleva adentro la hora.
 *   - Los números salen del código y la firma: nadie los elige.
 *   - El operador valida en la notebook, SIN internet: con la clave reconstruye el cartón y mira
 *     la hora. Un cartón emitido después de la primera bolilla no vale.
 *
 * No se guarda nada en ningún lado: ni en KV ni en una base de datos. La capa gratuita ni se entera.
 *
 * El código: 8 letras (40 bits) = 10 bits al azar + la hora en decenas de segundos (12 bits:
 * alcanzan para 11 horas) + 18 bits de firma. Lo al azar va adelante, así los códigos de una
 * misma ronda no empiezan todos igual. Va con las letras de Crockford: sin I, L, O ni U, así se
 * dicta sin confundir, y si alguien escribe una O se lee como 0.
 */

export const LETRAS_BINGO = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/** Los tamaños del cartón, como en la clase "Juegos II": cuantos más juegan, más números. */
export const TAMANOS = ['5-25', '6-30', '7-35'];

export function elegirCarton(jugadores) {
    if (jugadores <= 5) return { cantidad: 5, maximo: 25 };
    if (jugadores <= 20) return { cantidad: 6, maximo: 30 };
    return { cantidad: 7, maximo: 35 };
}

export function leerTamano(texto) {
    if (!TAMANOS.includes(texto)) return null;
    const [cantidad, maximo] = texto.split('-').map(Number);
    return { cantidad, maximo };
}

export function verificarGanador(carton, sorteados) {
    return carton.every((n) => sorteados.includes(n));
}

/** La ronda: 4 letras, que van en el QR de la ronda y adentro de la firma. */
export const RONDA_OK = /^[0-9A-HJKMNP-TV-Z]{4}$/;

const DECENAS = 10000; // la hora se guarda en decenas de segundos
const VUELTA = 4096; // 12 bits

/** La clave de la firma sale de la clave de administración: no hay otro secreto que cuidar. */
export async function claveBingo(adminClave) {
    const base = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('bingo|' + adminClave));
    return crypto.subtle.importKey('raw', base, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

async function firma(clave, texto) {
    return new Uint8Array(await crypto.subtle.sign('HMAC', clave, new TextEncoder().encode(texto)));
}

function aLetras(valor) {
    let texto = '';
    for (let i = 0; i < 8; i++) {
        texto = LETRAS_BINGO[valor % 32] + texto;
        valor = Math.floor(valor / 32);
    }
    return texto.slice(0, 4) + '-' + texto.slice(4);
}

function deLetras(codigo) {
    const limpio = String(codigo || '').toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1').replace(/[^0-9A-Z]/g, '');
    if (limpio.length !== 8) return null;
    let valor = 0;
    for (const letra of limpio) {
        const i = LETRAS_BINGO.indexOf(letra);
        if (i < 0) return null;
        valor = valor * 32 + i;
    }
    return valor;
}

async function sello(clave, ronda, tamano, hora, azar) {
    const f = await firma(clave, `sello|${ronda}|${tamano}|${hora}|${azar}`);
    return (f[0] << 10) | (f[1] << 2) | (f[2] >> 6); // 18 bits
}

/* Los números del cartón: un generador con semilla (sfc32) que arranca de la firma del código, y
 * de ahí se sacan "cantidad" números sin repetir, como un mazo que se mezcla. */
async function numerosDe(clave, codigo, ronda, tamano) {
    const { cantidad, maximo } = leerTamano(tamano);
    const f = await firma(clave, `numeros|${codigo}|${ronda}|${tamano}`);
    const vista = new DataView(f.buffer);
    let [a, b, c, d] = [0, 4, 8, 12].map((i) => vista.getUint32(i));
    const siguiente = () => {
        const t = (((a + b) >>> 0) + d) >>> 0;
        d = (d + 1) >>> 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) >>> 0;
        c = ((c << 21) | (c >>> 11)) >>> 0;
        c = (c + t) >>> 0;
        return t / 4294967296;
    };
    const mazo = Array.from({ length: maximo }, (_, i) => i + 1);
    for (let i = 0; i < cantidad; i++) {
        const j = i + Math.floor(siguiente() * (maximo - i));
        [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
    }
    return mazo.slice(0, cantidad).sort((x, y) => x - y);
}

/** Un cartón nuevo (lo llama el Worker). `ahora` en milisegundos. */
export async function emitirCarton(clave, ronda, tamano, ahora) {
    const hora = Math.floor(ahora / DECENAS) % VUELTA;
    const azar = crypto.getRandomValues(new Uint16Array(1))[0] % 1024;
    const valor = azar * 2 ** 30 + hora * 2 ** 18 + (await sello(clave, ronda, tamano, hora, azar));
    const codigo = aLetras(valor);
    return { codigo, numeros: await numerosDe(clave, codigo, ronda, tamano) };
}

/**
 * Lee un código (lo llama el operador). Devuelve null si la firma no es de esta ronda y este
 * tamaño; si no, los números y CUÁNDO se emitió (en milisegundos, a menos de 10 segundos).
 */
export async function leerCarton(clave, codigo, ronda, tamano, ahora) {
    const valor = deLetras(codigo);
    if (valor === null) return null;
    const azar = Math.floor(valor / 2 ** 30);
    const hora = Math.floor(valor / 2 ** 18) % VUELTA;
    if (valor % 2 ** 18 !== (await sello(clave, ronda, tamano, hora, azar))) return null;
    const normal = aLetras(valor);
    const decenas = Math.floor(ahora / DECENAS);
    const atras = (((decenas - hora) % VUELTA) + VUELTA) % VUELTA;
    return { codigo: normal, numeros: await numerosDe(clave, normal, ronda, tamano), emitido: (decenas - atras) * DECENAS };
}

/** Una ronda nueva: 4 letras al azar. */
export function nuevaRonda() {
    return [...crypto.getRandomValues(new Uint8Array(4))].map((b) => LETRAS_BINGO[b % 32]).join('');
}
