// CONGELADO (12/11): los datos del plano anterior, el del plano oficial, para /expo/plano-original/.
// Los de verdad están en plano.ts.
// El plano de la Expo del CFP 401 (viernes 13/11/2026) para /expo/plano/.
//
// Las coordenadas salen del plano oficial del CFP, en píxeles de esa imagen (1280 de ancho): por eso
// el SVG de la página usa el mismo sistema y los stands quedan donde están en el papel.
//
// Las MUESTRAS ACTIVAS son lo que hay que actualizar cuando lleguen los horarios: con `ejemplo: true`
// la página las marca como horario de ejemplo, para que nadie las tome por confirmadas.

export interface Stand {
    id: string;
    nombre: string;
    detalle: string;
    x: number;
    y: number;
    ancho: number;
    alto: number;
    color: string;
    vertical?: boolean; // el nombre escrito de costado, como en el plano
    servicio?: boolean; // baños, sonido: se ven pero no son stands
    nuestro?: boolean;
    rotulo?: string; // lo que se lee en el plano, si no entra el nombre (" · " parte el renglón)
    catalogo?: string; // link al catálogo del stand: la ficha muestra el botón "Ver qué hay"
}

export interface Muestra {
    stand: string;
    titulo: string;
    hora: string; // "15:00"
    minutos: number;
    ejemplo?: boolean;
}

export const DIA = '2026-11-13';
export const ABRE = '16:00';
export const CIERRA = '21:00';

export const STANDS: Stand[] = [
    { id: 'pc', nombre: 'Pens. Comp. y Test.', rotulo: 'Pens. · Comp. · y Test.', detalle: 'Pensamiento Computacional y Testing de Aplicaciones: Bingo, fotos con IA, juegos y catálogos hechos por los alumnos.', x: 345, y: 143, ancho: 110, alto: 104, color: '#00ffc6', nuestro: true },
    { id: 'textil', nombre: 'Textil', detalle: 'Textil de la Sede, el CIC y Punta Lara.', x: 484, y: 157, ancho: 370, alto: 96, color: '#a8d08d' },
    { id: 'herreria', nombre: 'Herrería, soldadura, carpintería', rotulo: 'Herrería · soldadura · carpintería', detalle: 'Herrería, soldadura, carpintería, construcción en seco, instalaciones sanitarias y EPS.', x: 915, y: 175, ancho: 202, alto: 98, color: '#4fc3f7' },
    { id: 'domotica', nombre: 'Domótica · Reparación de PC', rotulo: 'Domótica · Rep. PC', detalle: 'Domótica y Reparación de PC.', x: 251, y: 196, ancho: 77, alto: 150, color: '#ff7b7b', vertical: true },
    { id: 'imp3d', nombre: 'Impresión 3D · Op. software', rotulo: 'Impr. 3D · Op. soft.', detalle: 'Impresión 3D y Operador de software.', x: 249, y: 352, ancho: 80, alto: 120, color: '#c9a7ff', vertical: true },
    { id: 'habdig', nombre: 'Hab. Digitales PL', rotulo: 'Hab. · Dig. · PL', detalle: 'Habilidades Digitales de Punta Lara.', x: 249, y: 476, ancho: 76, alto: 88, color: '#ffb74d', vertical: true },
    { id: 'electricidad', nombre: 'Electricidad · Aires acond.', rotulo: 'Electric. · Aires ac.', detalle: 'Electricidad y Aires acondicionados.', x: 259, y: 578, ancho: 136, alto: 64, color: '#ff8cf0' },
    { id: 'peluqueria', nombre: 'Peluquería', detalle: 'Peluquería.', x: 465, y: 588, ancho: 142, alto: 54, color: '#fff176' },
    { id: 'gastro1', nombre: 'Gastronomía', detalle: 'Gastronomía.', x: 782, y: 664, ancho: 192, alto: 54, color: '#dce775' },
    { id: 'gastro2', nombre: 'Gastronomía', detalle: 'Gastronomía.', x: 1061, y: 572, ancho: 52, alto: 192, color: '#80cbc4', vertical: true },
    { id: 'diseno-cic', nombre: 'Diseño gráfico · Estampados CIC', rotulo: 'Diseño · Estamp. · CIC', detalle: 'Diseño gráfico y Estampados del CIC.', x: 1057, y: 333, ancho: 86, alto: 138, color: '#ffe0b2', vertical: true },
    { id: 'diseno-sede', nombre: 'Estampados · Diseño Sede', rotulo: 'Estamp. · Diseño Sede', detalle: 'Estampados y Diseño de la Sede.', x: 1057, y: 478, ancho: 126, alto: 72, color: '#f48fb1' },
    { id: 'sonido', nombre: 'Sonido', detalle: 'Sonido.', x: 1057, y: 291, ancho: 86, alto: 38, color: '#e8e8e8', servicio: true },
    { id: 'banos', nombre: 'Baños', detalle: 'Baños.', x: 1147, y: 333, ancho: 42, alto: 138, color: '#e8e8e8', vertical: true, servicio: true },
];

export const ENTRADA = { nombre: 'Entrada por calle H. Irigoyen', x: 558, y: 798, ancho: 192, alto: 80 };

// Las paredes del plano: [x1, y1, x2, y2]
export const PAREDES: [number, number, number, number][] = [
    [83, 133, 1185, 133], [83, 133, 83, 655], [1185, 133, 1185, 785], [83, 655, 1052, 655],
    [265, 133, 265, 293], [83, 293, 265, 293], [83, 481, 265, 481],
    [337, 133, 337, 245], [462, 133, 462, 305], [462, 335, 462, 570],
    [265, 655, 265, 720], [265, 720, 395, 720], [395, 655, 395, 720],
    [462, 655, 462, 785], [462, 785, 592, 785], [722, 655, 722, 785], [722, 785, 1185, 785],
    [1052, 290, 1052, 785], [1052, 290, 1185, 290],
];

export const MUESTRAS: Muestra[] = [
    { stand: 'peluqueria', titulo: 'Demostración de corte y peinado', hora: '16:30', minutos: 15, ejemplo: true },
    { stand: 'herreria', titulo: 'Soldadura en vivo', hora: '17:15', minutos: 15, ejemplo: true },
    { stand: 'pc', titulo: '¿Cómo dibuja una computadora tu cara?', hora: '18:00', minutos: 15, ejemplo: true },
    { stand: 'gastro1', titulo: 'Degustación', hora: '18:45', minutos: 20, ejemplo: true },
    { stand: 'diseno-sede', titulo: 'Estampado de remeras en vivo', hora: '19:30', minutos: 15, ejemplo: true },
];
