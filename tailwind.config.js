/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow:{ 'soft':'0 8px 20px rgba(2,6,23,0.06), 0 2px 6px rgba(2,6,23,0.04)' },
      colors:{ brand:{50:'#eff6ff',100:'#dbeafe',600:'#1d4ed8',700:'#1e40af'} },
      borderRadius:{ '2xl':'1rem' }
    },
  },
  plugins: [],
}