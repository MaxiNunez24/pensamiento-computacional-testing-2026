// Las animaciones del motor (<Animacion>): cargar cada escena cuando hace falta
// y llevar el progreso de las lecciones que preguntan.
//
// Cada escena es un módulo en src/animaciones/<nombre>.js que se registra solo.
// import.meta.glob hace un archivo por escena: una página carga el motor una vez
// y SOLO las escenas que usa, no las del curso entero.
//
// Una lección con título cuenta como ejercicio (como los ❓ de opción múltiple):
// se da por hecha cuando se contestaron todas sus preguntas. Bien o mal: la
// pregunta es para predecir antes de ver, no un examen.

import { estaHecho, marcarHecho, pintarSello, actualizarResumen } from './progreso';

const escenas = import.meta.glob('../animaciones/*.js');

function cargarEscenas() {
    const pedidas = new Set<string>();
    document.querySelectorAll<HTMLElement>('[data-animacion]').forEach((el) => {
        const nombre = el.getAttribute('escena') ?? '';
        if (pedidas.has(nombre)) return;
        pedidas.add(nombre);
        const cargar = escenas[`../animaciones/${nombre}.js`];
        if (cargar) cargar();
        else console.warn(`No existe la escena "${nombre}" (src/animaciones/${nombre}.js)`);
    });
}

function seguirProgreso() {
    document.querySelectorAll<HTMLElement>('section.animacion[data-titulo]').forEach((seccion) => {
        const titulo = seccion.dataset.titulo!;
        pintarSello(seccion, estaHecho(titulo));
        const contestadas = new Set<string>();
        seccion.addEventListener('respuesta', (e) => {
            const leccion = seccion.querySelector<HTMLElement & { compilada?: { marcas?: { tipo: string }[] } }>('[data-animacion]');
            const total = (leccion?.compilada?.marcas ?? []).filter((m) => m.tipo === 'pregunta').length;
            contestadas.add(String((e as CustomEvent).detail?.pregunta ?? contestadas.size));
            if (total && contestadas.size >= total && !estaHecho(titulo)) {
                marcarHecho(titulo);
                pintarSello(seccion, true);
                actualizarResumen();
            }
        });
    });
}

// El motor se importa recién acá: una página sin animaciones no lo baja nunca
// (este script solo está en las páginas que usan <Animacion>).
import('motor-animaciones').then(() => {
    cargarEscenas();
    seguirProgreso();
});
