import { X } from 'lucide-react'

export default function CartDrawer({ open, setOpen, cart, setCart, onCheckout }) {
  const total = cart.reduce((acc, it) => acc + (it.precio_unitario * it.cantidad), 0)
  const remove = (codigo) => setCart(prev => prev.filter(i => i.codigo !== codigo))
  const inc = (codigo, d) => setCart(prev => prev.map(i => i.codigo === codigo ? { ...i, cantidad: Math.max(1, i.cantidad + d) } : i))

  return (
    <div className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/30 transition ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
      <div className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white border p-4 transition transform ${open ? '' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <div className="font-bold text-lg">Carrito</div>
          <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-slate-100"><X/></button>
        </div>
        <div className="mt-4 space-y-3 max-h-[70vh] overflow-auto pr-1">
          {cart.length === 0 && <div className="text-slate-500">Vacío</div>}
          {cart.map(item => (
            <div key={item.codigo} className="border rounded-xl p-3 flex items-center justify-between">
              <div className="w-9/12">
                <div className="font-medium">{item.nombre}</div>
                <div className="text-xs text-slate-500">{item.codigo}</div>
                <div className="text-sm mt-1">C$ {(item.precio_unitario).toFixed(2)} x {item.cantidad}</div>
              </div>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded-lg bg-slate-100" onClick={() => inc(item.codigo, -1)}>-</button>
                <div className="min-w-[2ch] text-center">{item.cantidad}</div>
                <button className="px-2 py-1 rounded-lg bg-slate-100" onClick={() => inc(item.codigo, +1)}>+</button>
              </div>
              <button className="ml-2 text-rose-600" onClick={() => remove(item.codigo)}>Quitar</button>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-3">
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span> <span>C$ {total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => onCheckout(total)}
            disabled={cart.length === 0}
            className="mt-3 w-full bg-emerald-600 text-white rounded-xl py-2 disabled:opacity-50">
            Cobrar
          </button>
        </div>
      </div>
    </div>
  )
}