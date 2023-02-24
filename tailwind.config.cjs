/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: "Inter, sans-serif",
        monospace: "JetBrains Mono, monospace",
      },
      colors: {
        omni: {
          darker: "#15121E",
          dark: "#191622",
          light: "#252131",
          cyan: "#988bc7",
          green: "#67e480",
          orange: "#E89E64",
          pink: "#FF79C6",
          purple: "#78D1E1",
          red: "#E96379",
          yellow: "#e7de79",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
