// Las clases de Páginas web, en orden. Las usan /web/, por bloques, y el camino
// del curso, todas seguidas en "Llevarlo a la web". Una clase nueva es una línea
// acá, y aparece en los dos.

export const CATALOGO = {
    ruta: 'web/catalogo',
    nombre: '🛍️ Tu catálogo con Python',
    nota: 'Un catálogo publicado en internet, con botón de WhatsApp, armado por Python desde una planilla.',
};

export const BLOQUES_WEB = [
    {
        nombre: '🧱 HTML',
        meta: 'La estructura: qué hay en la página',
        paradas: [
            { ruta: 'web/html-estructura', nombre: 'HTML I · Tu primera página',
                nota: 'Qué es una etiqueta, el esqueleto de toda página, títulos y párrafos.' },
            { ruta: 'web/html-contenido', nombre: 'HTML II · Listas, links e imágenes',
                nota: 'Todo lo que va adentro de una página de verdad.' },
            { ruta: 'web/html-semantica', nombre: 'HTML III · Etiquetas con significado, tablas y formularios',
                nota: 'Una página ordenada, la planilla de asistencia, y un formulario de inscripción.' },
        ],
    },
    {
        nombre: '🎨 CSS',
        meta: 'Cómo se ve',
        paradas: [
            { ruta: 'web/css-selectores', nombre: 'CSS I · Colores, letras y la cascada',
                nota: 'Cómo se elige qué pintar, y qué pasa cuando dos reglas se pelean.' },
            { ruta: 'web/css-caja', nombre: 'CSS II · El modelo de caja',
                nota: 'Todo es una caja: el relleno, el borde, el margen, y cómo centrar.' },
            { ruta: 'web/css-flex-grid', nombre: 'CSS III · Flexbox y Grid',
                nota: 'Poner cosas una al lado de la otra, y la grilla del catálogo.' },
            { ruta: 'web/css-responsive', nombre: 'CSS IV · Que se vea bien en el celular',
                nota: 'Media queries, variables y modo oscuro.' },
        ],
    },
    {
        nombre: '⚡ JavaScript',
        meta: 'Que responda',
        paradas: [
            { ruta: 'web/js-desde-python', nombre: 'JavaScript I · Para quien ya sabe Python',
                nota: 'Todo lo que ya sabés, escrito de otra forma. Al lado de su equivalente en Python.' },
            { ruta: 'web/js-dom', nombre: 'JavaScript II · Leer y cambiar la página',
                nota: 'El DOM: que tu programa toque la página.' },
            { ruta: 'web/js-eventos', nombre: 'JavaScript III · Eventos',
                nota: 'Que pase algo al hacer clic o al escribir: un buscador para el catálogo.' },
            { ruta: 'web/js-datos', nombre: 'JavaScript IV · Datos, JSON y localStorage',
                nota: 'Filtrar, ordenar, y que la página se acuerde de cosas.' },
        ],
    },
];

export const CLASES_WEB = [CATALOGO, ...BLOQUES_WEB.flatMap((bloque) => bloque.paradas)];
