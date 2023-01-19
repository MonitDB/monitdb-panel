import React from 'react'

import { AlertsContextProvider } from './alerts'
import { GlobalContextProvider } from './global'
import { UserContextProvider } from './user'

const Contexts = ({ children }) => {
  return (
    <UserContextProvider>
      <GlobalContextProvider>
        <AlertsContextProvider>{children}</AlertsContextProvider>
      </GlobalContextProvider>
    </UserContextProvider>
  )
}

export default Contexts
