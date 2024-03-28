import { apiV2 } from '~/utils/client-api'

export const createProfile = async (data) => {
  return apiV2().post('/permission/profile', data)
}

export const updateProfile = async (id, data) => {
  return apiV2().put(`/permission/profile/${id}`, data)
}

export const getProfileById = async (id) => {
  return apiV2().get(`/permission/profile/${id}`)
}

export const getPermissions = async () => {
  return apiV2().get(`/permission`)
}

export const getTypesGrants = async () => {
  return apiV2().get(`/permission/types-grant`)
}

export const listProfiles = async () => {
  return apiV2().get('/permission/profile')
}

// export const listRoles = async () => {
//   return apiV2().get('/permission/profile/roles')
// }

export const remove = async (id) => {
  return apiV2().delete(`/permission/profile/${id}`)
}
