import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    /** פורט קבוע — כדי שמנהרות (localtunnel / cloudflared) לא יפנו לפורט הלא נכון */
    port: 5175,
    strictPort: true,
  },
})
