const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

const buildPrettierCommand = (filenames) =>
  `npx prettier --write ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`

const buildOthersPrettierCommand = (filenames) =>
  `npx prettier --write ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`

module.exports = {
  '*.{js,jsx}': [buildEslintCommand, buildPrettierCommand],
  '*.md|json': [buildOthersPrettierCommand],
}
