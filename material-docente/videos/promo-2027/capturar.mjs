// Capturas en tamaño celular de las páginas que muestra el video (catálogos y el curso).
// Usa el Playwright que ya trae el motor de animaciones, sin modificarlo.
//     node capturar.mjs
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';

const require = createRequire('D:/Dev/motor-animaciones/package.json');
const { chromium } = require('playwright');

const PAGINAS = [
    ['catalogos', 'https://cfp401-ensenada.github.io/catalogos/'],
    ['catalogo-prueba', 'https://cfp401-ensenada.github.io/catalogos/prueba/'],
    ['curso-camino', 'https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/camino/'],
    ['curso-sqlite', 'https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/clases/sqlite/#ej-agregar-un-alumno'],
];

mkdirSync('hf/assets', { recursive: true });
const navegador = await chromium.launch({ channel: 'chrome' });
const contexto = await navegador.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    colorScheme: 'dark',
    isMobile: true,
    hasTouch: true,
});
for (const [nombre, url] of PAGINAS) {
    const pagina = await contexto.newPage();
    await pagina.goto(url, { waitUntil: 'networkidle' });
    await pagina.waitForTimeout(2500);
    await pagina.screenshot({ path: `hf/assets/${nombre}.png`, fullPage: true });
    console.log('ok', nombre);
    await pagina.close();
}
await navegador.close();
