/* eslint-disable unicorn/no-null */
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useWebhooksStore = create((set, get) => ({
  webhooks: [],
  loading: false,
  saving: false,

  fetchWebhooks: async () => {
    set({ loading: true })
    try {
      const { data } = await apiV2().get('/webhook')
      set({ webhooks: Array.isArray(data) ? data : [] })
    } catch {
      set({ webhooks: [] })
    } finally {
      set({ loading: false })
    }
  },

  upsertWebhook: async (data) => {
    set({ saving: true })
    try {
      await apiV2().post('/webhook', data)
      await get().fetchWebhooks()
    } finally {
      set({ saving: false })
    }
  },

  toggleWebhook: async (id) => {
    await apiV2().patch(`/webhook/${id}/toggle`)
    await get().fetchWebhooks()
  },

  deleteWebhook: async (id) => {
    await apiV2().delete(`/webhook/${id}`)
    await get().fetchWebhooks()
  },

  testWebhook: async (id) => {
    const { data } = await apiV2().post(`/webhook/${id}/test`)
    return data
  },
}))
