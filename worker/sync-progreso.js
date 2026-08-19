/**
 * Worker de Cloudflare: sincroniza el avance de un alumno entre dispositivos.
 *
 * El problema que resuelve: el avance de los ejercicios vive en el localStorage
 * del navegador, así que lo que hacen en la compu del CFP no aparece en la de
 * la casa. Git no sirve acá — no hay archivos, hay claves en el navegador.
 *
 * Cómo funciona: cada alumno tiene un CÓDIGO (ej. "guada-7f3k"). El sitio
 * manda todo su avance bajo ese código (push) y desde otro dispositivo lo pide
 * con el mismo código (pull). No hay cuentas ni contraseñas: el código ES la
 * llave, y se genera solo la primera vez.
 *
 * El push FUSIONA, no reemplaza (ver más abajo el porqué), y guarda la versión
 * anterior en "<codigo>:anterior" por las dudas.
 *
 * ⚠️ Esto NO es un sistema seguro y no pretende serlo: quien tenga el código de
 * otro puede leer y pisar su avance. Es aceptable porque lo que se guarda son
 * ejercicios de un curso, no datos sensibles. No poner acá nada que importe.
 *
 * Ver worker/README.md para los pasos de instalación.
 */

const ORIGENES_PERMITIDOS = ['https://maxinunez24.github.io'];

// Un alumno con 60 ejercicios ronda los 30 KB. 512 KB deja margen de sobra y
// evita que alguien use esto de hosting gratis.
const MAX_BYTES = 512 * 1024;

// Letras y números, guiones y guión bajo. Sin barras: el código va en la URL.
const CODIGO_OK = /^[a-z0-9_-]{4,40}$/;

/* Fusiona dos avances quedándose con la ÚLTIMA edición de cada ejercicio.
 *
 * Cada ejercicio lleva su fecha en `pcp:ts:<ruta>::<título>` (la escribe
 * progreso.ts). Ante el mismo ejercicio en las dos computadoras, gana el más
 * nuevo — no "el que llega último en el pedido", que era lo de antes y no tiene
 * nada que ver con cuál se escribió después.
 *
 * Lo guardado antes de esta versión no tiene fecha: ahí gana el que sí la
 * tiene, y si ninguno la tiene, el entrante (como antes).
 *
 * Es la MISMA regla que aplica el cliente en public/sync-progreso.js. Están
 * duplicadas a propósito: el cliente no puede confiar en qué versión del Worker
 * está desplegada, y el Worker no puede confiar en qué versión del sitio tiene
 * abierta el alumno.
 */
function fusionar(viejo, nuevo) {
  const out = {};
  const base = (k) => k.replace(/^pcp:[a-z]+:/, '');
  for (const k of new Set([...Object.keys(viejo), ...Object.keys(nuevo)])) {
    const a = viejo[k];
    const b = nuevo[k];
    if (a === undefined) { out[k] = b; continue; }
    if (b === undefined) { out[k] = a; continue; }
    if (a === b) { out[k] = a; continue; }
    if (k.startsWith('pcp:ts:')) { out[k] = a > b ? a : b; continue; }
    const ta = viejo['pcp:ts:' + base(k)] || '';
    const tb = nuevo['pcp:ts:' + base(k)] || '';
    if (ta && tb) out[k] = tb >= ta ? b : a;
    else if (tb) out[k] = b;
    else if (ta) out[k] = a;
    else out[k] = b;
  }
  return out;
}

function cors(origen) {
  return {
    'Access-Control-Allow-Origin': origen,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request, env) {
    const origen = request.headers.get('Origin') || '';
    const permitido = ORIGENES_PERMITIDOS.includes(origen);
    const cabeceras = cors(permitido ? origen : '');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cabeceras });
    }
    if (!permitido) {
      return new Response('Origen no permitido', { status: 403 });
    }

    const url = new URL(request.url);
    const codigo = (url.searchParams.get('codigo') || '').trim().toLowerCase();
    if (!CODIGO_OK.test(codigo)) {
      return new Response(JSON.stringify({ error: 'Código inválido' }), {
        status: 400,
        headers: { ...cabeceras, 'Content-Type': 'application/json' },
      });
    }

    // ---- pull: traer lo guardado ----
    if (request.method === 'GET') {
      const guardado = await env.PROGRESO.get(codigo);
      if (guardado === null) {
        return new Response(JSON.stringify({ error: 'sin-datos' }), {
          status: 404,
          headers: { ...cabeceras, 'Content-Type': 'application/json' },
        });
      }
      return new Response(guardado, {
        status: 200,
        headers: { ...cabeceras, 'Content-Type': 'application/json' },
      });
    }

    // ---- push: guardar ----
    if (request.method === 'POST') {
      const cuerpo = await request.text();
      if (cuerpo.length > MAX_BYTES) {
        return new Response(JSON.stringify({ error: 'Demasiado grande' }), {
          status: 413,
          headers: { ...cabeceras, 'Content-Type': 'application/json' },
        });
      }
      let datos;
      try {
        datos = JSON.parse(cuerpo);
      } catch {
        return new Response(JSON.stringify({ error: 'JSON inválido' }), {
          status: 400,
          headers: { ...cabeceras, 'Content-Type': 'application/json' },
        });
      }
      if (!datos || typeof datos !== 'object' || typeof datos.claves !== 'object') {
        return new Response(JSON.stringify({ error: 'Formato inesperado' }), {
          status: 400,
          headers: { ...cabeceras, 'Content-Type': 'application/json' },
        });
      }

      // ---- El push NO pisa: FUSIONA ----
      // Antes esto era un `put` directo, y ahí había una forma silenciosa de
      // perder trabajo: si un alumno abría el sitio en la compu del CFP (donde
      // el navegador arranca vacío), resolvía dos ejercicios y hacía push, los
      // sesenta que tenía guardados se reemplazaban por dos.
      //
      // Como los ejercicios solo se AGREGAN, la unión es la respuesta correcta:
      // lo que llega gana sobre la misma clave (es más nuevo), y lo que estaba
      // solo en la nube se conserva. Con esto, un push nunca puede restar.
      let previo = null;
      try {
        previo = JSON.parse((await env.PROGRESO.get(codigo)) || 'null');
      } catch {
        previo = null; // guardado corrupto: se ignora y se sigue
      }
      const claves = fusionar((previo && previo.claves) || {}, datos.claves);

      const guardar = JSON.stringify({
        claves,
        nombre: typeof datos.nombre === 'string' && datos.nombre
          ? datos.nombre.slice(0, 80)
          : (previo && previo.nombre) || '',
        fecha: new Date().toISOString(),
      });

      // Si la fusión no cambió nada, no se escribe. El envío del cierre de
      // pestaña manda seguido exactamente lo mismo que ya está guardado, y la
      // capa gratuita de KV tiene 1000 escrituras por día: no hay por qué
      // gastarlas en confirmar que todo sigue igual.
      // Se compara con las claves ORDENADAS: dos objetos iguales pueden
      // serializarse distinto solo por el orden en que se armaron.
      const huella = (o) =>
        JSON.stringify(Object.keys(o).sort().map((k) => [k, o[k]]));
      const sinCambios = previo && huella(claves) === huella(previo.claves || {});
      if (sinCambios) {
        return new Response(JSON.stringify({
          ok: true,
          guardadas: 0,
          total: Object.keys(claves).length,
          sinCambios: true,
        }), { status: 200, headers: { ...cabeceras, 'Content-Type': 'application/json' } });
      }

      // Copia de la versión anterior antes de escribir. Es la red de seguridad
      // para el día que algo salga mal: se recupera a mano desde el panel de
      // Cloudflare, buscando la clave "<codigo>:anterior".
      if (previo) {
        await env.PROGRESO.put(codigo + ':anterior', JSON.stringify(previo));
      }
      await env.PROGRESO.put(codigo, guardar);

      return new Response(JSON.stringify({
        ok: true,
        guardadas: Object.keys(datos.claves).length,
        total: Object.keys(claves).length,
      }), {
        status: 200,
        headers: { ...cabeceras, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Método no permitido', { status: 405, headers: cabeceras });
  },
};
