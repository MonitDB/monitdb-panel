const plugin = require('tailwindcss/plugin')

module.exports = plugin(function ({ addComponents, theme }) {
  addComponents({
    '.heading-lg': {
      fontSize: '2rem',
      lineHeight: '3rem',
      fontWeight: '700',
      fontFamily: theme('fontFamily.oxygen'),
    },
    '.heading-md': {
      fontSize: '1.5rem',
      lineHeight: '2rem',
      fontWeight: '700',
      fontFamily: theme('fontFamily.oxygen'),
    },
    '.heading-sm': {
      fontSize: '1.25rem',
      lineHeight: '1.5rem',
      fontWeight: '700',
      fontFamily: theme('fontFamily.oxygen'),
    },
    '.heading-xs': {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: '700',
      fontFamily: theme('fontFamily.oxygen'),
    },
  })
})
