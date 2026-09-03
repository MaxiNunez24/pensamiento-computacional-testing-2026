/* Prueba el Worker del cuestionario de relevamiento, con un KV falso.
 *
 * Lo que más se prueba acá es lo que NO tiene que pasar: que las respuestas se
 * puedan leer sin el secreto del profe. Es el único de los cuatro Workers que
 * guarda datos de personas reales. */
import fs from 'fs';
fs.copyFileSync(new URL('../cuestionario.js', import.meta.url), new URL('./.c.mjs', import.meta.url));
const mod = await import('./.c.mjs');

const KV = new Map();
const almacen = {
  get: k => KV.get(k) ?? null,
  put: (k, v) => { KV.set(k, v); },
  list: ({ prefix = '', limit = 1000 } = {}) => ({
    keys: [...KV.keys()].filter(k => k.startsWith(prefix)).slice(0, limit).map(name => ({ name })),
  }),
};
const SECRETO = 'el-secreto-del-profe';
const env = { CUESTIONARIO: almacen, CLAVE_DOCENTE: SECRETO };
const O = 'https://maxinunez24.github.io';
const CLAVE = 'cfp401';

// Ojo con el orden: `...opciones` va PRIMERO. Al revés, su `headers` pisaría
// el objeto entero y se perdería el Origin (que es lo que el Worker mira).
const pedir = (ruta, opciones = {}, e = env) => mod.default.fetch(
  new Request('https://x' + ruta, {
    ...opciones,
    headers: { Origin: O, 'Content-Type': 'application/json', ...(opciones.headers || {}) },
  }), e);
const post = (ruta, cuerpo) => pedir(ruta, { method: 'POST', body: JSON.stringify(cuerpo) });

let fallos = 0;
const ok = (c, m, e = '') => { if (!c) fallos++; console.log((c ? '  ok  ' : ' FALLA') + '  ' + m + (e ? '  -> ' + e : '')); };

// ── CONTESTAR ────────────────────────────────────────────────────────
let r = await post('/respuesta', {
  clave: CLAVE, id: 'abc123', rol: 'preceptoria', nombre: 'Una Preceptora',
  respuestas: { verbos: 'controlar, transcribir', reporta: 'a dirección' },
});
ok(r.status === 200, 'se puede contestar el cuestionario');

r = await post('/respuesta', { clave: 'otra', id: 'zzz', rol: 'direccion', respuestas: {} });
ok(r.status === 403, 'sin la clave del curso no se puede escribir');

r = await post('/respuesta', { clave: CLAVE, id: 'sinrol', rol: '', respuestas: {} });
ok(r.status === 400, 'el rol es obligatorio');

r = await post('/respuesta', { clave: CLAVE, id: '', rol: 'direccion', respuestas: {} });
ok(r.status === 400, 'sin id no se guarda');

// el nombre es OPCIONAL: se puede contestar sin decir quien es
r = await post('/respuesta', { clave: CLAVE, id: 'anonimo1', rol: 'auxiliares', respuestas: { verbos: 'preparar' } });
ok(r.status === 200, 'se puede contestar SIN poner el nombre');

// ── CORREGIR LO YA CONTESTADO ────────────────────────────────────────
let d = await (await pedir('/cuantas')).json();
ok(d.cuantas === 2, 'van dos respuestas');

r = await post('/respuesta', {
  clave: CLAVE, id: 'abc123', rol: 'preceptoria', nombre: 'Una Preceptora',
  respuestas: { verbos: 'controlar, transcribir, ordenar' },
});
ok((await r.json()).corregida === true, 'volver a enviar avisa que es una correccion');
d = await (await pedir('/cuantas')).json();
ok(d.cuantas === 2, 'y NO queda una respuesta duplicada');

const guardada = JSON.parse(KV.get('r:abc123'));
ok(guardada.respuestas.verbos.includes('ordenar'), 'quedo la version corregida');
ok(guardada.primera !== undefined && guardada.primera <= guardada.fecha,
   'se conserva cuando contesto la primera vez');

// ── LO IMPORTANTE: LEER ESTA CERRADO ─────────────────────────────────
r = await pedir('/respuestas');
ok(r.status === 401, 'sin el secreto del profe NO se leen las respuestas');

r = await pedir('/respuestas', { headers: { 'X-Clave': CLAVE } });
ok(r.status === 401, 'la clave del curso NO alcanza para leer (esa es publica)');

r = await pedir('/respuestas', { headers: { 'X-Clave': 'probando' } });
ok(r.status === 401, 'una clave equivocada tampoco entra');

// y si el secreto no esta configurado en Cloudflare, falla CERRADO
r = await pedir('/respuestas', { headers: { 'X-Clave': SECRETO } }, { CUESTIONARIO: almacen });
ok(r.status === 503, 'sin CLAVE_DOCENTE configurada no se lee nada (falla cerrado)');

r = await pedir('/respuestas', { headers: { 'X-Clave': SECRETO } });
ok(r.status === 200, 'con el secreto correcto si');
d = await r.json();
ok(d.respuestas.length === 2, 'y vienen las dos respuestas');
ok(d.respuestas[0].id === 'abc123', 'ordenadas por quien contesto primero');

// ── /cuantas NO filtra contenido ─────────────────────────────────────
const soloElNumero = await (await pedir('/cuantas')).text();
ok(!soloElNumero.includes('Preceptora'), '/cuantas no deja escapar ningun nombre');
ok(!soloElNumero.includes('controlar'), '/cuantas no deja escapar ninguna respuesta');
ok(!soloElNumero.includes('preceptoria'), '/cuantas no deja escapar ningun rol');

// ── TOPES ────────────────────────────────────────────────────────────
r = await post('/respuesta', {
  clave: CLAVE, id: 'largo', rol: 'otro', respuestas: { verbos: 'x'.repeat(9000) },
});
ok(r.status === 200, 'una respuesta larguisima entra igual');
ok(JSON.parse(KV.get('r:largo')).respuestas.verbos.length === 4000, 'pero recortada');

// ── ORIGEN ───────────────────────────────────────────────────────────
r = await mod.default.fetch(new Request('https://x/cuantas', { headers: { Origin: 'https://malo.com' } }), env);
ok(r.status === 403, 'un origen ajeno no entra');

fs.unlinkSync(new URL('./.c.mjs', import.meta.url));
console.log(fallos ? '\n>>> ' + fallos + ' FALLAS' : '\n>>> cuestionario en orden');
process.exit(fallos ? 1 : 0);
