import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useChatStore = create((set, get) => ({
  chats: [],
  isLoading: false,
  error: undefined,
  searchTerm: '',

  setSearchTerm: (term) => set({ searchTerm: term }),

  fetchChats: async () => {
    set({ isLoading: true, error: undefined })
    try {
      const { data } = await apiV2().get('ai/chats')
      set({ chats: data, isLoading: false })
    } catch (error) {
      set({ error, isLoading: false })
    }
  },

  renameChat: async (chatId, newTitle) => {
    try {
      await apiV2().put(`ai/rename-chat/${chatId}`, { title: newTitle })

      const updatedChats = get().chats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
      set({ chats: updatedChats })
    } catch (error) {
      set({ error })
    }
  },
}))
