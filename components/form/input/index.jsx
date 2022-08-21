import React from 'react'

const Input = ({ type = 'text', className = '', hasError, ...properties }) => {
  const classes = [
    `block w-full h-10 px-2 rounded border border-gray
    text-sm transition-all duration-150 ease-in-out
    focus:shadow-md outline-none md:px-4`,
    hasError ? 'border-danger border-opacity-50' : 'border-gray-medium',
  ].join(' ')

  return (
    <input type={type} className={`${classes} ${className}`} {...properties} />
  )
}

export default Input
