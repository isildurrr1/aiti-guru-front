import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Сюда потом добавишь цвета из Figma-макета
        // Например:
        // primary: '#5B4FE9',
        // danger: '#EF4444',
      },
      fontFamily: {
        // sans: ['Inter', 'sans-serif'], — после добавления шрифта из макета
      },
    },
  },
  plugins: [],
} satisfies Config
