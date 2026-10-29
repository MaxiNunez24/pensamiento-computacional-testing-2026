// Los datos de la página de la Expo (src/pages/expo/). Corre al CONSTRUIR la
// página, no en el celular de quien la mira: por eso los QR salen como dibujos
// (SVG) metidos en la página, y no de un servicio de internet como en la clase
// de la vidriera. La Expo puede no tener wifi, y la notebook de la pantalla
// grande tiene que andar igual.
//
// La vidriera sale de vidriera.csv, con el MISMO formato que arman los alumnos
// en "La vidriera" (emprendimiento,rubro,emoji,link). Mientras esté vacía, se
// muestran los de ejemplo de la clase, marcados como ejemplo.
//
// Los juegos de los alumnos van en juegos.json, cuando los publiquen:
//     [{ "nombre": "Un dado", "emoji": "🎲", "descripcion": "…", "link": "https://…" }]

import QRCode from 'qrcode';
import vidrieraCsv from './vidriera.csv?raw';
import ejemploCsv from './vidriera-ejemplo.csv?raw';
import juegosJson from './juegos.json';

export interface Emprendimiento {
  emprendimiento: string;
  rubro: string;
  emoji: string;
  link: string;
}

export interface Juego {
  nombre: string;
  emoji: string;
  descripcion: string;
  link: string;
}

/** Una planilla CSV chica: una fila por renglón, con comillas si hace falta. */
function leerCsv(texto: string): Record<string, string>[] {
  const filas: string[][] = [];
  for (const renglon of texto.replace(/^﻿/, '').split(/\r?\n/)) {
    if (!renglon.trim()) continue;
    const celdas: string[] = [];
    let actual = '';
    let entreComillas = false;
    for (let i = 0; i < renglon.length; i++) {
      const c = renglon[i];
      if (entreComillas) {
        if (c === '"' && renglon[i + 1] === '"') { actual += '"'; i++; }
        else if (c === '"') entreComillas = false;
        else actual += c;
      } else if (c === '"') entreComillas = true;
      else if (c === ',') { celdas.push(actual); actual = ''; }
      else actual += c;
    }
    celdas.push(actual);
    filas.push(celdas.map((x) => x.trim()));
  }
  const [encabezado, ...resto] = filas;
  return resto.map((celdas) => Object.fromEntries((encabezado ?? []).map((col, i) => [col, celdas[i] ?? ''])));
}

/** Solo links de verdad: un `javascript:` en la planilla no puede terminar en un href. */
function esLink(texto: string) {
  return /^https?:\/\//i.test(texto);
}

function emprendimientos(texto: string): Emprendimiento[] {
  return leerCsv(texto)
    .filter((f) => f.emprendimiento && esLink(f.link))
    .map((f) => ({ emprendimiento: f.emprendimiento, rubro: f.rubro, emoji: f.emoji || '🛍️', link: f.link }));
}

const reales = emprendimientos(vidrieraCsv);
/** Si todavía no hay catálogos del curso, se muestran los de ejemplo (y se avisa). */
export const vidrieraDeEjemplo = reales.length === 0;
export const vidriera = vidrieraDeEjemplo ? emprendimientos(ejemploCsv) : reales;

export const juegos: Juego[] = (juegosJson as Juego[]).filter((j) => j.nombre && esLink(j.link));

/** El QR de un link, como SVG para meter en la página. */
export function qr(link: string): Promise<string> {
  return QRCode.toString(link, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#10131a', light: '#ffffff' },
  });
}

/** La dirección completa de una página del sitio (para los QR, que se escanean desde otro lado). */
export function direccion(sitio: URL | undefined, ruta: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return new URL(`${base}/${ruta}`, sitio ?? 'https://maxinunez24.github.io').href;
}
