import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ProviderForm from './ProviderForm.jsx';

export default function ProviderList(){
  const [rows,setRows] = useState([]);
  const [session,setSession] = useState(null);

  const [showForm,setShowForm] = useState(false);
  const [editItem,setEditItem] = useState(null);
  const [q,setQ] = useState('');

  const load = async ()=>{
    const { data, error } = await supabase.from('suppliers').select('*').order('name');
    if (!error) setRows(data||[]);
  };
  useEffect(()=>{ load(); }, []);
  useEffect(()=>{ supabase.auth.getSession().then(({data})=>setSession(data.session)); },[]);

  const del = async (id)=>{
    if(!confirm('¿Eliminar proveedor?')) return;
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) alert('Error: '+error.message); else load();
  };

  const filtered = rows.filter(r => (r.name+' '+(r.tax_id||'')).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Proveedores</h1>
        <button className="btn" onClick={()=>{setEditItem(null); setShowForm(true);}}>Nuevo</button>
      </div>
      {showForm && (
        <div className="card">
          <ProviderForm initial={editItem} onSaved={()=>{ setShowForm(false); load(); }} />
        </div>
      )}
      <input className="input" placeholder="Buscar" value={q} onChange={e=>setQ(e.target.value)} />
      <div className="card">
        <table className="table">
          <thead><tr className="text-left"><th className="th">Nombre</th><th className="th">N° Fiscal</th><th className="th">Teléfono</th><th className="th">Email</th><th className="th">Dirección</th><th className="th"></th></tr></thead>
          <tbody>
            {filtered.map(r=>(
              <tr key={r.id}>
                <td className="td">{r.name}</td>
                <td className="td">{r.tax_id}</td>
                <td className="td">{r.phone}</td>
                <td className="td">{r.email}</td>
                <td className="td">{r.address}</td>
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