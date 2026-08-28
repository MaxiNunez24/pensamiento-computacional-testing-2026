/**
 * Worker de Cloudflare: el tablero del proyecto y el foro de soluciones.
 *
 * Dos cosas que el curso necesita y que el Worker de progreso no puede dar,
 * porque ese está pensado para que **cada alumno lea solo lo suyo**:
 *
 *   1. TABLERO (Kanban) — el estado del proyecto, compartido. Todos ven lo
 *      mismo y cualquiera puede mover una tarjeta.
 *   2. SOLUCIONES — cada uno publica la suya de forma ANÓNIMA, se comparan en
 *      clase y se vota (también anónimo) cuál va al sistema.
 *
 * ⚠️ ES UN WORKER APARTE, a propósito. El de progreso guarda el trabajo de
 * meses de los alumnos: no se le agregan funciones nuevas para no arriesgarlo.
 * Si este se rompe, la sincronización sigue andando igual.
 *
 * Sobre el anonimato: acá NO se guarda quién escribió cada solución. Ni el
 * nombre, ni el código de sincronización, ni nada que permita reconstruirlo.
 * Lo único que se guarda es un identificador al azar del navegador, y solo
 * para que nadie pueda votar diez veces. Es una decisión del curso: se discute
 * el código, no la persona.
 *
 * Instalación: ver worker/README.md. Necesita un KV llamado TABLERO.
 */

const ORIGENES_PERMITIDOS = ['https://maxinunez24.github.io'];

// Un tablero con 40 tarjetas ronda los 8 KB. 256 KB es de sobra.
const MAX_BYTES = 256 * 1024;

// Clave del curso. No es seguridad de verdad —está del lado del cliente— pero
// evita que alguien que pase por el sitio público mueva las tarjetas de la
// clase por diversión. Contra un ataque en serio no sirve, y no hace falta:
// acá no hay datos personales.
const CLAVE_CURSO = 'cfp401';

const MAX_CODIGO = 4000;      // una solución de un ejercicio no llega ni cerca
const MAX_SOLUCIONES = 40;    // por ejercicio

function cors(origen) {
  return {
    'Access-Control-Allow-Origin': origen,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

const json = (datos, cabeceras, status = 200) =>
  new Response(JSON.stringify(datos), {
    status,
    headers: { ...cabeceras, 'Content-Type': 'application/json' },
  });

/** id corto y al azar, sin relación con nadie. */
const idAlAzar = () => Math.random().toString(36).slice(2, 10);

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

    // ───────────────────────────── TABLERO ─────────────────────────────

    if (ruta === '/tablero' && request.method === 'GET') {
      const guardado = await env.TABLERO.get('tablero');
      return json(guardado ? JSON.parse(guardado) : { tareas: [], version: 0 }, cabeceras);
    }

    if (ruta === '/tablero' && request.method === 'POST') {
      const cuerpo = await request.text();
      if (cuerpo.length > MAX_BYTES) return json({ error: 'demasiado grande' }, cabeceras, 413);

      let datos;
      try {
        datos = JSON.parse(cuerpo);
      } catch {
        return json({ error: 'JSON inválido' }, cabeceras, 400);
      }
      if (datos.clave !== CLAVE_CURSO) return json({ error: 'clave incorrecta' }, cabeceras, 403);
      if (!Array.isArray(datos.tareas)) return json({ error: 'formato inesperado' }, cabeceras, 400);

      /* Control de versión: si dos personas mueven tarjetas a la vez, la
         segunda se enteraría recién al recargar y pisaría a la primera. Con
         esto, el que llega tarde recibe un 409 y vuelve a leer. Es el mismo
         problema que tuvimos con el progreso, resuelto antes de que pase. */
      const previo = JSON.parse((await env.TABLERO.get('tablero')) || '{"version":0}');
      if (typeof datos.version === 'number' && datos.version !== previo.version) {
        return json({ error: 'desactualizado', tablero: previo }, cabeceras, 409);
      }

      const nuevo = {
        tareas: datos.tareas,
        version: (previo.version || 0) + 1,
        fecha: new Date().toISOString(),
      };
      await env.TABLERO.put('tablero', JSON.stringify(nuevo));
      return json({ ok: true, version: nuevo.version }, cabeceras);
    }

    // ──────────────────────────── SOLUCIONES ───────────────────────────

    const ejercicio = (url.searchParams.get('ejercicio') || '').slice(0, 120);

    if (ruta === '/soluciones' && request.method === 'GET') {
      if (!ejercicio) return json({ error: 'falta el ejercicio' }, cabeceras, 400);
      const guardado = await env.TABLERO.get('sol:' + ejercicio);
      const datos = guardado ? JSON.parse(guardado) : { soluciones: [] };
      // Se devuelve el conteo de votos, nunca quién votó.
      return json(
        {
          soluciones: datos.soluciones.map((s) => ({
            id: s.id,
            codigo: s.codigo,
            votos: (s.votantes || []).length,
            elegida: !!s.elegida,
          })),
        },
        cabeceras,
      );
    }

    if (ruta === '/soluciones' && request.method === 'POST') {
      if (!ejercicio) return json({ error: 'falta el ejercicio' }, cabeceras, 400);
      let datos;
      try {
        datos = JSON.parse(await request.text());
      } catch {
        return json({ error: 'JSON inválido' }, cabeceras, 400);
      }
      if (datos.clave !== CLAVE_CURSO) return json({ error: 'clave incorrecta' }, cabeceras, 403);

      const codigo = String(datos.codigo || '').slice(0, MAX_CODIGO);
      if (!codigo.trim()) return json({ error: 'la solución está vacía' }, cabeceras, 400);

      const guardado = JSON.parse((await env.TABLERO.get('sol:' + ejercicio)) || '{"soluciones":[]}');
      if (guardado.soluciones.length >= MAX_SOLUCIONES) {
        return json({ error: 'ya hay demasiadas soluciones' }, cabeceras, 409);
      }
      // Si el mismo navegador ya publicó, se REEMPLAZA en vez de duplicar: así
      // alguien puede corregir su solución sin que queden dos versiones suyas.
      const autor = String(datos.autor || '').slice(0, 40);   // id al azar, no un nombre
      const existente = guardado.soluciones.findIndex((s) => s.autor === autor && autor);
      const entrada = { id: idAlAzar(), autor, codigo, votantes: [] };
      if (existente >= 0) {
        entrada.id = guardado.soluciones[existente].id;
        entrada.votantes = guardado.soluciones[existente].votantes || [];
        guardado.soluciones[existente] = entrada;
      } else {
        guardado.soluciones.push(entrada);
      }

      await env.TABLERO.put('sol:' + ejercicio, JSON.stringify(guardado));
      return json({ ok: true, id: entrada.id, total: guardado.soluciones.length }, cabeceras);
    }

    // ────────────────────────────── VOTOS ──────────────────────────────

    if (ruta === '/voto' && request.method === 'POST') {
      let datos;
      try {
        datos = JSON.parse(await request.text());
      } catch {
        return json({ error: 'JSON inválido' }, cabeceras, 400);
      }
      if (datos.clave !== CLAVE_CURSO) return json({ error: 'clave incorrecta' }, cabeceras, 403);

      const guardado = JSON.parse((await env.TABLERO.get('sol:' + ejercicio)) || 'null');
      if (!guardado) return json({ error: 'no hay soluciones' }, cabeceras, 404);

      const votante = String(datos.votante || '').slice(0, 40);
      if (!votante) return json({ error: 'falta el votante' }, cabeceras, 400);

      // Un voto por navegador y por ejercicio: votar de nuevo CAMBIA el voto en
      // vez de sumar otro. Se saca de todas y se pone en la elegida.
      guardado.soluciones.forEach((s) => {
        s.votantes = (s.votantes || []).filter((v) => v !== votante);
      });
      const elegida = guardado.soluciones.find((s) => s.id === datos.solucion);
      if (!elegida) return json({ error: 'esa solución no existe' }, cabeceras, 404);
      elegida.votantes.push(votante);

      await env.TABLERO.put('sol:' + ejercicio, JSON.stringify(guardado));
      return json(
        { ok: true, votos: Object.fromEntries(guardado.soluciones.map((s) => [s.id, s.votantes.length])) },
        cabeceras,
      );
    }

    // ──────────────── MARCAR LA GANADORA (la decide la clase) ───────────

    if (ruta === '/elegir' && request.method === 'POST') {
      let datos;
      try {
        datos = JSON.parse(await request.text());
      } catch {
        return json({ error: 'JSON inválido' }, cabeceras, 400);
      }
      if (datos.clave !== CLAVE_CURSO) return json({ error: 'clave incorrecta' }, cabeceras, 403);

      const guardado = JSON.parse((await env.TABLERO.get('sol:' + ejercicio)) || 'null');
      if (!guardado) return json({ error: 'no hay soluciones' }, cabeceras, 404);
      guardado.soluciones.forEach((s) => { s.elegida = s.id === datos.solucion; });
      await env.TABLERO.put('sol:' + ejercicio, JSON.stringify(guardado));
      return json({ ok: true }, cabeceras);
    }

    return json({ error: 'ruta desconocida' }, cabeceras, 404);
  },
};
