import Antd from 'antd'
import React from 'react'

const Button = ({ type, loading, onClick, children, ...properties }) => {
  return (
    <Antd.Button
      type={type}
      onClick={loading ? undefined : onClick}
      disabled={loading}
      {...properties}
      loading={loading}
    >
      {children}
    </Antd.Button>
  )
}

export default Button
