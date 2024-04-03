/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

module.exports = {
  content: [
    "./packages/renderer/index.html",
    "./packages/renderer/src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html",
  ], 
  theme: {
    extend: {
      colors: {
        ...colors,
        primary: {
          50: '#E8EAF6', // Lightest shade
          100: '#C5CAE9',
          200: '#9FA8DA',
          300: '#7986CB',
          400: '#5C6BC0',
          500: '#3F51B5', // Primary color
          600: '#394AAE',
          700: '#3140A5',
          800: '#29379D',
          900: '#1E2D90', // Darkest shade
        },
        secondary: {
          50: '#F8FAFC', // Lightest shade
          100: '#F0F2F5',
          200: '#D9E2EC',
          300: '#BCCCDC',
          400: '#9FB3C8',
          500: '#829AB1', // Primary color
          600: '#627D98',
          700: '#486581',
          800: '#334E68',
          900: '#243B53', // Darkest shade
        },
      },
    },
  },
  plugins: [],
}

