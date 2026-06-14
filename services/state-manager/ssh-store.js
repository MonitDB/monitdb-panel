/* eslint-disable unicorn/no-null */
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useSshStore = create((set) => ({
  hosts: [],
  loading: false,
  saving: false,
  audit: [],
  auditLoading: false,

  fetchAudit: async () => {
    set({ auditLoading: true })
    try {
      const { data } = await apiV2().get('/ssh-hosts/audit')
      set({ audit: Array.isArray(data) ? data : [] })
    } catch {
      set({ audit: [] })
    } finally {
      set({ auditLoading: false })
    }
  },

  fetchHosts: async () => {
    set({ loading: true })
    try {
      const { data } = await apiV2().get('/ssh-hosts')
      set({ hosts: Array.isArray(data) ? data : [] })
    } catch {
      set({ hosts: [] })
    } finally {
      set({ loading: false })
    }
  },

  saveHost: async (payload, id) => {
    set({ saving: true })
    try {
      await (id
        ? apiV2().put(`/ssh-hosts/${id}`, payload)
        : apiV2().post('/ssh-hosts', payload))
      return true
    } catch {
      return false
    } finally {
      set({ saving: false })
    }
  },

  deleteHost: async (id) => {
    try {
      await apiV2().delete(`/ssh-hosts/${id}`)
      return true
    } catch {
      return false
    }
  },

  testHost: async (id) => {
    try {
      const { data } = await apiV2().post(`/ssh-hosts/${id}/test`)
      return data
    } catch (error) {
      return {
        ok: false,
        message: error?.response?.data?.message || 'Falha no teste.',
      }
    }
  },
}))
