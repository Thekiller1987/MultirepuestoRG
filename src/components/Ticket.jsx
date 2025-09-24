export default function Ticket({ ticket }){
  if(!ticket) return null
  return (
    <div className="card p-3">
      <div className="font-semibold">Ticket #{ticket?.id_venta}</div>
      <div className="text-xs text-slate-600">{new Date(ticket?.fecha).toLocaleString?.() || ''}</div>
      <div className="mt-2">
        {(ticket.items||[]).map((it,idx)=>(
          <div className="flex justify-between text-sm" key={idx}>
            <div>{it.descripcion}</div><div>x{it.cantidad}</div><div>C$ {Number(it.subtotal).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 font-bold text-right">Total: C$ {Number(ticket.total).toFixed(2)}</div>
    </div>
  )
}