import { create } from 'zustand'

/**
 * Quick win — "Abrir no Query Window": ponte entre o chat de IA e o Query Window.
 * O chat guarda aqui o SQL sugerido; o Query Window consome (e limpa) ao montar.
 */
export const usePendingQueryStore = create((set, get) => ({
  pendingQuery: undefined,
  setPendingQuery: (sql) => set({ pendingQuery: sql }),
  consumePendingQuery: () => {
    const q = get().pendingQuery
    set({ pendingQuery: undefined })
    return q
  },
}))
