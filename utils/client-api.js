import axios from 'axios'

import { getUserToken } from '~/utils/cookies'

const instance = axios.create({
  baseURL: process.env.apiBaseUrl,
})

const clientApi = (token) => {
  const tokenRequest = token || getUserToken()

  instance.defaults.headers.common['Authorization'] = tokenRequest
    ? `Bearer ${tokenRequest}`
    : ''

  return instance
}

export default clientApi
