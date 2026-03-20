/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        surface: {
          0: '#0a0a0f',
          1: '#111118',
          2: '#18181f',
          3: '#222230',
        },
        accent: {
          DEFAULT: '#6c6eff',
          dim: '#6c6eff22',
          hover: '#8183ff',
        },
        success: '#22d3a0',
        warning: '#f59e0b',
        danger: '#f43f5e',
        muted: '#6b7280',
      },
      animation: {
        'fade-up': 'fadeUp 0.35s ease forwards',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.3' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
