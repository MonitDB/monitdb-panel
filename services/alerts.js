import clientApi from '~/utils/client-api'

export const getAlertClusterActiveNode = async () => {
  return clientApi().get(`/alertclusteractivenodecontroller`)
}
