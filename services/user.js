import clientApi from '~/utils/client-api'

export const postLogin = async (data) => {
  return clientApi().post('/user/login', data)
}

export const postTokenValidate = async () => {
  return clientApi().post('/user/refresh-token')
}
