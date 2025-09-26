import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function POS(){
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const checkout = async () => {
    if (cart.length===0) return;
    // Inserta movimientos de salida (la BD hará el cálculo de stock)
    for (const it of cart) {
      const qty = it.qty||1;
      await supabase.from('stock_movements').insert({
        product_id: it.id, type: 'sale', qty: qty, price: it.price||0, note: 'Venta POS'
      });
    }
    // Ticket de impresión
    const html = `<html><head><title>Ticket</title><style>body{font-family:monospace;padding:12px}</style></head><body>
      <h3>Multirepuestos RG</h3>
      <div>${new Date().toLocaleString()}</div>
      <hr/>${cart.map(i=>`<div>${i.qty} x ${i.name} — C$${(i.price||0).toFixed(2)}</div>`).join('')}
      <hr/><div><b>Total: C$${cart.reduce((s,i)=>s + (i.qty*(i.price||0)),0).toFixed(2)}</b></div>
    </body></html>`;
    const w = window.open('', 'print'); w.document.write(html); w.document.close(); w.focus(); w.print();
    setCart([]);
    // refrescar productos
    const { data } = await supabase.from('products').select('*').order('name');
    setProducts(data||[]);
  };



  useEffect(()=>{
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('id, code, name, unit, price');
      if (!error) setProducts(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase();
    if(!q) return products;
    return products.filter(p =>
      (p.code||'').toLowerCase().includes(q) || (p.name||'').toLowerCase().includes(q)
    );
  }, [products, query]);

  const addToCart = (p) => {
    setCart(cs => {
      const idx = cs.findIndex(x=>x.id===p.id);
      if (idx>=0) { const c=[...cs]; c[idx].qty += 1; return c; }
      return [...cs, { ...p, qty:1 }];
    });
  };

  const total = cart.reduce((s,i)=> s + (i.qty * (i.price||0)), 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">POS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <input className="input" placeholder="Buscar por código (ESC para limpiar) o descripción" value={query} onChange={e=>setQuery(e.target.value)} />
          <div className="mt-3 max-h-80 overflow-y-auto divide-y divide-gray-800">
            {loading && <div className="py-3 text-sm text-gray-400">Cargando productos...</div>}
            {!loading && filtered.length===0 && <div className="py-3 text-sm text-red-300">Producto no encontrado. Verifica el código o nombre.</div>}
            {filtered.map(p=>(
              <div key={p.id} className="py-2 flex justify-between items-center hover:bg-gray-800 rounded-lg px-2 cursor-pointer"
                   onClick={()=>addToCart(p)}>
                <div>
                  <div className="font-medium">{p.code} — {p.name}</div>
                  <div className="text-xs text-gray-400">{p.unit || 'UND'}</div>
                </div>
                <div className="font-semibold">C${(p.price||0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="font-semibold mb-2">Carrito</div>
          {cart.length===0 && <div className="text-sm text-gray-400">Agrega productos con un click desde la lista.</div>}
          {cart.map((it,idx)=>(
            <div key={it.id} className="grid grid-cols-5 gap-2 items-center mb-2">
              <div className="col-span-2">{it.name}</div>
              <input type="number" className="input" value={it.qty} min={1}
                     onChange={e=>{
                       const v = Math.max(1, +e.target.value||1);
                       setCart(cs=>{const c=[...cs]; c[idx].qty=v; return c;});
                     }} />
              <div>C${(it.price||0).toFixed(2)}</div>
              <button className="btn" onClick={()=> setCart(cs=> cs.filter((_,i)=>i!==idx))}>Quitar</button>
            </div>
          ))}
          <div className="mt-3 text-right text-lg font-bold">Total: C${total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
