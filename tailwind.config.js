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
      red: {
        DEFAULT: '#cc0000',
      },
      blue: {
        DEFAULT: '#5046e5',
        light: '#6867ef',
        // Indigo que passa contraste sobre o preto da barra de topo (#161b22):
        // o #5046e5 fica em 2.9:1 sobre esse fundo e nao se ve.
        soft: '#8b8cf6',
      },
      orange: {
        DEFAULT: '#fc9003',
      },
      gray: {
        DEFAULT: '#9da5b1',
        light: '#d1d1d1',
        dark: '#161b22',
      },
      danger: '#ff4e4e',
      success: '#409d66',
    },
    extend: {
      fontFamily: {
        ibm: '"IBM Plex Sans", sans-serif',
        oxygen: '"Oxygen", sans-serif',
        courier: '"Courier Prime", "Courier New", monospace',
      },
      fontSize: {
        0: '0px',
      },
      transitionDelay: {
        0: '0ms',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            table: {
              width: '100%',
              tableLayout: 'auto',
            },
            'thead th': {
              textAlign: 'left',
              textTransform: 'uppercase',
              fontFamily: theme('fontFamily.oxygen'),
              fontSize: theme('fontSize.xs'),
              color: theme('colors.gray'),
              paddingLeft: theme('spacing.2'),
              paddingRight: theme('spacing.2'),
              paddingTop: theme('spacing.2'),
              paddingBottom: theme('spacing.2'),
              borderBottom: '1px solid',
              borderBottomColor: theme('colors.gray.DEFAULT'),
              backgroundColor: theme('colors.transparent'),
            },
            'thead th:first-child, tbody td:first-child': {
              paddingLeft: theme('spacing.2'),
            },
          },
        },
      }),
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
    require('./config/tailwind/btn.js'),
    require('./config/tailwind/presets.js'),
    plugin(function ({ addVariant }) {
      addVariant('group-active', () => {
        return `:merge(.group).active &`
      })
    }),
  ],
}
