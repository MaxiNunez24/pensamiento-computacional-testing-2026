import{a as x,b as g,E as A,c as N,o as O,e as w,d as D,p as I,k as M,i as _,f as U,g as z,h as V,j as F}from"./editor-comun.DrUw2OHB.js";import{a as G,l as H,p as k,e as $,g as B,b as J,m as Q}from"./progreso.blkCQYuu.js";import{r as K,T as W,e as Y,p as X,R as Z}from"./python-runner.m-8T9RHb.js";import{m as ee}from"./medir-editor.BqCodW9x.js";const ae=`Sos el Asistente del curso "Pensamiento Computacional y Testing de Aplicaciones" (CFP 401, Argentina). Ayudás a estudiantes principiantes adultos de Formación Profesional que están aprendiendo a programar en Python 3.

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
- No pidas datos personales. Si pega datos que parecen reales (DNI, nombres de alumnos del CFP), pedile que los cambie por inventados.`,te="https://claude.ai/new";function oe(e,y){const h=e.querySelector("[data-asistente]"),t=e.querySelector("[data-asistente-panel]");if(!h||!t)return;const f=t.querySelector("[data-a-codigo]"),S=t.querySelector("[data-a-salida]"),m=t.querySelector("[data-a-pregunta]"),v=t.querySelector("[data-a-abrir]"),i=t.querySelector("[data-a-cerrar]"),s=t.querySelector("[data-a-listo]"),n=t.querySelector("[data-a-respaldo]");h.addEventListener("click",()=>{t.hidden=!t.hidden,s.hidden=!0,n.hidden=!0,t.hidden||m.focus()}),i.addEventListener("click",()=>{t.hidden=!0});function b(){const c=e.dataset.titulo||"un ejercicio",r=[ae,"","---","",`Estoy en la clase "${document.title.split("|")[0].trim()}", en el ejercicio "${c}".`];if(f.checked){const E=(e.querySelector(".ejercicio__consigna")?.innerText||"").trim();E&&r.push("","La consigna:",E),r.push("","Mi código:","```python",y().trimEnd(),"```")}const d=e.querySelector("[data-salida]");S.checked&&d&&!d.hidden&&d.textContent?.trim()&&r.push("","Lo que me mostró al probarlo:","```",d.textContent.trim(),"```");const q=m.value.trim();return r.push("",q||"¿Me ayudás a entender qué me falta, sin darme la respuesta?"),r.join(`
`)}v.addEventListener("click",()=>{const c=b();window.open(te,"_blank","noopener"),navigator.clipboard.writeText(c).then(()=>{s.hidden=!1,n.hidden=!0},()=>{s.hidden=!0,n.hidden=!1,n.value=c,n.focus(),n.select()})})}function ne(e){const y=g(e.dataset.starter||""),h=g(e.dataset.tests||""),t=e.dataset.archivo||"",f=g(e.dataset.datos||""),S=e.dataset.archivos?JSON.parse(g(e.dataset.archivos)):{},m=e.querySelector("[data-entradas-input]"),v=()=>{const a=m?m.value:g(e.dataset.entradas||"");return a===""?[]:a.replace(/\n$/,"").split(`
`)},i=e.dataset.titulo||"",s=e.querySelector("[data-editor]"),n=e.querySelector("[data-salida]"),b=e.querySelector("[data-run]"),c=e.querySelector("[data-verify]"),r=e.querySelector("[data-reset]");if(!s||!n)return;const d=H(i);k(e,$(i));let q;const E=A.updateListener.of(a=>{a.docChanged&&(clearTimeout(q),q=setTimeout(()=>B(i,l.state.doc.toString()),600))}),l=new A({doc:d??y,extensions:[N,...D(f),I(),O,w,M.of([_]),E],parent:s});e.__cmView=l,ee(l);const T=()=>l.state.doc.toString(),u=(a,o)=>{n.hidden=!1,n.textContent=a,n.className="ejercicio__salida"+(o?" "+o:"")},C=a=>{[b,c,r].forEach(o=>o&&(o.disabled=a))},j=async a=>{C(!0),u(X()?a?"⏳ Ejecutando tests…":"⏳ Ejecutando…":"⏳ Cargando Python (la primera vez tarda unos segundos)…","is-loading");try{const o=await K(T(),a?h:"",t,f,v(),S),p=o.out.trimEnd();if(a)o.ok?(u((p?p+`

`:"")+"✅ ¡Todos los tests pasaron! 🎉","is-ok"),Q(i),k(e,!0)):u((p?p+`

`:"")+`❌ Todavía no pasa:

`+o.err,"is-error");else{const P=t?`📄 Listo: se guardó como ${t}.

No muestra nada, y está bien: una clase es la receta, no la torta. Recién hace algo cuando alguien la usa.

Tocá ✓ Verificar para probarla, y después usala en el ejercicio de abajo.`:"(el código corrió, pero no imprimió nada)";o.ok?u(p||P,""):u((p?p+`

`:"")+o.err,"is-error")}}catch(o){o instanceof W?u("⏱️ Tu código tardó más de "+Z/1e3+` segundos y lo detuvimos.

¿Habrá quedado un bucle infinito? Revisá la condición de tu while:
¿en algún momento se vuelve falsa?

Corregilo y volvé a intentar (el intérprete se reinicia solo).`,"is-error"):u(`⚠️ Error cargando el intérprete de Python:
`+String(o),"is-error")}finally{C(!1)}};b?.addEventListener("click",()=>j(!1)),c?.addEventListener("click",()=>j(!0)),r?.addEventListener("click",()=>{l.dispatch({changes:{from:0,to:l.state.doc.length,insert:y}}),n.hidden=!0,J(i)}),s.addEventListener("keydown",a=>{(a.ctrlKey||a.metaKey)&&a.key==="Enter"&&(a.preventDefault(),j(!0))}),U(e,T,v),oe(e,T),z(e,l),V(e);const R=()=>{F(e),Y().catch(()=>{})};s.addEventListener("focusin",R,{once:!0}),s.addEventListener("pointerdown",R,{once:!0})}function L(){x(),document.querySelectorAll(".ejercicio:not(.ejercicio--eficiencia):not(.probador)").forEach(e=>{e.dataset.init||(e.dataset.init="1",ne(e))}),G()}document.readyState!=="loading"?L():document.addEventListener("DOMContentLoaded",L);document.addEventListener("astro:page-load",L);
