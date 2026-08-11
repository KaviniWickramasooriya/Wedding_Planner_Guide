/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        note: {
          yellow: '#fef3c7',
          red: '#ffe4e6',
          blue: '#e0f2fe',
          green: '#dcfce7',
          purple: '#f3e8ff',
          pink: '#fce7f3'
        }
      }
    },
  },
  plugins: [],
}