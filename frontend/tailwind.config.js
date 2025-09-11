/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ["Pacifico", "cursive"],
        dancing: ["Dancing Script", "cursive"],
        abril: ["Abril Fatface", "cursive"],
      },
    },

  },
  plugins: [],
}
