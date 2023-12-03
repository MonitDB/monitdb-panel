import  { apiV2 } from '~/utils/client-api'
import { formatObjectToQuery } from '~/utils/formats'

export const getFeatures = async (parameters = {}) => {
  return apiV2().get(`/component/feature?${formatObjectToQuery(parameters)}`)
}
