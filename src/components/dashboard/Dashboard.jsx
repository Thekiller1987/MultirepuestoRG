import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Dashboard(){
  const [today, setToday] = useState({ ventas: 0, ingresos: 0, costo: 0, ganancia: 0 });
  const [ventasHoy, setVentasHoy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async ()=>{
      setLoading(true);
      const r1 = await supabase.from('vw_ventas_dia_resumen').select('*').single();
      if (!r1.error && r1.data) setToday(r1.data);
      const r2 = await supabase.from('vw_ventas_dia_detalle').select('*').order('hora', { ascending:false });
      if (!r2.error && r2.data) setVentasHoy(r2.data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Panel de hoy</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card"><div className="text-xs text-gray-400">Ventas</div><div className="text-2xl font-bold">{today.ventas||0}</div></div>
        <div className="card"><div className="text-xs text-gray-400">Ingresos</div><div className="text-2xl font-bold text-amber-400">C${Number(today.ingresos||0).toFixed(2)}</div></div>
        <div className="card"><div className="text-xs text-gray-400">Costo</div><div className="text-2xl font-bold">C${Number(today.costo||0).toFixed(2)}</div></div>
        <div className="card"><div className="text-xs text-gray-400">Ganancia</div><div className="text-2xl font-bold text-blue-300">C${Number(today.ganancia||0).toFixed(2)}</div></div>
      </div>

      {/* Ventas de hoy */}
      <div className="card">
        <div className="text-sm font-semibold mb-2">Ventas de hoy</div>
        {loading && <div className="text-sm text-gray-400">Cargando…</div>}
        {!loading && ventasHoy.length === 0 && <div className="text-sm text-gray-400">Sin ventas registradas hoy.</div>}
        <div className="max-h-72 overflow-y-auto divide-y divide-gray-800">
          {ventasHoy.map(v => (
            <div key={v.id_venta} className="py-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">{v.hora}</span>
              <span className="flex-1 px-2">{v.items} ítems</span>
              <span className="w-28 text-right">C${Number(v.total).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
