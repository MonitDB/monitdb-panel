/* eslint-disable unicorn/no-null */
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useAnomalyStore = create((set) => ({
  anomalies: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true })
    try {
      const { data } = await apiV2().get('/anomalies')
      set({ anomalies: Array.isArray(data) ? data : [] })
    } catch {
      set({ anomalies: [] })
    } finally {
      set({ loading: false })
    }
  },
}))
