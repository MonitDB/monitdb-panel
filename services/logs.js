import clientApi from '~/utils/client-api'
import { formatObjectToQuery } from '~/utils/formats'

export const getLogs = async (parameters = {}) => {
  return clientApi().get(`/api/componentlog?${formatObjectToQuery(parameters)}`)
}
