import clientApi from '~/utils/client-api'

export const getDashboard = async () => {
  return clientApi().get(`/dashboard`)
}

export const getLogPageSplitsCount = async (serverId, lastMinutes = 60) => {
  return clientApi().get(
    `/api/LogPageSplitsCount/${serverId}?LastMinutes=${lastMinutes}`
  )
}

export const getLogBatchRequestsCount = async (serverId, lastMinutes = 60) => {
  return clientApi().get(
    `/api/LogBatchRequestsCount/${serverId}?LastMinutes=${lastMinutes}`
  )
}

export const getLogSQLCompilationsCount = async (
  serverId,
  lastMinutes = 60
) => {
  return clientApi().get(
    `/api/LogSQLCompilationsCount/${serverId}?LastMinutes=${lastMinutes}`
  )
}

export const getLogFullScansCount = async (serverId, lastMinutes = 60) => {
  return clientApi().get(
    `/api/LogFullScansCount/${serverId}?LastMinutes=${lastMinutes}`
  )
}

export const getLogUserConnectionsCount = async (
  serverId,
  lastMinutes = 60
) => {
  return clientApi().get(
    `/api/LogUserConnectionsCount/${serverId}?LastMinutes=${lastMinutes}`
  )
}
