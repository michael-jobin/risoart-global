import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from "autoprefixer";
import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/global/',
  plugins: [react(), glsl()],
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
})
