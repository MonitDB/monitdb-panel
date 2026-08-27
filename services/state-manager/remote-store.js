/* eslint-disable unicorn/no-null */
import { saveAs } from 'file-saver'
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useRemoteStore = create((set) => ({
  hosts: [],
  loading: false,
  saving: false,
  audit: [],
  auditLoading: false,

  fetchHosts: async () => {
    set({ loading: true })
    try {
      const { data } = await apiV2().get('/remote-hosts')
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
        ? apiV2().put(`/remote-hosts/${id}`, payload)
        : apiV2().post('/remote-hosts', payload))
      return { ok: true }
    } catch (error) {
      // BUG-18: a API diz o que esta errado (ex.: "Host must not contain
      // spaces."). Engolir a mensagem era metade do problema — o utilizador
      // corrigia as cegas.
      return {
        ok: false,
        message: error?.response?.data?.message || 'Could not save the host.',
      }
    } finally {
      set({ saving: false })
    }
  },

  deleteHost: async (id) => {
    try {
      await apiV2().delete(`/remote-hosts/${id}`)
      return true
    } catch {
      return false
    }
  },

  openSession: async (id) => {
    const { data } = await apiV2().post(`/remote-hosts/${id}/session`)
    return data // { ok, token, protocol, wsPort, recording }
  },

  fetchAudit: async () => {
    set({ auditLoading: true })
    try {
      const { data } = await apiV2().get('/remote-hosts/audit')
      set({ audit: Array.isArray(data) ? data : [] })
    } catch {
      set({ audit: [] })
    } finally {
      set({ auditLoading: false })
    }
  },

  downloadRecording: async (name) => {
    const { data } = await apiV2().get(`/remote-hosts/recordings/${name}`, {
      responseType: 'blob',
    })
    saveAs(data, name)
  },

  // Baixa a gravação como Blob (sem salvar) — para o player de replay embutido.
  fetchRecordingBlob: async (name) => {
    const { data } = await apiV2().get(`/remote-hosts/recordings/${name}`, {
      responseType: 'blob',
    })
    return data
  },
}))
