import React from 'react'

const Button = ({ type, loading, onClick, children, ...properties }) => {
  return (
    <button
      className="btn"
      type={type}
      onClick={loading ? undefined : onClick}
      disabled={loading}
      {...properties}
    >
      {loading ? <span>Loading...</span> : children}
    </button>
  )
}

export default Button
