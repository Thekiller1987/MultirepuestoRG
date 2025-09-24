export default function PaymentRow({row, onChange, onRemove}){
  return (
    <div className="grid grid-cols-12 gap-2 items-end">
      <div className="col-span-4">
        <label className="text-xs text-slate-600">Método</label>
        <select value={row.label} onChange={e=>onChange({...row, label:e.target.value})} className="input">
          <option>Efectivo C$</option><option>Efectivo USD</option><option>Tarjeta</option><option>Otro</option>
        </select>
      </div>
      <div className="col-span-3">
        <label className="text-xs text-slate-600">Monto</label>
        <input type="number" step="0.01" value={row.monto} onChange={e=>onChange({...row, monto: Number(e.target.value)})} className="input" />
      </div>
      <div className="col-span-3">
        <label className="text-xs text-slate-600">T.Cambio (USD→C$)</label>
        <input type="number" step="0.0001" value={row.tipo_cambio ?? 1} onChange={e=>onChange({...row, tipo_cambio: Number(e.target.value)})} className="input" />
      </div>
      <div className="col-span-2">
        <button onClick={onRemove} className="btn w-full">Eliminar</button>
      </div>
    </div>
  )
}