import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setMsg(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6">
      <form onSubmit={signIn} className="w-full max-w-md space-y-4 bg-gray-900 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <div>
          <label className="block text-sm mb-1">Correo electrónico</label>
          <input className="input w-full" type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="tucorreo@empresa.com"/>
        </div>
        <div>
          <label className="block text-sm mb-1">Contraseña</label>
          <input className="input w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"/>
        </div>
        <button className="btn w-full" type="submit" disabled={loading}>{loading ? 'Ingresando…' : 'Entrar'}</button>
        {msg && <p className="text-sm text-red-400">{msg}</p>}
      </form>
    </div>
  );
}
