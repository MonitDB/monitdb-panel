import { apiV2 } from '~/utils/client-api'
import { formatObjectToQuery } from '~/utils/formats'

export const getLogs = async (parameters = {}, token = '') => {
  return apiV2(token).get(
    `/log/component-log?${formatObjectToQuery(parameters)}`
  )
}

export const getApiLogs = async (parameters = {}, token = '') => {
  return apiV2(token).get(`/log/api-log?${formatObjectToQuery(parameters)}`)
}

export const getInstallationServers = async (token) => {
  return apiV2(token).get(`/log/installation-log/servers`)
}

export const getInstallationLogs = async (parameters = {}, token = '') => {
  return apiV2(token).get(
    `/log/installation-log?${formatObjectToQuery(parameters)}`
  )
}
