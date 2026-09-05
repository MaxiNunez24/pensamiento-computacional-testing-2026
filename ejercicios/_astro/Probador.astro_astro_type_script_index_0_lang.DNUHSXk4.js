import{a as D,b as E,E as S,c as U,o as V,e as $,p as z,k as A,i as M,f as N,g as O,h as G,j as H}from"./editor-comun.BvR2hvIR.js";import{r as J,T as K,e as W,p as B,R as F}from"./python-runner.BRDqjuvt.js";import{m as x}from"./medir-editor.BqCodW9x.js";function P(t){return`pcp:probador:${location.pathname}::${t}`}function Q(t){try{return JSON.parse(localStorage.getItem(P(t))||"{}")}catch{return{}}}function X(t){const T=t.dataset.probador||"probador",k=E(t.dataset.starter||""),f=E(t.dataset.testsInicial||""),q=E(t.dataset.entradasInicial||""),c=t.querySelector("[data-editor]"),L=t.querySelector("[data-editor-tests]"),m=t.querySelector("[data-caja-tests]"),r=t.querySelector("[data-entradas-input]"),d=t.querySelector("[data-salida]"),w=t.querySelector("[data-guardado]"),p=t.querySelector("[data-run]"),g=t.querySelector("[data-verify]"),y=t.querySelector("[data-reset]");if(!c||!L||!d)return;const l=Q(T);r&&(r.value=l.entradas??q);let _;function h(){clearTimeout(_),_=setTimeout(()=>{try{if(localStorage.setItem(P(T),JSON.stringify({codigo:o.state.doc.toString(),tests:i.state.doc.toString(),entradas:r?r.value:""})),w){const e=new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"});w.textContent=`💾 Guardado ${e}`}}catch{}},500)}const R=S.updateListener.of(e=>{e.docChanged&&h()}),C=[U,z(),V,$,A.of([M]),R],o=new S({doc:l.codigo??k,extensions:C,parent:c}),i=new S({doc:l.tests??f,extensions:C,parent:L});x(o),x(i),t.__cmView=o,t.__cmTests=i,m&&(l.tests||f)&&(m.open=!0),r?.addEventListener("input",h);const I=()=>{const e=r?r.value:"";return e===""?[]:e.replace(/\n$/,"").split(`
`)},n=(e,u)=>{d.hidden=!1,d.textContent=e,d.className="ejercicio__salida"+(u?" "+u:"")},v=async e=>{const u=i.state.doc.toString().trim();if(e&&!u){m?.setAttribute("open",""),n(`🧪 Todavía no escribiste ningún test.

Abrí "Mis tests" y escribí algo como:
    assert salida.strip() == "Hola"

Un test es una afirmación sobre tu código: si es falsa, salta.`,"is-error");return}[p,g,y].forEach(a=>a&&(a.disabled=!0)),n(B()?e?"⏳ Corriendo tus tests…":"⏳ Ejecutando…":"⏳ Cargando Python (la primera vez tarda unos segundos)…","is-loading");try{const a=await J(o.state.doc.toString(),e?u:"","","",I()),s=a.out.trimEnd();e?a.ok?n((s?s+`

`:"")+"✅ Pasaron todos tus tests.","is-ok"):n((s?s+`

`:"")+`❌ Un test no pasó:

`+a.err,"is-error"):a.ok?n(s||"(el código corrió, pero no imprimió nada)",""):n((s?s+`

`:"")+a.err,"is-error")}catch(a){a instanceof K?n(`⏱️ Tardó más de ${F/1e3} segundos y lo detuvimos.

¿Habrá quedado un bucle infinito? El intérprete se reinicia solo.`,"is-error"):n(`⚠️ Error cargando el intérprete de Python:
`+String(a),"is-error")}finally{[p,g,y].forEach(a=>a&&(a.disabled=!1))}};p?.addEventListener("click",()=>v(!1)),g?.addEventListener("click",()=>v(!0)),y?.addEventListener("click",()=>{window.confirm("¿Borrar lo que escribiste y volver a empezar?")&&(o.dispatch({changes:{from:0,to:o.state.doc.length,insert:k}}),i.dispatch({changes:{from:0,to:i.state.doc.length,insert:f}}),r&&(r.value=q),d.hidden=!0,h())}),c.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="Enter"&&(e.preventDefault(),v(!0))}),N(t,()=>o.state.doc.toString(),I),O(t,o),G(t);const j=()=>{H(t),W().catch(()=>{})};c.addEventListener("focusin",j,{once:!0}),c.addEventListener("pointerdown",j,{once:!0})}function b(){D(),document.querySelectorAll(".probador").forEach(t=>{t.dataset.init||(t.dataset.init="1",X(t))})}document.readyState!=="loading"?b():document.addEventListener("DOMContentLoaded",b);document.addEventListener("astro:page-load",b);
