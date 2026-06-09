import { toast } from 'react-toastify'
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useExecQueryContext = create((set) => ({
  queryResult: [],
  loadingExecuteQuery: false,
  execQuery: async (plainQuery, serverId, cached = false) => {
    try {
      // SEC-3: sem cifra de app (a chave era pública = teatro). Sigilo fica por conta do HTTPS.
      set({ loadingExecuteQuery: true, queryResult: [] })
      const { data } = await apiV2().post(`/exec-query/${serverId}`, {
        query: plainQuery,
        cached,
        encrypted: false,
      })
      set({ queryResult: data })
      return data
    } catch (error) {
      set({ queryResult: [{ message: 'Request Failed' }] })
      toast.error(error)
    } finally {
      set({ loadingExecuteQuery: false })
    }
  },
}))
