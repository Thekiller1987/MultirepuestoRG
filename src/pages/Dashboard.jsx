import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
export default function Dashboard(){
  const [today,setToday]=useState({ventas:0,total:0})
  useEffect(()=>{(async()=>{const d=new Date(); const desde=new Date(d); desde.setHours(0,0,0,0)
    const {data}=await supabase.rpc('rpc_ventas_rango',{p_desde:desde.toISOString().slice(0,10),p_hasta:d.toISOString().slice(0,10)})
    setToday({ventas:data?.[0]?.num_ventas||0,total:data?.[0]?.total||0})})()},[])
  return (<div className="max-w-7xl mx-auto p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <div className="card p-4"><div className="text-slate-600">Ventas de hoy</div><div className="text-2xl font-bold">C$ {Number(today.total).toFixed(2)}</div></div>
    <div className="card p-4"><div className="text-slate-600">Nº de ventas</div><div className="text-2xl font-bold">{today.ventas}</div></div>
    <div className="card p-4"><div className="text-slate-600">PWA</div><div className="text-2xl font-bold">Instalable</div></div></div>)
}