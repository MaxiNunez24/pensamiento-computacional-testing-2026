/**
 * Worker de Cloudflare: el cuestionario de relevamiento del CFP 401.
 *
 * Lo contesta el equipo del CFP (dirección, regencia, secretaría, preceptoría,
 * auxiliares e instructores) desde el celular, antes de la entrevista del 4/9.
 * La idea es de un alumno del curso: que llegue todo escrito, y que el viernes
 * se pregunte SOBRE lo que ya contestaron en vez de arrancar de cero.
 *
 * ⚠️ ES UN WORKER APARTE, igual que el del tablero, y por el mismo motivo: el
 * de sincronización guarda meses de trabajo de los alumnos y el del tablero se
 * usa en la demo. Si este se rompe, esos dos siguen andando.
 *
 * ─────────────────────── LA DIFERENCIA CON LOS OTROS ────────────────────────
 *
 * Acá SÍ hay datos de personas reales: nombres del personal del CFP y opiniones
 * sobre cómo funciona su propio trabajo. Eso cambia dos cosas:
 *
 *   1. LEER ESTÁ CERRADO DE VERDAD. No con la `CLAVE_CURSO` que viaja en el
 *      JavaScript del sitio (esa cualquiera la lee), sino con un SECRETO del
 *      Worker que solo tiene el profe. Si el secreto no está configurado, no se
 *      lee nada: falla cerrado, nunca abierto.
 *   2. Las respuestas NO van al repo. El repo es público. Ver README.
 *
 * ─────────────────────────────── LAS RUTAS ──────────────────────────────────
 *
 *   POST /respuesta   Guardar (o corregir) la respuesta de una persona
 *   GET  /cuantas     Cuántas van. SOLO el número, sin nada del contenido.
 *   GET  /respuestas  Todas, completas. Pide el secreto del profe.
 *
 * Cada respuesta es su propia clave de KV (`r:<id>`), así dos personas que
 * contestan al mismo tiempo no se pisan. El tablero necesita versiones porque
 * todos escriben sobre el MISMO documento; acá cada uno escribe sobre el suyo,
 * y el problema desaparece en vez de resolverse.
 *
 * Instalación: ver worker/README.md. Necesita un KV llamado CUESTIONARIO y un
 * secreto llamado CLAVE_DOCENTE.
 */

const ORIGENES_PERMITIDOS = ['https://maxinunez24.github.io'];

// Igual que en el tablero: no es seguridad, corta el abuso casual de alguien
// que pase por el sitio público. Lo que de verdad está protegido es la LECTURA.
const CLAVE_CURSO = 'cfp401';

const MAX_RESPUESTA = 4000;   // por campo
const MAX_TOTAL = 40 * 1024;  // por persona
const MAX_PERSONAS = 60;      // el CFP entero no llega ni cerca

function cors(origen) {
  return {
    'Access-Control-Allow-Origin': origen,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Clave',
    'Access-Control-Max-Age': '86400',
  };
}

const json = (datos, cabeceras, status = 200) =>
  new Response(JSON.stringify(datos), {
    status,
    headers: { ...cabeceras, 'Content-Type': 'application/json' },
  });

/** Recorta y limpia un texto que vino del navegador. */
const texto = (v, tope = MAX_RESPUESTA) => String(v == null ? '' : v).slice(0, tope);

export default {
  async fetch(request, env) {
    const origen = request.headers.get('Origin') || '';
    const permitido = ORIGENES_PERMITIDOS.includes(origen);
    const cabeceras = cors(permitido ? origen : '');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cabeceras });
    }
    if (!permitido) return new Response('Origen no permitido', { status: 403 });

    const url = new URL(request.url);
    const ruta = url.pathname.replace(/\/+$/, '') || '/';

    // ──────────────────────────── CONTESTAR ────────────────────────────

    if (ruta === '/respuesta' && request.method === 'POST') {
      const cuerpo = await request.text();
      if (cuerpo.length > MAX_TOTAL) return json({ error: 'demasiado largo' }, cabeceras, 413);

      let datos;
      try {
        datos = JSON.parse(cuerpo);
      } catch {
        return json({ error: 'JSON inválido' }, cabeceras, 400);
      }
      if (datos.clave !== CLAVE_CURSO) return json({ error: 'clave incorrecta' }, cabeceras, 403);

      // El id lo genera el navegador y queda en su localStorage. Sirve para que
      // alguien pueda volver y CORREGIR lo que puso, en vez de que le queden
      // dos respuestas distintas. No identifica a nadie por sí solo.
      // Se permite el guion: el id viene como <navegador>-<rol>, para que una
      // misma persona con dos roles (la Secretaría también es instructora)
      // mande dos respuestas distintas en vez de pisar la primera.
      const id = texto(datos.id, 60).replace(/[^a-z0-9-]/gi, '');
      if (!id) return json({ error: 'falta el id' }, cabeceras, 400);

      const rol = texto(datos.rol, 60);
      if (!rol) return json({ error: 'falta el rol' }, cabeceras, 400);

      const yaEstaba = await env.CUESTIONARIO.get('r:' + id);
      if (!yaEstaba) {
        const { keys } = await env.CUESTIONARIO.list({ prefix: 'r:', limit: MAX_PERSONAS + 1 });
        if (keys.length > MAX_PERSONAS) {
          return json({ error: 'ya hay demasiadas respuestas' }, cabeceras, 409);
        }
      }

      const respuestas = {};
      if (datos.respuestas && typeof datos.respuestas === 'object') {
        for (const [k, v] of Object.entries(datos.respuestas)) {
          respuestas[texto(k, 40)] = texto(v);
        }
      }

      const entrada = {
        id,
        rol,
        nombre: texto(datos.nombre, 80),   // opcional a propósito: ver el .astro
        respuestas,
        fecha: new Date().toISOString(),
        // Si vuelve a contestar, se conserva cuándo lo hizo la primera vez.
        primera: yaEstaba ? (JSON.parse(yaEstaba).primera || JSON.parse(yaEstaba).fecha) : new Date().toISOString(),
      };

      await env.CUESTIONARIO.put('r:' + id, JSON.stringify(entrada));
      return json({ ok: true, corregida: !!yaEstaba }, cabeceras);
    }

    // ─────────── CUÁNTAS VAN (para proyectar en clase, sin espiar) ───────────

    if (ruta === '/cuantas' && request.method === 'GET') {
      const { keys } = await env.CUESTIONARIO.list({ prefix: 'r:', limit: 1000 });
      // A propósito devuelve el número y NADA más. Se puede mostrar en el aula
      // con los alumnos mirando sin que se lea una sola respuesta.
      //
      // ⚠️ El número LLEGA TARDE, hasta como un minuto. `list()` de KV es
      // eventualmente consistente: la respuesta ya está guardada (un `get` de
      // esa clave la trae) pero todavía no figura en el listado. Medido: 0 justo
      // después de escribir, 1 al minuto siguiente. No es un error, no hay nada
      // que arreglar, y vale lo mismo para /respuestas, que también lista.
      return json({ cuantas: keys.length }, cabeceras);
    }

    // ─────────────────── LEER TODO (solo el profe) ───────────────────

    if (ruta === '/respuestas' && request.method === 'GET') {
      // Falla cerrado: si el secreto no está configurado en Cloudflare, no se
      // lee nada. Un olvido de configuración no puede dejar esto abierto.
      if (!env.CLAVE_DOCENTE) {
        return json({ error: 'sin CLAVE_DOCENTE configurada' }, cabeceras, 503);
      }
      // Va por cabecera y no por la URL: las URLs quedan en historiales, en
      // logs y en el Referer. Una clave en la barra de direcciones no es clave.
      if (request.headers.get('X-Clave') !== env.CLAVE_DOCENTE) {
        return json({ error: 'no autorizado' }, cabeceras, 401);
      }

      const { keys } = await env.CUESTIONARIO.list({ prefix: 'r:', limit: 1000 });
      const respuestas = [];
      for (const k of keys) {
        const v = await env.CUESTIONARIO.get(k.name);
        if (v) respuestas.push(JSON.parse(v));
      }
      respuestas.sort((a, b) => (a.primera || '').localeCompare(b.primera || ''));
      return json({ respuestas }, cabeceras);
    }

    return json({ error: 'ruta desconocida' }, cabeceras, 404);
  },
};
