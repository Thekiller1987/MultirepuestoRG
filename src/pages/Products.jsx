import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
export default function Products(){
  const [rows,setRows]=useState([]); const [q,setQ]=useState('')
  const [form,setForm]=useState({codigo:'',nombre:'',precio_unitario:0})
  const load=async()=>{ const {data,error}=await supabase.from('productos').select('*').order('codigo'); if(!error) setRows(data||[]) }
  useEffect(()=>{ load() },[])
  const save=async(e)=>{ e.preventDefault(); if(!form.codigo||!form.nombre) return alert('Completa código y nombre')
    const {error}=await supabase.from('productos').upsert({codigo:form.codigo,nombre:form.nombre,precio_unitario:Number(form.precio_unitario)},{onConflict:'codigo'})
    if(error) return alert(error.message); setForm({codigo:'',nombre:'',precio_unitario:0}); load() }
  const del=async(codigo)=>{ if(!confirm('¿Eliminar producto '+codigo+'?')) return; const {error}=await supabase.from('productos').delete().eq('codigo',codigo); if(error) return alert(error.message); load() }
  const filtered=rows.filter(r=>(r.nombre||'').toLowerCase().includes(q.toLowerCase())||(r.codigo||'').toLowerCase().includes(q.toLowerCase()))
  return (<div className="max-w-7xl mx-auto p-4 grid lg:grid-cols-3 gap-3">
    <form onSubmit={save} className="card p-3 space-y-2"><div className="text-lg font-bold">Nuevo / Editar producto</div>
      <input className="input" placeholder="Código" value={form.codigo} onChange={e=>setForm({...form,codigo:e.target.value})} required />
      <input className="input" placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required />
      <input type="number" step="0.01" className="input" placeholder="Precio unitario" value={form.precio_unitario} onChange={e=>setForm({...form,precio_unitario:e.target.value})} />
      <button className="btn-primary w-full">Guardar</button></form>
    <div className="lg:col-span-2"><input className="input mb-2" placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} />
      <div className="card overflow-auto"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-2 text-left">Código</th><th className="p-2 text-left">Nombre</th><th className="p-2">Precio</th><th className="p-2"></th></tr></thead>
        <tbody>{filtered.map(p=>(<tr key={p.codigo} className="border-t"><td className="p-2">{p.codigo}</td><td className="p-2">{p.nombre}</td><td className="p-2">C$ {Number(p.precio_unitario||0).toFixed(2)}</td>
          <td className="p-2 text-right"><button className="btn" onClick={()=>setForm({codigo:p.codigo,nombre:p.nombre,precio_unitario:p.precio_unitario||0})}>Editar</button><button className="btn ml-2" onClick={()=>del(p.codigo)}>Eliminar</button></td></tr>))}</tbody></table></div>
    </div></div>)
}