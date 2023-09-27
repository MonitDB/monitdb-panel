import { create } from 'zustand'

import clientApi from '../../utils/client-api'

const useUserContext = create(() => ({
  postLogin: async (data) => {
    return clientApi().post('/api/user/login', data)
  },
  postTokenValidate: async (token) => {
    return clientApi(token).post('/api/user/refresh-token')
  },
  getMe: async () => {
    return clientApi().get('/api/user/me')
  },
  create: async (data) => {
    return clientApi().post('/api/user', data)
  },
  update: async (data) => {
    return clientApi().put('/api/user', data)
  },
  getUserById: async (id) => {
    return clientApi().get(`/api/user/${id}`)
  },
  list: async () => {
    return clientApi().get('/api/user')
  },
  listRoles: async () => {
    return clientApi().get('/api/role')
  },
  remove: async (id) => {
    return clientApi().delete(`/api/user/${id}`)
  },
}))

export default useUserContext
