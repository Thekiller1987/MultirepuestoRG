import { motion } from 'framer-motion'

export default function ProductCard({ product, onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-white p-4 shadow-soft hover:shadow-lg transition">
      <div className="font-semibold line-clamp-2">{product.nombre}</div>
      <div className="text-sm text-slate-500">{product.codigo}</div>
      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-sky-700 font-bold text-xl">C$ {Number(product.precio_unitario).toFixed(2)}</div>
        <div className={`text-xs px-2 py-1 rounded-full ${product.stock_actual > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          Stock: {product.stock_actual ?? 0}
        </div>
      </div>
      <button
        onClick={() => onAdd(product)}
        className="mt-4 w-full bg-sky-600 text-white rounded-xl py-2 hover:bg-sky-700">
        Agregar
      </button>
    </motion.div>
  )
}