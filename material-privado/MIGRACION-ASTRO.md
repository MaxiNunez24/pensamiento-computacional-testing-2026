# 🚧 Migración del curso a la plataforma interactiva (Astro/Starlight)

Guía para completar el re-autorado del curso durante el receso invernal. El **POC ya está hecho** en
la rama `dev`: Astro + Starlight con el motor de ejercicios interactivos (Pyodide + CodeMirror) y una
lección de muestra (`Funciones I`).

> Enfoque acordado: **re-autorar, no migrar mecánicamente**. Conservamos los temas y el orden, reusamos
> la prosa existente como borrador, pero rehacemos la *forma* de cada lección al modelo
> "concepto mínimo → ejercicio interactivo". Esto es, además, el repaso que el grupo necesita.

---

## Qué quedó montado en el POC

| Pieza | Ruta |
|-------|------|
| Config de Astro/Starlight | `astro.config.mjs` |
| Colección de contenido | `src/content.config.ts` |
| Estilos propios | `src/styles/custom.css` |
| Motor de ejercicio (cliente) | `src/scripts/ejercicio-python.ts` |
| Componente de ejercicio | `src/components/EjercicioPython.astro` |
| Landing | `src/content/docs/index.mdx` |
| Lección de muestra | `src/content/docs/clases/funciones-1.mdx` |

Comandos: `npm run dev` (desarrollo), `npm run build` (genera `dist/`), `npm run preview`.

Lo que Starlight ya da de fábrica (no hay que construirlo): **buscador** (Pagefind), **dark mode**,
**botón de copiar código**, y **navegación anterior/siguiente** automática (¡no más nav al pie a mano!).

---

## El componente `<EjercicioPython>`

El corazón de la plataforma. El alumno escribe código, lo ejecuta (Pyodide corre Python real en el
navegador) y lo verifica contra tests ocultos, con feedback ✅/❌ al instante.

```mdx
import EjercicioPython from '../../../components/EjercicioPython.astro';

<EjercicioPython
  titulo="Tu primera función"
  dificultad="🌱"
  starter={`def saludar(nombre):\n    pass`}
  tests={`assert saludar("Ana") == "¡Hola, Ana!", 'saludar("Ana") debería dar "¡Hola, Ana!"'`}
  pistas={["Usá <code>return</code>, no <code>print</code>.", "Probá una f-string."]}
  solucion={`def saludar(nombre):\n    return f"¡Hola, {nombre}!"`}
>
La **consigna en Markdown** va acá adentro, con ejemplo de entrada/salida.
</EjercicioPython>
```

### Cómo escribir buenos ejercicios

- **`tests`**: son `assert` de Python. Ponéles **mensaje** (`assert ..., "qué esperaba"`) porque es
  lo que ve el alumno al fallar. Cubrí varios casos, incluyendo bordes (0, listas vacías, negativos).
- **`starter`**: el esqueleto mínimo (firma + comentario), nunca la solución.
- **`pistas`**: guían el pensamiento (preguntas/analogías). Aceptan HTML simple. No des el código.
- **`solucion`**: opcional, detrás de un `<details>`. Mejor que el alumno llegue por los tests.
- El nombre de la función/variable que piden los tests debe coincidir con el de la consigna.

> El motor (`ejercicio-python.ts`) carga Pyodide **una sola vez por página** (perezosamente, en la
> primera ejecución) y lo comparte entre todos los ejercicios. La primera corrida tarda unos segundos
> (descarga ~10 MB del CDN de jsdelivr); después es instantáneo y queda cacheado.

---

## Reglas de conversión por sintaxis (MkDocs → interactivo)

| MkDocs (sitio actual) | Plataforma interactiva |
|-----------------------|------------------------|
| `!!! info "T"` | `:::note[T]` |
| `!!! tip "T"` | `:::tip[T]` |
| `!!! warning "T"` | `:::caution[T]` |
| `!!! danger "T"` | `:::danger[T]` |
| `!!! example` / `!!! success` | `:::note[...]` con título, o un aside custom |
| `??? success "Solución"` | prop `solucion` del `<EjercicioPython>` |
| `??? tip "Pista"` | prop `pistas` del `<EjercicioPython>` |
| `=== "tab"` (comparación ❌/✅) | en general, **un ejercicio interactivo** lo reemplaza |
| Nav `[⬅️][📚][➡️]` al pie | se borra (Starlight la genera sola) |

Cada clase que use tabs, asides con título, o ejercicios pasa a `.mdx` (no `.md`).

---

## Plan de re-autorado (orden sugerido)

1. Re-autorar **tema por tema** siguiendo el orden del curso. Empezar por lo que el grupo necesita
   repasar (funciones, listas, colecciones) — el repaso y la migración se hacen de una.
2. Por cada tema: copiar la prosa del `.md` de MkDocs como borrador → recortar teoría → partir en
   ciclos cortos concepto→ejercicio → convertir las prácticas a `<EjercicioPython>`.
3. Incorporar el **hilo de librería estándar**: introducir módulos (`datetime`, `pathlib`,
   `collections`, `csv`, `itertools`) "justo a tiempo" cuando un ejercicio los necesite.
4. Imágenes: mover a `src/assets/` y referenciarlas con rutas relativas (Astro las optimiza), o a
   `public/` si se quiere ruta fija `/imagen.png`.
5. Actualizar el `sidebar` en `astro.config.mjs` a medida que se agregan clases.

---

## Pendientes técnicos antes del lanzamiento

- [ ] **Comando `generar-clase`**: actualizarlo para emitir el formato interactivo (asides +
      `<EjercicioPython>`), sin soluciones spoiler. (Bloqueado en el POC por permisos de
      auto-modificación del agente — pedir OK explícito.)
- [ ] **`site` en `astro.config.mjs`**: setear la URL final (para sitemap y canonical).
- [ ] **Deploy**: workflow de GitHub Actions que haga `npm run build` y publique `dist/` en GitHub
      Pages **solo desde `main`** (la rama `dev` se pushea pero NO se despliega).
- [ ] **Mermaid**: el curso usa diagramas; agregar una integración (`astro-mermaid` o `rehype-mermaid`)
      cuando se migre una clase que los use. No se incluyó en el POC para mantenerlo enfocado.
- [ ] **Cutover**: cuando todo esté migrado, retirar `docs/` + `mkdocs.yml` (o archivarlos en
      `material-privado/`).

---

## Ideas a futuro (Brilliant-style)

- Más tipos de ejercicio: **opción múltiple**, **completar el código**, **ordenar líneas** y
  **drag-and-drop**.
- Barra de progreso por clase / "racha" de ejercicios resueltos.
- Guardar el progreso del alumno en `localStorage`.
- Tests por caso (mostrar ✅/❌ test por test, no solo el primer fallo).
