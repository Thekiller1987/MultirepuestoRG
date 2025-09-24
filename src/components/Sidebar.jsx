
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, FileText, Package, Building2, ShoppingBag, ShoppingCart, DollarSign, Truck, BarChart3, Settings, Menu, X, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const links = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/catalog', label: 'Catálogo', icon: FileText },
  { to: '/products', label: 'Productos', icon: Package },
  { to: '/providers', label: 'Proveedores', icon: Building2 },
  { to: '/purchases', label: 'Compras', icon: ShoppingBag },
  { to: '/pos', label: 'POS', icon: ShoppingCart },
  { to: '/accounts', label: 'Cuentas', icon: DollarSign },
  { to: '/envios', label: 'Envíos', icon: Truck },
  { to: '/reports', label: 'Reportes', icon: BarChart3 },
  { to: '/settings', label: 'Ajustes', icon: Settings },
]

function NavList({pathname, onNavigate}){
  return (
    <nav className="mt-2 flex flex-col gap-1">
      {links.map(l=>{
        const Icon = l.icon
        const active = pathname === l.to
        return (
          <Link key={l.to} to={l.to} onClick={onNavigate}
            className={'flex items-center gap-3 rounded-xl px-3 py-2 text-sm ' + (active? 'bg-brand-600 text-white' : 'hover:bg-slate-50 border')}>
            <Icon size={18} /> <span>{l.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default function Sidebar({ user }){
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Fixed sidebar (desktop) */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r z-40">
        <div className="flex-1 p-3 flex flex-col">
          <div className="h-12 flex items-center font-extrabold text-brand-700 text-lg">MultirepuestosRG</div>
          <NavList pathname={pathname} onNavigate={()=>{}} />
          <div className="mt-auto pt-3">
            <div className="text-xs text-slate-500 mb-2">{user?.email}</div>
            <button className="btn w-full" onClick={()=>supabase.auth.signOut()}><LogOut size={16}/> Cerrar sesión</button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
        <div className="h-12 px-3 flex items-center justify-between">
          <button className="btn" onClick={()=>setOpen(true)} aria-label="Abrir menú"><Menu size={18}/></button>
          <div className="font-extrabold text-brand-700">MultirepuestosRG</div>
          <div className="text-xs">{user?.email?.split('@')[0]||''}</div>
        </div>
      </div>

      {/* Drawer móvil */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 bg-black/30 z-50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)} />
            <motion.aside className="fixed top-0 bottom-0 left-0 w-72 bg-white z-50 border-r p-3" initial={{x:-300}} animate={{x:0}} exit={{x:-300}}>
              <div className="flex items-center justify-between h-12">
                <div className="font-bold text-brand-700">Menú</div>
                <button className="btn" onClick={()=>setOpen(false)}><X size={18}/></button>
              </div>
              <NavList pathname={pathname} onNavigate={()=>setOpen(false)} />
              <div className="mt-auto pt-3">
                <div className="text-xs text-slate-500 mb-2">{user?.email}</div>
                <button className="btn w-full" onClick={()=>supabase.auth.signOut()}><LogOut size={16}/> Cerrar sesión</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
