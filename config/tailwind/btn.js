const plugin = require('tailwindcss/plugin')

module.exports = plugin(function ({ addUtilities, theme }) {
  const newUtilities = {
    '.btn': {
      paddingTop: '8px',
      paddingBottom: '8px',
      paddingLeft: '16px',
      paddingRight: '16px',
      backgroundColor: theme('colors.blue.DEFAULT'),
      color: theme('colors.white'),
      borderRadius: '4px',
      fontSize: '14px',

      '@screen md': {
        '&:hover': {
          backgroundColor: theme('colors.blue.light'),
        },
      },
    },
    '.btn--small': {
      fontSize: '12px',
    },
  }

  addUtilities(newUtilities, {
    variants: ['responsive'],
  })
})
