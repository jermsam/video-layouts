/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      keyframes: {
        show: {
          '0%': {
            opacity: 0,
            transform: 'scale(0.4) translateY(20px)'
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1) translateY(0)'
          }
        }
      },
      animation: {
        show: 'show 0.4s ease',
      }
    },
  },
  plugins: [],
};
