import{a as k,b,E as R,c as P,o as x,e as O,d as w,p as D,k as N,i as I,f as M,g as _,h as U,j as z}from"./editor-comun.BvR2hvIR.js";import{a as V,l as F,p as A,e as G,g as H,b as B,m as Q}from"./progreso.blkCQYuu.js";import{r as $,T as J,e as K,p as W,R as Y}from"./python-runner.BFyw3_tA.js";import{m as X}from"./medir-editor.BqCodW9x.js";const Z=`Sos el Asistente del curso "Pensamiento Computacional y Testing de Aplicaciones" (CFP 401, Argentina). Ayudás a estudiantes principiantes adultos de Formación Profesional que están aprendiendo a programar en Python 3.

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
- No pidas datos personales. Si pega datos que parecen reales (DNI, nombres de alumnos del CFP), pedile que los cambie por inventados.`,ee="https://claude.ai/new";function ae(e,y){const h=e.querySelector("[data-asistente]"),t=e.querySelector("[data-asistente-panel]");if(!h||!t)return;const f=t.querySelector("[data-a-codigo]"),q=t.querySelector("[data-a-salida]"),g=t.querySelector("[data-a-pregunta]"),c=t.querySelector("[data-a-abrir]"),d=t.querySelector("[data-a-cerrar]"),s=t.querySelector("[data-a-listo]"),r=t.querySelector("[data-a-respaldo]");h.addEventListener("click",()=>{t.hidden=!t.hidden,s.hidden=!0,r.hidden=!0,t.hidden||g.focus()}),d.addEventListener("click",()=>{t.hidden=!0});function v(){const l=e.dataset.titulo||"un ejercicio",i=[Z,"","---","",`Estoy en la clase "${document.title.split("|")[0].trim()}", en el ejercicio "${l}".`];if(f.checked){const n=(e.querySelector(".ejercicio__consigna")?.innerText||"").trim();n&&i.push("","La consigna:",n),i.push("","Mi código:","```python",y().trimEnd(),"```")}const u=e.querySelector("[data-salida]");q.checked&&u&&!u.hidden&&u.textContent?.trim()&&i.push("","Lo que me mostró al probarlo:","```",u.textContent.trim(),"```");const E=g.value.trim();return i.push("",E||"¿Me ayudás a entender qué me falta, sin darme la respuesta?"),i.join(`
`)}c.addEventListener("click",()=>{const l=v();window.open(ee,"_blank","noopener"),navigator.clipboard.writeText(l).then(()=>{s.hidden=!1,r.hidden=!0},()=>{s.hidden=!0,r.hidden=!1,r.value=l,r.focus(),r.select()})})}function te(e){const y=b(e.dataset.starter||""),h=b(e.dataset.tests||""),t=e.dataset.archivo||"",f=b(e.dataset.datos||""),q=e.querySelector("[data-entradas-input]"),g=()=>{const a=q?q.value:b(e.dataset.entradas||"");return a===""?[]:a.replace(/\n$/,"").split(`
`)},c=e.dataset.titulo||"",d=e.querySelector("[data-editor]"),s=e.querySelector("[data-salida]"),r=e.querySelector("[data-run]"),v=e.querySelector("[data-verify]"),l=e.querySelector("[data-reset]");if(!d||!s)return;const i=F(c);A(e,G(c));let u;const E=R.updateListener.of(a=>{a.docChanged&&(clearTimeout(u),u=setTimeout(()=>H(c,n.state.doc.toString()),600))}),n=new R({doc:i??y,extensions:[P,...w(f),D(),x,O,N.of([I]),E],parent:d});e.__cmView=n,X(n);const S=()=>n.state.doc.toString(),p=(a,o)=>{s.hidden=!1,s.textContent=a,s.className="ejercicio__salida"+(o?" "+o:"")},C=a=>{[r,v,l].forEach(o=>o&&(o.disabled=a))},T=async a=>{C(!0),p(W()?a?"⏳ Ejecutando tests…":"⏳ Ejecutando…":"⏳ Cargando Python (la primera vez tarda unos segundos)…","is-loading");try{const o=await $(S(),a?h:"",t,f,g()),m=o.out.trimEnd();a?o.ok?(p((m?m+`

`:"")+"✅ ¡Todos los tests pasaron! 🎉","is-ok"),Q(c),A(e,!0)):p((m?m+`

`:"")+`❌ Todavía no pasa:

`+o.err,"is-error"):o.ok?p(m||"(el código corrió, pero no imprimió nada)",""):p((m?m+`

`:"")+o.err,"is-error")}catch(o){o instanceof J?p("⏱️ Tu código tardó más de "+Y/1e3+` segundos y lo detuvimos.

¿Habrá quedado un bucle infinito? Revisá la condición de tu while:
¿en algún momento se vuelve falsa?

Corregilo y volvé a intentar (el intérprete se reinicia solo).`,"is-error"):p(`⚠️ Error cargando el intérprete de Python:
`+String(o),"is-error")}finally{C(!1)}};r?.addEventListener("click",()=>T(!1)),v?.addEventListener("click",()=>T(!0)),l?.addEventListener("click",()=>{n.dispatch({changes:{from:0,to:n.state.doc.length,insert:y}}),s.hidden=!0,B(c)}),d.addEventListener("keydown",a=>{(a.ctrlKey||a.metaKey)&&a.key==="Enter"&&(a.preventDefault(),T(!0))}),M(e,S,g),ae(e,S),_(e,n),U(e);const L=()=>{z(e),K().catch(()=>{})};d.addEventListener("focusin",L,{once:!0}),d.addEventListener("pointerdown",L,{once:!0})}function j(){k(),document.querySelectorAll(".ejercicio:not(.ejercicio--eficiencia):not(.probador)").forEach(e=>{e.dataset.init||(e.dataset.init="1",te(e))}),V()}document.readyState!=="loading"?j():document.addEventListener("DOMContentLoaded",j);document.addEventListener("astro:page-load",j);
