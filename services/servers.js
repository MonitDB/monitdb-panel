import clientApi from '~/utils/client-api'

export const getServers = async () => {
  return clientApi().get(`/api/server`)
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
  return clientApi().post(`/api/server`, {
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
}

export const updateServer = async (values) => {
  return clientApi().put(`/api/server`, {
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
}

export const deleteServer = async (id) => {
  return clientApi().delete(`/api/server/${id}`)
}
