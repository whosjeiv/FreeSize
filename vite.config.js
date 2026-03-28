import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // CRUCIAL for Electron, makes assets relative
});
