// El plano de la Expo del CFP 401 (viernes 13/11/2026) para /expo/plano/.
//
// Las coordenadas salen de la vista satelital orientada por Maxi con los stands encima (12/11): en
// píxeles de esa captura × 1,5. La foto de fondo (public/expo/plano-satelite.jpg) cubre exactamente la
// VISTA, así que stands y techos coinciden. Herrería, carpintería y soldadura están afuera, a la derecha.
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
    { id: 'pc', nombre: 'Pens. Comp. y Test.', rotulo: 'Pens. · Comp. · y Test.', detalle: 'Pensamiento Computacional y Testing de Aplicaciones: Bingo, fotos con IA, juegos y catálogos hechos por los alumnos.', x: 293, y: 110, ancho: 84, alto: 78, color: '#00ffc6', nuestro: true },
    { id: 'textil', nombre: 'Textil', detalle: 'Textil de la Sede, el CIC y Punta Lara.', x: 400, y: 235, ancho: 395, alto: 101, color: '#a8d08d' },
    { id: 'herreria', nombre: 'Herrería', detalle: 'Herrería, construcción en seco, instalaciones sanitarias y EPS (afuera, a la derecha del edificio).', x: 1229, y: 95, ancho: 60, alto: 176, color: '#4fc3f7', vertical: true },
    { id: 'carpinteria', nombre: 'Carpintería', detalle: 'Carpintería (afuera, a la derecha del edificio).', x: 1088, y: 180, ancho: 60, alto: 191, color: '#bcaaa4', vertical: true },
    { id: 'soldadura', nombre: 'Soldadura', detalle: 'Soldadura (afuera, a la derecha del edificio).', x: 1232, y: 341, ancho: 60, alto: 152, color: '#ff8a65', vertical: true },
    { id: 'domotica', nombre: 'Domótica · Reparación de PC', rotulo: 'Domótica · Rep. PC', detalle: 'Domótica y Reparación de PC.', x: 229, y: 203, ancho: 71, alto: 138, color: '#ff7b7b', vertical: true },
    { id: 'imp3d', nombre: 'Impresión 3D · Op. software', rotulo: 'Impr. 3D · Op. soft.', detalle: 'Impresión 3D y Operador de software.', x: 227, y: 350, ancho: 80, alto: 122, color: '#c9a7ff', vertical: true },
    { id: 'habdig', nombre: 'Hab. Digitales PL', rotulo: 'Hab. · Dig. · PL', detalle: 'Habilidades Digitales de Punta Lara.', x: 227, y: 477, ancho: 81, alto: 102, color: '#ffb74d', vertical: true },
    { id: 'electricidad', nombre: 'Electricidad · Aires acond.', rotulo: 'Electric. · Aires ac.', detalle: 'Electricidad y Aires acondicionados.', x: 222, y: 595, ancho: 123, alto: 71, color: '#ff8cf0' },
    { id: 'peluqueria', nombre: 'Peluquería', detalle: 'Peluquería.', x: 407, y: 609, ancho: 206, alto: 57, color: '#fff176' },
    { id: 'gastro1', nombre: 'Gastronomía', detalle: 'Gastronomía.', x: 680, y: 908, ancho: 266, alto: 78, color: '#dce775' },
    { id: 'gastro2', nombre: 'Gastronomía', detalle: 'Gastronomía.', x: 963, y: 787, ancho: 75, alto: 281, color: '#80cbc4', vertical: true },
    { id: 'diseno-cic', nombre: 'Diseño gráfico · Estampados CIC', rotulo: 'Diseño · Estamp. · CIC', detalle: 'Diseño gráfico y Estampados del CIC.', x: 917, y: 375, ancho: 122, alto: 201, color: '#ffe0b2', vertical: true },
    { id: 'diseno-sede', nombre: 'Estampados · Diseño Sede', rotulo: 'Estamp. · Diseño Sede', detalle: 'Estampados y Diseño de la Sede.', x: 902, y: 593, ancho: 254, alto: 144, color: '#f48fb1' },
    { id: 'sonido', nombre: 'Sonido', detalle: 'Sonido.', x: 914, y: 306, ancho: 131, alto: 57, color: '#e8e8e8', servicio: true },
    { id: 'banos', nombre: 'Baños', detalle: 'Baños.', x: 1089, y: 396, ancho: 78, alto: 186, color: '#e8e8e8', vertical: true, servicio: true },
];

export const ENTRADA = { nombre: 'Entrada por calle H. Irigoyen', x: 536, y: 1059, ancho: 204, alto: 84 };

// Lo que se ve del plano (el viewBox del SVG): la foto satelital cubre justo esto
export const VISTA = { x: 180, y: 60, ancho: 1170, alto: 1125 };

export const MUESTRAS: Muestra[] = [
    { stand: 'peluqueria', titulo: 'Demostración de corte y peinado', hora: '16:30', minutos: 15, ejemplo: true },
    { stand: 'soldadura', titulo: 'Soldadura en vivo', hora: '17:15', minutos: 15, ejemplo: true },
    { stand: 'pc', titulo: '¿Cómo dibuja una computadora tu cara?', hora: '18:00', minutos: 15, ejemplo: true },
    { stand: 'gastro1', titulo: 'Degustación', hora: '18:45', minutos: 20, ejemplo: true },
    { stand: 'diseno-sede', titulo: 'Estampado de remeras en vivo', hora: '19:30', minutos: 15, ejemplo: true },
];
