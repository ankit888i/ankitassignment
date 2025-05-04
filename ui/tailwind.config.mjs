/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        amber: {
          50: "#fff8e1",
          100: "#ffecb3",
          200: "#ffe082",
          300: "#ffd54f",
          400: "#ffca28",
          500: "#ff9933", // Saffron from Indian flag
          600: "#ff8800",
          700: "#ff7043",
          800: "#ff5722",
          900: "#f4511e",
        },
        green: {
          50: "#e8f5e9",
          100: "#c8e6c9",
          200: "#a5d6a7",
          300: "#81c784",
          400: "#66bb6a",
          500: "#4caf50",
          600: "#138808", // Green from Indian flag
          700: "#388e3c",
          800: "#2e7d32",
          900: "#1b5e20",
        },
        blue: {
          800: "#000080", // Navy blue (close to Ashoka Chakra)
        },
      },
      backgroundImage: {
        "indian-pattern":
          'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ff9933" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E\')',
      },
    },
  },
  plugins: [],
};
