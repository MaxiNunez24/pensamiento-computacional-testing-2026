// Capturas de una lección de verdad para el giro del video ("las clases son así"), en tamaño celular:
//   hf/assets/leccion-animacion.png  la animación del motor "¿Quién llama a quién?", andando
//   hf/assets/leccion-ejercicio.png  "Una tarjeta, armada por Python", resuelto y con la tarjeta a la vista
//     node capturar-leccion.mjs            (o con --botones para ver los botones de la animación)
// Usa el Playwright que ya trae el motor de animaciones, sin modificarlo.
import { createRequire } from 'node:module';

const require = createRequire('D:/Dev/motor-animaciones/package.json');
const { chromium } = require('playwright');

const URL = 'https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/web/catalogo/';
const SOLUCION = `def tarjeta(producto):
    return f"""
<article class="producto">
    <div class="producto__foto">{producto["emoji"]}</div>
    <h2>{producto["nombre"]}</h2>
    <p class="descripcion">{producto["descripcion"]}</p>
    <p class="precio">$ {producto["precio"]}</p>
</article>
"""

print(tarjeta({"nombre": "Mate de calabaza", "precio": "7800", "emoji": "🧉", "descripcion": "Curado y listo para usar."}))
`;

const navegador = await chromium.launch({ channel: 'chrome' });
const contexto = await navegador.newContext({
    // Alta, para que el ejercicio entre entero: si la foto es más alta que la ventana, las barras fijas de
    // la página aparecen pegadas en el medio
    viewport: { width: 390, height: 2000 }, deviceScaleFactor: 3, colorScheme: 'dark', isMobile: true, hasTouch: true,
});
const pagina = await contexto.newPage();
await pagina.goto(URL, { waitUntil: 'load', timeout: 90000 });
await pagina.waitForTimeout(3000);
const bloque = (titulo) => pagina.locator('.ejercicio', { has: pagina.locator('.ejercicio__titulo', { hasText: titulo }) }).first();

// ---- La animación: play, y la foto cuando ya está andando (solo con --animacion) ----
if (process.argv.includes('--animacion')) {
const anim = bloque('¿Quién llama a quién?');
await anim.scrollIntoViewIfNeeded();
await pagina.waitForTimeout(1500);
const botones = anim.locator('button');
if (process.argv.includes('--botones')) {
    for (const b of await botones.all()) console.log(JSON.stringify([await b.getAttribute('aria-label'), await b.getAttribute('title'), (await b.textContent()).trim()]));
}
const play = anim.locator('button[aria-label*="eproduc"], button[title*="eproduc"], button[aria-label*="Play"]').first();
if (await play.count()) await play.click();
await pagina.waitForTimeout(6000);
await anim.screenshot({ path: 'hf/assets/leccion-animacion.png' });
console.log('ok: hf/assets/leccion-animacion.png');
}

// ---- El ejercicio: la solución, ejecutar (para que aparezca la tarjeta) y verificar ----
const ej = bloque('Una tarjeta, armada por Python');
await ej.scrollIntoViewIfNeeded();
await ej.locator('.cm-content').click();
await pagina.keyboard.press('Control+A');
await pagina.keyboard.insertText(SOLUCION);
await ej.locator('[data-run]').click();
await pagina.waitForTimeout(1500);
await ej.locator('[data-verify]').click();
await ej.locator('.ej-hecho').waitFor({ state: 'visible', timeout: 90000 });
await ej.locator('[data-run]').click();
await pagina.waitForTimeout(2500);
const aviso = ej.locator('[data-aviso-cerrar]');
if (await aviso.isVisible()) await aviso.click();
const teclas = ej.locator('[data-toggle-teclas]');
if ((await teclas.getAttribute('aria-pressed')) === 'true') await teclas.click();
// El código desde el principio de cada renglón, y sin la barra fija de arriba (en una foto más alta
// que la pantalla, aparece pegada en el medio)
await ej.locator('.cm-content').click();
await pagina.keyboard.press('Control+Home');
await pagina.addStyleTag({ content: '.cm-cursor { display: none !important; }' });
await pagina.evaluate(() => document.querySelectorAll('.cm-scroller').forEach((e) => { e.scrollLeft = 0; }));
await ej.evaluate((e) => e.scrollIntoView({ block: 'end' }));
await pagina.waitForTimeout(800);
await ej.screenshot({ path: 'hf/assets/leccion-ejercicio.png' });
console.log('ok: hf/assets/leccion-ejercicio.png');
await navegador.close();
