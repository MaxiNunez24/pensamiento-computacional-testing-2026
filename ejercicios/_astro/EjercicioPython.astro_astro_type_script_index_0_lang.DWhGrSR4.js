import{a as D,b as m,E as P,c as M,o as I,e as _,d as V,p as U,k as z,i as $,f as F,g as G,h as H,j as B}from"./editor-comun.nyH2Q-Qx.js";import{a as J,l as Q,p as x,e as K,g as W,b as Y,m as X}from"./progreso.blkCQYuu.js";import{r as Z,T as ee,e as ae,p as te,R as oe}from"./python-runner.m-8T9RHb.js";import{m as ne}from"./medir-editor.BqCodW9x.js";const se=`Sos el Asistente del curso "Pensamiento Computacional y Testing de Aplicaciones" (CFP 401, Argentina). Ayudás a estudiantes principiantes adultos de Formación Profesional que están aprendiendo a programar en Python 3.

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
- No pidas datos personales. Si pega datos que parecen reales (DNI, nombres de alumnos del CFP), pedile que los cambie por inventados.`,re="https://claude.ai/new";function ie(e,h){const f=e.querySelector("[data-asistente]"),o=e.querySelector("[data-asistente-panel]");if(!f||!o)return;const b=o.querySelector("[data-a-codigo]"),T=o.querySelector("[data-a-salida]"),g=o.querySelector("[data-a-pregunta]"),v=o.querySelector("[data-a-abrir]"),c=o.querySelector("[data-a-cerrar]"),r=o.querySelector("[data-a-listo]"),n=o.querySelector("[data-a-respaldo]");f.addEventListener("click",()=>{o.hidden=!o.hidden,r.hidden=!0,n.hidden=!0,o.hidden||g.focus()}),c.addEventListener("click",()=>{o.hidden=!0});function q(){const d=e.dataset.titulo||"un ejercicio",i=[se,"","---","",`Estoy en la clase "${document.title.split("|")[0].trim()}", en el ejercicio "${d}".`];if(b.checked){const E=(e.querySelector(".ejercicio__consigna")?.innerText||"").trim();E&&i.push("","La consigna:",E),i.push("","Mi código:","```python",h().trimEnd(),"```")}const l=e.querySelector("[data-salida]");T.checked&&l&&!l.hidden&&l.textContent?.trim()&&i.push("","Lo que me mostró al probarlo:","```",l.textContent.trim(),"```");const S=g.value.trim();return i.push("",S||"¿Me ayudás a entender qué me falta, sin darme la respuesta?"),i.join(`
`)}v.addEventListener("click",()=>{const d=q();window.open(re,"_blank","noopener"),navigator.clipboard.writeText(d).then(()=>{r.hidden=!1,n.hidden=!0},()=>{r.hidden=!0,n.hidden=!1,n.value=d,n.focus(),n.select()})})}function ce(e){const h=m(e.dataset.starter||""),f=m(e.dataset.tests||""),o=e.dataset.archivo||"",b=m(e.dataset.datos||""),T=e.dataset.archivos?JSON.parse(m(e.dataset.archivos)):{},g=e.querySelector("[data-entradas-input]"),v=()=>{const a=g?g.value:m(e.dataset.entradas||"");return a===""?[]:a.replace(/\n$/,"").split(`
`)},c=e.dataset.titulo||"",r=e.querySelector("[data-editor]"),n=e.querySelector("[data-salida]"),q=e.querySelector("[data-run]"),d=e.querySelector("[data-verify]"),i=e.querySelector("[data-reset]");if(!r||!n)return;const l=Q(c);x(e,K(c));let S;const E=P.updateListener.of(a=>{a.docChanged&&(clearTimeout(S),S=setTimeout(()=>W(c,u.state.doc.toString()),600))}),u=new P({doc:l??h,extensions:[M,...V(b),U(),I,_,z.of([$]),E],parent:r});e.__cmView=u,ne(u);const C=()=>u.state.doc.toString(),p=(a,t)=>{n.hidden=!1,n.textContent=a,n.className="ejercicio__salida"+(t?" "+t:"")},j=e.querySelector("[data-vista-py]"),y=j?.querySelector("iframe"),N=m(e.dataset.vista||""),O=a=>{if(!j||!y)return;if(!a.includes("<")){j.hidden=!0;return}j.hidden=!1,y.onload=()=>{const s=Math.ceil(y.contentDocument?.documentElement.getBoundingClientRect().height||200);y.style.height=Math.min(Math.max(s,120),640)+"px"};const t=`<style>${N}</style>`;y.srcdoc=/<head[^>]*>/i.test(a)?a.replace(/<head[^>]*>/i,s=>s+t):`<!doctype html><html lang="es"><head><meta charset="utf-8">${t}</head><body>${a}</body></html>`},A=a=>{[q,d,i].forEach(t=>t&&(t.disabled=a))},L=async a=>{A(!0),p(te()?a?"⏳ Ejecutando tests…":"⏳ Ejecutando…":"⏳ Cargando Python (la primera vez tarda unos segundos)…","is-loading");try{const t=await Z(C(),a?f:"",o,b,v(),T),s=t.out.trimEnd();if(a)t.ok?(p((s?s+`

`:"")+"✅ ¡Todos los tests pasaron! 🎉","is-ok"),X(c),x(e,!0)):p((s?s+`

`:"")+`❌ Todavía no pasa:

`+t.err,"is-error");else{const w=o?`📄 Listo: se guardó como ${o}.

No muestra nada, y está bien: una clase es la receta, no la torta. Recién hace algo cuando alguien la usa.

Tocá ✓ Verificar para probarla, y después usala en el ejercicio de abajo.`:"(el código corrió, pero no imprimió nada)";t.ok?p(s||w,""):p((s?s+`

`:"")+t.err,"is-error"),O(t.ok?s:"")}}catch(t){t instanceof ee?p("⏱️ Tu código tardó más de "+oe/1e3+` segundos y lo detuvimos.

¿Habrá quedado un bucle infinito? Revisá la condición de tu while:
¿en algún momento se vuelve falsa?

Corregilo y volvé a intentar (el intérprete se reinicia solo).`,"is-error"):p(`⚠️ Error cargando el intérprete de Python:
`+String(t),"is-error")}finally{A(!1)}};q?.addEventListener("click",()=>L(!1)),d?.addEventListener("click",()=>L(!0)),i?.addEventListener("click",()=>{u.dispatch({changes:{from:0,to:u.state.doc.length,insert:h}}),n.hidden=!0,Y(c)}),r.addEventListener("keydown",a=>{(a.ctrlKey||a.metaKey)&&a.key==="Enter"&&(a.preventDefault(),L(!0))}),F(e,C,v),ie(e,C),G(e,u),H(e);const k=()=>{B(e),ae().catch(()=>{})};r.addEventListener("focusin",k,{once:!0}),r.addEventListener("pointerdown",k,{once:!0})}function R(){D(),document.querySelectorAll(".ejercicio:not(.ejercicio--eficiencia):not(.probador):not(.ejercicio--web)").forEach(e=>{e.dataset.init||(e.dataset.init="1",ce(e))}),J()}document.readyState!=="loading"?R():document.addEventListener("DOMContentLoaded",R);document.addEventListener("astro:page-load",R);
