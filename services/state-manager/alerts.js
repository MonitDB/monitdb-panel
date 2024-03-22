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
    try {
      const { data } = await apiV2().get(`/alert/${id}/html`, {
        params: { serverId },
      })
      return data
    } catch {
      return []
    }
  },

  clearAlert: async (id, serverId) => {
    try {
      const { data } = await apiV2().put(`/alert/clear/${serverId}/${id}/`)
      return data
    } catch {
      return []
    }
  },

  getSuggestion: async (serverId, id, htmlRow) => {
    try {
      const { data } = await apiV2().get(
        `/alert/ai-suggestion/${serverId}/${id}/${htmlRow}`
      )
      return data
    } catch {
      return []
    }
  },

  getPreviousSuggestions: async (id) => {
    try {
      const { data } = await apiV2().get(`/alert/previous-suggestions/${id}`)
      return data
    } catch {
      return []
    }
  },

  rateSuggestion: async ({ sugestionId, rate, comment }) => {
    try {
      return await apiV2().post(`/alert/rate-suggestion`, {
        sugestionId,
        rate,
        comment,
      })
    } catch {
      return []
    }
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
