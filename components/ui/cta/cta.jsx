import React from 'react'

import Link from '~/components/link'

const Cta = ({ className = '', inverse = false, children, ...properties }) => {
  return (
    <Link
      className={[
        'rounded py-3 px-8 inline-flex font-bold lg:hover:bg-blue-light lg:hover:text-white',
        inverse ? 'bg-white text-blue' : 'bg-blue text-white',
        className,
      ].join(' ')}
      {...properties}
    >
      {children}
    </Link>
  )
}

export default Cta
