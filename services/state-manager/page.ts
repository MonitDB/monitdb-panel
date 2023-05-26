import { create } from 'zustand'

import clientApi from '../../utils/client-api'

interface PageDataContext {
  getPageData: (params: { slug: string; lang: string }) => Promise<any>
}

const usePageDataContext = create<PageDataContext>((set, get) => ({
  getPageData: async (params) => {
    const { slug, lang } = params
    return clientApi().get(`/wp/v2/pages?slug=${slug}&lang=${lang}`)
  },
}))

export default usePageDataContext
