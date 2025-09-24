import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Catalog from './pages/Catalog'
import Products from './pages/Products'
import Providers from './pages/Providers'
import Purchases from './pages/Purchases'
import POS from './pages/POS'
import Accounts from './pages/Accounts'
import Envios from './pages/Envios'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

export default function App(){
  const [user,setUser]=useState(null); const navigate=useNavigate()
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{ setUser(data.session?.user||null); if(!data.session) navigate('/login') })
    const { data: listener } = supabase.auth.onAuthStateChange((_e,sess)=>{ setUser(sess?.user||null); if(sess) navigate('/'); else navigate('/login') })
    return ()=>listener.subscription?.unsubscribe()
  },[])
  if(!user) return <Routes><Route path="/login" element={<Login onReady={setUser}/>} /></Routes>
  return (<div><NavBar user={user}/>
    <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/catalog" element={<Catalog/>} />
      <Route path="/products" element={<Products/>} />
      <Route path="/providers" element={<Providers/>} />
      <Route path="/purchases" element={<Purchases/>} />
      <Route path="/pos" element={<POS/>} />
      <Route path="/accounts" element={<Accounts/>} />
      <Route path="/envios" element={<Envios/>} />
      <Route path="/reports" element={<Reports/>} />
      <Route path="/settings" element={<Settings/>} />
      <Route path="*" element={<Dashboard/>} />
    </Routes></div>)
}