/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

export default {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    fontFamily: {
      sans: ['"JetBrains Mono"', '"Roboto Mono"', "monospace"],
      mono: ['"JetBrains Mono"', '"Roboto Mono"', "monospace"],
    },
    colors: {
      "catppuccin-crust": "#11111b",
      "catppuccin-base": "#1e1e2e",
      "catppuccin-surface": "#313244",
      "catppuccin-overlay": "#45475a",
      "catppuccin-muted": "#6c7086",
      "catppuccin-subtle": "#9399b2",
      "catppuccin-text": "#cdd6f4",
      "catppuccin-love": "#f38ba8",
      "catppuccin-gold": "#fabd2f",
      "catppuccin-rosewater": "#f5e0dc",
      "catppuccin-flamingo": "#f2cdcd",
      "catppuccin-pink": "#f5c2e7",
      "catppuccin-mauve": "#cba6f7",
      "catppuccin-red": "#f38ba8",
      "catppuccin-maroon": "#eba0ac",
      "catppuccin-peach": "#fab387",
      "catppuccin-yellow": "#f9e2af",
      "catppuccin-green": "#a6e3a1",
      "catppuccin-teal": "#94e2d5",
      "catppuccin-sky": "#89dceb",
      "catppuccin-sapphire": "#74c7ec",
      "catppuccin-blue": "#89b4fa",
      "catppuccin-lavender": "#b4befe",
      "catppuccin-gray": "#a6adc8",
    },
    extend: {
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-delayed": "fadeIn 0.5s ease-out 0.2s both",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "bounce-subtle": "bounceSubtle 0.5s ease-out",
        "spin-slow": "spin 3s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceSubtle: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
          "100%": { transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        glow: {
          "0%": {
            boxShadow:
              "0 0 5px rgba(203, 166, 247, 0.2), 0 0 10px rgba(203, 166, 247, 0.1)",
          },
          "100%": {
            boxShadow:
              "0 0 20px rgba(203, 166, 247, 0.4), 0 0 40px rgba(203, 166, 247, 0.2)",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
