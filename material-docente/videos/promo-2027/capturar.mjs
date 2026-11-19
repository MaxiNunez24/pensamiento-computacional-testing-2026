// Capturas en tamaño celular de las páginas que muestra el video (catálogos y el curso).
// Usa el Playwright que ya trae el motor de animaciones, sin modificarlo.
//     node capturar.mjs
import { createRequire } from 'node:module';
import { mkdirSync, existsSync, readFileSync } from 'node:fs';

const require = createRequire('D:/Dev/motor-animaciones/package.json');
const { chromium } = require('playwright');

const PAGINAS = [
    ['catalogos', 'https://cfp401-ensenada.github.io/catalogos/'],
    ['catalogo-prueba', 'https://cfp401-ensenada.github.io/catalogos/prueba/'],
    ['curso-camino', 'https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/camino/'],
    ['curso-sqlite', 'https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/clases/sqlite/#ej-agregar-un-alumno'],
    // Los catálogos de los alumnos están en sus cuentas de GitHub: el usuario suele ser su nombre, así
    // que la lista va en trabajos.local.json, que no se sube ([["trabajo-x", "https://..."], ...]).
    ...(existsSync('trabajos.local.json') ? JSON.parse(readFileSync('trabajos.local.json', 'utf8')) : []),
];
// Con nombres, captura solo esas: node capturar.mjs trabajo-bambu trabajo-yummi
const pedidas = process.argv.slice(2);

mkdirSync('hf/assets', { recursive: true });
const navegador = await chromium.launch({ channel: 'chrome' });
const contexto = await navegador.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    colorScheme: 'dark',
    isMobile: true,
    hasTouch: true,
});
for (const [nombre, url] of PAGINAS.filter(([n]) => !pedidas.length || pedidas.includes(n))) {
    const pagina = await contexto.newPage();
    await pagina.goto(url, { waitUntil: 'networkidle' });
    await pagina.waitForTimeout(2500);
    await pagina.screenshot({ path: `hf/assets/${nombre}.png`, fullPage: true });
    console.log('ok', nombre);
    await pagina.close();
}
await navegador.close();
