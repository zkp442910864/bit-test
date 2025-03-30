import { defineConfig } from 'vite';

export default [
  defineConfig({}),
  defineConfig({
    build: {
      lib: {
        formats: ['umd'],
        name: 'xxx',
      }
    },
    rollupOptions: {},
  })
];
