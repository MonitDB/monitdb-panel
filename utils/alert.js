export const formatAlert = (alert, { servers, serverEnvironments }) => {
  const currentServer = servers.find((server) => server.id === alert.idServer)
  return {
    ...alert,
    server: servers.find((server) => server.id === alert.idServer),
    serverEnvironment: serverEnvironments.find(
      (environment) => environment.id === currentServer?.idTypeServerEnvironment
    ),
  }
}
