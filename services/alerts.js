import clientApi from '~/utils/client-api'

export const getAlerts = async () => {
  return clientApi().get(`/alert`)
}
