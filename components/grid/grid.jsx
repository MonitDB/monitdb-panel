import React from 'react'

const Grid = ({ children, className = '', noGap = false, ...properties }) => {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-12 ${
        !noGap ? 'gap-4' : ''
      } ${className}`}
      {...properties}
    >
      {children}
    </div>
  )
}

export default Grid
