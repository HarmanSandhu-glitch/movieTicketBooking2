/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all React components
  ],
  darkMode: 'class', // This enables manual dark mode toggling
  theme: {
    extend: {
      colors: {
        // You can add brand-specific colors here
        primary: {
          // Black & Red theme
          light: '#ef4444', // red-500
          DEFAULT: '#dc2626', // red-600
          dark: '#b91c1c', // red-700
        },
        secondary: {
          // Subtle accent (rose)
          light: '#fb7185', // rose-400
          DEFAULT: '#f43f5e', // rose-500
          dark: '#e11d48', // rose-600
        }
      }
    },
  },
  plugins: [],
}