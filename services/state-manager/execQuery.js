import { toast } from 'react-toastify';
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'
import { encryptString } from '~/utils/crypto';


export const useExecQueryContext = create((set) => ({
    queryResult: [],
    loadingExecuteQuery: false,
    execQuery: async (plainQuery, serverId) => {
        try {
            const query = encryptString(plainQuery)       
            console.log(query)
            set({ loadingExecuteQuery: true, queryResult: [] })
            const { data } = await apiV2().post(`/exec-query/${serverId}`, { query });
            set({ queryResult: data })
            return data
        } catch (error) {
            console.error(error)
            set({ queryResult: [{message: "Request Failed"}] })
            toast.error(error)
 
        } finally {
            set({ loadingExecuteQuery: false })
        }
    }
    
}))