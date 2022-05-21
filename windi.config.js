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
          dark: 'var(--color-primary-dark)',
        },
        background: {
          DEFAULT: 'var(--color-background)',
          light: 'var(--color-background-light)',
          lighter: 'var(--color-background-lighter)',
        },
        spotify: {
          DEFAULT: 'var(--color-spotify)',
          dark: 'var(--color-spotify-dark)',
        },
        hover: {
          light: 'var(--color-hover-light)',
        },
        black: 'var(--color-black)',
        white: 'var(--color-white)',
      },
    },
  },
});
