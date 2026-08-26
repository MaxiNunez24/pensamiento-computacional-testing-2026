# El proceso de carga en el SiGeS, paso a paso

> Sacado de las 36 capturas del proceso real (agosto 2026). Sirve para dos cosas: entender qué
> tiene que hacer el bot, y saber qué se rompe si el Ministerio cambia el formulario.

**Dónde ocurre:** `sisge.abc.gob.ar/#/gestion/centro/ver-estudiantes/<id-del-trayecto>`
Es una aplicación Angular: **no recarga la página**, cambia el contenido. Por eso el bot tiene que
*esperar a que aparezca* cada pantalla en vez de esperar a que cargue una página nueva.

**De dónde salen los datos:** la hoja de respuestas del formulario de Google
(`1 SEDE OP SW ADM CONTABLE 2026 (respuestas)`, pestaña `Form_Responses1`).

---

## Los pasos

| # | Dónde | Qué se hace |
|---|---|---|
| 1 | Estudiantes del trayecto | Botón **+** → se abre el buscador |
| 2 | Buscador | **Tipo de documento** = DNI, **Numero de documento** = el DNI → **Buscar estudiante** |
| 3 | Agregar estudiante | Se abre el formulario largo, ya con el DNI puesto |
| 4 | | Completar sección por sección (abajo el detalle) |
| 5 | | **Guardar** |
| 6 | Alerta | *"Estudiante asignado correctamente"* → **Entendido** |
| 7 | Pre inscriptos | La persona aparece en la tabla, con un 🗑️ para borrarla |
| 8 | ⛔ | **Generar matrícula inicial** — ESTO NO LO HACE EL BOT |

---

## Las secciones del formulario

| Sección | Campos | De dónde sale |
|---|---|---|
| **Tipo de carga** (oblig.) | Carga común / Clan / Matrícula indirecta / Eps / Contexto de encierro | Siempre **Carga común** |
| **Documento** (oblig.) | DNI ya cargado + estado: Físico / extraviado en trámite / extraviado no en trámite | Siempre **DNI Físico** |
| **Apellido/s y nombre/s** (oblig.) | Apellido/s *, Nombres | Planilla (columnas C y D) |
| **Sobrenombre** | Sobrenombre | — (vacío) |
| **Sexo según DNI** (oblig.) | Femenino / Masculino / X | Planilla, columna GÉNERO |
| **Identidad de género** (oblig.) | desplegable: Mujer / Varón / … | Planilla, columna GÉNERO |
| **Nacionalidad** (oblig.) | Nacionalidad | Planilla — **hay que normalizar** (`Arg`, `Argentino`…) |
| **Lugar de nacimiento** (oblig.) | Lugar de nacimiento | Planilla, columna PROVINCIA |
| **Fecha de nacimiento** (oblig.) | fecha `d/m/aaaa` | Planilla — **hay que validar** (aparecieron fechas futuras) |
| **Dirección** (oblig.) | sub-formulario: Calle, Altura, Torre, Piso, Depto, **Código postal**, Distrito, Localidad, Entre calles → *Agregar* | Planilla, columnas DOMICILIO y LOCALIDAD. **Hay que partir calle y altura** |
| **Vivienda** (oblig.) | sub-formulario: zona rural/urbana/encierro, cuántas personas, cuántos adultos, cuántos niños, hijos a cargo, lengua extranjera, lengua indígena, pueblos originarios → *Agregar* | ⚠️ **NO está en el formulario de Google.** Hoy se inventa |
| **Datos de contacto** (oblig.) | sub-formulario → *Agregar* | Planilla, columna CELULAR (sin 0 y sin 15) |
| **Transportes** (oblig.) | casillas: A pie/Bicicleta, Colectivo, Tren, Vehículo particular, Taxi/Remis, Otro | ⚠️ **NO está en el formulario.** Hoy se inventa |
| **Redes** | … | — |

---

## Lo que hay que tener en cuenta al automatizar

1. **Los sub-formularios se abren con un botón y se cierran con "Agregar".** No alcanza con llenar
   los campos: si no se toca *Agregar*, el dato no queda. Es el error más fácil de cometer.
2. **Tres secciones obligatorias no tienen datos de origen** (Vivienda, Transportes, y parte de
   Contacto). O el bot pone valores por defecto y lo deja marcado para revisar, o se agregan esas
   preguntas al formulario de inscripción. Lo segundo es la solución de fondo.
3. **Los rótulos son la parte estable, los `id` no.** En Angular Material los identificadores se
   generan solos y cambian entre versiones. Hay que buscar los campos por su etiqueta visible
   (`get_by_label("Apellido/s")`), que es además lo que ve una persona.
4. **El estado "pre inscripto" es reversible.** Ahí termina el trabajo del bot.
