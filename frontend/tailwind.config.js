/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        sand: "#FAF6F0",
        surface: "#FFFFFF",
        cream: "#F4EFE6",
        ink: "#1C1917",
        stoney: "#57534E",
        muted: "#78716C",
        terracotta: "#C85A32",
        terracottadark: "#A84422",
        sage: "#5B7053",
        sagedark: "#475941",
        amberglow: "#D97706",
        borderline: "#E7E0D6",
        tagbg: "#F5EBE1",
        tagtext: "#9A3412",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "'Playfair Display'", "serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.25s ease-out forwards",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};
