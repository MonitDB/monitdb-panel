import classNames from 'classnames'
import React from 'react'

const Textarea = ({ className = '', hasError, ...properties }) => {
  return (
    <textarea
      className={classNames(
        `block w-full h-24 p-2 rounded border border-gray
          text-sm font-normal transition-all duration-150 ease-in-out
          leading-6 focus:shadow-md outline-none md:px-4`,
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

export default Textarea
