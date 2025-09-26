import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ProductForm({ onSaved, initial }) {
  const [form,setForm] = useState(
    initial || { code:'', name:'', category:'', unit:'UND', price:'0', cost:'0', stock:'0', margin:'0' }
  );
  const [saving,setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'El código es obligatorio';
    if (!form.name.trim()) e.name = 'El nombre es obligatorio';
    if (Number(form.price) < 0 || isNaN(Number(form.price))) e.price = 'Precio inválido';
    if (Number(form.cost) < 0 || isNaN(Number(form.cost))) e.cost = 'Costo inválido';
    if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Stock inválido (entero ≥ 0)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      category: form.category.trim() || 'General',
      unit: form.unit.trim() || 'UND',
      price: Number(form.price) || 0,
      cost: Number(form.cost) || 0,
      stock: parseInt(form.stock||'0',10)
    };

    let res;
    if (initial?.id) res = await supabase.from('products').update(payload).eq('id', initial.id);
    else            res = await supabase.from('products').insert(payload);

    setSaving(false);
    if (res.error) return alert('Error: ' + res.error.message);
    onSaved && onSaved();
    if (!initial?.id) setForm({ code:'', name:'', category:'', unit:'UND', price:'0', cost:'0', stock:'0', margin:'0' });
  };

  const setMargin = (mStr) => {
    const m = parseFloat(mStr||0);
    setForm(f => ({
      ...f,
      margin: mStr,
      price: (parseFloat(f.cost||0) * (1 + (m/100))).toFixed(2)
    }));
  };

  const setPrice = (pStr) => {
    setForm(f => ({
      ...f,
      price: pStr,
      margin: (parseFloat(f.cost||0)>0 ? ((parseFloat(pStr||0)/parseFloat(f.cost||0) - 1)*100).toFixed(2) : f.margin)
    }));
  };

  const setCost = (cStr) => {
    setForm(f => ({
      ...f,
      cost: cStr,
      price: (parseFloat(cStr||0) * (1 + (parseFloat(f.margin||0)/100))).toFixed(2)
    }));
  };

  // Evitar submit con Enter (solo con el botón Guardar)
  const blockEnter = (e) => { if (e.key === 'Enter') e.preventDefault(); };

  const Field = ({id,label,children,error}) => (
    <div className="animate-fade-in-up">
      <label htmlFor={id} className="block text-xs text-gray-300 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={save} onKeyDown={blockEnter} className="grid grid-cols-2 gap-3">
      <div className="col-span-2 text-sm text-gray-300 animate-pulse-slow">Los campos marcados son obligatorios.</div>

      <Field id="code" label="Código *" error={errors.code}>
        <input id="code" className="input" value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value}))} placeholder="A0001" required />
      </Field>

      <Field id="name" label="Nombre *" error={errors.name}>
        <input id="name" className="input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Nombre del producto" required />
      </Field>

      <Field id="category" label="Categoría">
        <input id="category" className="input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} placeholder="Categoría" />
      </Field>

      <Field id="unit" label="Unidad">
        <input id="unit" className="input" value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} placeholder="UND" />
      </Field>

      <Field id="margin" label="Margen % (auto)">
        <input id="margin" className="input" type="number" min="0" step="0.01" value={form.margin} onChange={e=>setMargin(e.target.value)} placeholder="35" />
      </Field>

      <Field id="price" label="Precio venta *" error={errors.price}>
        <input id="price" className="input" type="number" min="0" step="0.01" value={form.price} onChange={e=>setPrice(e.target.value)} placeholder="67.50" required />
      </Field>

      <Field id="cost" label="Costo" error={errors.cost}>
        <input id="cost" className="input" type="number" min="0" step="0.01" value={form.cost} onChange={e=>setCost(e.target.value)} placeholder="50.00" />
      </Field>

      <Field id="stock" label="Stock (entero) *" error={errors.stock}>
        <input id="stock" className="input" type="number" min="0" step="1" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} placeholder="5" required />
      </Field>

      <div className="col-span-2">
        <button className="btn w-full transition-transform hover:scale-[1.01]" type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
