/* DECK · motor de presentaciones horizontales 16:9. Requiere deck.css y la estructura de _plantilla/deck.
   Emite el evento "deck:go" ({detail:{index}}) en document cada vez que cambia de página. */
(()=>{
  const W=1280,H=720;
  const $=id=>document.getElementById(id);
  const stage=$("stage"),vp=$("viewport"),track=$("track");
  const slides=[...document.querySelectorAll(".slide")],N=slides.length;
  const dots=$("dots"),count=$("count");
  let cur=0;

  const fit=()=>stage.style.setProperty("--s",Math.min(vp.clientWidth/W,vp.clientHeight/H));
  addEventListener("resize",fit);fit();

  dots.innerHTML=slides.map((_,i)=>`<button type="button" aria-label="Página ${i+1}"></button>`).join("");
  const dbs=[...dots.children];
  dbs.forEach((b,i)=>b.addEventListener("click",()=>go(i)));

  function go(i){
    cur=Math.max(0,Math.min(N-1,i));
    track.style.transform=`translateX(${-cur*W}px)`;
    slides.forEach((s,k)=>s.classList.toggle("on",k===cur));
    dbs.forEach((b,k)=>b.classList.toggle("on",k===cur));
    count.textContent=(cur+1)+" / "+N;
    $("prog").style.width=((cur+1)/N*100)+"%";
    ["aL","bL"].forEach(id=>$(id).disabled=cur===0);
    ["aR","bR"].forEach(id=>$(id).disabled=cur===N-1);
    try{history.replaceState(null,"","#"+(cur+1))}catch(e){}
    document.dispatchEvent(new CustomEvent("deck:go",{detail:{index:cur}}));
  }
  const prev=()=>go(cur-1),next=()=>go(cur+1);
  ["aL","bL"].forEach(id=>$(id).addEventListener("click",prev));
  ["aR","bR"].forEach(id=>$(id).addEventListener("click",next));

  addEventListener("keydown",e=>{
    if(e.target.matches("input,textarea"))return;
    if(e.key==="ArrowRight"||e.key==="PageDown"){e.preventDefault();next()}
    else if(e.key==="ArrowLeft"||e.key==="PageUp"){e.preventDefault();prev()}
    else if(e.key==="Home")go(0);else if(e.key==="End")go(N-1);
  });

  let tx=0,ty=0;
  addEventListener("touchstart",e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
  addEventListener("touchend",e=>{
    const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4)dx<0?next():prev();
  },{passive:true});

  let wl=0;
  addEventListener("wheel",e=>{
    const now=Date.now();if(now-wl<700)return;
    const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
    if(Math.abs(d)<25)return;
    wl=now;d>0?next():prev();
  },{passive:true});

  window.Deck={go,next,prev,get index(){return cur}};
  /* arranca cuando las páginas ya registraron sus listeners (respeta #n) */
  document.addEventListener("DOMContentLoaded",()=>go((parseInt(location.hash.slice(1))||1)-1));
})();
