import { create } from 'zustand'

import clientApi from '../../utils/client-api'
import { formatObjectToQuery } from '../../utils/formats'

interface FeatureContext {
  getFeatures: (parameters?: Record<string, any>) => Promise<any>
}

const useFeatureContext = create<FeatureContext>((set, get) => ({
  getFeatures: async (parameters = {}) => {
    return clientApi().get(`/api/feature?${formatObjectToQuery(parameters)}`)
  },
}))

export default useFeatureContext
