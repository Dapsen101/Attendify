// This is the Tailwind CSS configuration file.
// It specifies which files to scan for class names (content),
// allows theme customization (extend), and lists any additional plugins.
// The content array tells Tailwind to look for classes in all JS/JSX/TS/TSX files in src/.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};