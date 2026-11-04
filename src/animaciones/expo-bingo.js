// El Bingo del stand: cómo sabe que tu cartón es tuyo (y que no hiciste trampa).
//
// Para la Expo CFP del 13/11/2026, al lado de la escena del sistema. Cuenta lo que hace
// src/scripts/bingo-cartones.js sin decir "HMAC": el servidor elige los números y les pone un
// sello con una clave secreta; el código del cartón lleva adentro un número al azar, la hora y el
// sello; y la notebook del stand, que tiene la misma clave, revisa todo sin internet.
//
// Lo de adentro (el "mundo") se arma en coordenadas de 1600 × 900, como expo-siges.js: en ancho se
// ve entero; en angosto la cámara se acerca a la parte que se cuenta.

import { caja, texto, flecha, celular, camara, contador, registrar } from 'motor-animaciones';

const MIOS = [3, 9, 14, 20, 25, 28];
const SALEN = [14, 3, 22, 9, 28, 5, 20, 25];
const CODIGO = 'T4DW-0KHA';

registrar('expo-bingo', function (disposicion) {
    const angosta = disposicion.nombre === 'angosta';
    const W = angosta ? 640 : 1600;
    const H = angosta ? 1140 : 900;

    // ---------------- El mundo ----------------
    const enMundo = (fabrica, props) => fabrica({ dentro: 'cam', opacidad: 0, ...props });
    const bolilla = (props) => caja({ ancho: 64, alto: 64, radio: 32, tamano: 28, relleno: 'acento', borde: 'acento', color: 'fondo', ...props });

    const mundo = {
        cel: enMundo(celular, { x: 290, y: 560, alto: 520, titulo: 'Bingo · Ronda K7Q2' }),
        servidor: enMundo(caja, { x: 800, y: 300, ancho: 300, alto: 130, icono: '☁️', tamanoIcono: 44, texto: 'El servidor', tamano: 28 }),
        clave: enMundo(caja, { x: 800, y: 430, ancho: 260, alto: 64, texto: '🔑 clave secreta', tamano: 24, relleno: 'papel', borde: 'alerta' }),
        codigo: enMundo(caja, { x: 800, y: 620, ancho: 420, alto: 96, texto: CODIGO, tamano: 52, borde: 'acento', escala: 0.9 }),
        azar: enMundo(caja, { x: 650, y: 735, ancho: 130, alto: 56, texto: '🎲 azar', tamano: 22, borde: 'suave' }),
        hora: enMundo(caja, { x: 800, y: 735, ancho: 130, alto: 56, texto: '🕒 hora', tamano: 22, borde: 'suave' }),
        sello: enMundo(caja, { x: 950, y: 735, ancho: 130, alto: 56, texto: '🔏 sello', tamano: 22, borde: 'alerta' }),
        trucho: enMundo(contador, { x: 800, y: 820, valor: 0, prefijo: 'Acertar un sello inventando: 1 en ', tamano: 26, color: 'suave' }),
        notebook: enMundo(caja, { x: 1300, y: 300, ancho: 340, alto: 130, icono: '💻', tamanoIcono: 44, texto: 'La notebook del stand', tamano: 26 }),
        salieron: enMundo(texto, { x: 1300, y: 420, texto: 'Salieron', tamano: 24, peso: 700, color: 'suave' }),
        bien: enMundo(caja, { x: 1300, y: 680, ancho: 400, alto: 110, texto: '✓ ¡Es Bingo!', tamano: 40, relleno: 'exito', borde: 'exito', color: 'fondo', escala: 0.9 }),
        tarde: enMundo(caja, { x: 1300, y: 800, ancho: 400, alto: 90, texto: '✗ Se pidió tarde: no vale', tamano: 26, relleno: 'error', borde: 'error', color: 'fondo', escala: 0.9 }),
    };
    // Los números del cartón, en el celular (tres por fila)
    MIOS.forEach((n, i) => {
        mundo['mio' + i] = bolilla({
            dentro: 'cel', x: 75 + (i % 3) * 105, y: 190 + Math.floor(i / 3) * 105, ancho: 84, alto: 84, radio: 42,
            texto: String(n), tamano: 34, relleno: 'fondo', borde: 'acento', color: 'texto', opacidad: 0,
        });
    });
    mundo.celCodigo = caja({ dentro: 'cel', x: 180, y: 470, ancho: 300, alto: 70, texto: CODIGO, tamano: 34, borde: 'acento', opacidad: 0 });
    mundo.celBingo = caja({ dentro: 'cel', x: 180, y: 580, ancho: 300, alto: 70, texto: '¡BINGO!', tamano: 34, relleno: 'acento', borde: 'acento', color: 'fondo', opacidad: 0 });
    // Las bolillas que van saliendo, en la notebook: dos filas de cuatro
    SALEN.forEach((n, i) => {
        mundo['sale' + i] = enMundo(bolilla, { x: 1150 + (i % 4) * 100, y: 480 + Math.floor(i / 4) * 80, texto: String(n), escala: 0.6 });
    });

    const flechas = {
        pide: flecha({ dentro: 'cam', desde: 'cel', hasta: 'servidor', progreso: 0, etiqueta: 'un cartón', curvatura: 0.15 }),
        da: flecha({ dentro: 'cam', desde: 'servidor', hasta: 'codigo', progreso: 0, color: 'acento' }),
        aCel: flecha({ dentro: 'cam', desde: 'codigo', hasta: 'cel', progreso: 0, color: 'acento', curvatura: 0.1, etiqueta: 'tus números' }),
        canta: flecha({ dentro: 'cam', desde: 'cel', hasta: 'notebook', progreso: 0, color: 'acento', curvatura: -0.38 }),
    };

    // ---------------- Lo que queda quieto en la pantalla ----------------
    const fijo = angosta
        ? {
            titulo: { x: 320, y: 50, tamano: 32, texto: 'El Bingo del stand' },
            bajada: { x: 320, y: 100, tamano: 26 },
            cierre1: { x: 320, y: 520, tamano: 52, texto: 'Nadie guarda\ntu cartón.' },
            cierre2: { x: 320, y: 680, tamano: 32, texto: 'El código ya\nlo dice todo.' },
            firma: { x: 320, y: 1060, tamano: 24, texto: 'Pensamiento Computacional y Testing\nCFP 401 Ensenada' },
        }
        : {
            titulo: { x: 800, y: 58, tamano: 44, texto: 'El Bingo del stand' },
            bajada: { x: 800, y: 108, tamano: 28 },
            cierre1: { x: 800, y: 400, tamano: 76, texto: 'Nadie guarda tu cartón.' },
            cierre2: { x: 800, y: 490, tamano: 38, texto: 'El código ya lo dice todo.' },
            firma: { x: 800, y: 820, tamano: 26, texto: 'Pensamiento Computacional y Testing · CFP 401 Ensenada' },
        };
    const pantalla = {
        titulo: texto({ ...fijo.titulo, peso: 800, escrito: 0 }),
        bajada: texto({ ...fijo.bajada, texto: 'Tu cartón', peso: 700, color: 'acento', opacidad: 0 }),
        cierre1: texto({ ...fijo.cierre1, peso: 800, opacidad: 0, escala: 0.94 }),
        cierre2: texto({ ...fijo.cierre2, color: 'suave', opacidad: 0 }),
        firma: texto({ ...fijo.firma, color: 'suave', opacidad: 0 }),
    };

    // ---------------- La cámara ----------------
    const ventana = { x: W / 2, y: (140 + H) / 2, ancho: W, alto: H - 140 };
    const TODO = [800, ventana.y, 1];
    const MIRAR = angosta
        ? {
            cel: [290, 560, 1.3],
            servidor: [800, 400, 1.2],
            codigo: [800, 700, 0.95],
            notebook: [1300, 470, 1.25],
            resultado: [1300, 720, 1.4],
            todo: [800, 520, 0.4],
        }
        : { todo: TODO };
    const inicio = MIRAR.cel ?? TODO;
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

    const mios = MIOS.map((_, i) => 'mio' + i);
    const salen = SALEN.map((_, i) => 'sale' + i);
    const todoElMundo = [...Object.keys(mundo), ...Object.keys(flechas)];

    const linea = [
        // ======== Tu cartón ========
        { capitulo: 'Tu cartón' },
        { pieza: 'titulo', a: { escrito: 1 }, dur: 1.2, curva: 'lineal' },
        { pieza: 'bajada', a: { opacidad: 1 }, dur: 0.5, en: '<0.6' },
        { subtitulo: 'Escaneás el QR de la ronda y tu celular le pide un cartón al servidor.', en: 1 },
        aparecer('cel', { en: '<0.2' }),
        mirar('servidor', '+0.8'),
        aparecer('servidor', { en: '<0.3' }),
        { pieza: 'pide', a: { progreso: 1 }, dur: 0.9, en: '<' },

        ...leer('El servidor elige tus números al azar y les pone un sello, con una clave que solo él sabe.'),
        aparecer('clave', { en: '<0.4' }),
        { pieza: 'clave', a: { resaltado: 1 }, dur: 0.4, en: '+0.3' },
        { pieza: 'clave', a: { resaltado: 0 }, dur: 0.4 },

        // ======== El código ========
        { capitulo: 'El código' },
        ...bajada('El código'),
        mirar('codigo', '<'),
        { subtitulo: 'El resultado es un código de 8 letras.', en: '<' },
        { pieza: 'da', a: { progreso: 1 }, dur: 0.8, en: '<0.3' },
        { pieza: 'codigo', a: { opacidad: 1, escala: 1 }, dur: 0.6, curva: 'pasarse' },

        ...leer('Adentro lleva tres cosas: un número al azar, la hora en que lo pediste y el sello.'),
        { pieza: ['azar', 'hora', 'sello'], a: { opacidad: 1 }, dur: 0.4, escalonar: 0.5, en: '<0.4' },

        ...leer('Tus números salen del código: el mismo código, siempre los mismos números.'),
        mirar('cel', '<'),
        { pieza: 'aCel', a: { progreso: 1 }, dur: 0.9, en: '<0.3' },
        aparecer(mios, { escalonar: 0.12, dur: 0.35 }),
        aparecer('celCodigo', { en: '+0.2' }),

        ...leer('Y el sello no se puede inventar: sin la clave, acertar uno es casi imposible.'),
        mirar('codigo', '<'),
        aparecer('trucho', { en: '<0.4' }),
        { pieza: 'sello', a: { resaltado: 1 }, dur: 0.4, en: '<' },
        { pieza: 'trucho', a: { valor: 262144 }, dur: 2.4, curva: 'salir', en: '<0.2' },
        { pieza: 'sello', a: { resaltado: 0 }, dur: 0.4 },

        // ======== ¡Bingo! ========
        { capitulo: '¡Bingo!' },
        ...bajada('¡Bingo!'),
        mirar('notebook', '<'),
        { subtitulo: 'Salen las bolillas, y vos marcás tus números en el celular.', en: '<' },
        aparecer(['notebook', 'salieron'], { en: '<0.3' }),
        ...SALEN.flatMap((n, i) => {
            const mio = MIOS.indexOf(n);
            return [
                { pieza: 'sale' + i, a: { opacidad: 1, escala: 1 }, dur: 0.35, curva: 'pasarse', en: i === 0 ? '+0.2' : '+0.25' },
                mio >= 0 ? { pieza: 'mio' + mio, a: { relleno: 'acento', color: 'fondo' }, dur: 0.3, en: '<0.1' } : null,
            ];
        }),

        ...leer('Gritás ¡BINGO! y en el stand escriben tu código en la notebook.'),
        mirar('todo', '<', 1.2),
        aparecer('celBingo', { en: '<0.3' }),
        { pieza: 'canta', a: { progreso: 1 }, dur: 1, en: '+0.2' },

        ...leer('La notebook tiene la misma clave: revisa el sello, saca tus números del código y los compara. Sin internet.'),
        mirar('resultado', '<'),
        { pieza: 'bien', a: { opacidad: 1, escala: 1 }, dur: 0.6, curva: 'pasarse', en: '+1' },

        ...leer('¿Y si alguien pide un cartón después de la primera bolilla? La hora del código lo delata.'),
        { pieza: 'hora', a: { resaltado: 1 }, dur: 0.4, en: '<0.6' },
        { pieza: 'tarde', a: { opacidad: 1, escala: 1 }, dur: 0.6, curva: 'pasarse', en: '<0.3' },
        { pieza: 'hora', a: { resaltado: 0 }, dur: 0.4, en: '+0.8' },
        { espera: 'subtitulo' },
        { espera: 1 },

        // ======== Cierre ========
        { capitulo: 'Nadie guarda tu cartón' },
        { pieza: todoElMundo, a: { opacidad: 0.12 }, dur: 0.8 },
        { pieza: 'cierre1', a: { opacidad: 1, escala: 1 }, dur: 0.7, curva: 'salir', en: '<0.4' },
        aparecer('cierre2', { en: '<0.6' }),
        aparecer('firma', { en: '<0.3' }),
        { espera: 6 },
        { pieza: [...todoElMundo, 'titulo', 'bajada', 'cierre1', 'cierre2', 'firma'], a: { opacidad: 0 }, dur: 1 },
    ]
        .flat()
        .filter(Boolean);

    return {
        titulo: 'El Bingo del stand: cómo sabe que tu cartón es tuyo',
        descripcion:
            'Al escanear el QR, el celular le pide un cartón al servidor. El servidor elige los números al azar y les ' +
            'pone un sello con una clave secreta: el resultado es un código de 8 letras que lleva un número al azar, ' +
            'la hora y el sello. Al cantar Bingo, la notebook del stand, que tiene la misma clave, revisa el sello, ' +
            'saca los números del código y los compara con las bolillas, sin internet. Si el cartón se pidió después ' +
            'de la primera bolilla, la hora lo delata. Nadie guarda los cartones: el código ya lo dice todo.',
        ancho: W,
        alto: H,
        pausaFinal: 0.6,
        lectura: 11,
        piezas: { cam, ...mundo, ...flechas, ...pantalla },
        linea,
    };
});
