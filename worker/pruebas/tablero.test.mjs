/* Prueba el Worker del tablero y del foro de soluciones, con un KV falso. */
import fs from 'fs';
fs.copyFileSync(new URL('../tablero.js', import.meta.url), new URL('./.t.mjs', import.meta.url));
const mod = await import('./.t.mjs');

const KV = new Map();
const env = { TABLERO: { get: k => KV.get(k) ?? null, put: (k, v) => { KV.set(k, v); } } };
const O = 'https://maxinunez24.github.io';
const CLAVE = 'cfp401';

const pedir = (ruta, opciones = {}) => mod.default.fetch(
  new Request('https://x' + ruta, {
    headers: { Origin: O, 'Content-Type': 'application/json' },
    ...opciones,
  }), env);
const post = (ruta, cuerpo) => pedir(ruta, { method: 'POST', body: JSON.stringify(cuerpo) });

let fallos = 0;
const ok = (c, m, e = '') => { if (!c) fallos++; console.log((c ? '  ok  ' : ' FALLA') + '  ' + m + (e ? '  -> ' + e : '')); };

// ── TABLERO ──────────────────────────────────────────────────────────
let r = await pedir('/tablero');
let t = await r.json();
ok(t.tareas.length === 0 && t.version === 0, 'el tablero arranca vacio');

r = await post('/tablero', { clave: CLAVE, version: 0, tareas: [{ id: 'a', texto: 'Modelo Alumno', col: 'hacer' }] });
ok(r.status === 200, 'se puede guardar el tablero');

t = await (await pedir('/tablero')).json();
ok(t.tareas.length === 1 && t.version === 1, 'quedo guardado y subio la version');

r = await post('/tablero', { clave: 'otra', version: 1, tareas: [] });
ok(r.status === 403, 'sin la clave del curso no se puede escribir');

// dos personas moviendo a la vez: la segunda tiene que enterarse
r = await post('/tablero', { clave: CLAVE, version: 0, tareas: [{ id: 'b', texto: 'pisado', col: 'hacer' }] });
ok(r.status === 409, 'si alguien guardo antes, avisa en vez de pisar');
t = await (await pedir('/tablero')).json();
ok(t.tareas[0].texto === 'Modelo Alumno', 'y lo del primero sigue intacto');

// ── SOLUCIONES ANONIMAS ──────────────────────────────────────────────
const EJ = 'promedio';
await post('/soluciones?ejercicio=' + EJ, { clave: CLAVE, autor: 'aaa', codigo: 'return sum(n)/len(n)' });
await post('/soluciones?ejercicio=' + EJ, { clave: CLAVE, autor: 'bbb', codigo: 'total = 0\nfor x in n: total += x' });
let s = await (await pedir('/soluciones?ejercicio=' + EJ)).json();
ok(s.soluciones.length === 2, 'se publicaron dos soluciones');

const crudo = JSON.parse(KV.get('sol:' + EJ));
ok(!JSON.stringify(s).includes('aaa'), 'lo que se DEVUELVE no trae el identificador del autor');
ok(crudo.soluciones.every(x => !x.nombre && !x.codigoAlumno), 'y no se guarda ningun nombre');

// republicar reemplaza, no duplica
await post('/soluciones?ejercicio=' + EJ, { clave: CLAVE, autor: 'aaa', codigo: 'CORREGIDA' });
s = await (await pedir('/soluciones?ejercicio=' + EJ)).json();
ok(s.soluciones.length === 2, 'volver a publicar reemplaza, no duplica', s.soluciones.length + '');
ok(s.soluciones.some(x => x.codigo === 'CORREGIDA'), 'y queda la version corregida');

// ── VOTOS ────────────────────────────────────────────────────────────
const id1 = s.soluciones[0].id, id2 = s.soluciones[1].id;
await post('/voto?ejercicio=' + EJ, { clave: CLAVE, votante: 'v1', solucion: id1 });
await post('/voto?ejercicio=' + EJ, { clave: CLAVE, votante: 'v2', solucion: id1 });
s = await (await pedir('/soluciones?ejercicio=' + EJ)).json();
ok(s.soluciones.find(x => x.id === id1).votos === 2, 'se cuentan los votos');

// votar de nuevo CAMBIA el voto
await post('/voto?ejercicio=' + EJ, { clave: CLAVE, votante: 'v1', solucion: id2 });
s = await (await pedir('/soluciones?ejercicio=' + EJ)).json();
ok(s.soluciones.find(x => x.id === id1).votos === 1, 'votar de nuevo no suma otro voto');
ok(s.soluciones.find(x => x.id === id2).votos === 1, 'el voto se movio a la otra');
ok(!JSON.stringify(s).includes('v1'), 'nunca se devuelve quien voto');

// ── ELEGIR ───────────────────────────────────────────────────────────
await post('/elegir?ejercicio=' + EJ, { clave: CLAVE, solucion: id2 });
s = await (await pedir('/soluciones?ejercicio=' + EJ)).json();
ok(s.soluciones.filter(x => x.elegida).length === 1, 'queda UNA marcada como elegida');
ok(s.soluciones.find(x => x.id === id2).elegida, 'y es la que se eligio');

// ── ORIGEN ───────────────────────────────────────────────────────────
r = await mod.default.fetch(new Request('https://x/tablero', { headers: { Origin: 'https://malo.com' } }), env);
ok(r.status === 403, 'un origen ajeno no entra');

fs.unlinkSync(new URL('./.t.mjs', import.meta.url));
console.log(fallos ? '\n>>> ' + fallos + ' FALLAS' : '\n>>> tablero y foro en orden');
process.exit(fallos ? 1 : 0);
