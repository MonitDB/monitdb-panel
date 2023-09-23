import { create } from 'zustand'

import clientApi, { apiV2 } from '../../utils/client-api'
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

const useLogContext = create((set) => ({
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
  
  getMemoryUsage: async (id, parameters) => {
     try {
      const { data } = await apiV2().get(`/log/memory-usage/${id || ''}`, {
        params: parameters || undefined,
      });
      return data;
    } catch {
      return;
    } 
  },
  
  getLogDatabase: async (id, parameters) => {
    try {
      const { data } = await apiV2().get(`/log/database-status/${id || ''}`, {
        params: parameters || undefined,
      });
      return data;
    } catch {
      return;
    } 
  },
  getLogErrors: async (id, parameters) => {
    try {
      const { data } = await clientApi().get(`/api/logerror/${id || ''}`, {
        params: parameters || undefined,
      });
      return data;
    } catch {
      return;
    }
  },
  
  getTempDb: async (id, parameters) => {
       try {
      const { data } = await apiV2().get(`/log/temp-db/${id}`, {
        params: parameters || undefined,
      });
      return data;
    } catch {
      return;
    }
  }
  

}))

export default useLogContext
