/* eslint-disable unicorn/no-null */
import { create } from 'zustand'

import { apiLocalLLM } from '~/utils/client-api-local-llm'

const COLLECTION_NAME = process.env.localLLMCollectionName;

export const useAiTrainingStoreLocalLLM = create((set, get) => ({
  trainingsLocalLLM: [],
  selectedTraining: null,
  loadingLocalLLM: false,
  error: null,
  loadingTrainingLocalLLM: false,
  toggleEnableId: null,

  fetchTrainingsLocalLLM: async () => {
    set({ loadingLocalLLM: true, error: null })
    try {
      const response = await apiLocalLLM.get(`/trainings/${COLLECTION_NAME}`)
       set({
        trainingsLocalLLM: response.data.trainings.map(t => ({
          idTrainingMaterial: t.id,            // rename id → idTrainingMaterial
          type: t.type,                        // keep type as is
          content: t.textContent.length > 300
            ? t.textContent.substring(0, 300) + '...'
            : t.textContent,              // rename textContent → content
          filename: t.filename ?? null,        // ensure null if undefined
          filemimetype: t.mimetype ?? null,    // rename mimetype → filemimetype
          createdAt: t.createdAt               // keep date as is
        })),
        loadingLocalLLM: false
      })
    } catch (error) {
      set({ error: error, loadingLocalLLM: false })
    }
  },

  createTrainingLocalLLM: async (data) => {
    set({ loadingTrainingLocalLLM: true, error: null })
    try {
      if (data.type === 'DOCUMENT') {
        // Handle file upload via FormData
        const formData = new FormData()
        formData.append('file', data.file)
                                
        await apiLocalLLM.post(`/trainings/collection/${COLLECTION_NAME}/file`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

      } else if (data.type === 'TEXT') {
        // Handle plain text training material
        await apiLocalLLM.post(`/trainings/collection/${COLLECTION_NAME}/text`, { text: data.content }, {
          headers: { 'Content-Type': 'application/json' },
        });
      
      } else if (data.type === 'WEBSITE') {
        // Handle website training material
        await apiLocalLLM.post(`/trainings/collection/${COLLECTION_NAME}/website`, { websiteUrl: data.content });
      
      } else if (data.type === 'VIDEO') {
        if (data.content) {
          // Handle plain URL video training material
          await apiLocalLLM.post(`/trainings/collection/${COLLECTION_NAME}/video`, { mediaUrl: data.content, mediaName: data.name });          

        } else if (data.file) {
          // Handle file upload via FormData
          const formData = new FormData()
          formData.append('file', data.file)

          await apiLocalLLM.post(`/trainings/collection/${COLLECTION_NAME}/file`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });          
        }
      
      }  else {
        throw new Error('Unsupported training material type')
      }

      await get().fetchTrainingsLocalLLM()
    } catch (error) {
      set({ error })
      throw error;
    } finally {
      set({ loadingTrainingLocalLLM: false })
    }
  },

  deleteTrainingLocalLLM: async (id) => {
    set({ loadingLocalLLM: true, error: null })
    try {
      console.log("deleting", id);
      await apiLocalLLM.delete(`/trainings/${id}`)
      console.log("deleted ", id);      
      const updatedTrainings = get().trainingsLocalLLM.filter(
        training => training.idTrainingMaterial !== id
      )
      set({ trainingsLocalLLM: updatedTrainings, loadingLocalLLM: false })

    } catch (error) {
      set({ error: error, loadingLocalLLm: false })
    }
  },
}))
