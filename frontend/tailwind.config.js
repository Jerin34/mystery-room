/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        detective: {
          950: '#06090e',
          900: '#0b0f17',
          850: '#101622',
          800: '#161e2e',
          700: '#232f45',
          600: '#334155',
          amber: '#f59e0b',
          crimson: '#ef4444',
          emerald: '#10b981',
          gold: '#eab308'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
