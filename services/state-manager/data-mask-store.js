/* eslint-disable unicorn/no-null */
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useDataMaskStore = create((set, get) => ({
  servers: [],
  config: {}, // { [serverId]: boolean }
  defaultOn: false,
  loading: false,

  fetchAll: async () => {
    set({ loading: true })
    try {
      const [{ data: servers }, { data: cfg }] = await Promise.all([
        apiV2().get('/server'),
        apiV2().get('/ai/data-mask'),
      ])
      set({
        servers: Array.isArray(servers) ? servers : [],
        config: cfg?.servers || {},
        defaultOn: !!cfg?.default,
      })
    } catch {
      set({ servers: [], config: {} })
    } finally {
      set({ loading: false })
    }
  },

  toggle: async (serverId, enabled) => {
    // otimista
    set({ config: { ...get().config, [serverId]: enabled } })
    try {
      await apiV2().put(`/ai/data-mask/${serverId}`, { enabled })
      return true
    } catch {
      // reverte
      set({ config: { ...get().config, [serverId]: !enabled } })
      return false
    }
  },
}))
