export const isBrowser = () => typeof window !== 'undefined' //The approach recommended by Next.js

export const scrollToTop = () => {
  if (!isBrowser()) return

  window.scrollTo({ top: 0, behavior: 'smooth' })
}
