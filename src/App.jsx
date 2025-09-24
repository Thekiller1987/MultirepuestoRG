import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Login from './pages/Login'
import NavBar from './components/NavBar'
import Catalog from './pages/Catalog'
import POS from './pages/POS'
import Picking from './pages/Picking'
import Reports from './pages/Reports'
import { motion } from 'framer-motion'

export default function App() {
  const [session, setSession] = useState(null)
  const [tab, setTab] = useState('catalog')
  const [cart, setCart] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!session) return <Login onLogged={setSession} />

  const onAdd = (product) => {
    setCart(prev => {
      const f = prev.find(i => i.codigo === product.codigo)
      if (f) return prev.map(i => i.codigo === product.codigo ? { ...i, cantidad: i.cantidad + 1 } : i)
      return [...prev, { codigo: product.codigo, nombre: product.nombre, precio_unitario: Number(product.precio_unitario), cantidad: 1 }]
    })
  }

  return (
    <div className="min-h-full">
      <NavBar tab={tab} setTab={setTab} onSignOut={() => supabase.auth.signOut()} />
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-4">
        {tab === 'catalog' && <Catalog onAdd={onAdd} />}
        {tab === 'pos' && <POS />}
        {tab === 'picking' && <Picking />}
        {tab === 'reports' && <Reports />}
      </motion.div>
    </div>
  )
}