const plugin = require('tailwindcss/plugin')

module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,jsx}',
    './layouts/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './helpers/**/*.{js,jsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      blue: {
        DEFAULT: '#5046e5',
        light: '#6867ef',
      },
      gray: {
        DEFAULT: '#9da5b1',
        light: '#d3d3d3',
        dark: '#768192',
      },
      danger: '#ff4e4e',
      success: '#409d66',
    },
    extend: {
      fontFamily: {
        ibm: '"IBM Plex Sans", sans-serif',
        oxygen: '"Oxygen", sans-serif',
      },
      fontSize: {
        0: '0px',
      },
      transitionDelay: {
        0: '0ms',
      },
      minWidth: (theme) => ({
        ...theme('spacing'),
      }),
      maxWidth: (theme) => ({
        ...theme('spacing'),
      }),
      minHeight: (theme) => ({
        ...theme('spacing'),
      }),
      maxHeight: (theme) => ({
        ...theme('spacing'),
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar'),
    require('./config/tailwind/container.js'),
    require('./config/tailwind/presets.js'),
    plugin(function ({ addVariant }) {
      addVariant('group-active', () => {
        return `:merge(.group).active &`
      })
    }),
  ],
}
