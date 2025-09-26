
# Multirepuestos RG POS – FIXED

## Variables de entorno en Netlify
Configura **Site settings → Build & deploy → Environment**:

- `VITE_SUPABASE_URL` = URL de tu proyecto
- `VITE_SUPABASE_ANON_KEY` = anon key

O edita `src/lib/supabaseClient.js` con tus credenciales.

## Tablas requeridas en Supabase
- `products` (id bigint PK, code text, name text, category text, unit text, price numeric, cost numeric, stock numeric)
- `suppliers` (id bigint PK, name text, tax_id text, phone text, email text, address text)

## Auth
- Activa **Email/Password** en `Authentication`.
- Crea un usuario y úsalo para el login.

## CSV
Formato: `code,name,category,unit,price,cost,stock`
