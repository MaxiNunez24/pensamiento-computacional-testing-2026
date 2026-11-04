// Las fotos con IA del stand: cómo dibuja una compu tu cara.
//
// Para la Expo CFP del 13/11/2026, y de puente al curso de Usuaria/o de IA generativa de 2027. Cuenta lo que hace
// el estudio de fotos (ComfyUI + InstantID, en la PC del stand) sin nombres técnicos: la compu
// encuentra tu cara y la resume en una "huella" de números; el estilo se pide con palabras; y la
// imagen nace del ruido en 4 pasos, guiada por las dos cosas. Todo en la PC: la foto no sale a
// internet.
//
// Lo de adentro (el "mundo") se arma en coordenadas de 1600 × 900, como expo-siges.js: en ancho se
// ve entero; en angosto la cámara se acerca a la parte que se cuenta.

import { caja, texto, flecha, tabla, camara, contador, registrar } from 'motor-animaciones';

// La "huella" de la cara: en la de verdad son 512 números; acá, los primeros
const HUELLA = [['0,12'], ['-0,53'], ['0,08'], ['0,91'], ['…']];
// Del ruido a la imagen: cada paso un poco más claro
const PASOS = [
    { icono: '▒', texto: 'ruido' },
    { icono: '🌫️', texto: 'paso 1' },
    { icono: '🫥', texto: 'paso 2' },
    { icono: '🙂', texto: 'paso 3' },
    { icono: '👩‍🚀', texto: 'paso 4' },
];

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
        estilo: enMundo(caja, { x: 800, y: 300, ancho: 460, alto: 120, icono: '💬', tamanoIcono: 36, texto: 'astronauta, casco, estrellas', tamano: 30, escrito: 0, borde: 'acento' }),
        estiloPie: enMundo(texto, { x: 800, y: 222, texto: 'el estilo, en palabras', tamano: 22, color: 'suave' }),
        cuenta: enMundo(contador, { x: 1150, y: 820, valor: 0, sufijo: ' segundos', prefijo: '4 pasos · ', tamano: 30, peso: 700, color: 'acento' }),
        pc: enMundo(caja, { x: 1350, y: 300, ancho: 340, alto: 120, icono: '🖥️', tamanoIcono: 40, texto: 'La PC del stand', tamano: 26 }),
        sinInternet: enMundo(texto, { x: 1350, y: 395, texto: 'sin internet: tu foto no sale de acá', tamano: 22, color: 'suave' }),
    };
    // Los 5 puntos de la cara: ojos, nariz y las puntas de la boca
    [[-38, -40], [38, -40], [0, 0], [-34, 42], [34, 42]].forEach(([dx, dy], i) => {
        mundo['punto' + i] = enMundo(caja, { x: 250 + dx, y: 355 + dy, ancho: 20, alto: 20, radio: 10, relleno: 'acento', borde: 'acento', escala: 0.4 });
    });
    PASOS.forEach((paso, i) => {
        mundo['paso' + i] = enMundo(caja, {
            x: 560 + i * 200, y: 620, ancho: 170, alto: 220, icono: paso.icono, tamanoIcono: 80,
            texto: paso.texto, tamano: 24, relleno: i === PASOS.length - 1 ? 'papel' : 'fondo', escala: 0.9,
        });
    });

    const flechas = {
        aHuella: flecha({ dentro: 'cam', desde: 'foto', hasta: 'huella', progreso: 0, color: 'acento' }),
        huellaGuia: flecha({ dentro: 'cam', desde: 'huella', hasta: 'paso2', progreso: 0, color: 'acento', curvatura: 0.25, etiqueta: 'la cara' }),
        estiloGuia: flecha({ dentro: 'cam', desde: 'estilo', hasta: 'paso2', progreso: 0, color: 'acento' }),
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
            estilo: [900, 340, 1.0],
            pasos: [960, 640, 0.6],
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

    const puntos = [0, 1, 2, 3, 4].map((i) => 'punto' + i);
    const pasos = PASOS.map((_, i) => 'paso' + i);
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
        mirar('pasos', '<'),
        { subtitulo: 'La imagen arranca siendo ruido, como una tele sin señal.', en: '<' },
        aparecer('paso0', { en: '<0.3' }),

        ...leer('En cada paso saca un poco de ruido, guiada por tu huella y por las palabras del estilo.'),
        { pieza: ['huellaGuia', 'estiloGuia'], a: { progreso: 1 }, dur: 0.9, en: '<0.4' },
        { pieza: pasos.slice(1), a: { opacidad: 1, escala: 1 }, dur: 0.45, escalonar: 0.9, curva: 'pasarse' },
        aparecer('cuenta', { en: '<' }),
        { pieza: 'cuenta', a: { valor: 9 }, dur: 3.2, curva: 'lineal', en: '<' },

        ...leer('Cuatro pasos y unos 9 segundos después: sos astronauta. Y te la llevás impresa.'),
        mirar('todo', '<', 1.2),
        aparecer(['pc', 'sinInternet'], { en: '<0.6' }),
        { pieza: 'paso4', a: { resaltado: 1 }, dur: 0.4, en: '<0.3' },
        { espera: 'subtitulo' },
        { espera: 1 },

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
            'una huella de 512 números. Elegís un estilo, que se pide con palabras. La imagen arranca siendo ruido y en ' +
            'cuatro pasos, guiada por tu huella y por el estilo, se convierte en vos de astronauta, en unos 9 segundos, ' +
            'en la PC del stand y sin internet. Esto se aprende en el curso de Usuaria/o de IA generativa del CFP 401 en 2027.',
        ancho: W,
        alto: H,
        pausaFinal: 0.6,
        lectura: 11,
        piezas: { cam, ...mundo, ...flechas, ...pantalla },
        linea,
    };
});
