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

export const addServer = async (values) => {
  return clientApi().post(`/server`, {
    Idtypeserver: values.serverType,
    Idtypeserverconection: values.serverType,
    Idtypeserverenvironment: values.environment,
    Servername: values.name,
    ServerDescription: values.description,
    ServerHost: values.host,
    ServerUser: values.user,
    ServerPassword: values.password,
    ServerPort: values.port,
    Serverenable: values.status,
  })
}
