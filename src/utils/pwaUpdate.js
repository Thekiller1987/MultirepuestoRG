export function registerSW(){
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async ()=>{
      const reg = await navigator.serviceWorker.register('/sw.js');
      if (reg.waiting) showUpdate(reg);
      reg.addEventListener('updatefound', ()=>{
        const sw = reg.installing;
        sw.addEventListener('statechange', ()=>{
          if (sw.state === 'installed' && navigator.serviceWorker.controller) showUpdate(reg);
        });
      });
    });
  }
}
function showUpdate(reg){
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;bottom:12px;left:12px;right:12px;padding:12px;background:#dc2626;color:#fff;border-radius:12px;display:flex;justify-content:space-between;align-items:center;z-index:9999;';
  bar.innerHTML = '<span>Hay una nueva versión disponible.</span>';
  const btn = document.createElement('button');
  btn.textContent = 'Actualizar';
  btn.style.cssText = 'background:#facc15;border:none;color:#000;padding:8px 12px;border-radius:10px;cursor:pointer;';
  btn.onclick = ()=>{
    reg.waiting?.postMessage({type:'SKIP_WAITING'});
    setTimeout(()=> location.reload(), 500);
  };
  bar.appendChild(btn);
  document.body.appendChild(bar);
}
navigator.serviceWorker?.addEventListener('controllerchange', ()=> location.reload());