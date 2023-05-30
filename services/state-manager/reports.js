import { create } from 'zustand'

import clientApi from '../../utils/client-api'


const useRepostContext = create(() => ({
  getRepostsByType: async ({ type }) => {
    return clientApi().get(`/component/${type}`)
  },
}))

export default useRepostContext
