import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

// Auditoria de login (25/11/2026): eventos de login (sucesso e falhas) e o
// resumo por utilizador (último login, último acesso, contagens no período).
export const useLoginAuditStore = create((set) => ({
  events: [],
  summary: [],
  loading: false,

  fetchAll: async ({ from, to, result, q } = {}) => {
    set({ loading: true })
    const period = { from, to }
    try {
      const [eventsResponse, summaryResponse] = await Promise.all([
        apiV2().get('/user/login-audit', {
          params: { ...period, result, q, limit: 5000 },
        }),
        apiV2().get('/user/login-audit/summary', { params: period }),
      ])
      set({
        events: Array.isArray(eventsResponse?.data) ? eventsResponse.data : [],
        summary: Array.isArray(summaryResponse?.data)
          ? summaryResponse.data
          : [],
      })
    } finally {
      set({ loading: false })
    }
  },
}))
