import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
export default function Customers(){
  const [rows,setRows]=useState([])
  const [form,setForm]=useState({nombre:'',identificacion:'',telefono:'',email:'',direccion:'',limite_credito:0})
  const [editing,setEditing]=useState(null)
  const load=async()=>{ const {data}=await supabase.from('clientes').select('*').order('id_cliente',{ascending:false}).limit(100); setRows(data||[]) }
  useEffect(()=>{ load() },[])
  const save=async(e)=>{ e.preventDefault()
    if(editing){ const {error}=await supabase.rpc('rpc_actualizar_cliente',{p_id:editing,p_nombre:form.nombre,p_ident:form.identificacion,p_tel:form.telefono,p_email:form.email,p_dir:form.direccion,p_lim:Number(form.limite_credito),p_activo:true}); if(error) return alert(error.message) }
    else { const {error}=await supabase.rpc('rpc_crear_cliente',{p_nombre:form.nombre,p_ident:form.identificacion,p_tel:form.telefono,p_email:form.email,p_dir:form.direccion,p_lim:Number(form.limite_credito)}); if(error) return alert(error.message) }
    setForm({nombre:'',identificacion:'',telefono:'',email:'',direccion:'',limite_credito:0}); setEditing(null); load()
  }
  return (<div className="max-w-7xl mx-auto p-4 grid lg:grid-cols-3 gap-3">
    <form onSubmit={save} className="card p-3 space-y-2"><div className="text-lg font-bold">{editing?'Editar cliente':'Nuevo cliente'}</div>
      <input className="input" placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required />
      <input className="input" placeholder="Identificación" value={form.identificacion} onChange={e=>setForm({...form,identificacion:e.target.value})} />
      <input className="input" placeholder="Teléfono" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})} />
      <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      <textarea className="input" placeholder="Dirección" value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})} />
      <input type="number" className="input" placeholder="Límite de crédito" value={form.limite_credito} onChange={e=>setForm({...form,limite_credito:e.target.value})} />
      <button className="btn-primary w-full">{editing?'Actualizar':'Crear'}</button></form>
    <div className="lg:col-span-2 card overflow-auto"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-2 text-left">#</th><th className="p-2 text-left">Nombre</th><th className="p-2">Ident</th><th className="p-2">Tel</th><th className="p-2">Crédito</th><th className="p-2"></th></tr></thead>
      <tbody>{rows.map(r=>(<tr key={r.id_cliente} className="border-t">
        <td className="p-2">{r.id_cliente}</td><td className="p-2">{r.nombre}</td><td className="p-2">{r.identificacion||'-'}</td><td className="p-2">{r.telefono||'-'}</td><td className="p-2">C$ {Number(r.limite_credito).toFixed(2)}</td>
        <td className="p-2"><button className="btn" onClick={()=>{setEditing(r.id_cliente); setForm(r)}}>Editar</button></td></tr>))}</tbody></table></div></div>)
}