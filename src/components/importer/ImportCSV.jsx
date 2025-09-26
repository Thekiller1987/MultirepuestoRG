import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function parseCSV(text){
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split(',').map(s=>s.trim());
  return lines.map(l => {
    const cols = l.split(',').map(s=>s.trim());
    const obj = {};
    header.forEach((h,i)=> obj[h]=cols[i]||'');
    obj.price = +obj.price || 0;
    obj.cost = +obj.cost || 0;
    obj.stock = +obj.stock || 0;
    return obj;
  });
}

export default function ImportCSV(){
  const [rows,setRows] = useState([]);
  const [busy,setBusy] = useState(false);
  const [msg,setMsg] = useState('');

  const onFile = async (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const text = await file.text();
    const data = parseCSV(text);
    setRows(data);
  };

  const upload = async ()=>{
    if(rows.length===0) return;
    setBusy(true); setMsg('');
    const { error } = await supabase.from('products').insert(rows, { count:'exact' });
    setBusy(false);
    if(error) setMsg('Error: '+error.message);
    else setMsg('Importación completada: '+rows.length+' registros.');
  };

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Importar productos (CSV)</h1>
      <p className="text-sm text-gray-300">Formato: <code>code,name,category,unit,price,cost,stock</code></p>
      <input type="file" accept=".csv" onChange={onFile} />
      {rows.length>0 && <div className="text-sm text-gray-400">{rows.length} filas listas.</div>}
      <button className="btn" onClick={upload} disabled={busy || rows.length===0}>{busy?'Subiendo...':'Subir a Supabase'}</button>
      {msg && <div className="text-sm">{msg}</div>}
    </div>
  );
}
