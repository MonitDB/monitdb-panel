import clientApi from '~/utils/client-api'
import { formatObjectToQuery } from '~/utils/formats'

export const getLogs = async (parameters = {}, token = '') => {
  return clientApi()(token).get(
    `/api/componentlog?${formatObjectToQuery(parameters)}`
  )
}
