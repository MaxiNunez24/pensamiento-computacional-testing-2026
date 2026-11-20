import{a as U,b as E,E as S,c as V,e as $,p as z,k as A,i as D,f as M,g as N,h as O,j as G}from"./editor-comun.DAlFpNTt.js";import{r as H,T as J,e as K,p as W,R as B}from"./python-runner.CvNNM9rx.js";import{m as x}from"./medir-editor.BqCodW9x.js";function P(t){return`pcp:probador:${location.pathname}::${t}`}function F(t){try{return JSON.parse(localStorage.getItem(P(t))||"{}")}catch{return{}}}function Q(t){const T=t.dataset.probador||"probador",q=E(t.dataset.starter||""),f=E(t.dataset.testsInicial||""),L=E(t.dataset.entradasInicial||""),c=t.querySelector("[data-editor]"),k=t.querySelector("[data-editor-tests]"),m=t.querySelector("[data-caja-tests]"),r=t.querySelector("[data-entradas-input]"),d=t.querySelector("[data-salida]"),w=t.querySelector("[data-guardado]"),p=t.querySelector("[data-run]"),g=t.querySelector("[data-verify]"),y=t.querySelector("[data-reset]");if(!c||!k||!d)return;const l=F(T);r&&(r.value=l.entradas??L);let _;function h(){clearTimeout(_),_=setTimeout(()=>{try{if(localStorage.setItem(P(T),JSON.stringify({codigo:o.state.doc.toString(),tests:i.state.doc.toString(),entradas:r?r.value:""})),w){const e=new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"});w.textContent=`💾 Guardado ${e}`}}catch{}},500)}const R=S.updateListener.of(e=>{e.docChanged&&h()}),C=[V,z(),$,A.of([D]),R],o=new S({doc:l.codigo??q,extensions:C,parent:c}),i=new S({doc:l.tests??f,extensions:C,parent:k});x(o),x(i),t.__cmView=o,t.__cmTests=i,m&&(l.tests||f)&&(m.open=!0),r?.addEventListener("input",h);const I=()=>{const e=r?r.value:"";return e===""?[]:e.replace(/\n$/,"").split(`
`)},n=(e,u)=>{d.hidden=!1,d.textContent=e,d.className="ejercicio__salida"+(u?" "+u:"")},v=async e=>{const u=i.state.doc.toString().trim();if(e&&!u){m?.setAttribute("open",""),n(`🧪 Todavía no escribiste ningún test.

Abrí "Mis tests" y escribí algo como:
    assert salida.strip() == "Hola"

Un test es una afirmación sobre tu código: si es falsa, salta.`,"is-error");return}[p,g,y].forEach(a=>a&&(a.disabled=!0)),n(W()?e?"⏳ Corriendo tus tests…":"⏳ Ejecutando…":"⏳ Cargando Python (la primera vez tarda unos segundos)…","is-loading");try{const a=await H(o.state.doc.toString(),e?u:"","","",I()),s=a.out.trimEnd();e?a.ok?n((s?s+`

`:"")+"✅ Pasaron todos tus tests.","is-ok"):n((s?s+`

`:"")+`❌ Un test no pasó:

`+a.err,"is-error"):a.ok?n(s||"(el código corrió, pero no imprimió nada)",""):n((s?s+`

`:"")+a.err,"is-error")}catch(a){a instanceof J?n(`⏱️ Tardó más de ${B/1e3} segundos y lo detuvimos.

¿Habrá quedado un bucle infinito? El intérprete se reinicia solo.`,"is-error"):n(`⚠️ Error cargando el intérprete de Python:
`+String(a),"is-error")}finally{[p,g,y].forEach(a=>a&&(a.disabled=!1))}};p?.addEventListener("click",()=>v(!1)),g?.addEventListener("click",()=>v(!0)),y?.addEventListener("click",()=>{window.confirm("¿Borrar lo que escribiste y volver a empezar?")&&(o.dispatch({changes:{from:0,to:o.state.doc.length,insert:q}}),i.dispatch({changes:{from:0,to:i.state.doc.length,insert:f}}),r&&(r.value=L),d.hidden=!0,h())}),c.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="Enter"&&(e.preventDefault(),v(!0))}),M(t,()=>o.state.doc.toString(),I),N(t,o),O(t);const j=()=>{G(t),K().catch(()=>{})};c.addEventListener("focusin",j,{once:!0}),c.addEventListener("pointerdown",j,{once:!0})}function b(){U(),document.querySelectorAll(".probador").forEach(t=>{t.dataset.init||(t.dataset.init="1",Q(t))})}document.readyState!=="loading"?b():document.addEventListener("DOMContentLoaded",b);document.addEventListener("astro:page-load",b);
