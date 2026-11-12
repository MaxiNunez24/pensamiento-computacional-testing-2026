// Tu juego para la Expo: el tutorial de punta a punta, para mandar por WhatsApp.
//
// Para la Expo CFP del 13/11/2026. Cada alumno arma un juego chiquito conversando con una IA
// (el prompt está en preparando-expo/el-stand) y le manda el .html al profe, que los junta en la
// PC de juegos del stand. Lo que más se traba no es la IA: es lo de antes y lo de después (pegar
// el prompt entero, guardar el código como .html y no como .txt, mandarlo como Documento y no como
// foto). Por eso la animación cuenta esos pasos con la misma pantalla de mentira que
// catalogo-actualizar.js: en ancho la pantalla va a la derecha y el paso, grande, a la izquierda;
// en angosto (el celular, que es donde lo van a abrir desde WhatsApp) la pantalla arriba y el
// paso abajo. La pantalla está pensada en 640 × 860 para las dos.
//
// El apodo de la conversación ("Rayo") es inventado: en el repo no van nombres de alumnos.

import { caja, texto, camara, registrar } from 'motor-animaciones';

const CODIGO_FONDO = '#0d1117';
const CODIGO_TEXTO = '#e6edf3';
const NARANJA = '#c96442'; // el botón de mandar del chat
const VERDE = '#2f6b4f';
const WSP_FONDO = '#efeae2';
const WSP_BARRA = '#008069';
const WSP_MIO = '#d9fdd3';
const OSCURO = '#111b21'; // letras sobre los fondos claros fijos (no cambian con el tema)

const PROMPT = [
    'MI NOMBRE O APODO:',
    'MI IDEA:',
    '',
    'Soy estudiante de un curso de',
    'programación y quiero hacer, con',
    'tu ayuda, un juego para la Expo',
    'de mi escuela. Se va a jugar en',
    'una computadora del stand, sin',
    'internet.',
    '',
    'ANTES DE ESCRIBIR CÓDIGO,',
    'conversá conmigo así:',
    '- Preguntame de a UNA cosa…',
].join('\n');

const CODIGO = [
    '<!DOCTYPE html>',
    '<html lang="es">',
    '<head>',
    '  <title>Caracol veloz</title>',
    '  <meta name="autor" content="Rayo">',
    '  <style> … </style>',
    '</head>',
    '<body>',
    '  <canvas id="juego"></canvas>',
    '  <script>',
    '    function bucle() { … }',
    '  </script>',
    '</body>',
    '</html>',
].join('\n');

registrar('expo-tu-juego', function (disposicion) {
    const angosta = disposicion.nombre === 'angosta';
    const W = angosta ? 640 : 1600;
    const H = angosta ? 1140 : 900;

    // ---------------- La pantalla de mentira (en el mundo de la cámara) ----------------
    const m = (fabrica, props) => fabrica({ dentro: 'cam', ...props });
    const oculto = { opacidad: 0 };
    const boton = (props) => ({ alto: 52, radio: 26, tamano: 19, peso: 600, ...props });

    const ventana = {
        marco: m(caja, { x: 320, y: 440, ancho: 620, alto: 820, radio: 16, relleno: 'superficie', borde: 'borde' }),
        barra: m(caja, { x: 320, y: 62, ancho: 616, alto: 60, radio: 14, relleno: 'fondo', borde: 'ninguno' }),
        url: m(caja, { x: 320, y: 62, ancho: 560, alto: 40, radio: 20, relleno: 'papel', borde: 'borde', grosorBorde: 1, texto: '🔒 maxinunez24.github.io/…/el-stand/', tamano: 16, peso: 400 }),
    };

    // 1. La clase, con el prompt y su botón de copiar
    const sitio = {
        stTitulo: m(texto, { x: 44, y: 135, texto: 'Cómo hacer tu juego', tamano: 32, peso: 800, alineacion: 'inicio' }),
        stEtiqueta: m(texto, { x: 44, y: 185, texto: 'Prompt para tu juego (copialo entero)', tamano: 17, color: 'suave', alineacion: 'inicio' }),
        stFondo: m(caja, { x: 320, y: 510, ancho: 560, alto: 600, radio: 12, relleno: CODIGO_FONDO, borde: 'ninguno' }),
        stCodigo: m(texto, { x: 64, y: 530, texto: PROMPT, tamano: 18, fuente: 'mono', alineacion: 'inicio', color: CODIGO_TEXTO, interlineado: 1.5 }),
        stCopiar: m(caja, { x: 520, y: 248, ancho: 150, alto: 44, radio: 10, texto: '📋 Copiar', tamano: 18, peso: 600, relleno: '#30363d', borde: 'ninguno', color: '#ffffff' }),
    };

    // 2 y 3. El chat con la IA
    const chat = {
        chSaludo: m(texto, { x: 320, y: 330, texto: '¿En qué te ayudo hoy?', tamano: 32, peso: 700, ...oculto }),
        chCaja: m(caja, { x: 320, y: 600, ancho: 580, alto: 104, radio: 22, relleno: 'papel', borde: 'borde', grosorBorde: 2, ...oculto }),
        chTexto: m(texto, { x: 54, y: 582, texto: 'Escribí tu mensaje…', tamano: 18, color: 'suave', alineacion: 'inicio', interlineado: 1.35, ...oculto }),
        chMandar: m(caja, { x: 572, y: 622, ancho: 50, alto: 50, radio: 25, texto: '↑', tamano: 26, peso: 800, relleno: NARANJA, borde: 'ninguno', color: '#ffffff', ...oculto }),
        u1: m(caja, { x: 392, y: 130, ancho: 440, alto: 56, radio: 18, texto: '📋 MI NOMBRE O APODO: … (el prompt entero)', tamano: 16, peso: 400, relleno: 'fondo', borde: 'ninguno', ...oculto }),
        a1: m(texto, { x: 40, y: 200, texto: '¡Hola! Antes de arrancar:\n¿cuál es tu nombre o apodo?', tamano: 20, alineacion: 'inicio', interlineado: 1.35, escrito: 0, ...oculto }),
        u2: m(caja, { x: 520, y: 270, ancho: 160, alto: 52, radio: 18, texto: 'Rayo', tamano: 19, peso: 400, relleno: 'fondo', borde: 'ninguno', ...oculto }),
        a2: m(texto, { x: 40, y: 350, texto: '¡Buenísimo, Rayo! ¿Qué juegos te\ngustan? ¿De reflejos, de puntería,\nde memoria…?', tamano: 20, alineacion: 'inicio', interlineado: 1.35, escrito: 0, ...oculto }),
        u3: m(caja, { x: 450, y: 430, ancho: 300, alto: 52, radio: 18, texto: 'los de esquivar cosas', tamano: 19, peso: 400, relleno: 'fondo', borde: 'ninguno', ...oculto }),
        a3: m(caja, { x: 300, y: 525, ancho: 520, alto: 130, radio: 14, texto: '🐌 Caracol veloz\nEsquivás las hojas que caen con ⬅️ ➡️.\nCada hoja esquivada suma 1 punto.\n¿Le damos?', tamano: 18, peso: 400, relleno: 'superficie', borde: 'acento', ...oculto }),
        u4: m(caja, { x: 540, y: 615, ancho: 120, alto: 50, radio: 18, texto: 'dale', tamano: 19, peso: 600, relleno: 'fondo', borde: 'ninguno', ...oculto }),
    };

    // 4. El código que devuelve la IA, con su botón de copiar
    const respuesta = {
        rsTexto: m(texto, { x: 40, y: 140, texto: '¡Acá está tu juego! 🎮', tamano: 22, peso: 700, alineacion: 'inicio', ...oculto }),
        rsBarra: m(caja, { x: 320, y: 210, ancho: 560, alto: 56, radio: 10, relleno: '#1f2430', borde: 'ninguno', ...oculto }),
        rsNombre: m(texto, { x: 60, y: 210, texto: 'caracol-veloz.html', tamano: 17, fuente: 'mono', color: '#ffffff', alineacion: 'inicio', ...oculto }),
        rsCopiar: m(caja, { x: 520, y: 210, ancho: 130, alto: 40, radio: 8, texto: '📋 Copiar', tamano: 17, peso: 600, relleno: '#30363d', borde: 'ninguno', color: '#ffffff', ...oculto }),
        rsFondo: m(caja, { x: 320, y: 430, ancho: 560, alto: 380, radio: 10, relleno: CODIGO_FONDO, borde: 'ninguno', ...oculto }),
        rsCodigo: m(texto, { x: 60, y: 430, texto: CODIGO, tamano: 17, fuente: 'mono', alineacion: 'inicio', color: CODIGO_TEXTO, interlineado: 1.45, ...oculto }),
        rsExplica: m(texto, { x: 40, y: 650, texto: 'Cómo funciona: el bucle del juego…', tamano: 18, color: 'suave', alineacion: 'inicio', ...oculto }),
    };

    // 5. El Bloc de notas y "Guardar como"
    const notas = {
        bnMenu: m(texto, { x: 44, y: 120, texto: 'Archivo    Editar    Ver', tamano: 18, alineacion: 'inicio', ...oculto }),
        bnArchivo: m(caja, { x: 76, y: 120, ancho: 92, alto: 36, radio: 6, texto: 'Archivo', tamano: 18, peso: 400, relleno: 'superficie', borde: 'ninguno', ...oculto }),
        bnHoja: m(caja, { x: 320, y: 480, ancho: 590, alto: 680, radio: 6, relleno: '#ffffff', borde: 'borde', grosorBorde: 1, ...oculto }),
        bnCodigo: m(texto, { x: 44, y: 400, texto: CODIGO, tamano: 17, fuente: 'mono', alineacion: 'inicio', color: OSCURO, interlineado: 1.45, ...oculto }),
        teclaCtrl: m(caja, { x: 220, y: 560, ancho: 150, alto: 96, radio: 14, texto: 'Ctrl', tamano: 40, peso: 800, relleno: 'papel', borde: 'texto', grosorBorde: 4, ...oculto }),
        teclaMas: m(texto, { x: 330, y: 560, texto: '+', tamano: 48, peso: 800, ...oculto }),
        teclaLetra: m(caja, { x: 430, y: 560, ancho: 110, alto: 96, radio: 14, texto: 'V', tamano: 44, peso: 800, relleno: 'papel', borde: 'texto', grosorBorde: 4, ...oculto }),
        gcVelo: m(caja, { x: 320, y: 470, ancho: 616, alto: 756, radio: 0, relleno: '#000000', borde: 'ninguno', ...oculto }),
        gcDlg: m(caja, { x: 320, y: 470, ancho: 570, alto: 380, radio: 12, relleno: 'superficie', borde: 'borde', ...oculto }),
        gcTitulo: m(texto, { x: 64, y: 322, texto: 'Guardar como', tamano: 26, peso: 700, alineacion: 'inicio', ...oculto }),
        gcNombreEt: m(texto, { x: 64, y: 392, texto: 'Nombre:', tamano: 18, alineacion: 'inicio', ...oculto }),
        gcNombre: m(caja, { x: 380, y: 392, ancho: 380, alto: 46, radio: 6, texto: 'caracol-veloz.html', tamano: 18, peso: 400, borde: 'borde', grosorBorde: 2, ...oculto }),
        gcTipoEt: m(texto, { x: 64, y: 462, texto: 'Tipo:', tamano: 18, alineacion: 'inicio', ...oculto }),
        gcTipo: m(caja, { x: 380, y: 462, ancho: 380, alto: 46, radio: 6, texto: 'Documentos de texto (*.txt) ▾', tamano: 17, peso: 400, borde: 'borde', grosorBorde: 2, ...oculto }),
        gcGuardar: m(caja, { x: 480, y: 580, ancho: 160, alto: 50, radio: 8, texto: 'Guardar', tamano: 18, peso: 600, relleno: VERDE, borde: VERDE, color: '#ffffff', ...oculto }),
    };

    // 6. El archivo en el escritorio y el juego andando
    const juego = {
        jsIcono: m(caja, { x: 320, y: 400, ancho: 220, alto: 190, radio: 14, icono: '🌐', tamanoIcono: 80, texto: 'caracol-veloz.html', tamano: 17, peso: 600, relleno: 'superficie', borde: 'ninguno', ...oculto }),
        jsFondo: m(caja, { x: 320, y: 470, ancho: 610, alto: 750, radio: 4, relleno: '#16233a', borde: 'ninguno', ...oculto }),
        jsPuntos: m(texto, { x: 480, y: 140, texto: 'Puntos: 0', tamano: 30, peso: 800, color: '#ffffff', ...oculto }),
        jsHoja1: m(texto, { x: 150, y: 230, texto: '🍂', tamano: 50, ...oculto }),
        jsHoja2: m(texto, { x: 330, y: 230, texto: '🍁', tamano: 50, ...oculto }),
        jsHoja3: m(texto, { x: 500, y: 230, texto: '🍂', tamano: 50, ...oculto }),
        jsCaracol: m(texto, { x: 320, y: 590, texto: '🐌', tamano: 64, ...oculto }),
        jsControles: m(caja, { x: 150, y: 140, ancho: 220, alto: 40, radio: 10, texto: '⬅️ ➡️ moverse', tamano: 16, peso: 600, relleno: '#ffffff', borde: 'ninguno', color: OSCURO, ...oculto }),
    };

    // 7. WhatsApp Web, mandándolo como Documento
    const wsp = {
        wsFondo: m(caja, { x: 320, y: 470, ancho: 610, alto: 750, radio: 4, relleno: WSP_FONDO, borde: 'ninguno', ...oculto }),
        wsBarra: m(caja, { x: 320, y: 128, ancho: 610, alto: 66, radio: 0, relleno: WSP_BARRA, borde: 'ninguno', ...oculto }),
        wsNombre: m(texto, { x: 44, y: 128, texto: '👨‍🏫  Profe', tamano: 22, peso: 700, color: '#ffffff', alineacion: 'inicio', ...oculto }),
        wsEntrada: m(caja, { x: 360, y: 610, ancho: 480, alto: 50, radio: 25, texto: 'Escribí un mensaje', tamano: 17, peso: 400, relleno: '#ffffff', borde: 'ninguno', color: '#667781', ...oculto }),
        wsClip: m(caja, { x: 66, y: 610, ancho: 54, alto: 54, radio: 27, texto: '📎', tamano: 26, relleno: '#ffffff', borde: 'ninguno', color: OSCURO, ...oculto }),
        wsMenu: m(caja, { x: 180, y: 500, ancho: 290, alto: 150, radio: 14, relleno: '#ffffff', borde: 'ninguno', ...oculto }),
        wsDocumento: m(caja, { x: 180, y: 465, ancho: 260, alto: 56, radio: 10, texto: '📄  Documento', tamano: 19, peso: 600, relleno: '#ffffff', borde: 'ninguno', color: OSCURO, ...oculto }),
        wsFotos: m(caja, { x: 180, y: 535, ancho: 260, alto: 56, radio: 10, texto: '🖼️  Fotos y videos', tamano: 19, peso: 400, relleno: '#ffffff', borde: 'ninguno', color: '#667781', ...oculto }),
        wsElegir: m(caja, { x: 320, y: 330, ancho: 480, alto: 230, radio: 14, relleno: '#ffffff', borde: 'borde', ...oculto }),
        wsElegirTitulo: m(texto, { x: 100, y: 255, texto: 'Abrir', tamano: 22, peso: 700, color: OSCURO, alineacion: 'inicio', ...oculto }),
        wsArchivo: m(caja, { x: 320, y: 320, ancho: 420, alto: 56, radio: 8, texto: '🌐  caracol-veloz.html', tamano: 18, peso: 600, relleno: '#ffffff', borde: '#c8d0d8', grosorBorde: 2, color: OSCURO, ...oculto }),
        wsAbrir: m(caja, { x: 470, y: 398, ancho: 130, alto: 46, radio: 8, texto: 'Abrir', tamano: 18, peso: 600, relleno: WSP_BARRA, borde: 'ninguno', color: '#ffffff', ...oculto }),
        wsMensaje: m(caja, { x: 400, y: 480, ancho: 380, alto: 96, radio: 12, texto: '📄 caracol-veloz.html\nHTML · 14 kB          ✓✓', tamano: 18, peso: 600, relleno: WSP_MIO, borde: 'ninguno', color: OSCURO, ...oculto }),
    };

    const mano = m(texto, { x: 520, y: 760, texto: '👆', tamano: 56, ...oculto });

    // ---------------- Lo fijo: el título y el paso que toca ----------------
    // Igual que catalogo-actualizar.js: en el celular el paso va arriba (abajo flotan los controles
    // del reproductor) y el título no va (la clase ya lo dice justo arriba).
    const fijo = angosta
        ? {
            titulo: { x: 320, y: -100, tamano: 1 },
            paso: { x: 28, y: 44, tamano: 28, alineacion: 'inicio' },
            hacer: { x: 320, y: 145, tamano: 32, anchoMax: 600 },
            cam: { x: 320, y: 600, ancho: 640, alto: 800, zoom: 0.93 },
        }
        : {
            titulo: { x: 380, y: 150, tamano: 42 },
            paso: { x: 380, y: 340, tamano: 30 },
            hacer: { x: 380, y: 470, tamano: 46, anchoMax: 620 },
            cam: { x: 1170, y: 466, ancho: 680, alto: 848, zoom: 0.96 },
        };
    const pantalla = {
        titulo: texto({ ...fijo.titulo, texto: 'Tu juego para la Expo', peso: 800, escrito: 0 }),
        paso: texto({ ...fijo.paso, texto: '', peso: 800, color: 'acento', opacidad: 0 }),
        hacer: texto({ ...fijo.hacer, texto: angosta ? 'Tu juego para la Expo' : '', peso: 800, opacidad: angosta ? 1 : 0, interlineado: 1.2 }),
    };
    const cam = camara({ x: fijo.cam.x, y: fijo.cam.y, ancho: fijo.cam.ancho, alto: fijo.cam.alto, mirarX: 320, mirarY: 440, zoom: fijo.cam.zoom, radio: 18 });

    // ---------------- Ayudas para la línea de tiempo ----------------
    const TOTAL = 7;
    const ver = (ids, dur = 0.45, en) => ({ pieza: ids, a: { opacidad: 1 }, dur, ...(en ? { en } : {}) });
    const sacar = (ids, dur = 0.4, en) => ({ pieza: ids, a: { opacidad: 0 }, dur, ...(en ? { en } : {}) });
    const cambiar = (id, a) => ({ pieza: id, a, dur: 0 });
    const paso = (n, hacer) => [
        { pieza: ['paso', 'hacer'], a: { opacidad: 0 }, dur: 0.25 },
        cambiar('paso', { texto: n ? `Paso ${n} de ${TOTAL}` : '¡Listo!' }),
        cambiar('hacer', { texto: hacer }),
        { pieza: ['paso', 'hacer'], a: { opacidad: 1 }, dur: 0.4 },
    ];
    // La mano va hasta el botón (la punta del dedo arriba: se la pone un poco más abajo) y lo toca
    const tocar = (id, x, y) => [
        { pieza: 'mano', a: { x: x + 8, y: y + 34 }, dur: 0.9, curva: 'suave' },
        { pieza: 'mano', a: { escala: 0.82 }, dur: 0.12 },
        { pieza: id, a: { resaltado: 1, escala: 0.96 }, dur: 0.12, en: '<' },
        { pieza: 'mano', a: { escala: 1 }, dur: 0.16 },
        { pieza: id, a: { resaltado: 0, escala: 1 }, dur: 0.3, en: '<' },
    ];
    // Un mensaje de la IA: aparece y se va escribiendo
    const escribe = (id, dur = 1.1) => [cambiar(id, { opacidad: 1 }), { pieza: id, a: { escrito: 1 }, dur, curva: 'lineal' }];
    const teclas = (letra) => [
        cambiar('teclaLetra', { texto: letra }),
        ver(['teclaCtrl', 'teclaMas', 'teclaLetra'], 0.3),
        { pieza: 'teclaLetra', a: { escala: 1.12 }, dur: 0.15, en: '+0.4' },
        { pieza: 'teclaLetra', a: { escala: 1 }, dur: 0.2 },
    ];
    // Las hojas caen y el caracol las esquiva: una pasada. Todo arriba de y ≈ 640: más abajo, en la
// página (sin pantalla completa), lo tapan los controles del reproductor.
    const caida = (xCaracol, puntos) => [
        { pieza: ['jsHoja1', 'jsHoja2', 'jsHoja3'], a: { y: 600 }, dur: 1.5, curva: 'lineal' },
        { pieza: 'jsCaracol', a: { x: xCaracol }, dur: 0.6, curva: 'suave', en: '<0.3' },
        cambiar('jsPuntos', { texto: `Puntos: ${puntos}` }),
        cambiar(['jsHoja1', 'jsHoja2', 'jsHoja3'], { y: 230 }),
    ];
    const leer = (subtitulo) => [{ espera: 'subtitulo' }, { espera: 0.3 }, { subtitulo, en: '>' }];
    const ids = (grupo) => Object.keys(grupo);
    const sinTeclas = (grupo) => ids(grupo).filter((id) => !id.startsWith('tecla'));

    const linea = [
        // ======== Para qué ========
        { capitulo: 'Para qué' },
        { pieza: 'titulo', a: { escrito: 1 }, dur: 1.2, curva: 'lineal' },
        { subtitulo: 'Vas a hacer un juego conversando con una IA, y va a estar en una PC del stand para que lo juegue la gente.', en: 0.4 },
        ...leer('Son 7 pasos. Lo que más se traba no es la IA: es guardar bien el archivo y mandarlo. Miralos hasta el final.'),
        { espera: 'subtitulo' },

        // ======== 1. Copiar el prompt ========
        { capitulo: '1. Copiar el prompt' },
        ...paso(1, 'En la clase, tocá 📋 Copiar en el recuadro del prompt'),
        ver('mano', 0.3, '<'),
        { subtitulo: 'El prompt es el pedido para la IA. Está en esta misma página, en "Cómo hacer tu juego".', en: '<' },
        ...tocar('stCopiar', 520, 248),
        cambiar('stCopiar', { texto: '✅ Copiado' }),
        ...leer('Se copia entero, aunque sea largo. No hace falta cambiarle nada.'),
        { espera: 'subtitulo' },

        // ======== 2. Pegarlo en claude.ai ========
        { capitulo: '2. Pegarlo en la IA' },
        ...paso(2, 'Entrá a claude.ai, pegalo con Ctrl + V y mandalo'),
        sacar(ids(sitio), 0.4, '<'),
        cambiar('url', { texto: '🔒 claude.ai/new' }),
        ver(['chSaludo', 'chCaja', 'chTexto', 'chMandar'], 0.5),
        { subtitulo: 'Entrá con tu cuenta y abrí una conversación nueva.', en: '<' },
        ...tocar('chCaja', 300, 600),
        ...teclas('V'),
        { pieza: 'chTexto', a: { opacidad: 0 }, dur: 0.2 },
        cambiar('chTexto', { texto: 'MI NOMBRE O APODO:\nMI IDEA:\nSoy estudiante de un curso de…', color: 'texto' }),
        { pieza: 'chTexto', a: { opacidad: 1 }, dur: 0.3 },
        sacar(['teclaCtrl', 'teclaMas', 'teclaLetra'], 0.4, '+0.6'),
        ...tocar('chMandar', 572, 622),
        sacar(['chSaludo', 'chTexto'], 0.3, '<'),
        ver('u1', 0.4),
        sacar(['chCaja', 'chMandar'], 0.3, '<'),
        { espera: 'subtitulo' },

        // ======== 3. Conversar ========
        { capitulo: '3. Conversar' },
        ...paso(3, 'Contestale de a una pregunta'),
        sacar('mano', 0.3, '<'),
        ...escribe('a1'),
        { subtitulo: 'Te pregunta tu nombre o apodo: es el que va a aparecer en el menú del stand.', en: '<' },
        ver('u2', 0.4, '+0.8'),
        ...escribe('a2', 1.4),
        ...leer('Si no tenés idea, no pasa nada: te ayuda a encontrarla con preguntas.'),
        ver('u3', 0.4, '<0.8'),
        ver('a3', 0.5, '+0.6'),
        ...leer('Antes de programar te resume el juego. Si te gusta, decile "dale". Si no, pedile cambios.'),
        ver('u4', 0.4, '<1'),
        { espera: 'subtitulo' },

        // ======== 4. Copiar el código ========
        { capitulo: '4. Copiar el código' },
        ...paso(4, 'Cuando te da el código, tocá 📋 Copiar'),
        sacar(['u1', 'a1', 'u2', 'a2', 'u3', 'a3', 'u4'], 0.4, '<'),
        ver(['rsTexto', 'rsBarra', 'rsNombre', 'rsCopiar', 'rsFondo', 'rsCodigo', 'rsExplica'], 0.5),
        ver('mano', 0.3, '<'),
        { subtitulo: 'El juego entero es este código: HTML, CSS y JavaScript en un solo archivo.', en: '<' },
        ...tocar('rsCopiar', 520, 210),
        cambiar('rsCopiar', { texto: '✅ Copiado' }),
        ...leer('Si en vez de Copiar te aparece Descargar, mejor: te baja el .html listo y saltás al paso 6.'),
        { espera: 'subtitulo' },

        // ======== 5. Guardarlo como .html ========
        { capitulo: '5. Guardarlo como .html' },
        ...paso(5, 'Abrí el Bloc de notas y pegalo con Ctrl + V'),
        sacar([...ids(chat), ...ids(respuesta)], 0.4, '<'),
        cambiar('url', { texto: '📝 Sin título: Bloc de notas' }),
        ver(['bnMenu', 'bnHoja'], 0.4),
        ...teclas('V'),
        ver('bnCodigo', 0.4, '+0.2'),
        { subtitulo: 'En Windows lo encontrás buscando "Bloc de notas" en el menú Inicio.', en: '<' },
        sacar(['teclaCtrl', 'teclaMas', 'teclaLetra'], 0.4, '+0.8'),
        { espera: 'subtitulo' },
        ...paso(5, 'Archivo → Guardar como, con el nombre terminado en .html'),
        ver('bnArchivo', 0.2, '<'),
        ...tocar('bnArchivo', 76, 120),
        { pieza: 'gcVelo', a: { opacidad: 0.45 }, dur: 0.3 },
        ver(['gcDlg', 'gcTitulo', 'gcNombreEt', 'gcNombre', 'gcTipoEt', 'gcTipo', 'gcGuardar'], 0.4, '<0.1'),
        { subtitulo: 'El nombre, sin espacios ni tildes y terminado en .html.', en: '<' },
        { pieza: 'gcNombre', a: { resaltado: 1 }, dur: 0.3, en: '<' },
        { pieza: 'gcNombre', a: { resaltado: 0 }, dur: 0.4, en: '+1.2' },
        ...leer('Ojo con el Tipo: si queda "Documentos de texto", se guarda como .txt y no anda. Elegí "Todos los archivos".'),
        ...tocar('gcTipo', 380, 462),
        cambiar('gcTipo', { texto: 'Todos los archivos (*.*) ▾' }),
        { pieza: 'gcTipo', a: { resaltado: 1, escala: 1.04 }, dur: 0.3 },
        { pieza: 'gcTipo', a: { resaltado: 0, escala: 1 }, dur: 0.4, en: '+0.6' },
        { espera: 'subtitulo' },
        ...tocar('gcGuardar', 480, 580),
        { espera: 0.4 },

        // ======== 6. Probarlo ========
        { capitulo: '6. Probarlo' },
        ...paso(6, 'Abrilo con doble clic y jugalo'),
        sacar(sinTeclas(notas), 0.4, '<'),
        cambiar('url', { texto: '📁 Escritorio' }),
        ver('jsIcono', 0.4),
        ...tocar('jsIcono', 320, 400),
        { pieza: 'jsIcono', a: { escala: 0.94 }, dur: 0.1 },
        { pieza: 'jsIcono', a: { escala: 1 }, dur: 0.15 },
        sacar(['jsIcono', 'mano'], 0.3),
        cambiar('url', { texto: '📄 C:/Users/…/Escritorio/caracol-veloz.html' }),
        ver(['jsFondo', 'jsPuntos', 'jsHoja1', 'jsHoja2', 'jsHoja3', 'jsCaracol', 'jsControles'], 0.5),
        { subtitulo: 'Se abre en el navegador, sin internet. Así se va a ver en el stand.', en: '<' },
        cambiar('jsHoja2', { x: 230 }),
        ...caida(420, 1),
        cambiar('jsHoja1', { x: 400 }),
        cambiar('jsHoja3', { x: 560 }),
        ...caida(230, 2),
        ...leer('¿Algo no anda? Decíselo a la IA en la misma conversación, con tus palabras: "cuando choco no pasa nada".'),
        cambiar('jsHoja2', { x: 120 }),
        ...caida(330, 3),
        { espera: 'subtitulo' },

        // ======== 7. Mandarlo ========
        { capitulo: '7. Mandarlo por WhatsApp' },
        ...paso(7, 'Mandámelo por WhatsApp como 📄 Documento'),
        sacar(ids(juego), 0.4, '<'),
        cambiar('url', { texto: '🔒 web.whatsapp.com' }),
        ver(['wsFondo', 'wsBarra', 'wsNombre', 'wsEntrada', 'wsClip'], 0.5),
        ver('mano', 0.3),
        { subtitulo: 'Desde la compu donde lo guardaste: WhatsApp Web o la aplicación.', en: '<' },
        ...tocar('wsClip', 66, 610),
        ver(['wsMenu', 'wsDocumento', 'wsFotos'], 0.3),
        ...leer('Como Documento, no como foto: así llega el archivo entero y lo puedo poner en el stand.'),
        ...tocar('wsDocumento', 180, 465),
        sacar(['wsMenu', 'wsDocumento', 'wsFotos'], 0.3),
        ver(['wsElegir', 'wsElegirTitulo', 'wsArchivo', 'wsAbrir'], 0.4),
        ...tocar('wsArchivo', 320, 320),
        { pieza: 'wsArchivo', a: { resaltado: 1 }, dur: 0.2 },
        ...tocar('wsAbrir', 470, 398),
        sacar(['wsElegir', 'wsElegirTitulo', 'wsArchivo', 'wsAbrir', 'mano'], 0.3),
        ver('wsMensaje', 0.5),
        { espera: 'subtitulo' },

        // ======== Listo ========
        { capitulo: '¡Listo!' },
        ...paso(0, 'En la Expo, la gente juega tu juego 🎮'),
        { subtitulo: 'Y quien haga el récord se lleva una foto con IA adentro de tu juego. ¡Leé la explicación del final: te van a preguntar cómo funciona!', en: '<' },
        { espera: 'subtitulo' },
        { espera: 2 },
    ];

    return {
        titulo: 'Tu juego para la Expo',
        descripcion:
            'En la clase tocás Copiar en el recuadro del prompt. En claude.ai abrís una conversación nueva, lo ' +
            'pegás con Ctrl + V y lo mandás. La IA te pregunta tu nombre o apodo y te ayuda con la idea, de a una ' +
            'pregunta; cuando te resume el juego le decís "dale". Copiás el código que te da, lo pegás en el Bloc de ' +
            'notas y lo guardás con Archivo, Guardar como: el nombre terminado en .html y el Tipo en Todos los ' +
            'archivos. Lo abrís con doble clic para probarlo y, si algo no anda, se lo decís a la IA. Al final lo ' +
            'mandás por WhatsApp con el clip, como Documento y no como foto.',
        ancho: W,
        alto: H,
        pausaFinal: 0.6,
        lectura: 13,
        piezas: { cam, ...ventana, ...sitio, ...chat, ...respuesta, ...notas, ...juego, ...wsp, mano, ...pantalla },
        linea,
    };
});
