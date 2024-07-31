import React from 'react'

import { AlertsContextProvider } from './alerts'
import { EventSourceProvider } from './events'
import { GlobalContextProvider } from './global'
// import { ThemeProvider } from './theme'
import { UserContextProvider } from './user'

const Contexts = ({ children }) => {
  return (
    <UserContextProvider>
      <GlobalContextProvider>
        <EventSourceProvider>
          <AlertsContextProvider>{children}</AlertsContextProvider>
        </EventSourceProvider>
      </GlobalContextProvider>
    </UserContextProvider>
  )
}

export default Contexts
