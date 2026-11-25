import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

// Report a bug (25/11/2026): o modal vive no Header (aberto a todos, a partir do menu do
// utilizador ou do cartão nas Configurações); a lista é só para OWNER de USER_MANAGEMENT.
export const useBugReportStore = create((set) => ({
  open: false,
  openReport: () => set({ open: true }),
  closeReport: () => set({ open: false }),

  reports: [],
  loading: false,

  submit: async (payload) => {
    const { data } = await apiV2().post('/bug-report', payload)
    return data
  },

  fetchReports: async ({ status, q } = {}) => {
    set({ loading: true })
    try {
      const { data } = await apiV2().get('/bug-report', {
        params: { status: status || undefined, q: q || undefined },
      })
      set({ reports: Array.isArray(data) ? data : [] })
    } finally {
      set({ loading: false })
    }
  },

  fetchReport: async (id) => {
    const { data } = await apiV2().get(`/bug-report/${id}`)
    return data
  },

  fetchImage: async (id, imageId) => {
    const { data } = await apiV2().get(`/bug-report/${id}/image/${imageId}`, {
      responseType: 'blob',
    })
    return URL.createObjectURL(data)
  },

  setStatus: async (id, status) => {
    await apiV2().put(`/bug-report/${id}/status`, { status })
    set((state) => ({
      reports: state.reports.map((r) => (r.id === id ? { ...r, status } : r)),
    }))
  },
}))
