import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

// Trilha de auditoria das execuções SQL da IA (AI-RISK-2). Somente leitura;
// isolada por cliente no backend (filtra idCustomer).
export const useAiAuditStore = create((set) => ({
  audit: [],
  auditLoading: false,
  fetchAudit: async () => {
    set({ auditLoading: true })
    try {
      const { data } = await apiV2().get('/ai/audit')
      set({ audit: Array.isArray(data) ? data : [] })
    } catch {
      set({ audit: [] })
    } finally {
      set({ auditLoading: false })
    }
  },
}))
