// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  build: {
    // lib: {
    //   // Could also be a dictionary or array of multiple entry points
    //   entry: resolve(__dirname, 'headlight.html'),
    //   name: 'audi-headlight',
    //   // the proper extensions will be added
    //   fileName: 'audi-headlight',
    // },
    plugins: [
      legacy({
        targets: ['defaults', 'not IE 11']
      }),
    ],
  },
})
