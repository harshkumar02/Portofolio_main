import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // your site will live at https://harshkumar02.github.io/portofolio-harsh/
  base: '/Portofolio_main/',
})
