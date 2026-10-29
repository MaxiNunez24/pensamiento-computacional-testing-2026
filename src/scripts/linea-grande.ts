// La línea que corre, GRANDE: una franja debajo de la escena de desdeTraza con
// un espejo rectangular (una pieza del motor) que mira solo esa línea, lo más
// agrandada que entre, y la sigue paso a paso.
//
// El código queda entero y chico arriba (que se vea todo el programa), y lo que
// importa en cada momento se lee abajo, desde el fondo del aula. En el código,
// un recuadro punteado marca qué parte se está mirando.
//
//     registrar('x', conLineaGrande(desdeTraza({ ...traza })));
//
// Se arma afuera de desdeTraza, sin tocar el motor: se agrega la pieza, se
// agranda el alto de la escena, y por cada vez que la marca del código cambia
// de línea, el espejo se mueve con ella (mismo instante, misma duración).

import { espejo, lineaDeCodigo } from 'motor-animaciones';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Escena = any;
type Disposicion = { nombre: string; ancho?: number };
type Armar = (d: Disposicion) => Escena;

const ANCHO_MONO = 0.6; // el de la pieza codigo del motor

/** Hasta qué y llega el dibujo, en su momento más alto. */
function hastaDondeLlega(escena: Escena): number {
  let fondo = 0;
  for (const [id, pieza] of Object.entries<Escena>(escena.piezas)) {
    const { tipo, props } = pieza;
    if (id === 'titulo' || props.dentro != null || tipo.nombre === 'flecha') continue;
    if (tipo.nombre === 'pila') {
      // La pila tiene `y` en su borde de arriba, y crece con cada llamada.
      const estados = [props.marcos, ...escena.linea
        .filter((paso: Escena) => paso.pieza === id && paso.a?.marcos)
        .map((paso: Escena) => paso.a.marcos)];
      const alto = Math.max(...estados.map((marcos: unknown) => tipo.tamano({ ...props, marcos }).alto));
      fondo = Math.max(fondo, props.y + alto);
      continue;
    }
    // `tamano` es la letra, no el alto: en la caja del error (96 de alto, letra
    // de 34) la franja quedaba encima del cartel rojo. Primero el alto.
    const alto = tipo.tamano?.(props).alto ?? props.alto ?? props.tamano ?? 0;
    // Como en desdeTraza: las listas llevan los índices y la flechita abajo.
    fondo = Math.max(fondo, props.y + alto / 2 + 40);
  }
  return fondo;
}

export function conLineaGrande(armar: Armar): Armar {
  return (d) => {
    const escena = armar(d);
    const cod = escena.piezas?.codigo;
    // Con la lupa de cámara el código se mueve: no se combina con esto.
    if (!cod || cod.props.dentro) return escena;
    const p = cod.props;
    const lineas = String(p.codigo).replace(/\n$/, '').split('\n');
    const angosta = d.nombre === 'angosta';
    const ancho = escena.ancho - (angosta ? 30 : 60);
    const alto = angosta ? 110 : 130;
    const caracter = p.tamano * ANCHO_MONO;
    // Donde empieza el texto, después de los números de línea (como en el motor).
    const xTexto = p.x - p.ancho / 2 + 16 + 2 * p.tamano * ANCHO_MONO + p.tamano * 0.9;

    const mirar = (k: number) => {
      const texto = lineas[k - 1] ?? '';
      const sangria = texto.length - texto.trimStart().length;
      const largo = Math.max(texto.trim().length, 1);
      const enLinea = lineaDeCodigo(cod, k);
      // Lo más grande posible: la línea entera a lo ancho, y que no se pase de alto.
      const zoom = Math.max(1, Math.min((ancho - 48) / (largo * caracter), alto / enLinea.alto));
      const desde = xTexto + sangria * caracter - 24 / zoom;
      // La ventana, del alto de UNA línea: si no, se asoma media de la de arriba.
      return { mirarX: desde + ancho / (2 * zoom), mirarY: enLinea.y, zoom, alto: enLinea.alto * zoom };
    };

    // La franja va justo debajo de lo que hay, y no debajo de los 900 de la
    // escena: con un programa corto, desdeTraza deja la mitad de abajo vacía.
    // Lo que crece (la pila) se mide en su momento más alto. En angosto no se
    // toca: ahí la consola va pegada abajo a propósito.
    // Sin tope en el alto de la escena: el cartel de un error puede caer más
    // abajo de los 900 (el motor lo ubica debajo de la consola), y ahí se
    // recortaba. Así la escena crece y lo muestra entero, con la franja debajo.
    const fondo = angosta ? escena.alto : hastaDondeLlega(escena);
    const y0 = Number.isFinite(fondo) ? fondo : escena.alto;

    escena.piezas.lineaGrande = espejo({
      fuente: 'codigo',
      x: escena.ancho / 2,
      y: y0 + 10 + alto / 2,
      ancho,
      forma: 'rect',
      radio: 10,
      marco: true,
      arrastrable: false,
      sombra: false,
      ...mirar(p.linea || 1),
    });
    escena.alto = y0 + alto + 30;

    const movidas = (escena.linea as Escena[])
      .filter((paso) => paso.pieza === 'codigo' && paso.a?.linea > 0)
      .map((paso) => ({ pieza: 'lineaGrande', a: mirar(paso.a.linea), dur: paso.dur, en: paso.en }));
    // Cuando el programa termina, la marca del código se apaga: la franja se atenúa.
    const apagadas = (escena.linea as Escena[])
      .filter((paso) => paso.pieza === 'codigo' && paso.a?.marca !== undefined)
      .map((paso) => ({ pieza: 'lineaGrande', a: { opacidad: paso.a.marca ? 1 : 0.35 }, dur: paso.dur, en: paso.en }));
    escena.linea.push(...movidas, ...apagadas);
    return escena;
  };
}
