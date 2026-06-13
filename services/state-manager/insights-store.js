import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useInsightsStore = create((set) => ({
  insights: [],
  loading: false,
  running: false,
  fetchInsights: async () => {
    set({ loading: true })
    try {
      const { data } = await apiV2().get('/ai/insights')
      set({ insights: Array.isArray(data) ? data : [] })
    } catch {
      set({ insights: [] })
    } finally {
      set({ loading: false })
    }
  },
  runNow: async () => {
    set({ running: true })
    try {
      await apiV2().post('/ai/insights/run')
      const { data } = await apiV2().get('/ai/insights')
      set({ insights: Array.isArray(data) ? data : [] })
      return true
    } catch {
      return false
    } finally {
      set({ running: false })
    }
  },
}))
