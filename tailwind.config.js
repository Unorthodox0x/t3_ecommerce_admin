/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",
  purge:[
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'GalleryItem': '668px'
      },
      width: {
        "GalleryItem": "384px",
        "90": "350px"
      },
      maxWidth: {
        '10xl': '1480px',
      }
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        ".my-rotate-y-180": {
          transform: "rotateY(180deg)"
        },
        ".my-rotate-y": {
          transform: "perspective(600px) rotateY(354deg)"
        },
        ".preserve-3d": {
          transformStyle: "preserve-3d",
        },
        ".perspective": {
          perspective: "1000px"
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        }
      })
    })
  ],
}
