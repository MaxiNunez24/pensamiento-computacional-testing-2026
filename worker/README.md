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
