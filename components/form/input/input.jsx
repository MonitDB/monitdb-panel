import classNames from 'classnames'
import React from 'react'

const Input = ({ type = 'text', className = '', hasError, ...properties }) => {
  return (
    <input
      type={type}
      className={classNames(
        `block w-full h-10 px-2 rounded border border-gray
        text-sm font-normal transition-all duration-150 ease-in-out
        focus:shadow-md outline-none md:px-4`,
        className,
        {
          'border-danger border-opacity-50': hasError,
          'border-gray-medium': !hasError,
        }
      )}
      {...properties}
    />
  )
}

export default Input
