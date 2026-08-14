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

// Topes para que nadie use esto de megáfono.
const MAX_NOMBRE = 80;
const MAX_CONSULTA = 1000;
// El código viaja en `content`, y ahí Discord corta en 2000 caracteres. Con el
// cerco de ```python y el aviso de recorte, 1700 deja margen de sobra; con el
// 3000 de antes, un código largo hacía que Discord rechazara el mensaje entero
// y el alumno veía "Discord no respondió" sin entender por qué.
const MAX_CODIGO = 1700;
// Las entradas van como campo del embed, y ahí el tope de Discord es 1024.
const MAX_ENTRADAS = 800;

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

// Dentro de un bloque de código de Discord, ``` lo cierra antes de tiempo. Se
// mete un caracter invisible en el medio para que se vea igual y no rompa nada.
function sinCercos(s) {
  return s.replace(/```/g, '`​``');
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
    // Las entradas de los ejercicios con input(): sin ellas, el código del
    // alumno no se puede volver a correr igual del otro lado. Llegan como
    // array (una por línea), pero aceptamos también un string por las dudas.
    const entradas = recortar(
      Array.isArray(datos.entradas) ? datos.entradas.join('\n') : datos.entradas,
      MAX_ENTRADAS,
    );
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
            ...(entradas
              ? [{ name: '⌨️ Lo que tecleó', value: '```\n' + sinCercos(entradas) + '\n```' }]
              : []),
            ...(leccion ? [{ name: 'Lección', value: leccion }] : []),
            ...(url ? [{ name: 'Link', value: url }] : []),
          ],
          timestamp: new Date().toISOString(),
        },
      ],
      // El código va aparte del embed: así Discord le da resaltado de Python.
      content: '```python\n' + sinCercos(codigo) + '\n```',
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
