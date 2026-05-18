/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,tsx,ts}", "./components/**/*.{js,tsx,ts}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        gold: "#C9A84C",
        "gold-light": "#E8C87A",
        bistro: "#080808",
        card: "#111111",
        elevated: "#1A1A1A",
        muted: "#8A8070",
        "text-primary": "#F2EDE4",
      },
    },
  },
  plugins: [],
};
