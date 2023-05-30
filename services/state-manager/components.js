import { create } from 'zustand'

import clientApi from '../../utils/client-api'
import { formatObjectToQuery } from '../../utils/formats'

const useComponentContext = create((set, get) => ({
  getComponents: async (parameters = {}) => {
    return clientApi().get(`/api/component?${formatObjectToQuery(parameters)}`)
  },
  getComponentById: async (componentId) => {
    return clientApi().get(`/api/component/${componentId}`)
  },
  updateComponentById: async (values) => {
    return clientApi().put(`/api/component`, {
      ...values,
    })
  },
  getComponentTypes: async (parameters = {}) => {
    return clientApi().get(
      `/api/typecomponent?${formatObjectToQuery(parameters)}`
    )
  },
}))

export default useComponentContext
