import clientApi from '~/utils/client-api'

export const getRepostsBySlug = async ({ slug }) => {
  return clientApi().get(`/component/${slug}`)
}
