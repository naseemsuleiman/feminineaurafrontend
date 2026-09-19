/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        blush: { 50: '#FFF9FA', 100: '#FCE7F0', 200: '#F4B8C4', 300: '#EFD1D9' },
        rose:  { 400: '#C87A8B', 500: '#B85D70', 600: '#A64B60', 700: '#8A3A4D' },
        mulberry: '#3B1F2B',
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(200, 122, 139, 0.25)',
        glow: '0 0 60px -10px rgba(244, 184, 196, 0.8)',
        card: '0 20px 60px -20px rgba(59, 31, 43, 0.15)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};