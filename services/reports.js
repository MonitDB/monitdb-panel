import { apiV2 } from '~/utils/client-api'

export const getReportsByType = async ({ type, params, serverId }) => {
  return apiV2().get(`component/execute-component/${type}/${serverId}`, {
    params,
  })
}
