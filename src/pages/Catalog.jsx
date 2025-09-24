import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'

export default function Catalog({ onAdd }) {
  const [data, setData] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase.rpc('rpc_catalogo_publico', {})
      if (!mounted) return
      if (error) console.error(error)
      setData(data || [])
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  const filtered = data.filter(p => {
    const s = q.toLowerCase()
    return p.nombre.toLowerCase().includes(s) || (p.codigo || '').toLowerCase().includes(s)
  })

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por nombre o código..."
          className="flex-1 border rounded-xl px-3 py-2" />
      </div>

      {loading ? <div className="mt-8">Cargando...</div> :
        <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(p => (
            <ProductCard key={p.id_producto} product={p} onAdd={onAdd} />
          ))}
        </div>
      }
    </div>
  )
}