// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Pensamiento Computacional 2026',
      // Sitio mono-lingüe en español: la raíz es 'es'.
      locales: {
        root: { label: 'Español', lang: 'es' },
      },
      customCss: ['./src/styles/custom.css'],
      // El buscador (Pagefind), el dark mode y el botón de copiar código
      // vienen de fábrica con Starlight.
      sidebar: [
        { label: '🏠 Inicio', link: '/' },
        {
          label: '📚 Clases (demo)',
          items: [
            { label: '📦 Funciones I — demo interactiva', link: '/clases/funciones-1/' },
          ],
        },
      ],
    }),
  ],
});
