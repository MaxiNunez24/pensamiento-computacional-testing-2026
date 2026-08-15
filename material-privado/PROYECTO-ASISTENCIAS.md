# Sistema de Asistencias CFP 401 — estado, decisiones y qué sigue

> Documento de trabajo, teacher-only. Vive en `material-privado/` (no se publica en el sitio).
> **No poner datos personales de alumnos acá** (nombres, DNI, teléfonos): el repo puede leerse.
>
> Última actualización: 15/8/2026.

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
| `sistema_asistencia_cfp401_v3.html` | **El prototipo actual.** Un solo archivo, se abre en el navegador, guarda en localStorage. |
| `asistencia_marzo_cfp401_8.html` | La planilla de impresión suelta (abril), con datos escritos a mano. **Ya está integrada al v3**; queda como referencia del formato aprobado. |
| `asistencia_cfp_3.html` | El sistema anterior, antes de integrar la planilla. Referencia histórica. |
| `2026.1 Pensamiento Comp- Maxi.xlsx` | El Excel original. Hojas: AYUDA, Inicial de Carga, Ficha de Curso, un mes por hoja, Evaluación de Módulo, Acta de Examen. |
| Logo | Embebido en base64 dentro del HTML. No necesita internet. |

---

## 3. Estado del prototipo (v3)

**Funciona:**

- Alta, edición, baja y borrado de alumnos; importación pegando CSV de Google Forms.
- Grilla de asistencia mensual con P / A / T / J, "marcar días de clase", "limpiar mes".
- Configuración del curso: especialidad, curso, centro, distrito, localidad, sede, instructor,
  días de cursada y **un horario por día**.
- **Planilla oficial** generada desde los datos, con vista previa en pantalla y zoom.
- Temas tratados / en tratamiento, por mes.
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
- Cada fila del encabezado tiene que **sumar 50** contando los `colspan` y los `rowspan` que bajan
  de arriba. Hay un verificador que lo comprueba (ver §7).

**Bugs que ya se arreglaron** (para no repetirlos):

- *Impresión en blanco*: el CSS de impresión ocultaba `.shell`, y la hoja vive **adentro** del shell.
  Hay que ocultar todo menos `#view-planilla`, no el contenedor que la contiene.
- *Texto gris casi blanco sobre fondo blanco*: la app define `td { color: var(--text) }` para su
  interfaz oscura y esa regla se colaba en la hoja. Un color heredado pierde contra una regla
  directa sobre `td`. Solución: todas las clases de la planilla van prefijadas con `.T`.
- *El zoom de la vista previa se llevaba a la impresión*: hay que resetear `#pl-hoja` y `.sheet`
  dentro de `@media print`.

**Al imprimir:** elegir **Legal / Oficio** y **horizontal** en el diálogo. Chrome a veces ignora
`@page { size: legal landscape }` y deja el papel que tenga configurado la impresora.

---

## 4. Lo que falta (pedido del 15/8)

Ordenado por lo que conviene hacer primero.

### 4.1 Asistencia por día (no mensual)

Hoy la grilla es mes × alumno, pensada para escritorio. Lo natural para tomar asistencia —sobre todo
en celular— es: **elegir el día y marcar la lista**. Es la vista que más se va a usar.

Barato de hacer y de mucho impacto en la demo. **Candidato a hacerlo antes del viernes.**

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

### 4.4 Recordatorio de pasar asistencia

Aviso cuando hay un día de clase sin cargar. En web sin servidor es limitado; con Flask se puede
mandar mail o mostrarlo al entrar.

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

---

## 8. Fichas que faltan implementar

Del Excel original, en orden de cuándo las piden:

1. **Ficha de Curso** — se entrega una vez al año. **Todavía no existe en HTML.**
2. **Asistencia mensual** — ✅ hecha.
3. **Evaluación de Módulo** — al finalizar cada curso.
4. **Acta de Examen** — al finalizar el año.
