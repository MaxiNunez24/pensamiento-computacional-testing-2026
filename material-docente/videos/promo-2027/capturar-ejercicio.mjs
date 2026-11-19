// Captura un ejercicio de Python de la plataforma YA RESUELTO (en tamaño celular), para el video:
// abre la lección publicada, escribe la solución, verifica y saca la foto con los tests en verde.
//     node capturar-ejercicio.mjs
// Usa el Playwright que ya trae el motor de animaciones, sin modificarlo.
import { createRequire } from 'node:module';

const require = createRequire('D:/Dev/motor-animaciones/package.json');
const { chromium } = require('playwright');

const URL = 'https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/clases/funciones-1/';
const TITULO = 'Tu primera función';
const SOLUCION = 'def saludar(nombre):\n    return f"¡Hola, {nombre}!"\n\nprint(saludar("Ana"))';

const navegador = await chromium.launch({ channel: 'chrome' });
const contexto = await navegador.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, colorScheme: 'dark', isMobile: true, hasTouch: true,
});
const pagina = await contexto.newPage();
await pagina.goto(URL, { waitUntil: 'networkidle' });
const ejercicio = pagina.locator('.ejercicio', { has: pagina.locator('.ejercicio__titulo', { hasText: TITULO }) }).first();
await ejercicio.scrollIntoViewIfNeeded();

// La solución, de una (insertText no dispara la sangría automática del editor)
await ejercicio.locator('.cm-content').click();
await pagina.keyboard.press('Control+A');
await pagina.keyboard.insertText(SOLUCION);

// Ejecutar (para que se vea la salida) y verificar (los tests): la primera vez baja Python, tarda
await ejercicio.locator('[data-run]').click();
await pagina.waitForTimeout(1500);
await ejercicio.locator('[data-verify]').click();
await ejercicio.locator('.ej-hecho').waitFor({ state: 'visible', timeout: 90000 });
// Sin el aviso de la descarga ni el teclado de símbolos: que se vea el código y los tests
const aviso = ejercicio.locator('[data-aviso-cerrar]');
if (await aviso.isVisible()) await aviso.click();
const teclas = ejercicio.locator('[data-toggle-teclas]');
if ((await teclas.getAttribute('aria-pressed')) === 'true' || (await teclas.getAttribute('aria-expanded')) === 'true') await teclas.click();
await pagina.waitForTimeout(1200);
await ejercicio.screenshot({ path: 'hf/assets/ejercicio-resuelto.png' });
console.log('ok: hf/assets/ejercicio-resuelto.png');
await navegador.close();
