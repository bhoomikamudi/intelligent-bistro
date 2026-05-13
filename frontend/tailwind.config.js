/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bistro: {
          bg: "#0c0a09",
          card: "#1c1917",
          border: "#292524",
          muted: "#78716c",
          accent: "#d4af37",
          accentDim: "#a16207",
        },
      },
    },
  },
  plugins: [],
};
