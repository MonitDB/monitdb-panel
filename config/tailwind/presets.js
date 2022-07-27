const plugin = require('tailwindcss/plugin')

module.exports = plugin(function ({ addComponents, theme }) {
  addComponents({
    '.heading-md': {
      fontSize: '3.5rem',
      lineHeight: '5rem',
      fontFamily: theme('fontFamily.roboto'),
    },
    '.heading-sm': {
      fontSize: '2rem',
      lineHeight: '3rem',
      fontFamily: theme('fontFamily.roboto'),
    },
    '.heading-xs': {
      fontSize: '1.5rem',
      lineHeight: '2rem',
      fontFamily: theme('fontFamily.roboto'),
    },
  })
})
