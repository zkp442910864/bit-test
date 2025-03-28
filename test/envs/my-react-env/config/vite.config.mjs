import { defineConfig } from 'vite';

export default [
  defineConfig({}),
  defineConfig({
    build: {
      lib: {
        formats: ['umd'],
        name: 'xxx',
        fileName: 'index.umd',
        entry: './index.ts',
      }
    },
    rollupOptions: {},
  })
];
