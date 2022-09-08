import React from 'react'

import Header from '~/components/header'
import ProtectedPage from '~/helpers/protected-page'

const Default = ({ children }) => {
  return (
    <ProtectedPage>
      <Header />
      <main>{children}</main>
    </ProtectedPage>
  )
}

export default Default
