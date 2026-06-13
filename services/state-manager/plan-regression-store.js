/* eslint-disable unicorn/no-null */
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const usePlanRegressionStore = create((set) => ({
  regressions: [],
  loading: false,
  snapshotting: false,

  fetchAll: async () => {
    set({ loading: true })
    try {
      const { data: servers } = await apiV2().get('/server')
      const list = Array.isArray(servers) ? servers : []
      const all = []
      await Promise.all(
        list
          .filter((s) => s.serverEnable && s.online)
          .map(async (s) => {
            try {
              const { data } = await apiV2().get(`/plan-regressions/${s.id}`)
              for (const r of data || []) {
                all.push({ ...r, serverName: s.serverName })
              }
            } catch {
              /* servidor sem snapshots ainda */
            }
          })
      )
      all.sort((a, b) => (b.ratio || 0) - (a.ratio || 0))
      set({ regressions: all })
    } catch {
      set({ regressions: [] })
    } finally {
      set({ loading: false })
    }
  },

  snapshotNow: async () => {
    set({ snapshotting: true })
    try {
      await apiV2().post('/plan-regressions/snapshot')
      return true
    } catch {
      return false
    } finally {
      set({ snapshotting: false })
    }
  },
}))
