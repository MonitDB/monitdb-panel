/* eslint-disable unicorn/no-null */
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useAiConfigStore = create((set, get) => ({
  configs: [],
  selectedConfig: null,
  loading: false,
  error: null,
  loadingConfig: false,
  toggleEnableId: null,

  fetchConfigs: async () => {
    set({ loading: true, error: null })
    try {
      const response = await apiV2().get('/ai/config')
      set({ configs: response.data, loading: false })
    } catch (error) {
      set({ error: error, loading: false })
    }
  },

  fetchConfigById: async (id) => {
    set({ loadingConfig: true, error: null })
    try {
      const response = await apiV2().get(`/ai/config/${id}`)
      set({ selectedConfig: response.data, loadingConfig: false })
    } catch (error) {
      set({ error: error, loadingConfig: false })
    }
  },

  createConfig: async (data) => {
    set({ loadingConfig: true, error: null })
    try {
      await apiV2().post('/ai/config', data)
      await get().fetchConfigs()
    } catch (error) {
      set({ error: error })
    } finally {
      set({ loadingConfig: false })
    }
  },

  updateConfig: async (id, data) => {
    set({ loadingConfig: true, error: null })
    try {
      await apiV2().put(`/ai/config/${id}`, data)
      await get().fetchConfigs()
    } catch (error) {
      set({ error: error })
    } finally {
      set({ loadingConfig: false })
    }
  },

  toggleEnabled: async (id) => {
    set({ toggleEnableId: id, error: null })
    try {
      await apiV2().patch(`/ai/config/${id}/toggle`)
      set({
        configs: get().configs.map((c) => {
          if (c.id === id) {
            return { ...c, enabled: !c.enabled }
          } else if (!get().configs.find((cfg) => cfg.id === id)?.enabled) {
            return { ...c, enabled: false }
          } else {
            return c
          }
        }),
      })
    } catch (error) {
      set({ error: error })
    } finally {
      set({ toggleEnableId: null })
    }
  },

  clearSelected: () => set({ selectedConfig: null }),
}))
