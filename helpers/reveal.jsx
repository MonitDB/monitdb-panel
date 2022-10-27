import classNames from 'classnames'
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
      className={classNames('transition-all duration-150 ease-in-out', {
        'h-auto': active,
        'overflow-hidden': !active,
      })}
    >
      {children}
    </div>
  )
}

export default Reveal
