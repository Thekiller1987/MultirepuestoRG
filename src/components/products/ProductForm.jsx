
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ProductForm({ onSaved, initial }){
  const [form,setForm] = useState(initial || { code:'', name:'', category:'', unit:'UND', price:'0', cost:'0', stock:'0', margin:'0' });
  const [saving,setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'El código es obligatorio';
    if (!form.name.trim()) e.name = 'El nombre es obligatorio';
    const price = +form.price; if (Number.isNaN(price) || price < 0) e.price = 'Precio inválido';
    const cost  = +form.cost;  if (Number.isNaN(cost)  || cost  < 0)  e.cost  = 'Costo inválido';
    const stock = +form.stock; if (!Number.isInteger(stock) || stock < 0) e.stock = 'Stock inválido (entero)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (e)=>{
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      category: form.category.trim() || 'General',
      unit: form.unit.trim() || 'UND',
      price: +form.price || 0,
      cost: +form.cost || 0,
      stock: parseInt(form.stock||0,10)
    };
    let res;
    if (initial?.id) res = await supabase.from('products').update(payload).eq('id', initial.id);
    else res = await supabase.from('products').insert(payload);
    setSaving(false);
    if(!res.error) onSaved && onSaved();
    else alert('Error: '+res.error.message);
  };

  const Field = ({id,label,children,error}) => (
    <div className="animate-fade-in-up">
      <label htmlFor={id} className="block text-xs text-gray-300 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={save} className="grid grid-cols-2 gap-3">
      <div className="col-span-2 text-sm text-gray-300 animate-pulse-slow">Los campos marcados son obligatorios.</div>

      <Field id="code" label="Código *" error={errors.code}>
        <input id="code" className="input w-full" placeholder="Código" aria-label="Código del producto"
               value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value}))} required />
      </Field>

      <Field id="name" label="Nombre *" error={errors.name}>
        <input id="name" className="input w-full" placeholder="Nombre" aria-label="Nombre del producto"
               value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required />
      </Field>

      <Field id="category" label="Categoría" error={null}>
        <input id="category" className="input w-full" placeholder="Categoría" aria-label="Categoría"
               value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} />
      </Field>

      <Field id="unit" label="Unidad" error={null}>
        <input id="unit" className="input w-full" placeholder="Unidad" aria-label="Unidad de medida"
               value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} />
      </Field>

      <Field id="margin" label="Margen % (auto)" error={null}>
        <input id="margin" className="input w-full" placeholder="Margen %" aria-label="Margen porcentaje"
               type="number" min="0" step="0.01"
               value={form.margin}
               onChange={e=>{
                 const m = parseFloat(e.target.value||0);
                 setForm(f=>({
                   ...f,
                   margin: e.target.value,
                   price: (parseFloat(f.cost||0) * (1 + (m/100))).toFixed(2)
                 }));
               }} />
      </Field>

      <Field id="price" label="Precio venta *" error={errors.price}>
        <input id="price" className="input w-full" placeholder="Precio venta" aria-label="Precio de venta"
               type="number" min="0" step="0.01"
               value={form.price} onChange={e=>{
                 const v = e.target.value;
                 setForm(f=>({
                   ...f,
                   price: v,
                   margin: (parseFloat(f.cost||0)>0 ? ((parseFloat(v||0)/parseFloat(f.cost||0) - 1)*100).toFixed(2) : f.margin)
                 }));
               }} required />
      </Field>

      <Field id="cost" label="Costo" error={errors.cost}>
        <input id="cost" className="input w-full" placeholder="Costo" aria-label="Costo"
               type="number" min="0" step="0.01"
               value={form.cost} onChange={e=>{
                 const v = e.target.value;
                 setForm(f=>({
                   ...f,
                   cost: v,
                   price: (parseFloat(v||0) * (1 + (parseFloat(f.margin||0)/100))).toFixed(2)
                 }));
               }} />
      </Field>

      <Field id="stock" label="Stock (entero) *" error={errors.stock}>
        <input id="stock" className="input w-full" placeholder="Stock" aria-label="Stock"
               type="number" min="0" step="1"
               value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} required />
      </Field>

      <div className="col-span-2">
        <button className="btn w-full transition-transform hover:scale-[1.01]" type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
