import clientApi from '~/utils/client-api'

export const getDashboard = async () => {
  return clientApi().get(`/dashboard`)
}

export const getLogPageSplitsCount = async (serverId, LastMinutes) => {
  return clientApi().get(
    `/api/LogPageSplitsCount/${serverId}?LastMinutes=${LastMinutes}`
  )
}
