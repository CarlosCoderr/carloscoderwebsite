/* PÁGINA · lógica exclusiva del brochure Método Cero Caos. */
(()=>{
/* ===== Calculadora ===== */
const ids=["c-ads","c-web","c-meses","c-mes"].map(i=>document.getElementById(i));
const fmt=n=>"S/ "+Math.round(n).toLocaleString("es-PE");
function calc(){
  const [ads,web,meses,mes]=ids.map(i=>Math.max(0,parseFloat(i.value)||0));
  const cero=Math.min(12,meses)*mes, total=ads+web+cero;
  document.getElementById("calcTotal").textContent=fmt(total);
  document.getElementById("calcBreak").textContent=total?`Anuncios ${fmt(ads)} + web ${fmt(web)} + meses en cero ${fmt(cero)}.`:"Completa los campos para ver el total.";
}
ids.forEach(i=>i.addEventListener("input",calc));

/* ===== Método ===== */
const STEPS=[
 {t:"Diagnóstico y claridad de oferta",de:"Programas, consultas y PDF mezclados. Nadie entiende qué vendes.",a:"Una oferta única que se entiende al primer vistazo y un cliente ideal definido."},
 {t:"Infraestructura técnica integrada",de:"Un link en la bio que lleva a cualquier lado y chats perdidos en WhatsApp.",a:"Una landing page de conversión y un camino de compra adaptado a cómo vendes tú, con el mensaje principal que no puede faltar:",list:["<b>Programas o mentorías:</b> calificación por WhatsApp o chat inteligente para agendar una llamada contigo.","<b>Cursos o membresías:</b> pasarela de pago o plataforma de cursos, con recuperación de carritos.","<b>Servicios profesionales:</b> agenda conectada a tu calendario, con confirmaciones y recordatorios.","<b>Si ya tienes web, pasarela o agenda:</b> el sistema se acopla a lo que ya usas."]},
 {t:"Capacitación e independencia",de:"Respondes a mano sin saber qué decir y “matas” conversaciones que el sistema ya calentó.",a:"Tú (o quien atiende tu WhatsApp) sabe qué contestar, cuándo y cómo. No dependes de mí a ciegas."},
 {t:"Motor de tráfico y control operativo",de:"Anuncios a ciegas que quemaban tu presupuesto.",a:"Pauta en Meta/Google operada por mí, que se enciende el día 15 sobre una base ya lista."}
];
let si=0,after=false;
const stepsEl=document.getElementById("steps"), daEl=document.getElementById("da");
stepsEl.innerHTML=STEPS.map((s,i)=>`<button class="step" role="tab" type="button" data-i="${i}"><span class="num">${i+1}</span><span>${s.t}</span></button>`).join("");
function renderStep(){
  [...stepsEl.children].forEach((b,i)=>b.setAttribute("aria-selected",i===si));
  document.querySelectorAll(".toggle button").forEach(b=>b.setAttribute("aria-pressed",(b.dataset.m==="1")===after));
  daEl.className="da"+(after?" after":""); daEl.style.animation="none"; void daEl.offsetWidth; daEl.style.animation="";
  const S=STEPS[si];
  daEl.innerHTML=(after?S.a:S.de)+(after&&S.list?`<ul class="dots" style="margin-top:12px;font-weight:500;font-size:14.5px;letter-spacing:0">${S.list.map(x=>`<li><span>${x}</span></li>`).join("")}</ul>`:"");
  daEl.style.fontSize=(after&&S.list)?"21px":"";
}
stepsEl.addEventListener("click",e=>{const b=e.target.closest(".step");if(!b)return;si=+b.dataset.i;after=false;renderStep()});
document.querySelector(".toggle").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;after=b.dataset.m==="1";renderStep()});
renderStep();

/* ===== Contadores del caso ===== */
function countUp(){
  document.querySelectorAll("#stats [data-count]").forEach(el=>{
    const end=+el.dataset.count,pre=el.dataset.pre||"",post=el.dataset.post||"",dv=+el.dataset.div||1,dec=+el.dataset.dec||0;
    const show=v=>pre+(v/dv).toLocaleString("es-PE",{minimumFractionDigits:dec,maximumFractionDigits:dec})+post;
    if(matchMedia("(prefers-reduced-motion: reduce)").matches){el.textContent=show(end);return}
    const t0=performance.now(),D=1300;
    (function f(t){const p=Math.min(1,(t-t0)/D),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=show(v);if(p<1)requestAnimationFrame(f)})(t0);
  });
}

/* ===== Precios con descuento ===== */
document.getElementById("fromDx").addEventListener("change",e=>{
  const d=e.target.checked,A=document.getElementById("prA"),B=document.getElementById("prB");
  A.classList.toggle("d",d);B.classList.toggle("d",d);
  A.firstChild.textContent=d?"S/ 1,700":"S/ 2,000";
  document.getElementById("prAs").textContent=d?"el Mes 1, porque vienes del Diagnóstico. Luego S/ 2,000 al mes, mínimo 3 meses.":"al mes, mínimo 3 meses. El armado inicial va incluido en el Mes 1.";
  B.firstChild.textContent=d?"S/ 2,200":"S/ 2,500";
  document.getElementById("prBs").textContent=d?"de setup, porque vienes del Diagnóstico. Cubre el Mes 1. Desde el Mes 2: S/ 2,000 al mes, sin permanencia.":"de setup, que cubre el Mes 1 completo. Desde el Mes 2: S/ 2,000 al mes, sin permanencia.";
});

/* contadores al llegar a la página del caso */
document.addEventListener("deck:go",e=>{if(e.detail.index===6)countUp()});
})();
