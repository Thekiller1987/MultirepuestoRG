# MultirepuestosRG POS (PWA) – FULL

Stack: React + Vite + Tailwind + Supabase + Framer Motion + Recharts.

Incluye módulos:
- **Auth** (Supabase).
- **Catálogo**, **Productos** (CRUD), **Clientes** (CRUD), **Proveedores** (CRUD).
- **POS** con pagos mixtos, **Ticket 80mm**, **Factura A4**, **Proforma**.
- **Compras** (proveedor + moneda + TC) con detalle.
- **Cuentas** (CxC / CxP) desde vistas `v_cxc` y `v_cxp`.
- **Envíos** con cambio de estado via `set_estado_envio`.
- **Reportes** por rango (`rpc_ventas_rango`).

## Variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Netlify
- Build: `npm run build`, Publish: `dist`
- Node 20 (netlify.toml)
- SPA redirect incluido