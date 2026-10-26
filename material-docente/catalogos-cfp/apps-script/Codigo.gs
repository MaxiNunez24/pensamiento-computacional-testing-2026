/**
 * El script del formulario "Tu catálogo gratis · CFP 401" (Google Apps Script).
 *
 * Se pega en el formulario: los tres puntitos → Editor de secuencias de comandos.
 * Los pasos para ponerlo en marcha están en LEEME.md, al lado de este archivo.
 *
 * Hace tres cosas:
 *  1. Cuando alguien ENVÍA (o edita) el formulario: le manda un mail con el link de
 *     su catálogo, su QR y el link para editarlo, y guarda ese link en la pestaña
 *     "Links para editar" de la planilla (por si lo pierde).
 *  2. Cuando alguien del CFP tilda (o destilda) "Aprobado" en la planilla: si lo
 *     tildó, le avisa a la persona que su catálogo está publicado.
 *  3. En los dos casos, le pide a GitHub que publique YA, sin esperar a la hora.
 *     Para eso necesita un permiso de GitHub guardado en las propiedades del
 *     script (GITHUB_TOKEN); sin él, igual se publica, en la próxima hora.
 */

const CONFIG = {
    SITIO_URL: 'https://cfp401-ensenada.github.io/catalogos/',
    REPO: 'cfp401-ensenada/catalogos',
    PLANILLA_ID: 'PEGAR_ACA_EL_ID_DE_LA_PLANILLA',   // lo que está entre /d/ y /edit en su dirección
    CONTACTO: 'el CFP 401',                           // a quién escribir si pierde el link
};

const NOMBRE = 'Nombre del emprendimiento';
const APROBADO = 'Aprobado';
const CORREO = 'Dirección de correo electrónico';
const PESTANA_LINKS = 'Links para editar';


// ─────────────────────────── 1. Al enviar el formulario ───────────────────

function alEnviar(e) {
    const respuesta = e.response;
    const nombre = respuestaA(respuesta, NOMBRE);
    const correo = respuesta.getRespondentEmail();
    const editar = respuesta.getEditResponseUrl();
    const yaEstaba = guardarLink(respuesta.getId(), nombre, correo, editar);
    if (correo) {
        MailApp.sendEmail({
            to: correo,
            subject: yaEstaba ? `Recibimos los cambios de ${nombre}` : `Recibimos el catálogo de ${nombre}`,
            htmlBody: mailRecibido(nombre, editar, yaEstaba),
        });
    }
    avisarAGitHub('formulario');
}

/** El texto que contestó en la pregunta con ese título ("" si no la contestó). */
function respuestaA(respuesta, titulo) {
    const item = respuesta.getItemResponses().find(r => r.getItem().getTitle() === titulo);
    return item ? String(item.getResponse()).trim() : '';
}

/**
 * Guarda (o actualiza) el link para editar en la pestaña "Links para editar".
 * Devuelve true si esa respuesta ya estaba: o sea, si es una edición.
 */
function guardarLink(id, nombre, correo, link) {
    const libro = SpreadsheetApp.openById(CONFIG.PLANILLA_ID);
    const hoja = libro.getSheetByName(PESTANA_LINKS) || crearPestanaLinks(libro);
    const ids = hoja.getRange(1, 1, Math.max(hoja.getLastRow(), 1), 1).getValues().map(f => f[0]);
    const fila = ids.indexOf(id) + 1;
    const datos = [[id, nombre, correo, link, new Date()]];
    if (fila > 0) {
        hoja.getRange(fila, 1, 1, 5).setValues(datos);
        return true;
    }
    hoja.appendRow(datos[0]);
    return false;
}

function crearPestanaLinks(libro) {
    const hoja = libro.insertSheet(PESTANA_LINKS);
    hoja.appendRow(['Id de la respuesta', 'Emprendimiento', 'Correo', 'Link para editar', 'Última vez']);
    hoja.setFrozenRows(1);
    return hoja;
}


// ─────────────────────────── 2. Al aprobar en la planilla ─────────────────

function alEditarPlanilla(e) {
    const hoja = e.range.getSheet();
    if (hoja.getName() === PESTANA_LINKS) return;
    const titulos = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
    const columnaAprobado = titulos.indexOf(APROBADO) + 1;
    const desde = e.range.getColumn();
    const hasta = desde + e.range.getNumColumns() - 1;
    if (columnaAprobado < desde || columnaAprobado > hasta) return;   // no tocaron "Aprobado"

    for (let fila = e.range.getRow(); fila < e.range.getRow() + e.range.getNumRows(); fila++) {
        if (fila === 1) continue;
        const valores = hoja.getRange(fila, 1, 1, titulos.length).getValues()[0];
        if (valores[columnaAprobado - 1] !== true) continue;            // lo destildaron: solo se publica
        const correo = valores[titulos.indexOf(CORREO)];
        const nombre = valores[titulos.indexOf(NOMBRE)];
        if (correo && nombre) {
            MailApp.sendEmail({
                to: correo,
                subject: `¡El catálogo de ${nombre} está publicado!`,
                htmlBody: mailPublicado(nombre),
            });
        }
    }
    avisarAGitHub('aprobado');
}


// ─────────────────────────── 3. Publicar ya ───────────────────────────────

function avisarAGitHub(motivo) {
    const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
    if (!token) {
        console.log('No hay GITHUB_TOKEN: se publica en la próxima corrida de la hora.');
        return;
    }
    const r = UrlFetchApp.fetch(`https://api.github.com/repos/${CONFIG.REPO}/dispatches`, {
        method: 'post',
        contentType: 'application/json',
        headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' },
        payload: JSON.stringify({ event_type: 'publicar', client_payload: { motivo: motivo } }),
        muteHttpExceptions: true,
    });
    if (r.getResponseCode() !== 204) {
        console.log(`GitHub contestó ${r.getResponseCode()}: ${r.getContentText()}`);
    }
}


// ─────────────────────────── Los mails ────────────────────────────────────

/** El mismo slug que generar.py: sin tildes, en minúscula y con guiones. */
function slug(nombre) {
    return String(nombre).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function linkDe(nombre) {
    return CONFIG.SITIO_URL + slug(nombre) + '/';
}

function qr(link) {
    return 'https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=' + encodeURIComponent(link);
}

/** Lo que escribió la persona va adentro de un mail en HTML: se escapa, igual que en generar.py. */
function esc(texto) {
    return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function mailRecibido(nombre, editar, esEdicion) {
    const link = linkDe(nombre);
    const intro = esEdicion
        ? 'Recibimos tus cambios. Si tu catálogo ya estaba aprobado, se publican solos en unos minutos.'
        : 'Recibimos tu catálogo. Cuando alguien del CFP lo revise, te avisamos por este mismo correo: ' +
          'va a quedar publicado en esta dirección, con este QR.';
    return `
<p>¡Hola!</p>
<p>${intro}</p>
<p><a href="${link}"><strong>${esc(nombre)}</strong>: ${link}</a></p>
<p><img src="${qr(link)}" alt="QR de ${esc(nombre)}" width="200" height="200"></p>
<p><strong>Para cambiar precios o productos</strong>, no completes todo de nuevo: entrá a este link,
que abre el formulario con todo lo que ya cargaste, cambiá lo que necesites y enviá.</p>
<p><a href="${editar}">✏️ Editar mi catálogo</a></p>
<p><small>Guardá este mail: ese link es tu llave para editarlo. Si lo perdés, escribile a ${esc(CONFIG.CONTACTO)}.</small></p>
<p>Curso de Pensamiento Computacional · CFP 401 Ensenada</p>`;
}

function mailPublicado(nombre) {
    const link = linkDe(nombre);
    return `
<p>¡Hola!</p>
<p>¡Tu catálogo ya está aprobado! En unos minutos está publicado acá:</p>
<p><a href="${link}"><strong>${esc(nombre)}</strong>: ${link}</a></p>
<p><img src="${qr(link)}" alt="QR de ${esc(nombre)}" width="200" height="200"></p>
<p>Compartí el link o el QR con tus clientes. Para cambiar algo, usá el link para editar del primer mail.</p>
<p>Curso de Pensamiento Computacional · CFP 401 Ensenada</p>`;
}


// ─────────────────────────── Instalar (una sola vez) ──────────────────────

/**
 * Crea los dos disparadores: al enviar el formulario, y al editar la planilla.
 * Se corre UNA vez desde el editor (elegir "instalar" arriba y tocar ▶ Ejecutar),
 * y pide permiso para leer el formulario, la planilla y mandar mails.
 */
function instalar() {
    ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
    ScriptApp.newTrigger('alEnviar').forForm(FormApp.getActiveForm()).onFormSubmit().create();
    ScriptApp.newTrigger('alEditarPlanilla').forSpreadsheet(CONFIG.PLANILLA_ID).onEdit().create();
    crearPestanaSiFalta();
    console.log('Listo: los disparadores están instalados.');
}

function crearPestanaSiFalta() {
    const libro = SpreadsheetApp.openById(CONFIG.PLANILLA_ID);
    if (!libro.getSheetByName(PESTANA_LINKS)) crearPestanaLinks(libro);
}
