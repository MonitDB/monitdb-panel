import { create } from 'zustand'
import clientApi from '../../utils/client-api'
import { formatObjectToQuery } from '../../utils/formats'

interface AlertContext {
  getAlerts: (parameters?: Record<string, any>) => Promise<any>
  getAlertsById: (id: string, parameters?: Record<string, any>) => Promise<any>
  getAlertsParameter: (parameters?: Record<string, any>) => Promise<any>
  getAlertsParameterByServerId: (serverId: string) => Promise<any>
  getAlertParameterByServerId: (
    serverId: string,
    parameterId: string
  ) => Promise<any>
  updateAlertsParameterByServerId: (
    serverId: string,
    values: Record<string, any>
  ) => Promise<any>
}

const useAlertContext = create<AlertContext>((set, get) => ({
  getAlerts: async (parameters = {}) => {
    return clientApi().get(`/api/alert?${formatObjectToQuery(parameters)}`)
  },
  getAlertsById: async (id, parameters = {}) => {
    return clientApi().get(
      `/api/alert/${id}?${formatObjectToQuery(parameters)}`
    )
  },
  getAlertsParameter: async (parameters = {}) => {
    return clientApi().get(
      `/api/alertparameter?${formatObjectToQuery(parameters)}`
    )
  },
  getAlertsParameterByServerId: async (serverId) => {
    return clientApi().get(`/api/alertparameter/${serverId}`)
  },
  getAlertParameterByServerId: async (serverId, parameterId) => {
    return clientApi().get(`/api/alertparameter/${serverId}/${parameterId}`)
  },
  updateAlertsParameterByServerId: async (serverId, values) => {
    return clientApi().put(`/api/alertparameter/${serverId}`, {
      ...values,
    })
  },
}))

export default useAlertContext
