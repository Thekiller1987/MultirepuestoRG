import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
export default function Accounts(){
  const [tab,setTab]=useState('CxC'); const [cxc,setCxc]=useState([]); const [cxp,setCxp]=useState([])
  const load=async()=>{ const r1=await supabase.from('v_cxc').select('*').order('fecha',{ascending:false}).limit(200)
    const r2=await supabase.from('v_cxp').select('*').order('fecha',{ascending:false}).limit(200)
    setCxc(r1.data||[]); setCxp(r2.data||[]) }
  useEffect(()=>{ load() },[])
  const dataset=tab==='CxC'?cxc:cxp
  return (<div className="max-w-7xl mx-auto p-4 space-y-3">
    <div className="card p-2 flex gap-2"><button className={`btn ${tab==='CxC'?'bg-brand-600 text-white border-brand-600':''}`} onClick={()=>setTab('CxC')}>Cuentas por Cobrar</button>
      <button className={`btn ${tab==='CxP'?'bg-brand-600 text-white border-brand-600':''}`} onClick={()=>setTab('CxP')}>Cuentas por Pagar</button>
      <div className="ml-auto"><button className="btn" onClick={load}>Refrescar</button></div></div>
    <div className="card overflow-auto"><table className="w-full text-sm"><thead className="bg-slate-50">
      <tr>{tab==='CxC'?(<><th className="p-2 text-left">Venta</th><th className="p-2">Fecha</th><th className="p-2">Cliente</th><th className="p-2">Total</th><th className="p-2">Pagado</th><th className="p-2">Saldo</th><th className="p-2">Vence</th></>):(<>
        <th className="p-2 text-left">Compra</th><th className="p-2">Fecha</th><th className="p-2">Proveedor</th><th className="p-2">Total</th><th className="p-2">Pagado</th><th className="p-2">Saldo</th></>)}</tr></thead>
      <tbody>{dataset.map((r,idx)=>(<tr key={idx} className="border-t">{tab==='CxC'?(<>
        <td className="p-2">{r.id_venta}</td><td className="p-2">{r.fecha}</td><td className="p-2">{r.id_cliente||'-'}</td>
        <td className="p-2">C$ {Number(r.total).toFixed(2)}</td><td className="p-2">C$ {Number(r.pagado).toFixed(2)}</td><td className="p-2 font-bold">C$ {Number(r.saldo).toFixed(2)}</td><td className="p-2">{r.fecha_venc||'-'}</td>
      </>):(<>
        <td className="p-2">{r.id_compra}</td><td className="p-2">{r.fecha}</td><td className="p-2">{r.id_proveedor}</td>
        <td className="p-2">C$ {Number(r.total).toFixed(2)}</td><td className="p-2">C$ {Number(r.pagado).toFixed(2)}</td><td className="p-2 font-bold">C$ {Number(r.saldo).toFixed(2)}</td>
      </>)}</tr>))}</tbody></table></div></div>)
}