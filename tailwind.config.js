/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cyberpunk theme colors
        cyber: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        neon: {
          pink: '#ff0080',
          purple: '#8b5cf6',
          cyan: '#00ffff',
          green: '#00ff88',
          yellow: '#ffff00',
        },
        dark: {
          900: '#0a0a0f',
          800: '#1a1a2e',
          700: '#16213e',
          600: '#0f3460',
          500: '#533483',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #00ffff 100%)',
        'neon-gradient': 'linear-gradient(135deg, #ff0080 0%, #8b5cf6 50%, #00ffff 100%)',
        'holographic': 'linear-gradient(45deg, #ff0080, #8b5cf6, #00ffff, #00ff88, #ffff00)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #8b5cf6, 0 0 10px #8b5cf6, 0 0 15px #8b5cf6' },
          '100%': { boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      fontFamily: {
        'cyber': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}