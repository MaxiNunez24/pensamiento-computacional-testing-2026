/**
 * Una imagen como la imprime la térmica Q15: 384 puntos de ancho (57 mm) y solo negro.
 *
 * Los grises no existen en la térmica: o hay punto o no hay. Dos maneras de resolverlo:
 *   'tramado'  Floyd–Steinberg: el error de cada punto se reparte a los vecinos, y de lejos se ven
 *              grises. Para fotos, pinturas, lápiz.
 *   'lineas'   un umbral: blanco o negro, sin puntitos. Para historietas, grabados, pixel art, que ya
 *              son de trazo.
 * Lo usan /expo/foto/ (el celular de la impresora) y el operador del estudio de fotos.
 */

export type ModoTermica = 'tramado' | 'lineas';
export const ANCHO_TERMICA = 384;

export function aTermica(fuente: CanvasImageSource & { width: number; height: number }, modo: ModoTermica): HTMLCanvasElement {
  const ancho = ANCHO_TERMICA;
  const alto = Math.round((fuente.height * ancho) / fuente.width);
  const lienzo = document.createElement('canvas');
  lienzo.width = ancho;
  lienzo.height = alto;
  const c = lienzo.getContext('2d', { willReadFrequently: true })!;
  c.drawImage(fuente, 0, 0, ancho, alto);
  const datos = c.getImageData(0, 0, ancho, alto);
  const p = datos.data;

  // A gris, estirado para que lo más oscuro sea negro y lo más claro blanco (como autocontrast), y un
  // poco aclarado: la térmica imprime oscuro, y los fondos se llenaban de puntitos
  const gris = new Float32Array(ancho * alto);
  for (let i = 0; i < gris.length; i++) gris[i] = 0.299 * p[i * 4] + 0.587 * p[i * 4 + 1] + 0.114 * p[i * 4 + 2];
  const ordenados = Float32Array.from(gris).sort();
  const bajo = ordenados[Math.floor(ordenados.length * 0.01)];
  const alto99 = ordenados[Math.floor(ordenados.length * 0.99)];
  const rango = Math.max(1, alto99 - bajo);
  for (let i = 0; i < gris.length; i++) gris[i] = 255 * Math.pow(Math.min(1, Math.max(0, (gris[i] - bajo) / rango)), 0.75);

  for (let y = 0; y < alto; y++) {
    for (let x = 0; x < ancho; x++) {
      const i = y * ancho + x;
      const viejo = gris[i];
      const nuevo = viejo > (modo === 'lineas' ? 150 : 128) ? 255 : 0;
      gris[i] = nuevo;
      if (modo === 'tramado') {
        const error = viejo - nuevo;
        if (x + 1 < ancho) gris[i + 1] += (error * 7) / 16;
        if (y + 1 < alto) {
          if (x > 0) gris[i + ancho - 1] += (error * 3) / 16;
          gris[i + ancho] += (error * 5) / 16;
          if (x + 1 < ancho) gris[i + ancho + 1] += error / 16;
        }
      }
    }
  }
  for (let i = 0; i < gris.length; i++) {
    p[i * 4] = p[i * 4 + 1] = p[i * 4 + 2] = gris[i];
    p[i * 4 + 3] = 255;
  }
  c.putImageData(datos, 0, 0);
  return lienzo;
}
