/* eslint-disable unicorn/no-null */
import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useAiTrainingStore = create((set, get) => ({
  trainings: [],
  selectedTraining: null,
  loading: false,
  error: null,
  loadingTraining: false,
  toggleEnableId: null,

  fetchTrainings: async () => {
    set({ loading: true, error: null })
    try {
      const response = await apiV2().get('/ai/training')
       set({ trainings: response.data, loading: false })
    } catch (error) {
      set({ error: error, loading: false })
    }
  },

  createTraining: async (data) => {
    set({ loadingTraining: true, error: null })
    try {
      if (data.type === 'DOCUMENT') {
        // Handle file upload via FormData
        const formData = new FormData()
        formData.append('file', data.file)

        await apiV2().post('/ai/training/file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

      } else if (data.type === 'TEXT') {
        // Handle plain text training material
        await apiV2().post('/ai/training/text', data);
      
      } else if (data.type === 'WEBSITE') {
        // Handle website training material
        await apiV2().post('/ai/training/website', data);
      
      } else if (data.type === 'VIDEO') {
        if (data.content) {
          // Handle plain URL video training material
          await apiV2().post('/ai/training/video', data);          

        } else if (data.file) {
          // Handle file upload via FormData
          const formData = new FormData()
          formData.append('file', data.file)
  
          await apiV2().post('/ai/training/file', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });     
        }
      
      }  else {
        throw new Error('Unsupported training material type')
      }

      await get().fetchTrainings()
    } catch (error) {
      set({ error })
      throw error;
    } finally {
      set({ loadingTraining: false })
    }
  },

  deleteTraining: async (id) => {
    set({ loading: true, error: null })
    try {
      await apiV2().delete(`/ai/training/${id}`)
      
      const updatedTrainings = get().trainings.filter(
        training => training.idTrainingMaterial !== id
      )
      set({ trainings: updatedTrainings, loading: false })

    } catch (error) {
      set({ error: error, loading: false })
    }
  },
}))
