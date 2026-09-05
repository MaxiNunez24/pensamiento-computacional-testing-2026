import{a as R,b as d,E as C,c as _,o as V,e as D,d as P,p as x,k as z,i as H,f as M,g as U,h as K,j as N}from"./editor-comun.BvR2hvIR.js";import{a as O,l as W,p as L,e as A,g as B,b as I,m as $}from"./progreso.blkCQYuu.js";import{r as F,T as G,e as J,p as Q,R as X}from"./python-runner.BRDqjuvt.js";import{m as Y}from"./medir-editor.BqCodW9x.js";function Z(e){const m=d(e.dataset.starter||""),w=d(e.dataset.tests||""),j=e.dataset.archivo||"",f=d(e.dataset.datos||""),p=e.querySelector("[data-entradas-input]"),g=()=>{const t=p?p.value:d(e.dataset.entradas||"");return t===""?[]:t.replace(/\n$/,"").split(`
`)},s=e.dataset.titulo||"",i=e.querySelector("[data-editor]"),c=e.querySelector("[data-salida]"),y=e.querySelector("[data-run]"),v=e.querySelector("[data-verify]"),h=e.querySelector("[data-reset]");if(!i||!c)return;const E=W(s);L(e,A(s));let S;const q=C.updateListener.of(t=>{t.docChanged&&(clearTimeout(S),S=setTimeout(()=>B(s,r.state.doc.toString()),600))}),r=new C({doc:E??m,extensions:[_,...P(f),x(),V,D,z.of([H]),q],parent:i});e.__cmView=r,Y(r);const b=()=>r.state.doc.toString(),o=(t,a)=>{c.hidden=!1,c.textContent=t,c.className="ejercicio__salida"+(a?" "+a:"")},T=t=>{[y,v,h].forEach(a=>a&&(a.disabled=t))},u=async t=>{T(!0),o(Q()?t?"⏳ Ejecutando tests…":"⏳ Ejecutando…":"⏳ Cargando Python (la primera vez tarda unos segundos)…","is-loading");try{const a=await F(b(),t?w:"",j,f,g()),n=a.out.trimEnd();t?a.ok?(o((n?n+`

`:"")+"✅ ¡Todos los tests pasaron! 🎉","is-ok"),$(s),L(e,!0)):o((n?n+`

`:"")+`❌ Todavía no pasa:

`+a.err,"is-error"):a.ok?o(n||"(el código corrió, pero no imprimió nada)",""):o((n?n+`

`:"")+a.err,"is-error")}catch(a){a instanceof G?o("⏱️ Tu código tardó más de "+X/1e3+` segundos y lo detuvimos.

¿Habrá quedado un bucle infinito? Revisá la condición de tu while:
¿en algún momento se vuelve falsa?

Corregilo y volvé a intentar (el intérprete se reinicia solo).`,"is-error"):o(`⚠️ Error cargando el intérprete de Python:
`+String(a),"is-error")}finally{T(!1)}};y?.addEventListener("click",()=>u(!1)),v?.addEventListener("click",()=>u(!0)),h?.addEventListener("click",()=>{r.dispatch({changes:{from:0,to:r.state.doc.length,insert:m}}),c.hidden=!0,I(s)}),i.addEventListener("keydown",t=>{(t.ctrlKey||t.metaKey)&&t.key==="Enter"&&(t.preventDefault(),u(!0))}),M(e,b,g),U(e,r),K(e);const k=()=>{N(e),J().catch(()=>{})};i.addEventListener("focusin",k,{once:!0}),i.addEventListener("pointerdown",k,{once:!0})}function l(){R(),document.querySelectorAll(".ejercicio:not(.ejercicio--eficiencia):not(.probador)").forEach(e=>{e.dataset.init||(e.dataset.init="1",Z(e))}),O()}document.readyState!=="loading"?l():document.addEventListener("DOMContentLoaded",l);document.addEventListener("astro:page-load",l);
