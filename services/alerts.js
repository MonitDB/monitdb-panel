import clientApi, { apiV2 } from '~/utils/client-api'
import { formatObjectToQuery } from '~/utils/formats'

export const getAlerts = async (parameters = {}) => {
  return clientApi().get(`/api/alert?${formatObjectToQuery(parameters)}`)
}

export const getAlertsById = async (id, parameters = {}) => {
  return clientApi().get(`/api/alert/${id}?${formatObjectToQuery(parameters)}`)
}

export const getAlertsParameter = async (parameters = {}) => {
  return apiV2().get(
    `/alert/parameter?${formatObjectToQuery(parameters)}`
  )
}

export const getAlertsParameterByServerId = async (serverId) => {
  return apiV2().get(`/alert/parameter/${serverId}`)
}

export const getAlertParameterByServerId = async (serverId, parameterId) => {
  return apiV2().get(`/alert/parameter/${serverId}/${parameterId}`)
}

export const updateAlertsParameterByServerId = async (serverId, values) => {
  return apiV2().put(`/alert/parameter/${serverId}`, {
    ...values,
  })
}
