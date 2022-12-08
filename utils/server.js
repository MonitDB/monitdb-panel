export const filterServersByEnvironmentId = (environmentId, servers) => {
  return servers.filter(
    (server) => server.idTypeServerEnvironment === environmentId
  )
}

export const formatServer = (
  server,
  { serverTypes = [], serverEnvironments = [] }
) => {
  return {
    ...server,
    isActive: true,
    type: serverTypes.find((type) => server.idTypeServer === type.idtypeserver),
    environment: serverEnvironments.find(
      (environment) =>
        server.idTypeServerEnvironment === environment.idTypeServerEnvironment
    ),
  }
}

export const getServerDataById = (id, servers) => {
  return servers.find((server) => server.id === id)
}
