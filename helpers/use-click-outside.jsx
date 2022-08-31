import { useEffect, useRef } from 'react'

const useOutsideClick = (callback) => {
  const reference = useRef()

  useEffect(() => {
    const handleClick = (event) => {
      if (reference.current && !reference.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [reference]) // eslint-disable-line react-hooks/exhaustive-deps

  return reference
}

export default useOutsideClick
