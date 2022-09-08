import axios from 'axios'

import { getLocalStorage } from '~/utils/local-storage'

const instance = axios.create({
  baseURL: process.env.apiBaseUrl,
})

const clientApi = (token) => {
  const tokenRequest = token || getLocalStorage('user_token')

  instance.defaults.headers.common['Authorization'] = tokenRequest
    ? `Bearer ${tokenRequest}`
    : ''

  return instance
}

export default clientApi
