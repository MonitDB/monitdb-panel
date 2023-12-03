import  { apiV2 } from '~/utils/client-api'
import { formatObjectToQuery } from '~/utils/formats'

export const getComponents = async (parameters = {}) => {
  return apiV2().get(`/component?${formatObjectToQuery(parameters)}`)
}

export const getComponentById = async (componentId) => {
  return apiV2().get(`/component/${componentId}`)
}

export const updateComponentById = async (componentId, values) => {
  return apiV2().put(`/component/${componentId}`, {
    ...values,
  })
}

export const getComponentTypes = async (parameters = {}) => {
  return apiV2().get(
    `/component/type-component?${formatObjectToQuery(parameters)}`
  )
}
