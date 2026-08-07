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

      const guardar = JSON.stringify({
        claves: datos.claves,
        nombre: typeof datos.nombre === 'string' ? datos.nombre.slice(0, 80) : '',
        fecha: new Date().toISOString(),
      });
      await env.PROGRESO.put(codigo, guardar);

      return new Response(JSON.stringify({ ok: true, guardadas: Object.keys(datos.claves).length }), {
        status: 200,
        headers: { ...cabeceras, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Método no permitido', { status: 405, headers: cabeceras });
  },
};
