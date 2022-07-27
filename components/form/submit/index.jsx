import React from 'react'

const Submit = ({
  children,
  disabled,
  className = '',
  loading = false,
  loadingText = 'Carregando...',
  ...properties
}) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`flex items-center justify-center w-full h-10 rounded font-bold
				bg-primary text-white ${disabled ? 'opacity-50' : ''} ${className}`}
      {...properties}
    >
      {loading ? loadingText : children}
    </button>
  )
}

export default Submit
