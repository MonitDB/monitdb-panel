import React from 'react'

import { GlobalContextProvider } from './global'
import { UserContextProvider } from './user'

const Contexts = ({ children }) => {
  return (
    <GlobalContextProvider>
      <UserContextProvider>{children}</UserContextProvider>
    </GlobalContextProvider>
  )
}

export default Contexts
