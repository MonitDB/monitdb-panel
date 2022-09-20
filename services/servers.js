import clientApi from '~/utils/client-api'

export const getServers = async () => {
  return clientApi().get(`/server`)
}
