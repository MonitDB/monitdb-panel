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
      set({ cpuUsage: [] })
      const { data } = await apiV2().get(`/log/cpu-usage/${id || ''}`, {
        params: parameters || undefined,
      })
      set({ cpuUsage: data })
      return data
    } catch {
      set({ cpuUsage: undefined })
      return
    }
  },

  getMemoryUsage: async (id, parameters) => {
    try {
      const { data } = await apiV2().get(`/log/memory-usage/${id || ''}`, {
        params: parameters || undefined,
      })
      return data
    } catch {
      return
    }
  },

  getLogDatabase: async (id, parameters) => {
    try {
      const { data } = await apiV2().get(`/log/database-status/${id || ''}`, {
        params: parameters || undefined,
      })
      return data
    } catch {
      return
    }
  },
  getLogErrors: async (id, parameters) => {
    try {
      const { data } = await clientApi().get(`/api/logerror/${id || ''}`, {
        params: parameters || undefined,
      })
      return data
    } catch {
      return
    }
  },

  getTempDb: async (id, parameters) => {
    try {
      const { data } = await apiV2().get(`/log/temp-db/${id}`, {
        params: parameters || undefined,
      })
      return data
    } catch {
      return
    }
  },
  getTempDbSession: async (id, parameters) => {
    try {
      const { data } = await apiV2().get(`/log/temp-db/${id}/session`, {
        params: parameters || undefined,
      })
      return data
    } catch {
      return
    }
  },

  getTempDbLogin: async (id, parameters) => {
    try {
      const { data } = await apiV2().get(`/log/temp-db/${id}/login`, {
        params: parameters || undefined,
      })
      return data
    } catch {
      return
    }
  },

  getTempDbDatabase: async (id, parameters) => {
    try {
      const { data } = await apiV2().get(`/log/temp-db/${id}/database`, {
        params: parameters || undefined,
      })
      return data
    } catch {
      return
    }
  },

  getTempDbProgramName: async (id, parameters) => {
    try {
      const { data } = await apiV2().get(`/log/temp-db/${id}/program-name`, {
        params: parameters || undefined,
      })
      return data
    } catch {
      return
    }
  },

  getTempDbSessionQuery: async (serverId, id) => {
    try {
      const { data } = await apiV2().get(`/log/temp-db/${serverId}/query/${id}`)
      return data
    } catch {
      return
    }
  },

  getTopQueries: async (id, parameters) => {
    try {
      const { data } = await apiV2().get(`/log/top-queries/${id}`, {
        params: parameters || undefined,
      })
      return data
    } catch {
      return
    }
  },
  // Os cinco "Top 10" que faltavam (o sexto e o getTopQueries).
  // metric: cpu | reads | logicalReads | writes | waitTime | queryCost
  // Estes tres nao copiam o catch mudo dos de cima de proposito: deixam o erro subir,
  // para o ecra poder dizer que falhou em vez de desenhar uma lista vazia como se
  // estivesse tudo bem. Os outros doze ficam para a emenda combinada com a Sara.
  getTopProcesses: async (id, parameters) => {
    const { data } = await apiV2().get(`/log/top-processes/${id}`, {
      params: parameters || undefined,
    })
    return data
  },

  // by: login | program | status | database
  getSessionBreakdown: async (id, parameters) => {
    const { data } = await apiV2().get(`/log/session-breakdown/${id}`, {
      params: parameters || undefined,
    })
    return data
  },

  // Fotografia mais recente das sessoes: running requests e transaccoes abertas.
  // Devolve { sampledAt, processes } — o sampledAt e para o ecra escrever
  // "ha N segundos", que isto e amostrado e nao tempo real.
  getLatestProcesses: async (id, parameters) => {
    const { data } = await apiV2().get(`/log/latest-processes/${id}`, {
      params: parameters || undefined,
    })
    return data
  },

  getSQLServerMetrics: async (id, parameters) => {
    try {
      const { data } = await apiV2().get(`/log/sql-server-metrics/${id}`, {
        params: parameters || undefined,
      })
      return data
    } catch {
      return
    }
  },
}))

export default useLogContext
