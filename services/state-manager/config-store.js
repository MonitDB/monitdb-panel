/* eslint-disable no-console */
/* eslint-disable unicorn/no-null */
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useConfigStore = create((set, get) => ({
  loaded: false,
  config: {
    logo: '/images/logos/monitdb.png',
    name: 'MonitDB',
  },

  fetchConfig: async () => {
    try {
      const { data } = await apiV2().get('/customer/config')
      const { config } = get()

      set({
        config: {
          ...config,
          logo: data?.customerImageBlob,
          ...data,
        },
        loaded: true,
      })
    } catch (error) {
      console.error(error)
      set({ loaded: true })
    }
  },
}))
