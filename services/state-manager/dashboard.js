import { create } from 'zustand'

import clientApi from '../../utils/client-api'

const useDashboardContext = create(() => ({
  getDashboard: async () => {
    return clientApi.get(`/dashboard`)
  },
  getLogPageSplitsCount: async (serverId, lastMinutes = 60) => {
    return clientApi.get(
      `/api/LogPageSplitsCount/${serverId}?LastMinutes=${lastMinutes}`
    )
  },
  getLogBatchRequestsCount: async (serverId, lastMinutes = 60) => {
    return clientApi.get(
      `/api/LogBatchRequestsCount/${serverId}?LastMinutes=${lastMinutes}`
    )
  },
  getLogSQLCompilationsCount: async (serverId, lastMinutes = 60) => {
    return clientApi.get(
      `/api/LogSQLCompilationsCount/${serverId}?LastMinutes=${lastMinutes}`
    )
  },
  getLogFullScansCount: async (serverId, lastMinutes = 60) => {
    return clientApi.get(
      `/api/LogFullScansCount/${serverId}?LastMinutes=${lastMinutes}`
    )
  },
  getLogUserConnectionsCount: async (serverId, lastMinutes = 60) => {
    return clientApi.get(
      `/api/LogUserConnectionsCount/${serverId}?LastMinutes=${lastMinutes}`
    )
  },
}))

export default useDashboardContext
