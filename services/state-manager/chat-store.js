import { create } from 'zustand'

import { apiV2 } from '~/utils/client-api'

export const useChatStore = create((set, get) => ({
  chats: [],
  isLoading: false,
  error: undefined,
  searchTerm: '',
  messages: [],
  loadingMessages: '',
  chatId: undefined,
  setLoadingMessages: (loadingMessages) => set({ loadingMessages }),
  setChats: (chats) => set({ chats }),
  setChatId: (chatId) => set({ chatId }),
  setMessages: (updater) =>
    set((state) => ({
      messages:
        typeof updater === 'function' ? updater(state.messages) : updater,
    })),

  loadPreviousMessages: async () => {
    try {
      const chatId = get().chatId
      set({ loadingMessages: chatId, messages: [] })
      if (!chatId) return
      const { data = [] } = await apiV2().get(
        `ai/load-previous-messages/${chatId}`
      )
      set({ messages: data })
    } catch {
      return
    } finally {
      set({ loadingMessages: '' })
    }
  },

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
  deleteChat: async (chatId) => {
    try {
      const updatedChats = get().chats.filter((chat) => chat.id !== chatId)
      set({ chats: updatedChats })
      await apiV2().delete(`ai/delete-chat/${chatId}`)
    } catch (error) {
      set({ error })
    }
  },
}))
