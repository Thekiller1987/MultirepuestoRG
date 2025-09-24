import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
export default function Login({ onReady }){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [loading,setLoading]=useState(false)
  useEffect(()=>{ supabase.auth.getSession().then(({data})=>{ if(data.session) onReady(data.session.user) })
    const { data: l } = supabase.auth.onAuthStateChange((_e, sess)=>{ if(sess) onReady(sess.user) }); return ()=>l.subscription?.unsubscribe() }, [])
  const signIn=async(e)=>{ e.preventDefault(); setLoading(true); const {error}=await supabase.auth.signInWithPassword({email,password}); if(error) alert(error.message); setLoading(false) }
  return (<div className="min-h-screen grid place-items-center">
    <form onSubmit={signIn} className="card p-6 w-full max-w-sm"><div className="text-lg font-bold mb-2">Ingresar</div>
      <input className="input mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input mb-4" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn-primary w-full" disabled={loading}>{loading?'Entrando...':'Entrar'}</button></form></div>)
}