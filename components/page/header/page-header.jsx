import React from 'react'

import Link from '~/components/link'

const PageHeader = ({ title }) => {
  return (
    <header className="mb-10 text-black">
      {title && <h1 className="text-3xl font-bold">{title}</h1>}
      <ul className="flex items-center space-x-2 text-sm">
        <li>
          <Link href="/dashboard/">Home</Link>
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
