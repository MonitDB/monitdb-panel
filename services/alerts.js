import clientApi from '~/utils/client-api'
import { formatObjectToQuery } from '~/utils/formats'

export const getAlerts = async (parameters) => {
  return clientApi().get(`/alert?${formatObjectToQuery(parameters)}`)
}

export const getAlertsParameter = async () => {
  return clientApi().get(`/alertparameter`)
}
