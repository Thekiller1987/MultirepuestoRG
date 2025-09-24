import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const estados = ['PENDIENTE','PREPARACION','EMPAQUE','LISTO','ENVIADO','ENTREGADO','CANCELADO']

export default function Envios() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('envios')
      .select('id_envio, id_venta, fecha_creacion, estado, destinatario, courier, tracking')
      .order('id_envio', { ascending: false })
      .limit(50)
    if (error) console.error(error)
    setRows(data || [])
    setLoading(false)
  }

  const cambiarEstado = async (id_envio, estado) => {
    await supabase.rpc('rpc_ticket_simple', { p_id_venta: -1 }) // no-op to wake edge (avoid cold start delays)
    const { error } = await supabase.rpc('rpc_set_estado_envio', { p_id_envio: id_envio, p_estado: estado })
    // fallback in case rpc name different: we defined set_estado_envio
    if (error) {
      const { error: e2 } = await supabase.rpc('set_estado_envio', { p_id_envio: id_envio, p_estado: estado })
      if (e2) return alert('Error: ' + e2.message)
    }
    await load()
  }

  useEffect(() => { load() }, [])

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Envíos</div>
        <button onClick={load} className="px-3 py-2 rounded-xl border hover:bg-slate-50">Refrescar</button>
      </div>
      <div className="mt-3 bg-white border rounded-2xl shadow-soft overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Venta</th>
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Estado</th>
              <th className="p-2 text-left">Courier</th>
              <th className="p-2 text-left">Tracking</th>
              <th className="p-2 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="p-3" colSpan="7">Cargando...</td></tr>}
            {!loading && rows.length === 0 && <tr><td className="p-3 text-slate-500" colSpan="7">Sin envíos.</td></tr>}
            {rows.map(r => (
              <tr key={r.id_envio} className="border-t">
                <td className="p-2">{r.id_envio}</td>
                <td className="p-2">{r.id_venta}</td>
                <td className="p-2">{new Date(r.fecha_creacion).toLocaleString()}</td>
                <td className="p-2">
                  <span className="px-2 py-1 rounded-full bg-slate-100">{r.estado}</span>
                </td>
                <td className="p-2">{r.courier || '-'}</td>
                <td className="p-2">{r.tracking || '-'}</td>
                <td className="p-2">
                  <select
                    defaultValue=""
                    onChange={(e)=>cambiarEstado(r.id_envio, e.target.value)}
                    className="border rounded-lg px-2 py-1">
                    <option value="" disabled>Cambiar a...</option>
                    {estados.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}