import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
export default function Reports(){
  const [desde,setDesde]=useState(()=>new Date(Date.now()-6*86400000).toISOString().slice(0,10))
  const [hasta,setHasta]=useState(()=>new Date().toISOString().slice(0,10))
  const [data,setData]=useState([])
  const load=async()=>{ const {data,error}=await supabase.rpc('rpc_ventas_rango',{p_desde:desde,p_hasta:hasta}); if(!error) setData(data||[]) }
  useEffect(()=>{ load() },[])
  return (<div className="max-w-5xl mx-auto p-4 space-y-3">
    <div className="card p-3 flex gap-2 items-end"><div><label className="text-xs text-slate-600">Desde</label><input type="date" className="input" value={desde} onChange={e=>setDesde(e.target.value)} /></div>
      <div><label className="text-xs text-slate-600">Hasta</label><input type="date" className="input" value={hasta} onChange={e=>setHasta(e.target.value)} /></div>
      <button className="btn" onClick={load}>Aplicar</button></div>
    <div className="card p-3" style={{width:'100%',height:320}}>
      <ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="fecha" /><YAxis /><Tooltip /><Line type="monotone" dataKey="total" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
    </div></div>)
}