// Actualizar catalogo.js: el tutorial para que cada alumno cambie el archivo en su repositorio.
//
// Cuando catalogo.js mejora (como con las fotos que se alejan, en noviembre de 2026), los
// emprendimientos se actualizan solos (usan el compartido), pero cada alumno tiene SU copia en su
// repo. El editor trae un "Modo desarrollador" que muestra el código nuevo y avisa si la página lo
// tiene; acá se cuenta el camino entero: copiarlo ahí y pegarlo en el editor de GitHub.
//
// Es una pantalla de mentira (el editor, después GitHub) que se ve a través de una cámara: en ancho
// va a la derecha y el paso que toca, grande, a la izquierda; en angosto (el celular, que es donde lo
// van a abrir desde WhatsApp) la pantalla arriba y el paso abajo. La pantalla está pensada en
// 640 × 860 para las dos: así no se arma dos veces.
//
// Los botones de GitHub van en inglés, como los van a ver ("Commit changes").

import { caja, texto, camara, registrar } from 'motor-animaciones';

const VERDE = '#2f6b4f';
const VERDE_GH = '#1f883d';
const CODIGO_FONDO = '#0d1117';
const CODIGO_TEXTO = '#e6edf3';

const CODIGO = [
    '/* catalogo.js: trae del Worker los',
    ' * productos y arma las tarjetas.',
    ' */',
    '(function () {',
    "    var WORKER = 'https://catalogos…';",
    '',
    '    function precio(texto) {',
    "        var n = String(texto || '')…",
    "        return '$' + Number(n)…;",
    '    }',
    '',
    '    function tamanoEncuadre(e) {',
    '        var zoom = e.zoom || 1;',
    '        …',
].join('\n');

registrar('catalogo-actualizar', function (disposicion) {
    const angosta = disposicion.nombre === 'angosta';
    const W = angosta ? 640 : 1600;
    const H = angosta ? 1140 : 900;

    // ---------------- La pantalla de mentira (en el mundo de la cámara) ----------------
    const m = (fabrica, props) => fabrica({ dentro: 'cam', ...props });
    const oculto = { opacidad: 0 };
    const boton = (props) => ({ alto: 56, radio: 28, tamano: 20, peso: 600, ...props });

    const ventana = {
        marco: m(caja, { x: 320, y: 440, ancho: 620, alto: 820, radio: 16, relleno: 'superficie', borde: 'borde' }),
        barra: m(caja, { x: 320, y: 62, ancho: 616, alto: 60, radio: 14, relleno: 'fondo', borde: 'ninguno' }),
        url: m(caja, { x: 320, y: 62, ancho: 560, alto: 40, radio: 20, relleno: 'papel', borde: 'borde', grosorBorde: 1, texto: '🔒 cfp401-ensenada.github.io/catalogos/editar/', tamano: 16, peso: 400 }),
    };

    // El editor
    const editor = {
        edEtiqueta: m(texto, { x: 44, y: 128, texto: 'ESTÁS EDITANDO', tamano: 15, color: 'suave', alineacion: 'inicio', peso: 600 }),
        edNombre: m(texto, { x: 44, y: 168, texto: 'Tu catálogo', tamano: 36, peso: 800, alineacion: 'inicio' }),
        edNuevo: m(caja, boton({ x: 160, y: 245, ancho: 250, texto: '＋ Producto nuevo', relleno: VERDE, borde: VERDE, color: '#ffffff' })),
        edAspecto: m(caja, boton({ x: 440, y: 245, ancho: 230, texto: '🎨 Cómo se ve', relleno: 'superficie', borde: 'acento' })),
        edDev: m(caja, boton({ x: 200, y: 318, ancho: 330, texto: '🧑‍💻 Modo desarrollador', relleno: 'superficie', borde: 'acento' })),
        edProd1: m(caja, { x: 320, y: 420, ancho: 560, alto: 60, radio: 12, texto: '🍪  Alfajores · $1.200', tamano: 20, peso: 400 }),
        edProd2: m(caja, { x: 320, y: 492, ancho: 560, alto: 60, radio: 12, texto: '🧁  Budín · $3.500', tamano: 20, peso: 400 }),
        edProd3: m(caja, { x: 320, y: 564, ancho: 560, alto: 60, radio: 12, texto: '🎂  Torta · $9.000', tamano: 20, peso: 400 }),
    };

    // El Modo desarrollador, encima del editor
    const panel = {
        velo: m(caja, { x: 320, y: 470, ancho: 616, alto: 756, radio: 0, relleno: '#000000', borde: 'ninguno', ...oculto }),
        dlg: m(caja, { x: 320, y: 470, ancho: 584, alto: 720, radio: 14, relleno: 'superficie', borde: 'borde', ...oculto }),
        dlgTitulo: m(texto, { x: 56, y: 148, texto: '🧑‍💻 Modo desarrollador', tamano: 28, peso: 800, alineacion: 'inicio', ...oculto }),
        dlgEstado: m(caja, { x: 320, y: 214, ancho: 528, alto: 60, radio: 10, relleno: 'superficie', borde: '#c2770a', texto: '⚠️ Tu página tiene la versión vieja', tamano: 19, ...oculto }),
        dlgCopiar: m(caja, boton({ x: 172, y: 294, ancho: 232, texto: '📋 Copiar todo', relleno: VERDE, borde: VERDE, color: '#ffffff', ...oculto })),
        dlgGithub: m(caja, boton({ x: 440, y: 294, ancho: 268, texto: 'Abrir en GitHub ↗', relleno: 'superficie', borde: 'acento', ...oculto })),
        // "Revisar de nuevo" arriba del código, no abajo: abajo flotan los controles del reproductor
        dlgRevisar: m(caja, { x: 320, y: 362, ancho: 240, alto: 44, radio: 10, relleno: 'superficie', borde: 'ninguno', texto: 'Revisar de nuevo', tamano: 19, color: 'acento', ...oculto }),
        dlgCodigoFondo: m(caja, { x: 320, y: 580, ancho: 528, alto: 380, radio: 10, relleno: CODIGO_FONDO, borde: 'ninguno', ...oculto }),
        dlgCodigo: m(texto, { x: 74, y: 580, texto: CODIGO, tamano: 16, fuente: 'mono', alineacion: 'inicio', color: CODIGO_TEXTO, interlineado: 1.45, ...oculto }),
    };

    // GitHub, editando catalogo.js
    const github = {
        ghRuta: m(texto, { x: 40, y: 128, texto: 'catalogo / catalogo.js  in main', tamano: 20, peso: 700, alineacion: 'inicio', ...oculto }),
        ghCancelar: m(caja, { x: 318, y: 190, ancho: 196, alto: 48, radio: 8, texto: 'Cancel changes', tamano: 17, peso: 600, ...oculto }),
        ghCommit: m(caja, { x: 524, y: 190, ancho: 196, alto: 48, radio: 8, texto: 'Commit changes…', tamano: 17, peso: 600, relleno: VERDE_GH, borde: VERDE_GH, color: '#ffffff', ...oculto }),
        ghPestana: m(texto, { x: 40, y: 248, texto: 'Edit     Preview', tamano: 17, peso: 600, alineacion: 'inicio', ...oculto }),
        ghCodigoFondo: m(caja, { x: 320, y: 540, ancho: 584, alto: 530, radio: 8, relleno: CODIGO_FONDO, borde: 'ninguno', ...oculto }),
        ghCodigo: m(texto, { x: 56, y: 540, texto: CODIGO, tamano: 16, fuente: 'mono', alineacion: 'inicio', color: '#8b949e', interlineado: 1.55, ...oculto }),
        ghSeleccion: m(caja, { x: 320, y: 540, ancho: 560, alto: 500, radio: 4, relleno: '#1f6feb', borde: 'ninguno', ...oculto }),
        ghVersion: m(caja, { x: 504, y: 300, ancho: 196, alto: 34, radio: 17, relleno: '#57606a', borde: 'ninguno', texto: 'la versión vieja', tamano: 15, color: '#ffffff', ...oculto }),
        teclaCtrl: m(caja, { x: 220, y: 540, ancho: 150, alto: 96, radio: 14, texto: 'Ctrl', tamano: 40, peso: 800, relleno: 'papel', borde: 'texto', grosorBorde: 4, ...oculto }),
        teclaMas: m(texto, { x: 330, y: 540, texto: '+', tamano: 48, peso: 800, color: '#ffffff', ...oculto }),
        teclaLetra: m(caja, { x: 430, y: 540, ancho: 110, alto: 96, radio: 14, texto: 'A', tamano: 44, peso: 800, relleno: 'papel', borde: 'texto', grosorBorde: 4, ...oculto }),
        // El cuadro de "Commit changes"
        cmVelo: m(caja, { x: 320, y: 470, ancho: 616, alto: 756, radio: 0, relleno: '#000000', borde: 'ninguno', ...oculto }),
        cmDlg: m(caja, { x: 320, y: 470, ancho: 560, alto: 390, radio: 12, relleno: 'superficie', borde: 'borde', ...oculto }),
        cmTitulo: m(texto, { x: 70, y: 318, texto: 'Commit changes', tamano: 26, peso: 700, alineacion: 'inicio', ...oculto }),
        cmEtiqueta: m(texto, { x: 70, y: 372, texto: 'Commit message', tamano: 16, peso: 600, alineacion: 'inicio', ...oculto }),
        cmMensaje: m(caja, { x: 320, y: 418, ancho: 500, alto: 48, radio: 8, texto: 'Update catalogo.js', tamano: 18, peso: 400, borde: 'borde', grosorBorde: 2, ...oculto }),
        cmRama: m(texto, { x: 70, y: 490, texto: '◉ Commit directly to the main branch', tamano: 17, alineacion: 'inicio', ...oculto }),
        cmCancelar: m(caja, { x: 300, y: 590, ancho: 130, alto: 50, radio: 8, texto: 'Cancel', tamano: 18, peso: 600, ...oculto }),
        cmBoton: m(caja, { x: 480, y: 590, ancho: 200, alto: 50, radio: 8, texto: 'Commit changes', tamano: 18, peso: 600, relleno: VERDE_GH, borde: VERDE_GH, color: '#ffffff', ...oculto }),
        // Mientras GitHub publica
        espera: m(caja, { x: 320, y: 460, ancho: 460, alto: 280, radio: 18, icono: '⏳', tamanoIcono: 90, texto: 'GitHub publica tu página…', tamano: 24, peso: 700, ...oculto }),
    };

    const mano = m(texto, { x: 520, y: 760, texto: '👆', tamano: 56, ...oculto });

    // ---------------- Lo fijo: el título y el paso que toca ----------------
    // En el celular, el paso va ARRIBA: abajo flotan los controles del reproductor, y arriba a la
    // derecha los botones del zoom (por eso "Paso 1 de 6" va a la izquierda). El título no va: la
    // clase ya lo dice justo arriba.
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
        titulo: texto({ ...fijo.titulo, texto: 'Actualizar tu catalogo.js', peso: 800, escrito: 0 }),
        paso: texto({ ...fijo.paso, texto: '', peso: 800, color: 'acento', opacidad: 0 }),
        // En el celular, hasta el paso 1, el lugar del paso dice de qué se trata
        hacer: texto({ ...fijo.hacer, texto: angosta ? 'Actualizar tu catalogo.js' : '', peso: 800, opacidad: angosta ? 1 : 0, interlineado: 1.2 }),
    };
    const cam = camara({ x: fijo.cam.x, y: fijo.cam.y, ancho: fijo.cam.ancho, alto: fijo.cam.alto, mirarX: 320, mirarY: 440, zoom: fijo.cam.zoom, radio: 18 });

    // ---------------- Ayudas para la línea de tiempo ----------------
    const ver = (ids, dur = 0.45, en) => ({ pieza: ids, a: { opacidad: 1 }, dur, ...(en ? { en } : {}) });
    const sacar = (ids, dur = 0.4, en) => ({ pieza: ids, a: { opacidad: 0 }, dur, ...(en ? { en } : {}) });
    const cambiar = (id, a) => ({ pieza: id, a, dur: 0 });
    const paso = (n, hacer) => [
        { pieza: ['paso', 'hacer'], a: { opacidad: 0 }, dur: 0.25 },
        cambiar('paso', { texto: n ? `Paso ${n} de 6` : '¡Listo!' }),
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
    const leer = (subtitulo) => [{ espera: 'subtitulo' }, { espera: 0.3 }, { subtitulo, en: '>' }];
    const ids = (grupo) => Object.keys(grupo);

    const linea = [
        // ======== Para qué ========
        { capitulo: 'Para qué' },
        { pieza: 'titulo', a: { escrito: 1 }, dur: 1.2, curva: 'lineal' },
        { subtitulo: 'catalogo.js es el archivo que hace que tu página muestre lo que cargás en el editor.', en: 0.4 },
        ...leer('Cuando mejora (como ahora, con las fotos que se alejan), hay que cambiar tu copia. Es igual para todos y se hace una sola vez.'),
        { espera: 'subtitulo' },

        // ======== 1. Modo desarrollador ========
        { capitulo: '1. Modo desarrollador' },
        ...paso(1, 'En el editor, tocá 🧑‍💻 Modo desarrollador'),
        ver('mano', 0.3, '<'),
        { subtitulo: 'Entrá al editor con tu código, como siempre.', en: '<' },
        ...tocar('edDev', 200, 318),
        { pieza: 'velo', a: { opacidad: 0.45 }, dur: 0.3 },
        ver(['dlg', 'dlgTitulo', 'dlgEstado', 'dlgCopiar', 'dlgGithub', 'dlgCodigoFondo', 'dlgCodigo', 'dlgRevisar'], 0.45, '<0.1'),
        ...leer('Arriba te dice si tu página tiene la versión vieja. Abajo está el código nuevo.'),
        { pieza: 'dlgEstado', a: { resaltado: 1 }, dur: 0.3, en: '<' },
        { pieza: 'dlgEstado', a: { resaltado: 0 }, dur: 0.4, en: '+1.2' },
        { espera: 'subtitulo' },

        // ======== 2. Copiar ========
        { capitulo: '2. Copiar' },
        ...paso(2, 'Tocá 📋 Copiar todo'),
        ...tocar('dlgCopiar', 172, 294),
        cambiar('dlgCopiar', { texto: '✅ ¡Copiado!' }),
        { subtitulo: 'Listo: el código nuevo quedó copiado, como con Ctrl + C.', en: '<' },
        { espera: 'subtitulo' },

        // ======== 3. GitHub ========
        { capitulo: '3. Abrir GitHub' },
        ...paso(3, 'Tocá Abrir en GitHub'),
        ...tocar('dlgGithub', 440, 294),
        { subtitulo: 'Se abre tu catalogo.js en GitHub, listo para editar. Si te lo pide, entrá con tu cuenta.', en: '<' },
        sacar([...ids(editor), ...ids(panel)], 0.4),
        cambiar('url', { texto: '🔒 github.com/tu-usuario/catalogo/edit/main/catalogo.js' }),
        ver(['ghRuta', 'ghCancelar', 'ghCommit', 'ghPestana', 'ghCodigoFondo', 'ghCodigo', 'ghVersion'], 0.5),
        { espera: 'subtitulo' },

        // ======== 4. Pegar ========
        { capitulo: '4. Pegar' },
        ...paso(4, 'Hacé clic en el código y apretá Ctrl + A'),
        ...tocar('ghCodigoFondo', 360, 640),
        { subtitulo: 'Ctrl + A elige todo el código viejo.', en: '<' },
        ver(['teclaCtrl', 'teclaMas', 'teclaLetra'], 0.3),
        { pieza: 'ghSeleccion', a: { opacidad: 0.4 }, dur: 0.35, en: '+0.3' },
        { espera: 1.4 },
        ...paso(4, 'Apretá Ctrl + V: el nuevo queda encima del viejo'),
        cambiar('teclaLetra', { texto: 'V' }),
        { pieza: 'teclaLetra', a: { escala: 1.12 }, dur: 0.15 },
        { pieza: 'teclaLetra', a: { escala: 1 }, dur: 0.2 },
        { subtitulo: 'Ctrl + V pega el que copiaste. No hay que cambiarle nada.', en: '<' },
        { pieza: ['ghSeleccion', 'ghCodigo'], a: { opacidad: 0 }, dur: 0.3, en: '+0.4' },
        cambiar('ghCodigo', { color: CODIGO_TEXTO }),
        cambiar('ghVersion', { texto: 'la versión nueva ✓', relleno: VERDE_GH }),
        { pieza: 'ghCodigo', a: { opacidad: 1 }, dur: 0.5 },
        sacar(['teclaCtrl', 'teclaMas', 'teclaLetra'], 0.4, '<'),
        { espera: 'subtitulo' },

        // ======== 5. Guardar ========
        { capitulo: '5. Commit' },
        ...paso(5, 'Tocá Commit changes… y otra vez Commit changes'),
        ...tocar('ghCommit', 524, 190),
        { subtitulo: 'En GitHub, guardar un cambio se llama hacer un commit.', en: '<' },
        { pieza: 'cmVelo', a: { opacidad: 0.45 }, dur: 0.3 },
        ver(['cmDlg', 'cmTitulo', 'cmEtiqueta', 'cmMensaje', 'cmRama', 'cmCancelar', 'cmBoton'], 0.4, '<0.1'),
        ...leer('El mensaje ya viene escrito. Si Copilot escribe otro, también sirve: no hace falta esperarlo. Tocá el botón verde.'),
        ...tocar('cmBoton', 480, 590),
        sacar(ids(github).filter((id) => id !== 'espera'), 0.4),
        ver('espera', 0.5),
        ...paso(5, 'Esperá uno o dos minutos'),
        ...leer('GitHub tarda un poquito en publicar tu página con el archivo nuevo.'),
        { espera: 'subtitulo' },

        // ======== 6. Revisar ========
        { capitulo: '6. Revisar' },
        ...paso(6, 'En el editor, tocá Revisar de nuevo'),
        sacar('espera', 0.3, '<'),
        cambiar('url', { texto: '🔒 cfp401-ensenada.github.io/catalogos/editar/' }),
        cambiar('dlgCopiar', { texto: '📋 Copiar todo' }),
        ver([...ids(editor), ...ids(panel).filter((id) => id !== 'velo')], 0.4),
        { pieza: 'velo', a: { opacidad: 0.45 }, dur: 0.4, en: '<' },
        ...tocar('dlgRevisar', 320, 362),
        cambiar('dlgEstado', { texto: '✅ Tu página ya tiene la versión nueva', borde: VERDE }),
        { pieza: 'dlgEstado', a: { resaltado: 1, escala: 1.04 }, dur: 0.3 },
        { pieza: 'dlgEstado', a: { resaltado: 0, escala: 1 }, dur: 0.4, en: '+0.8' },
        { subtitulo: 'Si dice esto, ya está: las fotos alejadas se ven también en tu página.', en: '<' },
        { espera: 'subtitulo' },

        // ======== Listo ========
        { capitulo: '¡Listo!' },
        sacar('mano', 0.3),
        ...paso(0, 'Una sola vez, y tu catálogo queda al día'),
        { subtitulo: 'Tus productos, fotos y colores no se tocan: siguen en el editor, como antes.', en: '<' },
        { espera: 'subtitulo' },
        { espera: 2 },
    ];

    return {
        titulo: 'Actualizar tu catalogo.js',
        descripcion:
            'En el editor del catálogo tocás Modo desarrollador: te dice si tu página tiene la versión vieja de ' +
            'catalogo.js y te muestra la nueva. Tocás Copiar todo y Abrir en GitHub. En GitHub hacés clic en el ' +
            'código, Ctrl + A para elegirlo todo y Ctrl + V para pegar el nuevo encima, sin cambiarle nada. Tocás ' +
            'Commit changes dos veces, esperás uno o dos minutos y en el editor tocás Revisar de nuevo: si dice que ' +
            'tu página tiene la versión nueva, listo. Es una sola vez, y tus productos no se tocan.',
        ancho: W,
        alto: H,
        pausaFinal: 0.6,
        lectura: 13,
        piezas: { cam, ...ventana, ...editor, ...panel, ...github, mano, ...pantalla },
        linea,
    };
});
