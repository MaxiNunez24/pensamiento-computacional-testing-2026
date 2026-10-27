// ¿Quién llama a quién? El programa del catálogo, achicado a lo esencial:
// pagina() llama a tarjeta(), que llama a precio(). Es justo lo que costó en
// clase (23/10): el recorrido entre las funciones que ya vienen definidas y las
// llamadas. Sale de programas/catalogo-llamadas.py, trazado con
// scripts/trazar-animaciones.py; acá solo se dice dónde frenar a preguntar.
//
// El programa tiene las líneas CORTAS a propósito (menos de 50 caracteres): el
// código se achica para entrar en su caja, y con los f-strings del catálogo de
// verdad, en la columna de la clase no se leía.
//
// Las preguntas, los capítulos y las explicaciones van por NÚMERO DE PASO de la
// traza (desde 0). Si cambia el programa, cambian los pasos: hay que revisarlos.
//   0-2  los tres def       5  html = pagina(...)     9  pagina llama a tarjeta
//   10   tarjeta llama a precio    11  precio devuelve "$4500"    12  vuelve a tarjeta
//   14   tarjeta devuelve a pagina 16  la tarjeta del mate         24  print(html)
//
// Lo que importa acá es la PILA. Los diccionarios taza y mate, en la columna de
// la derecha, ocupaban tanto que la pila quedaba cortada abajo; y adentro de la
// pila, {'nombre': 'Taza', 'precio': '4500'} se achicaba hasta no leerse. Así
// que no se muestran sueltos (están en el código), y en la pila cada
// diccionario se nombra por la variable que es: producto vale taza.
import { registrar, desdeTraza } from 'motor-animaciones';
import traza from './trazas/catalogo-llamadas.json';

const OCULTAS = ['taza', 'mate'];

function porNombre(pasos) {
    const nombres = {};
    for (const paso of pasos) {
        for (const nombre of OCULTAS) {
            const v = paso.variables?.[nombre];
            if (v) nombres[v.repr] = nombre;
        }
    }
    const nombrar = (v) => {
        if (nombres[v.repr]) return { ...v, repr: nombres[v.repr] };
        if (v.items) return { ...v, repr: `[${v.items.map((i) => nombres[i] ?? i).join(', ')}]` };
        return v;
    };
    return pasos.map((paso) => ({
        ...paso,
        variables: Object.fromEntries(Object.entries(paso.variables ?? {}).filter(([n]) => !OCULTAS.includes(n))),
        pila: paso.pila?.map((marco) => ({
            ...marco,
            variables: Object.fromEntries(Object.entries(marco.variables).map(([n, v]) => [n, nombrar(v)])),
        })),
    }));
}

registrar('catalogo-llamadas', desdeTraza({
    ...traza,
    traza: porNombre(traza.traza),
    explicar: true,
    ritmo: 1.4,
    titulo: '¿Quién llama a quién?',
    archivo: 'catalogo.py',
    descripcion: 'Un catálogo chico, paso a paso: los def guardan las funciones sin ejecutarlas; '
        + 'pagina llama a tarjeta, que llama a precio, y cada una espera a que la otra le devuelva su resultado.',
    punteros: 'auto',
    capitulos: {
        0: 'Los def: guardar',
        5: 'Una llamada adentro de otra',
        11: 'La vuelta, con el resultado',
        15: 'Y otra vez, con el mate',
        24: 'El resultado',
    },
    explicaciones: {
        0: 'def no ejecuta la función: la guarda con su nombre, para usarla después.',
        2: 'Tres def, y todavía no corrió nada de adentro de ninguna.',
        4: 'taza es un diccionario con el nombre y el precio de un producto. mate, otro igual.',
        5: 'Recién acá empieza a trabajar: se llama a pagina(), con la lista de productos.',
        9: 'pagina llama a tarjeta. pagina no se termina: espera, con sus variables, en la pila.',
        10: 'Y tarjeta llama a precio. Ahora esperan dos: pagina y tarjeta.',
        12: 'El "$4500" que devolvió precio queda en p, adentro de tarjeta, que la llamó.',
        14: 'tarjeta le devolvió "Taza: $4500. " a pagina, que lo suma a tarjetas.',
        24: 'pagina devolvió todo, se guardó en html, y recién ahora se muestra.',
    },
    preguntas: {
        3: {
            pregunta: 'Ya pasaron los tres def. ¿Cuántas veces corrió lo que está adentro de precio?',
            opciones: ['Una vez', 'Ninguna: def solo la guarda', 'Tres veces'],
            correcta: 1,
            explicacion: 'def guarda la función con su nombre. Lo de adentro corre recién cuando alguien la llama.',
        },
        9: {
            pregunta: 'pagina llama a tarjeta. ¿Qué pasa con pagina mientras trabaja tarjeta?',
            opciones: ['Se termina y se borra', 'Espera, con sus variables, a que tarjeta le devuelva algo', 'Sigue con el for al mismo tiempo'],
            correcta: 1,
            explicacion: 'Una llamada es un viaje de ida y vuelta: pagina queda esperando en la pila, y sigue justo donde estaba cuando tarjeta le devuelve su resultado.',
        },
        11: {
            pregunta: 'precio terminó y devuelve "$4500". ¿Adónde va ese texto?',
            opciones: ['Se muestra en la pantalla', 'Vuelve a tarjeta, que la llamó, y queda en p', 'A pagina, que es la primera'],
            correcta: 1,
            explicacion: 'return le devuelve el valor a quien llamó a la función. Solo print muestra en la pantalla.',
        },
        16: {
            pregunta: 'Es el segundo producto. En todo el programa, ¿cuántas veces se llama a precio?',
            opciones: ['Una, porque ya se usó', 'Dos: una por producto', 'Tres: una por def'],
            correcta: 1,
            explicacion: 'Cada tarjeta llama a precio, y hay dos productos. Una función se puede llamar todas las veces que haga falta.',
        },
    },
}));
