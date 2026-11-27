// Graba el tutorial de la encuesta 2027: abre la encuesta publicada, la completa sola con un "dedo"
// que muestra dónde tocar, y guarda los cuadros de la pantalla (CDP screencast) más los momentos de
// cada paso (pasos.json), que la composición de HyperFrames usa para los títulos.
//
//     node grabar.mjs              (la encuesta publicada)
//     node grabar.mjs http://localhost:4321/pensamiento-computacional-testing-2026/ejercicios/expo/encuesta/
//
// El envío NO llega al Worker: se intercepta y se contesta "ok", así el video no carga una
// respuesta falsa. Si algún paso no se puede hacer (un botón que no está, que no responde), el
// script falla: también sirve como prueba de que la encuesta se puede completar de punta a punta.
// Usa el Playwright del motor de animaciones (no se toca ese repo, solo se usa) y Chrome instalado.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire('D:/Dev/motor-animaciones/package.json');
const { chromium } = require('playwright');

const AQUI = dirname(fileURLToPath(import.meta.url));
const URL = process.argv[2] || 'https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/expo/encuesta/';
const CUADROS = join(AQUI, 'grabacion', 'cuadros');
// La pantalla que se ve en el video: angosta como un celular y no tan alta (la cámara la sigue).
// El screencast manda los cuadros al tamaño CSS (ignora la densidad), así que la ventana es grande
// y la página va con zoom: se arma como un celular de 390 px de ancho, pero se graba nítida.
const ANCHO = 390, ALTO = 585, ZOOM = 2.5;

rmSync(join(AQUI, 'grabacion'), { recursive: true, force: true });
mkdirSync(CUADROS, { recursive: true });

const navegador = await chromium.launch({ channel: 'chrome' });
const contexto = await navegador.newContext({
    viewport: { width: Math.round(ANCHO * ZOOM), height: Math.round(ALTO * ZOOM) },
    deviceScaleFactor: 1,
    locale: 'es-AR',
    colorScheme: 'dark',
});
const pagina = await contexto.newPage();

// El envío se contesta acá: nunca llega al Worker de verdad
let enviado = null;
await pagina.route('**/encuesta', async (ruta) => {
    if (ruta.request().method() !== 'POST') return ruta.continue();
    enviado = JSON.parse(ruta.request().postData() || '{}');
    await new Promise((r) => setTimeout(r, 600));   // que se alcance a ver "Enviando…"
    await ruta.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
});

await pagina.goto(URL, { waitUntil: 'networkidle' });
await pagina.addStyleTag({ content: `html { zoom: ${ZOOM}; }` });

// El dedo: un círculo que se mueve hasta donde se va a tocar y hace una onda al tocar
await pagina.addStyleTag({ content: `
    #dedo { position: fixed; z-index: 99999; left: 0; top: 0; width: 46px; height: 46px; margin: -23px 0 0 -23px;
            border-radius: 50%; background: rgb(255 255 255 / 0.35); border: 3px solid #fff;
            box-shadow: 0 4px 14px rgb(0 0 0 / 0.45); pointer-events: none; opacity: 0;
            transition: transform 0.55s cubic-bezier(.4,0,.2,1), opacity 0.25s; }
    #dedo.toca { animation: toca 0.35s ease-out; }
    @keyframes toca { 50% { scale: 0.75; background: rgb(255 255 255 / 0.7); } }
    .onda { position: fixed; z-index: 99998; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%;
            border: 3px solid #fff; pointer-events: none; animation: onda 0.5s ease-out forwards; }
    @keyframes onda { to { scale: 2.4; opacity: 0; } }
` });
await pagina.evaluate(() => {
    const d = document.createElement('div');
    d.id = 'dedo';
    d.style.transform = 'translate(300px, 480px)';
    document.body.append(d);
});

// ---------- La grabación ----------
const cdp = await contexto.newCDPSession(pagina);
const cuadros = [];
cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const n = cuadros.length;
    writeFileSync(join(CUADROS, `${String(n).padStart(5, '0')}.jpg`), Buffer.from(data, 'base64'));
    cuadros.push(metadata.timestamp);
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
});
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: Math.round(ANCHO * ZOOM), maxHeight: Math.round(ALTO * ZOOM), everyNthFrame: 1 });
const inicio = Date.now() / 1000;
const pasos = [];
// Con voz, cada paso dura por lo menos lo que dura su frase (minimos.json lo arma armar.py):
// { "agregar": { "min": 3.8, "antes": 1.6 } } = el paso dura 3,8 s como mínimo, y su toque
// principal espera 1,6 s (así cae cuando la voz dice "tocá…"). Sin el archivo, va a su ritmo.
const MINIMOS = existsSync(join(AQUI, 'minimos.json')) ? JSON.parse(readFileSync(join(AQUI, 'minimos.json'), 'utf-8')) : {};
async function paso(id) {
    const anterior = pasos.at(-1);
    if (anterior && MINIMOS[anterior.id]) {
        const falta = MINIMOS[anterior.id].min - (Date.now() / 1000 - inicio - anterior.t);
        if (falta > 0) await pagina.waitForTimeout(falta * 1000);
    }
    pasos.push({ id, t: Date.now() / 1000 - inicio });
}
async function antes(id) {
    const s = MINIMOS[id]?.antes || 0;
    if (s > 0) await pagina.waitForTimeout(s * 1000);
}
const espera = (ms) => pagina.waitForTimeout(ms);

// Mientras nada cambia en la pantalla, Chrome no manda cuadros: un pixel invisible que titila
// lo obliga a mandarlos seguido (así los tiempos de cada cuadro son exactos)
await pagina.evaluate(() => {
    const p = document.createElement('div');
    p.style.cssText = 'position:fixed;left:0;bottom:0;width:1px;height:1px;z-index:99999;pointer-events:none';
    document.body.append(p);
    let i = 0;
    const latir = () => { p.style.background = i++ % 2 ? 'rgb(0 0 0 / 0.01)' : 'rgb(0 0 0 / 0.02)'; requestAnimationFrame(latir); };
    latir();
});

async function llevarA(locator, bloque = 'center') {
    await locator.evaluate((el, b) => el.scrollIntoView({ block: b, behavior: 'smooth' }), bloque);
    await espera(750);
}
async function mostrarDedo(visible) {
    await pagina.evaluate((v) => { document.getElementById('dedo').style.opacity = v ? '1' : '0'; }, visible);
    await espera(250);
}
// Mueve el dedo hasta (x, y) de la pantalla y toca ahí. El dedo vive adentro de la página con zoom,
// así que su lugar va en px de la página (los de la pantalla divididos por el zoom)
async function tocarEn(x, y, pausa = 500) {
    const [px, py] = [x / ZOOM, y / ZOOM];
    await pagina.evaluate(([x, y]) => { document.getElementById('dedo').style.transform = `translate(${x}px, ${y}px)`; }, [px, py]);
    await espera(600);
    await pagina.evaluate(([x, y]) => {
        const d = document.getElementById('dedo');
        d.classList.remove('toca'); void d.offsetWidth; d.classList.add('toca');
        const o = document.createElement('div');
        o.className = 'onda';
        o.style.left = `${x}px`; o.style.top = `${y}px`;
        document.body.append(o);
        setTimeout(() => o.remove(), 600);
    }, [px, py]);
    await pagina.mouse.click(x, y);
    await espera(pausa);
}
async function tocar(locator, pausa = 500) {
    const caja = await locator.boundingBox();
    if (!caja) throw new Error('No encontré el elemento para tocar');
    await tocarEn(caja.x + caja.width / 2, caja.y + caja.height / 2, pausa);
}
// Toca la barra del día en una hora (el bloque se centra ahí)
async function tocarHora(hora) {
    const caja = await pagina.locator('[data-pista]').boundingBox();
    const x = caja.x + ((hora - 12) / 8) * caja.width;
    await tocarEn(x, caja.y + caja.height / 2, 700);
}
async function escribir(locator, texto) {
    await tocar(locator, 200);
    await locator.pressSequentially(texto, { delay: 85 });
    await espera(350);
}
const franja = () => pagina.locator('[data-franja]').textContent();

// 0 · La encuesta recién abierta
await paso('abrir');
await espera(2600);

// 1 · Los días
await paso('dias');
await llevarA(pagina.locator('.fichas'));
await mostrarDedo(true);
await tocar(pagina.locator('label.ficha', { hasText: 'Martes' }), 450);
await tocar(pagina.locator('label.ficha', { hasText: 'Jueves' }), 900);

// 2 · El horario: tocar la barra y ajustar con las flechitas
await paso('horario');
await llevarA(pagina.locator('.horarios .eleccion'));
await espera(900);
await antes('horario');
await tocarHora(15);
await paso('flechas');
await tocar(pagina.locator('[data-mover="1"]'), 450);
await tocar(pagina.locator('[data-mover="1"]'), 700);
console.log('primer horario:', await franja());

// 3 · Agregarlo
await paso('agregar');
await antes('agregar');
await tocar(pagina.locator('[data-agregar]'), 1200);

// 4 · Otro horario
await paso('otro');
await tocarHora(18.5);
console.log('segundo horario:', await franja());
await tocar(pagina.locator('[data-agregar]'), 600);
await llevarA(pagina.locator('[data-elegidos]'));
await espera(1300);

// 5 · Avisarle (opcional)
await paso('avisar');
await llevarA(pagina.locator('.avisar'));
await tocar(pagina.locator('[data-consentimiento]'), 600);
await escribir(pagina.locator('input[name="nombre"]'), 'María');
await escribir(pagina.locator('input[name="whatsapp"]'), '221 555 0000');
await espera(500);

// 6 · Enviar
await paso('enviar');
await llevarA(pagina.locator('[data-enviar]'));
await antes('enviar');
await tocar(pagina.locator('[data-enviar]'), 300);
await mostrarDedo(false);
await pagina.locator('[data-gracias]').waitFor({ state: 'visible', timeout: 5000 });
await paso('gracias');
await espera(3000);
await paso('fin');

await cdp.send('Page.stopScreencast');
await espera(300);
await navegador.close();

if (!enviado) throw new Error('La encuesta no llegó a enviarse');
if (enviado.dias.length !== 2 || enviado.horarios.length !== 2 || !enviado.consentimiento) {
    throw new Error(`Se envió algo distinto de lo esperado: ${JSON.stringify(enviado)}`);
}

// Los cuadros, con su momento (relativo al primero), y los pasos en ese mismo reloj
const t0 = cuadros[0];
writeFileSync(join(AQUI, 'grabacion', 'cuadros.json'), JSON.stringify(cuadros.map((t) => +(t - t0).toFixed(4))));
const corrimiento = inicio - t0;
writeFileSync(join(AQUI, 'grabacion', 'pasos.json'), JSON.stringify(pasos.map((p) => ({ id: p.id, t: +(p.t + corrimiento).toFixed(3) })), null, 2));
console.log(`${cuadros.length} cuadros, ${(cuadros.at(-1) - t0).toFixed(1)} s. Se envió:`, JSON.stringify(enviado));
