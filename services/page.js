import clientApi from '~/utils/client-api'

export const getPageData = async ({ slug, lang }) => {
  return clientApi().get(`/wp/v2/pages?slug=${slug}&lang=${lang}`)
}
