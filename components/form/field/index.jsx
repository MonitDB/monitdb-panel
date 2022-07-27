import React from 'react'

import Label from '../label'

const Field = ({
  text = '',
  className = '',
  htmlFor = '',
  children,
  hasError,
  error,
}) => {
  return (
    <div className={`relative ${className}`}>
      {text && <Label htmlFor={htmlFor}>{text}</Label>}
      {children}
      {hasError && error ? (
        <p
          className="absolute -bottom-4 right-0 text-xs lowercase text-danger"
          dangerouslySetInnerHTML={{ __html: error }}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default Field
