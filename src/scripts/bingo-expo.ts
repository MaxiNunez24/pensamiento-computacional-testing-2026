/**
 * Lo que comparten las páginas del Bingo de la Expo (src/pages/expo/):
 *
 *   /expo/bingo/operador/  la notebook (pantalla privada): saca bolillas, valida y tira la moneda
 *   /expo/proyector/       la otra salida de la notebook → divisor HDMI → lona + monitor
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
}

export const ESTADO_INICIAL: Estado = {
  ronda: null,
  tamano: '6-30',
  sorteadas: [],
  inicio: null,
  ganadores: [],
  moneda: null,
  impreso: '¿Sin celular? Pedí tu cartón impreso',
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
