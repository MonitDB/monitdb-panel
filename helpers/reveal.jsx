import classNames from 'classnames'
import React, { useCallback, useEffect, useRef } from 'react'

const Reveal = ({ active, children }) => {
  const elementReference = useRef(null)
  const timerReference = useRef(null)

  const updateHeight = useCallback(() => {
    elementReference.current.style.height = active
      ? `${elementReference.current.scrollHeight}px`
      : `0px`
  }, [active])

  useEffect(() => {
    updateHeight()
  }, [updateHeight, active])

  useEffect(() => {
    active
      ? (timerReference.current = setInterval(updateHeight, 500))
      : clearInterval(timerReference.current)
  }, [updateHeight, active])

  useEffect(() => {
    return () => {
      clearInterval(timerReference.current)
    }
  }, [])

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
