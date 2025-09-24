# Deploy Waskar POS PWA (Netlify)

## Variables de entorno
- VITE_SUPABASE_URL = https://scrwnsgkxxkogdntgggz.supabase.co
- VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcnduc2dreHhrb2dkbnRnZ2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NDIwNTYsImV4cCI6MjA3NDMxODA1Nn0.RI4XRSflR3SqAu8R2Sxtn8i7ZBKSl1Db9tMqovTzaFI

## Pasos (GitHub)
1) Asegúrate de tener en la raíz del repo: `package.json`, `index.html`, `vite.config.js`, `netlify.toml`, y las carpetas `/src` y `/public`.
2) Sube este proyecto a GitHub o actualiza el existente.
3) En Netlify → Site settings → Environment variables, crea las dos variables de arriba.
4) Deploy: `npm run build` se ejecuta automáticamente y publica `/dist`.

## Pasos (Drag & Drop sin Git)
1) En tu PC:
   ```bash
   npm install
   npm run build
   ```
2) Netlify → Add new site → Deploy manually → arrastra la carpeta `dist`.