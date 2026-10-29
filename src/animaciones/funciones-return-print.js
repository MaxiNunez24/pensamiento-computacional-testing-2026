// ¿return o print? Dos funciones casi iguales: una MUESTRA el doble y la otra
// lo DEVUELVE. Se ve igual en la pantalla, pero solo una deja algo para usar
// después; la otra deja None, y sumarle algo termina en el error de verdad
// (TypeError: None + 100). Es la caja "return no es print" de Funciones I.
//
// Sale de programas/funciones-return-print.py, trazado con
// scripts/trazar-animaciones.py. Las preguntas, los capítulos y las
// explicaciones van por NÚMERO DE PASO (desde 0); si cambia el programa, hay
// que revisarlos:
//   2  a = doble(4500)            4  doble devuelve 9000
//   5  b = mostrar_doble(4500)    7  mostrar_doble muestra 9000 y devuelve None
//   9  print(b + 100)             10 TypeError
import { registrar, desdeTraza } from 'motor-animaciones';
import traza from './trazas/funciones-return-print.json';
import { conLineaGrande } from '../scripts/linea-grande';

registrar('funciones-return-print', conLineaGrande(desdeTraza({
    ...traza,
    explicar: true,
    ritmo: 1.4,
    titulo: '¿return o print?',
    archivo: 'funciones.py',
    descripcion: 'Dos funciones casi iguales: una muestra el doble con print y la otra lo devuelve con return. '
        + 'Solo la que devuelve deja algo guardado; la otra deja None, y sumarle algo da error.',
    capitulos: {
        0: 'Dos funciones',
        2: 'La que devuelve',
        5: 'La que muestra',
        9: 'Usar lo que quedó',
    },
    explicaciones: {
        0: 'Dos funciones casi iguales: mostrar_doble MUESTRA el doble, y doble lo DEVUELVE.',
        4: 'doble devuelve 9000: vuelve a quien la llamó, y queda guardado en a.',
        7: 'mostrar_doble mostró 9000 en la pantalla… pero no tiene return: devuelve None.',
        8: 'Por eso b vale None. El 9000 se vio, pero no quedó guardado en ningún lado.',
        10: 'None + 100 no se puede: TypeError. Es el error de verdad cuando a una función le falta el return.',
    },
    preguntas: {
        2: {
            pregunta: 'doble termina con return precio * 2. ¿Qué va a quedar guardado en a?',
            opciones: ['9000', 'None', 'Nada: no muestra nada en la pantalla'],
            correcta: 0,
            explicacion: 'return devuelve el valor a quien llamó a la función, y el = lo guarda en a. No hace falta que se vea.',
        },
        5: {
            pregunta: 'mostrar_doble hace print(precio * 2) y no tiene return. ¿Qué va a quedar guardado en b?',
            opciones: ['9000', 'None: no devolvió nada', '"9000", como texto'],
            correcta: 1,
            explicacion: 'print muestra, pero no devuelve. Una función sin return devuelve None, y eso es lo que se guarda.',
        },
        9: {
            pregunta: 'b vale None. ¿Qué pasa con print(b + 100)?',
            opciones: ['Muestra 9100', 'Muestra None100', 'Da un error'],
            correcta: 2,
            explicacion: 'None no es un número: no se le puede sumar 100. Python corta con un TypeError.',
        },
    },
})));
