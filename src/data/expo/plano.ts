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
    forma?: string; // si no es un rectángulo (la L de Gastronomía): el contorno como path de SVG.
    // x, y, ancho y alto quedan para el nombre: la parte de la forma donde se escribe
}

export interface Muestra {
    stand?: string; // sin stand: algo de toda la Expo (la apertura)
    titulo: string;
    hora: string; // "15:00"
    minutos: number;
    detalle?: string; // lo que contó cada curso: sale en la ficha del stand
    desde?: boolean; // empieza a esa hora y sigue (se muestra "desde")
    todaLaTarde?: boolean; // sin hora: va en la lista "Durante toda la tarde"
    ejemplo?: boolean;
}

export const DIA = '2026-11-13';
export const ABRE = '16:00';
export const CIERRA = '21:00';

export const STANDS: Stand[] = [
    { id: 'pc', nombre: 'Pens. Comp. y Test.', rotulo: 'Pens. · Comp. · y Test.', detalle: 'Pensamiento Computacional y Testing de Aplicaciones: Bingo, fotos con IA, juegos y catálogos hechos por los alumnos.', x: 293, y: 110, ancho: 84, alto: 78, color: '#00ffc6', nuestro: true },
    { id: 'textil', nombre: 'Textil', detalle: 'Textil de la Sede, el CIC y Punta Lara.', x: 400, y: 235, ancho: 395, alto: 101, color: '#e1bee7' },
    { id: 'herreria', nombre: 'Herrería', detalle: 'Herrería y EPS (afuera, a la derecha del edificio).', x: 1181, y: 68, ancho: 136, alto: 70, color: '#4fc3f7' },
    { id: 'sanitarias', nombre: 'Instalaciones sanitarias', rotulo: 'Instalaciones · sanitarias', detalle: 'Instalaciones sanitarias (afuera, a la derecha del edificio, entre Herrería y Soldadura).', x: 1181, y: 148, ancho: 136, alto: 70, color: '#dce775' },
    { id: 'construccion', nombre: 'Construcción en seco', rotulo: 'Constr. · en seco', detalle: 'Construcción en seco (afuera, a la derecha del edificio, arriba de Carpintería).', x: 1088, y: 68, ancho: 60, alto: 104, color: '#9fa8da', vertical: true },
    { id: 'carpinteria', nombre: 'Carpintería', detalle: 'Carpintería (afuera, a la derecha del edificio).', x: 1088, y: 180, ancho: 60, alto: 191, color: '#bcaaa4', vertical: true },
    { id: 'soldadura', nombre: 'Soldadura', detalle: 'Soldadura (afuera, a la derecha del edificio).', x: 1181, y: 228, ancho: 136, alto: 70, color: '#ff8a65' },
    { id: 'domotica', nombre: 'Domótica · Reparación de PC', rotulo: 'Domótica · Rep. PC', detalle: 'Domótica y Reparación de PC.', x: 229, y: 203, ancho: 71, alto: 138, color: '#ff7b7b', vertical: true },
    { id: 'imp3d', nombre: 'Impresión 3D', rotulo: 'Impr. · 3D', detalle: 'Impresión 3D (comparte stand con Operador de software contable).', x: 227, y: 350, ancho: 120, alto: 60, color: '#c9a7ff' },
    { id: 'opsoft', nombre: 'Operador de software contable', rotulo: 'Op. soft. · contable', detalle: 'Operador de software contable (comparte stand con Impresión 3D).', x: 227, y: 412, ancho: 120, alto: 60, color: '#a8d08d' },
    { id: 'habdig', nombre: 'Hab. Digitales PL', rotulo: 'Hab. Dig. · PL', detalle: 'Habilidades Digitales de Punta Lara.', x: 227, y: 477, ancho: 120, alto: 60, color: '#ffb74d' },
    { id: 'electricidad', nombre: 'Electricidad · Aires acond.', rotulo: 'Electric. · Aires ac.', detalle: 'Electricidad y Aires acondicionados.', x: 222, y: 595, ancho: 123, alto: 71, color: '#ff8cf0' },
    { id: 'peluqueria', nombre: 'Peluquería', detalle: 'Peluquería.', x: 407, y: 609, ancho: 206, alto: 57, color: '#fff176' },
    // Una sola Gastronomía en L: abajo a lo largo y subiendo por la derecha, pegada a Estampados
    { id: 'gastronomia', nombre: 'Gastronomía', detalle: 'Gastronomía, Barman y Mozo.', x: 680, y: 908, ancho: 266, alto: 78, color: '#80cbc4',
        forma: 'M686 908 H946 V753 Q946 747 952 747 H1015 Q1021 747 1021 753 V980 Q1021 986 1015 986 H686 Q680 986 680 980 V914 Q680 908 686 908 Z' },
    { id: 'diseno-cic', nombre: 'Diseño gráfico · Estampados CIC', rotulo: 'Diseño · Estamp. · CIC', detalle: 'Diseño gráfico y Estampados del CIC.', x: 917, y: 375, ancho: 122, alto: 201, color: '#ffe0b2', vertical: true },
    { id: 'diseno-sede', nombre: 'Estampados · Diseño Sede', rotulo: 'Estamp. · Diseño Sede', detalle: 'Estampados y Diseño de la Sede.', x: 902, y: 593, ancho: 254, alto: 144, color: '#f48fb1' },
    { id: 'sonido', nombre: 'Sonido', detalle: 'Sonido.', x: 914, y: 306, ancho: 131, alto: 57, color: '#e8e8e8', servicio: true },
    { id: 'banos', nombre: 'Baños', detalle: 'Baños.', x: 1089, y: 396, ancho: 78, alto: 186, color: '#e8e8e8', vertical: true, servicio: true },
];

export const ENTRADA = { nombre: 'Entrada por calle H. Irigoyen', x: 536, y: 1059, ancho: 204, alto: 84 };

// Lo que se ve del plano (el viewBox del SVG): la foto satelital cubre justo esto
export const VISTA = { x: 180, y: 60, ancho: 1170, alto: 1125 };

// Las muestras activas que pasó la secretaría el 12/11 (las duraciones que no dijeron, 15 min)
export const MUESTRAS: Muestra[] = [
    { titulo: 'Palabras de apertura de la Expo', hora: '16:15', minutos: 15 },
    { stand: 'peluqueria', titulo: 'Cortes, peinados, mechas de fantasía y manicuría', hora: '16:30', minutos: 15, desde: true, detalle: 'Cortes, peinados y mechas de colores fantasía; las alumnas de Manicuría trabajan con técnicas de esmaltado y decoración.' },
    { stand: 'electricidad', titulo: 'Charla: panel de cámaras y alarmas', hora: '16:45', minutos: 15, detalle: 'Electricista MBT: breve charla sobre panel de cámaras y alarmas.' },
    { stand: 'pc', titulo: '¿Cómo dibuja la IA tu cara? Mini clase de programación y Kahoot', hora: '17:15', minutos: 15, detalle: 'Cómo hace una computadora para dibujarte en otro estilo, una mini clase sobre lo básico de la programación y una trivia con Kahoot desde el celular.' },
    { stand: 'habdig', titulo: 'Muestra de videos', hora: '17:30', minutos: 15, detalle: 'Habilidades Digitales: muestra de videos.' },
    { stand: 'gastronomia', titulo: 'Mozo: armado de mesa formal', hora: '18:00', minutos: 15, detalle: 'Demostración activa de armado de mesa formal.' },
    { stand: 'diseno-sede', titulo: 'Charla: las mesas y mini maquetas (temática Museo)', hora: '18:15', minutos: 15, detalle: 'Diseño gráfico, Estampados y Serigrafía: demostraciones continuas de los estudiantes, temática Museo; a esta hora, charla sobre la presentación de las mesas y mini maquetas.' },
    { stand: 'imp3d', titulo: 'Impresión 3D en funcionamiento', hora: '19:00', minutos: 10, detalle: 'Fabricación digital: cómo funciona la impresión FDM, con la impresora andando.' },
    { stand: 'carpinteria', titulo: 'Una habitación juvenil completa', hora: '19:20', minutos: 15, detalle: 'Ropero, escritorio, camas, amoblamiento en melamina y cama en madera maciza, con la explicación del proceso de fabricación.' },
    { stand: 'peluqueria', titulo: 'Desfile de peinados', hora: '20:00', minutos: 20, detalle: 'Desfile de peinados a cargo del curso de Peluquería.' },
    { stand: 'herreria', titulo: 'Parrilla, sillón colgante, juego de jardín y chulengo', hora: ABRE, minutos: 300, todaLaTarde: true, detalle: 'Presentación de artículos de herrería.' },
    { stand: 'electricidad', titulo: 'Aire recuperado y panel de demostración', hora: ABRE, minutos: 300, todaLaTarde: true, detalle: 'Instalación de aire acondicionado: exhibición de aire recuperado y panel de demostración.' },
    { stand: 'construccion', titulo: 'Una oficina hecha en construcción en seco', hora: ABRE, minutos: 300, todaLaTarde: true, detalle: 'Paneles masillados y cielorraso de PVC.' },
    { stand: 'gastronomia', titulo: 'Tostados, licuados, empanadas y más, a la venta', hora: ABRE, minutos: 300, todaLaTarde: true, detalle: 'Tostados de jamón y queso (solos o con un licuado), empanadas, prepizzas, panificados y sándwiches, con los cursos de Barman y Mozo.' },
];
