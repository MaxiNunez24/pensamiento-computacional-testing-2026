// Las fotos con IA del stand: cómo dibuja una compu tu cara.
//
// Para la Expo CFP del 13/11/2026, y de puente al curso de Usuaria/o de IA generativa de 2027. Cuenta lo que hace
// el estudio de fotos (ComfyUI + InstantID, en la PC del stand) sin nombres técnicos: la compu
// encuentra tu cara y la resume en una "huella" de números; el estilo se pide con palabras; y la
// imagen nace del ruido en 4 pasos, guiada por las dos cosas. Todo en la PC: la foto no sale a
// internet.
//
// El ruido es un cuadro GRANDE a la derecha, con cara de QR gigante, que paso a paso se va
// volviendo la imagen: primero aparecen las manchas grandes (dónde va el casco, dónde la cara) y
// al final los detalles. Así trabaja de verdad este tipo de IA, y desde lejos se ve.
//
// Lo de adentro (el "mundo") se arma en coordenadas de 1600 × 900, como expo-siges.js: en ancho se
// ve entero; en angosto la cámara se acerca a la parte que se cuenta.

import { caja, texto, flecha, tabla, camara, contador, registrar, definirPieza, el, poner } from 'motor-animaciones';

// La "huella" de la cara: en la de verdad son 512 números; acá, los primeros
const HUELLA = [['0,12'], ['-0,53'], ['0,08'], ['0,91'], ['…']];
const PASOS = ['ruido', 'paso 1 de 4', 'paso 2 de 4', 'paso 3 de 4', 'paso 4 de 4: ¡listo!'];

// ---------------- El cuadro que pasa del ruido a la imagen ----------------
// Una pieza propia (el motor deja definirlas sin tocarlo): una grilla de N × N cuadraditos y una
// sola propiedad que se anima, `paso`, de 0 (ruido) a 4 (la imagen).
const N = 24;

// Un azar con semilla: el mismo ruido en cada vuelta (el motor es determinista)
function azar(semilla) {
    let s = semilla >>> 0;
    return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const COLOR = {
    espacio: hex('#0b1630'), estrella: hex('#fff3b0'),
    casco: hex('#e8edf3'), sombra: hex('#9aa7b8'), vidrio: hex('#8cc4f5'), brillo: hex('#e3f3ff'),
    piel: hex('#f0c29a'), pelo: hex('#5a3825'), ojo: hex('#1a1a1a'), boca: hex('#b5524a'),
    traje: hex('#dfe5ec'), naranja: hex('#f08a24'),
};

// La imagen final: vos de astronauta, dibujada con cuentas (círculos y elipses) para no escribir
// 576 colores a mano.
function astronauta() {
    const img = [];
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
            const cx = x + 0.5, cy = y + 0.5;
            const d = Math.hypot(cx - 12, cy - 10.5);
            const cara = ((cx - 12) / 4.6) ** 2 + ((cy - 11.3) / 5.6) ** 2 <= 1;
            let c = COLOR.espacio;
            if ([[2, 3], [20, 2], [3, 15], [21, 13], [18, 6], [5, 8]].some(([sx, sy]) => sx === x && sy === y)) c = COLOR.estrella;
            if (y >= 19 && Math.abs(cx - 12) <= 3 + (y - 19) * 1.6) c = y === 21 ? COLOR.naranja : COLOR.traje;
            if (d <= 9.6) c = (cx - 12) + (cy - 10.5) > 7 ? COLOR.sombra : COLOR.casco;
            if (d <= 7.4) {
                c = COLOR.vidrio;
                if (cara) c = cy < 8.2 ? COLOR.pelo : COLOR.piel;
                if ((x === 10 || x === 14) && y === 10) c = COLOR.ojo;
                if (y === 14 && x >= 11 && x <= 13) c = COLOR.boca;
                if ((x === 7 && (y === 7 || y === 8)) || (x === 8 && y === 6)) c = COLOR.brillo;
            }
            img.push(c);
        }
    }
    return img;
}

// La imagen "borrosa": cada bloque de b × b con su color promedio. Es lo que la IA tiene clarito
// en los primeros pasos: las manchas grandes.
function promedio(img, b) {
    const out = new Array(N * N);
    for (let by = 0; by < N; by += b) {
        for (let bx = 0; bx < N; bx += b) {
            const suma = [0, 0, 0];
            for (let y = by; y < by + b; y++) for (let x = bx; x < bx + b; x++) img[y * N + x].forEach((v, i) => (suma[i] += v));
            const c = suma.map((v) => v / (b * b));
            for (let y = by; y < by + b; y++) for (let x = bx; x < bx + b; x++) out[y * N + x] = c;
        }
    }
    return out;
}

// El ruido del comienzo, con cara de QR: blanco y negro al azar y los tres cuadrados de las esquinas
function ruidoQR() {
    const r = azar(401);
    const esquina = (x, y) => {
        for (const [ox, oy] of [[0, 0], [N - 7, 0], [0, N - 7]]) {
            const i = x - ox, j = y - oy;
            if (i >= 0 && i < 7 && j >= 0 && j < 7) {
                const borde = i === 0 || i === 6 || j === 0 || j === 6;
                const centro = i >= 2 && i <= 4 && j >= 2 && j <= 4;
                return borde || centro ? 1 : 0;
            }
        }
        return null;
    };
    const out = [];
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
            const e = esquina(x, y);
            const negro = e === null ? r() < 0.5 : e === 1;
            out.push(negro ? [17, 17, 17] : [245, 245, 245]);
        }
    }
    return out;
}

// Los 5 momentos: el ruido, y en cada paso la imagen más nítida con menos ruido encima
function estados() {
    const img = astronauta();
    const lista = [ruidoQR()];
    [[8, 0.6], [4, 0.35], [2, 0.15], [1, 0]].forEach(([b, ruido], k) => {
        const r = azar(1000 + k);
        lista.push(promedio(img, b).map((c) => {
            const n = (r() * 2 - 1) * 255 * ruido;
            return c.map((v) => Math.max(0, Math.min(255, v + n)));
        }));
    });
    return lista;
}

const mosaico = definirPieza({
    nombre: 'mosaico',
    predeterminados: { lado: 600, paso: 0 },
    crear(grupo) {
        const marco = el('rect', { fill: '#000', rx: 10 }, grupo);
        const celdas = [];
        for (let i = 0; i < N * N; i++) celdas.push(el('rect', { 'shape-rendering': 'crispEdges' }, grupo));
        return { marco, celdas, estados: estados() };
    },
    actualizar(partes, p) {
        const t = p.lado / N;
        const x0 = -p.lado / 2;
        poner(partes.marco, { x: x0 - 10, y: x0 - 10, width: p.lado + 20, height: p.lado + 20 });
        const paso = Math.max(0, Math.min(4, p.paso));
        const k = Math.min(3, Math.floor(paso));
        const f = paso - k;
        const a = partes.estados[k], b = partes.estados[k + 1];
        partes.celdas.forEach((celda, i) => {
            const c = a[i].map((v, j) => Math.round(v + (b[i][j] - v) * f));
            poner(celda, {
                x: x0 + (i % N) * t, y: x0 + Math.floor(i / N) * t, width: t + 0.5, height: t + 0.5,
                fill: `rgb(${c[0]},${c[1]},${c[2]})`,
            });
        });
    },
    tamano: (p) => ({ ancho: p.lado + 20, alto: p.lado + 20 }),
});

registrar('expo-fotos-ia', function (disposicion) {
    const angosta = disposicion.nombre === 'angosta';
    const W = angosta ? 640 : 1600;
    const H = angosta ? 1140 : 900;

    // ---------------- El mundo ----------------
    const enMundo = (fabrica, props) => fabrica({ dentro: 'cam', opacidad: 0, ...props });

    const mundo = {
        foto: enMundo(caja, { x: 250, y: 380, ancho: 260, alto: 300, icono: '🙂', tamanoIcono: 150, texto: 'tu foto', tamano: 26, relleno: 'papel', borde: 'texto' }),
        huellaTitulo: enMundo(texto, { x: 250, y: 600, texto: 'Tu "huella"', tamano: 26, peso: 700 }),
        huella: enMundo(tabla, {
            x: 250, y: 740, ancho: 200, altoFila: 40, tamano: 22,
            columnas: ['512 números'], anchos: [200], filas: HUELLA, filasVisibles: 0,
        }),
        estilo: enMundo(caja, { x: 640, y: 300, ancho: 440, alto: 120, icono: '💬', tamanoIcono: 36, texto: 'astronauta, casco, estrellas', tamano: 30, escrito: 0, borde: 'acento' }),
        estiloPie: enMundo(texto, { x: 640, y: 222, texto: 'el estilo, en palabras', tamano: 22, color: 'suave' }),
        cuenta: enMundo(contador, { x: 640, y: 440, valor: 0, sufijo: ' segundos', prefijo: '4 pasos · ', tamano: 34, peso: 700, color: 'acento' }),
        pc: enMundo(caja, { x: 640, y: 740, ancho: 340, alto: 110, icono: '🖥️', tamanoIcono: 40, texto: 'La PC del stand', tamano: 26 }),
        sinInternet: enMundo(texto, { x: 640, y: 830, texto: 'sin internet: tu foto no sale de acá', tamano: 22, color: 'suave' }),
        mosaico: enMundo(mosaico, { x: 1260, y: 490, lado: 580, escala: 0.92 }),
        pasoTexto: enMundo(texto, { x: 1260, y: 830, texto: PASOS[0], tamano: 32, peso: 800, color: 'acento' }),
    };
    // Los 5 puntos de la cara: ojos, nariz y las puntas de la boca
    [[-38, -40], [38, -40], [0, 0], [-34, 42], [34, 42]].forEach(([dx, dy], i) => {
        mundo['punto' + i] = enMundo(caja, { x: 250 + dx, y: 355 + dy, ancho: 20, alto: 20, radio: 10, relleno: 'acento', borde: 'acento', escala: 0.4 });
    });

    const flechas = {
        aHuella: flecha({ dentro: 'cam', desde: 'foto', hasta: 'huella', progreso: 0, color: 'acento' }),
        huellaGuia: flecha({ dentro: 'cam', desde: 'huella', hasta: 'mosaico', progreso: 0, color: 'acento', curvatura: -0.15, etiqueta: 'la cara' }),
        estiloGuia: flecha({ dentro: 'cam', desde: 'estilo', hasta: 'mosaico', progreso: 0, color: 'acento' }),
    };

    // ---------------- Lo que queda quieto en la pantalla ----------------
    const fijo = angosta
        ? {
            titulo: { x: 320, y: 50, tamano: 30, texto: '¿Cómo dibuja una compu\ntu cara?' },
            bajada: { x: 320, y: 128, tamano: 26 },
            cierre1: { x: 320, y: 470, tamano: 44, texto: 'Esto se aprende.' },
            cierre2: { x: 320, y: 620, tamano: 32, texto: 'Curso de Usuaria/o\nde IA generativa\nCFP 401 · 2027' },
            firma: { x: 320, y: 1060, tamano: 24, texto: 'Pensamiento Computacional y Testing\nCFP 401 Ensenada' },
        }
        : {
            titulo: { x: 800, y: 58, tamano: 44, texto: '¿Cómo dibuja una compu tu cara?' },
            bajada: { x: 800, y: 108, tamano: 28 },
            cierre1: { x: 800, y: 400, tamano: 76, texto: 'Esto se aprende.' },
            cierre2: { x: 800, y: 490, tamano: 40, texto: 'Curso de Usuaria/o de IA generativa · CFP 401 · 2027' },
            firma: { x: 800, y: 820, tamano: 26, texto: 'Pensamiento Computacional y Testing · CFP 401 Ensenada' },
        };
    const pantalla = {
        titulo: texto({ ...fijo.titulo, peso: 800, escrito: 0 }),
        bajada: texto({ ...fijo.bajada, texto: 'Tu cara', peso: 700, color: 'acento', opacidad: 0 }),
        cierre1: texto({ ...fijo.cierre1, peso: 800, opacidad: 0, escala: 0.94 }),
        cierre2: texto({ ...fijo.cierre2, color: 'acento', peso: 700, opacidad: 0 }),
        firma: texto({ ...fijo.firma, color: 'suave', opacidad: 0 }),
    };

    // ---------------- La cámara ----------------
    const arriba = angosta ? 170 : 140;
    const ventana = { x: W / 2, y: (arriba + H) / 2, ancho: W, alto: H - arriba };
    const TODO = [800, ventana.y, 1];
    const MIRAR = angosta
        ? {
            foto: [250, 520, 1.25],
            estilo: [640, 400, 1.0],
            ruido: [1260, 560, 0.98],
            todo: [800, 540, 0.4],
        }
        : { todo: TODO };
    const inicio = MIRAR.foto ?? TODO;
    const cam = camara({ ...ventana, mirarX: inicio[0], mirarY: inicio[1], zoom: inicio[2] });
    const mirar = (donde, en = '<', dur = 1.2) => {
        if (!MIRAR[donde]) return null;
        const [x, y, z] = MIRAR[donde];
        return { pieza: 'cam', a: { mirarX: x, mirarY: y, zoom: z }, dur, en, curva: 'suave' };
    };
    const aparecer = (ids, extra = {}) => ({ pieza: ids, a: { opacidad: 1 }, dur: 0.5, ...extra });
    const bajada = (nuevo) => [
        { pieza: 'bajada', a: { opacidad: 0 }, dur: 0.3 },
        { pieza: 'bajada', a: { texto: nuevo }, dur: 0 },
        { pieza: 'bajada', a: { opacidad: 1 }, dur: 0.4 },
    ];
    const leer = (subtitulo) => [{ espera: 'subtitulo' }, { espera: 0.4 }, { subtitulo, en: '>' }];
    // Un paso del ruido a la imagen: el cuadro cambia, el rótulo dice cuál va y el reloj avanza
    const paso = (k) => [
        { pieza: 'mosaico', a: { paso: k }, dur: 1.1, curva: 'suave' },
        { pieza: 'pasoTexto', a: { texto: PASOS[k] }, dur: 0, en: '<' },
        { pieza: 'cuenta', a: { valor: Math.round((9 * k) / 4) }, dur: 1.1, curva: 'lineal', en: '<' },
        { espera: 0.9 },
    ];

    const puntos = [0, 1, 2, 3, 4].map((i) => 'punto' + i);
    const todoElMundo = [...Object.keys(mundo), ...Object.keys(flechas)];

    const linea = [
        // ======== Tu cara ========
        { capitulo: 'Tu cara' },
        { pieza: 'titulo', a: { escrito: 1 }, dur: 1.3, curva: 'lineal' },
        { pieza: 'bajada', a: { opacidad: 1 }, dur: 0.5, en: '<0.7' },
        { subtitulo: 'Te sacás una foto en el stand.', en: 1 },
        aparecer('foto', { en: '<0.2' }),

        ...leer('Primero, la compu busca tu cara: los ojos, la nariz y la boca.'),
        { pieza: puntos, a: { opacidad: 1, escala: 1 }, dur: 0.35, escalonar: 0.25, curva: 'pasarse', en: '<0.4' },

        ...leer('Y la resume en una "huella": 512 números que son tu cara, y la de nadie más.'),
        { pieza: 'aHuella', a: { progreso: 1 }, dur: 0.8, en: '<0.4' },
        aparecer(['huellaTitulo', 'huella']),
        { pieza: 'huella', a: { filasVisibles: HUELLA.length }, dur: 1.6, curva: 'lineal' },

        // ======== El estilo ========
        { capitulo: 'El estilo' },
        ...bajada('El estilo'),
        mirar('estilo', '<'),
        { subtitulo: 'Después elegís un estilo. Se lo pide con palabras, como a una persona.', en: '<' },
        aparecer(['estilo', 'estiloPie'], { en: '<0.3' }),
        { pieza: 'estilo', a: { escrito: 1 }, dur: 1.6, curva: 'lineal' },

        // ======== Del ruido a la imagen ========
        { capitulo: 'Del ruido a la imagen' },
        ...bajada('Del ruido a la imagen'),
        mirar('ruido', '<'),
        { subtitulo: 'La imagen arranca siendo puro ruido: puntos al azar, como un QR gigante que no dice nada.', en: '<' },
        { pieza: ['mosaico', 'pasoTexto'], a: { opacidad: 1, escala: 1 }, dur: 0.7, curva: 'salir', en: '<0.3' },

        ...leer('En cada paso saca un poco de ruido, guiada por tu huella y por las palabras del estilo.'),
        { pieza: ['huellaGuia', 'estiloGuia'], a: { progreso: 1 }, dur: 0.9, en: '<0.4' },
        aparecer('cuenta', { en: '<' }),
        { espera: 0.6 },
        ...paso(1),
        ...paso(2),
        ...paso(3),
        ...paso(4),

        ...leer('Cuatro pasos y unos 9 segundos después: sos astronauta. Y te la llevás impresa.'),
        mirar('todo', '<', 1.2),
        aparecer(['pc', 'sinInternet'], { en: '<0.6' }),
        { espera: 'subtitulo' },
        { espera: 1.5 },

        // ======== Esto se aprende ========
        { capitulo: 'Esto se aprende' },
        { pieza: [...todoElMundo, 'bajada'], a: { opacidad: 0.1 }, dur: 0.8 },
        { pieza: 'cierre1', a: { opacidad: 1, escala: 1 }, dur: 0.7, curva: 'salir', en: '<0.4' },
        aparecer('cierre2', { en: '<0.6' }),
        aparecer('firma', { en: '<0.3' }),
        { espera: 6 },
        { pieza: [...todoElMundo, 'titulo', 'bajada', 'cierre1', 'cierre2', 'firma'], a: { opacidad: 0 }, dur: 1 },
    ].filter(Boolean);

    return {
        titulo: '¿Cómo dibuja una compu tu cara?',
        descripcion:
            'Te sacás una foto en el stand. La compu encuentra tu cara (los ojos, la nariz y la boca) y la resume en ' +
            'una huella de 512 números. Elegís un estilo, que se pide con palabras. La imagen arranca siendo ruido, ' +
            'como un QR gigante, y en cuatro pasos, guiada por tu huella y por el estilo, se va aclarando: primero las ' +
            'manchas grandes y al final los detalles, hasta que sos astronauta, en unos 9 segundos, en la PC del stand ' +
            'y sin internet. Esto se aprende en el curso de Usuaria/o de IA generativa del CFP 401 en 2027.',
        ancho: W,
        alto: H,
        pausaFinal: 0.6,
        lectura: 11,
        piezas: { cam, ...mundo, ...flechas, ...pantalla },
        linea,
    };
});
