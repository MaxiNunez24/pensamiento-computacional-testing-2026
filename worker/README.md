Hay **dos** Workers, independientes entre sí:

| Archivo | Para qué |
|---|---|
| `consultas-discord.js` | El botón *Enviar a mi profe* publica la consulta en #Consultas |
| `sync-progreso.js` | El botón *Sincronizar* sube y baja el avance entre dispositivos |

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

## 3. Guardar el webhook como secreto

En el Worker → **Settings** → **Variables and Secrets** → **Add**:

- Tipo: **Secret** (no "Text" — un secreto no se puede volver a leer desde el panel)
- Nombre: `DISCORD_WEBHOOK`
- Valor: la URL del paso 1

**Deploy** de nuevo para que tome el secreto.

> Que sea *Secret* y no *Text* es lo que hace que la URL nunca aparezca en logs ni en el panel.

## 4. Enchufarlo al sitio

En `src/scripts/ejercicio-python.ts`, arriba de todo:

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
