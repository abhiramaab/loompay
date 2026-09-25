/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07070c',
          900: '#0b0b13',
          850: '#101019',
          800: '#14141f',
          750: '#1a1a27',
          700: '#232333',
          600: '#2f2f42',
          500: '#3d3d52',
        },
        mist: {
          100: '#f4f5fb',
          200: '#e2e4f0',
          300: '#c7cad9',
          400: '#9a9db4',
          500: '#71748c',
          600: '#50526a',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        cyanx: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
        },
        mint: {
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
        },
        amberx: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
        },
        rosex: {
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(99,102,241,0.16), 0 18px 60px -18px rgba(99,102,241,0.55)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 60px -32px rgba(0,0,0,0.9)',
        lift: '0 24px 70px -30px rgba(0,0,0,0.85)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(120deg, #6366f1 0%, #22d3ee 55%, #34d399 100%)',
        'brand-soft': 'linear-gradient(135deg, rgba(99,102,241,0.16), rgba(34,211,238,0.10))',
        'grid-fade':
          'radial-gradient(ellipse 70% 55% at 50% -10%, rgba(99,102,241,0.20), transparent 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'draw': {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
        shimmer: 'shimmer 2.4s linear infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        float: 'float 5s ease-in-out infinite',
        draw: 'draw 1.4s cubic-bezier(0.65,0,0.35,1) forwards',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
}
