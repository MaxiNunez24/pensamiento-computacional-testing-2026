# 🧭 Plan: coexistencia MkDocs + Astro (borrador para el receso)

> **Privado / teacher-only.** Vive en `material-privado/` (fuera de `docs/`), NO se publica. Es un
> **plan a ejecutar en el receso**, no ahora. Cuando se implemente, reconciliar con la guía
> `material-privado/MIGRACION-ASTRO.md` (que vive en la rama `dev`).

## 1. La idea (en una frase)

**No migrar toda la prosa a Astro.** Que MkDocs y Astro **convivan**, cada uno haciendo lo que hace
mejor:

- **MkDocs** = la **explicación** (teoría, ejemplos, diagramas de lectura). Ya está hecho, desplegado,
  con buscador. Se queda como está… pero **más liviano**.
- **Astro** = lo **interactivo** (intérprete Python + tests, drag de diagramas de clase, quizzes,
  completar código). Ya tenemos el motor hecho en `dev`.

Las clases de MkDocs **linkean (en pestaña nueva)** al ejercicio correspondiente en Astro. Se **sacan
los ejercicios/pistas/soluciones inline de MkDocs** y se reemplazan por links. Astro pasa a ser un
**catálogo único de ejercicios** con sus tests.

**Por qué conviene:** separa responsabilidades, aliviana MkDocs, evita duplicar, y hace mantenible el
conjunto (una sola fuente de verdad para cada ejercicio). Y evita el trabajo enorme de re-escribir
toda la prosa en Astro.

## 2. Deploy de Astro — DECIDIDO: repo público aparte + GitHub Pages gratis

El bloqueante era que **GitHub Pages sirve un solo sitio por repo** (hoy ese sitio es MkDocs). Solución
elegida (viable y gratis): **un segundo repositorio público** solo para Astro, con **su propio GitHub
Pages**.

- URL resultante: `https://maxinunez24.github.io/<repo-astro>/` (falta elegir el **nombre** del repo,
  p. ej. `pc-ejercicios` o `pensamiento-computacional-ejercicios`).
- `astro.config.mjs`: setear **`site: 'https://maxinunez24.github.io'`** y **`base: '/<repo-astro>/'`**
  (Starlight respeta el `base` en todos los links internos y assets).
- **GitHub Action** en el repo nuevo: build (`pnpm build`) + publicar a Pages (usar `actions/deploy-pages`
  o push a `gh-pages`). Ya tenemos de base el `astro-ci.yml` (hoy solo build-check).
- Repo **público** (Pages gratis lo exige; es material del curso, sin problema).
- **Migrar el código Astro** que hoy vive en la **rama `dev` de este repo** al repo nuevo (mover
  `src/`, `astro.config.mjs`, `public/`, `package.json`, `pnpm-*`, etc.). Decidir si el repo actual
  conserva `dev` o si se limpia.

> Alternativa descartada: submodule dentro del repo actual → más fricción, no aporta. Repo separado es
> más simple.

## 3. Catálogo de ejercicios en Astro (con deep-links estables)

Para poder linkear desde MkDocs, cada ejercicio necesita una **URL estable**:

- Una página **índice** en Astro que liste **todos** los ejercicios (por bloque/clase), con su tipo
  (Python+tests / diagrama / quiz / completar) y su estado.
- **Slug estable por ejercicio**: ruta tipo `/<repo>/ejercicios/<clase>/#<slug-ejercicio>` o una página
  por ejercicio. Definir la convención ANTES de migrar (si cambian los slugs, se rompen los links de
  MkDocs).
- Reusar los componentes ya hechos: `EjercicioPython`, `DiagramaClases`, `DiagramaLibre`,
  `OpcionMultiple`, `CompletarCodigo`, y el guardado de progreso (`progreso.ts`).

## 4. Política de soluciones (decisión pendiente)

Hoy hay dos criterios distintos:

- **MkDocs**: soluciones visibles con `??? success` (el alumno las abre si quiere).
- **Astro**: por defecto **sin solución** (tests + pistas).

Al mover ejercicios a Astro hay que decidir: ¿se mantienen las soluciones desplegables, o se pasa al
modelo "tests + pistas, sin solución"? Sugerencia: **tests + pistas por defecto**, y soluciones solo
en algunos (o detrás de "ver una solución posible", como ya soporta el componente). Alinear con la
filosofía aprender-haciendo.

## 5. Pase de migración (incremental, NO de una)

1. **Piloto con POO** (ya está re-autorada en Astro/`dev`): dejar las clases MkDocs de POO como
   explicación + links a los ejercicios interactivos de POO. Medir cómo se siente el flujo alumno.
2. Definir el **patrón repetible**: en cada clase MkDocs, reemplazar el bloque de ejercicio por un
   callout tipo *"🧪 Practicá este ejercicio en el campus interactivo → [link]"* (pestaña nueva).
3. Ir clase por clase (Archivos, JSON, Git, funciones, colecciones…), moviendo ejercicios al catálogo
   y dejando el link. Sin apuro: el sitio sigue funcionando en cada paso.
4. Los **mini-ejercicios / quizzes al vuelo** que surjan en clase también viven en el catálogo.

## 6. Actualizar la skill `generar-clase`

Cuando el patrón esté probado, actualizar `.claude/commands/generar-clase.md` para que:

- Emita clases MkDocs **sin ejercicios inline**: en su lugar, un callout con **link al ejercicio en
  Astro** (y placeholder del slug).
- Contemple un tipo **"mini-ejercicio/quiz al vuelo"** para intercalar durante la explicación.
- Mantenga el resto de los principios (entrar por el problema, regla de los 20 min, tono, etc.).
- El checklist de auditoría sume: *"¿los ejercicios están en Astro y linkeados, en vez de inline?"*

## 7. Riesgos y decisiones abiertas

- **Dos URLs / dos deploys**: más superficie de mantenimiento. Mitigar con los dos GitHub Actions
  (MkDocs ya despliega; Astro tendría el suyo).
- **Dependencia de conexión**: los ejercicios interactivos requieren cargar Pyodide (~unos MB la 1ª
  vez). En el aula, ver que la conexión aguante; el motor cachea después.
- **Doble formato**: mantener componentes Astro + prosa MkDocs. Aceptable si el catálogo es la única
  fuente de ejercicios.
- **Nombre del repo Astro**: elegirlo (afecta el `base` y todos los links).
- **Qué hacer con `dev`** del repo actual una vez migrado Astro a su repo.

## 8. Checklist para arrancar (receso)

- [ ] Elegir nombre del repo Astro y crearlo (público).
- [ ] Mover el código Astro de `dev` al repo nuevo; setear `site` + `base`.
- [ ] GitHub Action de deploy a Pages; verificar la URL en vivo.
- [ ] Definir convención de slugs + página índice/catálogo.
- [ ] Migrar POO como piloto (links desde MkDocs).
- [ ] Decidir política de soluciones.
- [ ] Actualizar `generar-clase`.
- [ ] Ir migrando el resto de las clases, sin apuro.
