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
