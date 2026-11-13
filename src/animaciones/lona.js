/**
 * La versión "de lona" de una escena: la misma animación, pero sin subtítulos.
 *
 * En la lona del stand (src/pages/expo/proyector.astro) los subtítulos no se muestran, pero la
 * escena igual se frenaba esperando que se leyeran ({ espera: 'subtitulo' }): la gente veía la
 * animación quieta varios segundos y parecía trabada. Acá se sacan los subtítulos y esas esperas,
 * y la animación corre de corrido.
 *
 *     registrarConLona('expo-fotos-ia', fabrica)   // registra 'expo-fotos-ia' y 'expo-fotos-ia-lona'
 *
 * La fábrica recibe un segundo argumento { lona: true } por si quiere acortar algo más (por ejemplo,
 * cuánto se queda quieta entre un paso y otro).
 */
import { registrar } from 'motor-animaciones';

/** Saca los subtítulos y las esperas de lectura de la línea de tiempo de una escena. */
export function sinSubtitulos(escena) {
    const linea = escena.linea.filter((paso) => {
        if (!paso || typeof paso !== 'object') return true;
        if (paso.espera === 'subtitulo') return false;
        // Un subtítulo solo (sin pieza que animar) no hace nada en la lona
        if ('subtitulo' in paso && !('pieza' in paso)) return false;
        return true;
    });
    return { ...escena, linea };
}

export function registrarConLona(id, fabrica) {
    registrar(id, (disposicion) => fabrica(disposicion, { lona: false }));
    registrar(id + '-lona', (disposicion) => sinSubtitulos(fabrica(disposicion, { lona: true })));
}
