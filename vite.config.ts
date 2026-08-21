import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' // <-- Import the Tailwind plugin

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(), // <-- Add it to the plugins array
  ],
})
