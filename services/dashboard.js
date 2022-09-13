import clientApi from '~/utils/client-api'

export const getDashboard = async () => {
  return clientApi().get(`/dashboard`)
}
