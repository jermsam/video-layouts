/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      keyframes: {
        show: {
          '0%': {
            opacity: 0,
            transform: 'scale(0.4) translateY(20px)',
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1) translateY(0)',
          },
        },
        'pulse-green': {
          '0%': {
            transform: 'scale(0.95)',
            'box-shadow': '0 0 0 0 rgba(51, 217, 178, 1)',
          },
          '70%': {
            transform: 'scale(1)',
            'box-shadow': '0 0 0 20px rgba(51, 217, 178, 0)',
          },
          '100%': {
            transform: 'scale(0.95)',
            'box-shadow': '0 0 0 0 rgba(51, 217, 178, 0)',
          },
        },
      },
      animation: {
        show: 'show 0.4s ease',
        'pulse-green': 'pulse-green 2s infinite'
      },
    },
  },
  plugins: [],
};
