import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import POS from './components/pos/POS.jsx';
import ProductList from './components/products/ProductList.jsx';
import ProviderList from './components/providers/ProviderList.jsx';
import ImportCSV from './components/importer/ImportCSV.jsx';
import InventoryAdjust from './components/inventory/InventoryAdjust.jsx';
import ImportSuppliers from './components/importer/ImportSuppliers.jsx';
import Login from './auth/Login.jsx';
import { supabase } from './lib/supabaseClient';

const NavItem = ({to,children}) => (
  <NavLink to={to} className={({isActive})=>`px-3 py-2 rounded-lg text-sm ${isActive?'bg-amber-400 text-black':'bg-gray-800 hover:bg-gray-700'}`}>
    {children}
  </NavLink>
);

export default function App(){
  const [session, setSession] = useState(null);

  useEffect(()=>{
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  },[]);

  if (!session) {
    return <Login/>;
  }

  const logout = async () => { await supabase.auth.signOut(); };

  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-100">
      <aside className="w-60 p-4 space-y-4 bg-gray-900">
        <div className="text-lg font-semibold">Multirepuestos RG</div>
        <nav className="flex flex-col gap-2">
          <NavItem to="/">POS</NavItem>
          <NavItem to="/productos">Productos</NavItem>
          <NavItem to="/proveedores">Proveedores</NavItem>
          <NavItem to="/importar">Importar CSV</NavItem>
          <NavItem to="/inventario">Inventario</NavItem>
          <NavItem to="/importar-proveedores">Importar Proveedores</NavItem>
        </nav>
        <button onClick={logout} className="btn w-full mt-6">Cerrar sesión</button>
      </aside>
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<POS/>} />
          <Route path="/productos" element={<ProductList/>} />
          <Route path="/proveedores" element={<ProviderList/>} />
          <Route path="/importar" element={<ImportCSV/>} />
          <Route path="/inventario" element={<InventoryAdjust/>} />
          <Route path="/importar-proveedores" element={<ImportSuppliers/>} />
        </Routes>
      </main>
    </div>
  );
}