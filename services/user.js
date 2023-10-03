import clientApi from '~/utils/client-api'

export const postLogin = async (data) => {
  return clientApi().post('/api/user/login', data)
}

export const postTokenValidate = async (token) => {
  return clientApi(token).post('/api/user/refresh-token')
}

export const getMe = async () => {
  return clientApi().get('/api/user/me')
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
