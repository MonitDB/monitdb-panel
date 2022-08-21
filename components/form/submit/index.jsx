import React from 'react'

import Cta from '~/components/ui/cta'

const Submit = ({
  children,
  disabled,
  className = '',
  loading = false,
  loadingText = 'Carregando...',
  ...properties
}) => {
  return (
    <Cta
      type="submit"
      disabled={disabled}
      className={`${disabled ? 'opacity-50' : ''} ${className}`}
      {...properties}
    >
      {loading ? loadingText : children}
    </Cta>
  )
}

export default Submit
