/* eslint-disable unicorn/no-null */
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useAiConfigStore = create((set, get) => ({
  configs: [],
  selectedConfig: null,
  loading: false,
  error: null,

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
    set({ loading: true, error: null })
    try {
      const response = await apiV2().get(`/ai/config/${id}`)
      set({ selectedConfig: response.data, loading: false })
    } catch (error) {
      set({ error: error, loading: false })
    }
  },

  createConfig: async (data) => {
    set({ loading: true, error: null })
    try {
      await apiV2().post('/ai/config', data)
      await get().fetchConfigs()
    } catch (error) {
      set({ error: error })
    } finally {
      set({ loading: false })
    }
  },

  updateConfig: async (id, data) => {
    set({ loading: true, error: null })
    try {
      await apiV2().put(`/ai/config/${id}`, data)
      await get().fetchConfigs()
    } catch (error) {
      set({ error: error })
    } finally {
      set({ loading: false })
    }
  },

  toggleStatus: async (id) => {
    set({ loading: true, error: null })
    try {
      await apiV2().patch(`/ai/config/${id}/toggle`)
      await get().fetchConfigs()
    } catch (error) {
      set({ error: error })
    } finally {
      set({ loading: false })
    }
  },

  clearSelected: () => set({ selectedConfig: null }),
}))
