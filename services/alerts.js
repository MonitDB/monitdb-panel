import clientApi from '~/utils/client-api'
import { formatObjectToQuery } from '~/utils/formats'

export const getAlerts = async (parameters = {}) => {
  return clientApi.get(`/api/alert?${formatObjectToQuery(parameters)}`)
}

export const getAlertsById = async (id, parameters = {}) => {
  return clientApi.get(`/api/alert/${id}?${formatObjectToQuery(parameters)}`)
}

export const getAlertsParameter = async (parameters = {}) => {
  return clientApi.get(
    `/api/alertparameter?${formatObjectToQuery(parameters)}`
  )
}

export const getAlertsParameterByServerId = async (serverId) => {
  return clientApi.get(`/api/alertparameter/${serverId}`)
}

export const getAlertParameterByServerId = async (serverId, parameterId) => {
  return clientApi.get(`/api/alertparameter/${serverId}/${parameterId}`)
}

export const updateAlertsParameterByServerId = async (serverId, values) => {
  return clientApi.put(`/api/alertparameter/${serverId}`, {
    ...values,
  })
}
