import axios from 'axios'

import { getUserToken, remove } from '~/utils/cookies'

const instance = axios.create({ baseURL: process.env.apiBaseUrl })

function isTokenExpired(token) {
  const decodedToken = JSON.parse(atob(token.split('.')[1]))

  const expirationDate = new Date(decodedToken.exp * 1000)

  return expirationDate < new Date()
}

const clientApi = (token) => {
  const tokenRequest = token || getUserToken()

  instance.defaults.headers.common['Authorization'] = tokenRequest
    ? `Bearer ${tokenRequest}`
    : ''

  return instance
}

export const APIV2 = process.env.apiV2
export const SOCKET = process.env.socket

const instance2 = axios.create({
  baseURL: process.env.apiV2,
  headers: {
    'x-api-key': process.env.apiKey,
  },
})

instance2.interceptors.request.use((config) => {
  const tokenRequest = getUserToken()

  if (tokenRequest && isTokenExpired(tokenRequest)) {
    remove(tokenRequest)
    window.location.href = ''
    return config
  }
  config.headers.Authorization = tokenRequest ? `Bearer ${tokenRequest}` : ''

  return config
})

const apiV2 = (token) => {
  return instance2
}

export default clientApi

export { apiV2 }
