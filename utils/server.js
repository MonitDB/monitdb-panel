export const SERVER_STATUS = {
  HEALTLY: 1,
  INFO: 2,
  WARNING: 3,
  CRITICAL: 4,
  DOWN: 5,
}

export const filterServersByEnvironmentId = (environmentId, servers) => {
  return servers.filter(
    (server) => server.idTypeServerEnvironment === environmentId
  )
}

export const formatServer = (
  server,
  { serverTypes = [], serverEnvironments = [] }
) => {
  console.log(serverTypes, serverEnvironments)
  return {
    ...server,
    isActive: true,
    type: serverTypes.find((type) => server.idTypeServer === type.id),
    environment: serverEnvironments.find(
      (environment) =>
        server.idTypeServerEnvironment === environment.idTypeServerEnvironment
    ),
  }
}

export const getServerDataById = (id, servers) => {
  return servers.find((server) => server.id === id)
}
