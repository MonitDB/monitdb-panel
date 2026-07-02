/* eslint-disable unicorn/no-null */
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

// QA-4: limiares de saúde configuráveis (default global SERVER_ID=0 + overrides por servidor).
export const useHealthThresholdStore = create((set) => ({
  thresholds: [],
  servers: [],
  loading: false,

  fetchThresholds: async () => {
    set({ loading: true })
    try {
      const { data } = await apiV2().get('/server/health-thresholds')
      set({ thresholds: Array.isArray(data) ? data : [] })
    } catch {
      set({ thresholds: [] })
    } finally {
      set({ loading: false })
    }
  },

  fetchServers: async () => {
    try {
      const { data } = await apiV2().get('/server')
      set({
        servers: Array.isArray(data)
          ? data.map((s) => ({ id: s.id, name: s.serverName }))
          : [],
      })
    } catch {
      set({ servers: [] })
    }
  },

  saveThreshold: async (payload) => {
    await apiV2().put('/server/health-thresholds', payload)
  },

  deleteThreshold: async (serverId) => {
    await apiV2().delete(`/server/health-thresholds/${serverId}`)
  },
}))
