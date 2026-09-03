Hay **cuatro** Workers, independientes entre sí a propósito. Si uno se rompe, los otros
tres siguen andando.

| Archivo | Para qué |
|---|---|
| `consultas-discord.js` | El botón *Enviar a mi profe* publica la consulta en #Consultas |
| `sync-progreso.js` | El botón *Sincronizar* sube y baja el avance entre dispositivos |
| `tablero.js` | El tablero del proyecto y el foro de soluciones anónimas |
| `cuestionario.js` | El cuestionario que contesta el equipo del CFP |

---

# Worker de consultas → Discord

Pasos para poner en pie `consultas-discord.js`. Son ~10 minutos y todo desde el navegador, sin instalar nada.

## 1. El webhook de Discord

1. En tu server, clic derecho sobre el canal **#Consultas** → **Editar canal**.
2. **Integraciones** → **Webhooks** → **Nuevo webhook**.
3. Ponele un nombre (ej. *Consultas del curso*) y **Copiar URL del webhook**.

Esa URL es la credencial: **no va al sitio ni al repo**. Solo se pega en Cloudflare, en el paso 3.

## 2. Crear el Worker

1. Entrá a [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Start with Hello World!** → **Deploy**.
2. Ponele de nombre `consultas` (queda `https://consultas.<tu-subdominio>.workers.dev`).
3. **Edit code**, borrá lo que trae y pegá el contenido de `consultas-discord.js`. **Deploy**.

> ⚠️ **Cuando cambia `consultas-discord.js` hay que volver a pegarlo y hacer Deploy.** El Worker no
> se actualiza solo con el push al repo: el código vive en Cloudflare. (La última vez que cambió: se
> las **entregas de parcial ahora van como ARCHIVO ADJUNTO**. Esta vez el re-deploy no es opcional:
> sin él, un parcial entero no entra en los 2000 caracteres de un mensaje de Discord y **se pierde
> el final**, que es justo el problema que esto viene a arreglar. Antes se había agregado el campo
> **⌨️ Lo que tecleó**, con las entradas de los ejercicios con `input()`.)

## 3. Guardar el webhook como secreto

En el Worker → **Settings** → **Variables and Secrets** → **Add**:

- Tipo: **Secret** (no "Text" — un secreto no se puede volver a leer desde el panel)
- Nombre: `DISCORD_WEBHOOK`
- Valor: la URL del paso 1

**Deploy** de nuevo para que tome el secreto.

> Que sea *Secret* y no *Text* es lo que hace que la URL nunca aparezca en logs ni en el panel.

## 4. Enchufarlo al sitio

En `src/scripts/editor-comun.ts`, arriba de todo:

```ts
const WORKER_CONSULTAS = 'https://consultas.TU-SUBDOMINIO.workers.dev';
```

Mientras esa constante esté vacía, el botón sigue usando el `mailto:` de siempre — no se rompe nada.

## 5. Probar

Abrí un ejercicio, escribí cualquier cosa y tocá **Enviar a mi profe**. Debería aparecer en #Consultas en un par de segundos.

Si no llega, en el Worker → **Logs** → **Begin log stream** y volvé a probar: ahí se ve el error.

## Si algún día alguien abusa

El Worker solo acepta pedidos con `Origin` del sitio del curso y recorta los mensajes, así que el abuso casual queda cubierto. Si aun así aparece spam:

1. Cloudflare → tu Worker → **Settings** → **Variables and Secrets** → cambiá `DISCORD_WEBHOOK` por uno nuevo (borrando el viejo en Discord).
2. **No hace falta tocar el sitio** — la URL del Worker no cambia.

Esa es justamente la ventaja sobre llamar al webhook desde la página: ahí habría que editar el sitio y redeployarlo, y hasta que propagara el botón quedaba roto para todos.

---

# Worker de sincronización de progreso

Pone en pie `sync-progreso.js`, que es lo que hace andar el botón **🔄 Sincronizar**. Otros ~10 minutos, también todo desde el navegador.

**Qué resuelve:** el avance de los ejercicios vive en el `localStorage` del navegador, así que lo que hacen en la compu del CFP no aparece en la de la casa. Con esto, cada alumno sube su avance con un **código** propio y lo baja en el otro dispositivo.

> Las dos acciones se llaman `push` y `pull` a propósito, con los íconos de VS Code: es el mismo modelo mental de Git que están aprendiendo, practicado sin instalar nada.

## 1. Crear el almacén (KV)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Storage & Databases** → **KV** → **Create instance**.
2. Nombre: `progreso-alumnos`. **Create**.

Es una tabla de clave→valor. La clave es el código del alumno; el valor, su avance.

## 2. Crear el Worker

1. **Workers & Pages** → **Create** → **Start with Hello World!** → **Deploy**.
2. Ponele de nombre `sync` (queda `https://sync.<tu-subdominio>.workers.dev`).
3. **Edit code**, borrá lo que trae y pegá el contenido de `sync-progreso.js`. **Deploy**.

## 3. Enchufar el KV al Worker

En el Worker → **Settings** → **Bindings** → **Add** → **KV namespace**:

- Variable name: **`PROGRESO`** ← tiene que llamarse exactamente así (es el `env.PROGRESO` del código)
- KV namespace: `progreso-alumnos`

**Deploy** de nuevo.

## 4. Enchufarlo al sitio

En `public/sync-progreso.js`, arriba de todo:

```js
var WORKER_SYNC = 'https://sync.TU-SUBDOMINIO.workers.dev';
```

Mientras esa constante esté vacía **el botón no aparece**: no se rompe nada, simplemente no está la función.

## 5. Probar

Abrí cualquier clase, resolvé un ejercicio y tocá **🔄 Sincronizar** → **`git push`**. Anotá el código. Abrí el sitio en otro navegador (o en el celular), escribí ese código y tocá **`git pull`**: tiene que aparecer tu código de los ejercicios.

## Lo que hay que saber antes de usarlo con el curso

- **No es seguro y no pretende serlo.** Quien tenga el código de otro puede leer y pisar su avance. Es aceptable porque son ejercicios de un curso, no datos sensibles. Que no se use para nada que importe.
- **No hay cuentas ni contraseñas.** El código *es* la llave, y se genera solo la primera vez a partir del nombre que ya cargaron (ej. `guada-7f3k`).
- **El `pull` pisa** lo que haya en ese navegador con el mismo nombre de ejercicio (pregunta antes). Lo que solo esté en ese dispositivo no se toca.
- **Límites:** 512 KB por alumno (un curso entero ronda los 30 KB). El plan gratis de KV da 1.000 escrituras y 100.000 lecturas por día — de sobra para el grupo.

## Si algún día alguien abusa

Cloudflare → tu Worker → **Settings** → borrar la clave del KV que corresponda, o cambiar el nombre del binding. Como los códigos se generan por alumno, el daño queda acotado a uno.

---

## Worker 3: el tablero y el foro de soluciones (`tablero.js`)

Es **un Worker aparte a propósito**. El de progreso guarda el trabajo de meses de los alumnos: no
se le agregan funciones nuevas para no arriesgarlo. Si este se rompe, la sincronización sigue
andando igual.

### Qué hace

| Ruta | Para qué |
|---|---|
| `GET /tablero` | El estado del proyecto, compartido por toda la clase |
| `POST /tablero` | Mover tarjetas (con control de versión: si dos guardan a la vez, el segundo se entera) |
| `GET /soluciones?ejercicio=X` | Las soluciones publicadas, **anónimas**, con sus votos |
| `POST /soluciones?ejercicio=X` | Publicar la propia (volver a publicar reemplaza, no duplica) |
| `POST /voto?ejercicio=X` | Votar. Votar de nuevo **cambia** el voto, no suma otro |
| `POST /elegir?ejercicio=X` | Marcar cuál va al sistema |

### Instalación

1. Crear un **KV namespace** nuevo llamado `TABLERO` (Workers & Pages → KV → Create).
2. Crear un Worker nuevo, pegar `worker/tablero.js` y desplegar.
3. En Settings → Bindings, agregar el KV con el nombre de variable **`TABLERO`**.
4. Copiar la URL del Worker a `public/tablero.js` del sitio.

### Sobre el anonimato

Acá **no se guarda quién escribió cada solución**: ni el nombre, ni el código de sincronización.
Lo único que se guarda es un identificador al azar del navegador, y solo para que nadie vote diez
veces ni le queden dos soluciones suyas dadas de alta. La respuesta del Worker nunca lo devuelve.

Es una decisión del curso: **se discute el código, no la persona.**

### Sobre la clave

`CLAVE_CURSO` no es seguridad de verdad —está del lado del cliente y cualquiera puede leerla—.
Evita que alguien que pase por el sitio público mueva las tarjetas por diversión, nada más. Es
suficiente porque acá **no hay datos personales**: hay tarjetas de tareas y código de ejercicios.

### Pruebas

```bash
node worker/pruebas/tablero.test.mjs
```

18 casos: el control de versión del tablero, que republicar reemplace, que votar dos veces cambie
el voto en vez de sumarlo, y que **nunca se devuelva quién escribió ni quién votó**.

---

## Worker 4: el cuestionario del CFP (`cuestionario.js`)

Lo contesta el **equipo del CFP** —dirección, preceptoría, auxiliares, instructores— desde el
celular, antes de la entrevista. La idea es de un alumno del curso: que llegue todo escrito, para
que el día de la entrevista se pregunte *sobre lo que ya contestaron* en vez de arrancar de cero.

### ⚠️ Este es distinto a los otros tres

En los otros no hay datos de personas: hay ejercicios, tarjetas y código. **Acá sí**: nombres del
personal del CFP y opiniones sobre cómo funciona su propio trabajo. Por eso:

- **Leer las respuestas está cerrado de verdad**, con un *secreto* del Worker que solo tenés vos.
  No con la `CLAVE_CURSO` que viaja en el JavaScript del sitio (esa la puede leer cualquiera).
- **Si el secreto no está configurado, no se lee nada.** Falla cerrado. Un olvido de configuración
  no puede dejar esto abierto.
- **Las respuestas NO van al repo.** El repo es público. Ni siquiera a `material-privado/`, que
  está excluido del sitio pero igual se sube a GitHub. Si exportás las respuestas, que queden fuera
  de la carpeta del proyecto.

### Rutas

| Ruta | Quién puede | Para qué |
|---|---|---|
| `POST /respuesta` | Cualquiera desde el sitio | Guardar o **corregir** una respuesta |
| `GET /cuantas` | Cualquiera desde el sitio | **Solo el número** de respuestas, sin nada del contenido |
| `GET /respuestas` | Solo con el secreto | Todas, completas |

`/cuantas` existe para poder **proyectar en el aula cuántas van** con los alumnos mirando, sin que
se lea una sola respuesta. Está probado que no filtra ni nombres ni roles ni texto.

> ⏱️ **El número llega tarde, hasta como un minuto.** `list()` de KV es eventualmente consistente:
> la respuesta ya está guardada, pero todavía no figura en el listado. Medido contra el Worker en
> producción: `0` justo después de escribir, `1` al minuto siguiente. Vale lo mismo para
> `/respuestas`. No es un error y no hay nada que arreglar — pero si alguien contesta y vas a
> mirar en el acto, esperá un minuto antes de asustarte.

### Instalación

1. **KV:** Storage & Databases → KV → *Create instance*, nombre `cuestionario-cfp`.
2. **Worker:** Workers & Pages → Create → Hello World → Deploy. Ponele `cuestionario`.
3. **Edit code**, pegá `worker/cuestionario.js`, **Deploy**.
4. **Bindings** → Add → KV namespace:
   - Variable name: **`CUESTIONARIO`** ← exactamente así
   - KV namespace: `cuestionario-cfp`
5. **Variables and Secrets** → Add:
   - Tipo: **Secret** (no "Text")
   - Nombre: **`CLAVE_DOCENTE`**
   - Valor: una frase larga que te inventes. **No la pongas en el repo.**
6. **Deploy** de nuevo para que tome el binding y el secreto.
7. Copiá la URL del Worker a `src/components/Cuestionario.astro`, en la constante `WORKER`.

> Mientras `WORKER` esté vacía el formulario **anda igual**, pero en modo "copiar y mandar por
> WhatsApp": la persona toca Enviar y le aparece el texto armado para pegar en un mensaje. Así la
> página se puede publicar antes de que el Worker exista.

### Cómo leer las respuestas

Desde una terminal, con tu secreto:

```bash
curl -H "Origin: https://maxinunez24.github.io" -H "X-Clave: TU-SECRETO" https://cuestionario.TU-SUBDOMINIO.workers.dev/respuestas
```

La clave va por **cabecera y no en la URL** a propósito: las URLs quedan en el historial del
navegador, en los logs del servidor y en el `Referer`. Una clave en la barra de direcciones no es
una clave.

### Pruebas

```bash
node worker/pruebas/cuestionario.test.mjs
```

23 casos. La mitad prueban lo que **no** tiene que pasar: que la clave del curso no alcance para
leer, que sin el secreto configurado falle cerrado, y que `/cuantas` no deje escapar ni un nombre.
