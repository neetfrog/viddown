/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/**/*.{js,ts,jsx,tsx}', './src/renderer/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#0d0d10',
          surface: '#131318',
          card: '#1a1a22',
          border: '#252530',
          accent: '#6366f1',
          'accent-hover': '#818cf8',
          'accent-dim': '#3730a3',
          text: '#e2e8f0',
          secondary: '#94a3b8',
          muted: '#475569',
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ]
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        shimmer: 'shimmer 1.5s infinite'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    }
  },
  plugins: []
}
