import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'

export default function Login({ onLogged }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const login = async (e) => {
    e.preventDefault()
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else onLogged(data.session)
  }

  return (
    <div className="min-h-full grid place-items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border rounded-2xl p-6 shadow-soft">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="text-slate-500 text-sm">Personal autorizado</p>
        <form className="mt-4 space-y-3" onSubmit={login}>
          <input className="w-full border rounded-xl px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border rounded-xl px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="text-rose-600 text-sm">{error}</div>}
          <button className="w-full bg-sky-600 text-white rounded-xl py-2 hover:bg-sky-700">Ingresar</button>
        </form>
      </motion.div>
    </div>
  )
}