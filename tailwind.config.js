/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    fontFamily: {
      sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
      mono: ['"Roboto Mono"', ...defaultTheme.fontFamily.mono],
    },
    colors: {
      'catppuccin-crust': '#11111b',
      'catppuccin-base': '#1e1e2e',
      'catppuccin-surface': '#313244',
      'catppuccin-overlay': '#45475a',
      'catppuccin-muted': '#6c7086',
      'catppuccin-subtle': '#9399b2',
      'catppuccin-text': '#cdd6f4',
      'catppuccin-love': '#f38ba8',
      'catppuccin-gold': '#fabd2f',
      'catppuccin-rosewater': '#f5e0dc',
      'catppuccin-flamingo': '#f2cdcd',
      'catppuccin-pink': '#f5c2e7',
      'catppuccin-mauve': '#cba6f7',
      'catppuccin-red': '#f38ba8',
      'catppuccin-maroon': '#eba0ac',
      'catppuccin-peach': '#fab387',
      'catppuccin-yellow': '#f9e2af',
      'catppuccin-green': '#a6e3a1',
      'catppuccin-teal': '#94e2d5',
      'catppuccin-sky': '#89dceb',
      'catppuccin-sapphire': '#74c7ec',
      'catppuccin-blue': '#89b4fa',
      'catppuccin-lavender': '#b4befe',
      'catppuccin-gray': '#a6adc8',
    },
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-delayed': 'fadeIn 0.3s ease-out 0.1s both',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(203, 166, 247, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(203, 166, 247, 0.4)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

