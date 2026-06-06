/* eslint-disable unicorn/no-null */
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useAiSecretStore = create((set, get) => ({
  secrets: [],
  loading: false,
  saving: false,
  error: null,

  fetchSecrets: async () => {
    set({ loading: true, error: null })
    try {
      const response = await apiV2().get('/ai/secrets')
      set({ secrets: response.data, loading: false })
    } catch (error) {
      set({ error, loading: false })
    }
  },

  upsertSecret: async (data) => {
    set({ saving: true, error: null })
    try {
      await apiV2().post('/ai/secrets', data)
      await get().fetchSecrets()
    } catch (error) {
      set({ error })
      throw error
    } finally {
      set({ saving: false })
    }
  },

  deleteSecret: async (id) => {
    try {
      await apiV2().delete(`/ai/secrets/${id}`)
      await get().fetchSecrets()
    } catch (error) {
      set({ error })
    }
  },
}))
