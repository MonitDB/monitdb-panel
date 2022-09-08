export const getLocalStorage = (key) => {
  const value = localStorage.getItem(key)
  return value || ''
}

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, value)
}

export const removeLocalStorage = (key) => {
  localStorage.removeItem(key)
}
