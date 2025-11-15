/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00FF41',
        'primary-dark': '#00CC33',
        'primary-light': '#33FF66',
        secondary: '#1A4D2E',
        'bg-primary': '#000000',
        'bg-secondary': '#0A0A0A',
        'bg-tertiary': '#1A1A1A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0B0',
        'text-muted': '#808080',
        positive: '#00FF41',
        negative: '#FF3333',
        neutral: '#FFA500',
        border: '#2D2D2D',
        'border-green': '#00FF41',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'green-glow': '0 0 20px rgba(0, 255, 65, 0.4)',
      },
    },
  },
  plugins: [],
}
