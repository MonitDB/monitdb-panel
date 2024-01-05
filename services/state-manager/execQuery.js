import { toast } from 'react-toastify'
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'
import { encryptString } from '~/utils/crypto'

export const useExecQueryContext = create((set) => ({
  queryResult: [],
  loadingExecuteQuery: false,
  execQuery: async (plainQuery, serverId, cached = false) => {
    try {
      const query = encryptString(plainQuery)

      set({ loadingExecuteQuery: true, queryResult: [] })
      const { data } = await apiV2().post(`/exec-query/${serverId}`, {
        query,
        cached,
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
