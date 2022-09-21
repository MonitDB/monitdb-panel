export const filterServersByEnvironmentId = (environmentId, servers) => {
  return servers.filter((server) => server.idServer === environmentId)
}

export const formatServer = (server, { serverTypes = [] }) => {
  return {
    ...server,
    type: serverTypes.find((type) => server.idTypeServer === type.idtypeserver),
  }
}

export const getServerDataById = (id, servers) => {
  return servers.find((server) => server.idServer === id)
}
