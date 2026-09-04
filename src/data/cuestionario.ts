/**
 * La definición del cuestionario del CFP, en un solo lugar.
 *
 * La usan DOS páginas: /cuestionario/ para preguntarlo y /respuestas/ para leer
 * lo que contestaron. Si las etiquetas vivieran duplicadas en las dos, el día
 * que se cambie una pregunta las respuestas viejas quedarían rotuladas con el
 * texto nuevo — o peor, mostrando el id crudo del campo.
 */

export interface Rol {
  id: string;
  emoji: string;
  nombre: string;
  aclaracion?: string;
}

export interface Campo {
  id: string;
  etiqueta: string;
  ayuda?: string;
  /** Por defecto es una caja de texto. 'opciones' lo vuelve multiple choice. */
  tipo?: 'texto' | 'opciones';
  /** Solo con tipo 'opciones'. Se muestran de a dos por fila. */
  opciones?: string[];
  filas?: number;
  ejemplo?: string;
}

export interface Bloque {
  id: string;
  numero: string;
  titulo: string;
  de?: 'alumno' | 'clase';
  ayuda?: string;
  campos: Campo[];
  soloRoles?: string[];
}

export const roles: Rol[] = [
    { id: 'direccion', emoji: '🏛️', nombre: 'Dirección' },
    { id: 'regencia', emoji: '📐', nombre: 'Regencia' },
    { id: 'secretaria', emoji: '🗂️', nombre: 'Secretaría' },
    { id: 'preceptoria', emoji: '📋', nombre: 'Preceptoría' },
    { id: 'instructores', emoji: '🧑‍🏫', nombre: 'Instructor/a', aclaracion: 'doy clases en algún curso' },
    { id: 'auxiliares', emoji: '🧰', nombre: 'Auxiliar' },
    { id: 'otro', emoji: '❓', nombre: 'Otra función', aclaracion: 'cuéntenos cuál en la pregunta 1' },
  ];

export const bloques: Bloque[] = [
    {
      id: 'responsable',
      numero: '1',
      titulo: '¿De qué es responsable?',
      de: 'alumno',
      ayuda: 'Sin detallar: solo los <strong>verbos</strong> que describen su trabajo.',
      campos: [
        {
          id: 'verbos',
          etiqueta: 'Los verbos de su trabajo',
          ayuda: 'Uno atrás del otro, como se le vengan a la cabeza.',
          ejemplo: 'Ej.: redactar, copiar, transcribir, investigar, controlar, ordenar, archivar, atender…',
          filas: 3,
        },
      ],
    },
    {
      id: 'reporta',
      numero: '2',
      titulo: '¿A quién le reporta los resultados de su trabajo?',
      de: 'alumno',
      campos: [
        {
          id: 'reporta',
          etiqueta: '¿A quién?',
          ayuda: 'Puede ser más de uno, y puede ser alguien de afuera del CFP.',
          ejemplo: 'Ej.: a dirección, y una vez por mes a la región',
          filas: 2,
        },
      ],
    },
    {
      id: 'circuito',
      numero: '3',
      titulo: 'La información: qué le llega y a dónde va',
      de: 'clase',
      ayuda:
        'Se parece a la 2, pero no es lo mismo: ahí preguntamos a quién le <em>rinde cuentas</em>. ' +
        'Acá queremos dibujar <strong>por dónde circula la información</strong> — qué entra, qué sale.',
      campos: [
        {
          id: 'entra',
          etiqueta: '¿Qué información necesita para poder trabajar, y quién se la da?',
          ayuda: 'Y sobre todo: <strong>¿cómo le llega?</strong> En papel, por mail, por WhatsApp, se lo dicen…',
          ejemplo: 'Ej.: las planillas de asistencia que me deja cada instructor en papel, a fin de semana',
          filas: 4,
        },
        {
          id: 'sale',
          etiqueta: 'Cuando termina, ¿a dónde va eso que hizo y para qué se usa?',
          ayuda: '¿Quién lo recibe y qué hace con eso?',
          ejemplo: 'Ej.: se lo paso a dirección, que lo firma y lo manda a la región',
          filas: 4,
        },
      ],
    },
    {
      id: 'datos',
      numero: '4',
      titulo: 'Administración de datos e información',
      de: 'alumno',
      ayuda: 'La parte del trabajo que es cargar, copiar, controlar o buscar datos.',
      campos: [
        {
          id: 'que_hace',
          etiqueta: '¿Qué hace?',
          ejemplo: 'Ej.: paso a mano las asistencias del papel a una planilla de Excel',
          filas: 3,
        },
        {
          id: 'cuanto_tiempo',
          etiqueta: '¿Cuánto tiempo le lleva cada vez?',
          ayuda: 'La opción más cercana alcanza. Si varía mucho, piense en un día normal.',
          tipo: 'opciones',
          /* Etiquetas cortas: entran de a dos por fila sin partirse en dos
             renglones, que era lo que descuadraba la grilla.

             Y sin solaparse. La lista original iba "más de media hora /
             alrededor de una hora / menos de dos horas": algo de 45 minutos
             entraba en las tres, y esa ambigüedad rompe justo lo que el
             multiple choice viene a resolver, que es poder comparar respuestas
             entre sí. Cada tramo empieza donde termina el anterior.

             Son OCHO y no nueve a propósito: cuatro filas exactas de a dos, sin
             una opción huérfana al final. */
          opciones: [
            'Segundos',
            '1 a 5 min',
            '5 a 10 min',
            '10 a 15 min',
            '15 a 30 min',
            '30 a 60 min',
            '1 a 2 hs',
            'Más de 2 hs',
          ],
        },
        {
          id: 'cada_cuanto',
          etiqueta: '¿Y cada cuánto lo hace?',
          ayuda: 'Sin esto lo de arriba no dice mucho: cinco minutos por día y cinco minutos por mes no son el mismo problema.',
          ejemplo: 'Ej.: todos los días / una vez por semana / a fin de mes',
          filas: 2,
        },
        {
          id: 'propuesta',
          etiqueta: '¿Qué necesitaría, y qué propondría para hacerlo más rápido?',
          ayuda: 'Esta es la más importante de todo el cuestionario. Sin filtro, aunque parezca imposible.',
          ejemplo: 'Ej.: que no tuviera que copiar dos veces lo mismo',
          filas: 4,
        },
      ],
    },
    {
      id: 'planillas',
      numero: '5',
      titulo: 'Las planillas e informes que completa',
      de: 'alumno',
      ayuda:
        'Los <strong>nombres</strong>, como los llaman ustedes. No hace falta describirlos: ' +
        'con la lista alcanza, después le preguntamos.',
      campos: [
        {
          id: 'planillas',
          etiqueta: 'Nombres de las planillas, informes, actas…',
          ayuda: 'Los que completa usted solo/a y también los que se completan entre varios.',
          ejemplo: 'Ej.: planilla mensual de asistencia, acta de reunión, libro de temas…',
          filas: 4,
        },
      ],
    },
    {
      id: 'inspector',
      numero: '6',
      titulo: 'La inspección',
      de: 'clase',
      soloRoles: ['direccion', 'regencia', 'secretaria', 'preceptoria'],
      ayuda: 'Esta se la hacemos porque cambió el inspector y queremos entender qué se le va a pedir al CFP.',
      campos: [
        {
          id: 'inspector',
          etiqueta: '¿Qué información necesita la inspección para evaluar al CFP?',
          ayuda: '¿Y cada cuánto la pide? Si cambió algo con el inspector nuevo, cuéntenos qué.',
          ejemplo: 'Ej.: matrícula y asistencia por curso, todos los meses',
          filas: 4,
        },
      ],
    },
    {
      id: 'libre',
      numero: '7',
      titulo: '¿Qué no le preguntamos?',
      de: 'clase',
      ayuda: 'La última, y suele ser la que más sirve.',
      campos: [
        {
          id: 'libre',
          etiqueta: 'Algo que deberíamos haber preguntado y no se nos ocurrió',
          ayuda: 'También vale: “esto que están haciendo no me sirve para nada”. Preferimos saberlo ahora.',
          filas: 4,
        },
      ],
    },
  ];
