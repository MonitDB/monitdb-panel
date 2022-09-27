import clientApi from '~/utils/client-api'

export const getServers = async () => {
  return clientApi().get(`/server`)
}

export const getServerMetrics = async ({ id }) => {
  return clientApi().get(`/server/metrics/${id}`)
}

export const getTypes = async () => {
  return clientApi().get(`/typeserver`)
}

export const getEnvironments = async () => {
  return clientApi().get(`/typeserverenvironment`)
}
