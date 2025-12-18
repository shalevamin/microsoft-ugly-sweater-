/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        win95: {
          bg: '#c0c0c0',      // Silver
          dark: '#808080',    // Shadow
          darker: '#000000',  // Border
          light: '#dfdfdf',   // Highlights
          lighter: '#ffffff', // Bright Highlights
          blue: '#000080',    // Title Bar
          teal: '#3a6ea5',    // Desktop Background
        }
      },
      fontFamily: {
        pixel: ['"Courier New"', '"Pixelify Sans"', 'monospace'],
      },
      boxShadow: {
        'win95-out': 'inset -1px -1px #000000, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
        'win95-in': 'inset -1px -1px #ffffff, inset 1px 1px #000000, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
        'win95-flat': 'inset -1px -1px #808080, inset 1px 1px #ffffff',
      },
      cursor: {
        'retro-auto': 'auto', 
        'retro-pointer': 'pointer',
        'retro-wait': 'wait',
      }
    },
  },
  plugins: [],
}
