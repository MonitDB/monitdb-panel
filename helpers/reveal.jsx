import React, { useEffect, useRef } from 'react'

const Reveal = ({ active, children }) => {
  const elementReference = useRef(null)

  useEffect(() => {
    elementReference.current.style.height = active
      ? `${elementReference.current.scrollHeight}px`
      : `0px`
  }, [active])

  return (
    <div
      ref={elementReference}
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        active ? 'h-auto' : ''
      }`}
    >
      {children}
    </div>
  )
}

export default Reveal
