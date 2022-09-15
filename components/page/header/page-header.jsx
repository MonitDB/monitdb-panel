import React from 'react'

import Link from '~/components/link'

const PageHeader = ({ title }) => {
  return (
    <header className="mb-10 text-black">
      {title && <h1 className="heading-lg mb-2">{title}</h1>}
      <ul className="flex items-center space-x-2 text-sm">
        <li>
          <Link href="/dashboard/">Início</Link>
        </li>
        <li className="text-gray">/</li>
        <li>
          <span className="text-gray">{title}</span>
        </li>
      </ul>
    </header>
  )
}

export default PageHeader
