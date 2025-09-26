import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function POS(){
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, code, name, unit, price, stock')
        .order('name');
      if (!error) setProducts(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(()=>{
    const q = (query || '').toLowerCase().trim();
    if (!q) return products;
    return products.filter(p =>
      (p.code || '').toLowerCase().includes(q) ||
      (p.name || '').toLowerCase().includes(q)
    );
  },[products, query]);

  const addToCart = (p) => {
    setCart(cs => {
      const idx = cs.findIndex(x => x.id === p.id);
      if (idx >= 0) {
        const c = [...cs];
        c[idx].qty = (c[idx].qty || 1) + 1;
        return c;
      }
      return [...cs, { ...p, qty: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  const total = useMemo(()=> cart.reduce((s,i)=> s + (i.qty * (i.price || 0)), 0), [cart]);

  const checkout = async () => {
    if (cart.length === 0) return;
    for (const it of cart) {
      const qty = it.qty || 1;
      const { error } = await supabase.from('stock_movements').insert({
        product_id: it.id,
        type: 'sale',
        qty,
        price: it.price || 0,
        note: 'Venta POS',
        code: 'POS'
      });
      if (error) {
        alert('Error al registrar venta: ' + error.message);
        return;
      }
    }

    const html = `<html><head><title>Ticket</title>
      <style>body{font-family:monospace;padding:12px}</style></head><body>
      <h3>Multirepuestos RG</h3>
      <div>${new Date().toLocaleString()}</div>
      <hr/>
      ${cart.map(i => `<div>${i.qty} x ${i.name} — C$${(i.price||0).toFixed(2)}</div>`).join('')}
      <hr/>
      <div><b>Total: C$${total.toFixed(2)}</b></div>
    </body></html>`;
    const w = window.open('', 'print');
    w.document.write(html); w.document.close(); w.focus(); w.print();

    setCart([]);

    const { data } = await supabase
      .from('products')
      .select('id, code, name, unit, price, stock')
      .order('name');
    setProducts(data || []);
  };

  const onKeyDownSearch = (e) => {
    if (e.key === 'Escape') setQuery('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-400">Punto de Venta</h1>
        <div className="badge">Productos: {products.length}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <label className="block text-xs text-gray-300 mb-1">Buscar</label>
          <input
            className="input"
            placeholder="Buscar por código (ESC para limpiar) o nombre"
            value={query}
            onChange={e=>setQuery(e.target.value)}
            onKeyDown={onKeyDownSearch}
          />

          <div className="mt-3 max-h-96 overflow-y-auto divide-y divide-gray-800">
            {loading && (
              <div className="py-3 text-sm text-gray-400">Cargando productos...</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="py-3 text-sm text-gray-400">Producto no encontrado. Verifica el código o nombre.</div>
            )}

            {filtered.map(p => (
              <div
                key={p.id}
                className="py-2 flex justify-between items-center hover:bg-gray-800 rounded-lg px-2 cursor-pointer"
                onClick={()=>addToCart(p)}
                title="Click para agregar al carrito"
              >
                <div className="flex flex-col">
                  <div className="font-medium">{p.code} — {p.name}</div>
                  <div className="text-xs text-gray-400">
                    Unidad: {p.unit} {typeof p.stock !== 'undefined' && <span className="ml-2 badge">Stock: {p.stock ?? 0}</span>}
                  </div>
                </div>
                <div className="text-blue-300 font-semibold">C${(p.price || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-blue-400">Carrito</h2>
            <button type="button" className="btn-amber" onClick={clearCart} disabled={cart.length===0}>
              Vaciar
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {cart.length === 0 && (
              <div className="text-sm text-gray-400">Aún no hay productos. Agrega desde la lista de la izquierda.</div>
            )}

            {cart.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 py-2 border-b border-gray-700">
                <div className="flex-1">{it.name}</div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="btn-amber px-2 py-1"
                    onClick={() =>
                      setCart(cs => {
                        const c = [...cs];
                        c[idx].qty = Math.max(1, (c[idx].qty || 1) - 1);
                        return c;
                      })
                    }
                  >
                    −
                  </button>

                  <input
                    className="input w-20 text-center"
                    type="number"
                    min="1"
                    value={it.qty || 1}
                    onChange={e => {
                      const v = Math.max(1, +e.target.value || 1);
                      setCart(cs => {
                        const c = [...cs];
                        c[idx].qty = v;
                        return c;
                      });
                    }}
                  />

                  <button
                    type="button"
                    className="btn-amber px-2 py-1"
                    onClick={() =>
                      setCart(cs => {
                        const c = [...cs];
                        c[idx].qty = (c[idx].qty || 1) + 1;
                        return c;
                      })
                    }
                  >
                    +
                  </button>
                </div>

                <div className="w-28 text-right">C${((it.price || 0) * (it.qty || 1)).toFixed(2)}</div>

                <button
                  type="button"
                  className="btn px-2 py-1"
                  onClick={() => setCart(cs => cs.filter((_, i) => i !== idx))}
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 text-right text-lg font-bold">
            Total: <span className="text-amber-400">C${total.toFixed(2)}</span>
          </div>

          <div className="mt-3 flex gap-2">
            <button type="button" className="btn flex-1" onClick={checkout} disabled={cart.length===0}>
              Cobrar e imprimir
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Tip: escanea o escribe el código y presiona <span className="badge">Enter</span> para filtrar; <span className="badge">ESC</span> limpia la búsqueda.
      </p>
    </div>
  );
}
