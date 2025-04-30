/** @type {import('tailwindcss').Config} */
const twColors = require('tailwindcss/colors');

const colors = {
  transparent: twColors.transparent,
  black: '#3B404A',
  gray: 'bbbbbb',
  while: twColors.white,
  primary: '#FF9902',
  search: '#00FF00',
  secondary: '#161D25',
  'bg-color': '#F2F2F5',
  aqua: '#268697',
  red: twColors.red[400],
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
        'soft-ping': 'softPing 1.0s ease-in-out infinite', // Обновлено на `ease-in-out` для плавности
      },
      keyframes: {
        softPing: {
          '0%': { transform: 'scale(1)', opacity: '0.2' },
          '50%': { transform: 'scale(1.1)', opacity: '2' }, // Мягкий пик
          '50%': { transform: 'scale(1)', opacity: '1' }, // Плавное возвращение
        },
      },
    },
  },
  plugins: [],
};
