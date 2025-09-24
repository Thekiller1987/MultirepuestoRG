import { Link, useLocation } from 'react-router-dom'
import { LogOut, ShoppingCart, Users, Truck, BarChart3, Settings, Home, FileText, Package, Building2, ShoppingBag, DollarSign } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const tabs = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/catalog', label: 'Catálogo', icon: FileText },
  { to: '/products', label: 'Productos', icon: Package },
  { to: '/providers', label: 'Proveedores', icon: Building2 },
  { to: '/purchases', label: 'Compras', icon: ShoppingBag },
  { to: '/pos', label: 'POS', icon: ShoppingCart },
  { to: '/accounts', label: 'Cuentas', icon: DollarSign },
  { to: '/envios', label: 'Envíos', icon: Truck },
  { to: '/reports', label: 'Reportes', icon: BarChart3 },
  { to: '/settings', label: 'Ajustes', icon: Settings }
]

export default function NavBar({ user }){
  const { pathname } = useLocation()
  return (
    <div className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-3 h-14 flex items-center justify-between">
        <div className="font-bold text-lg text-brand-700">MultirepuestosRG</div>
        <nav className="flex gap-2 overflow-auto">
          {tabs.map(t=>{
            const Icon = t.icon; const active = pathname === t.to
            return (
              <Link key={t.to} to={t.to} className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${active?'bg-brand-600 text-white border-brand-600':'hover:bg-slate-50'}`}>
                <Icon size={18}/><span className="hidden md:block">{t.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden sm:block">{user?.email}</span>
          <button className="btn" onClick={()=>supabase.auth.signOut()}><LogOut size={16}/> Salir</button>
        </div>
      </div>
    </div>
  )
}