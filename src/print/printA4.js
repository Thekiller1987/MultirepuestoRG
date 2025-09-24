export function printA4({docType='FACTURA', empresa={nombre:'Multirepuestos RG',direccion:'Managua, Nicaragua'}, numero='SIN NÚMERO', fecha=new Date().toLocaleString(), cliente={nombre:'Consumidor final'}, moneda='NIO', items=[], totales={total:0}}){
  const subtotal = items.reduce((a,b)=>a + Number(b.subtotal ?? b.cantidad*b.precio), 0)
  const total = totales.total || subtotal
  const html = `
  <html><head><meta charset="utf-8"/><title>${docType} ${numero}</title>
  <style>
  @page { size: A4; margin:12mm } body { font-family: ui-sans-serif,system-ui,Arial; color:#111 }
  .header { display:flex; justify-content:space-between } .brand { font-size:20px; font-weight:800; color:#1d4ed8 }
  .muted { color:#555; font-size:12px } .tag { font-weight:800; font-size:22px }
  table { width:100%; border-collapse:collapse; margin-top:10px } th,td { border-bottom:1px solid #e5e7eb; padding:8px; font-size:12px }
  th { background:#f8fafc; text-align:left } td.r, th.r { text-align:right } .totals { width:40%; margin-left:auto; border:0 }
  </style></head><body>
  <div class="header"><div><div class="brand">${empresa.nombre}</div><div class="muted">${empresa.direccion||''}</div></div>
    <div style="text-align:right"><div class="tag">${docType}</div><div><b>Número:</b> ${numero}</div><div><b>Fecha:</b> ${fecha}</div><div><b>Moneda:</b> ${moneda}</div></div></div>
  <div style="margin-top:10px"><div><b>Cliente:</b> ${cliente?.nombre||'Consumidor final'}</div>
    ${cliente?.identificacion?`<div class="muted">Identificación: ${cliente.identificacion}</div>`:''}
    ${cliente?.direccion?`<div class="muted">Dirección: ${cliente.direccion}</div>`:''}</div>
  <table><thead><tr><th>Código</th><th>Descripción</th><th class="r">Cant</th><th class="r">P.U.</th><th class="r">Subtotal</th></tr></thead>
    <tbody>${items.map(it=>`
      <tr><td>${it.codigo||''}</td><td>${it.descripcion}</td><td class="r">${Number(it.cantidad)}</td><td class="r">${Number(it.precio).toFixed(2)}</td><td class="r">${Number(it.subtotal ?? it.cantidad*it.precio).toFixed(2)}</td></tr>`).join('')}
    </tbody></table>
  <table class="totals"><tbody><tr><td class="r"><b>Total</b></td><td class="r"><b>${Number(total).toFixed(2)}</b></td></tr></tbody></table>
  <div style="margin-top:12px; font-size:11px; color:#475569">${docType==='PROFORMA'?'Documento no fiscal (cotización).':'¡Gracias por su preferencia!'}</div>
  <script>window.onload=()=>{window.print(); setTimeout(()=>window.close(),400)}</script></body></html>`
  const w = window.open('', 'PRINT', 'width=900,height=900'); w.document.write(html); w.document.close()
}