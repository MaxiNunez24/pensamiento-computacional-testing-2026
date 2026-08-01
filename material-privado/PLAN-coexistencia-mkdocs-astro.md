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

**Motivación concreta (del profe, 3/7):** los alumnos trabajan en las **máquinas del CFP** (salvo unos
pocos con notebook) y **todavía no vieron Git** (recién el 10/7). Hoy, si les dejás práctica "para
casa", **no pueden continuar desde su mismo proyecto/repo** — como mucho rehacen el ejercicio de cero.
Los ejercicios interactivos de **Astro corren en el navegador, sin instalar nada, desde cualquier
máquina**, y guardan el progreso local: es **la solución natural** a "practicar en cualquier lado sin
setup ni Git". Fuerte argumento para priorizar el catálogo Astro. (Mientras tanto, en MkDocs, la
práctica extra se plantea como opcional y autocontenida, no como "seguí tu repo".)

## 2. Deploy de Astro — DECIDIDO (1/8): un solo repo, Astro en `/ejercicios/`

> ⚠️ **Esto reemplaza la decisión del 3/7**, que proponía un segundo repositorio público aparte.

Es cierto que **GitHub Pages sirve un solo sitio por repo** — eso no cambió. Lo que sí: **ese sitio
puede tener subcarpetas construidas por herramientas distintas**. No hace falta un segundo repo; alcanza
con que un mismo workflow arme las dos partes y publique el conjunto.

- **Estructura publicada:**

  ```
  https://maxinunez24.github.io/pensamiento-computacional-testing-2026/
  ├── (MkDocs: teoría, cronograma, bitácora)
  └── /ejercicios/          ← Astro + Pyodide
  ```

- **Un solo workflow** de GitHub Actions: `mkdocs build -d site/` + `pnpm build` con salida a
  `site/ejercicios/`, y un único `actions/deploy-pages` del `site/` completo.
- `astro.config.mjs`: setear **`site: 'https://maxinunez24.github.io'`** y
  **`base: '/pensamiento-computacional-testing-2026/ejercicios/'`** (Starlight respeta el `base` en
  todos los links internos y assets).
- **El código Astro sube de `dev` a `main`** (no se muda a otro repo). `dev` sigue siendo la rama de
  trabajo; sólo `main` despliega.

**Por qué conviene sobre dos repos:** un solo dominio (los links entre teoría y ejercicios son
relativos, no absolutos), un solo `git push`, un solo lugar donde mirar cuando algo se rompe, y cero
riesgo de que los dos repos se desincronicen.

### Ida y vuelta entre las dos partes

Es el único requisito de UX que pide el flujo:

- **MkDocs → Astro:** en cada clase, un callout al final con el link a los ejercicios de ese tema
  (`../ejercicios/clases/<tema>/`).
- **Astro → MkDocs:** cada lección de ejercicios abre con un link de vuelta a la teoría
  (`../../../` + la ruta de la clase). Conviene resolverlo en un componente `<VolverATeoria>` para no
  escribir la ruta a mano en cada `.mdx`.

> Alternativas descartadas: submodule (más fricción, no aporta) y repo separado (dos deploys, dos
> URLs, riesgo de desincronización).

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

- [x] **Decidir el deploy** → un solo repo, Astro en `/ejercicios/` (1/8, ver §2).
- [x] **Poner `dev` al día** con `main` (merge sin conflictos) y verificar que compila
      (`pnpm install && pnpm build` → 8 páginas OK, 1/8).
- [x] **Soporte móvil del ejercicio** (1/8): barra de símbolos en pantallas angostas, fuente del
      editor a 16px (evita el zoom de iOS), aviso único del peso de la descarga, y botón de copiar
      como plan B del `mailto:`.
- [x] **Envío al profe**: `mailto:` con nombre + consulta + código (1/8).
- [ ] Setear `site` + `base` en `astro.config.mjs`.
- [ ] Workflow único: MkDocs a `site/` + Astro a `site/ejercicios/` + un solo `deploy-pages`.
- [ ] Componente `<VolverATeoria>` y callouts de ida desde MkDocs (ver §2).
- [ ] Definir convención de slugs + página índice/catálogo.
- [ ] Migrar POO como piloto (links desde MkDocs).
- [ ] Decidir política de soluciones.
- [ ] Actualizar `generar-clase`.
- [ ] Tutorial/video para los alumnos sobre el botón de envío (ver §9).
- [ ] Ir migrando el resto de las clases, sin apuro.

---

## 9. El botón "Enviar a mi profe" — qué necesita el alumno

El `mailto:` **abre el cliente de correo del alumno** con un mensaje ya escrito dirigido a la casilla
del profe. O sea: **el requisito cae del lado del alumno**, no del profe.

| Dónde | Qué pasa |
|-------|----------|
| Android con Gmail | Funciona solo (ya están logueados) |
| iPhone con Mail configurado | Funciona solo |
| PC del CFP sin cliente de correo | **No pasa nada visible** ← el caso problemático |
| PC con webmail en el navegador | Depende de si registraron Gmail como handler de `mailto:` |

Por eso el componente muestra, **después** de tocar el botón, un cartel con **"📋 Copiar el mensaje"**:
si no se abrió nada, el alumno copia y lo pega en Discord. Resuelve el caso de la PC del CFP sin
depender de configurar nada.

Pendiente: un **video corto** mostrando el flujo (tocar Enviar → escribir la consulta → mandar, o
copiar y pegar en Discord). Va junto con los videos de setup de Git/GitHub.
