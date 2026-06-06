/* eslint-disable unicorn/no-null */
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useAiSkillStore = create((set, get) => ({
  skills: [],
  selectedSkill: null,
  loading: false,
  loadingSkill: false,
  toggleEnableId: null,
  error: null,

  fetchSkills: async () => {
    set({ loading: true, error: null })
    try {
      const response = await apiV2().get('/ai/skills')
      set({ skills: response.data, loading: false })
    } catch (error) {
      set({ error, loading: false })
    }
  },

  fetchSkillById: async (id) => {
    set({ loadingSkill: true, error: null })
    try {
      const response = await apiV2().get(`/ai/skills/${id}`)
      set({ selectedSkill: response.data, loadingSkill: false })
    } catch (error) {
      set({ error, loadingSkill: false })
    }
  },

  createSkill: async (data) => {
    set({ loadingSkill: true, error: null })
    try {
      await apiV2().post('/ai/skills', data)
      await get().fetchSkills()
    } catch (error) {
      set({ error })
      throw error
    } finally {
      set({ loadingSkill: false })
    }
  },

  updateSkill: async (id, data) => {
    set({ loadingSkill: true, error: null })
    try {
      await apiV2().put(`/ai/skills/${id}`, data)
      await get().fetchSkills()
    } catch (error) {
      set({ error })
      throw error
    } finally {
      set({ loadingSkill: false })
    }
  },

  deleteSkill: async (id) => {
    try {
      await apiV2().delete(`/ai/skills/${id}`)
      await get().fetchSkills()
    } catch (error) {
      set({ error })
    }
  },

  toggleEnabled: async (id) => {
    set({ toggleEnableId: id, error: null })
    try {
      await apiV2().patch(`/ai/skills/${id}/toggle`)
      await get().fetchSkills()
    } catch (error) {
      set({ error })
    } finally {
      set({ toggleEnableId: null })
    }
  },
}))
