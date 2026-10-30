/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#071B35',
          800: '#0C2A4D',
          700: '#133B6A',
        },
        voyage: {
          blue: '#2367E8',
          'blue-hover': '#1B54C2',
          'blue-light': '#EAF2FF',
          bg: '#FAF8F3',
          card: '#FFFFFF',
          orange: '#F5A65B',
          'orange-hover': '#E09245',
          text: '#182338',
          muted: '#768093',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(7, 27, 53, 0.08), 0 2px 6px -1px rgba(7, 27, 53, 0.04)',
        'floating': '0 20px 40px -15px rgba(7, 27, 53, 0.15)',
        'premium': '0 10px 30px -5px rgba(35, 103, 232, 0.12)',
      }
    },
  },
  plugins: [],
}
