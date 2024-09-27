/* eslint-disable no-console */
import { apiV2 } from '~/utils/client-api'

export const listIntegrations = async (page = 1, pageSize = 10) => {
  try {
    const response = await apiV2().get('/integration', {
      params: { page, pageSize },
    })
    return response.data
  } catch (error) {
    console.error('Error listing integrations:', error)
  }
}

export const listAllIntegrations = async () => {
  try {
    const response = await apiV2().get('/integration/all', {})
    return response.data
  } catch (error) {
    console.error('Error listing integrations:', error)
  }
}

export const createIntegration = async (integrationData) => {
  try {
    const response = await apiV2().post('/integration', integrationData)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const getIntegration = async (id) => {
  try {
    const response = await apiV2().get(`/integration/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error getting integration with ID ${id}:`, error)
  }
}

export const execIntegration = async (id) => {
  const response = await apiV2().get(`/integration/${id}/execute`)
  return response.data
}

export const updateIntegration = async (id, integrationData) => {
  try {
    const response = await apiV2().put(`/integration/${id}`, integrationData)
    return response.data
  } catch (error) {
    console.error(`Error updating integration with ID ${id}:`, error)
  }
}

export const deleteIntegration = async (id) => {
  try {
    const response = await apiV2().delete(`/integration/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting integration with ID ${id}:`, error)
  }
}
