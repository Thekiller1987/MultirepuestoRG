import { useEffect, useState } from 'react'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'

export default function Reports() {
  const [data, setData] = useState([
    { day: 'Lun', total: 0 },{ day: 'Mar', total: 0 },{ day: 'Mié', total: 0 },
    { day: 'Jue', total: 0 },{ day: 'Vie', total: 0 },{ day: 'Sáb', total: 0 },{ day: 'Dom', total: 0 },
  ])
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-lg font-bold mb-2">Ventas de la semana</div>
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