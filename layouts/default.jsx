import React from 'react'

import Header from '~/components/header'

const Default = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}

export default Default
