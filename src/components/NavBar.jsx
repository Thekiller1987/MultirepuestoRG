import { LogOut, Package, ShoppingCart, Table2, ChartBar } from "lucide-react"

export default function NavBar({ tab, setTab, onSignOut }) {
  const tabs = [
    { id: 'catalog', label: 'Catálogo', icon: Table2 },
    { id: 'pos', label: 'POS', icon: ShoppingCart },
    { id: 'picking', label: 'Picking', icon: Package },
    { id: 'reports', label: 'Reportes', icon: ChartBar },
  ]
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-3 py-2">
        <div className="text-xl font-bold">Waskar POS</div>
        <div className="hidden md:flex gap-2">
          {tabs.map(t => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-2 rounded-xl flex items-center gap-2 transition ${active ? 'bg-sky-600 text-white shadow-soft' : 'hover:bg-slate-100'}`}>
                <Icon size={18} /> {t.label}
              </button>
            )
          })}
        </div>
        <button onClick={onSignOut} className="px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2">
          <LogOut size={18}/> Salir
        </button>
      </div>
      <div className="md:hidden grid grid-cols-4 gap-1 px-2 pb-2">
        {tabs.map(t => {
          const Icon = t.icon; const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`py-2 rounded-xl text-sm ${active ? 'bg-sky-600 text-white' : 'bg-white border hover:bg-slate-50'}`}>
              <div className="flex items-center justify-center gap-1">
                <Icon size={16}/> {t.label}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}