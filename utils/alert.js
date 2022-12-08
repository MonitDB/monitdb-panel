export const formatAlert = (alert, { servers, serverEnvironments }) => {
  return {
    ...alert,
    server: servers.find((server) => server.id === alert.idServer),
    serverEnvironment: serverEnvironments.find(
      (environment) =>
        environment.idTypeServerEnvironment === alert.idTypeServerEnvironment
    ),
  }
}
