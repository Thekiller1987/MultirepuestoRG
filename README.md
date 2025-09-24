# Waskar POS PWA (Supabase)

**Stack:** React + Vite + Tailwind + Supabase + Framer Motion + Recharts  
**Funciones:** Login, Catálogo (RPC `rpc_catalogo_publico`), POS (carrito, cobro), Ticket, Picking.

## Configuración
1. Copia `.env.example` a `.env` y pon tus claves de Supabase:
   ```
   VITE_SUPABASE_URL=https://scrwnsgkxxkogdntgggz.supabase.co
   VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
   ```
2. Instala dependencias y ejecuta:
   ```
   npm install
   npm run dev
   ```
3. **PWA**: manifest + service worker incluidos.

## Build & Deploy (Netlify)
- Build command: `npm run build`
- Publish directory: `dist`
- Variables de entorno: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `netlify.toml` ya configura Node 20 y redirect SPA.