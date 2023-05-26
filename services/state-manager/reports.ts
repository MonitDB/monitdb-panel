import clientApi from '../../utils/client-api'
import { create } from 'zustand'

interface RepostContext {
  getRepostsByType: (params: { type: string }) => Promise<any>
}

const useRepostContext = create<RepostContext>((set, get) => ({
  getRepostsByType: async ({ type }) => {
    return clientApi().get(`/component/${type}`)
  },
}))

export default useRepostContext
