import { create } from 'zustand'

import clientApi from '../../utils/client-api'

interface DashboardContext {
  getDashboard: () => Promise<any>
  getLogPageSplitsCount: (
    serverId: string,
    lastMinutes?: number
  ) => Promise<any>
  getLogBatchRequestsCount: (
    serverId: string,
    lastMinutes?: number
  ) => Promise<any>
  getLogSQLCompilationsCount: (
    serverId: string,
    lastMinutes?: number
  ) => Promise<any>
  getLogFullScansCount: (serverId: string, lastMinutes?: number) => Promise<any>
  getLogUserConnectionsCount: (
    serverId: string,
    lastMinutes?: number
  ) => Promise<any>
}

const useDashboardContext = create<DashboardContext>((set, get) => ({
  getDashboard: async () => {
    return clientApi().get(`/dashboard`)
  },
  getLogPageSplitsCount: async (serverId, lastMinutes = 60) => {
    return clientApi().get(
      `/api/LogPageSplitsCount/${serverId}?LastMinutes=${lastMinutes}`
    )
  },
  getLogBatchRequestsCount: async (serverId, lastMinutes = 60) => {
    return clientApi().get(
      `/api/LogBatchRequestsCount/${serverId}?LastMinutes=${lastMinutes}`
    )
  },
  getLogSQLCompilationsCount: async (serverId, lastMinutes = 60) => {
    return clientApi().get(
      `/api/LogSQLCompilationsCount/${serverId}?LastMinutes=${lastMinutes}`
    )
  },
  getLogFullScansCount: async (serverId, lastMinutes = 60) => {
    return clientApi().get(
      `/api/LogFullScansCount/${serverId}?LastMinutes=${lastMinutes}`
    )
  },
  getLogUserConnectionsCount: async (serverId, lastMinutes = 60) => {
    return clientApi().get(
      `/api/LogUserConnectionsCount/${serverId}?LastMinutes=${lastMinutes}`
    )
  },
}))

export default useDashboardContext
