import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Your site lives at https://<your-username>.github.io/Portofolio_main/
  // so the public base path must match the repo folder exactly (case-sensitive)
  base: '/Portofolio_main/',
})
