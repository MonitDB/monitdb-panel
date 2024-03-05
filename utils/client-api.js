import axios from 'axios'

import { getUserToken } from '~/utils/cookies'

const instance = axios.create({ baseURL: process.env.apiBaseUrl })

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

const apiV2 = (token) => {
  const tokenRequest = token || getUserToken()

  instance2.defaults.headers.common['Authorization'] = tokenRequest
    ? `Bearer ${tokenRequest}`
    : ''

  return instance2
}

export default clientApi

export { apiV2 }
