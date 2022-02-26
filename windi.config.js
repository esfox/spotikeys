import { defineConfig } from 'vite-plugin-windicss';

export default defineConfig({
  theme: {
    extend: {
      screens: {
        sm: '500px'
      },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
        },
        background: {
          DEFAULT: 'var(--color-background)',
        },
        spotify: 'var(--color-spotify)',
      },
    },
  },
});
