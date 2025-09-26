import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ProviderForm({ onSaved, initial }){
  const [form,setForm] = useState(initial || { name:'', tax_id:'', phone:'', email:'', address:'' });
  const [saving,setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const validate=()=>{const e={}; if(!form.name.trim()) e.name='Nombre obligatorio'; if(form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email='Email inválido'; setErrors(e); return Object.keys(e).length===0;};

  const save = async (e)=>{
    e.preventDefault();
    if(!validate()) return; setSaving(true);
    let res;
    if (initial?.id) res = await supabase.from('suppliers').update(form).eq('id',initial.id);
    else res = await supabase.from('suppliers').insert(form);
    setSaving(false);
    if (!res.error) onSaved && onSaved();
    else alert('Error: '+res.error.message);
  };

  return (
    <form onSubmit={save} className="grid grid-cols-2 gap-3">
      <input className="input" placeholder="Nombre" aria-label="Nombre del proveedor" />{errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}<input className="input hidden" style={{display:"none"}} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required />
      <input className="input" placeholder="N° fiscal" aria-label="Número fiscal (RUC)" value={form.tax_id} onChange={e=>setForm(f=>({...f,tax_id:e.target.value}))} />
      <input className="input" placeholder="Teléfono" aria-label="Teléfono de contacto" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
      <input className="input" placeholder="Email" aria-label="Correo electrónico" />{errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}<input className="input hidden" style={{display:"none"}} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
      <input className="input col-span-2" placeholder="Dirección" aria-label="Dirección" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} />
      <div className="col-span-2"><button className="btn" type="submit" disabled={saving}>{saving?'Guardando...':'Guardar'}</button></div>
    </form>
  );
}
