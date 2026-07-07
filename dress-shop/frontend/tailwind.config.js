/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAFAF8',
        cream: '#F5F0E8',
        charcoal: '#1A1A2E',
        rose: '#C9184A',
        blush: '#FF4D6D',
        gold: '#E9C46A',
        sage: '#2D6A4F',
        muted: '#6B7280',
        taupe: '#E5E0D8',
        surface: '#FFFFFF',
        dark: '#0F0F1A',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.12)',
        'glass': '0 8px 32px rgba(0,0,0,0.08)',
        'btn': '0 4px 14px rgba(201,24,74,0.35)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
        'rose-gradient': 'linear-gradient(135deg, #C9184A 0%, #FF4D6D 100%)',
        'gold-gradient': 'linear-gradient(135deg, #E9C46A 0%, #F4A261 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite linear',
      },
      spacing: {
        px: '1px',
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
      },
      borderRadius: {
        'sm': '6px',
        DEFAULT: '12px',
        'lg': '16px',
        'pill': '9999px',
      },
      transitionDuration: {
        DEFAULT: '250ms',
        75: '75ms',
        150: '150ms',
        300: '300ms',
      },
    },
  },
  plugins: [],
}
