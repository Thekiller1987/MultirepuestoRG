export function printTicket(ticket) {
  const t = typeof ticket === 'string' ? JSON.parse(ticket) : ticket
  const fecha = t.fecha ? new Date(t.fecha).toLocaleString() : new Date().toLocaleString()
  const html = `
  <html><head><meta charset="utf-8"/><title>Ticket ${t.id_venta||''}</title>
  <style>
  @page { size: 80mm auto; margin:0 } body { font-family: ui-monospace,monospace; margin:0 }
  .w { width:72mm; padding:4mm } .c { text-align:center } .b { font-weight:700 }
  .l { border-top:1px dashed #000; margin:6px 0 } table { width:100%; border-collapse:collapse; font-size:12px }
  td,th { padding:2px 0 } td.r,th.r { text-align:right }
  </style></head>
  <body><div class="w">
    <div class="c b">Multirepuestos RG</div><div class="c">Ticket #${t.id_venta||''}</div><div class="c">${fecha}</div>
    <div class="l"></div>
    <table><thead><tr><th>Det</th><th class="r">Cant</th><th class="r">P.U.</th><th class="r">Subt</th></tr></thead>
      <tbody>${(t.items||[]).map(it=>`
        <tr><td>${it.descripcion}</td><td class="r">${Number(it.cantidad)}</td><td class="r">${Number(it.precio_unitario).toFixed(2)}</td><td class="r">${Number(it.subtotal).toFixed(2)}</td></tr>`).join('')}
      </tbody></table>
    <div class="l"></div><div class="b" style="text-align:right">Total C$ ${Number(t.total).toFixed(2)}</div>
    <div class="l"></div><div class="c">¡Gracias por su compra!</div>
  </div><script>window.onload=()=>{window.print(); setTimeout(()=>window.close(),300)}</script></body></html>`
  const w = window.open('', 'PRINT', 'width=400,height=600'); w.document.write(html); w.document.close()
}