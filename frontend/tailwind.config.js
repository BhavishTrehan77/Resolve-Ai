/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7dbfe',
          300: '#a4c4fd',
          400: '#7aa3fb',
          500: '#527cf6',
          600: '#385eed',
          700: '#2b47d9',
          800: '#273bb0',
          900: '#24358b',
          950: '#172054',
        }
      }
    },
  },
  plugins: [],
}
