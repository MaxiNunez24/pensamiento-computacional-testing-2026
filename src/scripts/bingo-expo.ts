/**
 * Lo que comparten las páginas del Bingo de la Expo (src/pages/expo/):
 *
 *   /expo/bingo/operador/  la notebook (pantalla privada): saca bolillas, valida y tira la moneda
 *   /expo/proyector/       la otra salida de la notebook → HDMI → proyector y lona
 *   /expo/bingo/           el cartón en el celular de quien juega (y el impreso, con ?imprimir)
 *
 * El operador y el proyector son dos ventanas de la MISMA notebook: se hablan con un
 * BroadcastChannel, sin internet. El operador manda el estado entero cada vez que algo cambia, y el
 * proyector solo lo dibuja; así, si se recarga una de las dos, se vuelven a poner de acuerdo solas.
 */

export const WORKER = (() => {
  let worker = 'https://catalogos.maxinunez434.workers.dev';
  // En desarrollo, ?worker=http://127.0.0.1:8790 usa uno local (y ?worker=no lo olvida).
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    try {
      const pedido = new URLSearchParams(location.search).get('worker');
      if (pedido === 'no') localStorage.removeItem('catalogos:worker');
      else if (pedido) localStorage.setItem('catalogos:worker', pedido);
      worker = localStorage.getItem('catalogos:worker') || worker;
    } catch {
      /* sin localStorage, el de producción */
    }
  }
  return worker;
})();

export interface Ganador {
  codigo: string;
  numeros: number[];
  /** Con qué bolilla completó (1 = la primera): el que completó antes, gana. */
  bolilla: number;
  /** Perdió un desempate: con 3 o más empatados, la moneda los va sacando de a uno. */
  fuera?: boolean;
}

export interface Moneda {
  /** Cambia en cada tirada: el proyector anima una vez por id. */
  id: number;
  modo: 'desempate' | 'libre';
  salio: 'cara' | 'cruz';
  /** Lo que se juega a cada lado: los códigos en el desempate, "Cara" y "Cruz" en el libre. */
  cara: string;
  cruz: string;
}

export interface Estado {
  ronda: string | null;
  tamano: string;
  sorteadas: number[];
  /** Cuándo salió la primera bolilla, en la hora del Worker: los cartones de después no valen. */
  inicio: number | null;
  ganadores: Ganador[];
  moneda: Moneda | null;
  /** Lo que dice la lona debajo del QR, para quien no tiene celular. */
  impreso: string;
  /** Por qué se juega esta ronda: lo dice la lona. */
  premio: string;
  /** Ronda con premio: los cartones salen solo de la caja (impresos) y la lona no muestra el QR. */
  soloCaja: boolean;
  /** Lo que dice la lona en una ronda con premio, en vez del QR. */
  precio: string;
  /**
   * La ronda que viene, ya reservada: la caja imprime sus cartones mientras se juega la actual.
   * Con "Ronda nueva", pasa a ser la actual tal cual (mismo código, tamaño y premio): si cambiara
   * algo, los cartones que ya se imprimieron dejarían de valer.
   */
  proxima: Proxima | null;
}

export interface Proxima {
  ronda: string;
  tamano: string;
  premio: string;
  soloCaja: boolean;
}

export const ESTADO_INICIAL: Estado = {
  ronda: null,
  tamano: '6-30',
  sorteadas: [],
  inicio: null,
  ganadores: [],
  moneda: null,
  impreso: '¿Sin celular? Pedí tu cartón impreso',
  premio: 'una foto con IA impresa',
  soloCaja: false,
  precio: 'Cartón $100 · 2 por $150',
  proxima: null,
};

/** Lo que viaja por el canal. */
export type Mensaje =
  | { tipo: 'estado'; estado: Estado }
  | { tipo: 'hola' }
  | { tipo: 'vista'; accion: 'anterior' | 'siguiente' | 'agrandar' | 'achicar' };

export const canal = new BroadcastChannel('expo-bingo');

/** La dirección del cartón de una ronda: es lo que lleva el QR. */
export function linkDeRonda(ronda: string, tamano: string, imprimir = false) {
  const url = new URL(import.meta.env.BASE_URL.replace(/\/$/, '') + '/expo/bingo/', location.origin);
  url.searchParams.set('r', ronda);
  url.searchParams.set('t', tamano);
  if (imprimir) url.searchParams.set('imprimir', '1');
  // En desarrollo, el celular también tiene que usar el Worker local
  if (WORKER !== 'https://catalogos.maxinunez434.workers.dev') url.searchParams.set('worker', WORKER);
  return url.href;
}

/**
 * El QR chiquito de cada cartón impreso: abre ESE cartón en el celular para marcarlo tocando.
 * Lleva todo en un solo parámetro (código, ronda, tamaño y números), así el celular no le pide
 * nada al Worker. Si alguien cambia los números, solo se engaña a sí mismo: al cantar Bingo, el
 * operador rearma el cartón desde el código, y el código está firmado.
 */
export function linkDePapel(codigo: string, ronda: string, tamano: string, numeros: number[]) {
  const url = new URL(import.meta.env.BASE_URL.replace(/\/$/, '') + '/expo/bingo/', location.origin);
  url.searchParams.set('p', [codigo, ronda, tamano, numeros.join('.')].join('_'));
  return url.href;
}

/** Lo contrario de linkDePapel: null si el parámetro no tiene la forma esperada. */
export function leerPapel(texto: string) {
  const [codigo, ronda, tamano, numeros] = texto.toUpperCase().split('_');
  if (!/^[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(codigo || '') || !/^[0-9A-Z]{4}$/.test(ronda || '')) return null;
  if (!/^\d+-\d+$/.test(tamano || '') || !/^\d+(\.\d+)*$/.test(numeros || '')) return null;
  return { codigo, ronda, tamano, numeros: numeros.split('.').map(Number) };
}

/** "6-30" → "6 números del 1 al 30" */
export function describirTamano(tamano: string) {
  const [cantidad, maximo] = tamano.split('-');
  return `${cantidad} números del 1 al ${maximo}`;
}

/** Las teclas de navegación del proyector: Ctrl + flechas. Las usan las dos ventanas. */
export function accionDeVista(evento: KeyboardEvent): Mensaje | null {
  if (!evento.ctrlKey || evento.altKey || evento.metaKey) return null;
  const acciones: Record<string, 'anterior' | 'siguiente' | 'agrandar' | 'achicar'> = {
    ArrowLeft: 'anterior',
    ArrowRight: 'siguiente',
    ArrowUp: 'agrandar',
    ArrowDown: 'achicar',
  };
  const accion = acciones[evento.key];
  return accion ? { tipo: 'vista', accion } : null;
}
