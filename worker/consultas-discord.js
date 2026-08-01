/**
 * Worker de Cloudflare: recibe las consultas de los alumnos desde el sitio de
 * ejercicios y las publica en el canal #Consultas de Discord.
 *
 * ¿Por qué existe este intermediario, en vez de llamar al webhook desde la
 * página? Porque cualquier cosa que esté en el JavaScript del sitio es pública.
 * Quien encontrara la URL del webhook podría escribir en el canal haciéndose
 * pasar por el profe (los webhooks permiten fijar nombre y avatar por mensaje).
 * Acá el webhook vive como SECRETO del Worker y nunca viaja al navegador.
 *
 * Ver worker/README.md para los pasos de instalación.
 */

// Solo se aceptan pedidos que vengan del sitio del curso. No es infalible
// (un script fuera del navegador puede mentir el Origin), pero corta el abuso
// casual, que es el realista.
const ORIGENES_PERMITIDOS = ['https://maxinunez24.github.io'];

// Topes para que nadie use esto de megáfono. Discord corta en 2000 caracteres.
const MAX_NOMBRE = 80;
const MAX_CONSULTA = 1000;
const MAX_CODIGO = 3000;

function cors(origen) {
  return {
    'Access-Control-Allow-Origin': origen,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function recortar(valor, max) {
  const s = typeof valor === 'string' ? valor.trim() : '';
  return s.length > max ? s.slice(0, max) + '\n…(recortado)' : s;
}

export default {
  async fetch(request, env) {
    const origen = request.headers.get('Origin') || '';
    const permitido = ORIGENES_PERMITIDOS.includes(origen);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(permitido ? origen : '') });
    }
    if (request.method !== 'POST') {
      return new Response('Método no permitido', { status: 405 });
    }
    if (!permitido) {
      return new Response('Origen no permitido', { status: 403 });
    }

    let datos;
    try {
      datos = await request.json();
    } catch {
      return new Response('JSON inválido', { status: 400, headers: cors(origen) });
    }

    const nombre = recortar(datos.nombre, MAX_NOMBRE) || 'Alumno/a sin nombre';
    const consulta = recortar(datos.consulta, MAX_CONSULTA);
    const codigo = recortar(datos.codigo, MAX_CODIGO);
    const ejercicio = recortar(datos.ejercicio, 120) || 'Ejercicio';
    const leccion = recortar(datos.leccion, 200);
    const url = recortar(datos.url, 300);

    if (!codigo) {
      return new Response('Falta el código', { status: 400, headers: cors(origen) });
    }

    // Embed: queda prolijo y agrupado en el canal, en vez de un muro de texto.
    const cuerpo = {
      username: 'Consultas del curso',
      embeds: [
        {
          title: `📝 ${ejercicio}`,
          description: consulta || '_(sin consulta escrita)_',
          color: 0x5865f2,
          author: { name: nombre },
          fields: [
            ...(leccion ? [{ name: 'Lección', value: leccion }] : []),
            ...(url ? [{ name: 'Link', value: url }] : []),
          ],
          timestamp: new Date().toISOString(),
        },
      ],
      // El código va aparte del embed: así Discord le da resaltado de Python.
      content: '```python\n' + codigo.replace(/```/g, '`​``') + '\n```',
    };

    const r = await fetch(env.DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });

    if (!r.ok) {
      return new Response('Discord rechazó el mensaje', { status: 502, headers: cors(origen) });
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...cors(origen), 'Content-Type': 'application/json' },
    });
  },
};
