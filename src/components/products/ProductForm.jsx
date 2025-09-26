import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ProductForm({ onSaved, initial }){
  const [form,setForm] = useState(initial || { code:'', name:'', category:'', unit:'UND', price:0, cost:0, stock:0 });
  const [saving,setSaving] = useState(false);

  const save = async (e)=>{
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, price: +form.price||0, cost:+form.cost||0, stock:+form.stock||0 };
    let res;
    if (initial?.id) res = await supabase.from('products').update(payload).eq('id', initial.id);
    else res = await supabase.from('products').insert(payload);
    setSaving(false);
    if(!res.error) onSaved && onSaved();
    else alert('Error: '+res.error.message);
  };

  return (
    <form onSubmit={save} className="grid grid-cols-2 gap-3">
      <div className=\"col-span-2 text-sm text-gray-300\">Los campos marcados son obligatorios.</div>
      <label className="text-xs">Campo<input className="input" placeholder="Código" aria-label="Código del producto" value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value}))} required /></label>
      <label className="text-xs">Campo<input className="input" placeholder="Nombre" aria-label="Nombre del producto" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required /></label>
      <label className="text-xs">Campo<input className="input" placeholder="Categoría" aria-label="Categoría" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} /></label>
      <label className="text-xs">Campo<input className="input" placeholder="Unidad" aria-label="Unidad de medida" value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} /></label>
      <label className="text-xs">Campo<input className="input" placeholder="Precio venta" aria-label="Precio de venta" type="number" step="0.01" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} required/></label>
      <label className="text-xs">Campo<input className="input" placeholder="Costo" aria-label="Costo" type="number" step="0.01" value={form.cost} onChange={e=>setForm(f=>({...f,cost:e.target.value}))} /></label>
      <label className="text-xs">Campo<input className="input" placeholder="Stock" aria-label="Stock" type="number" step="0.0001" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} /></label>
      <div className="col-span-2"><button className="btn" type="submit" disabled={saving}>{saving?'Guardando...':'Guardar'}</button></div>
    </form>
  );
}
