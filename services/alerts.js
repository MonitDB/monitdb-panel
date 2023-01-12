import clientApi from '~/utils/client-api'
import { formatObjectToQuery } from '~/utils/formats'

export const getAlerts = async (parameters = {}) => {
  return clientApi().get(`/api/alert?${formatObjectToQuery(parameters)}`)
}

export const getAlertsParameter = async (parameters = {}) => {
  return clientApi().get(
    `/api/alertparameter?${formatObjectToQuery(parameters)}`
  )
}
