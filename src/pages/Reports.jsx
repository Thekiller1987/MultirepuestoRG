import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'

export default function Reports() {
  const [data, setData] = useState([
    { day: 'Lun', total: 0 },{ day: 'Mar', total: 0 },{ day: 'Mié', total: 0 },
    { day: 'Jue', total: 0 },{ day: 'Vie', total: 0 },{ day: 'Sáb', total: 0 },{ day: 'Dom', total: 0 },
  ])

  useEffect(() => {
    const load = async () => {
      const start = new Date()
      start.setDate(start.getDate() - 6); start.setHours(0,0,0,0)
      const { data: ventas, error } = await supabase
        .from('ventas')
        .select('id_venta, fecha, total_neto')
        .gte('fecha', start.toISOString())
        .order('fecha', { ascending: true })
      if (error) return console.error(error)
      const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
      const agg = [0,0,0,0,0,0,0]
      for (const v of ventas || []) {
        const d = new Date(v.fecha).getDay()
        agg[d] += Number(v.total_neto || 0)
      }
      const arranged = [1,2,3,4,5,6,0].map(i => ({ day: days[i], total: Number(agg[i].toFixed(2)) }))
      setData(arranged)
    }
    load()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-lg font-bold mb-2">Ventas últimos 7 días</div>
      <div className="bg-white border rounded-2xl shadow-soft p-2">
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}