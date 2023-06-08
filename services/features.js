import clientApi from '~/utils/client-api'
import { formatObjectToQuery } from '~/utils/formats'

export const getFeatures = async (parameters = {}) => {
  return clientApi.get(`/api/feature?${formatObjectToQuery(parameters)}`)
}
