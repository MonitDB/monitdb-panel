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

const useComponentLogContext = create((set, get) => ({
  cpuUsage: {
    data: [],
    loading: false,
    error: false,
      
  },
  getLogs: async (parameters = {}, token = '') => {
    return clientApi(token).get(
      `/api/componentlog?${formatObjectToQuery(parameters)}`
    )
  },
  getCpuUsage: async (id) => {
    const { cpuUsage } = get();
    try {
      set({ cpuUsage: { loading: true } });
      const { data } = await clientApi().get(`/api/logcpuusage/${id}`);
      set({ cpuUsage: { ...cpuUsage, data, loading: false} });
      return;
    } catch (error) {
      set({ cpuUsage: { error: true, data: [], loading: false } });
      console.error('Error getting cpu usage', error);
  
    }
  },

}))

export default useComponentLogContext
