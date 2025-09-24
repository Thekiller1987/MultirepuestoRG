import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
export default function Catalog(){
  const [q,setQ]=useState(''); const [rows,setRows]=useState([])
  useEffect(()=>{ supabase.rpc('rpc_catalogo_publico',{}).then(({data})=>setRows(data||[])) },[])
  const filtered=rows.filter(r=>(r.nombre||'').toLowerCase().includes(q.toLowerCase())||(r.codigo||'').toLowerCase().includes(q.toLowerCase()))
  return (<div className="max-w-7xl mx-auto p-4">
    <input className="input mb-3" placeholder="Buscar por nombre o código..." value={q} onChange={e=>setQ(e.target.value)} />
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{filtered.map(p=>(
      <div key={p.codigo} className="card p-4"><div className="font-semibold">{p.nombre}</div><div className="text-sm text-slate-600">{p.codigo}</div>
        <div className="mt-1 flex justify-between"><span className="badge">Stock: {p.stock}</span><span className="font-bold">C$ {Number(p.precio_unitario).toFixed(2)}</span></div></div>
    ))}</div></div>)
}