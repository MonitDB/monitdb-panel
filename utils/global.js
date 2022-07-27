export const isEmail = (email) => {
  const regex = /\S+@\S+\.\S+/
  return regex.test(email)
}

export const camelize = (string_) => {
  return string_
    .replace(/-/gi, ' ')
    .replace(/^\w|[A-Z]|\b\w/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

export const slugify = (text = '') => {
  return text
    .toString()
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}
