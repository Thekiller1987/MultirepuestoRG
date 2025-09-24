import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Picking() {
  const [items, setItems] = useState([])

  const load = async () => {
    const { data, error } = await supabase.rpc('rpc_picking_hoy', {})
    if (error) console.error(error)
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-lg font-bold mb-2">Picking de hoy</div>
      <div className="bg-white border rounded-2xl shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-2">Código</th>
              <th className="text-left p-2">Producto</th>
              <th className="text-right p-2">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td className="p-3 text-slate-500" colSpan="3">No hay picking hoy.</td></tr>}
            {items.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{r.codigo}</td>
                <td className="p-2">{r.nombre}</td>
                <td className="p-2 text-right">{Number(r.cantidad).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}