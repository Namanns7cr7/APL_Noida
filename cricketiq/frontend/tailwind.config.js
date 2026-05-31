/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cricket: {
          // Premium emerald mint green
          green: '#00D084',
          'green-dark': '#008753',
          'green-glow': '#00D08420',
          blue: '#00B4FF',
          'blue-dark': '#0077CC',
          'blue-glow': '#00B4FF20',
          // These now map to CSS vars so light/dark works automatically
          pitch: 'var(--color-pitch)',
          'dark-1': 'var(--color-dark-1)',
          'dark-2': 'var(--color-dark-2)',
          'dark-3': 'var(--color-dark-3)',
          'card-bg': 'var(--color-card-bg)',
          'card-border': 'var(--color-card-border)',
          surface: 'var(--color-surface)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'green-glow': '0 0 20px rgba(0, 208, 132, 0.3)',
        'blue-glow': '0 0 20px rgba(0, 180, 255, 0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.15)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.25)',
        'card-light': '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover-light': '0 8px 40px rgba(0,0,0,0.15)',
      },
      animation: {
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 208, 132, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 208, 132, 0.5)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }
    },
  },
  plugins: [],
}
