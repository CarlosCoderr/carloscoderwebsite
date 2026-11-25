/* CORE · utilidades compartidas por todas las páginas (sin dependencias, sin build). */
(()=>{
  const CC={
    whatsapp:"51921926452",
    waDefault:"Hola Carlos, escribo desde carloscoder.com."
  };
  window.CC=CC;

  /* WhatsApp: <a data-wa> usa el mensaje de <body data-wa-message="…"> o el suyo propio con data-wa-message */
  const wa=msg=>"https://wa.me/"+CC.whatsapp+"?text="+encodeURIComponent(msg);
  document.querySelectorAll("[data-wa]").forEach(a=>{
    const msg=a.dataset.waMessage||document.body.dataset.waMessage||CC.waDefault;
    a.href=wa(msg);a.target="_blank";a.rel="noopener";
  });

  /* Tabs: <div data-tabs><button class="tab" data-t="x">…</button></div> + <div class="pane" data-p="x"> */
  document.querySelectorAll("[data-tabs]").forEach(box=>{
    const scope=box.closest(".slide,section,main")||document;
    const tabs=[...box.querySelectorAll(".tab")];
    box.addEventListener("click",e=>{
      const b=e.target.closest(".tab");if(!b)return;
      tabs.forEach(x=>x.setAttribute("aria-selected",x===b));
      scope.querySelectorAll(".pane").forEach(p=>{
        if(tabs.some(t=>t.dataset.t===p.dataset.p))p.classList.toggle("open",p.dataset.p===b.dataset.t);
      });
    });
  });
})();
