import { toast } from 'react-toastify';
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'


export const useExecQueryContext = create((set) => ({
    queryResult: [],
    loadingExecuteQuery: false,
    execQuery: async (query, serverId) => {
        try {
            set({ loadingExecuteQuery: true, queryResult: [] })
            const { data } = await apiV2().post(`/exec-query/${serverId}`, { query });
            set({ queryResult: data })
            return data
        } catch (error) {
            set({ queryResult: [{message: "Request Failed"}] })
            toast.error(error)
 
        } finally {
            set({ loadingExecuteQuery: false })
        }
    }
    
}))