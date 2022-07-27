import React from 'react'

const Label = ({ text = '', children, ...properties }) => {
  return (
    <label className="relative block font-bold" {...properties}>
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
