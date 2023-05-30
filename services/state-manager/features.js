import { create } from 'zustand'

import clientApi from '../../utils/client-api'
import { formatObjectToQuery } from '../../utils/formats'

const useFeatureContext = create(() => ({
  getFeatures: async (parameters = {}) => {
    return clientApi().get(`/api/feature?${formatObjectToQuery(parameters)}`)
  },
}))

export default useFeatureContext
