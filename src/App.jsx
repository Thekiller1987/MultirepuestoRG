import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import POS from './components/pos/POS.jsx';
import ProductList from './components/products/ProductList.jsx';
import ProviderList from './components/providers/ProviderList.jsx';
import ImportCSV from './components/importer/ImportCSV.jsx';

const NavItem = ({to,children}) => (
  <NavLink to={to} className={({isActive})=>`px-3 py-2 rounded-lg ${isActive?'bg-accent text-black':'bg-gray-800 hover:bg-gray-700'}`}>
    {children}
  </NavLink>
);

export default function App(){
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 p-4 space-y-2 bg-black/60">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="logo" className="w-10 h-10 rounded-md" onError={(e)=>{e.currentTarget.style.display='none';}}/>
          <div className="text-lg font-bold">Multirepuestos RG</div>
        </div>
        <nav className="flex flex-col gap-2">
          <NavItem to="/">POS</NavItem>
          <NavItem to="/productos">Productos</NavItem>
          <NavItem to="/proveedores">Proveedores</NavItem>
          <NavItem to="/importar">Importar CSV</NavItem>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<POS/>} />
          <Route path="/productos" element={<ProductList/>} />
          <Route path="/proveedores" element={<ProviderList/>} />
          <Route path="/importar" element={<ImportCSV/>} />
        </Routes>
      </main>
    </div>
  );
}
