import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
const estados=['PENDIENTE','PREPARACION','EMPAQUE','LISTO','ENVIADO','ENTREGADO','CANCELADO']
export default function Envios(){
  const [rows,setRows]=useState([]); const [loading,setLoading]=useState(true)
  const load=async()=>{ setLoading(true); const {data,error}=await supabase.from('envios').select('id_envio,id_venta,fecha_creacion,estado').order('id_envio',{ascending:false}).limit(50); if(!error) setRows(data||[]); setLoading(false) }
  const cambiar=async(id,estado)=>{ const {error}=await supabase.rpc('set_estado_envio',{p_id_envio:id,p_estado:estado}); if(error) alert(error.message); else load() }
  useEffect(()=>{ load() },[])
  return (<div className="max-w-7xl mx-auto p-4"><div className="flex items-center justify-between mb-2"><div className="text-lg font-bold">Envíos</div><button onClick={load} className="btn">Refrescar</button></div>
    <div className="card overflow-auto"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-2 text-left">#</th><th className="p-2 text-left">Venta</th><th className="p-2">Fecha</th><th className="p-2">Estado</th><th className="p-2">Acción</th></tr></thead>
      <tbody>{loading&&<tr><td className="p-3" colSpan="5">Cargando...</td></tr>}{!loading&&rows.length===0&&<tr><td className="p-3" colSpan="5">Sin envíos.</td></tr>}{rows.map(r=>(
        <tr key={r.id_envio} className="border-t"><td className="p-2">{r.id_envio}</td><td className="p-2">{r.id_venta}</td><td className="p-2">{new Date(r.fecha_creacion).toLocaleString()}</td><td className="p-2"><span className="badge">{r.estado}</span></td>
          <td className="p-2"><select defaultValue="" onChange={e=>cambiar(r.id_envio,e.target.value)} className="border rounded-xl px-2 py-1"><option value="" disabled>Cambiar...</option>{estados.map(s=><option key={s} value={s}>{s}</option>)}</select></td></tr>
      ))}</tbody></table></div></div>)
}