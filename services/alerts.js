import clientApi from '~/utils/client-api'
import { formatObjectToQuery } from '~/utils/formats'

export const getAlerts = async (parameters = {}) => {
  return clientApi().get(`/api/alert?${formatObjectToQuery(parameters)}`)
}

export const getAlertsById = async (id, parameters = {}) => {
  return clientApi().get(`/api/alert/${id}?${formatObjectToQuery(parameters)}`)
}

export const getAlertsParameter = async (parameters = {}) => {
  return clientApi().get(
    `/api/alertparameter?${formatObjectToQuery(parameters)}`
  )
}

export const getAlertsParameterByServerId = async (serverId) => {
  return clientApi().get(`/api/alertparameter/${serverId}`)
}

export const updateAlertsParameterByServerId = async (serverId, values) => {
  return clientApi().put(`/api/alertparameter/${serverId}`, {
    ...values,
  })
}

// TODO: get alerts parameter by server id & parameter id
