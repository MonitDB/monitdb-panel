import { apiV2 } from '~/utils/client-api'

export const getAnalysis = ({
  metric,
  serverId,
  filter: { startDate, endDate, interval },
}) => {
  return apiV2().get(`/analysis/`, {
    params: { metric, serverId, filter: { startDate, endDate, interval } },
  })
}
