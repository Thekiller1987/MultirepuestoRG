export default function Ticket({ data }) {
  if (!data) return null
  const t = typeof data === 'string' ? JSON.parse(data) : data
  return (
    <div className="bg-white rounded-2xl border p-4 shadow-soft">
      <div className="text-center font-bold text-lg">Ticket #{t.id_venta}</div>
      <div className="text-center text-sm text-slate-500">{t.fecha}</div>
      <div className="mt-3 divide-y">
        {(t.items || []).map((it, idx) => (
          <div key={idx} className="py-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{it.descripcion}</div>
              <div className="text-xs text-slate-500">{it.cantidad} x C$ {Number(it.precio_unitario).toFixed(2)}</div>
            </div>
            <div className="font-semibold">C$ {Number(it.subtotal).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between font-semibold">
        <span>Total</span>
        <span>C$ {Number(t.total).toFixed(2)}</span>
      </div>
    </div>
  )
}