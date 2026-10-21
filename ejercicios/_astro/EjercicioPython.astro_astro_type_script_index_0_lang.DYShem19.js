import{a as _,b as m,E as x,c as I,o as V,e as U,d as z,p as $,k as F,i as G,f as H,g as B,h as J,j as Q}from"./editor-comun.nyH2Q-Qx.js";import{a as K,l as W,p as w,e as Y,g as X,b as Z,m as ee}from"./progreso.blkCQYuu.js";import{r as ae,T as te,e as oe,p as ne,R as se}from"./python-runner.m-8T9RHb.js";import{m as ie}from"./medir-editor.BqCodW9x.js";import{a as re,b as ce}from"./vista-links.BVuSiSPb.js";const de=`Sos el Asistente del curso "Pensamiento Computacional y Testing de Aplicaciones" (CFP 401, Argentina). Ayudás a estudiantes principiantes adultos de Formación Profesional que están aprendiendo a programar en Python 3.

EL CURSO
Recorrido: fundamentos de Python (print, variables, input, condicionales, listas, bucles) → funciones y colecciones (tuplas, sets, diccionarios) → programación orientada a objetos → el proyecto del año, en VS Code y con Git y GitHub → bases de datos con SQLite → web con Flask → testing con pytest → inteligencia artificial. Archivos, JSON, herencia y análisis de datos son optativos.

EL PROYECTO
Estamos construyendo entre todos el sistema de asistencias del CFP 401: alumnos (con el DNI guardado como texto), cursos, y la asistencia de cada clase (P presente, A ausente, T tarde, J justificada). Para aprobar un curso hace falta el 85% de asistencia. Y un bot que carga a los inscriptos en el SiGeS, el sistema del Ministerio: lee la planilla de inscripción con csv.DictReader, arma un objeto Alumno por fila, y el método problemas() decide quién está listo para cargarse y quién no. El bot practica siempre contra un simulador.

TU REGLA DE ORO
Nunca le des la respuesta ni el código terminado de un ejercicio. Tu trabajo es que entienda y llegue por su cuenta. Guiás con preguntas, pistas graduales y explicaciones.
- Si te pide la solución, no la des: explicale con buena onda que la idea es que la escriba él o ella, y ofrecé la siguiente pista.
- Pistas graduales: primero una pregunta que oriente; si sigue trabado, una pista más concreta; después otra más concreta. Nunca el código final.
- Antes de ayudar, pedile que te muestre qué intentó y qué esperaba que pasara.

CÓMO SABER SI ENTENDIÓ
No preguntes "¿entendiste?": casi todos dicen que sí. Cuando creas que lo resolvió, pedile que CAMBIE algo de su código y que siga andando. Por ejemplo: "¿y si ahora también tuviera que aceptar DNI de 7 números?", "¿qué pasa si la lista viene vacía?", "¿cómo harías para que también avise cuando...?". Si puede cambiarlo, lo entendió. Si no puede, volvé un paso atrás y explicá lo que falta.
Si pega código que parece no haber escrito (muy distinto de su nivel, o sacado de otra IA), no lo acuses: pedile que te explique qué hace cada línea, una por una. Esa explicación es la que le enseña.

QUÉ SÍ PODÉS HACER
- Explicar los conceptos del curso con palabras simples y analogías.
- Ayudar a leer un error: mirar el tipo de error y la línea, y pensar la causa. No le arregles el código: que encuentre el cambio.
- Dar ejemplos con OTRO caso distinto al del ejercicio, para no resolvérselo.
- Ayudar a partir un problema grande en pasos chicos.
- Recordarle que cada ejercicio tiene pistas, y que el material de la clase está publicado.

EL MATERIAL DEL CURSO
Es público. La teoría: https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ y los ejercicios: https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/ . Si necesitás saber cómo se explicó un tema en el curso, consultalo antes de responder.

ESTILO
Español rioplatense, con voseo ("hacé", "probá", "fijate"). Cercano, paciente y alentador: muchos recién arrancan y se frustran fácil. Respuestas cortas, un concepto por vez. Terminá seguido con una pregunta que lo invite a probar algo y volver.

LÍMITES
- Quedate en los temas del curso.
- Si te pide que le hagas una tarea o una evaluación completa, no la hagas: el objetivo es que aprenda.
- Si no estás seguro de algo, decilo en vez de inventar.
- No pidas datos personales. Si pega datos que parecen reales (DNI, nombres de alumnos del CFP), pedile que los cambie por inventados.`,le="https://claude.ai/new";function ue(e,f){const b=e.querySelector("[data-asistente]"),o=e.querySelector("[data-asistente-panel]");if(!b||!o)return;const v=o.querySelector("[data-a-codigo]"),T=o.querySelector("[data-a-salida]"),g=o.querySelector("[data-a-pregunta]"),q=o.querySelector("[data-a-abrir]"),c=o.querySelector("[data-a-cerrar]"),i=o.querySelector("[data-a-listo]"),s=o.querySelector("[data-a-respaldo]");b.addEventListener("click",()=>{o.hidden=!o.hidden,i.hidden=!0,s.hidden=!0,o.hidden||g.focus()}),c.addEventListener("click",()=>{o.hidden=!0});function S(){const d=e.dataset.titulo||"un ejercicio",r=[de,"","---","",`Estoy en la clase "${document.title.split("|")[0].trim()}", en el ejercicio "${d}".`];if(v.checked){const j=(e.querySelector(".ejercicio__consigna")?.innerText||"").trim();j&&r.push("","La consigna:",j),r.push("","Mi código:","```python",f().trimEnd(),"```")}const l=e.querySelector("[data-salida]");T.checked&&l&&!l.hidden&&l.textContent?.trim()&&r.push("","Lo que me mostró al probarlo:","```",l.textContent.trim(),"```");const E=g.value.trim();return r.push("",E||"¿Me ayudás a entender qué me falta, sin darme la respuesta?"),r.join(`
`)}q.addEventListener("click",()=>{const d=S();window.open(le,"_blank","noopener"),navigator.clipboard.writeText(d).then(()=>{i.hidden=!1,s.hidden=!0},()=>{i.hidden=!0,s.hidden=!1,s.value=d,s.focus(),s.select()})})}function pe(e){const f=m(e.dataset.starter||""),b=m(e.dataset.tests||""),o=e.dataset.archivo||"",v=m(e.dataset.datos||""),T=e.dataset.archivos?JSON.parse(m(e.dataset.archivos)):{},g=e.querySelector("[data-entradas-input]"),q=()=>{const a=g?g.value:m(e.dataset.entradas||"");return a===""?[]:a.replace(/\n$/,"").split(`
`)},c=e.dataset.titulo||"",i=e.querySelector("[data-editor]"),s=e.querySelector("[data-salida]"),S=e.querySelector("[data-run]"),d=e.querySelector("[data-verify]"),r=e.querySelector("[data-reset]");if(!i||!s)return;const l=W(c);w(e,Y(c));let E;const j=x.updateListener.of(a=>{a.docChanged&&(clearTimeout(E),E=setTimeout(()=>X(c,u.state.doc.toString()),600))}),u=new x({doc:l??f,extensions:[I,...z(v),$(),V,U,F.of([G]),j],parent:i});e.__cmView=u,ie(u);const L=()=>u.state.doc.toString(),p=(a,t)=>{s.hidden=!1,s.textContent=a,s.className="ejercicio__salida"+(t?" "+t:"")},y=e.querySelector("[data-vista-py]"),h=y?.querySelector("iframe"),N=y?.querySelector(".web__vista-nota")??null,O=m(e.dataset.vista||""),D=a=>{if(!y||!h)return;if(!a.includes("<")){y.hidden=!0;return}y.hidden=!1,h.onload=()=>{const n=h.contentDocument,R=Math.ceil(n?.documentElement.getBoundingClientRect().height||200);h.style.height=Math.min(Math.max(R,120),640)+"px",n&&re(n,M=>ce(N,M))};const t=`<style>${O}</style>`;h.srcdoc=/<head[^>]*>/i.test(a)?a.replace(/<head[^>]*>/i,n=>n+t):`<!doctype html><html lang="es"><head><meta charset="utf-8">${t}</head><body>${a}</body></html>`},A=a=>{[S,d,r].forEach(t=>t&&(t.disabled=a))},C=async a=>{A(!0),p(ne()?a?"⏳ Ejecutando tests…":"⏳ Ejecutando…":"⏳ Cargando Python (la primera vez tarda unos segundos)…","is-loading");try{const t=await ae(L(),a?b:"",o,v,q(),T),n=t.out.trimEnd();if(a)t.ok?(p((n?n+`

`:"")+"✅ ¡Todos los tests pasaron! 🎉","is-ok"),ee(c),w(e,!0)):p((n?n+`

`:"")+`❌ Todavía no pasa:

`+t.err,"is-error");else{const R=o?`📄 Listo: se guardó como ${o}.

No muestra nada, y está bien: una clase es la receta, no la torta. Recién hace algo cuando alguien la usa.

Tocá ✓ Verificar para probarla, y después usala en el ejercicio de abajo.`:"(el código corrió, pero no imprimió nada)";t.ok?p(n||R,""):p((n?n+`

`:"")+t.err,"is-error"),D(t.ok?n:"")}}catch(t){t instanceof te?p("⏱️ Tu código tardó más de "+se/1e3+` segundos y lo detuvimos.

¿Habrá quedado un bucle infinito? Revisá la condición de tu while:
¿en algún momento se vuelve falsa?

Corregilo y volvé a intentar (el intérprete se reinicia solo).`,"is-error"):p(`⚠️ Error cargando el intérprete de Python:
`+String(t),"is-error")}finally{A(!1)}};S?.addEventListener("click",()=>C(!1)),d?.addEventListener("click",()=>C(!0)),r?.addEventListener("click",()=>{u.dispatch({changes:{from:0,to:u.state.doc.length,insert:f}}),s.hidden=!0,Z(c)}),i.addEventListener("keydown",a=>{(a.ctrlKey||a.metaKey)&&a.key==="Enter"&&(a.preventDefault(),C(!0))}),H(e,L,q),ue(e,L),B(e,u),J(e);const P=()=>{Q(e),oe().catch(()=>{})};i.addEventListener("focusin",P,{once:!0}),i.addEventListener("pointerdown",P,{once:!0})}function k(){_(),document.querySelectorAll(".ejercicio:not(.ejercicio--eficiencia):not(.probador):not(.ejercicio--web)").forEach(e=>{e.dataset.init||(e.dataset.init="1",pe(e))}),K()}document.readyState!=="loading"?k():document.addEventListener("DOMContentLoaded",k);document.addEventListener("astro:page-load",k);
