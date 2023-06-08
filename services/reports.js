import clientApi from '~/utils/client-api'

export const getRepostsByType = async ({ type }) => {
  return clientApi.get(`/component/${type}`)
}
