var Ft=1.70158,te=Ft+1;function _t({rebote:a=.3,oscilaciones:t=1.5}={}){if(!(a>0)){const s=1-9*Math.exp(-8);return l=>(1-(1+8*l)*Math.exp(-8*l))/s}const o=2*Math.PI*Math.max(t,.25),e=-Math.log(Math.min(a,.95))*o/Math.PI,n=i=>1-Math.exp(-e*i)*(Math.cos(o*i)+e/o*Math.sin(o*i)),r=1-n(1);return i=>n(i)+r*i*i}function zt({botes:a=3}={}){const t=Math.min(Math.max(Math.round(a),1),4),o=[1];for(let n=1;n<=t;n++)o.push(o[n-1]/2);const e=o[0]+2*o.slice(1).reduce((n,r)=>n+r,0);return n=>{let r=n*e;if(r<o[0])return(r/o[0])**2;r-=o[0];for(let i=1;i<=t;i++){const s=2*o[i];if(r<s){const l=r/s*2-1;return 1-(o[i]/o[0])**2*(1-l*l)}r-=s}return 1}}function Co({amplitud:a=1,oscilaciones:t=3}={}){const o=2*Math.PI*t,e=i=>1+a*2**(-10*i)*Math.sin((i-.075)*o),n=e(0),r=e(1)-1;return i=>e(i)-n*(1-i)-r*i}function $t({cuanto:a=1,llegada:t=!1}={}){const o=Ft*a,e=o*1.525;return t?n=>n<.5?(2*n)**2*((e+1)*2*n-e)/2:((2*n-2)**2*((e+1)*(n*2-2)+e)+2)/2:n=>(o+1)*n**3-o*n*n}var Gt={lineal:a=>a,entrar:a=>a*a*a,salir:a=>1-(1-a)**3,suave:a=>a<.5?4*a*a*a:1-(-2*a+2)**3/2,pasarse:a=>1+te*(a-1)**3+Ft*(a-1)**2,salto:a=>a>0?1:0,resorte:_t(),gelatina:_t({rebote:.45,oscilaciones:2.5}),rebote:zt(),elastico:Co(),anticipar:$t(),envion:$t({llegada:!0})},ft={resorte:_t,rebotar:zt,rebote:zt,elastico:Co,anticipar:$t};function Et(a){let t;if(typeof a=="function")t=a;else if(a&&typeof a=="object"){const{tipo:o,...e}=a;if(!ft[o])throw new Error(`No conozco la curva { tipo: "${o}" }. Las que se arman con datos son: ${Object.keys(ft).join(", ")}.`);t=ft[o](e)}else t=Gt[a];if(!t)throw new Error(`No conozco la curva "${a}". Las que hay son: ${Object.keys(Gt).join(", ")}.`);return o=>o<=0?0:o>=1?1:t(o)}var Mt=["fondo","superficie","texto","suave","borde","acento","acento2","exito","alerta","error","papel","marco"],oe=new Set(Mt);function S(a){return a==null||a===""||a==="ninguno"?"none":oe.has(a)?`var(--ma-${a})`:a}function ee(a,t,o){if(o<=0)return a;if(o>=1)return t;const e=Math.round((1-o)*1e4)/100;return`color-mix(in srgb, ${S(a)} ${e}%, ${S(t)})`}var ne=96;function Dt(a){const t=String(a).match(/[a-df-z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi)??[],o=[];let e=null,n=0,r=0,i=0,s=0,l=0,c=0,u="",d=0,h="";const m=()=>{const g=Number(t[d++]);if(!Number.isFinite(g))throw new Error(`El camino "${String(a).slice(0,40)}…" está mal escrito.`);return g},b=()=>{e={puntos:[[n,r]],cerrado:!1},o.push(e)},$=g=>{const[x,...p]=g;for(let z=1;z<=16;z++){const A=z/16;e.puntos.push(re([x,...p],A))}};for(;d<t.length;){if(/[a-z]/i.test(t[d]))h=t[d++];else if(!h)throw new Error(`El camino "${String(a).slice(0,40)}…" tiene que empezar con M.`);const g=h===h.toLowerCase(),x=h.toUpperCase(),p=g?n:0,z=g?r:0;if(x==="A")throw new Error("Las formas que se transforman no entienden arcos (A): usá figuras.circulo() o pasá el arco a curvas (C).");if(x==="Z"){e&&(e.cerrado=!0),n=i,r=s,u="Z",h="";continue}if(x==="M"){n=p+m(),r=z+m(),i=n,s=r,b(),h=g?"l":"L",u="M";continue}if(e||b(),x==="L")n=p+m(),r=z+m(),e.puntos.push([n,r]);else if(x==="H")n=p+m(),e.puntos.push([n,r]);else if(x==="V")r=z+m(),e.puntos.push([n,r]);else if(x==="C"||x==="S"){let A;x==="C"?A=[p+m(),z+m()]:A=/[CS]/.test(u)?[2*n-l,2*r-c]:[n,r];const E=[p+m(),z+m()],T=[p+m(),z+m()];$([[n,r],A,E,T]),[l,c]=E,[n,r]=T}else if(x==="Q"||x==="T"){let A;x==="Q"?A=[p+m(),z+m()]:A=/[QT]/.test(u)?[2*n-l,2*r-c]:[n,r];const E=[p+m(),z+m()];$([[n,r],A,E]),[l,c]=A,[n,r]=E}else throw new Error(`El camino tiene un comando "${h}" que no conozco.`);u=x}return o.filter(g=>g.puntos.length>1)}function re(a,t){let o=a;for(;o.length>1;){const e=[];for(let n=0;n<o.length-1;n++)e.push([o[n][0]+(o[n+1][0]-o[n][0])*t,o[n][1]+(o[n+1][1]-o[n][1])*t]);o=e}return o[0]}function ie(a,t,o=ne){const e=t?[...a,a[0]]:a,n=[0];for(let c=1;c<e.length;c++)n.push(n[c-1]+Math.hypot(e[c][0]-e[c-1][0],e[c][1]-e[c-1][1]));const r=n.at(-1);if(!(r>0))return Array.from({length:o},()=>[e[0][0],e[0][1]]);const i=[];let s=1;const l=t?o:o-1;for(let c=0;c<o;c++){const u=c/l*r;for(;s<n.length-1&&n[s]<u;)s++;const d=n[s]-n[s-1]||1,h=Math.min(Math.max((u-n[s-1])/d,0),1);i.push([e[s-1][0]+(e[s][0]-e[s-1][0])*h,e[s-1][1]+(e[s][1]-e[s-1][1])*h])}return i}function se(a,t){const o=a.length;let e=t,n=1/0;for(const r of[t,[...t].reverse()])for(let i=0;i<o;i+=2){let s=0;for(let l=0;l<o;l++){const c=r[(l+i)%o];s+=(a[l][0]-c[0])**2+(a[l][1]-c[1])**2}s<n&&(n=s,e=r.slice(i).concat(r.slice(0,i)))}return e}function le(a){let t=0,o=0;for(const[e,n]of a)t+=e,o+=n;return[t/a.length,o/a.length]}var Ka=new Map;function Wt(a){let t=Ka.get(a);return t||(t=Dt(a).map(o=>({puntos:ie(o.puntos,o.cerrado),cerrado:o.cerrado})),Ka.size>400&&Ka.clear(),Ka.set(a,t)),t}var at=new Map;function ce(a,t,o){if(o===0||!t)return a;if(o===1||!a)return t;const e=`${a}\0${t}`;let n=at.get(e);if(!n){const r=Wt(a),i=Wt(t),s=Math.max(r.length,i.length);n=[];for(let l=0;l<s;l++){const c=r[l]??Jt(i[l],r.at(-1)),u=i[l]??Jt(r[l],i.at(-1)),d=c.cerrado||u.cerrado;n.push({a:c.puntos,b:d?se(c.puntos,u.puntos):u.puntos,cerrado:d})}at.size>400&&at.clear(),at.set(e,n)}return n.map(({a:r,b:i,cerrado:s})=>{let l="";for(let c=0;c<r.length;c++){const u=r[c][0]+(i[c][0]-r[c][0])*o,d=r[c][1]+(i[c][1]-r[c][1])*o;l+=`${c===0?"M":"L"}${wt(u)} ${wt(d)}`}return s?`${l}Z`:l}).join("")}function Jt(a,t){const[o,e]=le((t??a).puntos);return{puntos:a.puntos.map(()=>[o,e]),cerrado:a.cerrado}}function wt(a){return Math.round(a*100)/100}var pt=.5523,_=a=>wt(a),qo={circulo(a=60){return qo.elipse(a*2,a*2)},elipse(a=160,t=100){const o=a/2,e=t/2,n=o*pt,r=e*pt;return`M${_(o)} 0C${_(o)} ${_(r)} ${_(n)} ${_(e)} 0 ${_(e)}C${_(-n)} ${_(e)} ${_(-o)} ${_(r)} ${_(-o)} 0C${_(-o)} ${_(-r)} ${_(-n)} ${_(-e)} 0 ${_(-e)}C${_(n)} ${_(-e)} ${_(o)} ${_(-r)} ${_(o)} 0Z`},rectangulo(a=160,t=100,o=0){const e=a/2,n=t/2,r=Math.min(o,e,n);if(r<=0)return`M${_(-e)} ${_(-n)}H${_(e)}V${_(n)}H${_(-e)}Z`;const i=r*(1-pt);return`M${_(-e+r)} ${_(-n)}H${_(e-r)}C${_(e-i)} ${_(-n)} ${_(e)} ${_(-n+i)} ${_(e)} ${_(-n+r)}V${_(n-r)}C${_(e)} ${_(n-i)} ${_(e-i)} ${_(n)} ${_(e-r)} ${_(n)}H${_(-e+r)}C${_(-e+i)} ${_(n)} ${_(-e)} ${_(n-i)} ${_(-e)} ${_(n-r)}V${_(-n+r)}C${_(-e)} ${_(-n+i)} ${_(-e+i)} ${_(-n)} ${_(-e+r)} ${_(-n)}Z`},poligono(a=6,t=60,o=-90){const e=[];for(let n=0;n<a;n++){const r=(o+360*n/a)*Math.PI/180;e.push(`${_(t*Math.cos(r))} ${_(t*Math.sin(r))}`)}return`M${e.join("L")}Z`},estrella(a=5,t=70,o=.45){const e=[];for(let n=0;n<a*2;n++){const r=n%2?t*o:t,i=(-90+180*n/a)*Math.PI/180;e.push(`${_(r*Math.cos(i))} ${_(r*Math.sin(i))}`)}return`M${e.join("L")}Z`},corazon(a=120){const t=a/120,o=(e,n)=>`${_(e*t)} ${_(n*t)}`;return`M${o(0,45)}C${o(-20,30)} ${o(-60,5)} ${o(-60,-18)}C${o(-60,-40)} ${o(-42,-52)} ${o(-28,-52)}C${o(-14,-52)} ${o(-4,-44)} ${o(0,-34)}C${o(4,-44)} ${o(14,-52)} ${o(28,-52)}C${o(42,-52)} ${o(60,-40)} ${o(60,-18)}C${o(60,5)} ${o(20,30)} ${o(0,45)}Z`},flecha(a=160,t=40){const o=a/2,e=t/2,n=Math.min(t*1.2,a/2);return`M${_(-o)} ${_(-e)}H${_(o-n)}V${_(-e*2)}L${_(o)} 0L${_(o-n)} ${_(e*2)}V${_(e)}H${_(-o)}Z`},tilde(a=100){const t=a/100;return`M${_(-40*t)} ${_(2*t)}L${_(-12*t)} ${_(30*t)}L${_(42*t)} ${_(-28*t)}`},cruz(a=100){const t=a*.35;return`M${_(-t)} ${_(-t)}L${_(t)} ${_(t)}M${_(t)} ${_(-t)}L${_(-t)} ${_(t)}`},linea(a=-80,t=0,o=80,e=0){return`M${_(a)} ${_(t)}L${_(o)} ${_(e)}`}};function ue(a,t,o,e){return e==="numero"?!Number.isFinite(a)||!Number.isFinite(t)?o>=1?t:a:a+(t-a)*o:e==="color"?ee(a,t,Math.min(Math.max(o,0),1)):e==="forma"?ce(a,t,o):o>=1?t:a}function de(a,t,o,e){return o.has(a)?"color":e?.has(a)?"forma":typeof t=="number"?"numero":"discreto"}function fa(a,t,o){return Math.min(Math.max(a,t),o)}function la(a,t,o){const e=t.piezas[a],n=o[a].tamano?.(e)??{ancho:0,alto:0},r=o[a].centro?.(e)??{x:0,y:0};let i=e.x+r.x*e.escala,s=e.y+r.y*e.escala,l=e.escala,c=e.dentro;for(;c!=null;){const u=t.piezas[c],d=o[c].origenContenedor?.(u)??{x:0,y:0,escala:1};i=u.x+u.escala*(d.x+d.escala*i),s=u.y+u.escala*(d.y+d.escala*s),l*=u.escala*d.escala,c=u.dentro}return{x:i,y:s,ancho:n.ancho*l,alto:n.alto*l}}function So(a,t,o,e){const n=(s,l)=>{const c={piezas:{...o.piezas,__punto:{x:s,y:l,escala:1,dentro:t}}};return la("__punto",c,{...e,__punto:{}})},r=n(0,0),i=n(1,0).x-r.x||1;return{x:(a.x-r.x)/i,y:(a.y-r.y)/i,escala:i}}function Lo(a,t,o=0,e=0){const n=t.x-a.x,r=t.y-a.y,i=Math.hypot(n,r)||1,s={x:(a.x+t.x)/2-r/i*o*i,y:(a.y+t.y)/2+n/i*o*i};if(o===0){const l=tt(a,t,e),c=tt(t,a,e);return{p0:l,c:{x:(l.x+c.x)/2,y:(l.y+c.y)/2},p1:c}}return{p0:tt(a,s,e),c:s,p1:tt(t,s,e)}}function tt(a,t,o){const e=t.x-a.x,n=t.y-a.y,r=Math.hypot(e,n);if(r===0)return{x:a.x,y:a.y};const i=e/r,s=n/r,l=(a.ancho??0)/2,c=(a.alto??0)/2,u=Math.min(i===0?1/0:l/Math.abs(i),s===0?1/0:c/Math.abs(s)),d=(Number.isFinite(u)?u:0)+o;return{x:a.x+i*d,y:a.y+s*d}}function wa({p0:a,c:t,p1:o},e){const n=1-e;return{x:n*n*a.x+2*n*e*t.x+e*e*o.x,y:n*n*a.y+2*n*e*t.y+e*e*o.y}}function rt({p0:a,c:t,p1:o},e){const n=2*(1-e)*(t.x-a.x)+2*e*(o.x-t.x),r=2*(1-e)*(t.y-a.y)+2*e*(o.y-t.y);return Math.atan2(r,n)}var it=32;function me(a){const t=[0];let o=a.p0;for(let e=1;e<=it;e++){const n=wa(a,e/it);t.push(t[e-1]+Math.hypot(n.x-o.x,n.y-o.y)),o=n}return t}function Qt(a,t){const o=a[it];if(t<=0||o===0)return 0;if(t>=1)return 1;const e=t*o;let n=1;for(;a[n]<e;)n++;const r=a[n]-a[n-1],i=r===0?0:(e-a[n-1])/r;return(n-1+i)/it}function he({p0:a,c:t,p1:o},e){const n={x:a.x+(t.x-a.x)*e,y:a.y+(t.y-a.y)*e};return{p0:a,c:n,p1:wa({p0:a,c:t,p1:o},e)}}function Xa(a,t=0){const o=String(a??"").split(`
`);if(!(t>0))return o;const e=[];for(const n of o){let r="";for(const i of n.split(" ")){const s=r?`${r} ${i}`:i;Oo(s)>t&&r?(e.push(r),r=i):r=s}e.push(r)}return e}function ko(a,t){if(t>=1)return a;const o=a.reduce((n,r)=>n+Oo(r),0);let e=Math.floor(o*Math.max(t,0)+1e-9);return a.map(n=>{const r=Array.from(n),i=r.slice(0,e).join("");return e=Math.max(e-r.length,0),i})}function Oo(a){return Array.from(a).length}var Aa=.55,Kt=["derecha","izquierda","arriba","abajo","centro"];function fe(a){const t={};for(const[o,e]of Object.entries(a)){const n=e.base.pegar;if(n!=null){if(typeof n!="object"||typeof n.a!="string")throw new Error(`"${o}" tiene pegar, pero le falta "a": el id de la pieza a la que se pega, por ejemplo pegar: { a: 'caja', lado: 'derecha' }.`);if(!a[n.a])throw new Error(`"${o}" se pega a "${n.a}", y no hay ninguna pieza que se llame así.`);if(n.lado!=null&&!Kt.includes(n.lado))throw new Error(`"${o}" se pega del lado "${n.lado}": los lados son ${Kt.join(", ")}.`)}if(e.tipo.nombre==="fila")for(const r of e.base.piezas){if(!a[r])throw new Error(`La fila "${o}" lleva "${r}", y no hay ninguna pieza que se llame así.`);if(t[r])throw new Error(`"${r}" está en dos filas: "${t[r]}" y "${o}".`);if(a[r].base.pegar!=null)throw new Error(`"${r}" está en la fila "${o}" y además pegada a otra pieza: es una cosa o la otra.`);t[r]=o}}return t}function pe(a){return Object.values(a).some(t=>t.base.pegar!=null||t.tipo.nombre==="fila")}function be(a,t,o){const e={piezas:a},n={},r=(d,h=new Set)=>{if(n[d])return n[d];if(h.has(d))throw new Error(`La fila "${d}" está dentro de sí misma.`);h.add(d);const m=a[d],b=m.direccion!=="vertical";let $=0,g=0;const x=m.piezas.map((p,z)=>{t[p].nombre==="fila"&&r(p,h);const A=la(p,e,t),[E,T]=b?[A.ancho,A.alto]:[A.alto,A.ancho],v=z===0?0:m.separacion*Math.min(Math.max(a[p].escala,0),1);return $+=v+E,g=Math.max(g,T),{hijo:p,largo:E,ancho:T,hueco:v}});return m.ancho=b?$:g,m.alto=b?g:$,n[d]={tramos:x,largo:$,ancho:g,horizontal:b}};for(const d of Object.keys(a))t[d].nombre==="fila"&&r(d);const i=new Set,s=(d,h=new Set)=>{if(i.has(d))return;if(h.has(d))throw new Error(`"${d}" depende de sí misma dando una vuelta: revisá los pegar y las filas.`);h.add(d);const m=a[d];m.dentro!=null&&s(m.dentro,h);const b=o[d];b?(s(b,h),u(d,l(b,d),m)):m.pegar!=null&&(s(m.pegar.a,h),u(d,c(d,m.pegar),m)),i.add(d)},l=(d,h)=>{const m=n[d],b=la(d,e,t),$=m.horizontal?b.x:b.y,g=m.horizontal?b.y:b.x;let x=$-m.largo/2;for(const p of m.tramos){if(x+=p.hueco,p.hijo===h){const z=bt(a[d].alinear,g,m.ancho,p.ancho),A=x+p.largo/2;return m.horizontal?{x:A,y:z}:{x:z,y:A}}x+=p.largo}return null},c=(d,h)=>{const m=la(h.a,e,t),b=la(d,e,t),$=h.separacion??0,g=h.lado??"derecha";let x=m.x,p=m.y;return g==="derecha"&&(x=m.x+m.ancho/2+$+b.ancho/2),g==="izquierda"&&(x=m.x-m.ancho/2-$-b.ancho/2),g==="abajo"&&(p=m.y+m.alto/2+$+b.alto/2),g==="arriba"&&(p=m.y-m.alto/2-$-b.alto/2),(g==="derecha"||g==="izquierda")&&(p=bt(h.alinear,m.y,m.alto,b.alto)),(g==="arriba"||g==="abajo")&&(x=bt(h.alinear,m.x,m.ancho,b.ancho)),{x:x+(h.dx??0),y:p+(h.dy??0)}},u=(d,h,m)=>{if(!h)return;const b=m.dentro!=null?{...So(h,m.dentro,e,t)}:{...h},$=t[d].centro?.(m)??{x:0,y:0};b.x-=$.x*m.escala,b.y-=$.y*m.escala;const g=Math.min(Math.max(m.pegado??1,0),1);m.x+=(b.x-m.x)*g,m.y+=(b.y-m.y)*g};for(const d of Object.keys(a))s(d)}function bt(a,t,o,e){return a==="inicio"?t-o/2+e/2:a==="fin"?t+o/2-e/2:t}function nt(a=1){let t=typeof a=="string"?xe(a):a>>>0;function o(){t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}return{siguiente:o,entre:(e,n)=>e+o()*(n-e),entero:(e,n)=>e+Math.floor(o()*(n-e+1)),elegir:e=>e[Math.floor(o()*e.length)]}}function xe(a){let t=2166136261;for(let o=0;o<a.length;o++)t^=a.charCodeAt(o),t=Math.imul(t,16777619);return t>>>0}var ge=new Set(["opacidad","trazo"]),ve=.03;function ya(a,t=15){return Math.max(1.5,String(a).length/t)}function ye(a,t={}){const o=t.movimiento??"completo",e=t.disposicion??{nombre:"ancha"},n=t.estilo??{},r=n.movimiento??{},i=typeof a=="function"?a(e):a;if(!i||typeof i!="object")throw new Error("La escena tiene que ser un objeto.");for(const v of["ancho","alto"])if(!(i[v]>0))throw new Error(`A la escena le falta el ${v}: es el tamaño del dibujo, por ejemplo 1600 × 900.`);const s={};for(const[v,q]of Object.entries(i.piezas??{})){if(!q||!q.tipo||!q.props)throw new Error(`"${v}" no es una pieza: armala con caja({...}), texto({...}), etc.`);s[v]={id:v,tipo:q.tipo,base:Ee(q,n.piezas?.[q.tipo.nombre]),colores:new Set(q.tipo.colores??[]),formas:new Set(q.tipo.formas??[]),segmentos:{}}}for(const v of Object.values(s)){const q=v.base.dentro;if(q!=null&&!s[q])throw new Error(`"${v.id}" va dentro de "${q}", pero no hay ninguna pieza que se llame así.`)}const l=fe(s),c=pe(s),u=Object.fromEntries(Object.values(s).map(v=>[v.id,v.tipo])),d=[],h=[],m=[],b=[];let $=0,g=0,x=0,p={inicio:0,fin:0},z=0;(i.linea??[]).forEach((v,q)=>{const O=`el paso ${q+1} de la línea`,L=_e(v.en,$,p,O);let C=L;if("capitulo"in v)d.push({nombre:String(v.capitulo),t:L});else if("subtitulo"in v){const M=v.dur??(v.hasta!=null?v.hasta-L:ya(v.subtitulo,i.lectura));h.push({texto:String(v.subtitulo),desde:L,hasta:L+M}),g=Math.max(g,L+M),x=L+M;return}else if("sonido"in v&&!("pieza"in v)){b.push(to(v.sonido,L,v,O));return}else if("marca"in v)C=L+(v.dur??0),m.push({tipo:String(v.marca),t:L,hasta:C,datos:v.datos??null});else if("espera"in v)C=v.espera==="subtitulo"?Math.max(L,x):L+v.espera;else if("pieza"in v){const M=Array.isArray(v.pieza)?v.pieza:[v.pieza],N=v.dur??r.dur??.6,R=we(v.escalonar??(M.length>1?r.escalonar:0)??0,M.length,q),G=v.curva!=null?Et(v.curva):null,H=y=>G??Me(r,y);if(!v.a||typeof v.a!="object")throw new Error(`En ${O} falta "a": a qué valores va la pieza, por ejemplo a: { opacidad: 1 }.`);if(M.forEach((y,k)=>{const D=s[y];if(!D)throw new Error(`En ${O} se anima "${y}", pero no hay ninguna pieza que se llame así.`);const F=L+R[k];for(const[V,I]of Object.entries(v.a)){if(!(V in D.base))throw new Error(`En ${O}, "${y}" (una ${D.tipo.nombre}) no tiene la propiedad "${V}". Las que tiene son: ${Object.keys(D.base).join(", ")}.`);(D.segmentos[V]??=[]).push({t0:F,t1:F+N,hasta:I,desde:v.desde?.[V],curva:H(V),orden:z++})}}),C=L+Math.max(0,...R)+N,v.sonido!=null){const y=typeof v.sonido=="string"?{nombre:v.sonido}:v.sonido,k=y.cadaPieza?R.map(D=>L+D):[L];for(const D of k)b.push(to(y,y.al==="fin"?D+N:D,y,O))}}else throw new Error(`No entiendo ${O}: tiene que ser una animación (pieza), un capitulo, un subtitulo, un sonido, una marca o una espera.`);p={inicio:L,fin:C},$=Math.max($,C)});for(const v of Object.values(s))for(const[q,O]of Object.entries(v.segmentos)){O.sort((C,M)=>C.t0-M.t0||C.orden-M.orden);const L=de(q,v.base[q],v.colores,v.formas);O.forEach((C,M)=>{if(L==="numero"&&typeof C.hasta!="number")throw new Error(`"${v.id}.${q}" es un número y se la quiere llevar a ${JSON.stringify(C.hasta)}.`);if(C.clase=L,L==="forma"&&typeof C.hasta!="string")throw new Error(`"${v.id}.${q}" es una forma (un camino de SVG, como figuras.circulo(60)), no ${JSON.stringify(C.hasta)}.`);C.desde===void 0&&(C.desde=ao(O.slice(0,M),v.base[q],C.t0)),o==="reducido"&&L==="numero"&&!ge.has(q)&&(C.curva=Et("salto"))})}n.sonidos&&b.push(...je(s,n.sonidos)),d.sort((v,q)=>v.t-q.t),m.sort((v,q)=>v.t-q.t);const A=Ae(b),E=i.duracion??Math.max($,g)+(i.pausaFinal??0),T=Ce(s);return{titulo:i.titulo??"",descripcion:i.descripcion??"",ancho:i.ancho,alto:i.alto,duracion:E,movimiento:o,disposicion:e.nombre,ids:T,tipos:Object.fromEntries(T.map(v=>[v,s[v].tipo])),capitulos:d,subtitulos:h,marcas:m,sonidos:A.filter(v=>v.t<=E),musica:i.musica??n.musica??null,lupa:i.lupa??null,estado(v){const q=fa(Number(v)||0,0,E),O={};for(const C of T){const M=s[C],N={...M.base};for(const[R,G]of Object.entries(M.segmentos))N[R]=ao(G,M.base[R],q);O[C]=N}c&&be(O,u,l);const L=$e(h,q);return{t:q,piezas:O,capitulo:ze(d,q),subtitulo:L<0?"":h[L].texto,subtituloIndice:L}}}}function ao(a,t,o){let e=t;for(const n of a){if(o<n.t0)break;if(o>=n.t1)e=n.hasta;else{const r=(o-n.t0)/(n.t1-n.t0);e=ue(n.desde,n.hasta,n.curva(r),n.clase)}}return e}function _e(a,t,o,e){if(a===void 0)return t;if(typeof a=="number")return a;const n=typeof a=="string"&&a.trim().match(/^([+<>])\s*([+-]?\d*\.?\d+)?$/);if(!n)throw new Error(`En ${e}, "en: ${JSON.stringify(a)}" no se entiende. Usá un número, '+0.5', '<', '<0.2' o '>'.`);return(n[1]==="+"?t:n[1]==="<"?o.inicio:o.fin)+(n[2]?parseFloat(n[2]):0)}function ze(a,t){let o=-1;for(let e=0;e<a.length;e++)a[e].t<=t&&(o=e);return o}function $e(a,t){let o=-1,e=-1/0;return a.forEach((n,r)=>{n.desde<=t&&t<n.hasta&&n.desde>=e&&(o=r,e=n.desde)}),o}function Ee(a,t){const o={...a.props};if(!t||!a.propias)return o;const e=new Set(a.propias);for(const[n,r]of Object.entries(t))n in o&&!e.has(n)&&(o[n]=r);return o}function Me(a,t){return Et(a.curvas?.[t]??a.curva??"suave")}function we(a,t,o){const e=typeof a=="number"?a:a?.cada??.05,n=typeof a=="number"?"inicio":a?.orden??"inicio",r=(t-1)/2;let i;if(n==="inicio")i=s=>s;else if(n==="fin")i=s=>t-1-s;else if(n==="centro")i=s=>Math.abs(s-r);else if(n==="bordes")i=s=>r-Math.abs(s-r);else if(n==="azar"){const s=nt(typeof a=="object"&&a.semilla!=null?a.semilla:o+1),l=Array.from({length:t},(c,u)=>u);for(let c=t-1;c>0;c--){const u=Math.floor(s.siguiente()*(c+1));[l[c],l[u]]=[l[u],l[c]]}i=c=>l.indexOf(c)}else throw new Error(`El orden de un escalonado es 'inicio', 'fin', 'centro', 'bordes' o 'azar', no "${n}".`);return Array.from({length:t},(s,l)=>Math.round(i(l)*e*1e6)/1e6)}function to(a,t,o,e){const n=typeof a=="string"?{nombre:a}:a;if(!n||typeof n.nombre!="string"||!n.nombre)throw new Error(`En ${e}, el sonido tiene que tener un nombre: sonido: 'pop', o sonido: { nombre: 'pop', volumen: 0.5 }.`);return{nombre:n.nombre,t:Math.max(0,t),volumen:n.volumen??o.volumen??1,tono:n.tono??o.tono??0}}function je(a,t){const o=[],e=t.volumen??1,n=t.distancia??150;for(const r of Object.values(a)){for(const i of r.segmentos.opacidad??[])t.aparecer&&i.desde<.5&&i.hasta>=.5?o.push({nombre:t.aparecer,t:i.t0,volumen:e,tono:0}):t.desaparecer&&i.desde>=.5&&i.hasta<.5&&o.push({nombre:t.desaparecer,t:i.t0,volumen:e,tono:0});if(t.mover){const i=new Set;for(const s of["x","y"])for(const l of r.segmentos[s]??[])typeof l.desde!="number"||Math.abs(l.hasta-l.desde)<n||i.has(l.t0)||(i.add(l.t0),o.push({nombre:t.mover,t:l.t0,volumen:e,tono:0}))}}return o}function Ae(a){const t=[...a].sort((e,n)=>e.t-n.t||e.nombre.localeCompare(n.nombre)),o=new Map;return t.filter(e=>{const n=o.get(e.nombre);return n!=null&&e.t-n<ve?!1:(o.set(e.nombre,e.t),!0)})}function Ce(a){const t=new Set,o=[],e=(n,r)=>{if(t.has(n))return;if(r.has(n))throw new Error(`"${n}" está dentro de sí misma, dando una vuelta: revisá los "dentro".`);r.add(n);const i=a[n].base.dentro;i!=null&&e(i,r),t.add(n),o.push(n)};for(const n of Object.keys(a))e(n,new Set);return o}var qe=.25,Se=class{constructor(a){this.duracion=a.duracion,this.loop=a.loop??!1,this.velocidad=a.velocidad??1,this.alCambiar=a.alCambiar??(()=>{}),this.alCambiarEstado=a.alCambiarEstado??(()=>{}),this.paradas=[...a.paradas??[]].sort((t,o)=>t-o),this.alParar=a.alParar??(()=>{}),this.ahora=a.ahora??(()=>performance.now()),this.pedirCuadro=a.pedirCuadro??(t=>requestAnimationFrame(t)),this.cancelarCuadro=a.cancelarCuadro??(t=>cancelAnimationFrame(t)),this.t=0,this.corriendo=!1,this._pedido=null,this._ultimo=0,this._cuadro=this._cuadro.bind(this)}reproducir(){this.corriendo||(this.t>=this.duracion&&this._fijar(0),this.corriendo=!0,this._ultimo=this.ahora(),this._pedido=this.pedirCuadro(this._cuadro),this.alCambiarEstado(!0))}pausar(){this.corriendo&&(this.corriendo=!1,this._pedido!=null&&this.cancelarCuadro(this._pedido),this._pedido=null,this.alCambiarEstado(!1))}alternar(){this.corriendo?this.pausar():this.reproducir()}irA(a){this._fijar(fa(a,0,this.duracion)),this._ultimo=this.ahora()}cambiarVelocidad(a){this.velocidad=a}fijarParadas(a){this.paradas=[...a].sort((t,o)=>t-o)}destruir(){this.pausar(),this.alCambiar=()=>{},this.alCambiarEstado=()=>{},this.alParar=()=>{}}_cuadro(){const a=this.ahora(),t=Math.min((a-this._ultimo)/1e3,qe)*this.velocidad;this._ultimo=a;let o=this.t+t;const e=this.paradas.find(n=>n>this.t&&n<=Math.min(o,this.duracion));if(e!==void 0){this._fijar(e),this.pausar(),this.alParar(e);return}if(o>=this.duracion)if(this.loop&&this.duracion>0)o%=this.duracion;else{this._fijar(this.duracion),this.pausar();return}this._fijar(o),this.corriendo&&(this._pedido=this.pedirCuadro(this._cuadro))}_fijar(a){this.t=a,this.alCambiar(a)}},Le="http://www.w3.org/2000/svg";function f(a,t={},o){const e=document.createElementNS(Le,a);return w(e,t),o&&o.appendChild(e),e}function w(a,t){const o=a.__previos??={};for(const[e,n]of Object.entries(t)){const r=n==null?null:typeof n=="number"?ke(n):String(n);o[e]!==r&&(o[e]=r,r===null?a.removeAttribute(e):a.setAttribute(e,r))}}function X(a,t){a.__texto!==t&&(a.__texto=t,a.textContent=t)}function ke(a){return String(Math.round(a*100)/100)}function Pt(a,{dy:t=8,desenfoque:o=9,opacidad:e=.3}={}){const n=ua("ma-sombra"),r=f("filter",{id:n,x:"-20%",y:"-20%",width:"140%",height:"160%"},f("defs",{},a));return f("feDropShadow",{dx:0,dy:t,stdDeviation:o,"flood-color":"#000","flood-opacity":e},r),`url(#${n})`}var oo=0;function ua(a){return oo+=1,`${a}-${oo}`}function Nt(a,t,{x:o=0,y:e=0,tamano:n,interlineado:r=1.25}){for(;a.childNodes.length>t.length;)a.lastChild.remove();for(;a.childNodes.length<t.length;)f("tspan",{},a);const i=n*r,s=e-(t.length-1)*i/2;t.forEach((l,c)=>{const u=a.childNodes[c];w(u,{x:o,y:s+c*i}),X(u,l===""?" ":l)})}function Oe(a,t,o={}){const e=o.arrastres??{},n=o.estilo??{};a.replaceChildren(),w(a,{viewBox:`0 0 ${t.ancho} ${t.alto}`,preserveAspectRatio:"xMidYMid meet"});const r=f("defs",{},a);f("rect",{x:0,y:0,width:t.ancho,height:t.alto,fill:Ie(r,n.fondo)},a);const i=ua("ma-marco");f("rect",{x:0,y:0,width:t.ancho,height:t.alto},f("clipPath",{id:i},r));const s=f("g",{"clip-path":`url(#${i})`},a),l=Te(r,a,t,n.efectos??{}),c=f("g",l.filtro?{filter:`url(#${l.filtro})`}:{},s);l.encima(s);const u=f("g",{id:ua("ma-dibujo")},c);let d=null;const h=t.estado(0),m={estado:h,tipos:t.tipos,id:"",ids:t.ids,arrastres:e},b={};for(const g of t.ids){const x=t.tipos[g],p=h.piezas[g],z=p.dentro!=null?b[p.dentro].contenido:u,A=f("g",{"data-pieza":g},z);m.id=g;const E=x.crear(A,p,m);b[g]={tipo:x,grupo:A,partes:E,contenido:x.contenedor?x.contenedor(E):null,ultimo:null}}return{pintar(g){m.estado=g,l.pintar(g.t);for(const x of t.ids){const p=b[x],z=g.piezas[x],A=z.opacidad<=0||z.trazo<=0,E=e[x]?$(x,e[x],g):{x:0,y:0};w(p.grupo,{transform:`translate(${sa(z.x+E.x)} ${sa(z.y+E.y)})`+(z.rotacion?` rotate(${sa(z.rotacion)})`:"")+(z.escala!==1?` scale(${sa(z.escala)})`:""),opacity:z.opacidad>=1?null:sa(z.opacidad),visibility:A?"hidden":null}),!(A||!p.tipo.dependeDeOtras&&Re(p.ultimo,z))&&(m.id=x,p.tipo.actualizar(p.partes,z,m),p.ultimo=z,(z.trazo<1||p.trazando)&&Ne(p,z.trazo))}},posicion(g){return la(g,m.estado,t.tipos)},lupa(g){if(!g?.activa){d?.grupo.setAttribute("visibility","hidden");return}d??=Fe(a,r,u),De(d,g)}};function $(g,x,p){const z=la(g,p,t.tipos),A=(E,T,v,q)=>T*2>=q?q/2-v:Math.min(Math.max(E,T-v),q-T-v);return x.x=A(x.x,z.ancho/2,z.x,t.ancho),x.y=A(x.y,z.alto/2,z.y,t.alto),x}}function Fe(a,t,o){const e=ua("ma-lupa"),n=f("rect",{},f("clipPath",{id:e},t)),r=f("g",{"data-lupa":"cuerpo",class:"ma-lupa"},a),i=f("rect",{fill:"var(--ma-fondo)",filter:Pt(t,{dy:8,desenfoque:9,opacidad:.35})},r),s=f("g",{"clip-path":`url(#${e})`},r),l=f("g",{},s);for(const d of o.querySelectorAll(":scope > g[data-pieza]"))d.id||(d.id=ua("ma-pieza")),f("use",{href:`#${d.id}`},l);const c=f("rect",{fill:"none",stroke:"var(--ma-texto)"},r),u=f("circle",{"data-lupa":"asa",fill:"var(--ma-acento)",stroke:"var(--ma-fondo)",class:"ma-lupa-asa"},r);return{grupo:r,recorte:n,fondo:i,uso:l,aro:c,asa:u}}function De(a,t){const o=t.forma==="circulo",e=o?Math.min(t.ancho,t.alto):t.ancho,n=o?e:t.alto,r=o?e/2:Math.min(18,e/4),i={x:t.x-e/2,y:t.y-n/2,width:e,height:n,rx:r,ry:r},s=t.pixel??1;a.grupo.removeAttribute("visibility"),w(a.recorte,i),w(a.fondo,i),w(a.aro,{...i,"stroke-width":3*s}),w(a.uso,{transform:`translate(${sa(t.x)} ${sa(t.y)}) scale(${sa(t.zoom)}) translate(${sa(-t.x)} ${sa(-t.y)})`});const l=o?t.x+e/2*Math.SQRT1_2:t.x+e/2,c=o?t.y+n/2*Math.SQRT1_2:t.y+n/2;w(a.asa,{cx:l,cy:c,r:11*s,"stroke-width":3*s})}var Pe="path, line, polyline, polygon, rect, circle, ellipse",eo=.7;function Ne(a,t){const o=a.grupo,e=[...o.querySelectorAll(Pe)].filter(r=>r.closest("[data-pieza]")===o);if(t>=1){for(const r of e)r.removeAttribute("pathLength"),r.style.removeProperty("stroke-dasharray"),r.__trazoPrestado&&(r.style.removeProperty("stroke"),r.style.removeProperty("stroke-width"),r.__trazoPrestado=!1);o.style.removeProperty("fill-opacity"),a.trazando=!1;return}a.trazando=!0;for(const r of e){const i=r.style;r.setAttribute("pathLength","1"),i.setProperty("stroke-dasharray",`${Math.max(t,0).toFixed(4)} 1`);const s=r.getAttribute("stroke"),l=r.getAttribute("fill");(!s||s==="none")&&l&&l!=="none"&&(i.setProperty("stroke",l),i.setProperty("stroke-width","3"),r.__trazoPrestado=!0)}const n=Math.min(Math.max((t-eo)/(1-eo),0),1);o.style.setProperty("fill-opacity",n.toFixed(3))}function Ie(a,t){if(!t?.degradado)return"var(--ma-fondo)";const[o,e]=t.degradado.map(S),n=ua("ma-fondo"),r=t.forma==="radial",i=(t.angulo??90)*Math.PI/180,s=f(r?"radialGradient":"linearGradient",r?{id:n,cx:"50%",cy:"45%",r:"75%"}:{id:n,x1:sa(.5-Math.cos(i)/2),y1:sa(.5-Math.sin(i)/2),x2:sa(.5+Math.cos(i)/2),y2:sa(.5+Math.sin(i)/2)},a);return f("stop",{offset:0,"stop-color":o},s),f("stop",{offset:1,"stop-color":e},s),`url(#${n})`}function Te(a,t,o,e){const{ancho:n,alto:r}=o,i={filtro:null,encima:l=>{},pintar:l=>{}},s=[];if(e.aMano||e.sombra||e.brillo){const l=ua("ma-efectos"),c=.06,u=f("filter",{id:l,filterUnits:"userSpaceOnUse",x:-n*c,y:-r*c,width:n*(1+2*c),height:r*(1+2*c),"color-interpolation-filters":"sRGB"},a);let d="SourceGraphic";if(e.aMano){const h=e.aMano===!0?{}:e.aMano,m=f("feTurbulence",{type:"fractalNoise",baseFrequency:h.detalle??.03,numOctaves:2,seed:1,result:"temblor"},u);f("feDisplacementMap",{in:d,in2:"temblor",scale:(h.fuerza??2)*2,xChannelSelector:"R",yChannelSelector:"G",result:"amano"},u),d="amano";const b=h.hervir??0;b>0&&s.push($=>w(m,{seed:Math.floor($*b)%97+1}))}if(e.sombra){const h=e.sombra===!0?{}:e.sombra;f("feDropShadow",{in:d,dx:h.dx??0,dy:h.dy??6,stdDeviation:h.desenfoque??8,"flood-color":S(h.color??"#000"),"flood-opacity":h.opacidad??.3,result:"sombra"},u),d="sombra"}if(e.brillo){const h=Math.min(Math.max(Number(e.brillo)||0,0),1.5);f("feGaussianBlur",{in:d,stdDeviation:4+10*h,result:"halo"},u),f("feComponentTransfer",{in:"halo",result:"haloFuerte"},u).appendChild(f("feFuncA",{type:"linear",slope:.6+h}));const m=f("feMerge",{},u);f("feMergeNode",{in:"haloFuerte"},m),f("feMergeNode",{in:d},m)}i.filtro=l}return i.encima=l=>{if(e.vineta){const c=ua("ma-vineta"),u=f("radialGradient",{id:c,cx:"50%",cy:"50%",r:"72%"},a);f("stop",{offset:.55,"stop-color":"#000","stop-opacity":0},u),f("stop",{offset:1,"stop-color":"#000","stop-opacity":Math.min(Number(e.vineta)||0,1)},u),f("rect",{x:0,y:0,width:n,height:r,fill:`url(#${c})`,"pointer-events":"none","aria-hidden":"true"},l)}if(e.grano){const c=e.grano===!0?{}:e.grano,u=ua("ma-grano"),d=f("filter",{id:u,x:0,y:0,width:"100%",height:"100%"},a),h=f("feTurbulence",{type:"fractalNoise",baseFrequency:.85,numOctaves:1,seed:1,stitchTiles:"stitch"},d);f("feColorMatrix",{type:"saturate",values:0},d),f("rect",{x:0,y:0,width:n,height:r,filter:`url(#${u})`,opacity:Math.min(Number(c.cantidad??.08),.5),"pointer-events":"none","aria-hidden":"true",style:"mix-blend-mode: overlay"},l),c.animado!==!1&&s.push(m=>w(h,{seed:Math.floor(m*12)%89+1}))}},i.pintar=l=>{for(const c of s)c(l)},i}function Re(a,t){if(!a)return!1;for(const o in t)if(a[o]!==t[o])return!1;return!0}function sa(a){return Math.round(a*100)/100}var Be={reproducir:'<path d="M8 5v14l11-7z"/>',pausar:'<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>',anterior:'<path d="M6 6h2v12H6zM9.5 12 18 6v12z"/>',siguiente:'<path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z"/>',pantalla:'<path d="M5 5h5v2H7v3H5zM14 5h5v5h-2V7h-3zM5 14h2v3h3v2H5zM17 14h2v5h-5v-2h3z"/>',sonido:'<path d="M4 9h4l5-4v14l-5-4H4zM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 9h4l5-4v14l-5-4H4z"/>',silencio:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'},xt=[.5,.75,1,1.5,2];function Ea(a){return`<svg viewBox="0 0 24 24" aria-hidden="true">${Be[a]}</svg>`}function ot(a){const t=Math.floor(Math.max(a,0));return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}function Ve(a,t){a.innerHTML=`
        <button type="button" data-accion="anterior" aria-label="Capítulo anterior">${Ea("anterior")}</button>
        <button type="button" data-accion="alternar" aria-label="Reproducir">${Ea("reproducir")}</button>
        <button type="button" data-accion="siguiente" aria-label="Capítulo siguiente">${Ea("siguiente")}</button>
        <div class="ma-linea">
            <input type="range" min="0" max="1" step="0.1" value="0" aria-label="Momento de la animación">
            <div class="ma-marcas" aria-hidden="true"></div>
        </div>
        <span class="ma-tiempo" aria-hidden="true">0:00 / 0:00</span>
        <button type="button" data-accion="velocidad" aria-label="Velocidad: normal">1×</button>
        <button type="button" data-accion="subtitulos" aria-pressed="true" aria-label="Subtítulos">CC</button>
        <button type="button" data-accion="sonido" aria-pressed="true" aria-label="Sonido">${Ea("sonido")}</button>
        <button type="button" data-accion="pantalla" aria-label="Pantalla completa">${Ea("pantalla")}</button>
        <div class="ma-capitulo" aria-live="polite"></div>
    `;const o=p=>a.querySelector(p),e=o('[data-accion="alternar"]'),n=o('[data-accion="velocidad"]'),r=o('[data-accion="subtitulos"]'),i=o('[data-accion="sonido"]'),s=o("input"),l=o(".ma-marcas"),c=o(".ma-tiempo"),u=o(".ma-capitulo"),d=t.hilo?.querySelector(".ma-hilo-avance")??null,h=t.hilo?.querySelector(".ma-hilo-marcas")??null;let m=0,b=[],$=1,g=null;a.addEventListener("click",p=>{const z=p.target.closest("button");if(!z)return;const A=z.dataset.accion;if(A==="velocidad")$=xt[(xt.indexOf($)+1)%xt.length],t.velocidad($);else if(A==="subtitulos"){const E=z.getAttribute("aria-pressed")!=="true";t.subtitulos(E)}else A==="sonido"?t.sonido(z.getAttribute("aria-pressed")!=="true"):t[A]()}),s.addEventListener("input",()=>t.irA(Number(s.value)));let x=!1;s.addEventListener("pointerdown",()=>{x=!0});for(const p of["pointerup","pointercancel"])s.addEventListener(p,()=>{x=!1});return{configurar(p,z=[]){m=p.duracion,b=p.capitulos,s.max=String(m);const A=E=>`left: ${(E/m*100).toFixed(2)}%`;l.innerHTML=b.filter(E=>E.t>0).map(E=>`<span style="${A(E.t)}"></span>`).concat(z.map(E=>`<span class="${E.clase}" style="${A(E.t)}">${E.texto??""}</span>`)).join(""),h&&(h.innerHTML=b.filter(E=>E.t>0).map(E=>`<span style="${A(E.t)}"></span>`).concat(z.map(E=>`<span class="${E.clase}" style="${A(E.t)}"></span>`)).join("")),g=null},mostrar(p){x||(s.value=String(p.t)),d&&(d.style.transform=`scaleX(${m>0?(p.t/m).toFixed(4):0})`);const z=`${ot(p.t)} / ${ot(m)}`;c.textContent!==z&&(c.textContent=z);const A=b[p.capitulo];s.setAttribute("aria-valuetext",`${ot(p.t)} de ${ot(m)}${A?`, ${A.nombre}`:""}`),p.capitulo!==g&&(g=p.capitulo,u.textContent=A?`${p.capitulo+1}/${b.length} · ${A.nombre}`:"")},corriendo(p){e.innerHTML=Ea(p?"pausar":"reproducir"),e.setAttribute("aria-label",p?"Pausar":"Reproducir")},velocidad(p){$=p,n.textContent=`${String(p).replace(".",",")}×`,n.setAttribute("aria-label",p===1?"Velocidad: normal":`Velocidad: ${String(p).replace(".",",")} veces`)},subtitulos(p){r.setAttribute("aria-pressed",String(p))},sonido(p){i.setAttribute("aria-pressed",String(p)),i.innerHTML=Ea(p?"sonido":"silencio")}}}var Fo={fondo:"#f6f4ef",superficie:"#ffffff",texto:"#1c2230",suave:"#5a6372",borde:"#c3cad4",acento:"#1f5fd1",acento2:"#c2410c",exito:"#15803d",alerta:"#a16207",error:"#b91c1c",papel:"#fdf6dc",marco:"#232a35"},Do={fondo:"#12161d",superficie:"#1e2530",texto:"#e8ebf0",suave:"#9ba5b3",borde:"#3b4553",acento:"#73a9ff",acento2:"#fb923c",exito:"#4ade80",alerta:"#facc15",error:"#f87171",papel:"#3b3526",marco:"#556070"};function no(a,t){return Object.entries(a).map(([o,e])=>{const n=t?`var(--motor-${o}-oscuro, var(--motor-${o}, ${e}))`:`var(--motor-${o}, ${e})`;return`--ma-${o}: ${n};`}).join(`
    `)}var Rn={claro:Fo,oscuro:Do},Ue=`
.ma-raiz {
    ${no(Fo,!1)}
    --ma-fuente: var(--motor-fuente, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
    --ma-fuente-mono: var(--motor-fuente-mono, ui-monospace, "Cascadia Mono", Consolas, "Liberation Mono", monospace);
    color-scheme: light;
}
.ma-raiz[data-tema="oscuro"] {
    ${no(Do,!0)}
    color-scheme: dark;
}
`,He=`
${Ue}

:host {
    display: block;
    position: relative;
}
:host([hidden]) {
    display: none;
}

/* Una grilla de tres renglones: el dibujo, los subtítulos y los controles.
   Cuando los controles flotan (o los subtítulos, en pantalla completa), van
   en el mismo renglón que el dibujo, encima de él. */
.ma-raiz {
    container-type: inline-size;
    font-family: var(--ma-fuente);
    color: var(--ma-texto);
    background: var(--ma-fondo);
    border-radius: 12px;
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "escena" "subtitulo" "controles";
}

.ma-lienzo {
    grid-area: escena;
    position: relative;
    outline: none;
    overflow: hidden;
    /* Con el dedo se puede seguir bajando por la página; el pellizco para
       el zoom lo maneja el componente. Con zoom, arrastrar mueve el dibujo. */
    touch-action: pan-y;
}
[data-arrastrable] {
    cursor: grab;
    touch-action: none;
}
.ma-raiz.con-zoom .ma-lienzo {
    touch-action: none;
    cursor: grab;
}
.ma-raiz.arrastrando .ma-lienzo,
.ma-raiz.arrastrando [data-arrastrable],
.ma-raiz.con-zoom.arrastrando .ma-lienzo {
    cursor: grabbing;
}
.ma-lienzo:focus-visible {
    box-shadow: inset 0 0 0 3px var(--ma-acento);
}
.ma-lienzo svg {
    display: block;
    width: 100%;
    height: auto;
    font-family: var(--ma-fuente);
    user-select: none;
}

/* Los subtítulos van DEBAJO del dibujo y no encima: en un celular de 360px,
   encima taparían la mitad de la escena. El alto mínimo es para que la página
   no salte cada vez que aparece o desaparece uno. */
.ma-subtitulo {
    grid-area: subtitulo;
    min-height: 2.8em;
    padding: 0.35em 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: clamp(15px, 2.4cqi, 28px);
    line-height: 1.35;
    text-wrap: balance;
}
.ma-raiz:not(.con-subtitulos) .ma-subtitulo,
.ma-raiz.sin-textos .ma-subtitulo,
.ma-raiz.sin-textos [data-accion="subtitulos"],
.ma-raiz:not(.con-sonidos) [data-accion="sonido"] {
    display: none;
}

/* ---- Subtítulos de reel ----
   Grandes, encima del dibujo, de a pocas palabras, con la que se está
   diciendo resaltada. Los pide el estilo (subtitulos: { modo: 'reel' }). */
.ma-raiz.subs-reel .ma-subtitulo,
:host([pantalla]) .ma-raiz.subs-reel .ma-subtitulo,
:host(:fullscreen) .ma-raiz.subs-reel .ma-subtitulo {
    grid-area: escena;
    z-index: 2;
    align-self: end;
    justify-self: center;
    max-width: 90%;
    min-height: 0;
    margin: 0 0 6%;
    padding: 0.1em 0.4em;
    background: none;
    pointer-events: none;
    font-size: calc(clamp(15px, 2.6cqi, 40px) * var(--ma-sub-tamano, 1.6));
    font-weight: var(--ma-sub-peso, 800);
    text-transform: var(--ma-sub-mayusculas, none);
    line-height: 1.15;
    letter-spacing: 0.01em;
    transform: translateY(calc(-1 * var(--ma-sub-esquiva, 0px)));
    transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.ma-raiz.subs-reel[data-sub-posicion="centro"] .ma-subtitulo { align-self: center; margin: 0; }
.ma-raiz.subs-reel[data-sub-posicion="arriba"] .ma-subtitulo { align-self: start; margin: 5% 0 0; }
.ma-raiz.subs-reel .ma-subtitulo:empty { display: none; }
/* En un celular, dentro de la página, el dibujo es chico: los subtítulos de
   reel encima lo taparían entero. Van abajo, como los comunes, pero grandes.
   En pantalla completa sí van encima (sobra alto). */
@container (max-width: 600px) {
    :host(:not([pantalla]):not(:fullscreen)) .ma-raiz.subs-reel[data-sub-posicion] .ma-subtitulo {
        grid-area: subtitulo;
        align-self: center;
        margin: 0;
        min-height: 2.6em;
        font-size: clamp(18px, 6cqi, 30px);
    }
}
.ma-reel {
    display: inline-block;
    animation: ma-entra-grupo 0.22s cubic-bezier(0.3, 1.6, 0.5, 1);
}
/* Dos nombres de animación que se turnan: así cada grupo nuevo la reinicia. */
.ma-reel[data-grupo="1"] { animation-name: ma-entra-grupo-b; }
@keyframes ma-entra-grupo { from { transform: scale(0.82); opacity: 0.4; } }
@keyframes ma-entra-grupo-b { from { transform: scale(0.82); opacity: 0.4; } }
.ma-palabra {
    display: inline-block;
    /* Lo que crece la palabra resaltada, para que no se coma el espacio. */
    margin: 0 0.06em;
    opacity: 0.55;
    transition: opacity 0.12s, transform 0.12s, color 0.12s;
}
.ma-palabra[hidden] { display: none; }
.ma-palabra.dicha { opacity: 1; }
.ma-palabra.actual {
    color: var(--ma-sub-resaltado, var(--ma-acento));
    transform: scale(1.08);
}
.ma-raiz.subs-reel[data-sub-caja="caja"] .ma-reel {
    background: color-mix(in srgb, var(--ma-fondo) 80%, transparent);
    border-radius: 0.3em;
    padding: 0.05em 0.35em;
}
/* Letras con borde y sin fondo, como en los reels: se leen sobre cualquier dibujo. */
.ma-raiz.subs-reel[data-sub-caja="contorno"] .ma-reel {
    -webkit-text-stroke: 0.14em var(--ma-fondo);
    paint-order: stroke fill;
    text-shadow: 0 0.06em 0.18em color-mix(in srgb, var(--ma-fondo) 70%, transparent);
}
@media (prefers-reduced-motion: reduce) {
    .ma-reel, .ma-palabra { animation: none; transition: none; }
    .ma-palabra.actual { transform: none; }
}

/* ---- Controles ---- */
.ma-controles {
    grid-area: controles;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 6px;
    padding: 6px 8px 8px;
    border-top: 1px solid var(--ma-borde);
    background: var(--ma-superficie);
}
.ma-raiz.sin-controles .ma-controles,
.ma-raiz.sin-controles .ma-zoom {
    display: none;
}

/* Con mouse (y siempre en pantalla completa), los controles flotan sobre la
   parte de abajo del dibujo y se esconden mientras corre la animación: así
   el dibujo usa todo el lugar. Vuelven al mover el mouse, al tocar, al llegar
   con el teclado o al pausar. En un celular, fuera de la pantalla completa,
   quedan fijos abajo: no hay un mouse que pase por encima para mostrarlos. */
.ma-raiz.flotantes .ma-controles {
    grid-area: escena;
    align-self: end;
    z-index: 3;
    border-top: 0;
    padding-top: 36px;
    /* Un velo que se oscurece de a poco, sin un borde donde empieza: con dos
       paradas el ojo ve una franja. */
    background: linear-gradient(
        transparent,
        color-mix(in srgb, var(--ma-superficie) 25%, transparent) 14px,
        color-mix(in srgb, var(--ma-superficie) 60%, transparent) 30px,
        color-mix(in srgb, var(--ma-superficie) 85%, transparent) 48px,
        color-mix(in srgb, var(--ma-superficie) 92%, transparent));
    transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.ma-raiz.flotantes:not(.ver-controles) .ma-controles,
.ma-raiz.flotantes:not(.ver-controles) .ma-zoom {
    opacity: 0;
}
/* Al irse bajan un poquito: se van, no se apagan de golpe. */
.ma-raiz.flotantes:not(.ver-controles) .ma-controles {
    transform: translateY(8px);
}
.ma-raiz.sin-cursor,
.ma-raiz.sin-cursor .ma-lienzo,
.ma-raiz.sin-cursor [data-arrastrable] {
    cursor: none;
}

/* ---- El hilo ----
   Cuando los controles flotantes se esconden, queda una línea finita abajo:
   cuánto pasó, y puntitos donde hay un capítulo o una pregunta. Apenas se ve;
   alcanza para saber dónde se está sin tapar nada. */
.ma-hilo {
    grid-area: escena;
    align-self: end;
    position: relative;
    z-index: 2;
    height: 3px;
    margin: 0 10px 6px;
    border-radius: 2px;
    background: color-mix(in srgb, var(--ma-texto) 18%, transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
}
.ma-raiz.flotantes:not(.ver-controles):not(.sin-controles) .ma-hilo {
    opacity: 0.7;
}
.ma-hilo-avance {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--ma-acento);
    transform-origin: left;
    transform: scaleX(0);
}
.ma-hilo-marcas span {
    position: absolute;
    top: -1.5px;
    width: 6px;
    height: 6px;
    margin-left: -3px;
    border-radius: 50%;
    background: var(--ma-texto);
    opacity: 0.8;
}
/* Las preguntas, del color del acento y un poco más grandes. */
.ma-hilo-marcas span[class] {
    top: -2.5px;
    width: 8px;
    height: 8px;
    margin-left: -4px;
    background: var(--ma-acento2);
    opacity: 1;
}

/* ---- Zoom ---- */
.ma-zoom {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 3;
    display: flex;
    gap: 6px;
    transition: opacity 0.25s;
}
.ma-zoom button {
    min-width: 40px;
    height: 40px;
    padding: 0 8px;
    border: 1px solid var(--ma-borde);
    border-radius: 20px;
    background: color-mix(in srgb, var(--ma-superficie) 92%, transparent);
    color: var(--ma-texto);
    font: 700 18px/1 var(--ma-fuente);
    cursor: pointer;
}
.ma-zoom button:hover {
    border-color: var(--ma-acento);
}
.ma-zoom button:focus-visible {
    outline: 3px solid var(--ma-acento);
    outline-offset: 1px;
}
.ma-zoom [data-zoom="normal"] {
    font-size: 15px;
}
.ma-raiz:not(.con-zoom) .ma-zoom [data-zoom="normal"] {
    display: none;
}
/* Con el dedo se hace zoom pellizcando: los botones de + y − sobran y
   taparían el dibujo de un celular. Queda solo el de volver al tamaño normal. */
.ma-raiz:not(.flotantes) .ma-zoom [data-zoom="acercar"],
.ma-raiz:not(.flotantes) .ma-zoom [data-zoom="alejar"] {
    display: none;
}
/* La lupa: el botón siempre (salvo sin-lupa); su forma y su aumento, solo
   con la lupa prendida. El de volver a su lugar, solo si se corrió algo. */
.ma-zoom svg {
    width: 22px;
    height: 22px;
    vertical-align: middle;
}
.ma-zoom [data-zoom="lupa"][aria-pressed="true"] {
    background: var(--ma-acento);
    border-color: var(--ma-acento);
    color: var(--ma-fondo);
}
.ma-raiz.sin-lupa .ma-zoom [data-zoom^="lupa"],
.ma-raiz:not(.con-lupa) .ma-zoom [data-zoom="lupa-forma"],
.ma-raiz:not(.con-lupa) .ma-zoom [data-zoom="lupa-zoom"],
.ma-raiz:not(.con-arrastres) .ma-zoom [data-zoom="lugar"] {
    display: none;
}
/* En un celular, dentro de la página, los botones de arriba no se esconden
   (no hay un mouse que pase): el de la lupa quedaría tapando para siempre la
   esquina del dibujo. Ahí aparece en pantalla completa, o si ya está prendida. */
.ma-raiz:not(.flotantes):not(.con-lupa) .ma-zoom [data-zoom="lupa"] {
    display: none;
}
.ma-lupa {
    cursor: grab;
    touch-action: none;
}
.ma-lupa-asa {
    cursor: nwse-resize;
}
.ma-controles button {
    min-width: 44px;
    height: 44px;
    padding: 0 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--ma-texto);
    font: 600 15px/1 var(--ma-fuente);
    cursor: pointer;
}
.ma-controles button:hover {
    background: color-mix(in srgb, var(--ma-acento) 14%, transparent);
}
.ma-controles button:focus-visible,
.ma-controles input:focus-visible {
    outline: 3px solid var(--ma-acento);
    outline-offset: 1px;
}
.ma-controles button[aria-pressed="false"] {
    opacity: 0.55;
}
.ma-controles svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
}
.ma-linea {
    position: relative;
    flex: 1 1 160px;
    min-width: 120px;
    display: flex;
    align-items: center;
    height: 44px;
}
.ma-linea input {
    width: 100%;
    margin: 0;
    accent-color: var(--ma-acento);
    cursor: pointer;
}
/* Una marquita por capítulo sobre la barra. Es orientativa: la posición exacta
   del "botón" del range depende del navegador. */
.ma-marcas {
    position: absolute;
    inset: 0 8px;
    pointer-events: none;
}
.ma-marcas span {
    position: absolute;
    top: 8px;
    width: 2px;
    height: 7px;
    border-radius: 1px;
    background: var(--ma-suave);
}
/* Una pregunta: un "?" chiquito arriba de la barra. Dice "acá te van a
   preguntar algo" sin adelantar qué, y sirve para volver a esa parte. */
.ma-marcas span.pregunta {
    top: -1px;
    width: 15px;
    height: 15px;
    margin-left: -7.5px;
    border-radius: 50%;
    background: var(--ma-acento);
    color: var(--ma-fondo);
    font: 800 11px/15px var(--ma-fuente);
    text-align: center;
}
.ma-tiempo {
    font: 500 14px/1 var(--ma-fuente);
    font-variant-numeric: tabular-nums;
    color: var(--ma-suave);
    white-space: nowrap;
    padding: 0 4px;
}
.ma-capitulo {
    flex: 1 1 100%;
    order: 10;
    font-size: 14px;
    color: var(--ma-suave);
    padding: 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.ma-capitulo:empty {
    display: none;
}

/* En la columna de una clase (unos 650px) todo entra en un renglón si los
   botones se aprietan un poco; si no, el último se cae solo a un renglón nuevo. */
@container (max-width: 720px) {
    .ma-controles {
        gap: 4px 2px;
    }
    .ma-controles button {
        min-width: 40px;
        padding: 0 4px;
    }
}

/* En angosto (un celular), la barra de tiempo va sola en su renglón y los
   botones abajo: no entran todos en 360px con un tamaño que se pueda tocar. */
@container (max-width: 520px) {
    .ma-controles {
        gap: 0 2px;
    }
    /* 32px sigue siendo cómodo para un dedo (el mínimo de WCAG es 24) y deja
       que los siete botones (con el del sonido) y el tiempo entren en un
       renglón a 360px. */
    .ma-controles button {
        min-width: 32px;
        padding: 0 2px;
    }
    .ma-tiempo {
        font-size: 13px;
    }
    .ma-linea {
        flex-basis: 100%;
        order: -1;
    }
    .ma-tiempo {
        margin-right: auto;
    }
}

/* ---- Pantalla entera: la Expo, un televisor, un proyector ---- */
:host([pantalla]),
:host(:fullscreen) {
    position: fixed;
    inset: 0;
    z-index: 1000;
}
/* Todo va en un solo renglón: el dibujo ocupa la pantalla entera, y los
   subtítulos y los controles van encima. Si los subtítulos fueran en un
   renglón propio, el dibujo quedaría más chico en pantalla completa que en la
   página. */
:host([pantalla]) .ma-raiz,
:host(:fullscreen) .ma-raiz {
    height: 100%;
    border-radius: 0;
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas: "escena";
}
:host([pantalla]) .ma-lienzo,
:host(:fullscreen) .ma-lienzo {
    min-height: 0;
}
:host([pantalla]) .ma-lienzo svg,
:host(:fullscreen) .ma-lienzo svg {
    height: 100%;
}
/* El subtítulo, como en el cine: un renglón sobre la parte de abajo. El
   dibujo se pega arriba (preserveAspectRatio), así que si la pantalla es más
   alta que la escena el subtítulo cae en el lugar que sobra, sin tapar nada. */
:host([pantalla]) .ma-subtitulo,
:host(:fullscreen) .ma-subtitulo {
    grid-area: escena;
    align-self: end;
    justify-self: center;
    z-index: 2;
    min-height: 0;
    max-width: min(92%, 64ch);
    margin-bottom: max(12px, 2.5vh);
    padding: 0.25em 0.8em;
    border-radius: 0.4em;
    background: color-mix(in srgb, var(--ma-fondo) 85%, transparent);
    font-size: clamp(18px, 2.2cqi, 46px);
    pointer-events: none;
    /* --ma-sub-esquiva: cuánto sube para no tapar algo (lo calcula el componente). */
    transform: translateY(calc(-1 * var(--ma-sub-esquiva, 0px)));
    transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}
/* Si no encontró un lugar libre, un fondo más firme: tapa, pero se lee. */
:host([pantalla]) .sub-tapa .ma-subtitulo,
:host(:fullscreen) .sub-tapa .ma-subtitulo {
    background: color-mix(in srgb, var(--ma-fondo) 96%, transparent);
}
:host([pantalla]) .ma-subtitulo:empty,
:host(:fullscreen) .ma-subtitulo:empty {
    display: none;
}
/* Cuando aparecen los controles, el subtítulo sube para no quedar abajo de ellos. */
:host([pantalla]) .ver-controles .ma-subtitulo,
:host(:fullscreen) .ver-controles .ma-subtitulo {
    transform: translateY(calc(-1 * (var(--ma-alto-controles, 0px) + var(--ma-sub-esquiva, 0px))));
}
/* Con una pregunta abierta (en <motor-leccion>), la pregunta ocupa la parte
   de abajo: el subtítulo sube y queda justo encima de ella. Arriba de todo
   taparía el título de la escena. --ma-alto-pregunta lo mide la lección. */
:host([pantalla]) .con-pregunta .ma-subtitulo,
:host(:fullscreen) .con-pregunta .ma-subtitulo {
    transform: translateY(calc(-1 * (var(--ma-alto-pregunta, 0px) + var(--ma-sub-esquiva, 0px))));
}
:host([pantalla]) .con-pregunta.ver-controles .ma-subtitulo,
:host(:fullscreen) .con-pregunta.ver-controles .ma-subtitulo {
    transform: translateY(calc(-1 * (var(--ma-alto-pregunta, 0px) + var(--ma-alto-controles, 0px) + var(--ma-sub-esquiva, 0px))));
}

.ma-oculto {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
}
`;function Ye(a,t,o,{ritmo:e=15,porGrupo:n=0}={}){const r=String(a).split(/\s+/).filter(Boolean);if(!r.length)return[];const i=r.map(h=>Array.from(h).length+1+(/[.!?…]$/.test(h)?5:/[,;:]$/.test(h)?3:0)),s=i.reduce((h,m)=>h+m,0),l=Math.min(o-t,s/e);let c=0,u=0,d=0;return r.map((h,m)=>{const b=t+l*c/s;c+=i[m];const $=t+l*c/s,g={texto:h,desde:b,hasta:$,grupo:u};return d+=1,n>0&&(d>=n||/[.!?…,;:]$/.test(h))&&m<r.length-1&&(u+=1,d=0),g})}var Ga=new Map;function Pa(a,t){if(!t||typeof t!="object")throw new Error(`El estilo "${a}" tiene que ser un objeto.`);Ga.set(a,t)}var Po=null;function Bn(a){Po=a??null,typeof document<"u"&&document.dispatchEvent(new Event("motor-estilo"))}function Ze(){return Po}function Xe(){return[...Ga.keys()]}function ro(a){if(a==null||a==="")return{};const t=new Set,o=(e,n)=>{if(typeof e=="string"){if(t.has(e))throw new Error(`El estilo "${e}" se extiende a sí mismo, dando una vuelta.`);t.add(e);const s=Ga.get(e);if(!s)throw new Error(`No conozco el estilo "${e}"${n}. Los que hay son: ${Xe().join(", ")}.`);return o(s,"")}const{extiende:r,...i}=e;return r==null?i:To(o(r," (lo extiende otro estilo)"),i)};return o(a,"")}async function No(a){if(Ga.has(a))return Ga.get(a);const t=await fetch(a);if(!t.ok)throw new Error(`No pude traer el estilo de ${a} (${t.status}).`);const o=await t.json();if(typeof o.extiende=="string"&&Io(o.extiende)){const e=new URL(o.extiende,new URL(a,globalThis.location?.href)).href;await No(e),o.extiende=e}return Pa(a,o),o}function Io(a){return/\.json($|\?)|\//.test(String(a))}function To(a,t){const o={...a};for(const[e,n]of Object.entries(t))o[e]=io(n)&&io(a[e])?To(a[e],n):n;return o}function io(a){return a!=null&&typeof a=="object"&&!Array.isArray(a)}function Ge(a){const t=a.colores;return t?t.claro||t.oscuro?{claro:t.claro??t.oscuro??{},oscuro:t.oscuro??t.claro??{}}:{claro:t,oscuro:t}:{claro:{},oscuro:{}}}function We(a){const{claro:t,oscuro:o}=Ge(a),e=(s,l)=>Object.entries(s).filter(([c])=>Mt.includes(c)).map(([c,u])=>`--ma-${c}: ${l?`var(--motor-${c}-oscuro, var(--motor-${c}, ${u}))`:`var(--motor-${c}, ${u})`};`).join(" "),n=a.fuentes??{},r=a.subtitulos??{},i=[n.texto&&`--ma-fuente: var(--motor-fuente, ${n.texto});`,n.mono&&`--ma-fuente-mono: var(--motor-fuente-mono, ${n.mono});`,r.tamano&&`--ma-sub-tamano: ${Number(r.tamano)};`,r.peso&&`--ma-sub-peso: ${Number(r.peso)};`,r.mayusculas&&"--ma-sub-mayusculas: uppercase;",r.resaltado&&`--ma-sub-resaltado: ${Mt.includes(r.resaltado)?`var(--ma-${r.resaltado})`:r.resaltado};`].filter(Boolean).join(" ");return`.ma-raiz[data-estilo] { ${e(t,!1)} ${i} }
.ma-raiz[data-estilo][data-tema="oscuro"] { ${e(o,!0)} }`}function so(a){const t=a.subtitulos??{};return{modo:t.modo==="reel"?"reel":"clasico",palabras:Math.max(0,Math.round(t.palabras??0)),posicion:["arriba","centro","abajo"].includes(t.posicion)?t.posicion:"abajo",caja:["caja","contorno","ninguno"].includes(t.caja)?t.caja:"caja",ritmo:t.ritmo??15,esquivar:t.esquivar!==!1}}var lo=new Set;function Je(a){if(!(typeof document>"u"))for(const t of[a.fuentes?.cargar??[]].flat()){if(lo.has(t))continue;lo.add(t);const o=document.createElement("link");o.rel="stylesheet",o.href=t,document.head.appendChild(o)}}Pa("sobrio",{});Pa("pizarra",{colores:{fondo:"#1d3a2f",superficie:"#24463a",texto:"#f1eee4",suave:"#b6c4b4",borde:"#e2ddd0",acento:"#ffd66b",acento2:"#ff9eb0",exito:"#a6e89a",alerta:"#ffd66b",error:"#ff8f85",papel:"#2b4d40",marco:"#11241c"},fuentes:{texto:'"Caveat", "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive',cargar:"https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap"},efectos:{aMano:{fuerza:2.4,detalle:.035,hervir:6},grano:{cantidad:.07},vineta:.35},piezas:{caja:{relleno:"superficie",radio:6,grosorBorde:2.5,tamano:40},texto:{tamano:40}},sonidos:{aparecer:"clic",volumen:.5}});Pa("neon",{colores:{fondo:"#07060f",superficie:"#120f24",texto:"#f3f0ff",suave:"#a59ccc",borde:"#5a48b0",acento:"#22e3ff",acento2:"#ff3dc8",exito:"#39ff9c",alerta:"#ffe14d",error:"#ff4d6d",papel:"#1a1533",marco:"#3a3170"},fondo:{degradado:["#1a1240","#07060f"],forma:"radial"},efectos:{brillo:.8},piezas:{caja:{radio:22,grosorBorde:2.5,borde:"acento"}},movimiento:{curvas:{x:"resorte",y:"resorte",escala:"resorte",rotacion:"resorte"}},sonidos:{aparecer:"pop",mover:"whoosh",volumen:.7},subtitulos:{peso:600},video:{desenfoque:6,obturador:.5}});Pa("papel",{colores:{fondo:"#f1e7d2",superficie:"#fffaf0",texto:"#3a2e22",suave:"#7b6a58",borde:"#a8957a",acento:"#c0392b",acento2:"#2e6f9e",exito:"#4f7f3a",alerta:"#b7791f",error:"#a83226",papel:"#fff6dd",marco:"#4a3b2c"},fuentes:{texto:'Georgia, "Iowan Old Style", "Palatino Linotype", serif'},efectos:{aMano:{fuerza:1.3,detalle:.02},sombra:{dx:3,dy:5,desenfoque:5,opacidad:.22},grano:{cantidad:.09,animado:!1},vineta:.3},piezas:{caja:{radio:4,grosorBorde:2}},movimiento:{curvas:{x:"pasarse",y:"pasarse"}},sonidos:{aparecer:"clic",volumen:.35}});Pa("reel",{colores:{fondo:"#111418",superficie:"#1d232b",texto:"#ffffff",suave:"#aab3bf",borde:"#38424f",acento:"#ffd60a",acento2:"#ff5d8f",exito:"#3ddc84",alerta:"#ffb703",error:"#ff595e",papel:"#262d36",marco:"#3a4452"},fuentes:{texto:'"Poppins", "Segoe UI", system-ui, sans-serif',cargar:"https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap"},efectos:{sombra:{dx:0,dy:8,desenfoque:14,opacidad:.35}},piezas:{caja:{radio:26,grosorBorde:0,peso:800},texto:{peso:800}},movimiento:{curvas:{x:"resorte",y:"resorte",escala:"gelatina",rotacion:"resorte"},escalonar:{cada:.07,orden:"centro"}},sonidos:{aparecer:"pop",mover:"whoosh",desaparecer:null,volumen:.8},subtitulos:{modo:"reel",palabras:3,posicion:"abajo",tamano:1.9,peso:800,mayusculas:!0,resaltado:"acento",caja:"contorno"},video:{desenfoque:8,obturador:.5}});var ha=48e3,ka=(a,t)=>new Float32Array(Math.max(1,Math.round(a*t)));function Qe(a,t,o){const e=1-Math.exp(-2*Math.PI*t/o);let n=0;return r=>n+=e*(r-n)}var Ya={pop({tono:a=0,dur:t=.11,agudo:o=900,grave:e=260,volumen:n=.8}={},r=ha){const i=2**(a/12),s=ka(t,r);let l=0;for(let c=0;c<s.length;c++){const u=c/r,d=u/t,h=(e+(o-e)*Math.exp(-d*7))*i;l+=2*Math.PI*h/r;const m=Math.min(1,u/5e-4)*Math.exp(-d*6);s[c]=Math.sin(l)*m*n}return s},whoosh({tono:a=0,dur:t=.42,brillo:o=.5,volumen:e=.55,semilla:n=7}={},r=ha){const i=2**(a/12),s=ka(t,r),l=nt(n);let c=0,u=0;for(let d=0;d<s.length;d++){const h=d/s.length,m=(300+3200*o*Math.sin(Math.PI*h))*i,b=1-Math.exp(-2*Math.PI*m/r),$=l.siguiente()*2-1;c+=b*($-c),u+=b*(c-u);const g=Math.sin(Math.PI*Math.min(1,h*1.6))**2*(1-h)**.6;s[d]=(c-u*.4)*g*e*2.2}return s},clic({tono:a=0,dur:t=.03,volumen:o=.6,semilla:e=3}={},n=ha){const r=2**(a/12),i=ka(t,n),s=nt(e),l=Qe(i,2500*r,n);let c=0;for(let u=0;u<i.length;u++){const d=u/i.length,h=s.siguiente()*2-1,m=h-l(h);c+=2*Math.PI*1800*r/n,i[u]=(m*.7+Math.sin(c)*.4)*Math.exp(-d*9)*o}return i},ding({tono:a=0,dur:t=.7,nota:o=1320,volumen:e=.45}={},n=ha){const r=o*2**(a/12),i=ka(t,n),s=[[1,1,3.5],[2.01,.45,6],[3.02,.22,9],[4.17,.12,12]];for(let l=0;l<i.length;l++){const c=l/n;let u=0;for(const[d,h,m]of s)u+=h*Math.sin(2*Math.PI*r*d*c)*Math.exp(-c*m);i[l]=u*Math.min(1,c/.002)*e*.7}return i},golpe({tono:a=0,dur:t=.25,volumen:o=.9}={},e=ha){const n=2**(a/12),r=ka(t,e);let i=0;for(let s=0;s<r.length;s++){const l=s/e,c=l/t;i+=2*Math.PI*(45+110*Math.exp(-c*10))*n/e,r[s]=Math.tanh(Math.sin(i)*1.6)*Math.min(1,l/.001)*Math.exp(-c*5)*o}return r},exito({tono:a=0,volumen:t=.45}={},o=ha){return gt([[0,Ya.ding({tono:a,nota:1046.5,dur:.5,volumen:t},o)],[.1,Ya.ding({tono:a,nota:1568,dur:.6,volumen:t},o)]],o)},error({tono:a=0,volumen:t=.4,dur:o=.16}={},e=ha){const n=(r,i)=>{const s=ka(i,e);for(let l=0;l<s.length;l++){const c=l/e,u=2*Math.PI*r*2**(a/12)*c;s[l]=(Math.sin(u)+Math.sin(3*u)/3+Math.sin(5*u)/5)*Math.min(1,c/.003)*Math.exp(-c*5)*t}return s};return gt([[0,n(330,o)],[o*.9,n(247,o*1.6)]],e)},chispa({tono:a=0,volumen:t=.3,cuantas:o=5,semilla:e=5}={},n=ha){const r=nt(e),i=[];for(let s=0;s<o;s++)i.push([s*.045,Ya.ding({tono:a+Math.round(r.entre(10,22)),nota:1046.5,dur:.25,volumen:t*(1-s/(o+2))},n)]);return gt(i,n)}};function gt(a,t){const o=Math.max(...a.map(([n,r])=>Math.round(n*t)+r.length)),e=new Float32Array(o);for(const[n,r]of a){const i=Math.round(n*t);for(let s=0;s<r.length;s++)e[i+s]+=r[s]}return e}function Ro(a,{tono:t=0,paquete:o={},frecuencia:e=ha}={}){const n=o[a];if(n&&typeof n=="object"&&n.archivo)return null;const{receta:r=a,...i}=n&&typeof n=="object"?n:{},s=Ya[r];if(!s)throw new Error(`No conozco el sonido "${a}". Los que trae el motor son: ${Object.keys(Ya).join(", ")}; un estilo puede sumar otros en sonidos.paquete.`);return s({...i,tono:(i.tono??0)+t},e)}function Vn(a,t,{paquete:o={},volumen:e=1,frecuencia:n=ha,desde:r=0}={}){const i=new Float32Array(Math.max(1,Math.ceil(t*n))),s=new Map;for(const l of a){const c=`${l.nombre}|${l.tono??0}`;s.has(c)||s.set(c,Ro(l.nombre,{tono:l.tono??0,paquete:o,frecuencia:n}));const u=s.get(c);if(!u)continue;const d=Math.round((l.t-r)*n),h=(l.volumen??1)*e;for(let m=Math.max(0,-d);m<u.length&&d+m<i.length;m++)i[d+m]+=u[m]*h}for(let l=0;l<i.length;l++)i[l]=Math.tanh(i[l]);return i}function Ke(){let a=null;const t=new Map;let o=null,e={},n=1,r="";function i(){if(!a){const l=globalThis.AudioContext??globalThis.webkitAudioContext;if(!l)return null;a=new l}return a.state==="suspended"&&a.resume(),a}async function s(l,c){const u=`${l}|${c}`;if(t.has(u))return t.get(u);const d=i();if(!d)return null;const h=(async()=>{const m=e[l];if(m&&typeof m=="object"&&m.archivo){const g=await fetch(new URL(m.archivo,r||globalThis.location.href));return d.decodeAudioData(await g.arrayBuffer())}const b=Ro(l,{tono:c,paquete:e,frecuencia:ha}),$=d.createBuffer(1,b.length,ha);return $.getChannelData(0).set(b),$})().catch(m=>(console.warn(`No pude preparar el sonido "${l}":`,m),null));return t.set(u,h),h}return{configurar(l={},c=""){e!==(l.paquete??{})&&t.clear(),e=l.paquete??{},n=l.volumenGeneral??1,r=c},async tocar(l){const c=i();if(!c)return;const u=await s(l.nombre,l.tono??0);if(!u)return;const d=c.createBufferSource();d.buffer=u;const h=c.createGain();h.gain.value=(l.volumen??1)*n,d.connect(h).connect(c.destination),d.start()},precargar(l){if(i())for(const c of l)s(c.nombre,c.tono??0)},musica(l,c,u){if(!l?.archivo){o?.pause();return}const d=new URL(l.archivo,r||globalThis.location.href).href;if((!o||o.dataset.url!==d)&&(o?.pause(),o=new Audio(d),o.dataset.url=d,o.loop=!0),o.volume=Math.min(Math.max((l.volumen??.3)*n,0),1),u){const h=o.duration>0?c%o.duration:c;Math.abs(o.currentTime-h)>.3&&(o.currentTime=h),o.paused&&o.play().catch(()=>{})}else o.pause()},callar(){o?.pause()}}}function Bo(a,t){const o=a.estado(t),e=a.tipos,n=a.ancho*a.alto,r=[],i=[];a.ids.forEach((l,c)=>{const u=o.piezas[l];if(e[l].nombre!=="caja"||u.relleno!=="fondo"||u.opacidad<.6||!co(l,o))return;const d=la(l,o,e);i.push({orden:c,x0:d.x-d.ancho/2,y0:d.y-d.alto/2,x1:d.x+d.ancho/2,y1:d.y+d.alto/2})});const s=(l,c)=>i.some(u=>u.orden>l&&c.x0>=u.x0-1&&c.y0>=u.y0-1&&c.x1<=u.x1+1&&c.y1<=u.y1+1);for(const[l,c]of a.ids.entries()){const u=e[c],d=o.piezas[c];if(!u.tamano||u.contenedor||!co(c,o)||u.nombre==="caja"&&!d.texto&&!d.icono&&d.relleno==="fondo"&&(d.borde==="ninguno"||!(d.grosorBorde>0)))continue;const h=la(c,o,e);if(!(h.ancho>0&&h.alto>0)||h.ancho*h.alto>n*.35)continue;let m={x0:h.x-h.ancho/2,y0:h.y-h.alto/2,x1:h.x+h.ancho/2,y1:h.y+h.alto/2};for(let b=d.dentro;b!=null&&m;b=o.piezas[b].dentro){const $=la(b,o,e);m=an(m,{x0:$.x-$.ancho/2,y0:$.y-$.alto/2,x1:$.x+$.ancho/2,y1:$.y+$.alto/2})}!m||s(l,m)||r.push({id:c,tipo:u.nombre,texto:["texto","contador"].includes(u.nombre)||u.nombre==="caja"&&!!d.texto,...m})}return r}function an(a,t){const o={x0:Math.max(a.x0,t.x0),y0:Math.max(a.y0,t.y0),x1:Math.min(a.x1,t.x1),y1:Math.min(a.y1,t.y1)};return o.x1-o.x0>1&&o.y1-o.y0>1?o:null}function co(a,t){let o=a,e=1;for(;o!=null;){const n=t.piezas[o];if(e*=n.opacidad,e<.3||n.trazo<=0)return!1;o=n.dentro}return!0}function Vo(a,t){const o=Math.min(a.x1,t.x1)-Math.max(a.x0,t.x0),e=Math.min(a.y1,t.y1)-Math.max(a.y0,t.y0);return o>0&&e>0?o*e:0}function jt(a,t,o,e,n=.25){const r=(t.x1-t.x0)*(t.y1-t.y0)||1;let i=0;const s=new Set;for(let l=o;l<e+1e-9;l+=n){let c=0;for(const u of Bo(a,Math.min(l,e-1e-6))){const d=Vo(t,u);d>.12*Math.min(r,(u.x1-u.x0)*(u.y1-u.y0))&&(c+=d,s.add(u.id))}i=Math.max(i,c/r)}return{peor:i,piezas:[...s]}}function uo(a,t,o=2){const{ancho:e,alto:n}=a,r=n*.06*o,i=n*.025,s=t==="abajo"?n-i-r:i;return{x0:e*.12,x1:e*.88,y0:s,y1:s+r}}function Uo(a,t,o,e){const n=t.y1-t.y0,r=a.alto*.03,i=Math.max(0,t.y0-a.alto*.02);let s=null;for(let c=0;c<=i+1e-9;c+=r){const u={...t,y0:t.y0-c,y1:t.y0-c+n},d=jt(a,u,o,e);if(d.peor<.02)return{subir:c,libre:!0,tapa:[]};(!s||d.peor<s.peor-1e-9)&&(s={subir:c,peor:d.peor,tapa:d.piezas})}const l=jt(a,t,o,e);return s&&s.peor<l.peor*.5?{subir:s.subir,libre:!1,tapa:s.tapa}:{subir:0,libre:!1,tapa:l.piezas}}function tn(a,{paso:t=.25}={}){const o=[];a.subtitulos.forEach((n,r)=>{const i=n.texto.length>70?2:1,s=jt(a,uo(a,"abajo",i),n.desde,n.hasta,t);if(s.peor<.02)return;const l=Uo(a,uo(a,"abajo",i),n.desde,n.hasta);o.push({indice:r,texto:n.texto,desde:n.desde,hasta:n.hasta,tapa:s.piezas,libre:l.libre})});const e=new Map;for(let n=0;n<=a.duracion+1e-9;n+=t){const r=Bo(a,Math.min(n,a.duracion)).filter(i=>i.texto);for(let i=0;i<r.length;i++)for(let s=i+1;s<r.length;s++){const l=r[i],c=r[s],u=Math.min((l.x1-l.x0)*(l.y1-l.y0),(c.x1-c.x0)*(c.y1-c.y0));if(Vo(l,c)<=.15*u)continue;const d=`${l.id}|${c.id}`,h=e.get(d);h&&n-h.hasta<=t+1e-9?h.hasta=n:h||e.set(d,{a:l.id,b:c.id,desde:n,hasta:n})}}return{subtitulos:o,textos:[...e.values()]}}function on(a,t="la escena"){const o=n=>`${n.toFixed(1).replace(".",",")} s`,e=[];for(const n of a.subtitulos)e.push(`  ${o(n.desde)}–${o(n.hasta)}: el subtítulo «${n.texto.slice(0,50)}${n.texto.length>50?"…":""}» tapa ${n.tapa.join(", ")}`+(n.libre?" (en pantalla completa sube solo a un lugar libre)":" (y no hay un lugar libre: corré la pieza o partí el subtítulo)"));for(const n of a.textos)e.push(`  ${o(n.desde)}–${o(n.hasta)}: «${n.a}» y «${n.b}» se pisan`);return e.length?`En ${t}:
${e.join(`
`)}`:""}var At=new Map,Za=new Map;function Un(a,t){At.set(a,t);for(const o of Za.get(a)??[])o.escena=t;Za.delete(a)}var en=globalThis.HTMLElement??class{},mo=600,nn=900,rn=1800,Ct=class extends en{static observedAttributes=["escena","tema","estilo","movimiento","velocidad","loop","sin-controles","sin-subtitulos","sin-sonido","controles-fijos","pantalla"];constructor(){super();const a=this.attachShadow({mode:"open"});a.innerHTML=`
            <style>${He}</style>
            <style class="ma-css-estilo"></style>
            <div class="ma-raiz con-subtitulos" part="raiz">
                <div class="ma-lienzo" tabindex="0">
                    <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="ma-titulo" aria-describedby="ma-descripcion"></svg>
                    <div class="ma-zoom" role="group" aria-label="Zoom">
                        <!-- El de volver va primero: la botonera está pegada a la
                             derecha, así que al aparecer (o al pasar de 1,5× a 2×)
                             crece hacia la izquierda y no corre al − ni al +. -->
                        <button type="button" data-zoom="lugar" aria-label="Volver a su lugar lo que se movió" title="Volver a su lugar">↺</button>
                        <button type="button" data-zoom="lupa-forma" aria-label="Forma de la lupa: redonda" title="Forma de la lupa">○</button>
                        <button type="button" data-zoom="lupa-zoom" aria-label="Aumento de la lupa: 2 veces" title="Aumento de la lupa">2×</button>
                        <button type="button" data-zoom="lupa" aria-pressed="false" aria-label="Lupa" title="Lupa"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M14.5 14.5 20 20" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>
                        <button type="button" data-zoom="normal" aria-label="Volver al tamaño normal">1×</button>
                        <button type="button" data-zoom="alejar" aria-label="Alejar">−</button>
                        <button type="button" data-zoom="acercar" aria-label="Acercar">+</button>
                    </div>
                </div>
                <div class="ma-subtitulo" part="subtitulo" aria-live="off"></div>
                <!-- El hilo: lo que queda de la barra cuando los controles se
                     esconden. Dice por dónde va y dónde están los capítulos y
                     las preguntas, sin tapar el dibujo. -->
                <div class="ma-hilo" aria-hidden="true"><div class="ma-hilo-avance"></div><div class="ma-hilo-marcas"></div></div>
                <div class="ma-controles" role="group" aria-label="Controles de la animación"></div>
                <div class="ma-oculto" id="ma-titulo"></div>
                <div class="ma-oculto" id="ma-descripcion"></div>
            </div>`,this._raiz=a.querySelector(".ma-raiz"),this._lienzo=a.querySelector(".ma-lienzo"),this._svg=a.querySelector("svg"),this._subtitulo=a.querySelector(".ma-subtitulo"),this._titulo=a.querySelector("#ma-titulo"),this._descripcion=a.querySelector("#ma-descripcion"),this._controles=a.querySelector(".ma-controles"),this._hilo=a.querySelector(".ma-hilo"),this._cssEstilo=a.querySelector(".ma-css-estilo"),this._estiloPropio=null,this._estilo={},this._subs=so({}),this._reel={indice:-1,palabras:[],nodos:[],grupo:-1},this._sonido=Ke(),this._sonidoPrendido=!this.hasAttribute("sin-sonido"),this._tAnterior=0,this._esquiva={clave:""},this._definicion=null,this._compilada=null,this._pintor=null,this._arrastres={},this._agarrada=null,this._lupa=null,this._disposicion=null,this._pausadoPorOcultar=!1,this._limpiar=[],this._reloj=new Se({duracion:0,alCambiar:e=>this._pintar(e),alCambiarEstado:e=>{this._barra.corriendo(e),e||this._sonido.callar(),this._actualizarVista()},alParar:e=>this._alParar(e)}),this._barra=Ve(this._controles,{hilo:this._hilo,alternar:()=>this._alternarPorUsuario(),anterior:()=>this.capituloAnterior(),siguiente:()=>this.capituloSiguiente(),irA:e=>this.irA(e),velocidad:e=>this._cambiarVelocidad(e),subtitulos:e=>this._subtitulos(e),sonido:e=>this._prenderSonido(e),pantalla:()=>this._pantallaCompleta()}),this._lienzo.addEventListener("keydown",e=>this._tecla(e)),this._lienzo.addEventListener("click",()=>{this._arrastro?this._arrastro=!1:this._alternarPorUsuario()}),this._zoom={escala:1,x:0,y:0},this._dedos=new Map,this._pellizco=null,this._movido=0,this._arrastro=!1;const t=a.querySelector(".ma-zoom");t.addEventListener("click",e=>{e.stopPropagation();const n=e.target.closest("button");n&&this._accionZoom(n.dataset.zoom)}),t.addEventListener("pointerdown",e=>e.stopPropagation()),this._lienzo.addEventListener("wheel",e=>this._rueda(e),{passive:!1}),this._lienzo.addEventListener("pointerdown",e=>this._dedoAbajo(e)),this._lienzo.addEventListener("dblclick",e=>{const n=e.target.closest("[data-arrastrable]");n&&this._volverAlLugar(n.getAttribute("data-arrastrable"))}),this._lienzo.addEventListener("pointermove",e=>this._dedoMueve(e));for(const e of["pointerup","pointercancel"])this._lienzo.addEventListener(e,n=>this._dedoArriba(n));this._vista={dentro:!1,reciente:!1,sobreControles:!1,foco:!1,tactil:!1,tocado:!1,pregunta:!1},this._temporizador=void 0,this._sacudida={desde:0,recorrido:0,x:0,y:0};const o=e=>{e.type==="pointermove"&&this.hasAttribute("sin-controles")&&!this._sacudio(e)||(e.pointerType&&(this._vista.tactil=e.pointerType==="touch"),this._vista.tocado=!0,this._vista.reciente=!0,clearTimeout(this._temporizador),this._temporizador=setTimeout(()=>{this._vista.reciente=!1,this._actualizarVista()},rn),this._actualizarVista())};this.addEventListener("pointermove",o),this.addEventListener("pointerdown",o),this._lienzo.addEventListener("keydown",o),this.addEventListener("pointerenter",()=>{this._vista.dentro=!0,this._actualizarVista()}),this.addEventListener("pointerleave",e=>{e.pointerType==="mouse"&&(this._vista.dentro=!1,this._vista.reciente=!1,this._vista.sobreControles=!1,clearTimeout(this._temporizador)),this._actualizarVista()}),this._controles.addEventListener("pointerenter",()=>{this._vista.sobreControles=!0,this._actualizarVista()}),this._controles.addEventListener("pointerleave",()=>{this._vista.sobreControles=!1,this._actualizarVista()}),a.addEventListener("focusin",()=>this._mirarFoco()),a.addEventListener("focusout",()=>queueMicrotask(()=>this._mirarFoco())),new ResizeObserver(()=>{this._raiz.style.setProperty("--ma-alto-controles",`${this._controles.offsetHeight}px`)}).observe(this._controles)}get escena(){return this._definicion}set escena(a){a!==this._definicion&&(this._zoom={escala:1,x:0,y:0}),this._definicion=a,this._disposicion=null,this._armar()}get estilo(){return this._estiloPropio??this.getAttribute("estilo")}set estilo(a){this._estiloPropio=a??null,this._armar()}get estiloResuelto(){return this._estilo}get compilada(){return this._compilada}get t(){return this._reloj.t}get duracion(){return this._reloj.duracion}get corriendo(){return this._reloj.corriendo}reproducir(){this._pausadoPorOcultar=!1,this._reloj.reproducir()}pausar(){this._pausadoPorOcultar=!1,this._reloj.pausar()}irA(a){this._reloj.irA(a)}capituloSiguiente(){const t=(this._compilada?.capitulos??[]).find(o=>o.t>this.t+.05);this.irA(t?t.t:this.duracion)}capituloAnterior(){const t=(this._compilada?.capitulos??[]).filter(o=>o.t<=this.t-1);this.irA(t.length?t[t.length-1].t:0)}connectedCallback(){const a=[matchMedia("(prefers-reduced-motion: reduce)"),matchMedia("(prefers-color-scheme: dark)")];for(const n of a)this._escuchar(n,"change",()=>this._armar());const t=new MutationObserver(()=>this._aplicarTema());t.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme","data-tema","class"]}),this._limpiar.push(()=>t.disconnect());const o=new ResizeObserver(()=>{this._disposicion!==this._calcularDisposicion().nombre&&this._armar()});o.observe(this),this._limpiar.push(()=>o.disconnect());const e=new IntersectionObserver(([n])=>this._visible(n.isIntersecting));e.observe(this),this._limpiar.push(()=>e.disconnect()),this._escuchar(document,"visibilitychange",()=>this._visible(!document.hidden)),this._escuchar(this,"fullscreenchange",()=>{document.fullscreenElement===this&&this._entrarEnPantalla(),this._armar()}),this._escuchar(document,"motor-estilo",()=>{!this._estiloPropio&&!this.hasAttribute("estilo")&&this._armar()}),this._escuchar(matchMedia("(hover: hover) and (pointer: fine)"),"change",()=>this._actualizarVista()),this._aplicarAtributos(),this._definicion?this._armar():this._buscarEscena()}disconnectedCallback(){this._reloj.pausar();for(const a of this._limpiar)a();this._limpiar=[]}attributeChangedCallback(a,t,o){this.isConnected&&(a==="escena"?this._buscarEscena():a==="pantalla"?(this.hasAttribute("pantalla")&&this._entrarEnPantalla(),this._armar()):a==="movimiento"||a==="tema"||a==="estilo"?this._armar():a==="sin-sonido"?this._prenderSonido(!this.hasAttribute("sin-sonido")):this._aplicarAtributos())}_controlesFijos(){return this.hasAttribute("controles-fijos")}_alArmar(a){}_alParar(a){}_alPintar(a){}_marcasDeLaBarra(a){return[]}_escuchar(a,t,o){a.addEventListener(t,o),this._limpiar.push(()=>a.removeEventListener(t,o))}_buscarEscena(){const a=this.getAttribute("escena");a&&(At.has(a)?this.escena=At.get(a):(Za.has(a)||Za.set(a,new Set),Za.get(a).add(this)))}_aplicarAtributos(){this._reloj.loop=this.hasAttribute("loop");const a=Number(this.getAttribute("velocidad"));a>0&&this._cambiarVelocidad(a),this._raiz.classList.toggle("sin-controles",this.hasAttribute("sin-controles")),this._subtitulos(!this.hasAttribute("sin-subtitulos")),this._actualizarVista()}_calcularDisposicion(){const a=this.getBoundingClientRect(),t=a.width||mo,o=a.height||0,e=this._llena(),n=e?o>t:t<mo,r=!e&&!n&&t<nn;return{nombre:n?"angosta":r?"media":"ancha",ancho:t,alto:o}}_llena(){return this.hasAttribute("pantalla")||document.fullscreenElement===this}_movimiento(){const a=this.getAttribute("movimiento");return a==="reducido"||a==="completo"?a:matchMedia("(prefers-reduced-motion: reduce)").matches?"reducido":"completo"}_aplicarTema(){let a=this.getAttribute("tema");if(a!=="claro"&&a!=="oscuro"){const t=document.documentElement,o=t.dataset.theme??t.dataset.tema;o==="dark"||o==="oscuro"?a="oscuro":o==="light"||o==="claro"?a="claro":t.classList.contains("dark")?a="oscuro":a=matchMedia("(prefers-color-scheme: dark)").matches?"oscuro":"claro"}this._raiz.dataset.tema=a}_buscarEstilo(){const a=this._estiloPropio??this.getAttribute("estilo")??Ze();if(typeof a=="string"&&Io(a)){const t=new URL(a,document.baseURI).href;try{return ro(t)}catch{return this._esperandoEstilo!==t&&(this._esperandoEstilo=t,No(t).then(()=>this._armar(),o=>this._mostrarError(o))),null}}return ro(a)}_aplicarEstilo(a){this._estilo=a,Je(a),this._cssEstilo.textContent=We(a),this._raiz.toggleAttribute("data-estilo",Object.keys(a).length>0),this._subs=so(a),this._raiz.classList.toggle("subs-reel",this._subs.modo==="reel"),this._raiz.dataset.subPosicion=this._subs.posicion,this._raiz.dataset.subCaja=this._subs.caja,this._reel.indice=-1,this._subtitulo.textContent="",this._sonido.configurar(a.sonidos??{})}_armar(){if(this._aplicarTema(),!this._definicion||!this.isConnected)return;let a;try{a=this._buscarEstilo()}catch(r){this._mostrarError(r);return}if(!a)return;this._aplicarEstilo(a);const t=this._calcularDisposicion();let o;try{o=ye(this._definicion,{movimiento:this._movimiento(),disposicion:t,estilo:a})}catch(r){this._mostrarError(r);return}if(this._compilada=o,this._disposicion=t.nombre,this._esquiva.clave="",this.hasAttribute("revisar")){const r=on(tn(o),`«${o.titulo||this.getAttribute("escena")}» (${t.nombre})`);r&&console.warn(r)}this._pintor=Oe(this._svg,o,{arrastres:this._arrastres,estilo:a}),this._prepararLupa(o,a);const e=o.sonidos.length>0||!!o.musica;this._raiz.classList.toggle("con-sonidos",e),this._raiz.classList.toggle("sin-textos",o.subtitulos.length===0),this._encuadre(),this._aplicarZoom(),this._actualizarVista(),this._reloj.duracion=o.duracion,this._titulo.textContent=o.titulo||"Animación",this._descripcion.textContent=sn(o),this._barra.configurar(o,this._marcasDeLaBarra(o)),this._alArmar(o);const n=this._yaArrancado;this._yaArrancado=!0,this._reloj.irA(Math.min(this._reloj.t,o.duracion)),!n&&this.hasAttribute("autoplay")&&this._reloj.reproducir()}_pintar(a){if(!this._compilada)return;const t=this._compilada.estado(a);try{this._pintor.pintar(t)}catch(o){this._reloj.pausar(),this._mostrarError(o);return}this._barra.mostrar(t),this._subs.modo==="reel"?this._subtituloReel(t):this._subtitulo.textContent!==t.subtitulo&&(this._subtitulo.textContent=t.subtitulo),this._esquivar(t),this._sonar(t.t),this._alPintar(t)}_subtituloReel(a){const t=this._reel;if(a.subtituloIndice!==t.indice){t.indice=a.subtituloIndice,t.grupo=-1;const n=this._compilada.subtitulos[t.indice];if(t.palabras=n?Ye(n.texto,n.desde,n.hasta,{ritmo:this._subs.ritmo,porGrupo:this._subs.palabras}):[],this._subtitulo.replaceChildren(),n){const r=document.createElement("span");r.className="ma-oculto",r.textContent=n.texto;const i=document.createElement("span");i.className="ma-reel",i.setAttribute("aria-hidden","true"),t.nodos=t.palabras.map(s=>{const l=document.createElement("span");return l.className="ma-palabra",l.textContent=s.texto,i.append(l," "),l}),this._subtitulo.append(r,i)}else t.nodos=[]}if(!t.palabras.length)return;let o=0;t.palabras.forEach((n,r)=>{n.desde<=a.t&&(o=r)});const e=t.palabras[o].grupo;if(t.palabras.forEach((n,r)=>{const i=t.nodos[r],s=this._subs.palabras===0||n.grupo===e;i.hidden=!s,i.classList.toggle("dicha",n.desde<=a.t),i.classList.toggle("actual",r===o&&n.desde<=a.t)}),e!==t.grupo){t.grupo=e;const n=this._subtitulo.querySelector(".ma-reel");n&&n.setAttribute("data-grupo",String(e%2))}}_esquivar(a){const t=this._compilada,o=(this._llena()||this._subs.modo==="reel")&&this._raiz.classList.contains("con-subtitulos"),e=t?.subtitulos[a.subtituloIndice];if(!o||!e||this._subs.esquivar===!1){this._esquiva.clave!=="nada"&&(this._esquiva.clave="nada",this._raiz.style.removeProperty("--ma-sub-esquiva"),this._raiz.classList.remove("sub-tapa"));return}const n=`${a.subtituloIndice}|${this._svg.clientWidth}x${this._svg.clientHeight}|${this._subs.modo}`;if(this._esquiva.clave===n)return;this._esquiva.clave=n;const r=this._svg.getScreenCTM(),i=this._subtitulo,s=i.offsetParent;if(!r||!s||!i.offsetHeight)return;const l=s.getBoundingClientRect(),c=l.left+i.offsetLeft,u=l.top+i.offsetTop,d={x0:(c-r.e)/r.a,x1:(c+i.offsetWidth-r.e)/r.a,y0:(u-r.f)/r.d,y1:(u+i.offsetHeight-r.f)/r.d},h=Uo(t,d,e.desde,e.hasta);i.style.transition="none",this._raiz.style.setProperty("--ma-sub-esquiva",`${Math.round(h.subir*r.d)}px`),i.offsetWidth,i.style.transition="",this._raiz.classList.toggle("sub-tapa",!h.libre&&h.tapa.length>0)}_sonar(a){const t=this._tAnterior;this._tAnterior=a;const o=this._compilada;if(!(!o||!this._sonidoPrendido||!this._reloj.corriendo||this.hasAttribute("video"))&&(o.musica&&this._sonido.musica(o.musica,a,!0),!(!(a>t)||a-t>.5)))for(const e of o.sonidos)e.t>t&&e.t<=a&&this._sonido.tocar(e)}_prenderSonido(a){this._sonidoPrendido=a,this._barra.sonido(a),a||this._sonido.callar()}_mostrarError(a){console.error(a),this._subtitulo.textContent=`⚠️ ${a.message}`,this._raiz.classList.add("con-subtitulos")}_alternarPorUsuario(){this._compilada?.sonidos.length&&this._sonido.precargar(this._compilada.sonidos),this._subtitulo.setAttribute("aria-live","polite"),this._pausadoPorOcultar=!1,this._reloj.alternar()}_cambiarVelocidad(a){this._reloj.cambiarVelocidad(a),this._barra.velocidad(a)}_subtitulos(a){this._raiz.classList.toggle("con-subtitulos",a),this._barra.subtitulos(a),this._encuadre()}_encuadre(){if(!this._compilada)return;const a=this._llena()&&this._raiz.classList.contains("con-subtitulos");this._svg.setAttribute("preserveAspectRatio",a?"xMidYMin meet":"xMidYMid meet")}_mirarFoco(){const a=this.shadowRoot.activeElement;this._vista.foco=!!a&&!!a.closest(".ma-controles, .ma-zoom")&&a.matches(":focus-visible"),this._actualizarVista()}_sacudio(a){const t=this._sacudida,o=a.timeStamp;return o-t.desde>330?(t.desde=o,t.recorrido=0):t.recorrido+=Math.hypot(a.clientX-t.x,a.clientY-t.y),t.x=a.clientX,t.y=a.clientY,t.recorrido>250}_entrarEnPantalla(){this._vista.reciente=!1,this._vista.sobreControles=!1,clearTimeout(this._temporizador);const a=this.shadowRoot.activeElement;a&&!a.matches(":focus-visible")&&a.blur(),this._vista.foco=!1,this._actualizarVista()}_actualizarVista(){if(!this.isConnected)return;const a=this._llena(),t=!this.hasAttribute("sin-controles")&&(a||!this._controlesFijos()&&matchMedia("(hover: hover) and (pointer: fine)").matches),o=this._vista,e=!a&&!this._reloj.corriendo&&(o.dentro||o.tactil||!o.tocado),n=o.foco||o.sobreControles||!o.pregunta&&(o.reciente||e);this._raiz.classList.toggle("flotantes",t),this._raiz.classList.toggle("con-pregunta",o.pregunta),this._raiz.classList.toggle("ver-controles",n),this._raiz.classList.toggle("sin-cursor",a&&!o.reciente&&!(o.sobreControles&&t)&&!o.foco)}_accionZoom(a){if(a==="acercar")this._zoomEn(1.5);else if(a==="alejar")this._zoomEn(1/1.5);else if(a==="lupa")this._usarLupa(!this._lupa?.activa);else if(a==="lupa-forma")this._cambiarLupa({forma:this._lupa.forma==="circulo"?"rect":"circulo"});else if(a==="lupa-zoom"){const t=[1.5,2,3,4];this._cambiarLupa({zoom:t[(t.indexOf(this._lupa.zoom)+1)%t.length]})}else a==="lugar"?this._volverAlLugar():this._zoomEn(0)}_prepararLupa(a,t){const o={...t.lupa??{},...a.lupa??{}},e=Math.min(a.ancho,a.alto)*.34;this._lupa||(this._lupa={activa:!!o.activa&&!this.hasAttribute("video"),x:o.x??a.ancho/2,y:o.y??a.alto/2,ancho:o.ancho??o.tamano??e,alto:o.alto??o.tamano??e,forma:o.forma==="rect"?"rect":"circulo",zoom:o.zoom??2}),this._raiz.classList.toggle("sin-lupa",this.hasAttribute("sin-lupa")||o.boton===!1),this._cambiarLupa({})}_usarLupa(a){this._lupa&&this._cambiarLupa({activa:a})}_cambiarLupa(a){const t=this._lupa,o=this._compilada;if(!t||!o)return;Object.assign(t,a);const e=Math.min(o.ancho,o.alto);t.ancho=Math.min(Math.max(t.ancho,60),t.forma==="circulo"?e:o.ancho),t.alto=Math.min(Math.max(t.alto,60),t.forma==="circulo"?e:o.alto),t.forma==="circulo"&&(t.ancho=t.alto=Math.min(t.ancho,t.alto)),t.x=Math.min(Math.max(t.x,t.ancho/2),o.ancho-t.ancho/2),t.y=Math.min(Math.max(t.y,t.alto/2),o.alto-t.alto/2);const n=this._svg.getScreenCTM();this._pintor?.lupa({...t,pixel:n&&n.a>0?1/n.a:1}),this._raiz.classList.toggle("con-lupa",t.activa);const r=l=>this.shadowRoot.querySelector(l);r('[data-zoom="lupa"]').setAttribute("aria-pressed",String(t.activa));const i=r('[data-zoom="lupa-forma"]');i.textContent=t.forma==="circulo"?"○":"▭",i.setAttribute("aria-label",`Forma de la lupa: ${t.forma==="circulo"?"redonda":"rectangular"}`);const s=r('[data-zoom="lupa-zoom"]');s.textContent=`${String(t.zoom).replace(".",",")}×`,s.setAttribute("aria-label",`Aumento de la lupa: ${String(t.zoom).replace(".",",")} veces`)}_volverAlLugar(a){for(const t of Object.keys(this._arrastres))(a==null||t===a)&&delete this._arrastres[t];this._raiz.classList.toggle("con-arrastres",Object.keys(this._arrastres).length>0),this._pintar(this._reloj.t)}_zoomEn(a,t,o){const e=this._compilada;if(!e)return;const n=this._zoom,r=a===0?1:Math.min(8,Math.max(1,n.escala*a));let i=n.x+e.ancho/n.escala/2,s=n.y+e.alto/n.escala/2;if(t!=null){const c=this._aEscena(t,o);c&&([i,s]=[c.x,c.y])}const l=n.escala/r;this._zoom={escala:r,x:i-(i-n.x)*l,y:s-(s-n.y)*l},this._aplicarZoom()}_aEscena(a,t){const o=this._svg.getScreenCTM();if(!o)return null;const e=new DOMPoint(a,t).matrixTransform(o.inverse());return{x:e.x,y:e.y}}_aplicarZoom(){const a=this._compilada;if(!a)return;const t=this._zoom,o=a.ancho/t.escala,e=a.alto/t.escala;t.x=Math.min(Math.max(t.x,0),a.ancho-o),t.y=Math.min(Math.max(t.y,0),a.alto-e);const n=i=>Math.round(i*100)/100;this._svg.setAttribute("viewBox",`${n(t.x)} ${n(t.y)} ${n(o)} ${n(e)}`),this._raiz.classList.toggle("con-zoom",t.escala>1.001);const r=this.shadowRoot.querySelector('[data-zoom="normal"]');r.textContent=`${String(Math.round(t.escala*10)/10).replace(".",",")}×`}_rueda(a){this._llena()&&(a.preventDefault(),this._zoomEn(Math.exp(-a.deltaY*.0025),a.clientX,a.clientY))}_dedoAbajo(a){const t=a.target;if(t.closest(".ma-pregunta, .ma-zoom"))return;if(this._lupa?.activa&&t.closest("[data-lupa]")){const n=t.getAttribute("data-lupa")==="asa";this._agarrada={id:n?"__asa":"__lupa",pointerId:a.pointerId,x:a.clientX,y:a.clientY},this._lienzo.setPointerCapture(a.pointerId);return}const e=this._dedos.size===0&&t.closest("[data-arrastrable]");if(e){this._agarrada={id:e.getAttribute("data-arrastrable"),pointerId:a.pointerId,x:a.clientX,y:a.clientY},this._lienzo.setPointerCapture(a.pointerId);return}if(this._dedos.set(a.pointerId,{x:a.clientX,y:a.clientY}),this._movido=0,this._dedos.size===2){const[n,r]=[...this._dedos.values()];this._pellizco={distancia:Math.hypot(n.x-r.x,n.y-r.y),escala:this._zoom.escala}}(this._zoom.escala>1||this._dedos.size===2)&&this._lienzo.setPointerCapture(a.pointerId)}_dedoMueve(a){const t=this._agarrada;if(t&&t.pointerId===a.pointerId&&(t.id==="__lupa"||t.id==="__asa")){const r=this._svg.getScreenCTM();if(!r)return;const i=(a.clientX-t.x)/r.a,s=(a.clientY-t.y)/r.d;[t.x,t.y]=[a.clientX,a.clientY];const l=this._lupa;if(t.id==="__lupa")this._cambiarLupa({x:l.x+i,y:l.y+s});else if(l.forma==="circulo"){const c=Math.max(i,s)*2;this._cambiarLupa({ancho:l.ancho+c,alto:l.alto+c})}else this._cambiarLupa({ancho:l.ancho+i*2,alto:l.alto+s*2});this._arrastro=!0,this._raiz.classList.add("arrastrando");return}if(t&&t.pointerId===a.pointerId){const r=this._svg.getScreenCTM();if(!r)return;const i=this._arrastres[t.id]??={x:0,y:0};this._raiz.classList.add("con-arrastres"),i.x+=(a.clientX-t.x)/r.a,i.y+=(a.clientY-t.y)/r.d,[t.x,t.y]=[a.clientX,a.clientY],this._pintar(this._reloj.t),this._arrastro=!0,this._raiz.classList.add("arrastrando");return}const o=this._dedos.get(a.pointerId);if(!o)return;const e={x:a.clientX,y:a.clientY};if(this._dedos.set(a.pointerId,e),this._dedos.size===2&&this._pellizco){const[r,i]=[...this._dedos.values()],s=Math.hypot(r.x-i.x,r.y-i.y),l=this._pellizco.escala*(s/Math.max(this._pellizco.distancia,1));this._zoomEn(l/this._zoom.escala,(r.x+i.x)/2,(r.y+i.y)/2),this._arrastro=!0;return}if(this._zoom.escala<=1||(this._movido+=Math.abs(e.x-o.x)+Math.abs(e.y-o.y),this._movido<5))return;const n=this._svg.getScreenCTM();n&&(this._zoom.x-=(e.x-o.x)/n.a,this._zoom.y-=(e.y-o.y)/n.d,this._aplicarZoom(),this._arrastro=!0,this._raiz.classList.add("arrastrando"))}_dedoArriba(a){this._agarrada?.pointerId===a.pointerId&&(this._agarrada=null),this._dedos.delete(a.pointerId),this._dedos.size<2&&(this._pellizco=null),this._raiz.classList.remove("arrastrando"),this._arrastro&&setTimeout(()=>{this._arrastro=!1},0)}_pantallaCompleta(){document.fullscreenElement===this?document.exitFullscreen():this.requestFullscreen?.().catch(()=>{})}_visible(a){!a&&this._reloj.corriendo?(this._reloj.pausar(),this._pausadoPorOcultar=!0):a&&this._pausadoPorOcultar&&(this._pausadoPorOcultar=!1,this._reloj.reproducir())}_tecla(a){const t=.03333333333333333,e={" ":()=>this._alternarPorUsuario(),k:()=>this._alternarPorUsuario(),ArrowRight:()=>this.capituloSiguiente(),ArrowLeft:()=>this.capituloAnterior(),".":()=>{this.pausar(),this.irA(this.t+t)},",":()=>{this.pausar(),this.irA(this.t-t)},Home:()=>this.irA(0),End:()=>this.irA(this.duracion),"+":()=>this._zoomEn(1.5),"=":()=>this._zoomEn(1.5),"-":()=>this._zoomEn(1/1.5),0:()=>this._zoomEn(0)}[a.key];e&&(a.preventDefault(),e())}};function sn(a){const t=[];return a.descripcion&&t.push(a.descripcion),a.capitulos.length&&t.push(`Capítulos: ${a.capitulos.map((o,e)=>`${e+1}. ${o.nombre}`).join("; ")}.`),a.subtitulos.length&&t.push(`Lo que se cuenta: ${a.subtitulos.map(o=>o.texto).join(" ")}`),t.join(" ")}function ln(a="motor-escena"){typeof customElements>"u"||customElements.get(a)||customElements.define(a,Ct)}var cn=`
/* En la página, la pregunta va en un renglón propio debajo del dibujo: si lo
   tapara, taparía justo lo que hay que mirar para contestarla (la tabla que
   hay que filtrar, la barra cuya proporción se pregunta). */
.ma-raiz {
    grid-template-areas: "escena" "subtitulo" "pregunta" "controles";
}
.ma-pregunta {
    grid-area: pregunta;
    position: relative;
    margin: 4px 12px 12px;
    overflow: auto;
    box-sizing: border-box;
    padding: 14px 16px 16px;
    border: 2px solid var(--ma-acento);
    border-radius: 12px;
    background: var(--ma-superficie);
    color: var(--ma-texto);
    font-size: clamp(15px, 2.3cqi, 22px);
    line-height: 1.4;
    cursor: auto;
    /* Por encima de los controles: en pantalla completa, escondidos siguen
       ahí, y no tienen que quedarse con los clics de las opciones. */
    z-index: 4;
    transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}
/* En pantalla completa no hay renglón de abajo: la pregunta va encima del
   dibujo, más grande (se lee desde lejos), y se puede achicar para mirar lo
   que tapa. Los controles se esconden mientras está abierta (ver
   _actualizarVista); si alguien los busca, la pregunta sube para dejarles
   lugar. */
:host([pantalla]) .ma-pregunta,
:host(:fullscreen) .ma-pregunta {
    grid-area: escena;
    align-self: end;
    margin: 0 4% 4%;
    max-height: calc(100% - 8% - var(--ma-alto-controles, 0px));
    box-shadow: 0 8px 28px rgb(0 0 0 / 0.25);
    font-size: clamp(18px, 2.2cqi, 40px);
    padding: 0.7em 1em 0.9em;
}
:host([pantalla]) .ver-controles .ma-pregunta,
:host(:fullscreen) .ver-controles .ma-pregunta {
    transform: translateY(calc(-1 * var(--ma-alto-controles, 0px)));
}
/* Cuando el subtítulo dice lo mismo que la pregunta (lo normal: el narrador
   la lee en voz alta), se esconde mientras está abierta: repetido, solo tapa. */
.ma-raiz.sub-repite .ma-subtitulo {
    display: none;
}
.ma-pregunta[hidden] {
    display: none;
}
.ma-pregunta .ma-cabeza {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
}
.ma-pregunta .ma-encabezado {
    font-weight: 800;
    color: var(--ma-acento);
    margin: 0 0 4px;
}
.ma-pregunta button.ma-ocultar {
    flex: none;
    min-height: 36px;
    margin: -4px -6px 0 0;
    padding: 4px 12px;
    border-color: transparent;
    background: transparent;
    color: var(--ma-suave);
    font-size: 0.85em;
}
/* En la página no tapa nada: no hace falta achicarla. */
:host(:not([pantalla]):not(:fullscreen)) .ma-ocultar {
    display: none;
}
/* Achicada (solo en pantalla completa: al salir vuelve a verse entera):
   queda solo el botón para volver, en una esquina. */
:host([pantalla]) .ma-pregunta.minimizada,
:host(:fullscreen) .ma-pregunta.minimizada {
    justify-self: end;
    padding: 4px;
    overflow: visible;
}
:host([pantalla]) .ma-pregunta.minimizada > :not(.ma-cabeza),
:host([pantalla]) .ma-pregunta.minimizada .ma-encabezado,
:host(:fullscreen) .ma-pregunta.minimizada > :not(.ma-cabeza),
:host(:fullscreen) .ma-pregunta.minimizada .ma-encabezado {
    display: none;
}
.ma-pregunta.minimizada button.ma-ocultar {
    margin: 0;
    color: var(--ma-acento);
}
.ma-pregunta .ma-enunciado {
    margin: 0 0 10px;
    font-weight: 600;
}
.ma-pregunta .ma-opciones {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.ma-pregunta button {
    min-height: 44px;
    padding: 6px 16px;
    border-radius: 10px;
    border: 2px solid var(--ma-borde);
    background: var(--ma-fondo);
    color: var(--ma-texto);
    font: 600 1em/1.2 var(--ma-fuente);
    cursor: pointer;
}
.ma-pregunta .ma-opciones button {
    font-family: var(--ma-fuente-mono);
}
.ma-pregunta button:hover:not(:disabled) {
    border-color: var(--ma-acento);
}
.ma-pregunta button:focus-visible {
    outline: 3px solid var(--ma-acento);
    outline-offset: 2px;
}
.ma-pregunta button.correcta {
    border-color: var(--ma-exito);
    background: color-mix(in srgb, var(--ma-exito) 18%, var(--ma-fondo));
}
.ma-pregunta button.elegida:not(.correcta) {
    border-color: var(--ma-error);
    background: color-mix(in srgb, var(--ma-error) 15%, var(--ma-fondo));
}
.ma-pregunta button:disabled {
    cursor: default;
}
.ma-pregunta .ma-respuesta {
    margin: 10px 0 0;
}
.ma-pregunta .ma-seguir {
    margin-top: 10px;
    background: var(--ma-acento);
    border-color: var(--ma-acento);
    color: var(--ma-fondo);
}
.ma-controles .corto {
    display: none;
}
/* En un celular no entran todos los controles en dos renglones: el tiempo se
   esconde (la barra lo dice igual a un lector de pantalla). Y en una columna,
   "Paso a paso" se acorta para que la barra entre en un renglón. */
@container (max-width: 400px) {
    .ma-tiempo {
        display: none;
    }
}
@container (max-width: 720px) {
    .ma-controles .largo {
        display: none;
    }
    .ma-controles .corto {
        display: inline;
    }
}
.ma-pregunta .ma-nota {
    margin: 8px 0 0;
    color: var(--ma-suave);
    font-size: 0.9em;
}
`,un=class extends Ct{static observedAttributes=[...Ct.observedAttributes,"paso-a-paso","video","controles-flotantes"];constructor(){super();const a=document.createElement("style");a.textContent=cn,this.shadowRoot.appendChild(a),this._panel=document.createElement("div"),this._panel.className="ma-pregunta",this._panel.hidden=!0,this._panel.setAttribute("role","group"),this._panel.setAttribute("aria-label","Pregunta"),this._panel.addEventListener("click",o=>o.stopPropagation()),this._panel.addEventListener("keydown",o=>o.stopPropagation()),this._raiz.appendChild(this._panel),new ResizeObserver(()=>{if(this._panel.hidden)return;const o=this._raiz.getBoundingClientRect().bottom-this._panel.getBoundingClientRect().top;this._raiz.style.setProperty("--ma-alto-pregunta",`${o}px`)}).observe(this._panel);const t=this.shadowRoot.querySelector(".ma-controles");this._botonPasos=document.createElement("button"),this._botonPasos.type="button",this._botonPasos.innerHTML='<span class="largo">Paso a paso</span><span class="corto" aria-hidden="true">Pasos</span>',this._botonPasos.setAttribute("aria-label","Paso a paso"),this._botonPasos.setAttribute("aria-pressed","false"),this._botonPasos.addEventListener("click",o=>{o.stopPropagation(),this.toggleAttribute("paso-a-paso")}),t.insertBefore(this._botonPasos,t.querySelector('[data-accion="velocidad"]'));for(const[o,e]of[["anterior","Paso anterior"],["siguiente","Paso siguiente"]])t.querySelector(`[data-accion="${o}"]`).setAttribute("aria-label",e);this._marcas=[],this._abierta=null}attributeChangedCallback(a,t,o){if(a==="paso-a-paso"||a==="video"){this._botonPasos.setAttribute("aria-pressed",String(this.hasAttribute("paso-a-paso"))),this._compilada&&this._alArmar(this._compilada);return}super.attributeChangedCallback(a,t,o)}_controlesFijos(){return!this.hasAttribute("controles-flotantes")}get pasoAPaso(){return this.hasAttribute("paso-a-paso")}_alArmar(a){this._marcas=a.marcas;const t=this.hasAttribute("video")?[]:this._marcas.filter(o=>o.tipo==="pregunta"||o.tipo==="paso"&&this.pasoAPaso).map(o=>o.t);this._reloj.fijarParadas([...new Set(t)])}_marcasDeLaBarra(a){return a.marcas.filter(t=>t.tipo==="pregunta").map(t=>({t:t.t,clase:"pregunta",texto:"?"}))}_alParar(a){const t=this._marcas.find(o=>o.tipo==="pregunta"&&o.t===a);t&&this._abrir(t,!0)}_mirarSubtitulo(){const a=e=>String(e??"").toLowerCase().replace(/\s+/g," ").trim(),t=a(this._abierta?.datos?.pregunta),o=!!this._abierta&&(!t||a(this._subtitulo.textContent).includes(t));this._raiz.classList.toggle("sub-repite",o)}_alPintar(a){if(this.hasAttribute("video")){const t=this._marcas.find(o=>o.tipo==="pregunta"&&a.t>=o.t&&a.t<o.hasta);t&&this._abierta!==t?this._abrir(t,!1):!t&&this._abierta&&this._cerrar()}else this._abierta&&Math.abs(a.t-this._abierta.t)>1e-6&&this._cerrar();this._mirarSubtitulo()}capituloSiguiente(){const a=this._puntos().find(t=>t>this.t+1e-6);this.pausar(),a===void 0?this.irA(this.duracion):this._llegarA(a)}capituloAnterior(){const a=this._puntos().filter(t=>t<this.t-1e-6);this.pausar(),this.irA(a.length?a[a.length-1]:0)}_tecla(a){if(this._abierta&&[" ","k","."].includes(a.key)){a.preventDefault();return}super._tecla(a)}_puntos(){const a=this.pasoAPaso?["paso","pregunta"]:["pregunta"],t=this._marcas.filter(o=>a.includes(o.tipo)).map(o=>o.t);for(const o of this._compilada?.capitulos??[])t.push(o.t);return[...new Set(t)].sort((o,e)=>o-e)}_llegarA(a){this.irA(a);const t=this._marcas.find(o=>o.tipo==="pregunta"&&o.t===a);t&&!this.hasAttribute("video")&&this._abrir(t,!0)}_abrir(a,t){const o=a.datos??{};this._abierta=a;const e=this._panel;e.replaceChildren(),e.classList.remove("minimizada");const n=(u,d,h=e)=>{const m=document.createElement("p");return m.className=u,m.textContent=d,h.appendChild(m),m},r=document.createElement("div");r.className="ma-cabeza",e.appendChild(r),n("ma-encabezado","🤔 Pensalo antes de seguir",r);const i=document.createElement("button");i.type="button",i.className="ma-ocultar",i.setAttribute("aria-expanded","true");const s=()=>{const u=e.classList.contains("minimizada");i.textContent=u?"🤔 Volver a la pregunta":"Ver el dibujo",i.setAttribute("aria-expanded",String(!u))};i.addEventListener("click",()=>{e.classList.toggle("minimizada"),s()}),s(),t&&r.appendChild(i),n("ma-enunciado",o.pregunta??"¿Qué creés que pasa ahora?");const l=document.createElement("div");l.className="ma-opciones",e.appendChild(l);const c=(o.opciones??[]).map((u,d)=>{const h=document.createElement("button");return h.type="button",h.textContent=u,h.disabled=!t,h.addEventListener("click",()=>this._contestar(a,d,c)),l.appendChild(h),h});t?c.length===0&&this._botonSeguir(a,"Ya lo pensé: ver qué pasa"):n("ma-nota","Pausá y pensalo: la respuesta viene enseguida."),e.hidden=!1,this._vista.pregunta=!0,this._actualizarVista(),this._mirarSubtitulo(),e.setAttribute("aria-live","polite"),t&&(c[0]??e.querySelector("button"))?.focus()}_contestar(a,t,o){const e=a.datos??{};o.forEach((i,s)=>{i.disabled=!0,s===e.correcta&&i.classList.add("correcta"),s===t&&i.classList.add("elegida")});const n=e.correcta===void 0||t===e.correcta,r=document.createElement("p");r.className="ma-respuesta",r.textContent=`${n?"✅ ¡Bien!":"❌ No era esa."} ${e.explicacion??""}`.trim(),this._panel.appendChild(r),this._botonSeguir(a,"Seguir"),this.dispatchEvent(new CustomEvent("respuesta",{detail:{pregunta:e.pregunta,elegida:t,correcta:e.correcta,bien:n},bubbles:!0}))}_botonSeguir(a,t){const o=document.createElement("button");o.type="button",o.className="ma-seguir",o.textContent=t,o.addEventListener("click",()=>{this._cerrar(),this.irA(a.hasta),this.reproducir()}),this._panel.appendChild(o),o.focus()}_cerrar(){this._abierta=null,this._panel.hidden=!0,this._panel.classList.remove("minimizada"),this._panel.replaceChildren(),this._vista.pregunta=!1,this._actualizarVista(),this._mirarSubtitulo()}};function dn(a="motor-leccion"){typeof customElements>"u"||customElements.get(a)||customElements.define(a,un)}var Na=({crecer:a,...t}={})=>t;function Hn(a,t={}){const o=t.crecer===!0?.6:t.crecer;return{pieza:a,desde:{opacidad:0,...o?{escala:o}:{}},a:{opacidad:1,...o?{escala:1}:{}},...Na(t)}}function Yn(a,t={}){const o=t.crecer===!0?.6:t.crecer;return{pieza:a,a:{opacidad:0,...o?{escala:o}:{}},...Na(t)}}function Zn(a,t={}){return{pieza:a,desde:{trazo:0,opacidad:1},a:{trazo:1,opacidad:1},dur:1.2,curva:"suave",...Na(t)}}function Xn(a,t={}){return{pieza:a,a:{trazo:0},dur:.8,...Na(t)}}function Gn(a,t,o={}){return{pieza:a,a:t,...Na(o)}}function Wn(a,t,o={}){const{relleno:e,borde:n,...r}=o;return{pieza:a,a:{d:t,...e?{relleno:e}:{},...n?{borde:n}:{}},dur:1,...Na(r)}}function Jn(a,t={}){return{subtitulo:a,...t}}function Qn(a,t={}){return{sonido:a,...t}}var ho={x:0,y:0,escala:1,rotacion:0,opacidad:1,dentro:null,pegar:null,pegado:1,trazo:1};function ta(a){if(!a.nombre)throw new Error("Una pieza necesita un nombre.");const t={colores:[],formas:[],...a},o=new Set([...Object.keys(ho),...Object.keys(a.predeterminados)]);function e(n={}){for(const i of Object.keys(n))if(!o.has(i))throw new Error(`Una ${t.nombre} no tiene "${i}". Lo que se le puede poner es: ${[...o].join(", ")}.`);const r={...ho,...a.predeterminados,...n};return a.validar?.(r),{tipo:t,props:r,propias:Object.keys(n)}}return e.tipo=t,e}var qt=ta({nombre:"caja",predeterminados:{ancho:280,alto:140,radio:18,relleno:"superficie",borde:"borde",grosorBorde:3,texto:"",color:"texto",tamano:30,peso:600,icono:"",tamanoIcono:56,escrito:1,resaltado:0},colores:["relleno","borde","color"],crear(a){return{anillo:f("rect",{fill:"none",stroke:"var(--ma-acento)","stroke-width":6},a),fondo:f("rect",{},a),icono:f("text",{"text-anchor":"middle","dominant-baseline":"central"},a),texto:f("text",{"text-anchor":"middle","dominant-baseline":"central"},a)}},actualizar(a,t){const{ancho:o,alto:e}=t;w(a.fondo,{x:-o/2,y:-e/2,width:o,height:e,rx:t.radio,fill:S(t.relleno),stroke:S(t.borde),"stroke-width":t.grosorBorde});const n=10;w(a.anillo,{x:-o/2-n,y:-e/2-n,width:o+2*n,height:e+2*n,rx:t.radio+n,opacity:t.resaltado,visibility:t.resaltado>0?null:"hidden"});const r=Xa(t.texto,Math.floor((o-32)/(t.tamano*Aa))),i=t.texto?r.length*t.tamano*1.2:0,s=t.icono?t.tamanoIcono:0,l=t.icono&&t.texto?10:0,c=-(s+l+i)/2;w(a.icono,{y:c+s/2,"font-size":t.tamanoIcono,visibility:t.icono?null:"hidden"}),X(a.icono,t.icono),w(a.texto,{fill:S(t.color),"font-size":t.tamano,"font-weight":t.peso}),Nt(a.texto,ko(r,t.escrito),{y:c+s+l+i/2,tamano:t.tamano,interlineado:1.2})},tamano:a=>({ancho:a.ancho,alto:a.alto})}),fo={inicio:"start",centro:"middle",fin:"end"},ja=ta({nombre:"texto",predeterminados:{texto:"",tamano:32,peso:400,color:"texto",alineacion:"centro",anchoMax:0,interlineado:1.25,escrito:1,fuente:"normal"},colores:["color"],validar(a){if(!(a.alineacion in fo))throw new Error(`La alineación de un texto es 'inicio', 'centro' o 'fin', no "${a.alineacion}".`)},crear(a){return{texto:f("text",{"dominant-baseline":"central"},a)}},actualizar(a,t){w(a.texto,{fill:S(t.color),"font-size":t.tamano,"font-weight":t.peso,"text-anchor":fo[t.alineacion],"font-family":t.fuente==="mono"?"var(--ma-fuente-mono)":null,style:t.fuente==="mono"?"white-space: pre":null});const o=Xa(t.texto,po(t));Nt(a.texto,ko(o,t.escrito),{tamano:t.tamano,interlineado:t.interlineado})},centro(a){const t=this.tamano(a).ancho/2;return{x:a.alineacion==="inicio"?t:a.alineacion==="fin"?-t:0,y:0}},tamano(a){const t=Xa(a.texto,po(a));return{ancho:Math.max(0,...t.map(e=>Array.from(e).length))*a.tamano*Aa,alto:t.length*a.tamano*a.interlineado}}});function po(a){return a.anchoMax>0?Math.floor(a.anchoMax/(a.tamano*Aa)):0}var mn=ta({nombre:"flecha",predeterminados:{desde:null,hasta:null,progreso:1,curvatura:0,separacion:12,grosor:5,color:"suave",punta:!0,punteada:!1,etiqueta:"",tamanoEtiqueta:24,colorEtiqueta:"suave",ladoEtiqueta:1,girarEtiqueta:!1},colores:["color","colorEtiqueta"],dependeDeOtras:!0,validar(a){if(a.desde==null||a.hasta==null)throw new Error('Una flecha necesita "desde" y "hasta".')},crear(a){return{linea:f("path",{fill:"none","stroke-linecap":"round"},a),punta:f("path",{},a),etiqueta:f("text",{"text-anchor":"middle","dominant-baseline":"central","font-weight":600},a)}},actualizar(a,t,o){let e=xo(t.desde,o),n=xo(t.hasta,o);t.dentro!=null&&(e=go(e,t.dentro,o),n=go(n,t.dentro,o)),bo(t.desde)&&(e={...e,x:e.x-t.x,y:e.y-t.y}),bo(t.hasta)&&(n={...n,x:n.x-t.x,y:n.y-t.y});const r=Lo(e,n,t.curvatura,t.separacion),i=me(r),s=i[i.length-1],l=fa(t.progreso,0,1),c=l>0&&s>0,u=t.punta?t.grosor*3.2:0,d=fa((l*s-u*.7)/s,0,1),h=he(r,Qt(i,d));w(a.linea,{d:`M${ma(h.p0.x)} ${ma(h.p0.y)} Q${ma(h.c.x)} ${ma(h.c.y)} ${ma(h.p1.x)} ${ma(h.p1.y)}`,stroke:S(t.color),"stroke-width":t.grosor,"stroke-dasharray":t.punteada?`${t.grosor*2.4} ${t.grosor*2}`:null,visibility:c&&d>0?null:"hidden"});const m=Qt(i,l),b=wa(r,m),$=rt(r,m),g=u,x=t.grosor*2.2,p={x:b.x-Math.cos($)*g,y:b.y-Math.sin($)*g},z=-Math.sin($)*x,A=Math.cos($)*x;w(a.punta,{d:`M${ma(b.x)} ${ma(b.y)} L${ma(p.x+z)} ${ma(p.y+A)} L${ma(p.x-z)} ${ma(p.y-A)} Z`,fill:S(t.color),visibility:c&&t.punta?null:"hidden"});const E=wa(r,.5),T=rt(r,.5),v=Math.sin(T)*(t.ladoEtiqueta<0?-1:1),q=-Math.cos(T)*(t.ladoEtiqueta<0?-1:1),O=Array.from(t.etiqueta).length*t.tamanoEtiqueta*Aa/2,L=t.girarEtiqueta?t.tamanoEtiqueta*.8:t.tamanoEtiqueta*.5+Math.abs(v)*O+Math.abs(q)*t.tamanoEtiqueta*.5,C=E.x+v*L,M=E.y+q*L;let N=T*180/Math.PI;N>90&&(N-=180),N<-90&&(N+=180),w(a.etiqueta,{x:C,y:M,transform:t.girarEtiqueta?`rotate(${N.toFixed(1)} ${C.toFixed(1)} ${M.toFixed(1)})`:null,"font-size":t.tamanoEtiqueta,fill:S(t.colorEtiqueta),opacity:fa((l-.5)/.4,0,1),visibility:t.etiqueta&&l>.5?null:"hidden"}),X(a.etiqueta,t.etiqueta)}}),bo=a=>typeof a=="string"||a?.pieza!=null;function xo(a,t){const o=typeof a=="string"?a:a.pieza;if(o==null)return{x:a.x,y:a.y};if(!t.estado.piezas[o])throw new Error(`La flecha apunta a "${o}", y no hay ninguna pieza que se llame así.`);const e=la(o,t.estado,t.tipos);return typeof a=="string"?e:hn(e,a.lado,a.dx??0,a.dy??0)}function hn(a,t="centro",o=0,e=0){const n=a.x+(t==="derecha"?a.ancho/2:t==="izquierda"?-a.ancho/2:0),r=a.y+(t==="abajo"?a.alto/2:t==="arriba"?-a.alto/2:0);return{x:n+o,y:r+e}}function go(a,t,o){const{x:e,y:n,escala:r}=So(a,t,o.estado,o.tipos);return{x:e,y:n,ancho:(a.ancho??0)/r,alto:(a.alto??0)/r}}function ma(a){return Math.round(a*100)/100}var St=ta({nombre:"tabla",predeterminados:{columnas:[],filas:[],anchos:null,ancho:640,altoFila:56,tamano:24,filasVisibles:1/0,resaltarFila:-1,relleno:"superficie",borde:"borde",encabezado:"acento",colorEncabezado:"fondo",color:"texto",anclaje:"centro"},colores:["relleno","borde","encabezado","colorEncabezado","color"],validar(a){if(!Array.isArray(a.columnas)||a.columnas.length===0)throw new Error('Una tabla necesita sus columnas: columnas: ["Nombre", "DNI"].')},crear(a){return{grupo:a,forma:"",filas:[]}},actualizar(a,t){const o=t.anchos??t.columnas.map(()=>t.ancho/t.columnas.length),e=o.reduce((s,l)=>s+l,0),n=-e/2,r=t.anclaje==="arriba"?0:-((t.filas.length+1)*t.altoFila)/2,i=`${t.columnas.length}x${t.filas.length}`;if(a.forma!==i){a.grupo.replaceChildren(),a.filas=[];for(let s=0;s<=t.filas.length;s++){const l=f("g",{},a.grupo),c=f("rect",{},l),u=t.columnas.map(()=>f("text",{"dominant-baseline":"central"},l));a.filas.push({g:l,fondo:c,celdas:u})}a.forma=i}a.filas.forEach((s,l)=>{const c=l===0,u=c?t.columnas:t.filas[l-1],d=c?1:fa(t.filasVisibles-(l-1),0,1),h=r+l*t.altoFila;w(s.g,{opacity:d,transform:`translate(0 ${Math.round((1-d)*16*100)/100})`,visibility:d>0?null:"hidden"});const m=!c&&Math.round(t.resaltarFila)===l-1;w(s.fondo,{x:n,y:h,width:e,height:t.altoFila,fill:c?S(t.encabezado):m?`color-mix(in srgb, ${S("acento")} 22%, ${S(t.relleno)})`:S(t.relleno),stroke:S(t.borde),"stroke-width":2});let b=n;s.celdas.forEach(($,g)=>{w($,{x:b+16,y:h+t.altoFila/2,"font-size":t.tamano,"font-weight":c||m?700:400,fill:S(c?t.colorEncabezado:t.color)}),X($,String(u?.[g]??"")),b+=o[g]})})},tamano(a){return{ancho:(a.anchos??a.columnas.map(()=>a.ancho/a.columnas.length)).reduce((o,e)=>o+e,0),alto:(a.filas.length+1)*a.altoFila}}}),Fa=360,st=740,Ma=16,Ua=Fa+2*Ma,Oa=st+2*Ma,Da=40,Lt=64,Kn=ta({nombre:"celular",predeterminados:{alto:640,titulo:"",hora:"18:30",pantalla:"superficie",marco:"marco",barraTitulo:"acento",colorTitulo:"fondo"},colores:["pantalla","marco","barraTitulo","colorTitulo"],crear(a){const t=f("g",{},a),o=ua("ma-pantalla"),e=f("clipPath",{id:o},f("defs",{},t));f("rect",{x:0,y:0,width:Fa,height:st,rx:30},e);const n=f("rect",{x:0,y:0,width:Ua,height:Oa,rx:46},t),r=f("g",{transform:`translate(${Ma} ${Ma})`,"clip-path":`url(#${o})`},t),i=f("rect",{x:0,y:0,width:Fa,height:st},r),s=f("rect",{x:0,y:Da,width:Fa,height:Lt},r),l=f("text",{x:20,y:Da+Lt/2,"dominant-baseline":"central","font-size":24,"font-weight":700},r),c=f("text",{x:26,y:Da/2+2,"dominant-baseline":"central","font-size":15,"font-weight":600},r),u=f("g",{transform:`translate(${Fa-70} ${Da/2-6})`},r);[4,7,10].forEach((m,b)=>f("rect",{x:b*6,y:12-m,width:4,height:m,rx:1},u)),f("rect",{x:24,y:0,width:24,height:12,rx:3,fill:"none","stroke-width":1.5},u),f("rect",{x:26.5,y:2.5,width:15,height:7,rx:1.5},u);const d=f("g",{},r),h=f("rect",{x:Ua/2-40,y:Ma+10,width:80,height:18,rx:9},t);return{cuerpo:t,marco:n,fondo:i,barraApp:s,titulo:l,hora:c,iconos:u,contenido:d,camara:h}},actualizar(a,t){const o=t.alto/Oa;w(a.cuerpo,{transform:`scale(${o}) translate(${-Ua/2} ${-Oa/2})`}),w(a.marco,{fill:S(t.marco)}),w(a.camara,{fill:S(t.marco)}),w(a.fondo,{fill:S(t.pantalla)});const e=t.titulo!=="";w(a.barraApp,{fill:S(t.barraTitulo),visibility:e?null:"hidden"}),w(a.titulo,{fill:S(t.colorTitulo),visibility:e?null:"hidden"}),X(a.titulo,t.titulo),w(a.hora,{fill:"var(--ma-texto)"}),X(a.hora,t.hora),w(a.iconos,{fill:"var(--ma-texto)",stroke:"var(--ma-texto)"})},tamano:a=>({ancho:a.alto*Ua/Oa,alto:a.alto}),contenedor:a=>a.contenido,origenContenedor(a){const t=a.alto/Oa;return{x:(Ma-Ua/2)*t,y:(Ma-Oa/2)*t,escala:t}}}),ar={ancho:Fa,alto:st,arriba:Da,debajoDelTitulo:Da+Lt},fn=ta({nombre:"camara",predeterminados:{mirarX:0,mirarY:0,zoom:1,ancho:0,alto:0,forma:"rect",radio:0,aro:0,colorAro:"borde",sombra:!1,fondo:""},colores:["colorAro","fondo"],validar(a){if(!["rect","circulo"].includes(a.forma))throw new Error(`Una cámara es 'rect' o 'circulo', no "${a.forma}".`)},crear(a){const t=ua("ma-camara"),o=f("clipPath",{id:t},f("defs",{},a)),e=f("rect",{},a),n=f("g",{},a),r=f("g",{},n);return{id:t,recorte:f("rect",{},o),sombra:e,ventana:n,contenido:r,aro:f("rect",{fill:"none"},a),filtro:Pt(a,{dy:6,desenfoque:7,opacidad:.28})}},actualizar(a,t){const o=t.ancho>0&&t.alto>0,e=pn(t);w(a.recorte,e),w(a.ventana,{"clip-path":o?`url(#${a.id})`:null}),w(a.contenido,{transform:`scale(${t.zoom}) translate(${-t.mirarX} ${-t.mirarY})`}),w(a.sombra,{...e,fill:t.fondo?S(t.fondo):"var(--ma-fondo)",visibility:o&&(t.sombra||t.fondo)?null:"hidden",filter:t.sombra?a.filtro:null}),w(a.aro,{...e,stroke:S(t.colorAro),"stroke-width":t.aro,visibility:o&&t.aro>0?null:"hidden"})},tamano:a=>a.forma==="circulo"?{ancho:Math.min(a.ancho,a.alto),alto:Math.min(a.ancho,a.alto)}:{ancho:a.ancho,alto:a.alto},contenedor:a=>a.contenido,origenContenedor:a=>({x:-a.mirarX*a.zoom,y:-a.mirarY*a.zoom,escala:a.zoom})});function pn(a){const t=a.forma==="circulo",o=t?Math.min(a.ancho,a.alto):a.ancho,e=t?o:a.alto,n=t?o/2:Math.min(Math.max(a.radio,0),o/2,e/2);return{x:-o/2,y:-e/2,width:o,height:e,rx:n,ry:n}}var bn=ta({nombre:"espejo",predeterminados:{fuente:null,mirarX:0,mirarY:0,zoom:2,ancho:360,alto:160,forma:"rect",radio:14,aro:3,colorAro:"acento",fondo:"fondo",sombra:!0,marco:!1,colorMarco:"acento",arrastrable:!0,seguir:!1},colores:["colorAro","fondo","colorMarco"],dependeDeOtras:!0,validar(a){if(!["rect","circulo"].includes(a.forma))throw new Error(`Un espejo es 'rect' o 'circulo', no "${a.forma}".`);if(!(a.zoom>0))throw new Error("El zoom de un espejo tiene que ser mayor que 0.")},crear(a,t,o){const e=ua("ma-espejo"),n=f("rect",{fill:"none","stroke-dasharray":"8 6","stroke-width":3,"pointer-events":"none"},a),r=f("rect",{},f("clipPath",{id:e},f("defs",{},a))),i=f("rect",{},a),s=f("g",{"clip-path":`url(#${e})`},a),l=f("g",{},s),c=f("rect",{fill:"none"},a);return t.arrastrable&&!t.seguir&&a.setAttribute("data-arrastrable",o.id),{grupo:a,marco:n,clip:r,fondo:i,contenido:l,aro:c,usos:new Map,sombra:Pt(a,{dy:8,desenfoque:9,opacidad:.3})}},actualizar(a,t,o){const e=vo(t);w(a.clip,e),w(a.fondo,{...e,fill:S(t.fondo),filter:t.sombra?a.sombra:null}),w(a.aro,{...e,stroke:S(t.colorAro),"stroke-width":t.aro,visibility:t.aro>0?null:"hidden"});const n=!t.seguir&&o.arrastres?.[o.id]||{x:0,y:0},r=la(o.id,o.estado,o.tipos),i=t.seguir?r.x:t.mirarX,s=t.seguir?r.y:t.mirarY;w(a.contenido,{transform:`scale(${t.zoom}) translate(${-i} ${-s})`}),xn(a,t,o);const l=e.width/t.zoom,c=e.height/t.zoom;w(a.marco,{x:i-l/2-r.x-n.x,y:s-c/2-r.y-n.y,width:l,height:c,rx:e.rx/t.zoom,stroke:S(t.colorMarco),visibility:t.marco?null:"hidden"})},tamano:a=>{const t=vo(a);return{ancho:t.width,alto:t.height}}});function xn(a,t,o){const e=a.grupo.ownerSVGElement;if(!e)return;const n=t.fuente!=null?[t.fuente]:o.ids.filter(r=>o.estado.piezas[r].dentro==null&&o.tipos[r].nombre!=="espejo");for(const r of n){if(!o.estado.piezas[r])throw new Error(`El espejo mira "${r}", y no hay ninguna pieza que se llame así.`);let i=a.usos.get(r);if(!i){const c=e.querySelector(`[data-pieza="${r}"]`);if(!c)continue;c.id||(c.id=ua("ma-pieza"));const u=f("g",{},a.contenido);f("use",{href:`#${c.id}`},u),i={envoltorio:u},a.usos.set(r,i)}const s=o.estado.piezas[r].dentro;let l=null;if(s!=null){const c={piezas:{...o.estado.piezas,__origen:{x:0,y:0,escala:1,dentro:s}}},u=la("__origen",c,{...o.tipos,__origen:{}}),d=la("__origen",{piezas:{...c.piezas,__origen:{x:1,y:0,escala:1,dentro:s}}},{...o.tipos,__origen:{}});l=`translate(${u.x} ${u.y}) scale(${d.x-u.x||1})`}w(i.envoltorio,{transform:l})}}function vo(a){const t=a.forma==="circulo",o=t?Math.min(a.ancho,a.alto):a.ancho,e=t?o:a.alto,n=t?o/2:Math.min(Math.max(a.radio,0),o/2,e/2);return{x:-o/2,y:-e/2,width:o,height:e,rx:n,ry:n}}var tr=ta({nombre:"fila",predeterminados:{piezas:[],direccion:"horizontal",separacion:24,alinear:"centro",margen:0,relleno:"",borde:"",radio:12,ancho:0,alto:0},colores:["relleno","borde"],validar(a){if(!Array.isArray(a.piezas))throw new Error(`Una fila necesita "piezas": la lista de ids que acomoda, por ejemplo ['a', 'b'].`);if(!["horizontal","vertical"].includes(a.direccion))throw new Error(`Una fila es 'horizontal' o 'vertical', no "${a.direccion}".`)},crear(a){return{caja:f("rect",{},a)}},actualizar(a,t){const o=t.ancho+2*t.margen,e=t.alto+2*t.margen;w(a.caja,{x:-o/2,y:-e/2,width:o,height:e,rx:t.radio,fill:t.relleno?S(t.relleno):"none",stroke:t.borde?S(t.borde):"none","stroke-width":t.borde?2:0,visibility:t.relleno||t.borde?null:"hidden"})},tamano:a=>({ancho:a.ancho+2*a.margen,alto:a.alto+2*a.margen})}),gn={inicio:"start",centro:"middle",fin:"end"};function vn(a,t=0){const o=Math.abs(a).toFixed(t),[e,n]=o.split("."),r=e.replace(/\B(?=(\d{3})+(?!\d))/g,".");return(a<0&&Number(o)!==0?"-":"")+r+(n?`,${n}`:"")}var or=ta({nombre:"contador",predeterminados:{valor:0,decimales:0,prefijo:"",sufijo:"",tamano:96,peso:800,color:"texto",alineacion:"centro"},colores:["color"],crear(a){return{texto:f("text",{"dominant-baseline":"central","font-variant-numeric":"tabular-nums"},a)}},actualizar(a,t){w(a.texto,{fill:S(t.color),"font-size":t.tamano,"font-weight":t.peso,"text-anchor":gn[t.alineacion]??"middle"}),X(a.texto,yo(t))},tamano(a){return{ancho:Array.from(yo(a)).length*a.tamano*Aa,alto:a.tamano*1.25}},centro(a){const t=this.tamano(a).ancho/2;return{x:a.alineacion==="inicio"?t:a.alineacion==="fin"?-t:0,y:0}}});function yo(a){return`${a.prefijo}${vn(a.valor,a.decimales)}${a.sufijo}`}var er=ta({nombre:"cilindro",predeterminados:{ancho:200,alto:150,relleno:"superficie",borde:"acento",grosorBorde:4,nivel:0,colorNivel:"acento",texto:"",tamano:24,peso:700,color:"texto"},colores:["relleno","borde","colorNivel","color"],crear(a){return{cuerpo:f("path",{},a),liquido:f("path",{stroke:"none"},a),tapa:f("ellipse",{},a),texto:f("text",{"text-anchor":"middle","dominant-baseline":"central"},a)}},actualizar(a,t){const o=t.ancho/2,e=t.ancho*.14,n=-t.alto/2+e,r=t.alto/2-e;w(a.cuerpo,{d:`M${-o} ${n} V${r} A${o} ${e} 0 0 0 ${o} ${r} V${n} Z`,fill:S(t.relleno),stroke:S(t.borde),"stroke-width":t.grosorBorde});const i=fa(t.nivel,0,1),s=r-i*(r-n),l=t.grosorBorde/2;w(a.liquido,{d:`M${-o+l} ${s} V${r} A${o-l} ${e-l} 0 0 0 ${o-l} ${r} V${s} A${o-l} ${e-l} 0 0 1 ${-o+l} ${s} Z`,fill:`color-mix(in srgb, ${S(t.colorNivel)} 35%, transparent)`,visibility:i>0?null:"hidden"}),w(a.tapa,{cx:0,cy:n,rx:o,ry:e,fill:S(t.relleno),stroke:S(t.borde),"stroke-width":t.grosorBorde}),w(a.texto,{fill:S(t.color),"font-size":t.tamano,"font-weight":t.peso});const c=Xa(t.texto,Math.floor((t.ancho-24)/(t.tamano*Aa)));Nt(a.texto,c,{y:(n+r)/2+e/2,tamano:t.tamano,interlineado:1.15})},tamano:a=>({ancho:a.ancho,alto:a.alto})}),nr=ta({nombre:"grafo",predeterminados:{nodos:[],aristas:[],dirigido:!0,radio:230,radioNodo:38,tamano:28,tamanoEtiqueta:20,visibles:1/0,nodosVisibles:1/0,resaltar:[],apagar:[],relleno:"superficie",borde:"acento",color:"texto",colorArista:"suave",colorResaltado:"acento2",grosor:3.5},colores:["relleno","borde","color","colorArista","colorResaltado"],validar(a){const t=new Set(vt(a).map(o=>o.id));for(const o of _o(a.aristas))for(const e of[o.de,o.a])if(!t.has(e))throw new Error(`La arista ${o.de}→${o.a} usa "${e}", que no es ningún nodo del grafo.`)},crear(a){return{aristas:f("g",{fill:"none","stroke-linecap":"round"},a),nodos:f("g",{},a)}},actualizar(a,t){const o=vt(t),e=_o(t.aristas),n=Object.fromEntries(o.map(s=>[s.id,s])),r=new Set(t.resaltar),i=new Set(t.apagar);zo(a.aristas,e.length,s=>{f("path",{},s),f("path",{},s),f("text",{"text-anchor":"middle","dominant-baseline":"central","font-weight":600,"paint-order":"stroke",stroke:"var(--ma-fondo)","stroke-width":5},s)}),e.forEach((s,l)=>{const c=a.aristas.childNodes[l],[u,d,h]=[...c.childNodes],m=fa(t.visibles-l,0,1),b=`${s.de}→${s.a}`,$=r.has(b)?t.colorResaltado:t.colorArista,g=r.has(b)?t.grosor*1.5:t.grosor;w(c,{opacity:i.has(b)?.25:1,visibility:m>0?null:"hidden"});let x,p,z,A;if(s.de===s.a){const O=n[s.de],L=Math.atan2(O.y,O.x)||-Math.PI/2,C=t.radioNodo*.62,M=O.x+Math.cos(L)*(t.radioNodo+C*.55),N=O.y+Math.sin(L)*(t.radioNodo+C*.55),R=L+Math.PI*.75,G=R+Math.PI*1.5*m,H=M+Math.cos(R)*C,y=N+Math.sin(R)*C,k=M+Math.cos(G)*C,D=N+Math.sin(G)*C;x=`M${ia(H)} ${ia(y)}A${ia(C)} ${ia(C)} 0 ${G-R>Math.PI?1:0} 1 ${ia(k)} ${ia(D)}`,p={x:k,y:D},z=G+Math.PI/2,A={x:M+Math.cos(L)*(C+t.tamanoEtiqueta*.8),y:N+Math.sin(L)*(C+t.tamanoEtiqueta*.8)}}else{const O=n[s.de],L=n[s.a],C=e.some(F=>F.de===s.a&&F.a===s.de),M=Lo({x:O.x,y:O.y,ancho:0,alto:0},{x:L.x,y:L.y,ancho:0,alto:0},C?.18:0,0),N=Math.hypot(L.x-O.x,L.y-O.y)||1,R=Math.min(.45,(t.radioNodo+4)/N),G=1-Math.min(.45,(t.radioNodo+6)/N),H=R+(G-R)*m,y=16;x="";for(let F=0;F<=y;F++){const V=wa(M,R+(H-R)*F/y);x+=`${F===0?"M":"L"}${ia(V.x)} ${ia(V.y)}`}p=wa(M,H),z=rt(M,H);const k=wa(M,.5),D=rt(M,.5);A={x:k.x+Math.sin(D)*t.tamanoEtiqueta*.9,y:k.y-Math.cos(D)*t.tamanoEtiqueta*.9}}w(u,{d:x,stroke:S($),"stroke-width":g});const E=g*3.4,T=g*2.2,v=p.x-Math.cos(z)*E,q=p.y-Math.sin(z)*E;w(d,{d:`M${ia(p.x)} ${ia(p.y)}L${ia(v-Math.sin(z)*T)} ${ia(q+Math.cos(z)*T)}L${ia(v+Math.sin(z)*T)} ${ia(q-Math.cos(z)*T)}Z`,fill:S($),visibility:t.dirigido&&m>.3?null:"hidden"}),w(h,{x:A.x,y:A.y,"font-size":t.tamanoEtiqueta,fill:S($),visibility:s.etiqueta&&m>.6?null:"hidden"}),X(h,s.etiqueta)}),zo(a.nodos,o.length,s=>{f("circle",{fill:"none","stroke-width":6},s),f("circle",{},s),f("text",{"text-anchor":"middle","dominant-baseline":"central"},s),f("text",{"text-anchor":"middle","dominant-baseline":"central","font-weight":600},s)}),o.forEach((s,l)=>{const c=a.nodos.childNodes[l],[u,d,h,m]=[...c.childNodes],b=fa(t.nodosVisibles-l,0,1),$=r.has(s.id);w(c,{opacity:b*(i.has(s.id)?.3:1),visibility:b>0?null:"hidden"}),w(u,{cx:s.x,cy:s.y,r:t.radioNodo+9,stroke:S(t.colorResaltado),visibility:$?null:"hidden"}),w(d,{cx:s.x,cy:s.y,r:t.radioNodo,fill:S(t.relleno),stroke:S($?t.colorResaltado:t.borde),"stroke-width":3.5}),w(h,{x:s.x,y:s.y,"font-size":t.radioNodo*1.05,visibility:s.icono?null:"hidden"}),X(h,s.icono??""),w(m,{x:s.x,y:s.icono?s.y+t.radioNodo+t.tamano*.75:s.y,"font-size":s.icono?t.tamano*.8:t.tamano,fill:S(t.color)}),X(m,s.texto)})},tamano(a){const t=vt(a),o=t.map(n=>Math.abs(n.x)),e=t.map(n=>Math.abs(n.y));return{ancho:2*(Math.max(0,...o)+a.radioNodo),alto:2*(Math.max(0,...e)+a.radioNodo)}}});function vt(a){const t=a.nodos.map(o=>typeof o=="object"?{...o,id:String(o.id)}:{id:String(o)});return t.map((o,e)=>{const n=-Math.PI/2+2*Math.PI*e/Math.max(t.length,1);return{id:o.id,texto:o.texto??o.id,icono:o.icono,x:o.x??(t.length>1?Math.cos(n)*a.radio:0),y:o.y??(t.length>1?Math.sin(n)*a.radio:0)}})}function _o(a){return a.map(t=>Array.isArray(t)?{de:String(t[0]),a:String(t[1]),etiqueta:t[2]??""}:{de:String(t.de),a:String(t.a),etiqueta:t.etiqueta??""})}function zo(a,t,o){for(;a.childNodes.length>t;)a.lastChild.remove();for(;a.childNodes.length<t;)o(f("g",{},a))}function ia(a){return Math.round(a*100)/100}var rr=ta({nombre:"forma",predeterminados:{d:qo.circulo(60),relleno:"acento",borde:"ninguno",grosor:4,puntas:"redondas"},colores:["relleno","borde"],formas:["d"],validar(a){Dt(a.d)},crear(a){return{camino:f("path",{"stroke-linejoin":"round"},a)}},actualizar(a,t){w(a.camino,{d:t.d,fill:S(t.relleno),stroke:S(t.borde),"stroke-width":t.grosor,"stroke-linecap":t.puntas==="redondas"?"round":"butt"})},tamano(a){const t=$o(a.d);return{ancho:t.ancho,alto:t.alto}},centro(a){const t=$o(a.d);return{x:t.x,y:t.y}}}),et=new Map;function $o(a){let t=et.get(a);if(!t){let o=1/0,e=1/0,n=-1/0,r=-1/0;for(const i of Dt(a))for(const[s,l]of i.puntos)o=Math.min(o,s),n=Math.max(n,s),e=Math.min(e,l),r=Math.max(r,l);t=Number.isFinite(o)?{x:(o+n)/2,y:(e+r)/2,ancho:n-o,alto:r-e}:{x:0,y:0,ancho:0,alto:0},et.size>200&&et.clear(),et.set(a,t)}return t}var kt={python:new Set(["and","as","assert","break","class","continue","def","del","elif","else","except","finally","for","from","if","import","in","is","lambda","not","or","pass","raise","return","try","while","with","yield"]),js:new Set(["break","case","catch","class","const","continue","default","do","else","export","for","function","if","import","in","let","new","of","return","switch","this","throw","try","typeof","var","while"])},Eo={python:new Set(["print","input","len","range","int","str","float","list","dict","set","tuple","sum","max","min","sorted","enumerate","zip","abs","round","True","False","None"]),js:new Set(["console","document","window","true","false","null","undefined","Math","JSON"]),sql:new Set(["COUNT","SUM","AVG","MIN","MAX","NULL","TRUE","FALSE"])};kt.sql=new Set(["SELECT","FROM","WHERE","AND","OR","NOT","ORDER","BY","ASC","DESC","LIMIT","INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","JOIN","ON","AS","GROUP","HAVING","DISTINCT","LIKE","IN","IS","BETWEEN","PRIMARY","KEY","INTEGER","TEXT","REAL"]);var yn={python:"#",js:"//",sql:"--"},_n=/[A-Za-z_ÁÉÍÓÚáéíóúÑñÜü]/,Mo=/[A-Za-z0-9_ÁÉÍÓÚáéíóúÑñÜü]/;function zn(a,t="python"){const o=kt[t]??kt.python,e=Eo[t]??Eo.python,n=yn[t]??"#",r=[],i=(l,c)=>{const u=r[r.length-1];u&&u.clase===c&&c==="normal"?u.texto+=l:r.push({texto:l,clase:c})};let s=0;for(;s<a.length;){const l=a[s];if(a.startsWith(n,s)){i(a.slice(s),"comentario");break}const c=t==="python"&&/[fFrRbB]/.test(l)&&/["']/.test(a[s+1]??"")?1:0,u=a[s+c];if(u==='"'||u==="'"||t==="js"&&u==="`"){let d=s+c+1;for(;d<a.length&&a[d]!==u;)d+=a[d]==="\\"?2:1;i(a.slice(s,d+1),"texto"),s=d+1;continue}if(/[0-9]/.test(l)&&!Mo.test(a[s-1]??" ")){const d=a.slice(s).match(/^\d+(\.\d+)?/);i(d[0],"numero"),s+=d[0].length;continue}if(_n.test(l)){let d=s;for(;d<a.length&&Mo.test(a[d]);)d++;const h=a.slice(s,d),m=a.slice(d).trimStart()[0],b=t==="sql"?h.toUpperCase():h,$=o.has(b)?"palabra":e.has(b)?"propia":m==="("?"funcion":"normal";i(h,$),s=d;continue}i(l,"normal"),s+=1}return r}var $n={normal:"texto",palabra:"acento",texto:"exito",numero:"acento2",comentario:"suave",propia:"alerta",funcion:"texto"},_a=.6,It=ta({nombre:"codigo",predeterminados:{codigo:"",lenguaje:"python",ancho:700,tamano:26,interlineado:1.6,linea:1,marca:0,colorMarca:"acento",numeros:!0,titulo:"",relleno:"superficie",borde:"borde"},colores:["colorMarca","relleno","borde"],crear(a){return{grupo:a,clave:"",lineas:[]}},actualizar(a,t){const o=Ot(t),{arriba:e,izq:n,alto:r,altoLinea:i,xCodigo:s}=o,l=`${t.lenguaje}|${t.tamano}|${t.ancho}|${t.titulo}|${t.numeros}|${t.codigo}`;a.clave!==l&&(a.grupo.replaceChildren(),a.fondo=f("rect",{},a.grupo),a.pestana=f("text",{"font-size":t.tamano*.75,"dominant-baseline":"central"},a.grupo),a.barra=f("rect",{},a.grupo),a.borde=f("rect",{},a.grupo),a.lineas=o.lineas.map((h,m)=>{const b=e+o.encabezado+(m+.5)*i+o.margen,$=f("text",{x:n+16+2*t.tamano*_a,y:b,"text-anchor":"end","dominant-baseline":"central","font-size":t.tamano*.8,fill:"var(--ma-suave)","font-family":"var(--ma-fuente-mono)",visibility:t.numeros?null:"hidden"},a.grupo);X($,String(m+1));const g=f("text",{x:s,y:b,"dominant-baseline":"central","font-size":t.tamano,"font-family":"var(--ma-fuente-mono)",style:"white-space: pre"},a.grupo);for(const x of zn(h,t.lenguaje)){const p=f("tspan",{fill:S($n[x.clase]),"font-weight":x.clase==="palabra"||x.clase==="funcion"?700:null},g);X(p,x.texto)}return{numero:$,texto:g}}),a.clave=l),w(a.fondo,{x:n,y:e,width:t.ancho,height:r,rx:14,fill:S(t.relleno),stroke:S(t.borde),"stroke-width":2}),w(a.pestana,{x:n+20,y:e+o.encabezado/2,fill:"var(--ma-suave)","font-family":"var(--ma-fuente-mono)",visibility:t.titulo?null:"hidden"}),X(a.pestana,t.titulo);const c=o.lineas.length,u=e+o.encabezado+o.margen+(fa(t.linea,1,Math.max(c,1))-1)*i,d=fa(t.marca,0,1);w(a.barra,{x:n+2,y:u,width:t.ancho-4,height:i,fill:`color-mix(in srgb, ${S(t.colorMarca)} 20%, transparent)`,opacity:d,visibility:d>0?null:"hidden"}),w(a.borde,{x:n+2,y:u,width:7,height:i,fill:S(t.colorMarca),opacity:d,visibility:d>0?null:"hidden"})},tamano(a){const t=Ot(a);return{ancho:a.ancho,alto:t.alto}}});function Ot(a){const t=String(a.codigo).replace(/\n$/,"").split(`
`),o=a.tamano*a.interlineado,e=a.titulo?a.tamano*1.6:0,n=a.tamano*.5,r=e+2*n+t.length*o,i=-a.ancho/2,s=i+16+(a.numeros?2*a.tamano*_a+a.tamano*.9:8);return{lineas:t,altoLinea:o,encabezado:e,margen:n,alto:r,arriba:-r/2,izq:i,xCodigo:s}}function ir(a,t){const o="props"in a?a.props:a,e=Ot(o);return{x:o.x,y:o.y+e.arriba+e.encabezado+e.margen+(t-.5)*e.altoLinea,ancho:o.ancho,alto:e.altoLinea}}function Tt({ancho:a,tamano:t,numeros:o=!0}){const e=16+(o?2*t*_a+t*.9:8)+16;return Math.floor((a-e)/(t*_a))}var En=ta({nombre:"variable",predeterminados:{nombre:"x",valor:"",tipoDato:"",ancho:220,alto:80,tamano:30,relleno:"superficie",borde:"acento",destello:0},colores:["relleno","borde"],crear(a){return{nombre:f("text",{"dominant-baseline":"central","font-family":"var(--ma-fuente-mono)","font-weight":700},a),tipo:f("text",{"text-anchor":"end","dominant-baseline":"central","font-family":"var(--ma-fuente-mono)"},a),caja:f("rect",{},a),destello:f("rect",{fill:"var(--ma-acento)"},a),valor:f("text",{"text-anchor":"middle","dominant-baseline":"central","font-family":"var(--ma-fuente-mono)"},a)}},actualizar(a,t){const o=t.ancho,e=t.alto,n=t.tamano*.75;w(a.nombre,{x:-o/2+4,y:-e/2-n*.8,"font-size":n,fill:"var(--ma-texto)"}),X(a.nombre,t.nombre),w(a.tipo,{x:o/2-4,y:-e/2-n*.8,"font-size":n*.85,fill:"var(--ma-suave)",visibility:t.tipoDato?null:"hidden"}),X(a.tipo,t.tipoDato),w(a.caja,{x:-o/2,y:-e/2,width:o,height:e,rx:10,fill:S(t.relleno),stroke:S(t.borde),"stroke-width":3}),w(a.destello,{x:-o/2,y:-e/2,width:o,height:e,rx:10,opacity:t.destello*.3,visibility:t.destello>0?null:"hidden"});const r=Array.from(String(t.valor)).length||1,i=Math.min(t.tamano,(o-24)/(r*_a));w(a.valor,{"font-size":i,fill:"var(--ma-texto)"}),X(a.valor,String(t.valor))},tamano:a=>({ancho:a.ancho,alto:a.alto})}),Mn=ta({nombre:"lista",predeterminados:{nombre:"",items:[],celda:90,alto:76,tamano:28,senalar:-1,puntero:"",indices:!0,relleno:"superficie",borde:"acento",destello:0},colores:["relleno","borde"],crear(a){return{grupo:a,forma:-1,nombre:f("text",{"dominant-baseline":"central","font-family":"var(--ma-fuente-mono)","font-weight":700},a),celdas:f("g",{},a),flecha:f("g",{},a)}},actualizar(a,t){const o=t.items.length,e=Math.max(o,1)*t.celda,n=-e/2,r=t.alto,i=t.tamano*.75;w(a.nombre,{x:n+4,y:-r/2-i*.8,"font-size":i,fill:"var(--ma-texto)"}),X(a.nombre,t.nombre),a.forma!==o&&(a.celdas.replaceChildren(),a.filas=Array.from({length:o},()=>({caja:f("rect",{},a.celdas),valor:f("text",{"text-anchor":"middle","dominant-baseline":"central","font-family":"var(--ma-fuente-mono)"},a.celdas),indice:f("text",{"text-anchor":"middle","dominant-baseline":"central","font-family":"var(--ma-fuente-mono)"},a.celdas)})),a.vacia=f("rect",{"stroke-dasharray":"8 6",fill:"none"},a.celdas),a.forma=o),w(a.vacia,{x:n,y:-r/2,width:e,height:r,rx:8,stroke:S(t.borde),"stroke-width":2,visibility:o===0?null:"hidden"});const s=Math.round(t.senalar);a.filas.forEach((d,h)=>{const m=n+h*t.celda,b=h===s;w(d.caja,{x:m,y:-r/2,width:t.celda,height:r,fill:b?`color-mix(in srgb, ${S(t.borde)} 22%, ${S(t.relleno)})`:S(t.relleno),stroke:S(t.borde),"stroke-width":3});const $=String(t.items[h]),g=Math.min(t.tamano,(t.celda-12)/(Array.from($).length*_a));w(d.valor,{x:m+t.celda/2,y:0,"font-size":g,fill:"var(--ma-texto)","font-weight":b?700:400}),X(d.valor,$),w(d.indice,{x:m+t.celda/2,y:r/2+t.tamano*.55,"font-size":t.tamano*.6,fill:"var(--ma-suave)",visibility:t.indices?null:"hidden"}),X(d.indice,String(h))});const l=t.senalar>=0&&o>0,c=n+(Math.min(Math.max(t.senalar,0),o-1)+.5)*t.celda,u=r/2+t.tamano*1.1;a.punta||(a.punta=f("path",{},a.flecha),a.etiqueta=f("text",{"text-anchor":"middle","dominant-baseline":"central","font-family":"var(--ma-fuente-mono)","font-weight":700},a.flecha)),w(a.flecha,{transform:`translate(${Math.round(c*100)/100} ${u})`,visibility:l?null:"hidden"}),w(a.punta,{d:"M0 0 L-12 18 L12 18 Z",fill:S(t.borde)}),w(a.etiqueta,{y:18+t.tamano*.6,"font-size":t.tamano*.75,fill:S(t.borde),visibility:t.puntero?null:"hidden"}),X(a.etiqueta,t.puntero)},tamano:a=>({ancho:Math.max(a.items.length,1)*a.celda,alto:a.alto})}),wn=ta({nombre:"consola",predeterminados:{salida:"",ancho:700,renglones:4,tamano:24,titulo:"Salida",relleno:"#0f141b",color:"#e8ebf0"},colores:["relleno","color"],crear(a){return{fondo:f("rect",{},a),titulo:f("text",{"dominant-baseline":"central","font-family":"var(--ma-fuente-mono)"},a),texto:f("text",{"font-family":"var(--ma-fuente-mono)","dominant-baseline":"central",style:"white-space: pre"},a),lineas:[]}},actualizar(a,t){const{alto:o,altoLinea:e,encabezado:n}=wo(t),r=-t.ancho/2,i=-o/2;w(a.fondo,{x:r,y:i,width:t.ancho,height:o,rx:12,fill:S(t.relleno),stroke:"var(--ma-borde)","stroke-width":2}),w(a.titulo,{x:r+18,y:i+n/2,"font-size":t.tamano*.7,fill:"#8b95a5"}),X(a.titulo,t.titulo);const s=String(t.salida).replace(/\n$/,"").split(`
`),l=t.salida===""?[]:s.slice(-t.renglones);for(;a.lineas.length<t.renglones;)a.lineas.push(f("tspan",{},a.texto));a.lineas.forEach((c,u)=>{w(c,{x:r+18,y:i+n+(u+.5)*e+6}),X(c,l[u]??"")}),w(a.texto,{"font-size":t.tamano,fill:S(t.color)})},tamano(a){return{ancho:a.ancho,alto:wo(a).alto}}});function wo(a){const t=a.tamano*1.45,o=a.tamano*1.4;return{altoLinea:t,encabezado:o,alto:o+a.renglones*t+12}}var jn=ta({nombre:"pila",predeterminados:{marcos:[],ancho:460,tamano:24,titulo:"Llamadas",relleno:"superficie",borde:"acento2",destello:0},colores:["relleno","borde"],crear(a){return{titulo:f("text",{"dominant-baseline":"central","font-weight":700},a),cuerpo:f("g",{},a),clave:""}},actualizar(a,t){const{altoFila:o,encabezado:e,separacion:n}=jo(t),r=-t.ancho/2;w(a.titulo,{x:r+4,y:-t.tamano*.6,"font-size":t.tamano*.8,fill:"var(--ma-suave)",visibility:t.titulo&&t.marcos.length?null:"hidden"}),X(a.titulo,t.titulo);const i=JSON.stringify(t.marcos);if(a.clave!==i){a.cuerpo.replaceChildren(),a.actual=null;const s=[...t.marcos].reverse();let l=0;s.forEach((c,u)=>{const d=u===0,h=[...c.filas];c.retorno!==void 0&&h.push(["↩ devuelve",c.retorno]);const m=e+Math.max(h.length,1)*o+10,b=f("g",{transform:`translate(0 ${l})`,opacity:d?1:.62},a.cuerpo);f("rect",{x:r,y:0,width:t.ancho,height:m,rx:10,fill:S(t.relleno),stroke:d?S(t.borde):"var(--ma-borde)","stroke-width":d?3:2},b),f("rect",{x:r,y:0,width:t.ancho,height:e,rx:10,fill:`color-mix(in srgb, ${S(t.borde)} ${d?24:10}%, transparent)`},b);const $=f("text",{x:r+14,y:e/2,"dominant-baseline":"central","font-weight":700,"font-family":"var(--ma-fuente-mono)","font-size":t.tamano,fill:"var(--ma-texto)"},b);if(X($,`${c.funcion}()`),h.length===0){const g=f("text",{x:r+14,y:e+o/2,"dominant-baseline":"central","font-size":t.tamano*.8,fill:"var(--ma-suave)"},b);X(g,"sin variables todavía")}h.forEach(([g,x],p)=>{const z=e+(p+.5)*o+4,A=g==="↩ devuelve",E=A?"var(--ma-exito)":"var(--ma-texto)",T=f("text",{x:r+18,y:z,"dominant-baseline":"central","font-family":"var(--ma-fuente-mono)","font-size":t.tamano*.9,fill:A?E:"var(--ma-suave)","font-weight":A?700:400},b);X(T,g);const v=t.ancho*.58-18,q=Math.min(t.tamano*.9,v/(Math.max(String(x).length,1)*_a)),O=f("text",{x:r+t.ancho-16,y:z,"text-anchor":"end","dominant-baseline":"central","font-family":"var(--ma-fuente-mono)","font-size":q,fill:E,"font-weight":700},b);X(O,String(x))}),d&&(a.actual=f("rect",{x:r,y:0,width:t.ancho,height:m,rx:10,fill:"var(--ma-acento2)"},b)),l+=m+n}),a.clave=i}a.actual&&w(a.actual,{opacity:t.destello*.25,visibility:t.destello>0?null:"hidden"})},tamano(a){const{altoFila:t,encabezado:o,separacion:e}=jo(a),n=a.marcos.reduce((r,i)=>r+o+Math.max(i.filas.length+(i.retorno!==void 0?1:0),1)*t+10+e,0);return{ancho:a.ancho,alto:n}}});function jo(a){return{altoFila:a.tamano*1.5,encabezado:a.tamano*1.75,separacion:a.tamano*.5}}var An=28;function na(a,t=An){return a.length>t?`${a.slice(0,t-1)}…`:a}function Ho(a){return a.atributos?"el mismo objeto":a.tipo==="dict"?"el mismo diccionario":"la misma lista"}function Cn(a,t,o){const e=t.ref!==void 0&&Object.entries(o).find(([r,i])=>r!==a&&i.ref===t.ref);if(e)return`${a} no es una copia: es ${Ho(t)} que ${e[0]}.`;const n=t.ref!==void 0&&Object.entries(o).find(([r,i])=>r!==a&&i.ref!==void 0&&i.ref!==t.ref&&i.repr===t.repr);if(n)return`${a} es una copia: tiene lo mismo que ${n[0]}, pero es otra ${t.atributos?"cosa":"lista"}.`;if(t.atributos)return`${a} es un objeto ${t.tipo}.`;if(t.items){const r=t.items.length,i=t.tipo==="tuple"?"una tupla":"una lista";return r===0?`${a} es ${i} vacía.`:`${a} es ${i} con ${r} ${r===1?"elemento":"elementos"}.`}if(t.tipo==="dict"){const r=t.pares?.length??0;return r===0?`${a} es un diccionario vacío.`:`${a} es un diccionario con ${r} ${r===1?"clave":"claves"}.`}return`${a} vale ${na(t.repr)}.`}function Ao(a,t,o){if(o.atributos&&t.atributos){const e=Object.fromEntries(t.atributos),n=o.atributos.find(([r,i])=>e[r]!==i);if(n)return n[0]in e?`${a}.${n[0]} pasa de ${na(e[n[0]])} a ${na(n[1])}.`:`${a} tiene un atributo nuevo: ${n[0]} vale ${na(n[1])}.`}if(o.items&&t.items)return o.items.length===t.items.length+1?`Se agregó ${na(o.items.at(-1))} a la lista ${a}.`:o.items.length===t.items.length-1?`${a} ahora tiene un elemento menos.`:`${a} cambió: ahora es ${na(o.repr)}.`;if(o.tipo==="dict"&&t.tipo==="dict"){const e=(o.pares??[]).filter(([n])=>!(t.pares??[]).some(([r])=>r===n));return e.length===1?`Se agregó la clave ${na(e[0][0])} a ${a}.`:`${a} cambió.`}return`${a} pasa de ${na(t.repr)} a ${na(o.repr)}.`}function qn(a,t){return a.repr!==t.repr||JSON.stringify(a.atributos)!==JSON.stringify(t.atributos)}function yt(a,t,o){const e=[],n=[];for(const[i,s]of Object.entries(t)){const l=a[i];i===o&&l?.repr!==s.repr?e.push(l?`Otra vuelta del for: ${i} vale ${na(s.repr)}.`:`El for toma el primer elemento: ${i} vale ${na(s.repr)}.`):l?qn(l,s)&&n.push({nombre:i,previa:l,v:s}):e.push(Cn(i,s,t))}const r=new Set;for(const i of n){if(r.has(i.nombre))continue;const s=n.filter(l=>l.v.ref!==void 0&&l.v.ref===i.v.ref);if(s.length>1){s.forEach(c=>r.add(c.nombre));const l=s.map(c=>c.nombre);e.push(`${Ao(i.nombre,i.previa,i.v)} Y también ${l.slice(1).join(" y ")}: son ${Ho(i.v)}.`)}else e.push(Ao(i.nombre,i.previa,i.v))}return e}function Sn(a,t,o){const e=a[t];if(t===0)return"Arranca el programa, por la primera línea.";const n=a[t-1];if(e.excepcion){const{tipo:u,mensaje:d}=e.excepcion;return`Se corta con un error en la línea ${e.linea}: ${u}${d?` (${d})`:""}.`}const r=e.pila??[],i=n.pila??[];if(e.retorno){const{funcion:u,valor:d}=e.retorno,h=r.length&&r.length===i.length?yt(i[i.length-1].variables,r[r.length-1].variables,null).slice(0,1):[],m=u==="__init__"?"Termina __init__: el objeto queda armado.":d==="None"?`${u} termina (no devuelve nada).`:`${u} termina y devuelve ${na(d)}.`;return[...h,m].join(" ")}if(r.length>i.length){const u=r[r.length-1],d=Object.entries(u.variables),h=d.find(([p])=>p==="self"),m=d.filter(([p])=>p!=="self"),b=m.length?` Adentro, ${m.map(([p,z])=>`${p} vale ${na(z.repr)}`).join(" y ")}.`:"";if(u.funcion==="__init__")return`Se crea un objeto nuevo y se ejecuta __init__.${b}`;const $=`${u.funcion}(${m.map(([,p])=>na(p.repr)).join(", ")})`,g=i.length&&i[i.length-1].funcion===u.funcion?": la función se llama a sí misma":"",x=h?` sobre ${na(h[1].repr)}`:"";return`Se llama a ${$}${x}${g}.${b}`}const s=(o[n.linea-1]??"").trim().match(/^for\s+([A-Za-z_]\w*)\s+in\b/)?.[1],l=[];r.length&&r.length===i.length&&l.push(...yt(i[i.length-1].variables,r[r.length-1].variables,s)),l.push(...yt(n.variables??{},e.variables??{},s));const c=(e.salida??"").slice((n.salida??"").length).replace(/\n$/,"");if(c&&l.push(`Se muestra: ${na(c.split(`
`).at(-1),60)}`),l.length===0){const u=(o[n.linea-1]??"").trim(),d=u.match(/^def\s+([A-Za-z_]\w*)/);if(d)return`Se define la función ${d[1]}: todavía no se ejecuta, queda guardada para cuando se la llame.`;const h=u.match(/^class\s+([A-Za-z_]\w*)/);if(h)return`Se define la clase ${h[1]}: es el molde, todavía no hay ningún objeto.`;if(r.length<i.length)return"Vuelve a donde se había llamado a la función.";if(/^(for|while)\b/.test(u)&&e.linea===n.linea+1)return"Entra al bucle.";if(/^for\b/.test(u))return"No quedan elementos: termina el for.";if(/^while\b/.test(u))return"La condición del while ya no se cumple: sale del bucle.";if(/^(if|elif)\b/.test(u))return e.linea===n.linea+1?"La condición se cumple: entra.":"La condición no se cumple: la saltea.";if(/^else\b/.test(u))return"Entra por el else.";const m=(o[e.linea-1]??"").trim();if(e.linea>0&&e.linea<n.linea&&/^(for|while)\b/.test(m))return"Vuelve al principio del bucle."}return e.linea===0&&l.push("Terminó el programa."),l.slice(0,2).join(" ")||`Sigue en la línea ${e.linea}.`}function Ln(a){const t={},o=new Set(a.flatMap(e=>Object.keys(e.variables??{})));for(const e of o)for(const n of o){if(n===e||Object.values(t).includes(n))continue;let r=-1,i=null,s=0,l=!1;for(const c of a){const u=c.variables?.[e],d=c.variables?.[n];if(!u?.items||!d||d.repr===i)continue;i=d.repr;const h=u.items.indexOf(d.repr,r+1);if(h===-1){l=!0;break}r=h,s+=1}!l&&s>=2&&!t[e]&&(t[e]=n)}return t}function kn(a){return a.atributos?"objeto":a.tipo==="dict"?"dict":a.items?"lista":"valor"}function On(a){return a.atributos?"el mismo objeto":a.tipo==="dict"?"el mismo diccionario":a.tipo==="set"?"el mismo conjunto":"la misma lista"}function sr(a){const{traza:t,lenguaje:o="python",titulo:e="",descripcion:n="",archivo:r="",ritmo:i=1.4,lectura:s=13,explicaciones:l={},preguntas:c={},capitulos:u={},explicar:d=!1,lupa:h=!1,lupaDebajoDe:m=null,contexto:b=3,alto:$=null,lineaGrande:g=!1}=a,x=a.punteros==="auto"?Ln(a.traza??[]):a.punteros??{},p=String(a.codigo).replace(/\s+$/,"");if(!Array.isArray(t)||t.length===0)throw new Error("La traza tiene que ser una lista de pasos, y no puede estar vacía.");const z=[],A=new Set,E={};let T=0;for(const H of t)for(const[y,k]of Object.entries(H.variables??{})){const D=k.atributos??(k.tipo==="dict"?k.pares:null);D&&(E[y]=Math.max(E[y]??0,D.length)),k.items&&(T=Math.max(T,k.items.length)),!A.has(y)&&(A.add(y),z.push({nombre:y,clase:kn(k),primera:k}))}const v=t.some(H=>H.salida),q=t.some(H=>H.excepcion),O=t.some(H=>H.pila?.length),L=g?!1:h,C=$==="auto",M=t.filter(H=>H.excepcion).map(({excepcion:{tipo:H,mensaje:y}})=>`🚨 ${H}${y?`: ${y}`:""}`),N=new Set,R=new Map;for(const H of t){const y=new Map,k=(D,F,V)=>{F.ref!==void 0&&(y.has(F.ref)||y.set(F.ref,[]),y.get(F.ref).push({nombre:D,global:V,v:F}))};for(const[D,F]of Object.entries(H.variables??{}))k(D,F,!0);for(const D of H.pila??[])for(const[F,V]of Object.entries(D.variables))k(F,V,!1);for(const[D,F]of y){if(F.length<2)continue;N.add(D);const V=F.filter(I=>I.global);for(let I=1;I<V.length;I++){const oa=`${V[0].nombre}|${V[I].nombre}`;R.has(oa)||R.set(oa,{a:V[0].nombre,b:V[I].nombre,que:On(V[0].v)})}}}const G=(H,y)=>y?.ref!==void 0&&N.has(y.ref)?`${H} · #${y.ref}`:H;return function(H){const y=H.nombre==="angosta",k=H.nombre==="media",D=y?640:k?1200:1600;let F=typeof $=="number"?$:y?1140:900;const V=e?100:30,I=y?{x:320,ancho:610,tamano:22}:k?{x:345,ancho:650,tamano:36}:{x:440,ancho:820,tamano:36},oa=Math.max(...p.split(`
`).map(j=>j.length));I.tamano=Math.min(I.tamano,I.tamano*Tt(I)/oa);const Zo=I.tamano,Xo=p.split(`
`).length,Go=y?F*.42:F-V-30-(v?230:0);I.tamano=Math.min(I.tamano,Go/(Xo*1.6+(r?2.6:1)));const Ia=It({x:I.x,y:0,ancho:I.ancho,tamano:I.tamano,codigo:p,lenguaje:o,titulo:r,linea:t[0].linea||1,marca:0}),ba=Ia.tipo.tamano(Ia.props).alto;Ia.props.y=V+ba/2;const J={};e&&(J.titulo=ja({x:D/2,y:y?50:52,texto:e,tamano:y?32:40,peso:800,anchoMax:D-40})),J.codigo=Ia;const Wa=y?{x:320,ancho:610,renglones:3,tamano:20}:{x:I.x,ancho:I.ancho,renglones:3,tamano:30},za=wn({...Wa,opacidad:0}),Ca=za.tipo.tamano(za.props).alto;za.props.y=y?F-20-Ca/2:V+ba+40+Ca/2,v&&(J.consola=za);const lt=y?24:34,Ta=q?Math.max(y?80:96,40+lt*1.2*Math.max(...M.map(j=>Xa(j,Math.floor((Wa.ancho-32)/(lt*Aa))).length))):0;if(q){const j=v?za.props.y+Ca/2:V+ba,P=y&&!C?za.props.y-Ca/2-30-Ta/2:j+30+Ta/2;J.error=qt({x:Wa.x,y:P,ancho:Wa.ancho,alto:Ta,texto:"",tamano:lt,relleno:"superficie",borde:"error",color:"error",opacidad:0})}const pa=y?{x:320,ancho:560,y:V+ba+70}:k?{x:925,ancho:500,y:V+50}:{x:1250,ancho:620,y:V+50};let xa=pa.y;const Ra={};for(const j of z){const P="var_"+j.nombre;if(Ra[j.nombre]=P,j.clase==="lista"){const B=Math.min(y?84:120,pa.ancho/Math.max(T,1)),W=y?68:96;J[P]=Mn({x:pa.x,y:xa+W/2,nombre:G(j.nombre,j.primera),celda:B,alto:W,tamano:y?26:36,puntero:Object.entries(x).find(([K])=>K===j.nombre)?.[1]??"",opacidad:0}),xa+=W+(y?115:160)}else if(j.clase==="dict"||j.clase==="objeto"){const B=y?44:56,W=E[j.nombre]??0,K=j.clase==="objeto"?[j.nombre,G(j.primera.tipo,j.primera).replace(" · "," ")]:[`${j.nombre}: clave`,G("valor",j.primera)];J[P]=St({x:pa.x,y:xa+(W+1)*B/2,ancho:Math.min(pa.ancho,480),columnas:K,filas:[],altoFila:B,tamano:y?24:30,opacidad:0,encabezado:j.clase==="objeto"?"acento2":"acento"}),xa+=(W+1)*B+80}else{const B=y?68:96;J[P]=En({x:pa.x,y:xa+B/2,nombre:j.nombre,ancho:Math.min(pa.ancho,y?320:420),alto:B,tamano:y?28:38,opacidad:0}),xa+=B+(y?72:100)}}if(O&&(J.pila=jn({x:pa.x,y:xa-(y?10:20),ancho:Math.min(pa.ancho,y?560:600),tamano:y?22:k?25:32})),y&&C){const j=Math.max(V+ba,xa-40)+40;za.props.y=j+Ca/2,J.error&&(J.error.props.y=(v?za.props.y+Ca/2:j)+30+Ta/2)}const Rt=j=>({pieza:j,lado:"izquierda",dx:-12});for(const[j,P]of R)J["alias_"+j.replace("|","_")]=mn({desde:Rt(Ra[P.a]),hasta:Rt(Ra[P.b]),progreso:0,curvatura:.45,separacion:0,color:"acento2",etiqueta:P.que,tamanoEtiqueta:y?18:22,colorEtiqueta:"acento2",ladoEtiqueta:-1,girarEtiqueta:!0});if(Object.assign(J,a.piezas?.(H,{W:D,H:F,col:pa,y:xa})??{}),!y&&!O&&!C){let j=1/0,P=-1/0;for(const[W,K]of Object.entries(J)){if(W==="titulo")continue;const $a=K.tipo.tamano?.(K.props).alto??K.props.tamano??0;j=Math.min(j,K.props.y-$a/2-40),P=Math.max(P,K.props.y+$a/2+40)}const B=Math.max(0,(V+F)/2-(j+P)/2);for(const[W,K]of Object.entries(J))W!=="titulo"&&(K.props.y+=B)}if(J.error&&!C){const j=J.error.props;j.y=Math.min(j.y,F-20-Ta/2)}const Wo=(j,P)=>{if(j==="pila"){let W=0;for(const K of t){const $a=(K.pila??[]).map(da=>({funcion:da.funcion,filas:Object.entries(da.variables),retorno:K.retorno?1:void 0}));W=Math.max(W,P.tipo.tamano({...P.props,marcos:$a}).alto)}return P.props.y+W}const B=P.tipo.tamano?.(P.props).alto??P.props.alto??P.props.tamano??0;return P.props.y+B/2+(j.startsWith("var_")?40:0)};if(C){let j=V+100;for(const[P,B]of Object.entries(J))P==="titulo"||P.startsWith("alias_")||P==="consola"&&!v||(j=Math.max(j,Wo(P,B)));F=Math.ceil(j+30)}const ct=typeof L=="object"&&L?L:{},Bt=L===!0?1.8:typeof L=="object"&&L?L.zoom??1.8:Number(L)||0,Jo=Bt>1&&(m==null||(H.ancho??1/0)<m),ea=Ia.props,ut=ea.tamano*ea.interlineado,Vt=ea.x-ea.ancho/2,Ut=16+2*ea.tamano*_a+ea.tamano*.9+oa*ea.tamano*_a+16,Ba=Jo?Math.min(Bt,ea.ancho/Ut,Zo/ea.tamano*1.15):1,Ja=ea.y-ba/2,qa=j=>Ja+(r?ea.tamano*1.6:0)+ea.tamano*.5+(j-.5)*ut;let Qa=null;if(g){const j=typeof g=="object"?g.zoom:void 0,P=D-(y?30:80),B=Math.min(j??1/0,P/Ut,4),W=ut*B+16,K=F+10+W/2;F=Math.ceil(K+W/2+24),Qa={zoom:B},J.lineaGrande=bn({x:D/2,y:K,ancho:P,alto:W,zoom:B,fuente:"codigo",mirarX:Vt+P/(2*B),mirarY:qa(t[0].linea||1),forma:"rect",radio:12,aro:2,colorAro:"borde",fondo:"superficie",marco:!0,colorMarco:"acento",arrastrable:!1,opacidad:0})}const Sa=ba/(2*Ba),Ht=j=>Math.min(Math.max(j,Ja+Sa),Ja+ba-Sa);let La=Ht(Ja);if(Ba>1.05){const j={};for(const[P,B]of Object.entries(J))P==="codigo"&&(j.lupa=fn({x:ea.x,y:ea.y,ancho:ea.ancho+6,alto:ba+6,zoom:Ba,mirarX:Vt+ea.ancho/(2*Ba),mirarY:La,forma:ct.forma??"rect",radio:ct.radio??16,aro:ct.aro??2,colorAro:"borde",fondo:"superficie"}),B.props.dentro="lupa"),j[P]=B;for(const P of Object.keys(J))delete J[P];Object.assign(J,j)}const Qo=j=>{if(Ba<=1.05||!(j>0))return null;const P=(b+.5)*ut;let B=La;return qa(j)-P<La-Sa&&(B=qa(j)-P+Sa),qa(j)+P>La+Sa&&(B=qa(j)+P-Sa),B=Ht(B),Math.abs(B-La)<.5?null:(La=B,B)},Y=[{pieza:"codigo",a:{marca:1},dur:.4,en:.2}];Qa&&Y.push({pieza:"lineaGrande",a:{opacidad:1},dur:.4,en:.2});const Va={},dt={};let Z=.7,mt="",ht="",Yt="[]",Zt=!1;const Xt={},Ko=p.split(`
`);return t.forEach((j,P)=>{u[P]&&Y.push({capitulo:u[P],en:Z});const B=j.variables??{};for(const[U,Q]of Object.entries(B)){const aa=Ra[U],ra=Va[U];if(ra&&ra.repr===Q.repr&&JSON.stringify(ra.atributos)===JSON.stringify(Q.atributos))continue;ra||Y.push({pieza:aa,a:{opacidad:1},dur:.4,en:Z});const ca=z.find(ga=>ga.nombre===U).clase;ca==="lista"?Y.push({pieza:aa,a:{items:Q.items},dur:0,en:Z}):ca==="dict"?Y.push({pieza:aa,a:{filas:Q.pares??[]},dur:0,en:Z}):ca==="objeto"?Y.push({pieza:aa,a:{filas:Q.atributos??[]},dur:0,en:Z}):Y.push({pieza:aa,a:{valor:Q.repr,tipoDato:Q.tipo??""},dur:0,en:Z}),ra&&(ca==="lista"||ca==="valor")&&(Y.push({pieza:aa,a:{destello:1},dur:.12,en:Z,curva:"lineal"}),Y.push({pieza:aa,a:{destello:0},dur:.8,en:Z+.12,curva:"salir"}))}for(const[U,Q]of Object.entries(x)){const aa=B[U],ra=B[Q];if(!aa?.items||!ra||Va[Q]?.repr===ra.repr)continue;const ca=(dt[U]??-1)+1;let ga=aa.items.indexOf(ra.repr,ca);if(ga===-1&&(ga=aa.items.indexOf(ra.repr)),ga===-1)continue;const ae=dt[U]===void 0;Y.push({pieza:Ra[U],a:{senalar:ga},dur:ae?0:.4,en:Z}),dt[U]=ga}for(const U of Object.keys(Va))U in B||delete Va[U];if(Object.assign(Va,B),O){const U=(j.pila??[]).map(ra=>({funcion:ra.funcion,filas:Object.entries(ra.variables).map(([ca,ga])=>[ca,ga.repr])}));j.retorno&&U.length&&(U[U.length-1].retorno=j.retorno.valor);const Q=JSON.stringify(U);Q!==Yt&&(Y.push({pieza:"pila",a:{marcos:U},dur:0,en:Z}),Y.push({pieza:"pila",a:{destello:1},dur:.12,en:Z,curva:"lineal"}),Y.push({pieza:"pila",a:{destello:0},dur:.8,en:Z+.12,curva:"salir"}),Yt=Q);const aa=U.length>0;aa!==Zt&&!j.excepcion&&(Y.push({pieza:"codigo",a:{colorMarca:aa?"acento2":"acento"},dur:.3,en:Z+.45}),Zt=aa)}for(const[U,Q]of R){const aa=B[Q.a],ra=B[Q.b],ca=aa?.ref!==void 0&&aa.ref===ra?.ref;ca!==!!Xt[U]&&(Y.push({pieza:"alias_"+U.replace("|","_"),a:{progreso:ca?1:0},dur:.6,en:Z+.2}),Xt[U]=ca)}if(v&&(j.salida??"")!==mt&&(mt||Y.push({pieza:"consola",a:{opacidad:1},dur:.3,en:Z}),Y.push({pieza:"consola",a:{salida:j.salida??""},dur:0,en:Z}),mt=j.salida??""),j.excepcion){const{tipo:U,mensaje:Q}=j.excepcion;Y.push({pieza:"codigo",a:{colorMarca:"error"},dur:.3,en:Z}),Y.push({pieza:"error",a:{texto:`🚨 ${U}${Q?`: ${Q}`:""}`},dur:0,en:Z}),Y.push({pieza:"error",a:{opacidad:1},dur:.4,en:Z+.2})}for(const U of j.animar??[])Y.push({...U,en:Z+(typeof U.en=="number"?U.en:0)});if(j.linea>0){Y.push({pieza:"codigo",a:{linea:j.linea,marca:1},dur:P===0?0:.35,en:Z+.45});const U=Qo(j.linea);U!=null&&Y.push({pieza:"lupa",a:{mirarY:U},dur:P===0?0:.6,en:Z+.4}),Qa&&Y.push({pieza:"lineaGrande",a:{mirarY:qa(j.linea)},dur:P===0?0:.35,en:Z+.45})}else j.excepcion||(Y.push({pieza:"codigo",a:{marca:0},dur:.4,en:Z+.45}),Qa&&Y.push({pieza:"lineaGrande",a:{opacidad:.4},dur:.4,en:Z+.45}));let W=Math.max(i,.9);const K=l[P]??(d?Sn(t,P,Ko):void 0),$a=[ht,K].filter(Boolean).join(" ");if(ht="",$a){const U=Math.max(i,ya($a,s));Y.push({subtitulo:$a,en:Z,dur:U}),W=Math.max(W,U+.3)}const da=c[P];if(da){const U=`${da.pregunta} Pausá y pensalo.`,Q=Math.max(da.dur??4,ya(U,s)+1.5);Y.push({marca:"pregunta",datos:da,en:Z+W,dur:Q}),Y.push({subtitulo:U,en:Z+W,dur:Q}),W+=Q,da.opciones&&da.correcta!==void 0&&(ht=`Respuesta: ${da.opciones[da.correcta]}. ${da.explicacion??""}`.trim())}Z+=W,Y.push({marca:"paso",datos:{indice:P},en:Z}),Z+=.1}),{titulo:e||"Un programa, paso a paso",descripcion:n,ancho:D,alto:F,lectura:s,pausaFinal:1.5,piezas:J,linea:Y}}}var Yo=`# -*- coding: utf-8 -*-
# El trazador: corre un programa de Python y anota cada paso que da.
#
# Este archivo es el ÚNICO lugar donde está. Lo usan:
#   - herramientas/trazar.py, desde la consola;
#   - el navegador, con Pyodide: herramientas/construir.js lo copia, tal cual,
#     a src/pedagogico/trazador-py.js (un test verifica que sean iguales).
#
# Cada paso es la línea que está por correr, con las variables como están en
# ese momento y todo lo que se mostró hasta ahí. Si el programa está adentro de
# una función, el paso trae también la PILA de llamadas: cada función que se
# está ejecutando, con sus variables. Usa sys.settrace, igual que la medición
# de pasos de la plataforma del curso.
#
# Las listas, los diccionarios y los objetos llevan un número ("ref"): el
# mismo número en dos variables quiere decir que son LA MISMA lista, no dos
# iguales. Es lo que hace falta para entender por qué cambiar una "cambia la otra".
#
# Abajo de todo está _motor_probar(), que corre los tests (las funciones
# test_...) y anota cada assert: qué se esperaba y qué dio.

import ast
import io
import json
import sys
import types
import builtins
from contextlib import redirect_stdout

_ARCHIVO = "<programa>"
# Las funciones (no los cuerpos de las clases ni los <genexpr>) tienen esta
# marca en su código: son las que van a la pila de llamadas.
_CO_OPTIMIZADO = 0x1


class _Tope(Exception):
    pass


class _SinEntrada(Exception):
    pass


class _Describir:
    """Escribe valores para la escena, y les pone número a los que se comparten.

    Los números van en orden de aparición (1, 2, 3...) y no son el id() de
    Python: el id cambia de una corrida a otra, y la animación tiene que salir
    igual cada vez. Los objetos se guardan en \`vivos\` para que Python no los
    borre y reuse su id con otro.
    """

    def __init__(self):
        self.numeros = {}
        self.vivos = []

    def ref(self, valor):
        clave = id(valor)
        if clave not in self.numeros:
            self.numeros[clave] = len(self.numeros) + 1
            self.vivos.append(valor)
        return self.numeros[clave]

    @staticmethod
    def es_objeto(valor):
        """Un objeto de una clase del programa (no un int, una lista, etc.)."""
        return type(valor).__module__ == "__main__" and hasattr(valor, "__dict__") and not isinstance(valor, type)

    def texto(self, valor, profundidad=0):
        """Cómo se escribe un valor, sin direcciones de memoria (que cambian
        en cada corrida): un objeto sin __repr__ propio se escribe Clase #n."""
        if self.es_objeto(valor):
            if type(valor).__repr__ is not object.__repr__:
                return repr(valor)
            return f"{type(valor).__name__} #{self.ref(valor)}"
        if profundidad > 3:
            return "…"
        if isinstance(valor, list):
            return "[" + ", ".join(self.texto(x, profundidad + 1) for x in valor) + "]"
        if isinstance(valor, tuple):
            interior = ", ".join(self.texto(x, profundidad + 1) for x in valor)
            return f"({interior},)" if len(valor) == 1 else f"({interior})"
        if isinstance(valor, dict):
            return "{" + ", ".join(f"{self.texto(k, profundidad + 1)}: {self.texto(v, profundidad + 1)}" for k, v in valor.items()) + "}"
        if isinstance(valor, set):
            return "{" + ", ".join(sorted(self.texto(x, profundidad + 1) for x in valor)) + "}" if valor else "set()"
        return repr(valor)

    def describir(self, valor):
        d = {"tipo": type(valor).__name__, "repr": self.texto(valor)}
        if isinstance(valor, (list, tuple)):
            d["items"] = [self.texto(x) for x in valor]
        elif isinstance(valor, dict):
            d["pares"] = [[self.texto(k), self.texto(v)] for k, v in valor.items()]
        elif self.es_objeto(valor):
            d["atributos"] = [[k, self.texto(v)] for k, v in vars(valor).items() if not k.startswith("__")]
        if isinstance(valor, (list, dict, set)) or self.es_objeto(valor):
            d["ref"] = self.ref(valor)
        return d

    def variables(self, espacio):
        """Las variables del programa, sin lo que pone Python por su cuenta."""
        return {
            nombre: self.describir(valor)
            for nombre, valor in list(espacio.items())
            if not nombre.startswith("__")
            and not isinstance(valor, (types.ModuleType, types.FunctionType, types.BuiltinFunctionType, type))
        }


def _es_del_programa(codigo):
    return codigo.co_filename == _ARCHIVO


def _es_funcion(codigo):
    return _es_del_programa(codigo) and bool(codigo.co_flags & _CO_OPTIMIZADO) and not codigo.co_name.startswith("<")


# Más llamadas que estas no entran en la pantalla, y una recursión sin caso
# base llegaría a cientos: la traza pesaría megas (y en el navegador, con
# Pyodide, se notaría). Se guardan las últimas, con un aviso de cuántas faltan.
_MAX_MARCOS = 10


def _pila(frame, d):
    """Las funciones que se están ejecutando, de la de más afuera a la actual."""
    funciones = []
    while frame is not None:
        if _es_funcion(frame.f_code):
            funciones.append(frame)
        frame = frame.f_back
    ocultas = max(len(funciones) - _MAX_MARCOS, 0)
    marcos = [{"funcion": f.f_code.co_name, "linea": f.f_lineno, "variables": d.variables(f.f_locals)}
              for f in reversed(funciones[:_MAX_MARCOS])]
    if ocultas:
        marcos.insert(0, {"funcion": f"… y {ocultas} llamadas más", "linea": 0, "variables": {}})
    return marcos


def _motor_trazar(codigo, max_pasos=400, entradas=()):
    """Devuelve la traza como texto JSON: {"codigo", "lenguaje", "traza"}.

    \`entradas\` son las respuestas para input(), en orden: un programa que
    pregunta algo no puede quedarse esperando a que alguien escriba.
    """
    pasos = []
    salida = io.StringIO()
    espacio = {"__name__": "__main__"}
    pendientes = list(entradas)
    d = _Describir()

    def entrada(mensaje=""):
        # Como en la consola: se ve la pregunta y lo que "escribió" el usuario.
        salida.write(str(mensaje))
        if not pendientes:
            raise _SinEntrada()
        valor = str(pendientes.pop(0))
        salida.write(valor + "\\n")
        return valor

    def anotar(frame, **extra):
        if len(pasos) >= max_pasos:
            raise _Tope()
        paso = {"linea": frame.f_lineno, "variables": d.variables(espacio), "salida": salida.getvalue()}
        pila = _pila(frame, d)
        if pila:
            paso["pila"] = pila
        paso.update(extra)
        pasos.append(paso)

    def local(frame, evento, arg):
        if evento == "line":
            anotar(frame)
        elif evento == "return" and _es_funcion(frame.f_code):
            # La función termina: se anota qué devuelve, mientras todavía está en la pila.
            anotar(frame, retorno={"funcion": frame.f_code.co_name, "valor": d.texto(arg)})
        return local

    def global_(frame, evento, arg):
        codigo_frame = frame.f_code
        if _es_del_programa(codigo_frame) and (codigo_frame.co_name == "<module>" or _es_funcion(codigo_frame)):
            return local
        return None

    def cortar(tipo, mensaje):
        ultimo = pasos[-1] if pasos else {"linea": 0}
        paso = {"linea": ultimo["linea"], "variables": d.variables(espacio), "salida": salida.getvalue(),
                "excepcion": {"tipo": tipo, "mensaje": mensaje}}
        if ultimo.get("pila"):
            paso["pila"] = ultimo["pila"]
        pasos.append(paso)

    try:
        compilado = compile(codigo, _ARCHIVO, "exec")
    except SyntaxError as e:
        return json.dumps({"codigo": codigo, "lenguaje": "python", "traza": [{
            "linea": e.lineno or 1, "variables": {}, "salida": "",
            "excepcion": {"tipo": "SyntaxError", "mensaje": e.msg},
        }]}, ensure_ascii=False)

    input_original = builtins.input
    builtins.input = entrada
    try:
        with redirect_stdout(salida):
            sys.settrace(global_)
            try:
                exec(compilado, espacio)
            finally:
                sys.settrace(None)
        pasos.append({"linea": 0, "variables": d.variables(espacio), "salida": salida.getvalue()})
    except _Tope:
        # Si la pila estaba llena, no era un bucle: era una función llamándose sin parar.
        recursiva = bool(pasos) and len(pasos[-1].get("pila", [])) > _MAX_MARCOS
        motivo = "la función se llama a sí misma sin parar: ¿falta el caso base?" if recursiva else "¿un bucle que no termina?"
        cortar("Corte", f"más de {max_pasos} pasos: {motivo}")
    except _SinEntrada:
        cortar("Falta una entrada", "el programa pidió un input() más de los que se cargaron")
    except RecursionError:
        cortar("RecursionError", "la función se llama a sí misma sin parar: ¿falta el caso base?")
    except Exception as e:
        cortar(type(e).__name__, repr(e.args[0]) if isinstance(e, KeyError) and e.args else str(e))
    finally:
        builtins.input = input_original
    return json.dumps({"codigo": codigo, "lenguaje": "python", "traza": pasos}, ensure_ascii=False)


# ---------------------------------------------------------------------------
# Los tests
# ---------------------------------------------------------------------------

class _Asserts(ast.NodeTransformer):
    """Cambia cada \`assert A == B\` por una llamada que anota A y B por separado.

    Así, cuando falla, se puede decir "esperaba 75 y dio 0", que es lo que
    hace falta para encontrar el error (un AssertionError pelado no dice nada).
    """

    def visit_Assert(self, nodo):
        prueba = nodo.test
        texto = ast.unparse(prueba)
        if isinstance(prueba, ast.Compare) and len(prueba.ops) == 1 and isinstance(prueba.ops[0], ast.Eq):
            izq, der = prueba.left, prueba.comparators[0]
        else:
            izq, der = prueba, ast.Constant(True)
        llamada = ast.Call(
            func=ast.Name("__motor_assert", ast.Load()),
            args=[
                ast.Lambda(ast.arguments([], [], None, [], [], None, []), izq),
                ast.Lambda(ast.arguments([], [], None, [], [], None, []), der),
                ast.Constant(texto),
                ast.Constant(nodo.lineno),
            ],
            keywords=[],
        )
        return ast.copy_location(ast.Expr(llamada), nodo)


class _FallaAssert(Exception):
    pass


def _motor_probar(codigo):
    """Corre el programa y después cada función test_..., en orden.

    Devuelve JSON: {"codigo", "tests": [{"nombre", "linea", "estado", "asserts": [...], "error"}]}.
    estado es "pasa", "falla" (un assert no se cumplió) o "error" (se rompió otra cosa).
    """
    try:
        arbol = ast.fix_missing_locations(_Asserts().visit(ast.parse(codigo)))
        compilado = compile(arbol, _ARCHIVO, "exec")
    except SyntaxError as e:
        return json.dumps({"codigo": codigo, "tests": [], "error": f"SyntaxError en la línea {e.lineno}: {e.msg}"}, ensure_ascii=False)

    d = _Describir()
    anotados = []

    def assert_(izq, der, texto, linea):
        obtenido = izq()
        esperado = der()
        ok = obtenido == esperado
        anotados.append({"linea": linea, "texto": texto, "obtenido": d.texto(obtenido), "esperado": d.texto(esperado), "ok": ok})
        if not ok:
            raise _FallaAssert()

    espacio = {"__name__": "__main__", "__motor_assert": assert_}
    salida = io.StringIO()
    resultado = {"codigo": codigo, "tests": []}
    with redirect_stdout(salida):
        try:
            exec(compilado, espacio)
        except Exception as e:
            resultado["error"] = f"{type(e).__name__}: {e}"
            return json.dumps(resultado, ensure_ascii=False)
        nombres = [n for n, v in espacio.items() if n.startswith("test_") and isinstance(v, types.FunctionType)]
        for nombre in nombres:
            funcion = espacio[nombre]
            anotados.clear()
            test = {"nombre": nombre, "linea": funcion.__code__.co_firstlineno, "estado": "pasa"}
            try:
                funcion()
            except _FallaAssert:
                test["estado"] = "falla"
            except Exception as e:
                test["estado"] = "error"
                test["error"] = f"{type(e).__name__}: {e}"
            test["asserts"] = list(anotados)
            resultado["tests"].append(test)
    return json.dumps(resultado, ensure_ascii=False)
`;function lr(a,t,o={}){const{maxPasos:e=400,entradas:n=[]}=o;a.runPython(Yo);const r=a.globals.get("_motor_trazar");try{return JSON.parse(r(t,e,n))}finally{r.destroy?.()}}function cr(a,t){a.runPython(Yo);const o=a.globals.get("_motor_probar");try{return JSON.parse(o(t))}finally{o.destroy?.()}}var Fn=/^\s*SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?)?(?:\s+LIMIT\s+(\d+))?\s*;?\s*$/is;function Dn(a,t){const o=a.replace(/\s+/g," ").match(Fn);if(!o)throw new Error("No entiendo esa consulta. Uso SELECT ... FROM ... [WHERE ...] [ORDER BY ...] [LIMIT n].");const[,e,n,r,i,s,l]=o;if(n.toLowerCase()!==t.nombre.toLowerCase())throw new Error(`La consulta lee de "${n}", pero la tabla se llama "${t.nombre}".`);const c=x=>{const p=t.columnas.findIndex(z=>z.toLowerCase()===x.toLowerCase());if(p===-1)throw new Error(`La tabla ${t.nombre} no tiene la columna "${x}". Tiene: ${t.columnas.join(", ")}.`);return p},u=e.trim()==="*"?[...t.columnas]:e.split(",").map(x=>t.columnas[c(x.trim())]),d=r?Pn(r,c):null,h=t.filas.map(x=>({fila:x,cumple:d?d(x):!0}));let m=h.filter(x=>x.cumple).map(x=>x.fila);const b=m,$=m.map(x=>u.map(p=>x[c(p)]));let g=$;if(i){const x=u.findIndex(A=>A.toLowerCase()===i.toLowerCase());if(x===-1)throw new Error(`Para ordenar por "${i}", esa columna tiene que estar en el SELECT.`);const p=(s??"ASC").toUpperCase()==="DESC"?-1:1;g=$.map((A,E)=>[A,E]).sort((A,E)=>Ha(A[0][x],E[0][x])*p||A[1]-E[1]).map(([A])=>A)}return m=l?g.slice(0,Number(l)):g,{seleccion:u,donde:r?.trim()??"",orden:i?{columna:i,descendente:(s??"").toUpperCase()==="DESC"}:null,limite:l?Number(l):null,recorrido:h,filtradas:b,conColumnas:$,ordenadas:g,resultado:m}}function Ha(a,t){return typeof a=="number"&&typeof t=="number"?a-t:String(a).localeCompare(String(t),"es")}function Pn(a,t){const o=a.split(/\s+OR\s+/i).map(e=>e.split(/\s+AND\s+/i).map(n=>Nn(n,t)));return e=>o.some(n=>n.every(r=>r(e)))}function Nn(a,t){const o=a.trim().match(/^(\w+)\s*(<=|>=|<>|!=|=|<|>)\s*('(?:[^']|'')*'|-?\d+(?:\.\d+)?)$/);if(!o)throw new Error(`No entiendo la condición "${a.trim()}". Uso columna, un operador (= != < <= > >=) y un número o un 'texto'.`);const[,e,n,r]=o,i=t(e),s=r.startsWith("'")?r.slice(1,-1).replace(/''/g,"'"):Number(r),l={"=":(c,u)=>c===u,"!=":(c,u)=>c!==u,"<>":(c,u)=>c!==u,"<":(c,u)=>Ha(c,u)<0,"<=":(c,u)=>Ha(c,u)<=0,">":(c,u)=>Ha(c,u)>0,">=":(c,u)=>Ha(c,u)>=0};return c=>l[n](c[i],s)}var va=a=>String(a);function ur(a){const{tabla:t,titulo:o="",descripcion:e="",archivo:n="consulta.sql",ritmo:r=.9,lectura:i=13,preguntas:s={}}=a,l=String(a.sql).trim().replace(/\s+(FROM|WHERE|ORDER BY|LIMIT)\s+/gi,(h,m)=>`
${m.toUpperCase()} `).replace(/^select\s+/i,"SELECT "),c=Dn(l,t),u=l.split(`
`),d=h=>u.findIndex(m=>m.toUpperCase().startsWith(h))+1;return function(h){const m=h.nombre==="angosta",b=m?640:1600,$=m?1140:900,g=o?100:30,x=m?{x:320,ancho:610,tamano:22}:{x:430,ancho:800,tamano:32},p=Math.max(...u.map(y=>y.length));x.tamano=Math.min(x.tamano,x.tamano*Tt(x)/p);const z=It({x:x.x,y:0,ancho:x.ancho,tamano:x.tamano,codigo:l,lenguaje:"sql",titulo:n,marca:0}),A=z.tipo.tamano(z.props).alto;z.props.y=g+A/2;const E=t.filas.length,T=m?Math.min(36,230/(E+1)):Math.min(54,400/(E+1)),v=m?18:27,q=m?{x:320,y:g+A+50,ancho:610}:{x:430,y:g+A+60,ancho:800},O=m?{x:320,y:q.y+(E+1)*T+60,ancho:610}:{x:1210,y:g+40,ancho:680},L={};o&&(L.titulo=ja({x:b/2,y:m?50:52,texto:o,tamano:m?30:40,peso:800,anchoMax:b-40})),L.codigo=z,L.rotuloOrigen=ja({x:q.x-q.ancho/2,y:q.y-6,texto:`Tabla ${t.nombre}`,tamano:v,peso:700,alineacion:"inicio",color:"suave",opacidad:0}),L.origen=St({x:q.x,y:q.y+14,ancho:q.ancho,altoFila:T,tamano:v,anclaje:"arriba",columnas:t.columnas,filas:t.filas.map(y=>y.map(va)),opacidad:0}),L.rotuloDestino=ja({x:O.x-O.ancho/2,y:O.y-6,texto:"Resultado",tamano:v,peso:700,alineacion:"inicio",color:"suave",opacidad:0}),L.destino=St({x:O.x,y:O.y+14,ancho:O.ancho,altoFila:T,tamano:v,anclaje:"arriba",columnas:t.columnas,filas:[],filasVisibles:0,encabezado:"exito",opacidad:0});const C=[];let M=.3;const N=(y,k=.4)=>{const D=Math.max(r*2,ya(y,i));C.push({subtitulo:y,en:M,dur:D}),M+=D+k},R=(y,k=M)=>C.push({pieza:"codigo",a:{linea:y,marca:1},dur:.35,en:k}),G=y=>{const k=s[y];if(!k)return"";const D=`${k.pregunta} Pausá y pensalo.`,F=Math.max(k.dur??4,ya(D,i)+1.5);return C.push({marca:"pregunta",datos:k,en:M,dur:F},{subtitulo:D,en:M,dur:F}),M+=F+.2,k.opciones&&k.correcta!==void 0?`Respuesta: ${k.opciones[k.correcta]}. ${k.explicacion??""} `:""};if(C.push({capitulo:"Se escribe en un orden...",en:0}),N("SQL se escribe empezando por SELECT, pero la base lo ejecuta en otro orden. Mirá qué parte se ilumina en cada momento."),C.push({capitulo:`FROM ${t.nombre}`,en:M}),R(d("FROM")),C.push({pieza:["rotuloOrigen","origen"],a:{opacidad:1},dur:.5,en:M}),N(`Primero FROM: la consulta toma la tabla ${t.nombre}, con sus ${E} filas.`),c.donde){const y=G("donde");C.push({capitulo:`WHERE ${c.donde}`,en:M}),R(d("WHERE")),C.push({pieza:"origen",a:{columnas:[...t.columnas,"¿cumple?"],filas:t.filas.map(F=>[...F.map(va),""])},dur:0,en:M}),C.push({pieza:["rotuloDestino","destino"],a:{opacidad:1},dur:.5,en:M}),N(`${y}Después WHERE ${c.donde}: revisa fila por fila, y se queda solo con las que cumplen.`,0);const k=t.filas.map(F=>[...F.map(va),""]),D=[];c.recorrido.forEach(({fila:F,cumple:V},I)=>{k[I]=[...F.map(va),V?"✓ sí":"✗ no"],C.push({pieza:"origen",a:{resaltarFila:I,filas:k.map(oa=>[...oa])},dur:0,en:M}),V&&(D.push(F.map(va)),C.push({pieza:"destino",a:{filas:D.map(oa=>[...oa]),filasVisibles:D.length-1},dur:0,en:M}),C.push({pieza:"destino",a:{filasVisibles:D.length},dur:.45,en:M+.1})),M+=r}),C.push({pieza:"origen",a:{resaltarFila:-1},dur:0,en:M}),N(`Cumplen ${c.filtradas.length} de ${E}.`)}else C.push({pieza:["rotuloDestino","destino"],a:{opacidad:1},dur:.5,en:M}),C.push({pieza:"destino",a:{filas:t.filas.map(y=>y.map(va)),filasVisibles:E},dur:.8,en:M}),M+=1;const H=G("seleccion");if(C.push({capitulo:`SELECT ${c.seleccion.join(", ")}`,en:M}),R(d("SELECT")),C.push({pieza:"destino",a:{columnas:c.seleccion,filas:c.conColumnas.map(y=>y.map(va)),filasVisibles:c.conColumnas.length},dur:0,en:M+.5}),N(`${H}Recién ahora SELECT: de cada fila quedan solo las columnas pedidas, ${c.seleccion.join(" y ")}.`),c.orden){const y=G("orden");C.push({capitulo:`ORDER BY ${c.orden.columna}`,en:M}),R(d("ORDER BY")),C.push({pieza:"destino",a:{filas:c.ordenadas.map(k=>k.map(va))},dur:0,en:M+.6}),N(`${y}ORDER BY ${c.orden.columna}${c.orden.descendente?" DESC":""}: ordena el resultado ${c.orden.descendente?"de mayor a menor":"de menor a mayor"}.`)}return c.limite!==null&&(C.push({capitulo:`LIMIT ${c.limite}`,en:M}),R(d("LIMIT")),C.push({pieza:"destino",a:{filas:c.resultado.map(y=>y.map(va)),filasVisibles:c.resultado.length},dur:0,en:M+.6}),N(`Y LIMIT ${c.limite}: se queda con las primeras ${c.limite}.`)),C.push({pieza:"codigo",a:{marca:0},dur:.4,en:M}),N(`Listo: el resultado tiene ${c.resultado.length} ${c.resultado.length===1?"fila":"filas"}.`),{titulo:o||"Una consulta, paso a paso",descripcion:e||`La consulta ${l.replace(/\n/g," ")} sobre la tabla ${t.nombre}, en el orden en que la ejecuta la base.`,ancho:b,alto:$,lectura:i,pausaFinal:1.5,piezas:L,linea:C}}}var In={espera:"⏳",corre:"▶",pasa:"✅",falla:"❌",error:"💥"},Tn={espera:"borde",corre:"acento",pasa:"exito",falla:"error",error:"error"};function dr(a){const{titulo:t="",descripcion:o="",archivo:e="test_programa.py",ritmo:n=1.1,lectura:r=13,preguntas:i={}}=a;if(!a.corridas?.length)throw new Error("desdeTests necesita al menos una corrida: { codigo, resultado }.");const s=a.corridas.map(c=>({...c,resultado:c.resultado??{tests:c.tests??[]}})),l=Math.max(...s.map(c=>c.resultado.tests.length));return function(c){const u=c.nombre==="angosta",d=u?640:1600,h=u?1140:900,m=t?100:30,b=s.map(M=>M.codigo.replace(/\s+$/,"")),$=Math.max(...b.map(M=>M.split(`
`).length)),g=Math.max(...b.flatMap(M=>M.split(`
`).map(N=>N.length))),x=u?{x:320,ancho:610,tamano:20}:{x:450,ancho:840,tamano:30};x.tamano=Math.min(x.tamano,x.tamano*Tt(x)/g);const p=u?h*.45:h-m-40;x.tamano=Math.min(x.tamano,p/($*1.6+2.6));const z=It({x:x.x,y:0,ancho:x.ancho,tamano:x.tamano,codigo:b[0],titulo:e,marca:0}),A=z.tipo.tamano(z.props).alto;z.props.y=m+A/2;const E=u?{x:320,ancho:600,y:m+A+40,alto:52,tamano:22}:{x:1250,ancho:560,y:m+40,alto:64,tamano:27},T={};t&&(T.titulo=ja({x:d/2,y:u?50:52,texto:t,tamano:u?30:40,peso:800,anchoMax:d-40})),T.codigo=z,T.rotulo=ja({x:E.x-E.ancho/2,y:E.y-4,texto:"pytest",tamano:E.tamano*.85,peso:700,alineacion:"inicio",color:"suave",fuente:"mono",opacidad:0});for(let M=0;M<l;M++)T["test"+M]=qt({x:E.x,y:E.y+20+E.alto/2+M*(E.alto+12),ancho:E.ancho,alto:E.alto,radio:10,texto:"",tamano:E.tamano,peso:600,borde:"borde",grosorBorde:3,opacidad:0});const v=E.y+20+l*(E.alto+12)+(u?60:90);T.detalle=qt({x:E.x,y:v,ancho:E.ancho,alto:u?120:170,radio:10,texto:"",tamano:E.tamano,peso:500,borde:"borde",opacidad:0}),T.resumen=ja({x:E.x,y:v+(u?100:140),texto:"",tamano:E.tamano*1.15,peso:800,color:"exito",opacidad:0,anchoMax:E.ancho});const q=[];let O=.3;const L=(M,N=.3)=>{const R=Math.max(n*1.6,ya(M,r));q.push({subtitulo:M,en:O,dur:R}),O+=R+N},C=(M,N,R)=>{q.push({pieza:"test"+M,a:{texto:`${In[N]}  ${R}`,borde:Tn[N],color:N==="espera"?"suave":"texto"},dur:0,en:O}),q.push({pieza:"test"+M,a:{resaltado:N==="corre"?1:0},dur:.25,en:O})};return s.forEach((M,N)=>{const R=M.resultado.tests;q.push({capitulo:M.titulo??(N===0?"Corren los tests":`Otra vez, ${N+1}`),en:O}),N>0&&(q.push({pieza:"codigo",a:{codigo:b[N],marca:0,colorMarca:"acento"},dur:0,en:O}),q.push({pieza:["detalle","resumen"],a:{opacidad:0},dur:.3,en:O}),M.explicacion&&L(M.explicacion)),R.forEach((k,D)=>C(D,"espera",k.nombre));for(let k=R.length;k<l;k++)q.push({pieza:"test"+k,a:{opacidad:0},dur:0,en:O});q.push({pieza:["rotulo",...R.map((k,D)=>"test"+D)],a:{opacidad:1},dur:.4,en:O}),L(N===0?"pytest busca las funciones que empiezan con test_, y las corre una por una.":"Se vuelven a correr todos los tests, no solo el que fallaba."),R.forEach((k,D)=>{C(D,"corre",k.nombre),q.push({pieza:"codigo",a:{linea:k.linea,marca:1,colorMarca:"acento"},dur:.35,en:O}),O+=n*.6;const F=i[`${N}.${k.nombre}`];let V="";if(F){const I=`${F.pregunta} Pausá y pensalo.`,oa=Math.max(F.dur??4,ya(I,r)+1.5);q.push({marca:"pregunta",datos:F,en:O,dur:oa},{subtitulo:I,en:O,dur:oa}),O+=oa+.2,F.opciones&&F.correcta!==void 0&&(V=`Respuesta: ${F.opciones[F.correcta]}. ${F.explicacion??""} `)}for(const I of k.asserts){q.push({pieza:"codigo",a:{linea:I.linea,colorMarca:I.ok?"acento":"error"},dur:.3,en:O});const oa=I.texto.split(" == ")[0];q.push({pieza:"detalle",a:{texto:I.ok?`assert ${I.texto}
✓ dio ${I.obtenido}`:`assert ${I.texto}
✗ esperaba ${I.esperado}, y dio ${I.obtenido}`,borde:I.ok?"exito":"error",color:I.ok?"texto":"error",opacidad:1},dur:0,en:O+.4}),L(I.ok?`${V}${oa} da ${I.obtenido}, como se esperaba.`:`${V}${oa} dio ${I.obtenido}, y se esperaba ${I.esperado}: el test falla.`),V=""}k.estado==="error"&&(q.push({pieza:"detalle",a:{texto:`💥 ${k.error}`,borde:"error",color:"error",opacidad:1},dur:0,en:O}),L(`El test se rompió antes de terminar: ${k.error}.`)),C(D,k.estado,k.nombre),O+=n*.4});const G=R.filter(k=>k.estado!=="pasa").length,H=R.length-G,y=G?`${G} ${G===1?"falla":"fallan"}, ${H} ${H===1?"pasa":"pasan"}`:`${H} de ${R.length}: todos pasan`;q.push({pieza:"codigo",a:{marca:0},dur:.3,en:O}),q.push({pieza:"resumen",a:{texto:y,color:G?"error":"exito",opacidad:1},dur:.4,en:O}),L(G?`Resultado: ${y}. Un test que falla no es una mala noticia: encontró un error antes que los usuarios.`:`Resultado: ${y}. Ahora el código hace lo que los tests dicen que tiene que hacer.`)}),{titulo:t||"Tests, paso a paso",descripcion:o||"Los tests de un programa, corriendo uno por uno: qué se esperaba, qué dio, y cuáles pasan.",ancho:d,alto:h,lectura:r,pausaFinal:1.5,piezas:T,linea:q}}}function mr(a={}){const t=a.ritmo??1,o=a.lectura??13,e=a.preguntas??{},n=[];let r="";const i={linea:n,tiempo:a.inicio??.3,ritmo:t,lectura:o,animar(s,l=0){for(const c of[s].flat())n.push({en:i.tiempo+l,...c});return i},decir(s,l=.4){const c=r+s;r="";const u=Math.max(t*2,ya(c,o));return n.push({subtitulo:c,en:i.tiempo,dur:u}),i.tiempo+=u+l,u},esperar(s){i.tiempo+=s*t},capitulo(s){n.push({capitulo:s,en:i.tiempo})},preguntar(s){const l=e[s];if(!l)return!1;const c=`${l.pregunta} Pausá y pensalo.`,u=Math.max(l.dur??4,ya(c,o)+1.5);return n.push({marca:"pregunta",datos:l,en:i.tiempo,dur:u},{subtitulo:c,en:i.tiempo,dur:u}),i.tiempo+=u+.2,r=l.opciones&&l.correcta!==void 0?`Respuesta: ${l.opciones[l.correcta]}. ${l.explicacion?`${l.explicacion} `:""}`:"",!0}};return i}var hr="0.12.0";ln();dn();export{$n as COLORES_CODIGO,ho as COMUNES,Ct as MotorEscena,un as MotorLeccion,ar as PANTALLA,Se as Reloj,Ya as SONIDOS,Rn as TEMAS,Mt as TOKENS,Yo as TRAZADOR_PY,So as aCoordenadasDe,S as aCss,$t as anticipar,Hn as aparecer,nt as azar,Xn as borrar,qt as caja,Bo as cajasEn,fn as camara,Lo as caminoFlecha,Tt as caracteresPorLinea,No as cargarEstilo,Kn as celular,er as cilindro,It as codigo,ye as compilar,wn as consola,or as contador,mr as crearNarrador,Oe as crearPintor,Et as curva,Gt as curvas,Jn as decir,ln as definirComponente,dn as definirLeccion,ta as definirPieza,Yn as desaparecer,on as describirSuperposiciones,ur as desdeConsulta,dr as desdeTests,sr as desdeTraza,Ln as detectarPunteros,Zn as dibujar,ya as duracionLectura,Dn as ejecutarConsulta,f as el,Co as elastico,bn as espejo,Xe as estilosDisponibles,Sn as explicarPaso,qo as figuras,tr as fila,mn as flecha,rr as forma,vn as formatearNumero,nr as grafo,ue as interpolar,Dt as leerCamino,fa as limitar,ir as lineaDeCodigo,Mn as lista,Uo as lugarLibre,ee as mezclarColores,ce as mezclarFormas,Vn as mezclarPista,Gn as mover,Ye as palabrasDe,Xa as partirLineas,jn as pila,w as poner,la as posicionAbsoluta,cr as probarConPyodide,jt as queTapa,zt as rebotar,Un as registrar,Pa as registrarEstilo,Nt as renglones,ro as resolverEstilo,_t as resorte,ko as revelar,tn as revisarSuperposiciones,Ro as sintetizar,Qn as sonar,St as tabla,ja as texto,zn as tokenizar,Wn as transformar,lr as trazarConPyodide,Bn as usarEstilo,En as variable,hr as version,uo as zonaDeSubtitulo};
