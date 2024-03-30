import { apiV2 } from '~/utils/client-api'

export const postLogin = async (data) => {
  return apiV2().post('/user/login', data)
}

export const postTokenValidate = async (token) => {
  return apiV2(token).post('/user/refresh-token')
}

export const getMe = async () => {
  return apiV2().get('/user/me')
}

export const create = async (data) => {
  return apiV2().post('/user', data)
}

export const update = async (data) => {
  return apiV2().put(`/user/${data.id}`, data)
}

export const getUserById = async (id) => {
  return apiV2().get(`/user/${id}`)
}

export const list = async () => {
  return apiV2().get('/user')
}

export const listRoles = async () => {
  return apiV2().get('/user/roles')
}

export const remove = async (id) => {
  return apiV2().delete(`/user/${id}`)
}
