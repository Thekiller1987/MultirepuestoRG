# Multirepuestos RG POS FULL

![Logo](public/logo.png)

Sistema de gestión de ventas, inventario, cuentas y reportes para **Multirepuestos RG**.

### 🚀 Stack
- React + Vite + Tailwind
- Supabase (Auth, DB, RLS)
- Framer Motion + Recharts
- PWA (Service Worker + Update Prompt)

### 📦 Módulos incluidos
- POS con pagos mixtos, crédito, proformas, pedidos/envíos
- Clientes (CRUD, CxC)
- Proveedores (CRUD, CxP)
- Compras (con facturas por pagar)
- Inventario (Kardex, ajustes, transferencias)
- Reportes (ventas, compras, margen, top productos/clientes/vendedores)
- Administración (empresa, impuestos, series, reglas)
- Historial/Auditoría de movimientos

### ⚙️ Instalación
```bash
npm install
npm run dev
```

### ☁️ Deploy en Netlify
1. Subir este proyecto a GitHub.
2. Conectar el repositorio en Netlify.
3. Build command: `npm run build`
4. Publish directory: `dist`

Cada push a GitHub desplegará automáticamente la aplicación.
