import { useEffect, useRef } from 'react'

/**
 *
 * @param func The original, non debounced function (You can pass any number of args to it)
 * @param delay The delay (in ms) for the function to return
 * @returns The debounced function, which will run only if the debounced function has not been called in the last (delay) ms
 */

export function useDebounce(function_, delay = 100) {
  const timer = useRef()

  useEffect(() => {
    return () => {
      if (!timer.current) return
      clearTimeout(timer.current)
    }
  }, [])

  return (...arguments_) => {
    const newTimer = setTimeout(() => {
      function_(...arguments_)
    }, delay)

    clearTimeout(timer.current)
    timer.current = newTimer
  }
}

export default useDebounce
