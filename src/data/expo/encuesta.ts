/**
 * La encuesta de los cursos 2027 (/expo/encuesta/): las opciones, con el código que se guarda y lo que
 * se lee. La usan la página de la encuesta y el panel (para contar). El Worker de los catálogos tiene
 * los mismos códigos en ENCUESTA (worker/catalogos.js): si se agrega uno acá, va también allá.
 */

export const CURSOS = [
    { codigo: 'ia', texto: 'Usuaria/o de IA generativa', detalle: 'Usar la IA para escribir, dibujar, estudiar y trabajar' },
    { codigo: 'web', texto: 'Programador/a Web', detalle: 'Hacer páginas y aplicaciones web de cero' },
    { codigo: 'los-dos', texto: 'Los dos', detalle: '' },
] as const;

export const DIAS = [
    { codigo: 'lunes', texto: 'Lunes' },
    { codigo: 'martes', texto: 'Martes' },
    { codigo: 'miercoles', texto: 'Miércoles' },
    { codigo: 'jueves', texto: 'Jueves' },
    { codigo: 'viernes', texto: 'Viernes' },
    { codigo: 'sabado', texto: 'Sábado' },
] as const;

export const HORARIOS = [
    { codigo: 'manana', texto: 'Mañana', detalle: '8 a 12' },
    { codigo: 'mediodia', texto: 'Mediodía', detalle: '12 a 14' },
    { codigo: 'tarde', texto: 'Tarde', detalle: '14 a 18' },
    { codigo: 'noche', texto: 'Noche', detalle: '18 a 22' },
] as const;

/** Una respuesta como la guarda el Worker (claves cortas: van en la metadata de KV, que tiene 1 KB). */
export interface Respuesta {
    /** curso */
    c: string;
    /** días */
    d: string[];
    /** horarios */
    h: string[];
    /** fecha, AAAA-MM-DDTHH:MM (UTC) */
    f: string;
    /** nombre, solo con consentimiento */
    n?: string;
    /** WhatsApp, solo con consentimiento */
    w?: string;
    /** comentario */
    k?: string;
}
