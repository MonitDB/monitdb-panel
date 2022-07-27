import React, { useEffect, useState } from 'react'

const Input = ({ type = 'text', className = '', hasError, ...properties }) => {
  const [customClasses, setCustomClasses] = useState('')

  useEffect(() => {
    let classes = `block w-full h-10 px-2 rounded border
			text-sm focus:shadow-md outline-none `

    classes += hasError
      ? 'border-danger border-opacity-50'
      : 'border-gray-medium'

    setCustomClasses(classes)
  }, [setCustomClasses, hasError])

  return (
    <input
      type={type}
      className={`${customClasses} ${className}`}
      {...properties}
    />
  )
}

export default Input
