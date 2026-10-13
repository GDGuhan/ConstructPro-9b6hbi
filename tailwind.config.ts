import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFC107',
          black: '#000000',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'yellow': '0 4px 24px rgba(255,193,7,0.25)',
        'card': '0 2px 12px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
} satisfies Config;
