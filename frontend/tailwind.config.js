/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Poppins",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // Brand pink scale, anchored exactly on the app's official palette:
        // Primary #E16CA1 (400), Dark #C93E79 (600), Light #F7D6E6 (100),
        // Very Light #FFF5F9 (50). Every existing `rose-*`/`pink-*` utility
        // across the app (buttons, links, selected states, message bubbles,
        // focus rings) renders in this exact palette with no markup changes.
        rose: {
          50: "#FFF5F9",
          100: "#F7D6E6",
          200: "#F3C0D9",
          300: "#EA96BE",
          400: "#E16CA1",
          500: "#D4568E",
          600: "#C93E79",
          700: "#A32F60",
          800: "#7A2249",
          900: "#4F1730",
        },
        pink: {
          50: "#FFF5F9",
          100: "#F7D6E6",
          200: "#F3C0D9",
          300: "#EA96BE",
          400: "#E16CA1",
          500: "#D4568E",
          600: "#C93E79",
          700: "#A32F60",
          800: "#7A2249",
          900: "#4F1730",
        },
        // Neutral scale: pure white + subtle pale-pink card tint at the
        // light end (50/100), muted mauve through the middle (secondary
        // text/borders), true AMOLED black at the dark end (700-950) so
        // every existing dark:bg-slate-900/950 surface across the app
        // renders as premium near-black/true-black chrome with no markup
        // changes -- nothing outside cards and message bubbles is ever gray.
        slate: {
          50: "#FFFFFF",
          100: "#FFF8FB",
          200: "#F6D3E0",
          300: "#E8B8CB",
          400: "#B98298",
          500: "#96687D",
          600: "#7A4E62",
          700: "#2A2A2A",
          800: "#161616",
          900: "#0A0A0A",
          950: "#000000",
        },
      },
      keyframes: {
        "message-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "panel-in": {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "highlight-flash": {
          "0%": { boxShadow: "0 0 0 0 rgba(201, 62, 121, 0)" },
          "15%": { boxShadow: "0 0 0 4px rgba(201, 62, 121, 0.5)" },
          "100%": { boxShadow: "0 0 0 0 rgba(201, 62, 121, 0)" },
        },
      },
      animation: {
        "message-in": "message-in 0.18s ease-out",
        "panel-in": "panel-in 0.15s ease-out",
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "highlight-flash": "highlight-flash 1.4s ease-out 2",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
