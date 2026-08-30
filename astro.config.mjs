// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

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
      ],
      // El buscador (Pagefind), el dark mode y el botón de copiar código
      // vienen de fábrica con Starlight.
      sidebar: [
        { label: '🏠 Inicio', link: '/' },
        { label: '👋 Cómo usar esta plataforma', link: '/clases/como-usar-esto/' },
        { label: '🧪 Probador libre', link: '/probador/' },
        // Arriba de todo a propósito: es lo que hay que mirar primero mientras
        // el grupo esté atrasado. Se tilda sola leyendo el progreso guardado.
        { label: '🧭 Por dónde empezar', link: '/camino/' },
        { label: '✅ Ponerse al día', link: '/al-dia/' },
        { label: '🗺️ El proyecto, por partes', link: '/proyecto/' },
        { label: '📋 Tablero del proyecto', link: '/tablero/' },
        // Va junto al tablero porque son las dos pantallas compartidas:
        // lo que ve toda la clase, no lo que cada uno tiene guardado.
        { label: '💬 Soluciones de la clase', link: '/foro/' },
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
        // Va acá y no antes: los ejercicios de eficiencia se resuelven con
        // funciones, listas, sets y diccionarios — o sea, todo el Bloque 2. Es
        // el primer momento del curso en que se puede comparar DOS soluciones
        // correctas y discutir cuál conviene.
        {
          label: '🧠 Lógica y eficiencia',
          items: [
            { label: '✏️ Pensar antes de escribir', link: '/clases/logica-pensar/' },
            { label: '⏱️ Eficiencia', link: '/clases/logica-eficiencia/' },
            { label: '🏁 Desafíos de optimización', link: '/clases/logica-desafios/' },
          ],
        },
        {
          label: '🛠️ Bloque 3 — Persistencia',
          items: [
            { label: '🐙 Git desde VS Code', link: '/clases/git-vscode/' },
            { label: '💾 Manejo de archivos', link: '/clases/archivos/' },
            { label: '📋 JSON', link: '/clases/json/' },
          ],
        },
        {
          label: '🧰 Herramientas de Python',
          items: [
            { label: '🎁 Lo que Python hace por vos', link: '/clases/lo-que-python-hace-por-vos/' },
          ],
        },
        {
          label: '🏗️ POO',
          items: [
            { label: '🧬 POO I — Clases y objetos', link: '/clases/poo-1/' },
            { label: '🛡️ POO II — Encapsulamiento', link: '/clases/poo-2/' },
            { label: '🔗 Herencia y polimorfismo', link: '/clases/poo-herencia/' },
          ],
        },
        {
          label: '🧪 Testing',
          items: [
            { label: '🧪 Testing I — probar en serio', link: '/clases/testing-1/' },
          ],
        },
      ],
    }),
  ],
});
