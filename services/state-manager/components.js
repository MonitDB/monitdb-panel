import { create } from 'zustand'

import clientApi from '../../utils/client-api'
import { formatObjectToQuery } from '../../utils/formats'

const useComponentContext = create((set) => ({
  loading: false,

  getComponents: async (parameters = {}) => {
    return clientApi().get(`/api/component?${formatObjectToQuery(parameters)}`)
  },
  getComponentById: async (componentId) => {
    try {
      set({loading: true})
      const { data } = clientApi().get(`/api/component/${componentId}`);
      return data;
    } catch (error) {
      console.log(error)
    } finally {
      set({ loading: false})
    }
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
