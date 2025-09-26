
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function InventoryAdjust(){
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [type, setType] = useState('adjust'); // import | sale | adjust
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('Ajuste de inventario');

  useEffect(()=>{
    supabase.from('products').select('*').then(({data})=> setProducts(data||[]));
  },[]);

  const filtered = useMemo(()=>{
    const q = query.toLowerCase();
    return products.filter(p => p.code?.toLowerCase().includes(q) || p.name?.toLowerCase().includes(q));
  },[products,query]);

  const submit = async (e)=>{
    e.preventDefault();
    if (!selected || qty<=0) return;
    const { error } = await supabase.from('stock_movements').insert({
      product_id: selected.id, type, qty, note, code: 'INV'
    });
    if (error) alert('Error: '+error.message);
    else {
      alert('Movimiento registrado.');
      setQty(1); setNote('Ajuste de inventario');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-blue-400">Inventario</h1>

      <div className="card">
        <label className="block text-xs text-gray-300 mb-1">Buscar producto</label>
        <input className="input" placeholder="Código o nombre" value={query} onChange={e=>setQuery(e.target.value)} />
        <div className="max-h-64 overflow-y-auto divide-y divide-gray-800 mt-2">
          {filtered.slice(0,30).map(p => (
            <div key={p.id} className={`py-2 px-2 hover:bg-gray-800 cursor-pointer rounded-lg ${selected?.id===p.id?'bg-gray-800':''}`}
                 onClick={()=> setSelected(p)}>
              <div className="flex justify-between"><span>{p.code} — {p.name}</span><span className="badge">Stock: {p.stock??0}</span></div>
              <div className="text-xs text-gray-400">Unidad: {p.unit} · Precio: C${(p.price||0).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-gray-300 mb-1">Tipo de movimiento</label>
          <select className="input" value={type} onChange={e=>setType(e.target.value)}>
            <option value="import">Entrada</option>
            <option value="sale">Salida</option>
            <option value="adjust">Ajuste</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-300 mb-1">Cantidad</label>
          <input className="input" type="number" min="1" step="1" value={qty} onChange={e=>setQty(parseInt(e.target.value||'1',10))} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-300 mb-1">Nota</label>
          <input className="input" placeholder="Motivo del movimiento" value={note} onChange={e=>setNote(e.target.value)} />
        </div>
        <div className="md:col-span-4">
          <button className="btn-amber w-full" type="submit" disabled={!selected}>Registrar movimiento</button>
        </div>
      </form>
    </div>
  );
}
