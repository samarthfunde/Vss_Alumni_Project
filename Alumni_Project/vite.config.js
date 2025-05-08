// // vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react'; // or whatever framework you're using

// export default defineConfig({
//   plugins: [react()],

// });


// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // for React support

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // allow access from any device on the same network
    port: 5173,       // you can change this if needed
  },
});