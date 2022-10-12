import classNames from 'classnames'
import React from 'react'

const Label = ({ text = '', className = '', children, ...properties }) => {
  return (
    <label
      className={classNames('relative block font-bold', className)}
      {...properties}
    >
      {text && (
        <span
          className="block mb-1"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
      {children}
    </label>
  )
}

export default Label
