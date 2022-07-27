import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.apiBaseUrl,
})

const clientApi = () => {
  // const tokenRequest = token || localStorage.getItem('token')

  // instance.defaults.headers.common['Authorization'] = tokenRequest
  //   ? `Bearer ${tokenRequest}`
  //   : ''

  return instance
}

export default clientApi
