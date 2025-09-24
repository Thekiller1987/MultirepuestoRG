import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL || 'https://scrwnsgkxxkogdntgggz.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcnduc2dreHhrb2dkbnRnZ2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NDIwNTYsImV4cCI6MjA3NDMxODA1Nn0.RI4XRSflR3SqAu8R2Sxtn8i7ZBKSl1Db9tMqovTzaFI'
if(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY){
  console.warn('Usando variables por defecto. Configura VITE_SUPABASE_URL/ANON_KEY en Netlify para prod.')
}
export const supabase = createClient(url, key)