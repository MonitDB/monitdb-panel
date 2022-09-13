import clientApi from '~/utils/client-api'

export const getDashboardData = async () => {
  return clientApi().get(`/dashboard`)
}
