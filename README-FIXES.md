
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

### Tabla de movimientos de stock (Kardex)
Crea esta tabla para registrar ventas/importaciones:

- `stock_movements` (
  id bigserial pk,
  product_id bigint references products(id) on delete cascade,
  type text check (type in ('sale','import','adjust')),
  qty integer not null,
  price numeric default 0,
  note text,
  created_at timestamptz default now()
)

> El POS descuenta stock e inserta un movimiento `sale` por ítem vendido.

### Roles (UI)
Para bloquear acciones a no-admins, pon en el usuario (en Supabase → Users → Edit user → User metadata) la clave:
```json
{ "role": "admin" }
```
Si **no** tiene `role: "admin"`, el botón **Eliminar** aparece deshabilitado.
