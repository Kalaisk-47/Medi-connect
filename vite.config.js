import { env } from 'node:process'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: env.VERCEL ? '/' : '/Medi-connect/',
  plugins: [react()],
})
