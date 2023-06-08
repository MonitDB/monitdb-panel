import { create } from 'zustand'

import clientApi from '../../utils/client-api'

const useServerContext = create(() => ({
  getServers: async () => {
    return clientApi.get(`/api/server`)
  },
  getServerMetrics: async ({ id }) => {
    return clientApi.get(`/api/metrics/${id}`)
  },
  getTypes: async () => {
    return clientApi.get(`/api/typeserver`)
  },
  getEnvironments: async () => {
    return clientApi.get(`/api/typeserverenvironment`)
  },
  addServer: async (values) => {
    return clientApi.post(`/api/server`, {
      idtypeserver: values.serverType,
      idtypeserverconnection: values.connection,
      idtypeserverenvironment: values.environment,
      servername: values.name,
      serverdescription: values.description,
      serverhost: values.host,
      serveruser: values.user,
      serverpassword: values.password,
      serverport: values.port,
      // serverenable: values.status,
    })
  },
  updateServer: async (values) => {
    return clientApi.put(`/api/server`, {
      id: values.id,
      idtypeserver: values.serverType,
      idtypeserverconnection: values.connection,
      idtypeserverenvironment: values.environment,
      servername: values.name,
      serverdescription: values.description,
      serverhost: values.host,
      serveruser: values.user,
      serverpassword: values.password,
      serverport: values.port,
      serverenable: values.status,
    })
  },
  deleteServer: async (id) => {
    return clientApi.delete(`/api/server/${id}`)
  },
}))

export default useServerContext
