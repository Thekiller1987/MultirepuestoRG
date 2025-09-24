import { useState } from 'react'
import CartDrawer from '../components/CartDrawer'
import Ticket from '../components/Ticket'
import { supabase } from '../lib/supabaseClient'

export default function POS() {
  const [cart, setCart] = useState([])
  const [open, setOpen] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [ventaId, setVentaId] = useState(null)
  const [loading, setLoading] = useState(false)

  const addByScan = async (e) => {
    if (e.key !== 'Enter') return
    const code = e.target.value.trim()
    e.target.value = ''
    if (!code) return

    const { data, error } = await supabase.rpc('rpc_catalogo_publico', {})
    if (error) return
    const prod = (data || []).find(p => (p.codigo || '').toLowerCase() === code.toLowerCase())
    if (!prod) return alert('Producto no encontrado')
    setCart(prev => {
      const f = prev.find(i => i.codigo === prod.codigo)
      if (f) return prev.map(i => i.codigo === prod.codigo ? { ...i, cantidad: i.cantidad + 1 } : i)
      return [...prev, { codigo: prod.codigo, nombre: prod.nombre, precio_unitario: Number(prod.precio_unitario), cantidad: 1 }]
    })
  }

  const onAdd = (p) => {
    setCart(prev => {
      const f = prev.find(i => i.codigo === p.codigo)
      if (f) return prev.map(i => i.codigo === p.codigo ? { ...i, cantidad: i.cantidad + 1 } : i)
      return [...prev, { codigo: p.codigo, nombre: p.nombre, precio_unitario: Number(p.precio_unitario), cantidad: 1 }]
    })
    setOpen(true)
  }

  const checkout = async (total) => {
    try {
      setLoading(true)
      const { data: idVenta, error: e1 } = await supabase.rpc('rpc_iniciar_venta', { p_id_cliente: null, p_obs: 'POS PWA' })
      if (e1) throw e1
      setVentaId(idVenta)
      for (const it of cart) {
        const { error: e2 } = await supabase.rpc('rpc_agregar_item', {
          p_id_venta: idVenta, p_codigo: it.codigo, p_cantidad: it.cantidad, p_precio: it.precio_unitario
        })
        if (e2) throw e2
      }
      const { error: e3 } = await supabase.rpc('rpc_cobrar_venta', { p_id_venta: idVenta, p_id_metodo: 1, p_monto: total, p_ref: 'PWA' })
      if (e3) throw e3
      const { data: tk, error: e4 } = await supabase.rpc('rpc_ticket_simple', { p_id_venta: idVenta })
      if (e4) throw e4
      setTicket(tk)
      setCart([])
      setOpen(false)
    } catch (err) {
      alert('Error en cobro: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="rounded-2xl border bg-white p-4 shadow-soft">
        <div className="font-semibold mb-2">Escanear / introducir código y Enter</div>
        <input onKeyDown={addByScan} placeholder="Código de barras o interno"
          className="w-full border rounded-xl px-3 py-2" />
      </div>

      <CartDrawer open={open} setOpen={setOpen} cart={cart} setCart={setCart} onCheckout={checkout} />
      {loading && <div>Procesando...</div>}
      {ticket && <Ticket data={ticket} />}
    </div>
  )
}