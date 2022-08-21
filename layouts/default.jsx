import React from 'react'

import Header from '~/components/header'
import Sidebar from '~/components/sidebar'

const Default = ({ children }) => {
  return (
    <>
      <Header />
      <main>
        <div className="relative md:pl-60">
          <Sidebar className="md:fixed md:bottom-0 md:left-0" />
          <div className="">{children}</div>
        </div>
      </main>
    </>
  )
}

export default Default
