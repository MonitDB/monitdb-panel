import { create } from 'zustand'

import clientApi from '../../utils/client-api'


const usePageDataContext = create((set, get) => ({
  getPageData: async (parameters) => {
    const { slug, lang } = parameters
    return clientApi().get(`/wp/v2/pages?slug=${slug}&lang=${lang}`)
  },
}))

export default usePageDataContext
