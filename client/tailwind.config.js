/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      colors: {
        dark_theme: "#0d1117",
        dark_lighter_theme: "#161b22",
      },
    },
  },
  plugins: [],
  darkMode: ["selector"],
};
