/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          green:  '#22c55e',
          dark:   '#0b1120',
          card:   '#111827',
          border: '#1e2d3d',
          muted:  '#64748b',
        }
      }
    },
  },
  plugins: [],
}
