/** @type {import('tailwindcss').Config} */
const twColors = require('tailwindcss/colors');

const colors = {
  transparent: twColors.transparent,
  black: '#3B404A',
  // gray: 'bbbbbb', // Replaced to support shades
  gray: twColors.neutral, // Or twColors.gray, twColors.slate, twColors.stone, twColors.zinc - choose your preferred gray palette
                         // Using neutral as a common modern choice, twColors.gray is also a good default.
  while: twColors.white, // Unchanged as requested
  primary: '#FF9902',
  search: '#00FF00',
  secondary: '#161D25',
  'bg-color': '#F2F2F5',
  aqua: '#268697',
  red: twColors.red[400],

  // наши новые статусы
  'status-completed': 'rgba(220, 250, 220, 0.5)', // светло-зелёный полупрозрачный
  'status-pending':   'rgba(255, 235, 205, 0.5)', // светло-оранжевый полупрозрачный

  // New colors from the cart toast
  yellow: twColors.yellow, // For text-yellow-400
  indigo: twColors.indigo, // For text-indigo-600, bg-indigo-50, bg-indigo-100, ring-indigo-500
  slate: twColors.slate,   // For bg-slate-100, text-slate-700, bg-slate-200
};

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors,
    extend: {
      animation: {
        'soft-ping': 'softPing 1.0s ease-in-out infinite',
      },
      keyframes: {
        softPing: {
          '0%': { transform: 'scale(1)', opacity: '0.2' },
          '50%': { transform: 'scale(1.1)', opacity: '2' },
          '100%': { transform: 'scale(1)', opacity: '1' }, // Corrected keyframe: 0, 50, 100
        },
      },
    },
  },
  plugins: [],
};