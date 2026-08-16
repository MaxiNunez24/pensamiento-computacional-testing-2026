# Sistema de Asistencias CFP 401 — estado, decisiones y qué sigue

> Documento de trabajo, teacher-only. Vive en `material-privado/` (no se publica en el sitio).
> **No poner datos personales de alumnos acá** (nombres, DNI, teléfonos): el repo puede leerse.
>
> Última actualización: 15/8/2026 (v4: vista por día + celular).

---

## 1. Qué es esto

Reemplazar el flujo actual del CFP: inscripción por Google Forms → transcripción **a mano** a una
planilla de Google Sheets → asistencia mezclada con fórmulas que se rompen al borrar una celda. Lo
único que se necesita del Excel es **imprimir** el formato oficial; el formato no debería siquiera
existir hasta el momento de imprimir.

Son **dos proyectos encadenados** y son el proyecto del curso (reemplazan la Bolsa de Trabajo):

1. **Sistema de Asistencias** — alta de alumnos, asistencia y planillas oficiales.
2. **Bot SiGes** — carga automática al sistema del Ministerio, que no tiene importación masiva.
   Se hace con **Playwright (Python)**, que de paso es framework de testing E2E y engancha con el
   módulo de Testing.

---

## 2. Dónde está cada cosa

| Archivo | Qué es |
|---|---|
| `sistema_asistencia_cfp401_v7.html` | **El prototipo actual.** Un solo archivo, se abre en el navegador, guarda en localStorage. |
| `sistema_asistencia_cfp401_v4.html` | Igual, pero con la planilla todavía sin corregir contra el Excel. Referencia histórica. |
| `asistencia_marzo_cfp401_8.html` | La planilla de impresión suelta (abril), con datos escritos a mano. **Ya está integrada al v3**; queda como referencia del formato aprobado. |
| `asistencia_cfp_3.html` | El sistema anterior, antes de integrar la planilla. Referencia histórica. |
| `2026.1 Pensamiento Comp- Maxi.xlsx` | El Excel original. Hojas: AYUDA, Inicial de Carga, Ficha de Curso, un mes por hoja, Evaluación de Módulo, Acta de Examen. |
| Logo | Embebido en base64 dentro del HTML. No necesita internet. |

---

## 3. Estado del prototipo (v4)

**Funciona:**

- Alta, edición, baja y borrado de alumnos; importación pegando CSV de Google Forms.
- **"Pasar lista": la vista por día.** Se elige la fecha y se marca la lista, un alumno por
  renglón con cuatro botones. Botones ‹ › para moverse de a un día y "‹ Clase / Clase ›" para
  saltar al día de cursada anterior o siguiente. Avisa si el día tiene clase y con qué horario, y
  al pie cuenta presentes/ausentes/sin marcar. Tocar de nuevo el botón ya marcado lo desmarca.
- **Aviso en el panel** cuando hay días de clase que ya pasaron y quedaron sin cargar; cada día es
  un botón que abre directamente esa fecha.
- **Anda en el celular**: abajo de 860px la barra lateral se convierte en un encabezado con menú
  ☰ y todo lo de dos columnas pasa a una. Los botones de asistencia miden 40px de alto (menos que
  eso se yerra el dedo).
- Grilla de asistencia mensual con P / A / T / J, "marcar días de clase", "limpiar mes" — ahora
  queda como vista de repaso y corrección, no como la forma de tomar asistencia.
- Configuración del curso: especialidad, curso, centro, distrito, localidad, sede, instructor,
  días de cursada y **un horario por día**.
- **Planilla oficial** generada desde los datos, con vista previa en pantalla y zoom.
- Temas tratados / en tratamiento, por mes, **avisando qué entra en la planilla**: cada línea del
  cuadro de texto es un renglón de la hoja, y lo que se pasa de ancho la planilla lo corta sin
  decir nada. El aviso mide el texto con la misma tipografía y el mismo ancho de celda que la hoja
  (canvas `measureText`), así que no es una estimación: comprobado, da el mismo milímetro. Si se
  está escribiendo al final, pasa solo a la línea siguiente; si se está corrigiendo en el medio,
  solo avisa —mover el texto bajo el cursor sería insoportable— y queda el botón "Acomodar
  renglones".
- Bajas y movimiento de alumnos calculados solos.
- Exportar CSV.

**Sobre el formato de la planilla** (esto costó varias vueltas, conviene no volver a pisarlo):

- Son **50 columnas** que suman **344mm** dentro de una hoja de 349mm; entra en Legal apaisada.
  Si la suma de los anchos queda por debajo del ancho de la hoja, el navegador reparte el sobrante
  y **los días vuelven a verse anchos**.
- Proporciones tomadas del Excel: nombre ~31%, días ~36%, panel ~29%.
- El nombre va en **dos columnas** que se fusionan en las filas de alumno. No es capricho: el logo
  abarca las primeras columnas y, con el nombre en una sola columna ancha, salía tres veces más
  grande que en el original.
- El **bloque de horarios no tiene columnas propias**: vive arriba del panel derecho, en las mismas
  columnas que "Temas tratados". Cuando tenía las suyas, empujaba el panel a la derecha y dejaba una
  franja vacía con el rótulo HORARIO bajando por toda la hoja.
- **`CURSO N° 1978` también vive en las columnas del panel**, arriba del bloque de horarios — no en
  el bloque de la izquierda. Era la diferencia que más saltaba a la vista contra el Excel.
- La casilla **`TIPO` / `Fo Cap Otros`** va entre DISTRITO y el separador. (La saqué una vez por
  leerla mal en una captura de Excel en modo oscuro, donde el recuadro no se distinguía del fondo.
  **Comparar siempre contra una captura en blanco**, sin Dark Reader ni tema oscuro.)
- El encabezado de totales son **dos filas**: `Totales` arriba, `Pres. | Aus.` abajo.
- El separador entre la tabla y el panel mide **0,8mm**. Con 2mm se leía como una columna vacía.
  Los milímetros que se le saquen hay que **dárselos a otra columna**: si el total baja de 344,1 el
  navegador reparte el sobrante y los días se ensanchan.
- **La hoja tiene que llenar el Oficio apaisado**: 215,9mm de alto menos 6mm de márgenes = 209,9mm
  útiles. Los renglones de alumno miden **15pt** y la hoja queda en ~195mm. Si se cambian, **medir
  de nuevo**: quedarse corto se ve feo, pasarse manda todo a una segunda página.
- **La localidad se movió al bloque izquierdo**, al lado de "Lugar que se dicta". Es la **única
  diferencia a propósito** con el original: libera un renglón del panel, así los temas tratados
  pasan de 4 a 5 líneas. El primero de esos renglones se dibuja en el encabezado, por eso
  `plPanel()` arranca por `temasTratados[1]`.
- ⚠️ La app le pone `text-transform: uppercase` a todos los `th`, y eso se colaba en la hoja:
  escribía "APELLIDOS Y NOMBRES" y "TOTALES" donde el formulario dice "APELLIDOS y Nombres" y
  "Totales". Las clases de la planilla no declaran `text-transform`, así que ganaba la de la app.
  Está neutralizado en `.sheet td, .sheet th`.
- Cada fila del encabezado tiene que **sumar 50** contando los `colspan` y los `rowspan` que bajan
  de arriba. Hay un verificador que lo comprueba (ver §7). Son **7 filas de encabezado**.
- **El formulario oficial es blanco y negro.** Lo que ordena la hoja son los recuadros y los
  títulos. Los rellenos pastel (azul en temas, rojo en bajas, verde en movimiento) eran una
  interpretación de la primera versión en HTML y son lo que más la alejaba del original: quedan
  disponibles con la casilla **"Colores"** de la barra, para leer en pantalla.

**Bugs que ya se arreglaron** (para no repetirlos):

- *Impresión en blanco*: el CSS de impresión ocultaba `.shell`, y la hoja vive **adentro** del shell.
  Hay que ocultar todo menos `#view-planilla`, no el contenedor que la contiene.
- *Texto gris casi blanco sobre fondo blanco*: la app define `td { color: var(--text) }` para su
  interfaz oscura y esa regla se colaba en la hoja. Un color heredado pierde contra una regla
  directa sobre `td`. Solución: todas las clases de la planilla van prefijadas con `.T`.
- *El zoom de la vista previa se llevaba a la impresión*: hay que resetear `#pl-hoja` y `.sheet`
  dentro de `@media print`.
- *Fechas corridas un día*: `new Date("2026-08-19")` y `.toISOString()` trabajan en UTC, y en
  Argentina (UTC−3) eso devuelve el día anterior. En la vista por día la fecha se arma y se lee a
  mano (`getFullYear/getMonth/getDate`). Es el error clásico y sería un buen ejercicio de clase.
- *Celdas que decían nada en vez de 0*: `(valor || '')` convierte el número **0** en texto vacío,
  así que "Bajas: 0" salía en blanco. Otro ejercicio de clase servido: en Python pasa igual con
  `if lista:` y con `valor or "—"`.
- *Campos nuevos de configuración que salían vacíos*: `load()` reemplazaba `state` entero por lo
  guardado, así que un campo agregado después (el instructor) nunca aparecía para quien ya venía
  usando el sistema. Ahora se completa con los valores por defecto.

**Al imprimir:** elegir **Legal / Oficio** y **horizontal** en el diálogo. Chrome a veces ignora
`@page { size: legal landscape }` y deja el papel que tenga configurado la impresora.

---

## 4. Lo que falta (pedido del 15/8)

Ordenado por lo que conviene hacer primero.

### 4.1 Asistencia por día (no mensual) — ✅ hecho en v4

Se agregó "Pasar lista" y el diseño para celular (ver §3). Los dos datos viven en el mismo lugar
que la grilla mensual (`state.asistencia[mes][alumno][día]`), así que marcar en una se ve en la
otra y en la planilla oficial.

### 4.2 Múltiples cursos

Crear, modificar y guardar varios cursos. Hoy el sistema asume uno solo (el 1978 está en la config).

### 4.3 Sesiones y roles

- **Directivos y preceptores**: leer y modificar todo.
- **Instructores**: se les **asigna** a cursos; leen y modifican solo lo suyo.

⚠️ **Esto rompe el prototipo tal como está.** localStorage es por navegador: no hay usuarios, no hay
permisos y los datos no se comparten entre dispositivos. Roles + varios usuarios + celular **exigen
un servidor con base de datos y login**.

La buena noticia: ese servidor es **Flask**, que es exactamente adonde iba el proyecto del curso. O
sea que el pedido de los preceptores no desvía el plan: lo justifica.

### 4.4 Recordatorio de pasar asistencia — parcialmente hecho

En v4 el panel avisa cuáles días de clase quedaron sin cargar (mira 45 días para atrás) y deja
abrirlos de un toque. Eso cubre el caso "entro al sistema y me entero". Lo que **no** se puede
hacer sin servidor es el aviso que llega solo: mail o notificación. Queda para Flask.

### 4.5 Inscripciones: ¿Forms o formulario propio?

Hoy: Google Forms → CSV → pegar en el sistema. Ya funciona.

**Recomendación**: dejar Forms por ahora (ya lo usan y no hay que enseñar nada nuevo), y cuando esté
Flask, hacer el formulario propio por curso. Ventaja del propio: se acaba el exportar/importar y los
datos entran validados. Desventaja: hay que hospedarlo y mantenerlo.

---

## 5. Decisiones tomadas (y por qué)

| Decisión | Motivo |
|---|---|
| **HTML de impresión, no Excel con openpyxl** | Replicar merges, anchos e imágenes con openpyxl es artesanal y frágil. Solo necesitan imprimir. Con CSS `@page` el control es total y se retoca en el navegador. |
| **El prototipo es la especificación, no el proyecto** | Se valida con preceptores y dirección **antes** de que los alumnos escriban una línea. Tener el requisito aprobado de antemano es un lujo. |
| **La planilla es un molde; los alumnos programan lo que la llena** | Evita tener que dar HTML/CSS. Llenar un molde con datos es diccionarios, listas, bucles y f-strings: lo que ya saben. Y en el trabajo real también recibís un diseño hecho. |
| **Datos de prueba, no reales, cuando entren los alumnos** | El prototipo quedó cargado con alumnos reales con sus datos. Para el curso: nombres inventados. Da además para una charla de cinco minutos sobre datos personales. |
| **Camino técnico** | Datos en memoria → JSON (Bloque 3) → CLI → Flask → Playwright. En la etapa 3 ya hay un entregable que el CFP puede usar. |

---

## 6. La demo (viernes 22/8 o 29/8)

Los preceptores pidieron **el bot del SiGes**; se les explicó que antes va la planilla, porque el bot
necesita que los datos existan en algún lado.

**Sugerencia de guion:**

1. La planilla funcionando de verdad, con datos cargados en vivo. Resuelve *tu* dolor.
2. El bot como maqueta con datos de prueba —aunque sea un video de Playwright cargando dos alumnos
   inventados—. Resuelve *el de ellos*, que es lo que hace que apoyen el proyecto. Decirlo de frente:
   "así se va a ver; para hacerlo con datos reales necesito el proceso completo".

**Llevar el alcance escrito** (*esto hay hoy / esto viene / esto queda para después*). Si no, se sale
de la reunión con veinte pedidos y sin prioridades — y el que después tiene que dar clases sos vos.

**Pendiente de terceros:** una preceptora tiene que mandar las **fotos del proceso de carga al
SiGes**. Sin eso el bot no se puede armar.

**Que el feedback module el proyecto, no el curso.** Si piden algo que necesita tecnología que no vas
a dar, eso es trabajo tuyo o de una etapa posterior, no una clase forzada.

---

## 7. Cómo verificar la planilla sin abrirla

Hay un script de Node que corre el generador con datos de prueba y comprueba la estructura:
que las 50 columnas estén, que **cada fila sume 50**, los totales por alumno, el movimiento y que el
logo esté embebido. Es la forma rápida de saber que un cambio no desarmó la tabla.

Vale la pena mantenerlo: los errores de `colspan` no se ven a simple vista, se ven como una hoja
torcida tres pantallas más abajo.

Hay un segundo script para la vista por día: comprueba que marcar guarde donde la planilla lo
busca, que tocar dos veces desmarque, que el cambio de mes no pierda datos, que la fecha no se
corra por zona horaria y que el aviso de días sin cargar no invente ni se olvide días.

---

## 8. Fichas que faltan implementar

Del Excel original, en orden de cuándo las piden:

1. **Ficha de Curso** — se entrega una vez al año. **Todavía no existe en HTML.**
2. **Asistencia mensual** — ✅ hecha.
3. **Evaluación de Módulo** — al finalizar cada curso.
4. **Acta de Examen** — al finalizar el año.

---

## 9. Qué cambia en la planificación del curso para poder hospedarlo

El camino que ya estaba acordado —**datos en memoria → JSON → CLI → Flask → Playwright**— no
cambia de forma. Lo que cambia es que **Flask deja de ser el final del recorrido y pasa a ser la
mitad**: una aplicación que corre en la máquina del que la programó no le sirve a nadie más. Para
que preceptores y directivos entren desde el celular hacen falta cuatro cosas que hoy no están en
la planificación.

### 9.1 Lo que hay que agregar

| Qué | Cuánto | Por qué no se puede saltear |
|---|---|---|
| **Entorno virtual y `requirements.txt`** | media clase | Sin esto el proyecto anda en una computadora sola. Es además el primer momento en que "instalar una librería" deja de ser magia. |
| **SQLite en vez de JSON** | 2 clases | Con JSON, dos personas guardando a la vez se pisan (una lee el archivo, la otra lo reescribe entero, gana la última). Con varios usuarios eso deja de ser teórico. `sqlite3` viene en la biblioteca estándar: no hay que instalar ni administrar nada, la base es **un archivo**. |
| **Usuarios, contraseñas y roles** | 2 clases | Es el pedido de los preceptores. La clase que importa no es el formulario de login: es **por qué nunca se guarda una contraseña en texto plano** (hash con `werkzeug.security`) y qué es una sesión. |
| **Puesta en producción** | 1 clase | Subir el proyecto, variables de entorno, `debug=False`, y la copia de seguridad de la base. Es la clase que convierte un ejercicio en un sistema. |

Total: **entre 5 y 6 clases** que hoy no están contempladas.

### 9.2 De dónde sacar ese tiempo

Tres opciones, en orden de preferencia:

1. **Que reemplacen ejercicios sueltos, no contenido.** Estas clases *son* práctica: cada una tiene
   un entregable visible. Encaja con lo que ya se venía corrigiendo del curso —menos teoría, más
   aprender haciendo—.
2. **Correr Playwright / Bot SiGes al final del módulo de Testing.** El bot ya vive ahí por ser
   framework E2E; no hace falta adelantarlo.
3. **Dejar el deploy como taller extra fuera del cronograma** si el año se pone corto. Es lo único
   de la lista que el profe puede hacer solo sin romper el proyecto de los alumnos.

### 9.3 Lo que conviene NO dar

- **HTML y CSS como unidad.** Las plantillas se entregan hechas (la planilla ya es un molde). El
  alumno programa lo que las llena, que es diccionarios, listas, bucles y f-strings.
- **Administración de servidores.** Eso es contenido del curso de **Reparador de PCs**; acá alcanza
  con "subir el proyecto a un lugar que ya está configurado".
- **Git como unidad aparte.** Se usa para subir el proyecto y se explica en el momento, no antes.

### 9.4 Efectos de arrastre

- El proyecto pasa a tener **datos personales reales** (alumnos del CFP). Con los alumnos se
  trabaja con **datos inventados**, siempre. Da además para una charla de diez minutos sobre datos
  personales que en este curso viene sola.
- Aparece una **cuenta de hosting**: alguien tiene que ser el dueño. Que sea del CFP y no personal.
- La **copia de seguridad** deja de ser opcional: si la base se pierde, se pierde la asistencia del
  año. Un `cp base.db base-2026-08-15.db` una vez por semana alcanza, y es un ejercicio de
  `pathlib` + `datetime` de manual.

---

## 10. Dónde hospedarlo (y por qué)

Primero el tamaño real del problema: **entre 5 y 15 personas**, que entran unos minutos por día,
desde el celular, dentro del mismo edificio casi siempre. No hace falta nada grande. El requisito
que manda no es la potencia: es que **la base de datos no se borre** y que **no haya que poner una
tarjeta de crédito**.

### 10.1 La comparación

| Opción | Cuesta | La base sobrevive | Contras |
|---|---|---|---|
| **PythonAnywhere** (recomendada) | Gratis | **Sí**, el disco es permanente | Hay que entrar cada 3 meses a apretar un botón para que no se apague; el dominio es `usuario.pythonanywhere.com` |
| **Red local del CFP** (una PC del centro) | Gratis | Sí | Solo se entra desde adentro del edificio y con la PC prendida |
| **Render / Railway / Fly** | Gratis con asterisco | **No** con SQLite: el disco se borra en cada actualización | Se duerme a los 15 min y tarda casi un minuto en despertar; piden tarjeta o base de datos aparte paga |
| **Servidor propio del CFP** | Gratis (luz) | Sí | IP fija o DDNS, abrir puertos, alguien que lo mantenga → proyecto del curso de Reparador de PCs |

**Por qué PythonAnywhere y no Render**, que es el que más se recomienda por ahí: Render borra el
disco en cada despliegue. Con SQLite eso significa **perder la asistencia cargada**, y la
alternativa es contratar una base de datos aparte. PythonAnywhere guarda los archivos como una
computadora normal: la base es un archivo en tu carpeta y ahí se queda. Para este tamaño de
sistema, eso vale más que cualquier otra diferencia. Además está pensado para enseñar Python: la
consola es web, no hace falta instalar nada en el CFP, y el HTTPS ya viene puesto.

### 10.2 Cómo se sube (PythonAnywhere, paso a paso)

1. **Cuenta** en pythonanywhere.com → plan *Beginner* (gratis, no pide tarjeta). Que la cuenta sea
   **institucional**, no personal.
2. **Subir el código.** Consola *Bash* → `git clone <url del repo>`. Si no hay repo, la solapa
   *Files* sube archivos a mano.
3. **Entorno virtual** (la carpeta con las librerías del proyecto):
   ```
   mkvirtualenv --python=/usr/bin/python3.11 asistencias
   pip install -r requirements.txt
   ```
4. **Crear la web app.** Solapa *Web* → *Add a new web app* → **Manual configuration** → Python
   3.11. (Manual, no el asistente de Flask: el asistente crea un proyecto vacío y lo pisa todo.)
5. **Decirle dónde está la aplicación.** Editar el archivo WSGI que aparece en esa misma pantalla y
   dejar solamente:
   ```python
   import sys
   sys.path.insert(0, '/home/USUARIO/asistencias')
   from app import app as application   # PythonAnywhere busca el nombre "application"
   ```
6. **Apuntar el virtualenv**: en la misma solapa, campo *Virtualenv* →
   `/home/USUARIO/.virtualenvs/asistencias`.
7. **Archivos estáticos**: URL `/static/` → directorio `/home/USUARIO/asistencias/static/`. Sin
   esto el CSS no carga y parece que todo se rompió.
8. **Reload** (el botón verde). Anda en `https://usuario.pythonanywhere.com`.

Después de eso, cada cambio son tres pasos: `git pull` en la consola → *Reload* → probar.

### 10.3 Cosas que se olvidan y duelen

- **`debug=True` jamás en producción.** Con debug activado, cualquiera que provoque un error ve el
  código y puede ejecutar Python en el servidor. Es literalmente una consola abierta.
- **La `SECRET_KEY` no va en el código.** Va en una variable de entorno. Si va en el repo, cualquiera
  que lo lea puede falsificar sesiones y entrar como directivo.
- **Backup de la base.** Es un archivo: copiarlo con fecha una vez por semana. Sin esto, un error
  borra el año.
- **La base no se sube al repo.** Al `.gitignore`, junto con `.env`. Tiene datos personales.
- **HTTPS**: viene incluido en el dominio de PythonAnywhere. Si algún día se usa dominio propio,
  hay que resolverlo aparte.

### 10.4 Para la demo del viernes

Nada de esto hace falta. El prototipo se abre desde un archivo y funciona.

**Si querés que lo prueben desde sus propios celulares en la reunión**, la forma más barata es
servir el archivo en la red local: en la carpeta donde está el HTML, `python -m http.server 8000`,
y pasarles `http://<ip-de-la-notebook>:8000/sistema_asistencia_cfp401_v4.html` estando todos en el
mismo Wi-Fi.

⚠️ **Ojo con esto en la demo:** el prototipo guarda en el navegador de cada uno. Si tres preceptores
entran desde sus teléfonos, cada uno ve **su propia copia** y lo que carga uno no lo ve el otro.
Eso no es un error a disimular: es exactamente el motivo por el que hace falta un servidor, y
dicho en la reunión explica en treinta segundos por qué el sistema definitivo lleva más trabajo
que "esto que ya funciona".
