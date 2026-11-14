import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cloudflare Pages + custom domain serve the site at the domain root (/).
// No GitHub Pages repository-prefix base path is needed.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
