import { create } from 'zustand'

import clientApi from '../../utils/client-api'
import { formatObjectToQuery } from '../../utils/formats'

// interface ComponentLogContext {
//   cpuUsage: {
//     idServer: number
//     createData: Date
//     sqlProcessPerc: number
//     sysIdlePerc: number
//     otherProcessPerc: number
//   }[]
//   getLogs: (parameters?: Record<string, any>, token?: string) => Promise<any>
//   getCpuUsage: (id: number) => Promise<any>
// }

const useComponentLogContext = create((set) => ({
  cpuUsage: [],
  getLogs: async (parameters = {}, token = '') => {
    return clientApi(token).get(
      `/api/componentlog?${formatObjectToQuery(parameters)}`
    )
  },
  getCpuUsage: async (id, parameters) => {
    try {
      set({ cpuUsage: []});
      const { data } = await clientApi().get(`/api/logcpuusage/${id || ''}`, {
        params: parameters || undefined,
      });
      set({ cpuUsage: data });
      return data;
    } catch {
      set({ cpuUsage: undefined });
      return;
    } 
  },

}))

export default useComponentLogContext
