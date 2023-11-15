import clientApi, { apiV2 } from '~/utils/client-api'

export const postLogin = async (data) => {
  return apiV2().post('/auth/login', data)
  // return clientApi().post('/api/user/login', data)
}

export const postTokenValidate = async () => {
  return apiV2().post('/auth/refresh-token')
}

export const getMe = async () => {
  return apiV2().get('/auth/me')
}

export const create = async (data) => {
  return clientApi().post('/api/user', data)
}

export const update = async (data) => {
  return clientApi().put('/api/user', data)
}

export const getUserById = async (id) => {
  return clientApi().get(`/api/user/${id}`)
}

export const list = async () => {
  return clientApi().get('/api/user')
}

export const listRoles = async () => {
  return clientApi().get('/api/role')
}

export const remove = async (id) => {
  return clientApi().delete(`/api/user/${id}`)
}
