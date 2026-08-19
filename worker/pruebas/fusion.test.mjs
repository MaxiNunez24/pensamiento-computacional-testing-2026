/* Prueba la fusión por fecha del Worker con los casos que importan,
   incluido el escenario exacto del alumno. */
import fs from 'fs';
fs.copyFileSync(new URL('../sync-progreso.js', import.meta.url), new URL('./.w.mjs', import.meta.url));
const mod = await import('./.w.mjs');

const KV = new Map();
let escrituras = 0;
const env = { PROGRESO: {
  get: k => KV.get(k) ?? null,
  put: (k, v) => { escrituras++; KV.set(k, v); },
}};
const O = 'https://maxinunez24.github.io';
const push = (codigo, claves) => mod.default.fetch(new Request('https://x/?codigo=' + codigo, {
  method: 'POST', headers: { Origin: O, 'Content-Type': 'application/json' },
  body: JSON.stringify({ claves }) }), env);
const leer = async codigo => {
  const r = await mod.default.fetch(new Request('https://x/?codigo=' + codigo, { headers: { Origin: O } }), env);
  return (await r.json()).claves;
};

let fallos = 0;
const ok = (c, m, e = '') => { if (!c) fallos++; console.log((c ? '  ok  ' : ' FALLA') + '  ' + m + (e ? '  -> ' + e : '')); };

const T = (h) => `2026-08-2${h}T10:00:00.000Z`;
const ej = (nombre, code, ts) => ({
  [`pcp:code:/x/::${nombre}`]: code,
  ...(ts ? { [`pcp:ts:/x/::${nombre}`]: ts } : {}),
});

// ── 1. El caso del alumno: CFP mas nuevo, casa mas vieja ──
await push('rodo', { ...ej('A', 'version del CFP', T(1)), ...ej('B', 'solo CFP', T(1)) });
await push('rodo', { ...ej('A', 'version vieja de casa', T(0)), ...ej('C', 'solo casa', T(0)) });
let n = await leer('rodo');
ok(n['pcp:code:/x/::A'] === 'version del CFP', 'gana la ULTIMA edicion, no la que llega ultima', n['pcp:code:/x/::A']);
ok(n['pcp:code:/x/::B'] === 'solo CFP', 'lo que solo estaba en el CFP se conserva');
ok(n['pcp:code:/x/::C'] === 'solo casa', 'lo que solo estaba en casa se agrega');

// ── 2. Al reves: si en casa es mas nuevo, gana casa ──
await push('rodo', ej('A', 'casa despues', T(2)));
n = await leer('rodo');
ok(n['pcp:code:/x/::A'] === 'casa despues', 'si la otra compu edito despues, esa gana');
ok(n['pcp:ts:/x/::A'] === T(2), 'la fecha guardada es la mayor');

// ── 3. Sin fechas (datos viejos): gana el que SI tiene fecha ──
await push('legacy', { 'pcp:code:/x/::D': 'sin fecha' });
await push('legacy', ej('D', 'con fecha', T(1)));
ok((await leer('legacy'))['pcp:code:/x/::D'] === 'con fecha', 'con fecha le gana a sin fecha');

// ── 4. Un "resuelto" nunca se pierde ──
await push('rodo', { 'pcp:done:/x/::A': '1' });
await push('rodo', ej('A', 'otra edicion', T(3)));
ok((await leer('rodo'))['pcp:done:/x/::A'] === '1', 'el "resuelto" sobrevive a ediciones posteriores');

// ── 5. Push identico: no escribe ──
const antes = escrituras;
await push('rodo', ej('A', 'otra edicion', T(3)));
ok(escrituras === antes, 'un push sin cambios no gasta escrituras', 'escrituras: ' + (escrituras - antes));

// ── 6. Escenario completo del viernes ──
KV.clear();
const claseHoy = {}; for (let i = 1; i <= 76; i++) Object.assign(claseHoy, ej('Ej' + i, 'CFP', T(1)));
await push('rodo', claseHoy);
const enCasa = { ...ej('Ej1', 'mejorado en casa', T(2)), ...ej('EjNuevo', 'hecho en casa', T(2)) };
await push('rodo', enCasa);
n = await leer('rodo');
const codes = Object.keys(n).filter(k => k.startsWith('pcp:code:'));
ok(codes.length === 77, 'quedan los 76 del CFP + 1 de casa', codes.length + '');
ok(n['pcp:code:/x/::Ej1'] === 'mejorado en casa', 'el que mejoro en casa queda en su version nueva');
ok(n['pcp:code:/x/::Ej76'] === 'CFP', 'y el ultimo de la clase sigue intacto');

fs.unlinkSync(new URL('./.w.mjs', import.meta.url));
console.log(fallos ? '\n>>> ' + fallos + ' FALLAS' : '\n>>> fusion correcta');
process.exit(fallos ? 1 : 0);
