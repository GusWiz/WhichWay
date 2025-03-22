import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  define: {
    'process.env': {}, // This defines `process.env` as an empty object
  },
  plugins: [react()],
});
