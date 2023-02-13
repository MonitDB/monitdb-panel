import clientApi from '~/utils/client-api'

export const getVersions = async () => {
  return clientApi().get(`/api/execcomponent/PRVER`)
}
