import { apiV2 } from '~/utils/client-api'

export const getRepostsByType = async ({ type }) => {
  return apiV2().get(`component/execute-component/${type}`)
}
