import clientApi from '~/utils/client-api'
import { formatObjectToQuery } from '~/utils/formats'

export const getComponents = async (parameters = {}) => {
  return clientApi().get(`/api/component?${formatObjectToQuery(parameters)}`)
}

export const getComponentById = async (componentId) => {
  return clientApi().get(`/api/component/${componentId}`)
}

export const updateComponentById = async (values) => {
  return clientApi().put(`/api/component`, {
    ...values,
  })
}
