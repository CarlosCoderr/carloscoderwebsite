/* Mini-calculadora «Cuánto te cuesta tu caos».
   Total histórico = anuncios + web + (meses en cero × facturación de un mes normal).
   La venta posiblemente perdida (últimas 3 semanas) se calcula aparte y NUNCA suma al total.
   Cada vez que se abre la página empieza en cero. */
(()=>{
  const $=id=>document.getElementById(id);

  const blank=()=>({
    ads:[{v:""}],web:[{v:""}],
    months:0,monthly:"",half:false,summed:false,
    extra:false,chats:"",ticket:"",unit:"pct",rate:""
  });

  const S=blank();

  /* números */
  const num=v=>{const n=parseFloat(String(v??"").replace(/[^\d.]/g,""));return isFinite(n)?n:0};
  // Formato único: separador de miles «,», sin decimales si es entero y con 2 si no (S/ 1,800 · S/ 1,800.50)
  const group=n=>{const r=Math.round(n*100)/100,d=Number.isInteger(r)?0:2;
    return r.toLocaleString("en-US",{useGrouping:true,minimumFractionDigits:d,maximumFractionDigits:d})};
  const soles=n=>"S/ "+group(n);
  const sum=list=>list.reduce((a,l)=>a+num(l.v),0);

  function calc(){
    const ads=sum(S.ads),web=sum(S.web);
    const months=Math.min(12,Math.max(0,Math.round(num(S.months))));
    const monthly=num(S.monthly);
    const zero=months*monthly*(S.half?.5:1);
    const chats=Math.round(num(S.chats)),ticket=num(S.ticket),r=num(S.rate);
    let pct=S.unit==="pct"?Math.min(r,100):(chats?Math.min(r,chats)/chats*100:0);
    const lost=chats*ticket*pct/100;
    return{ads,web,months,monthly,zero,total:ads+web+zero,chats,ticket,pct,qty:r,lost};
  }

  /* filas con varios montos (anuncios y web) */
  function renderLines(key){
    const box=document.querySelector(`[data-lines="${key}"]`);
    box.innerHTML="";
    S[key].forEach((l,i)=>{
      const row=document.createElement("div");row.className="line";
      row.innerHTML=`<div class="money"><span>S/</span><input type="text" inputmode="decimal" placeholder="0" aria-label="Monto"></div>
        <button class="x" type="button" aria-label="Quitar este monto">×</button>`;
      const val=row.querySelector("input");
      val.value=l.v?group(num(l.v)):"";
      bindMoney(val,v=>{l.v=v});
      row.querySelector(".x").onclick=()=>{S[key].splice(i,1);if(!S[key].length)S[key].push({v:""});renderLines(key);update()};
      box.append(row);
    });
  }
  function bindMoney(input,set){
    input.addEventListener("input",()=>{set(input.value);update()});
    input.addEventListener("blur",()=>{const n=num(input.value);input.value=input.value.trim()===""?"":group(n)});
    input.addEventListener("focus",()=>{if(input.value)input.value=String(num(input.value))});
  }

  /* pintar resultados */
  function update(){
    const c=calc();
    const setSub=(k,v)=>{const el=document.querySelector(`[data-sub="${k}"]`);el.textContent=soles(v);el.classList.toggle("off",!v)};
    setSub("ads",c.ads);setSub("web",c.web);setSub("zero",c.zero);

    const tot=$("total");tot.textContent=soles(c.total);
    tot.hidden=!S.summed;$("sumBtn").hidden=S.summed;

    $("halfNote").hidden=!S.half;
    $("extra").hidden=!S.extra;
    $("lost").textContent=soles(c.lost);
    $("rateUnit").textContent=S.unit==="pct"?"%":"chats";
    document.querySelectorAll("[data-unit]").forEach(b=>b.setAttribute("aria-checked",b.dataset.unit===S.unit));
    const hint=$("rateHint");
    if(S.unit==="qty"&&c.chats&&c.qty) hint.textContent=c.qty>c.chats?`No puede ser más que ${c.chats} chats.`:`Equivale al ${(Math.round(c.pct*10)/10).toLocaleString("en-US")} % de los chats.`;
    else if(S.unit==="pct"&&num(S.rate)>100) hint.textContent="El máximo es 100 %.";
    else hint.innerHTML="&nbsp;";

  }

  /* llenar controles desde el estado */
  function hydrate(){
    $("months").value=S.months;$("monthly").value=S.monthly?group(num(S.monthly)):"";
    $("half").checked=S.half;$("extraToggle").checked=S.extra;
    $("chats").value=S.chats;$("ticket").value=S.ticket?group(num(S.ticket)):"";$("rate").value=S.rate;
    renderLines("ads");renderLines("web");
    update();
  }

  /* eventos */
  document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{
    const k=b.dataset.add;S[k].push({v:""});renderLines(k);
    document.querySelector(`[data-lines="${k}"] .line:last-child .money input`).focus();update();
  });
  const setMonths=v=>{S.months=Math.min(12,Math.max(0,Math.round(num(v))));$("months").value=S.months;update()};
  $("months").oninput=e=>{S.months=e.target.value;update()};
  $("months").onblur=e=>setMonths(e.target.value);
  document.querySelectorAll("[data-step]").forEach(b=>b.onclick=()=>setMonths(num(S.months)+Number(b.dataset.step)));
  bindMoney($("monthly"),v=>{S.monthly=v});
  $("half").onchange=e=>{S.half=e.target.checked;update()};

  $("sumBtn").onclick=()=>{S.summed=true;update();const t=$("total");t.classList.remove("pop");void t.offsetWidth;t.classList.add("pop")};

  $("extraToggle").onchange=e=>{S.extra=e.target.checked;update()};
  $("chats").oninput=e=>{S.chats=e.target.value;update()};
  bindMoney($("ticket"),v=>{S.ticket=v});
  $("rate").oninput=e=>{S.rate=e.target.value;update()};
  document.querySelectorAll("[data-unit]").forEach(b=>b.onclick=()=>{
    if(S.unit===b.dataset.unit)return;
    const c=calc();
    // al cambiar de unidad, se convierte el valor ya dicho (cantidad ↔ %)
    if(num(S.rate)&&c.chats) S.rate=b.dataset.unit==="pct"?String(Math.round(c.pct*10)/10):String(Math.round(c.pct/100*c.chats));
    S.unit=b.dataset.unit;$("rate").value=S.rate;update();
  });

  hydrate();
})();
