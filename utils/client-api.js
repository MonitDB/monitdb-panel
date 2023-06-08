import axios from 'axios'

import { getUserToken } from '~/utils/cookies'

const tokenRequest = getUserToken()


const clientApi = axios.create({
  baseURL: process.env.apiBaseUrl,
  headers: {
    Authorization: `Bearer ${tokenRequest}`
  }
})

// const clientApi = (token) => {
//   const tokenRequest = token || getUserToken()

//   instance.defaults.headers.common['Authorization'] = tokenRequest
//     ? `Bearer ${tokenRequest}`
//     : ''

//   return instance
// }

export default clientApi
