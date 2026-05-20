export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          975: '#020617',
        },
        brand: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(99, 102, 241, 0.12), 0 24px 48px rgba(15, 23, 42, 0.45)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top, rgba(99, 102, 241, 0.18), transparent 32%), linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        'hero-grid': 'auto, 32px 32px, 32px 32px',
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.08)' },
          '50%': { boxShadow: '0 0 0 10px rgba(99, 102, 241, 0)' },
        },
      },
    },
  },
  plugins: [],
};
