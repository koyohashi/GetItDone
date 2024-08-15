import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      // Change from buildEnd to writeBundle for more reliability
      writeBundle() {
        const source = resolve(__dirname, 'manifest.json');
        const destination = resolve(__dirname, 'dist', 'manifest.json');
        fs.copyFileSync(source, destination);
    }
  }
  ],
  build: {
    rollupOptions: {
      input: {
        popup: 'index.html',
        background: 'src/background.jsx',
        content: 'src/index.jsx'
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
