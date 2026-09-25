/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light surfaces (larger number = deeper/darker background).
        ink: {
          950: '#f2f2f7', // iOS systemGroupedBackground
          900: '#f7f8fb',
          850: '#ffffff',
          800: '#ffffff',
          750: '#f2f3f7',
          700: '#e5e6ec', // separators / borders
          600: '#d5d6de',
          500: '#bcbec9',
        },
        // Dark text (larger number = lighter/muted text).
        mist: {
          100: '#1c1c1e', // primary label
          200: '#2c2c2e',
          300: '#3a3a3c',
          400: '#5c5c60', // secondary label
          500: '#6e6e73', // tertiary label
          600: '#8e8e93', // quaternary (iOS systemGray)
        },
        // Apple system blue.
        brand: {
          50: '#eff6ff',
          100: '#e0efff',
          200: '#bfdfff',
          300: '#7cb8ff',
          400: '#3d9bff',
          500: '#007aff',
          600: '#0062cc',
          700: '#0050a6',
          800: '#003f82',
          900: '#002f61',
        },
        cyanx: {
          300: '#7fd7ff',
          400: '#32ade6',
          500: '#0091d5',
        },
        mint: {
          300: '#5fd98a',
          400: '#34c759',
          500: '#248a3d',
        },
        amberx: {
          300: '#ffd60a',
          400: '#ffcc00',
          500: '#c29b00',
        },
        rosex: {
          300: '#ff6961',
          400: '#ff3b30',
          500: '#d70015',
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
        glow: '0 1px 2px rgba(0,122,255,0.24), 0 10px 28px -8px rgba(0,122,255,0.5)',
        card: '0 1px 2px rgba(16,24,40,0.04), 0 10px 30px -18px rgba(16,24,40,0.18)',
        lift: '0 18px 48px -20px rgba(16,24,40,0.28)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(120deg, #007aff 0%, #32ade6 55%, #5ac8fa 100%)',
        'brand-soft': 'linear-gradient(135deg, rgba(0,122,255,0.10), rgba(90,200,250,0.08))',
        'grid-fade':
          'radial-gradient(ellipse 75% 55% at 50% -12%, rgba(0,122,255,0.12), transparent 62%)',
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
