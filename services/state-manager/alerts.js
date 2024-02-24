import { create } from 'zustand'

import { apiV2 } from '../../utils/client-api'

const useAlertContext = create((set) => ({
  parameters: [],
  alertsResult: { count: 0, result: [], initialFetch: false },
  getAlerts: async (parameters = {}) => {
    const { data } = await apiV2().get(`/alert/`, { params: parameters })
    return data
  },
  getAlertsById: async (id, parameters) => {
    const { data } = await apiV2().get(`/alert/${id}`, { params: parameters })
    return data
  },
  getAlertsParameter: async (parameters = {}) => {
    const { data } = await apiV2().get(`/alert/parameter/`, {
      params: parameters,
    })
    set({ parameters: data })
    return data
  },
  getAlertsParameterByServerId: async (serverId) => {
    const { data } = await apiV2().get(`/alert/parameter/${serverId}`)
    return data
  },
  getAlertsCount: async () => {
    const { data } = await apiV2().get('/alert/alerts-count')
    return data
  },
  getAlertsResult: async (parameters) => {
    const { data } = await apiV2().get('/alert/results', { params: parameters })
    set({
      alertsResult: {
        count: data.count,
        result: data.result,
        initialFetch: true,
      },
    })
    return data
  },

  getAlertHtml: async (id, serverId) => {
    const { data } = await apiV2().get(`/alert/${id}/html`, {
      params: { serverId },
    })
    return data
  },

  clearAlert: async (id, serverId) => {
    const { data } = await apiV2().put(`/alert/clear/${serverId}/${id}/`)
    return data
  },

  getSuggestion: async (serverId, id, htmlRow) => {
    const { data } = await apiV2().get(
      `/alert/ai-sugestion/${serverId}/${id}/${htmlRow}`
    )
    return data
  },

  // getAlertParameterByServerId: async (serverId, parameterId) => {
  //   return clientApi().get(`/api/alertparameter/${serverId}/${parameterId}`)
  // },
  // updateAlertsParameterByServerId: async (serverId, values) => {
  //   return clientApi().put(`/api/alertparameter/${serverId}`, {
  //     ...values,
  //   })
  // },
}))

export default useAlertContext
