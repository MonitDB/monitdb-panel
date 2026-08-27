import classNames from 'classnames'
import React from 'react'

import Cta from '~/components/ui/cta'

const Submit = ({
  children,
  disabled,
  className = '',
  loading = false,
  loadingText = 'Loading…',
  ...properties
}) => {
  return (
    <Cta
      type="submit"
      disabled={disabled}
      className={classNames(className, {
        'opacity-50': disabled,
      })}
      {...properties}
    >
      {loading ? loadingText : children}
    </Cta>
  )
}

export default Submit
