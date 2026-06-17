/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Главный бренд — глубокий бирюзово-зелёный (по референсу)
        primary: {
          DEFAULT: '#007A6E',
          light: '#0E9384',
          dark: '#00655B',
        },
        brand: {
          DEFAULT: '#007A6E',
          dark: '#00655B',
          light: '#0E9384',
          soft: '#E6F3F1',
        },
        accent: {
          DEFAULT: '#0E9384',
          light: '#2DB5A3',
        },
        sky: {
          soft: '#E6F3F1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
