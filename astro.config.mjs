// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';

// Las dos mitades del curso comparten un mismo GitHub Pages:
//   /pensamiento-computacional-testing-2026/            → MkDocs (teoría)
//   /pensamiento-computacional-testing-2026/ejercicios/ → esto (Astro)
// De ahí el `base`: sin él, todos los links y assets apuntarían a la raíz del
// dominio y darían 404 en producción.
const base = '/pensamiento-computacional-testing-2026/ejercicios';

// https://astro.build/config
export default defineConfig({
  site: 'https://maxinunez24.github.io',
  base,
  // gfm explícito: Astro 6.4 lo dejó como `undefined` al deprecarlo, y
  // @astrojs/mdx 5.0 hace {...defaults, ...markdownConfig} — ese undefined pisa
  // el default y GFM queda APAGADO solo para .mdx. Como todo el contenido es
  // .mdx, sin esta línea ninguna tabla se renderiza (salen los pipes crudos).
  markdown: { gfm: true },
  integrations: [
    starlight({
      title: 'Pensamiento Computacional 2026',
      // Sitio mono-lingüe en español: la raíz es 'es'.
      locales: {
        root: { label: 'Español', lang: 'es' },
      },
      // El mismo favicon que el sitio de teoría: son dos mitades de un curso,
      // no dos sitios. Sin esto Starlight busca /favicon.svg y da 404.
      favicon: '/favicon.ico',
      customCss: ['./src/styles/custom.css'],
      // Script propio: sidebars redimensionables (se sirve desde /public).
      // Ojo: la ruta lleva el `base` adelante. Si se deja "/sidebars-resizable.js"
      // a secas, en producción se busca en la raíz del dominio y da 404.
      head: [
        // ⚠️ Este va PRIMERO y SIN defer, a propósito: aplica el encabezado
        // plegado antes de que el navegador pinte. Con defer se vería el
        // encabezado aparecer y desaparecer en cada carga. Es el mismo truco
        // con el que Starlight evita el parpadeo del tema oscuro.
        {
          tag: 'script',
          content:
            "try{if(localStorage.getItem('pc:header')==='0')" +
            "document.documentElement.dataset.pcSinHeader=''}catch(e){}",
        },
        {
          tag: 'script',
          attrs: { src: `${base}/header-plegable.js`, defer: true },
        },
        {
          tag: 'script',
          attrs: { src: `${base}/sidebars-resizable.js`, defer: true },
        },
        {
          tag: 'script',
          attrs: { src: `${base}/sync-progreso.js`, defer: true },
        },
        {
          tag: 'script',
          attrs: { src: `${base}/indice-ejercicios.js`, defer: true },
        },
        {
          tag: 'script',
          attrs: { src: `${base}/copiar-texto.js`, defer: true },
        },
        {
          tag: 'script',
          attrs: { src: `${base}/tablero.js`, defer: true },
        },
        // Markdown renderiza `- [ ]` como checkbox DESHABILITADO. La lista de
        // "antes de que entre nadie" existe para tildarla mientras se prepara
        // la sala, así que esto las habilita y recuerda lo tildado.
        {
          tag: 'script',
          attrs: { src: `${base}/checklist.js`, defer: true },
        },
      ],
      // El buscador (Pagefind), el dark mode y el botón de copiar código
      // vienen de fábrica con Starlight.
      // 🧭 El menú en dos temas: arriba del sidebar se elige "El curso" o
      // "Para ir más allá", y cada uno muestra su propio menú. Así las
      // optativas no se mezclan con el curso. Plugin starlight-sidebar-topics
      // 0.8.0, fijo: la 0.9 pide Starlight 0.42 y Astro 7, y acá estamos en
      // 0.39 y 6.4.
      plugins: [
        starlightSidebarTopics(
          [
            {
              id: 'curso',
              label: 'El curso',
              link: '/',
              icon: 'open-book',
              items: [
              { label: '🏠 Inicio', link: '/' },
              { label: '👋 Cómo usar esta plataforma', link: '/clases/como-usar-esto/' },
              // Arriba de todo a propósito: es la vista del curso en el orden en que
              // se da, y se tilda sola leyendo el progreso guardado.
              //
              // Acá abajo estaba "✅ Ponerse al día" (el plan de los 27 ejercicios
              // mínimos hasta el 4/9). Se sacó el 15/9: el grupo llegó al día, así
              // que la página quedó sin nadie a quien servirle. Lo que contestaba
              // —"¿por dónde sigo?"— lo contesta el camino, y mejor, porque son
              // TODAS las clases y no un recorte con fecha de vencimiento.
              { label: '🧭 Por dónde empezar', link: '/camino/' },
              { label: '🗺️ El proyecto, por partes', link: '/proyecto/' },
              { label: '📋 Tablero del proyecto', link: '/tablero/' },
              // El mapa de casos de uso: lo que entendimos de como trabaja cada
              // rol. Se armó con lo que salió de la entrevista del 4/9 y se lleva a
              // cada reunión para que lo corrijan. (La entrevista en sí pasó a
              // Herramientas como "Kit para entrevistas": ya se hizo, y queda para la
              // próxima.)
              { label: '🗺️ Cómo trabaja cada uno', link: '/casos/' },
              // El cuestionario del CFP (/cuestionario/) NO va acá a propósito: se
              // llega solo por el link que se les manda. No es secreto —cualquiera
              // que tenga la URL entra— pero no tiene por qué aparecerle a un alumno
              // buscando una clase. La página además se excluye del buscador y le
              // pide a Google que no la indexe.
              // ⚠️ El orden de acá abajo NO es cosmético: es el orden en que se enseña,
              // y varias clases dependen de que lo anterior ya se haya visto.
              //   · Listas va ANTES que Bucles: `for` necesita algo que recorrer, y
              //     antes se lo pedía prestado a una clase posterior.
              //   · Funciones I va antes que las colecciones, así los ejercicios de
              //     tuplas/sets/diccionarios pueden pedir `def` en vez del rodeo
              //     `datos`/`correr()`.
              //   · Funciones II va DESPUÉS de las colecciones, y no junto a Funciones I:
              //     `*args` se explica como "una tupla" y `**kwargs` como "un
              //     diccionario". Adelantarla obligaría a explicar ambas cosas de prestado.
              {
                label: '🌱 Bloque 1 — Fundamentos',
                items: [
                  { label: '🖨️ La función print()', link: '/clases/print/' },
                  { label: '📊 Variables y tipos', link: '/clases/variables/' },
                  { label: '⌨️ La función input()', link: '/clases/input/' },
                  { label: '🔀 Condicionales', link: '/clases/condicionales/' },
                  { label: '📋 Listas', link: '/clases/listas/' },
                  { label: '🔁 Bucles — while y for', link: '/clases/bucles/' },
                  { label: '📒 Cuadernillo de listas', link: '/clases/cuadernillo-listas/' },
                  { label: '📝 Mini Parcial', link: '/clases/mini-parcial/' },
                ],
              },
              {
                label: '🌿 Bloque 2 — Funciones y colecciones',
                items: [
                  { label: '📦 Funciones I', link: '/clases/funciones-1/' },
                  { label: '🎲 Tuplas', link: '/clases/tuplas/' },
                  { label: '🗝️ Sets', link: '/clases/sets/' },
                  { label: '📔 Diccionarios', link: '/clases/diccionarios/' },
                  { label: '🎛️ Funciones II', link: '/clases/funciones-2/' },
                  { label: '🔁 Repaso general', link: '/clases/repaso/' },
                  { label: '🔍 Lectura y corrección', link: '/clases/lectura-codigo/' },
                  { label: '🎰 Bingo — integrador', link: '/clases/bingo/' },
                ],
              },
              // El Bloque 3 es POO y el proyecto, pegado al Bloque 2 (18/9). Antes el
              // 3 era "Versionado", pero Archivos y JSON pasaron a "Para ir más allá"
              // y solo quedaba Git, que ya se dio: ahora está en Herramientas.
              //   · El bot va pegado a POO: el Alumno que carga es la misma clase de
              //     POO I, con más datos y un método que dice si está lista.
              //   · SQLite va con el proyecto y no con Archivos: el sistema guarda en
              //     la base desde el principio.
              {
                label: '🏗️ Bloque 3 — POO y el proyecto',
                items: [
                  { label: '🧬 POO I — Clases y objetos', link: '/clases/poo-1/' },
                  { label: '🛡️ POO II — Encapsulamiento', link: '/clases/poo-2/' },
                  { label: '🤖 El bot del SiGeS', link: '/clases/bot-siges/' },
                  { label: '🚨 Excepciones', link: '/clases/excepciones/' },
                  { label: '🗃️ SQLite — los datos en una base', link: '/clases/sqlite/' },
                  { label: '🚀 Taller: el sistema por consola', link: '/clases/taller-consola/' },
                ],
              },
              {
                label: '🧰 Herramientas',
                items: [
                  { label: '🐙 Git desde VS Code', link: '/clases/git-vscode/' },
                  { label: '🎁 Lo que Python hace por vos', link: '/clases/lo-que-python-hace-por-vos/' },
                  { label: '🎤 Kit para entrevistas', link: '/entrevista/' },
                ],
              },
              {
                label: '🧪 Testing',
                items: [
                  { label: '🧪 Testing I — probar en serio', link: '/clases/testing-1/' },
                ],
              },
              { label: '🧪 Probador libre', link: '/probador/' },
              { label: '💬 Soluciones de la clase', link: '/foro/' },
              ],
            },
            {
              // Las optativas: no hacen falta para el proyecto. En el orden en
              // que se darían en el curso; una nueva es una página más y una
              // línea acá.
              id: 'mas-alla',
              label: 'Para ir más allá',
              link: '/mas-alla/',
              icon: 'rocket',
              items: [
                { label: '📝 Qué hay acá', link: '/mas-alla/' },
                { label: '💾 Manejo de archivos', link: '/clases/archivos/' },
                { label: '📋 JSON', link: '/clases/json/' },
                { label: '🔗 Herencia y polimorfismo', link: '/clases/poo-herencia/' },
                { label: '✏️ Pensar antes de escribir', link: '/clases/logica-pensar/' },
                { label: '⏱️ Eficiencia', link: '/clases/logica-eficiencia/' },
                { label: '🏁 Desafíos de optimización', link: '/clases/logica-desafios/' },
                { label: '📊 Aplicaciones de Python', link: '/mas-alla/aplicaciones/', badge: { text: 'en preparación', variant: 'caution' } },
                { label: '🔗 Referencias', link: '/mas-alla/referencias/' },
              ],
            },
          ],
          {
            // Fuera de los dos menús a propósito: se llega por un link que se
            // manda (el cuestionario) o son del profe.
            exclude: ['/cuestionario', '/respuestas'],
          },
        ),
      ],
    }),
  ],
});
