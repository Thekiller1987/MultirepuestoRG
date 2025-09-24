import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import PaymentRow from '../components/PaymentRow'
import Ticket from '../components/Ticket'
import { printTicket } from '../print/printTicket'
import { printA4 } from '../print/printA4'

export default function POS(){
  const [products,setProducts]=useState([])
  const [cart,setCart]=useState([])
  const [ventaId,setVentaId]=useState(null)
  const [ticket,setTicket]=useState(null)
  const [pagos,setPagos]=useState([{label:'Efectivo C$',moneda:'NIO',monto:0,tipo_cambio:1}])
  const [tc,setTc]=useState(36)

  useEffect(()=>{ supabase.rpc('rpc_catalogo_publico',{}).then(({data})=>setProducts(data||[])) },[])

  const addCode=(e)=>{ if(e.key!=='Enter') return; const code=e.target.value.trim(); e.target.value=''
    const p=products.find(x=>x.codigo?.toLowerCase()===code.toLowerCase()); if(!p) return alert('Producto no encontrado')
    setCart(prev=>{const f=prev.find(i=>i.codigo===p.codigo); if(f) return prev.map(i=>i.codigo===p.codigo?{...i,cantidad:i.cantidad+1}:i)
      return [...prev,{codigo:p.codigo,nombre:p.nombre,precio_unitario:Number(p.precio_unitario),cantidad:1}]}) }

  const total=useMemo(()=>cart.reduce((a,b)=>a+b.cantidad*b.precio_unitario,0),[cart])
  const pagosTotal=useMemo(()=>pagos.reduce((a,b)=>a+(b.label==='Efectivo USD'?b.monto*(b.tipo_cambio||tc):b.monto),0),[pagos,tc])
  const balance=useMemo(()=>pagosTotal-total,[pagosTotal,total])
  const updatePago=(idx,row)=>{ const moneda=row.label==='Efectivo USD'?'USD':'NIO'; const tipo_cambio=row.label==='Efectivo USD'?(row.tipo_cambio||tc):1; setPagos(pagos.map((p,i)=>i===idx?{...row,moneda,tipo_cambio}:p)) }

  const cobrar=async()=>{
    if(cart.length===0) return alert('Agrega productos.'); if(pagosTotal<total) return alert('Pagos insuficientes.')
    const { data:idVenta, error:e1 } = await supabase.rpc('rpc_iniciar_venta',{p_id_cliente:null,p_obs:'POS PWA'}); if(e1) return alert(e1.message); setVentaId(idVenta)
    for(const it of cart){ const {error}=await supabase.rpc('rpc_agregar_item',{p_id_venta:idVenta,p_codigo:it.codigo,p_cantidad:it.cantidad,p_precio:it.precio_unitario}); if(error) return alert(error.message) }
    const payload=pagos.map(p=>({id_metodo:p.label.startsWith('Tarjeta')?2:1,moneda:p.moneda||'NIO',monto:Number(p.monto),tipo_cambio:Number(p.tipo_cambio||1),referencia:p.label}))
    const { error:e3 } = await supabase.rpc('rpc_cobrar_venta_mixto',{p_id_venta:idVenta,p_pagos:payload}); if(e3) return alert(e3.message)
    await supabase.rpc('rpc_crear_envio',{p_id_venta:idVenta}).catch(()=>{})
    const { data:tk, error:e4 } = await supabase.rpc('rpc_ticket_simple',{p_id_venta:idVenta}); if(e4) return alert(e4.message); setTicket(tk); alert('Venta cobrada.')
  }

  const imprimirTicket=()=>{ if(!ticket) return alert('No hay ticket.'); printTicket(ticket) }
  const imprimirFactura=async()=>{ if(!ventaId||!ticket) return alert('Sin venta.'); await supabase.rpc('rpc_emitir_factura',{p_id_venta:ventaId}).catch(()=>{})
    printA4({ docType:'FACTURA', numero:(ticket.numero_doc)||(`VENTA-${ventaId}`), items:(ticket.items||[]).map(it=>({codigo:it.codigo||'',descripcion:it.descripcion,cantidad:Number(it.cantidad),precio:Number(it.precio_unitario),subtotal:Number(it.subtotal)})), totales:{ total:Number(ticket.total) } }) }
  const imprimirProforma=()=>{ if(cart.length===0) return alert('Agrega productos.'); const items=cart.map(it=>({codigo:it.codigo,descripcion:it.nombre,cantidad:it.cantidad,precio:it.precio_unitario})); printA4({docType:'PROFORMA',numero:'PROFORMA',items,totales:{total}}) }

  return (<div className="max-w-7xl mx-auto p-4 grid lg:grid-cols-3 gap-3">
    <div className="lg:col-span-2 space-y-3">
      <div className="card p-3"><div className="font-semibold mb-2">Escanear / código + Enter</div><input className="input" onKeyDown={addCode} placeholder="Código de barras o interno" />
        <div className="mt-3"><button className="btn" onClick={imprimirProforma}>Proforma (A4)</button></div></div>
      <div className="card p-3"><div className="text-lg font-bold mb-2">Carrito</div>
        {cart.length===0&&<div className="text-slate-500">Sin productos.</div>}{cart.map(it=>(
          <div key={it.codigo} className="grid grid-cols-12 gap-2 items-center py-2 border-b">
            <div className="col-span-5"><div className="font-medium">{it.nombre}</div><div className="text-xs text-slate-600">{it.codigo}</div></div>
            <div className="col-span-2"><input type="number" className="input" value={it.cantidad} onChange={e=>setCart(cart.map(x=>x.codigo===it.codigo?{...x,cantidad:Number(e.target.value)}:x))} /></div>
            <div className="col-span-2">C$ {Number(it.precio_unitario).toFixed(2)}</div>
            <div className="col-span-2 font-semibold">C$ {(it.cantidad*it.precio_unitario).toFixed(2)}</div>
            <div className="col-span-1 text-right"><button className="btn" onClick={()=>setCart(cart.filter(x=>x.codigo!==it.codigo))}>X</button></div></div>
        ))}
        <div className="text-right text-xl font-bold mt-3">Total: C$ {total.toFixed(2)}</div></div>
    </div>
    <div className="space-y-3">
      <div className="card p-3 space-y-2"><div className="text-lg font-bold">Pagos</div>
        {pagos.map((p,i)=>(<PaymentRow key={i} row={p} onChange={(row)=>updatePago(i,row)} onRemove={()=>setPagos(pagos.filter((_,idx)=>idx!==i))} />))}
        <button className="btn w-full" onClick={()=>setPagos([...pagos,{label:'Efectivo C$',moneda:'NIO',monto:0,tipo_cambio:1}])}>Agregar pago</button>
        <div className="text-right text-sm">Pagos totales: <b>C$ {pagosTotal.toFixed(2)}</b></div>
        <div className={`text-right text-sm ${balance>=0?'text-green-700':'text-red-700'}`}>Balance: <b>{balance.toFixed(2)}</b></div>
        <button className="btn-primary w-full" onClick={cobrar}>Cobrar</button></div>
      <Ticket ticket={ticket} />
      <div className="grid grid-cols-2 gap-2"><button className="btn" onClick={imprimirTicket}>Ticket 80mm</button><button className="btn" onClick={imprimirFactura}>Factura A4</button></div>
    </div></div>)
}