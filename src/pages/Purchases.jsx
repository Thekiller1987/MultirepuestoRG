import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Purchases(){
  const [providers, setProviders] = useState([])
  const [form, setForm] = useState({ id_proveedor:'', moneda:'NIO', tipo_cambio:36 })
  const [items, setItems] = useState([])
  const [catalog, setCatalog] = useState([])

  useEffect(()=>{
    supabase.from('proveedores').select('id_proveedor,nombre').then(({data})=>setProviders(data||[]))
    supabase.from('productos').select('codigo,nombre,precio_unitario').then(({data})=>setCatalog(data||[]))
  }, [])

  const addCode = (e)=>{
    if(e.key!=='Enter') return
    const code = e.target.value.trim(); e.target.value=''
    const p = catalog.find(x=>x.codigo?.toLowerCase()===code.toLowerCase())
    if(!p) { alert('Producto no encontrado'); return }
    setItems(prev=>{
      const f = prev.find(i=>i.codigo===p.codigo)
      if(f) return prev.map(i=>i.codigo===p.codigo?{...i, cantidad:i.cantidad+1}:i)
      return [...prev, { codigo:p.codigo, nombre:p.nombre, costo:Number(p.precio_unitario)||0, cantidad:1 }]
    })
  }

  const total = useMemo(()=> items.reduce((a,b)=>a + b.cantidad*b.costo,0), [items])

  const guardarCompra = async ()=>{
    if(!form.id_proveedor) { alert('Selecciona proveedor'); return }
    if(items.length===0) { alert('Agrega ítems'); return }

    const { data: compra, error: e1 } = await supabase.from('compras')
      .insert({ id_proveedor: form.id_proveedor, moneda: form.moneda, tipo_cambio: Number(form.tipo_cambio)||1, total_neto: total })
      .select('id_compra').single()
    if(e1) { alert(e1.message); return }

    const detalles = items.map(it=>({
      id_compra: compra.id_compra,
      codigo: it.codigo,
      cantidad: it.cantidad,
      costo_unitario: it.costo,
      subtotal: it.cantidad * it.costo
    }))

    const { error: e2 } = await supabase.from('compra_detalle').insert(detalles)
    if(e2) { alert(e2.message); return }

    alert('Compra registrada.')
    setItems([])
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-3">
      <div className="card p-3 grid md:grid-cols-4 gap-2">
        <div>
          <label className="text-xs text-slate-600">Proveedor</label>
          <select className="input" value={form.id_proveedor} onChange={e=>setForm({...form, id_proveedor: Number(e.target.value)})}>
            <option value="">Seleccionar...</option>
            {providers.map(p=><option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-600">Moneda</label>
          <select className="input" value={form.moneda} onChange={e=>setForm({...form, moneda: e.target.value})}>
            <option value="NIO">C$ NIO</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-600">Tipo de cambio</label>
          <input type="number" step="0.0001" className="input" value={form.tipo_cambio} onChange={e=>setForm({...form, tipo_cambio: e.target.value})} />
        </div>
        <div className="flex items-end">
          <button className="btn w-full" onClick={guardarCompra}>Guardar compra</button>
        </div>
      </div>

      <div className="card p-3">
        <div className="font-semibold mb-2">Escanear / código + Enter</div>
        <input className="input" onKeyDown={addCode} placeholder="Código de barras o interno" />
        <div className="mt-3">
          {items.map(it=>(
            <div key={it.codigo} className="grid grid-cols-12 gap-2 border-b py-2">
              <div className="col-span-5">
                <div className="font-medium">{it.nombre}</div>
                <div className="text-xs text-slate-600">{it.codigo}</div>
              </div>
              <div className="col-span-2">
                <input type="number" className="input" value={it.cantidad} onChange={e=>setItems(items.map(x=>x.codigo===it.codigo?{...x, cantidad: Number(e.target.value)}:x))} />
              </div>
              <div className="col-span-3">
                <input type="number" step="0.01" className="input" value={it.costo} onChange={e=>setItems(items.map(x=>x.codigo===it.codigo?{...x, costo: Number(e.target.value)}:x))} />
              </div>
              <div className="col-span-2 font-semibold text-right">C$ {(it.cantidad*it.costo).toFixed(2)}</div>
            </div>
          ))}
          <div className="text-right text-xl font-bold mt-3">Total compra: C$ {total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}