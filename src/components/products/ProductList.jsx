import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ProductForm from './ProductForm.jsx';

export default function ProductList(){
  const [rows,setRows] = useState([]);
  const [session,setSession] = useState(null);

  const [showForm,setShowForm] = useState(false);
  const [editItem,setEditItem] = useState(null);
  const [q,setQ] = useState('');

  const load = async ()=>{
    const { data, error } = await supabase.from('products').select('*').order('name');
    if (!error) setRows(data||[]);
  };
  useEffect(()=>{ load(); }, []);
  useEffect(()=>{ supabase.auth.getSession().then(({data})=>setSession(data.session)); },[]);

  const del = async (id)=>{
    if (!confirm('¿Eliminar producto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert('Error: '+error.message); else load();
  };

  const filtered = rows.filter(r => (r.name+' '+r.code).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button className="btn" onClick={()=>{setEditItem(null); setShowForm(true);}}>Nuevo</button>
      </div>
      {showForm && (
        <div className="card">
          <ProductForm initial={editItem} onSaved={()=>{ setShowForm(false); load(); }} />
        </div>
      )}
      <input className="input" placeholder="Buscar" value={q} onChange={e=>setQ(e.target.value)} />
      <div className="card">
        <table className="table">
          <thead><tr className="text-left"><th className="th">Código</th><th className="th">Nombre</th><th className="th">Unidad</th><th className="th">Precio</th><th className="th">Costo</th><th className="th">Stock</th><th className="th"></th></tr></thead>
          <tbody>
            {filtered.map(r=>(
              <tr key={r.id}>
                <td className="td">{r.code}</td>
                <td className="td">{r.name}</td>
                <td className="td">{r.unit}</td>
                <td className="td">C${(r.price||0).toFixed(2)}</td>
                <td className="td">C${(r.cost||0).toFixed(2)}</td>
                <td className="td">{r.stock||0}</td>
                <td className="td text-right space-x-2">
                  <button className="btn" onClick={()=>{setEditItem(r); setShowForm(true);}}>Editar</button>
                  <button className="btn" onClick={()=>del(r.id)} disabled={session?.user?.user_metadata?.role!=='admin'}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}