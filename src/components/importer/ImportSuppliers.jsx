import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function parseCSV(text){
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split(',').map(s=>s.trim());
  return lines.map(l => {
    const cols = l.split(',').map(s=>s.trim());
    const obj = {};
    header.forEach((h,i)=> obj[h]=cols[i]||'');
    return obj;
  });
}

export default function ImportSuppliers(){
  const [rows,setRows] = useState([]);
  const [busy,setBusy] = useState(false);
  const [msg,setMsg] = useState('');

  const onFile = async (e)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const txt = await file.text();
    setRows(parseCSV(txt));
  };

  const upload = async ()=>{
    if (rows.length===0) return;
    setBusy(true); setMsg('');
    const { error } = await supabase.from('suppliers').insert(rows);
    setBusy(false);
    setMsg(error ? 'Error: '+error.message : 'Importación completada: '+rows.length+' proveedores.');
  };

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Importar proveedores (CSV)</h1>
      <p className="text-sm text-gray-300">Formato: <code>name,tax_id,phone,email,address</code></p>
      <input type="file" accept=".csv" onChange={onFile} />
      {rows.length>0 && <div className="text-sm text-gray-400">{rows.length} filas listas.</div>}
      <button className="btn" onClick={upload} disabled={busy || rows.length===0}>{busy?'Subiendo...':'Subir a Supabase'}</button>
      {msg && <div className="text-sm">{msg}</div>}
    </div>
  );
}
