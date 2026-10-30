import{b as q,a as I,E as k,c as V,o as U,e as $,d as H,p as G,k as F,i as B,f as J,g as Q,h as Y,j as K}from"./editor-comun.BwQLzgZ-.js";import{a as W,l as Z,p as _,e as X,g as ee,b as ae,m as te}from"./progreso.blkCQYuu.js";import{t as oe,T as w,p as M,r as ne,e as re,R as se}from"./python-runner.CvNNM9rx.js";import{m as ie}from"./medir-editor.BqCodW9x.js";import{a as ce,b as de}from"./vista-links.BVuSiSPb.js";import{_ as le}from"./preload-helper.KHMCby5T.js";const ue=`Sos el Asistente del curso "Pensamiento Computacional y Testing de Aplicaciones" (CFP 401, Argentina). Ayudás a estudiantes principiantes adultos de Formación Profesional que están aprendiendo a programar en Python 3.

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
- No pidas datos personales. Si pega datos que parecen reales (DNI, nombres de alumnos del CFP), pedile que los cambie por inventados.`,pe="https://claude.ai/new";function me(e,d){const p=e.querySelector("[data-asistente]"),a=e.querySelector("[data-asistente-panel]");if(!p||!a)return;const g=a.querySelector("[data-a-codigo]"),h=a.querySelector("[data-a-salida]"),v=a.querySelector("[data-a-pregunta]"),l=a.querySelector("[data-a-abrir]"),u=a.querySelector("[data-a-cerrar]"),c=a.querySelector("[data-a-listo]"),r=a.querySelector("[data-a-respaldo]");p.addEventListener("click",()=>{a.hidden=!a.hidden,c.hidden=!0,r.hidden=!0,a.hidden||v.focus()}),u.addEventListener("click",()=>{a.hidden=!0});function f(){const o=e.dataset.titulo||"un ejercicio",s=[ue,"","---","",`Estoy en la clase "${document.title.split("|")[0].trim()}", en el ejercicio "${o}".`];if(g.checked){const T=(e.querySelector(".ejercicio__consigna")?.innerText||"").trim();T&&s.push("","La consigna:",T),s.push("","Mi código:","```python",d().trimEnd(),"```")}const y=e.querySelector("[data-salida]");h.checked&&y&&!y.hidden&&y.textContent?.trim()&&s.push("","Lo que me mostró al probarlo:","```",y.textContent.trim(),"```");const m=v.value.trim();return s.push("",m||"¿Me ayudás a entender qué me falta, sin darme la respuesta?"),s.join(`
`)}l.addEventListener("click",()=>{const o=f();window.open(pe,"_blank","noopener"),navigator.clipboard.writeText(o).then(()=>{c.hidden=!1,r.hidden=!0},()=>{c.hidden=!0,r.hidden=!1,r.value=o,r.focus(),r.select()})})}let ye=null;const ge=()=>ye??=le(()=>import("./motor.BDnp107R.js"),[]),he=e=>e?.replace(/[^\n]{44}(?=[^\n])/g,`$&
`);function ve(e,d){const p=e.querySelector("[data-traza]"),a=e.querySelector("[data-traza-panel]");if(!p||!a)return;const g=a.querySelector("[data-traza-estado]"),h=a.querySelector("[data-traza-motor]"),v=a.querySelector("[data-traza-llamada-caja]"),l=a.querySelector("[data-traza-llamada]");let u=e.dataset.llamada!==void 0?q(e.dataset.llamada):null;const c=o=>{g.textContent=o,g.hidden=!o},r=()=>{l.rows=Math.min(6,Math.max(1,l.value.split(`
`).length))},f=async()=>{a.hidden=!1,p.disabled=!0,c(M()?"⏳ Preparando la animación…":"⏳ Cargando Python (la primera vez tarda unos segundos)…");try{const o=await ge(),s=await oe({code:d.getCode(),tests:d.tests,trazador:o.TRAZADOR_PY,llamada:u,datos:d.datos,entradas:d.leerEntradas(),archivos:d.archivos});u=s.llamada||null,l.value=s.llamada,r(),v.hidden=!s.llamada&&!/^(def|class)\s/m.test(d.getCode());const y=s.traza.traza;for(const m of y)m.excepcion?.tipo==="Corte"&&(m.excepcion={tipo:"Hasta acá",mensaje:"son muchos pasos para mirarlos. Si tu programa no termina nunca, ¿hay un bucle infinito?"});h.escena=o.desdeTraza({...s.traza,traza:s.traza.traza.map(m=>({...m,salida:he(m.salida)})),explicar:!0,lineaGrande:!0,alto:"auto",ritmo:1.2,archivo:d.archivo||"tu_programa.py"}),c(""),h.reproducir()}catch(o){c(o instanceof w?"⏱️ Tardó demasiado y lo detuvimos. ¿Habrá un bucle infinito? Revisá la condición de tu while.":"⚠️ No se pudo armar la animación: "+String(o instanceof Error?o.message:o))}finally{p.disabled=!1}};p.addEventListener("click",()=>{f()}),a.querySelector("[data-traza-otra]")?.addEventListener("click",()=>{u=l.value,f()}),l.addEventListener("input",r),a.querySelector("[data-traza-cerrar]")?.addEventListener("click",()=>{h.pausar?.(),a.hidden=!0})}function fe(e){const d=q(e.dataset.starter||""),p=q(e.dataset.tests||""),a=e.dataset.archivo||"",g=q(e.dataset.datos||""),h=e.dataset.archivos?JSON.parse(q(e.dataset.archivos)):{},v=e.querySelector("[data-entradas-input]"),l=()=>{const t=v?v.value:q(e.dataset.entradas||"");return t===""?[]:t.replace(/\n$/,"").split(`
`)},u=e.dataset.titulo||"",c=e.querySelector("[data-editor]"),r=e.querySelector("[data-salida]"),f=e.querySelector("[data-run]"),o=e.querySelector("[data-verify]"),s=e.querySelector("[data-reset]");if(!c||!r)return;const y=Z(u);_(e,X(u));let m;const T=k.updateListener.of(t=>{t.docChanged&&(clearTimeout(m),m=setTimeout(()=>ee(u,b.state.doc.toString()),600))}),b=new k({doc:y??d,extensions:[V,...H(g),G(),U,$,F.of([B]),T],parent:c});e.__cmView=b,ie(b);const L=()=>b.state.doc.toString(),S=(t,n)=>{r.hidden=!1,r.textContent=t,r.className="ejercicio__salida"+(n?" "+n:"")},E=e.querySelector("[data-vista-py]"),j=E?.querySelector("iframe"),O=E?.querySelector(".web__vista-nota")??null,x=q(e.dataset.vista||""),D=t=>{if(!E||!j)return;if(!t.includes("<")){E.hidden=!0;return}E.hidden=!1,j.onload=()=>{const i=j.contentDocument,R=Math.ceil(i?.documentElement.getBoundingClientRect().height||200);j.style.height=Math.min(Math.max(R,120),640)+"px",i&&ce(i,N=>de(O,N))};const n=`<style>${x}</style>`;j.srcdoc=/<head[^>]*>/i.test(t)?t.replace(/<head[^>]*>/i,i=>i+n):`<!doctype html><html lang="es"><head><meta charset="utf-8">${n}</head><body>${t}</body></html>`},P=t=>{[f,o,s].forEach(n=>n&&(n.disabled=t))},C=async t=>{P(!0),S(M()?t?"⏳ Ejecutando tests…":"⏳ Ejecutando…":"⏳ Cargando Python (la primera vez tarda unos segundos)…","is-loading");try{const n=await ne(L(),t?p:"",a,g,l(),h),i=n.out.trimEnd();if(t)n.ok?(S((i?i+`

`:"")+"✅ ¡Todos los tests pasaron! 🎉","is-ok"),te(u),_(e,!0)):S((i?i+`

`:"")+`❌ Todavía no pasa:

`+n.err,"is-error");else{const R=a?`📄 Listo: se guardó como ${a}.

No muestra nada, y está bien: una clase es la receta, no la torta. Recién hace algo cuando alguien la usa.

Tocá ✓ Verificar para probarla, y después usala en el ejercicio de abajo.`:"(el código corrió, pero no imprimió nada)";n.ok?S(i||R,""):S((i?i+`

`:"")+n.err,"is-error"),D(n.ok?i:"")}}catch(n){n instanceof w?S("⏱️ Tu código tardó más de "+se/1e3+` segundos y lo detuvimos.

¿Habrá quedado un bucle infinito? Revisá la condición de tu while:
¿en algún momento se vuelve falsa?

Corregilo y volvé a intentar (el intérprete se reinicia solo).`,"is-error"):S(`⚠️ Error cargando el intérprete de Python:
`+String(n),"is-error")}finally{P(!1)}};f?.addEventListener("click",()=>C(!1)),o?.addEventListener("click",()=>C(!0)),s?.addEventListener("click",()=>{b.dispatch({changes:{from:0,to:b.state.doc.length,insert:d}}),r.hidden=!0,ae(u)}),c.addEventListener("keydown",t=>{(t.ctrlKey||t.metaKey)&&t.key==="Enter"&&(t.preventDefault(),C(!0))}),J(e,L,l),me(e,L),ve(e,{getCode:L,leerEntradas:l,tests:p,datos:g,archivos:h,archivo:a}),Q(e,b),Y(e);const A=()=>{K(e),re().catch(()=>{})};c.addEventListener("focusin",A,{once:!0}),c.addEventListener("pointerdown",A,{once:!0})}function z(){I(),document.querySelectorAll(".ejercicio:not(.ejercicio--eficiencia):not(.probador):not(.ejercicio--web)").forEach(e=>{e.dataset.init||(e.dataset.init="1",fe(e))}),W()}document.readyState!=="loading"?z():document.addEventListener("DOMContentLoaded",z);document.addEventListener("astro:page-load",z);
