/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        pulse: "pulse 1s ease-in-out infinite",
      },
      fontFamily: {
        DM: "'DM Mono', monospace",
      },
    },
  },
  plugins: [],
};
