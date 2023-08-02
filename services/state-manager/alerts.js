import { create } from 'zustand'

import { apiV2 } from '../../utils/client-api'


const useAlertContext = create(() => ({
  getAlerts: async (parameters = {}) => {
    const {data} = await apiV2.get(`/alert/`,
      { params: parameters })
    return data;
  },
  getAlertsById: async (id, parameters = {}) => {
    const {data} = await apiV2.get(
      `/alert/${id}`, {params: parameters}
     )
    return data;
  },
  getAlertsParameter: async (parameters = {}) => {
     const {data} = await apiV2.get(
      `/alert/parameter/`, {params: parameters}
     )
    return data;
  },
  getAlertsParameterByServerId: async (serverId) => {
      const {data} = await apiV2.get(
      `/alert/parameter/${serverId}`
     )
    return data;
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
