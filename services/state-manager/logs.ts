import { create } from 'zustand'

import clientApi from '../../utils/client-api'
import { formatObjectToQuery } from '../../utils/formats'

interface ComponentLogContext {
  getLogs: (parameters?: Record<string, any>, token?: string) => Promise<any>
}

const useComponentLogContext = create<ComponentLogContext>((set, get) => ({
  getLogs: async (parameters = {}, token = '') => {
    return clientApi(token).get(
      `/api/componentlog?${formatObjectToQuery(parameters)}`
    )
  },
}))

export default useComponentLogContext
