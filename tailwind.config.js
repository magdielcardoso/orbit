/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSmoothing: {
        'antialiased': {
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
      },
    },
  },
  plugins: [
    require("daisyui"),
    function({ addBase }) {
      addBase({
        'html': { 
          '-webkit-text-size-adjust': '100%',
          'text-rendering': 'optimizeLegibility',
        },
        'svg': {
          'shape-rendering': 'geometricPrecision',
          'text-rendering': 'geometricPrecision',
        }
      })
    }
  ],
  daisyui: {
    themes: true,
  },
}

