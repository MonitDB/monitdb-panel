import { getCookie, removeCookies, setCookies } from 'cookies-next'

const cookiesNames = ['user_token']

export function getUserToken() {
  return getCookie('user_token') || ''
}

export function setUserToken(value) {
  return setCookies('user_token', value)
}

export function get(name) {
  return getCookie(name) || ''
}

export function update(name, value) {
  return setCookies(name, value)
}

export function reset() {
  for (const key of cookiesNames) {
    removeCookies(key)
  }
}
