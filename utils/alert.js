export const formatAlert = (
  alert,
  { servers, serverEnvironments, alertsParameters }
) => {
  return {
    ...alert,
    server: servers.find((server) => server.idServer === alert.idServer),
    serverEnvironment: serverEnvironments.find(
      (environment) =>
        environment.idTypeServerEnvironment === alert.idTypeServerEnvironment
    ),
    alertParameter: alertsParameters.find(
      (alertParameter) =>
        alertParameter.idAlertParameter === alert.idAlertParameter
    ),
  }
}
