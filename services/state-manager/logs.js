import { create } from 'zustand'

import clientApi, { apiV2 } from '../../utils/client-api'
import { formatObjectToQuery } from '../../utils/formats'


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
      const { data } = await apiV2().get(`/log/cpu-usage/${id || ''}`, {
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
  },
  getTempDbSession: async (id, parameters) => {
       try {
      const { data } = await apiV2().get(`/log/temp-db/${id}/session`, {
        params: parameters || undefined,
      });
      return data;
    } catch {
      return;
    }
  },
  
   getTempDbLogin: async (id, parameters) => {
       try {
      const { data } = await apiV2().get(`/log/temp-db/${id}/login`, {
        params: parameters || undefined,
      });
      return data;
    } catch {
      return;
    }
  },
   
    getTempDbDatabase: async (id, parameters) => {
       try {
      const { data } = await apiV2().get(`/log/temp-db/${id}/database`, {
        params: parameters || undefined,
      });
      return data;
    } catch {
      return;
    }
  },
    
    getTempDbProgramName: async (id, parameters) => {
       try {
      const { data } = await apiV2().get(`/log/temp-db/${id}/program-name`, {
        params: parameters || undefined,
      });
      return data;
    } catch {
      return;
    }
  },
  
    getTempDbSessionQuery: async (serverId, id) => {
       try {
      const { data } = await apiV2().get(`/log/temp-db/${serverId}/query/${id}`);
      return data;
    } catch {
      return;
    }
  },
  
  
  getTopQueries: async (id, parameters) => {
    try {
      const { data } = await apiV2().get(`/log/top-queries/${id}`, {
        params: parameters || undefined,
      });
      return data;
    } catch {
      return;
    }
  },
  getSQLServerMetrics: async (id, parameters) => {
    try {
      const { data } = await apiV2().get(`/log/sql-server-metrics/${id}`, {
        params: parameters || undefined,
      });
      return data;
    } catch {
      return;
    }
  }
  

}))

export default useLogContext
