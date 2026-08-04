# 🧰 Stack y posibilidades del curso — resumen para autorar clases

> **Para qué sirve este documento.** Es el "brief" del proyecto: si en otra sesión (o con otra IA)
> hay que crear **una clase nueva en el mismo estilo**, alcanza con leer esto para saber en qué
> tecnología va cada cosa, qué componentes existen, con qué reglas se escribe y cómo se publica.
> Está pensado para pegarse/leerse al arranque de esa sesión.
>
> Última actualización del stack: **agosto 2026** (coexistencia MkDocs + Astro ya en producción).

---

## 1. El modelo en una frase

El curso son **dos mitades que conviven** en un mismo GitHub Pages y se linkean entre sí:

| Mitad | Tecnología | URL | Qué va acá |
|-------|-----------|-----|------------|
| **Teoría** | MkDocs Material | `/pensamiento-computacional-testing-2026/` | Explicación, ejemplos, diagramas de lectura, cheatsheets, cronograma, bitácora |
| **Práctica** | Astro + Starlight (Pyodide) | `…/ejercicios/` | Ejercicios con **Python real en el navegador** y tests que corrigen solos |

**Regla firme:** los ejercicios **ya no se escriben inline en MkDocs**. Una clase de MkDocs explica y
termina con un botón que manda a sus ejercicios interactivos en Astro. Cada lección de Astro abre con
un `<VolverATeoria>` que vuelve a la teoría. Esto **ya no es una transición**: es el estado final.

**Excepción:** las clases que *son* práctica en sí (repasos, integradores, cuadernillos, parciales,
lectura de código) siguen viviendo en MkDocs mientras no tengan contraparte interactiva.

---

## 2. Arquitectura y repositorio

Un solo repo (`pensamiento-computacional-testing-2026`, **público**) con las dos mitades:

```
docs/                     → MkDocs (teoría). Clases en docs/clases/python/NN_tema/*.md
mkdocs.yml                → nav + tema + extensiones de MkDocs
requirements.txt          → mkdocs, mkdocs-material (para el build de CI)

src/                      → Astro (práctica interactiva)
  content/docs/clases/*.mdx   → cada lección interactiva
  components/*.astro          → los componentes de ejercicio (ver §5)
  scripts/*.ts                → motor de Pyodide, CodeMirror, lógica de cada componente
  styles/custom.css           → estilos de la plataforma
astro.config.mjs          → base '/…/ejercicios', sidebar, favicon, gfm:true
package.json / pnpm-*     → deps de Astro (pnpm, no npm)

scripts/verificar_render.py   → chequea el HTML construido (ver §7)
worker/consultas-discord.js   → Cloudflare Worker: consultas de alumnos → Discord (ver §8)

material-privado/         → TEACHER-ONLY (fuera del build, pero visible en GitHub)
guiones/                  → guiones de video (fuera del build)

.github/workflows/
  deploy.yml              → build MkDocs + Astro y publica AMBOS en gh-pages (push a main)
  astro-ci.yml            → build-check de Astro en la rama dev (no publica)
```

**Ramas:**
- `main` → despliega las dos mitades juntas.
- `dev` → CI de build-check de Astro, no publica.
- `gh-pages` → la genera el workflow; **no se toca a mano**.

---

## 3. Stack de la teoría (MkDocs Material)

- **MkDocs 1.6 + Material for MkDocs 9.7**, contenido en `docs/*.md`.
- **Extensiones activas** (`mkdocs.yml`): `admonition` (`!!! tip/info/warning/success/danger`),
  `pymdownx.details` (colapsables `??? tip`/`??? success`), `pymdownx.superfences` (+ Mermaid como
  custom fence), `pymdownx.tabbed` con `alternate_style: true` (`=== "tab"`), `attr_list` (anclas
  `{ #ancla }` y botones `{ .md-button }`), `pymdownx.highlight`/`inlinehilite`, `pymdownx.snippets`.
- **Copiar código:** `features: [content.code.copy]` (¡ojo, `features` tiene que ser **lista** YAML!).
- **CSS/JS propios:** `docs/stylesheets/extra.css` y `docs/javascripts/clases-restantes.js`
  (contador de clases restantes que se auto-decrementa por fecha real).
- **Convenciones de una clase de teoría** (ver §6 para las reglas pedagógicas):
  - Sin frontmatter YAML. Arranca con `# Emoji Título`.
  - Anclas: MkDocs saca acentos y emojis del slug (heading "¿Dónde viven…?" → `donde-viven`).
  - Registrar cada clase nueva en **`mkdocs.yml` (nav)** y en **`docs/clases/clases.md`** (índice).
  - Termina con un callout que linkea a los ejercicios interactivos (link **absoluto**):
    ```markdown
    ## 🎮 Ejercicios
    !!! tip "🧪 Los ejercicios ahora son interactivos"
        [🚀 Ir a los ejercicios de X](/pensamiento-computacional-testing-2026/ejercicios/clases/SLUG/){ .md-button .md-button--primary }
    ```
- **Build check local:** `mkdocs build --strict` (rompe ante links/anclas rotas).

---

## 4. Stack de la práctica (Astro + Starlight + Pyodide)

- **Astro 6.4 + Starlight 0.39**, contenido en `src/content/docs/clases/*.mdx` (**.mdx**, no .md).
- **Gestor de paquetes: pnpm** (`corepack pnpm …` o `pnpm run …`). **No usar npm.**
- **Python en el navegador:** **Pyodide** (v0.29) corriendo en un **Web Worker**
  (`src/scripts/pyodide-worker.ts`). Un solo intérprete por página, se **precarga** apenas el alumno
  toca un editor, y tiene **timeout de 15 s** (un bucle infinito no congela la página: corta, reinicia
  el intérprete solo y muestra un mensaje pedagógico).
- **Editor de código:** CodeMirror 6 con `lang-python` y tema One Dark.
- **Lo que Starlight da de fábrica** (no hay que construirlo): **buscador** (Pagefind), **dark mode**,
  **botón de copiar código**, y **navegación anterior/siguiente automática** (no se escribe nav al pie).
- **Config clave (`astro.config.mjs`):**
  - `base: '/pensamiento-computacional-testing-2026/ejercicios'` — sin esto, todos los links/assets
    dan 404 en producción. Todo `src`/`href` propio tiene que llevar el `base` adelante.
  - `markdown: { gfm: true }` — **obligatorio**: Astro 6.4 dejó GFM en `undefined` para .mdx y sin
    esta línea **ninguna tabla se renderiza** (salen los pipes crudos).
  - ⚠️ **El `base` NO se agrega solo a los links que escribís vos.** Starlight se lo pone al `sidebar`,
    pero **no** a los `hero.actions` del frontmatter ni a los links markdown `[x](/ruta/)`: esos van al
    `<a href>` tal cual y, si arrancan con `/clases/…`, apuntan a la raíz del dominio → **404 en
    producción** (pasó con el botón de la portada). En el **cuerpo** de un `.mdx` usá
    `import.meta.env.BASE_URL` (`export const b = import.meta.env.BASE_URL.replace(/\/$/,'') + '/'` y
    después `<a href={b + 'clases/tema/'}>`). En el **frontmatter** (YAML, sin expresiones) no queda
    otra que escribir la ruta completa con el `base`.
  - `favicon: '/favicon.ico'`, `customCss`, y el `sidebar` (se edita a mano al sumar clases).
- **Sidebars redimensionables:** `public/sidebars-resizable.js` (script propio, se sirve con el `base`).

---

## 5. Catálogo de componentes interactivos

Todos se importan en el `.mdx` desde `../../../components/`. **Se elige el componente por lo que se
quiere que el alumno *piense*, no por variar.**

| Componente | Qué hace | Cuándo usarlo |
|------------|----------|---------------|
| **`<EjercicioPython>`** | Editor + **Ejecutar** + **Verificar** contra `assert` ocultos. Feedback ✅/❌ al instante. | El caballo de batalla: el alumno escribe una solución desde cero. |
| **`<CompletarCodigo>`** | Fill-in-the-blank: el código ya está, el alumno rellena `[[huecos]]` (inputs en línea). Se ensambla y corre en Pyodide. | Aislar **una** idea clave sin que reescriban todo. Ideal para temas nuevos. |
| **`<EncontrarElError>`** | El alumno **primero señala** la línea con el bug (soporta varios errores y también CERO), y recién ahí se habilita editar. | Enseñar a **leer** código ajeno antes de tocarlo. Anti-tanteo. |
| **`<OpcionMultiple>`** | Quiz conceptual, una o varias correctas, con explicación por opción. | Chequeo de concepto rápido, sin código. |
| **`<Evaluacion>`** | Modo parcial: ítems `multiple` / `abierta` / `codigo`, **sin feedback instantáneo**, se entrega una sola vez. Puede ejecutar código pero no ve si pasa. | Mini-parciales y evaluaciones. El control real es el aula; esto aporta el formato. |
| **`<DiagramaClases>` / `<DiagramaLibre>`** | Armar diagramas UML arrastrando/clic. | POO: pensar la estructura antes del código. |
| **`<Mermaid>`** | Diagramas de lectura (flujos, procesos), carga perezosa, tema según Starlight. | Explicar un flujo/proceso, no estructuras de datos. |
| **`<VolverATeoria ruta="…">`** | Link de vuelta a la clase teórica en MkDocs. | Al inicio de **cada** lección interactiva. |

### Props de `<EjercicioPython>` (el más importante)

`titulo`, `dificultad` (🌱🌿🌶️🌳), `starter` (esqueleto mínimo, nunca la solución), `tests` (asserts
**con mensaje**), `pistas` (array — **siempre preguntas**), `solucion` (opcional, por defecto NO se
incluye), y tres para casos especiales:

- **`archivo="alumno.py"`** — guarda el código del alumno como módulo `.py` en el FS de Pyodide; otro
  ejercicio hace `from alumno import Alumno`. Permite "clases en varios archivos".
- **`datos`** — código que corre ANTES del del alumno y le regala variables ya cargadas (para clases
  **anteriores a Funciones**, donde el alumno escribe un *programa*, no una función).
- **`entradas`** — respuestas pre-cargadas para ejercicios con `input()` (Pyodide no teclea en vivo).

En los tests de esas clases sin `def` se usa **`correr(**variables)`** / **`correr(entradas=[…])`**,
que re-ejecuta el programa del alumno con otros valores y devuelve lo que imprimió (así no pasan el
test imprimiendo la respuesta a mano). Los tests con `input()` miran las **últimas** líneas de salida.

---

## 6. Reglas de autorado (skill `/generar-clase`)

La skill `.claude/commands/generar-clase.md` tiene **dos modos**: generar clase nueva y auditar una
existente. Las reglas duras que definen "el estilo":

**Pedagógicas (obligatorias):**
- **Entrá con el problema, no con la teoría.** Nunca "hoy vamos a aprender X" → siempre "necesitamos
  hacer Y". La teoría aparece como respuesta al problema.
- **Regla de los 20 minutos:** máx. 20 min de lectura antes de un ejercicio. Ciclo concepto→ejercicio.
- **Mostrá el error antes que la solución** (tabs `=== "❌ Sin X"` / `=== "✅ Con X"`).
- **Enunciado completo primero** en integradores (qué hace, recibe, devuelve, ejemplo).
- **Pistas y soluciones siempre ocultas.** Por defecto **no** incluir solución en los interactivos
  (se abre por ansiedad y pre-condiciona).
- **Scaffolding proporcional:** tema nuevo = más ejemplos/analogías; repaso = más espacio para pensar.
  **Nunca reducir abstracción para simplificar — sumar andamiaje.**
- **Introducción justo a tiempo:** cualquier módulo/built-in/concepto no visto se introduce en un
  bloque breve **justo antes** de su primer uso (`!!! info "📦 Módulo: nombre"` con tabla de 2-4 funciones).

**⭐ Regla firme (1/8/2026) — las pistas son SIEMPRE preguntas.** Nunca una indicación ni media
solución: una **pregunta** que, al contestarla, acerca al alumno a entender el problema o armar la
lógica. Si contestarla no le enseña nada y solo le ahorra tipeo, es una indicación disfrazada.

**Orden por prerequisitos:** en clases **anteriores a Funciones I**, **no usar `def`** (el alumno
escribe un programa → usar `datos`/`salida`/`correr()`). Desde Funciones I en adelante, sí `def`.

**Tono y forma:** rioplatense, tuteo ("hacé", "escribí", "probá"). Emojis en títulos y objetivos,
no en el cuerpo. Dificultad 🌱 (~10-15 min) / 🌿 (~20-30) / 🌶️ (~30-45) / 🌳 (avanzado). Presupuesto:
**200 min por clase** (3 h 20). Mermaid solo para flujos/procesos, no para tablas ni estructuras.

**Conversión MkDocs → interactivo:** `!!! info "T"` → `:::note[T]`; `!!! tip` → `:::tip[T]`;
`!!! warning` → `:::caution`; `!!! danger` → `:::danger`; `??? success "Solución"` → prop `solucion`;
`??? tip "Pista"` → prop `pistas`; comparaciones ❌/✅ en tabs → **un ejercicio interactivo**; nav al
pie → se borra (Starlight la genera). Toda clase con tabs/asides-con-título/ejercicios va a `.mdx`.

**Checklist antes de publicar una clase interactiva:**
1. Correr los tests contra una solución de referencia (un test imposible muestra error del test, no del alumno).
2. `python3 scripts/verificar_render.py dist` (el build pasa en verde aunque el sitio se vea roto).
3. Mirarla **con los ojos** una vez (contraste, alineación).
4. Ningún `def` si va antes de Funciones I. Todas las pistas son preguntas.

---

## 7. Pipeline de deploy y verificación

**`.github/workflows/deploy.yml`** (se dispara con cada push a `main`):
1. Build MkDocs → `site/` (`mkdocs build --strict`).
2. Build Astro con pnpm → `dist/`, y lo mueve a `site/ejercicios/`.
3. Corre `scripts/verificar_render.py` sobre el HTML construido.
4. `touch .nojekyll` (sin esto, GitHub Pages ignora `_astro/` y los ejercicios dan 404 en silencio) y
   push forzado a `gh-pages`.

> ⚠️ **NO usar más `mkdocs gh-deploy` a mano.** Reemplaza toda la rama `gh-pages` y **borraría
> `/ejercicios/`**. El deploy ahora sale solo con el push a `main`.

**`scripts/verificar_render.py`** mira el HTML *renderizado* (no el proceso de build) y **frena el
deploy** si encuentra sintaxis sin renderizar (tablas con pipes crudos → GFM apagado, asides `:::` o
`!!!` como texto, `[object Object]`) o un recurso propio que va a dar 404. Nace de dos bugs reales que
el build no detecta (GFM apagado en .mdx y un favicon inexistente).

**`.github/workflows/astro-ci.yml`:** build-check de Astro en `dev` (no publica).

---

## 8. Infra extra

- **Worker de consultas → Discord** (`worker/consultas-discord.js`, Cloudflare): desde un ejercicio el
  alumno manda su código + consulta y aparece en el canal **#Consultas** de Discord. El webhook vive
  como **secreto del Worker** (`DISCORD_WEBHOOK`), nunca viaja al navegador; valida `Origin` y recorta
  tamaños. Se enchufa poniendo la URL del Worker en `WORKER_CONSULTAS` dentro de
  `src/scripts/ejercicio-python.ts` (mientras esté vacío, cae a un `mailto:`). Pasos en `worker/README.md`.
- **Contador de clases restantes** (`docs/javascripts/clases-restantes.js`): se auto-decrementa por
  fecha real, salta receso y feriados (lista `FERIADOS` editable). Se renderiza en `#clases-restantes`.
- **Asistente para alumnos** (`material_apoyo.md` + `material-privado/prompt-asistente-alumnos.md`):
  prompt copiable para que el alumno abra un chat con Claude que **guía sin dar las respuestas**.

---

## 9. Posibilidades — qué se puede hacer hoy y qué viene

**Ya disponible:**
- Ejercicios con Python real y tests que corrigen solos (incluye `input()` y "clases en varios archivos").
- 4 formatos de ejercicio además del editor: completar código, encontrar el error, opción múltiple, modo parcial.
- Diagramas UML arrastrables (POO) y diagramas de lectura (Mermaid).
- Tarea desde casa **sin instalar nada** (corre en el navegador) y consultas directas a Discord.
- Progreso por alumno vía `localStorage` (`src/scripts/progreso.ts`).

**Wishlist / a futuro (Brilliant-style):**
- Barra de progreso / racha por clase; feedback test por test (✅/❌ por caso).
- Progreso entre dispositivos (hoy es local): backend liviano o export/import.
- **Bloque 6 (datos) interactivo:** `pandas`/`numpy` corren en Pyodide → analizar la propia planilla
  de asistencia y datasets reales con ejecución en vivo.
- Migrar como interactivos los que ya son lógica pura ("Funciones como caja negra", ronda de bugs de
  Lectura y corrección).

---

## 10. Receta rápida: autorar una clase nueva en otra sesión

1. **Decidir la mitad.** ¿Es explicación (MkDocs) o práctica (Astro)? La mayoría de las clases nuevas
   son **las dos**: una página de teoría en MkDocs + una de ejercicios en Astro que se linkean.
2. **Invocar la skill** `/generar-clase` con: tema, clase anterior/siguiente, tipo (teórica/práctica/
   integrador), conceptos a incluir, y si el grupo viene cómodo o no.
3. **Teoría (MkDocs):** `docs/clases/python/NN_tema/archivo.md` → registrarla en `mkdocs.yml` y
   `clases.md` → cerrar con el callout-botón a los ejercicios. Verificar con `mkdocs build --strict`.
4. **Práctica (Astro):** `src/content/docs/clases/slug.mdx` → abrir con `<VolverATeoria>` → armar los
   ejercicios con los componentes de §5 → agregar la clase al `sidebar` de `astro.config.mjs`.
5. **Verificar:** correr los tests contra una solución de referencia, `verificar_render.py`, y mirar
   la página con los ojos.
6. **Publicar:** commit + push a `main` → el workflow despliega **las dos mitades** solo. No usar
   `gh-deploy`. Los commits terminan con `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

**Restricciones a respetar siempre:** no reducir abstracción (sumar andamiaje); pistas = preguntas;
no `def` antes de Funciones I; `material-privado/` y `guiones/` son públicos en GitHub aunque no
salgan en el sitio; no tocar `gh-pages` ni `.git/` a mano.
