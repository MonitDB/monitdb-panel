import clientApi from '~/utils/client-api'

export const postLogin = async (data) => {
  return clientApi().post('/api/user/login', data)
}

export const postTokenValidate = async () => {
  return clientApi().post('/api/user/refresh-token')
}

export const getMe = async () => {
  return clientApi().get('/api/user/me')
}
