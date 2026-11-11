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

/**
 * El pie de cada impresión del stand: La Gráfica donó el papel térmico, y se le prometió su marca
 * al pie de todo lo que sale por la Q15 (las fotos y los cartones del Bingo). Un solo renglón, para
 * gastar poco papel: "Impreso gracias a", la G del logo y "LA GRÁFICA". Devuelve un lienzo nuevo,
 * con la imagen arriba y el pie abajo, separado por una línea.
 */
const LOGO = import.meta.env.BASE_URL.replace(/\/$/, '') + '/expo/sponsors/la-grafica.png';
// La G sola, sin el nombre de abajo (medido en el PNG de 600 x 448): el nombre va escrito, que en
// chiquito se lee mejor que el del logo
const G = { x: 131, y: 12, ancho: 338, alto: 327 };
let gNegra: Promise<HTMLCanvasElement | null> | null = null;

// El logo es de colores: en la térmica, todo lo que no es blanco va negro. Quedan los cortes blancos
// entre los gajos de la G, así que se sigue reconociendo.
function cargarG(alto: number) {
    gNegra ??= new Promise((listo) => {
        const img = new Image();
        img.onload = () => {
            const ancho = Math.round((G.ancho * alto) / G.alto);
            const lienzo = document.createElement('canvas');
            lienzo.width = ancho;
            lienzo.height = alto;
            const c = lienzo.getContext('2d', { willReadFrequently: true })!;
            c.fillStyle = '#fff';
            c.fillRect(0, 0, ancho, alto);
            c.drawImage(img, G.x, G.y, G.ancho, G.alto, 0, 0, ancho, alto);
            const datos = c.getImageData(0, 0, ancho, alto);
            const p = datos.data;
            for (let i = 0; i < p.length; i += 4) {
                const v = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2] > 215 ? 255 : 0;
                p[i] = p[i + 1] = p[i + 2] = v;
                p[i + 3] = 255;
            }
            c.putImageData(datos, 0, 0);
            listo(lienzo);
        };
        img.onerror = () => listo(null); // sin el logo, va solo el texto
        img.src = LOGO;
    });
    return gNegra;
}

export async function conPie(imagen: HTMLCanvasElement): Promise<HTMLCanvasElement> {
    const ALTO_G = 40;
    const alto = ALTO_G + 22;
    const g = await cargarG(ALTO_G);
    const lienzo = document.createElement('canvas');
    lienzo.width = imagen.width;
    lienzo.height = imagen.height + alto;
    const c = lienzo.getContext('2d')!;
    c.fillStyle = '#fff';
    c.fillRect(0, 0, lienzo.width, lienzo.height);
    c.drawImage(imagen, 0, 0);
    c.fillStyle = '#000';
    c.fillRect(40, imagen.height + 6, lienzo.width - 80, 2);
    const medio = imagen.height + 8 + (alto - 8) / 2;
    c.textBaseline = 'middle';
    c.textAlign = 'left';
    // "Impreso gracias a", la G y "LA GRÁFICA", en un renglón centrado
    const texto = 'Impreso gracias a';
    const marca = 'LA GRÁFICA';
    c.font = '600 18px system-ui, sans-serif';
    const anchoTexto = c.measureText(texto + ' ').width;
    c.font = '800 22px system-ui, sans-serif';
    const anchoMarca = c.measureText(marca).width;
    const anchoG = g ? g.width + 6 : 0;
    let x = Math.round((lienzo.width - (anchoTexto + anchoG + anchoMarca)) / 2);
    c.font = '600 18px system-ui, sans-serif';
    c.fillText(texto, x, medio);
    x += anchoTexto;
    if (g) {
        c.drawImage(g, x, Math.round(medio - g.height / 2));
        x += anchoG;
    }
    c.font = '800 22px system-ui, sans-serif';
    c.fillText(marca, x, medio + 1);
    return lienzo;
}
