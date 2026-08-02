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
      ],
      // El buscador (Pagefind), el dark mode y el botón de copiar código
      // vienen de fábrica con Starlight.
      sidebar: [
        { label: '🏠 Inicio', link: '/' },
        { label: '👋 Cómo usar esta plataforma', link: '/clases/como-usar-esto/' },
        {
          label: '🌱 Bloque 1 — Fundamentos',
          items: [
            { label: '🖨️ La función print()', link: '/clases/print/' },
            { label: '📊 Variables y tipos', link: '/clases/variables/' },
            { label: '⌨️ La función input()', link: '/clases/input/' },
            { label: '🔀 Condicionales', link: '/clases/condicionales/' },
            { label: '🔁 Bucles — while y for', link: '/clases/bucles/' },
            { label: '📋 Listas', link: '/clases/listas/' },
            { label: '📒 Cuadernillo de listas', link: '/clases/cuadernillo-listas/' },
          ],
        },
        {
          label: '🌿 Bloque 2 — Colecciones y funciones',
          items: [
            { label: '🎲 Tuplas', link: '/clases/tuplas/' },
            { label: '🗝️ Sets', link: '/clases/sets/' },
            { label: '📔 Diccionarios', link: '/clases/diccionarios/' },
            { label: '📦 Funciones I', link: '/clases/funciones-1/' },
            { label: '🎛️ Funciones II', link: '/clases/funciones-2/' },
            { label: '🔁 Repaso general', link: '/clases/repaso/' },
            { label: '🎰 Bingo — integrador', link: '/clases/bingo/' },
          ],
        },
        {
          label: '🛠️ Bloque 3 — Persistencia',
          items: [
            { label: '💾 Manejo de archivos', link: '/clases/archivos/' },
            { label: '📋 JSON', link: '/clases/json/' },
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
      ],
    }),
  ],
});
