import { create } from 'zustand'

import clientApi from '../../utils/client-api'
import { formatObjectToQuery } from '../../utils/formats'

const useAlertContext = create(() => ({
  getAlerts: async (parameters = {}) => {
    return clientApi.get(`/api/alert?${formatObjectToQuery(parameters)}`)
  },
  getAlertsById: async (id, parameters = {}) => {
    return clientApi.get(
      `/api/alert/${id}?${formatObjectToQuery(parameters)}`
    )
  },
  getAlertsParameter: async (parameters = {}) => {
    return clientApi.get(
      `/api/alertparameter?${formatObjectToQuery(parameters)}`
    )
  },
  getAlertsParameterByServerId: async (serverId) => {
    return clientApi.get(`/api/alertparameter/${serverId}`)
  },
  getAlertParameterByServerId: async (serverId, parameterId) => {
    return clientApi.get(`/api/alertparameter/${serverId}/${parameterId}`)
  },
  updateAlertsParameterByServerId: async (serverId, values) => {
    return clientApi.put(`/api/alertparameter/${serverId}`, {
      ...values,
    })
  },
}))

export default useAlertContext
