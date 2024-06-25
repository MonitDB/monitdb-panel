import { apiV2 } from '~/utils/client-api'

export const getServers = async () => {
  return apiV2().get(`/server`)
}

export const getServerMetrics = async ({ id }) => {
  try {
    return apiV2().get(`/server/metrics/${id}`)
  } catch {
    /* empty */
  }
}

export const getTypes = async () => {
  return apiV2().get(`/server/type`)
}

export const getEnvironments = async () => {
  return apiV2().get(`/server/type-environment`)
}

export const addServer = async (values) => {
  return apiV2().post(`/server`, {
    ...values,
  })
}

export const testServer = async (values) => {
  return apiV2().post(`/server/test-connection`, {
    ...values,
  })
}

export const getAvailableVersions = async () => {
  try {
    return apiV2().get(`/server/available-versions`)
  } catch {
    return []
  }
}

export const installNewServer = async (values, versionID, connectionId) => {
  return apiV2().post(`/server/install-new-server`, values, {
    params: { connectionId, versionID },
  })
}

export const updateServer = async (values) => {
  return apiV2().put(`/server`, {
    ...values,
  })
}

export const deleteServer = async (id) => {
  return apiV2().delete(`/server/${id}`)
}

export const updateServerNewVersion = async (id, formData) => {
  return apiV2().post(`/server/update-new-version/${id}`, formData)
}
