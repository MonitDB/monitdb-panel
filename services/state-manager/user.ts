import clientApi from '../../utils/client-api'
import { create } from 'zustand'

interface UserContext {
  postLogin: (data: any) => Promise<any>
  postTokenValidate: () => Promise<any>
  getMe: () => Promise<any>
  create: (data: any) => Promise<any>
  update: (data: any) => Promise<any>
  getUserById: (id: string) => Promise<any>
  list: () => Promise<any>
  listRoles: () => Promise<any>
  remove: (id: string) => Promise<any>
}

const useUserContext = create<UserContext>((set, get) => ({
  postLogin: async (data) => {
    return clientApi().post('/api/user/login', data)
  },
  postTokenValidate: async () => {
    return clientApi().post('/api/user/refresh-token')
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
