// Arma folleto-preceptoras.pdf (A4) desde folleto-preceptoras.html, con el Chrome de Playwright
// que ya trae el motor de animaciones.
//     node armar-pdf.mjs
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const require = createRequire('D:/Dev/motor-animaciones/package.json');
const { chromium } = require('playwright');

const navegador = await chromium.launch({ channel: 'chrome' });
const pagina = await navegador.newPage();
await pagina.goto(pathToFileURL(resolve('folleto-preceptoras.html')).href, { waitUntil: 'load' });
await pagina.pdf({ path: 'folleto-preceptoras.pdf', format: 'A4', preferCSSPageSize: true, printBackground: true });
await pagina.screenshot({ path: process.argv[2] || 'folleto-preceptoras.png', fullPage: true });
await navegador.close();
console.log('ok: folleto-preceptoras.pdf');
